<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\OrderStatusMail;
use App\Mail\LowStockAlertMail;
use Illuminate\Support\Facades\Mail;
use App\Models\{Order, OrderReturn, Product, Category, Setting, PaymentGateway};
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    // Dedicated quick-lookup page — searches order number, phone, customer
    // name, AND tracking number (the regular Orders list search doesn't
    // cover tracking number at all), returning full order details
    // immediately rather than requiring a click-through for each one.
    public function lookup(Request $request)
    {
        $results = [];
        if ($term = trim((string) $request->q)) {
            $results = Order::with('items', 'returns')
                ->where(function ($query) use ($term) {
                    $query->where('id', 'like', "%{$term}%")
                        ->orWhere('order_number', 'like', "%{$term}%")
                        ->orWhere('customer_name', 'like', "%{$term}%")
                        ->orWhere('customer_phone', 'like', "%{$term}%")
                        ->orWhere('tracking_number', 'like', "%{$term}%")
                        ->orWhere('courier', 'like', "%{$term}%");
                })
                ->latest()
                ->limit(25)
                ->get();
        }

        return Inertia::render('Admin/Orders/Lookup', [
            'results' => $results,
            'query'   => $request->q,
        ]);
    }

    public function index(Request $request)
    {
        $q = Order::with('items')->latest();
        if ($status = $request->status) $q->where('status', $status);
        if ($search = $request->q) {
            $q->where(function($query) use ($search) {
                $query->where('id','like',"%{$search}%")
                      ->orWhere('customer_name','like',"%{$search}%")
                      ->orWhere('customer_phone','like',"%{$search}%");
            });
        }
        // One query for all 5 counts instead of 5 separate COUNT queries on
        // every single load of the admin orders page.
        $statusCounts = Order::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        return Inertia::render('Admin/Orders/Index', [
            'orders'  => $q->paginate(20)->withQueryString(),
            'filters' => $request->only(['q','status']),
            'stats'   => [
                'pending'    => $statusCounts['pending']    ?? 0,
                'processing' => $statusCounts['processing'] ?? 0,
                'shipped'    => $statusCounts['shipped']    ?? 0,
                'delivered'  => $statusCounts['delivered']  ?? 0,
                'cancelled'  => $statusCounts['cancelled']  ?? 0,
            ],
        ]);
    }

    public function show(Order $order)
    {
        return Inertia::render('Admin/Orders/Show', [
            'order' => $order->load('items.product','returns'),
        ]);
    }

    public function update(Request $request, Order $order)
    {
        $oldStatus = $order->status;
        $oldPaymentStatus = $order->payment_status;
        $data = $request->validate([
            'status'         => 'sometimes|in:pending,processing,shipped,delivered,cancelled',
            'payment_status' => 'sometimes|in:pending,paid,failed,refunded',
            'notes'           => 'sometimes|nullable|string',
            'admin_notes'     => 'sometimes|nullable|string',
            'tracking_number' => 'sometimes|nullable|string|max:100',
            'courier'         => 'sometimes|nullable|string|max:50',
            'cancelled_reason'=> 'sometimes|nullable|string|max:255',
        ]);

        $order->update($data);
        \App\Models\ActivityLog::log(
            'order.updated',
            'Order ' . ($order->order_number ?? '#'.$order->id) . ' updated',
            'info', $order,
            ['status' => $oldStatus],
            array_filter($data)
        );

        // Inventory management on status change
        $newStatus = $data['status'] ?? $oldStatus;

        // COD: reduce stock only once the admin actually confirms the order
        // for shipping — not at placement. reduceStock() is idempotent so
        // this is safe even if triggered on more than one transition.
        if (
            $order->payment_method === 'cod' &&
            in_array($newStatus, ['processing', 'shipped']) &&
            !in_array($oldStatus, ['processing', 'shipped', 'delivered'])
        ) {
            $order->load('items.product');
            $order->reduceStock();
            $order->countCouponUsage();
        }

        // Bank transfer: reduce stock when admin manually confirms payment
        if (
            $order->payment_method === 'bank_transfer' &&
            $newStatus === 'processing' &&
            ($data['payment_status'] ?? $order->payment_status) === 'paid'
        ) {
            $order->load('items.product');
            $order->reduceStock();
            $order->countCouponUsage();
        }

        // If cancelled after being active, restore whatever was actually reduced
        if ($newStatus === 'cancelled' && !in_array($oldStatus, ['cancelled'])) {
            $order->load('items.product');
            $order->restoreStock();
        }

        // ── Notifications + loyalty on status change ────────────────
        $newStatus = $data['status'] ?? $oldStatus;
        if (isset($data['status']) && $newStatus !== $oldStatus) {
            // Was never actually logged from here — the order timeline in
            // admin has been blank this whole time despite the underlying
            // model method already existing.
            $order->addStatusHistory($newStatus, $request->input('status_note'), auth()->user()->name);
            $freshOrder = $order->fresh();

            // Unified: Email + WhatsApp + SMS via NotificationService —
            // dispatched to the real queue, not afterResponse(). That relies
            // on fastcgi_finish_request(), which only exists under PHP-FPM —
            // under `php artisan serve` it doesn't exist, so the admin panel
            // likely still waited for the full notification round-trip
            // anyway. A real queued dispatch is genuinely decoupled from the
            // request/response cycle regardless of web server — the request
            // just inserts a row into the jobs table and returns
            // immediately; `php artisan queue:work` picks it up separately.
            dispatch(function () use ($freshOrder, $newStatus) {
                try {
                    (new \App\Services\OrderNotificationService())->notifyStatusChange($freshOrder, $newStatus);
                } catch (\Throwable $e) {
                    \Log::error("Notification failed: " . $e->getMessage());
                }
            });

            // Award loyalty points when payment is actually confirmed
            // received ("paid"), not on delivery — delivery can take days
            // or weeks after payment, and the customer has already
            // genuinely paid at that point regardless of shipping status.
            // Guarded by the OLD payment status too, so re-saving an order
            // that's already paid doesn't award points a second time.
            $newPaymentStatus = $data['payment_status'] ?? $oldPaymentStatus;
            if ($newPaymentStatus === 'paid' && $oldPaymentStatus !== 'paid' && $freshOrder->user_id
                && \App\Models\Setting::get('loyalty_enabled', '1') === '1') {
                try {
                    $user = \App\Models\User::find($freshOrder->user_id);
                    if ($user) {
                        $rate = (int)(\App\Models\Setting::get('loyalty_points_rate', 10) ?: 10);
                        $pts  = (int)floor($freshOrder->total / $rate);
                        if ($pts > 0) {
                            // Parameter order was wrong (string passed where the
                            // signature expects int $points first) — this threw a
                            // hard TypeError on every delivered order for a
                            // logged-in customer, meaning points were never
                            // actually awarded successfully.
                            $user->addPoints($pts, 'Earned for order '.($freshOrder->order_number ?? '#'.$freshOrder->id), $freshOrder->id);
                        }
                    }
                } catch (\Throwable $e) {
                    \Log::warning("Loyalty points failed: " . $e->getMessage());
                }
            }
        }

        // ── Update timestamps ─────────────────────────────────────────
        if ($newStatus === 'shipped' && $oldStatus !== 'shipped') {
            $order->update(['shipped_at' => now()]);
        }
        if ($newStatus === 'delivered' && $oldStatus !== 'delivered') {
            $order->update(['delivered_at' => now()]);
        }
        if ($newStatus === 'cancelled' && $oldStatus !== 'cancelled') {
            $order->update(['cancelled_at' => now()]);
        }

        return back()->with('success', 'Order updated.' . ($order->customer_email && isset($data['status']) && $newStatus !== $oldStatus ? ' Email sent to customer.' : ''));
    }

    public function destroy(Order $order)
    {
        // Restore stock if order was active
        if (!in_array($order->status, ['cancelled', 'delivered'])) {
            $order->load('items.product');
            $order->restoreStock();
        }
        $order->delete();
        return back()->with('success', 'Order deleted.');
    }

    // ── MANUAL ORDER from admin (WhatsApp orders) ──
    public function createManual()
    {
        return Inertia::render('Admin/Orders/Create', [
            'products'  => Product::active()->with('productImages')->orderBy('name')->get(),
            'gateways'  => PaymentGateway::orderBy('sort_order')->get(),
            'settings'  => Setting::allKeyed(),
        ]);
    }

    public function storeManual(Request $request)
    {
        $data = $request->validate([
            'customer_name'    => 'required|string|max:100',
            'customer_phone'   => 'required|string|max:20',
            'customer_email'   => 'nullable|email',
            'customer_address' => 'required|string',
            'payment_method'   => 'required|string',
            'payment_status'   => 'required|in:pending,paid,failed',
            'status'           => 'required|in:pending,processing,shipped,delivered',
            'notes'            => 'nullable|string',
            'items'            => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity'   => 'required|integer|min:1',
            'items.*.price'      => 'required|numeric|min:0',
        ]);

        $subtotal = collect($data['items'])->sum(fn($i) => $i['price'] * $i['quantity']);
        $shipping = (float) Setting::get('shipping_fee', '0');
        $total    = $subtotal + $shipping;

        $order = Order::create([
            'customer_name'    => $data['customer_name'],
            'customer_phone'   => $data['customer_phone'],
            'customer_email'   => $data['customer_email'] ?? null,
            'customer_address' => $data['customer_address'],
            'payment_method'   => $data['payment_method'],
            'payment_status'   => $data['payment_status'],
            'status'           => $data['status'],
            'notes'            => ($data['notes'] ?? '') . ' [Manual order by admin]',
            'subtotal'         => $subtotal,
            'shipping'         => $shipping,
            'total'            => $total,
        ]);

        foreach ($data['items'] as $item) {
            $product = Product::find($item['product_id']);
            $order->items()->create([
                'product_id'   => $product->id,
                'product_name' => $product->name,
                'price'        => $item['price'],
                'quantity'     => $item['quantity'],
                'subtotal'     => $item['price'] * $item['quantity'],
            ]);
        }

        // Only reduce stock if this manual order is genuinely confirmed
        // already (paid, or already progressed past pending) — a staff
        // member creating a speculative/unconfirmed order (e.g. "pending"
        // while waiting on a customer to confirm by phone) shouldn't lock up
        // real stock any more than an unconfirmed customer checkout should.
        if ($data['payment_status'] === 'paid' || in_array($data['status'], ['processing', 'shipped', 'delivered'])) {
            $order->load('items.product');
            $order->reduceStock();
        }

        return redirect()->route('admin.orders.show', $order)->with('success', 'Manual order created.');
    }

    // ── RETURNS ──
    public function storeReturn(Request $request, Order $order)
    {
        $data = $request->validate([
            'order_item_id' => 'required|exists:order_items,id',
            'quantity'      => [
                'required', 'integer', 'min:1',
                // Without this, admin could accidentally enter a return
                // quantity larger than what was actually ordered.
                function ($attribute, $value, $fail) use ($request) {
                    $item = \App\Models\OrderItem::find($request->order_item_id);
                    if ($item && $value > $item->quantity) {
                        $fail("Return quantity cannot exceed original order quantity of {$item->quantity}.");
                    }
                },
            ],
            'reason'        => 'required|string|max:200',
            'notes'         => 'nullable|string',
            'refund_method' => 'required|in:original,store_credit,cash,none',
            'refund_amount' => 'required|numeric|min:0',
            'restock'       => 'boolean',
        ]);

        $return = $order->returns()->create(array_merge($data, [
            'status'       => 'approved',
            'processed_by' => auth()->id(),
            'processed_at' => now(),
        ]));

        // Restore stock if restock = true
        if ($data['restock']) {
            $item = $order->items()->find($data['order_item_id']);
            if ($item?->product) {
                $item->product->increment('stock', $data['quantity']);
                $item->product->decrement('stock_sold', min($data['quantity'], $item->product->stock_sold));
            }
        }

        // Update order return_status
        $order->update(['return_status' => 'returned']);
        if ($data['refund_method'] !== 'none') {
            $order->update(['payment_status' => 'refunded']);
        }

        return back()->with('success', 'Return processed successfully.');
    }

    // ── PDF INVOICE ──
    public function invoice(Order $order)
    {
        $order->load('items');
        $html = view('pdf.invoice', [
            'order'      => $order,
            'storeName'  => Setting::get('site_name', 'Our Store'),
            'storePhone' => Setting::get('phone', ''),
            'storeEmail' => Setting::get('email', ''),
        ])->render();

        if (class_exists(\Barryvdh\DomPDF\Facade\Pdf::class)) {
            $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadHTML($html);
            return $pdf->download("invoice-{$order->id}.pdf");
        }

        return response($html)->header('Content-Type', 'text/html');
    }
}
