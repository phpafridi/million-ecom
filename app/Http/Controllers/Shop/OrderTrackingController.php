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

        // Search by tracking token OR order ID OR phone
        $order = Order::with(['items.product.productImages', 'statusHistory'])
            ->where(function($q) use ($query) {
                $q->where('tracking_token', $query)
                  ->orWhere('order_number', $query)
                  ->orWhere('id', is_numeric($query) ? $query : 0)
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
            'customer_phone' => substr($order->customer_phone, 0, 4) . '****' . substr($order->customer_phone, -2),
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
                'name'     => $item->product_name,
                'quantity' => $item->quantity,
                'price'    => $item->price,
                'subtotal' => $item->subtotal,
                'image'    => $item->product?->productImages->first()?->url,
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
