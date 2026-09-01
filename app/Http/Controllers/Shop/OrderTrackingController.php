<?php
namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\{Order, Setting};
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderTrackingController extends Controller
{
    // Public tracking page — no login required
    public function index()
    {
        return Inertia::render('Shop/TrackOrder', [
            'settings' => Setting::allKeyed(),
        ]);
    }

    public function track(Request $request)
    {
        $data = $request->validate([
            'query' => 'required|string|min:3|max:100',
        ]);

        $query = strtoupper(trim($data['query']));

        // Search by tracking token, order number, or phone — deliberately
        // NOT by raw numeric order ID. That was searchable too before, and
        // unlike a phone number (something the actual customer knows),
        // sequential integers are trivially enumerable with zero customer
        // knowledge required — id=1, id=2, id=3... would pull every order
        // in the store. Phone search is kept for legitimate UX (customers
        // who've lost their tracking link) and is already throttled at the
        // route level (10 attempts/min per IP).
        $order = Order::with(['items.product.productImages', 'statusHistory'])
            ->where(function($q) use ($query) {
                $q->where('tracking_token', $query)
                  ->orWhere('order_number', $query)
                  ->orWhere('customer_phone', $query);
            })
            ->latest()
            ->first();

        if (!$order) {
            return back()->with('tracking_error', 'No order found. Please check your tracking number or phone.');
        }

        return back()->with('tracking_result', $this->formatOrder($order));
    }

    // Direct link: /track/{token}
    public function show(string $token)
    {
        $order = Order::with(['items.product.productImages', 'statusHistory'])
            ->where('tracking_token', $token)
            ->firstOrFail();

        return Inertia::render('Shop/TrackOrder', [
            'order'    => $this->formatOrder($order),
            'settings' => Setting::allKeyed(),
        ]);
    }

    private function formatOrder(Order $order): array
    {
        $steps = [
            ['key' => 'pending',    'label' => 'Order Placed',  'icon' => 'bag'],
            ['key' => 'processing', 'label' => 'Processing',    'icon' => 'gear'],
            ['key' => 'shipped',    'label' => 'Shipped',       'icon' => 'truck'],
            ['key' => 'delivered',  'label' => 'Delivered',     'icon' => 'check'],
        ];

        $statusOrder = ['pending' => 0, 'processing' => 1, 'shipped' => 2, 'delivered' => 3];
        $currentStep = $statusOrder[$order->status] ?? 0;

        return [
            'id'             => $order->id,
            'tracking_token' => $order->tracking_token,
            'customer_name'  => $order->customer_name,
            // Only first 2 and last 1 digit shown now (was first 4 + last 2
            // — on an 11-digit PK number that left only 5 digits actually
            // hidden, not much of a mask at all).
            'customer_phone' => substr($order->customer_phone, 0, 2) . str_repeat('*', max(strlen($order->customer_phone) - 3, 3)) . substr($order->customer_phone, -1),
            'status'         => $order->status,
            'payment_status' => $order->payment_status,
            'payment_method' => $order->payment_method,
            'subtotal'       => $order->subtotal,
            'shipping'       => $order->shipping,
            'discount'       => $order->discount ?? 0,
            'total'          => $order->total,
            'created_at'     => $order->created_at->format('M d, Y h:i A'),
            'current_step'   => $currentStep,
            'steps'          => array_map(fn($s, $i) => [
                ...$s,
                'done'   => $i <= $currentStep && $order->status !== 'cancelled',
                'active' => $i === $currentStep && $order->status !== 'cancelled',
            ], $steps, array_keys($steps)),
            'cancelled' => $order->status === 'cancelled',
            'items' => $order->items->map(fn($item) => [
                'name'          => $item->product_name,
                'variant_label' => $item->variant_label ?? null,
                'quantity'      => $item->quantity,
                'price'         => $item->price,
                'subtotal'      => $item->subtotal,
                'image'         => $item->product?->productImages->first()?->url,
            ])->toArray(),
            'history' => $order->statusHistory->map(fn($h) => [
                'status'     => $h->status,
                'note'       => $h->note,
                'created_by' => $h->created_by,
                'date'       => \Carbon\Carbon::parse($h->created_at)->format('M d, Y h:i A'),
            ])->toArray(),
        ];
    }
}
