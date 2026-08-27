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
        return Inertia::render('Admin/Orders/Index', [
            'orders'  => $q->paginate(20)->withQueryString(),
            'filters' => $request->only(['q','status']),
            'stats'   => [
                'pending'    => Order::where('status','pending')->count(),
                'processing' => Order::where('status','processing')->count(),
                'shipped'    => Order::where('status','shipped')->count(),
                'delivered'  => Order::where('status','delivered')->count(),
                'cancelled'  => Order::where('status','cancelled')->count(),
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

        // If cancelled after being active, restore stock
        if ($newStatus === 'cancelled' && !in_array($oldStatus, ['cancelled'])) {
            $order->load('items.product');
            $order->restoreStock();
        }

        // ── Notifications + loyalty on status change ────────────────
        $newStatus = $data['status'] ?? $oldStatus;
        if (isset($data['status']) && $newStatus !== $oldStatus) {
            $freshOrder = $order->fresh();

            // Unified: Email + WhatsApp + SMS via NotificationService
            try {
                (new \App\Services\OrderNotificationService())->notifyStatusChange($freshOrder, $newStatus);
            } catch (\Throwable $e) {
                \Log::error("Notification failed: " . $e->getMessage());
            }

            // Award loyalty points on DELIVERY only
            if ($newStatus === 'delivered' && $freshOrder->user_id
                && \App\Models\Setting::get('loyalty_enabled', '1') === '1') {
                try {
                    $user = \App\Models\User::find($freshOrder->user_id);
                    if ($user) {
                        $rate = (int)(\App\Models\Setting::get('loyalty_points_rate', 10) ?: 10);
                        $pts  = (int)floor($freshOrder->total / $rate);
                        if ($pts > 0) {
                            $user->addPoints('Earned for delivered order '.($freshOrder->order_number??'#'.$freshOrder->id), $freshOrder->id, $pts);
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

        // Reduce stock for manual orders too
        $order->load('items.product');
        $order->reduceStock();

        return redirect()->route('admin.orders.show', $order)->with('success', 'Manual order created.');
    }

    // ── RETURNS ──
    public function storeReturn(Request $request, Order $order)
    {
        $data = $request->validate([
            'order_item_id' => 'required|exists:order_items,id',
            'quantity'      => 'required|integer|min:1',
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
            'storeName'  => Setting::get('site_name', 'Tijar Store'),
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
