<?php
namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\{CartItem, Product, ProductVariant, PaymentGateway, Setting, Order, Coupon, User};
use App\Services\OrderNotificationService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    private function sessionId(): string { return session()->getId(); }

    private function cartItems()
    {
        return CartItem::where('session_id', $this->sessionId())
            ->with(['product.productImages'])
            ->get();
    }

    public function index()
    {
        $items     = $this->cartItems();
        $subtotal  = $items->sum('subtotal');
        $threshold = (float) Setting::get('delivery_threshold', '0');
        $shipping  = $threshold > 0 && $subtotal >= $threshold ? 0 : (float) Setting::get('shipping_fee', '0');

        // Loyalty
        $user           = auth()->user();
        $loyaltyEnabled = Setting::get('loyalty_enabled', '1') === '1';
        $redeemEnabled  = Setting::get('loyalty_redeem_enabled', '1') === '1';
        $loyaltyPoints  = ($user && $loyaltyEnabled) ? (int)$user->loyalty_points : 0;
        $loyaltyValue   = round($loyaltyPoints / 100 * 10, 2);
        $pointsUsed     = ($user && $redeemEnabled && session('loyalty_points_used'))
            ? min((int)session('loyalty_points_used'), $loyaltyPoints) : 0;
        $pointsDiscount = $pointsUsed > 0 ? min(round($pointsUsed / 100 * 10, 2), $subtotal * 0.5) : 0;
        $couponDiscount = (float)session('coupon_discount', 0);
        $totalDiscount  = $couponDiscount + $pointsDiscount;
        $finalTotal     = max(0, $subtotal + $shipping - $totalDiscount);

        return Inertia::render('Shop/Cart', [
            'items' => $items->map(fn($i) => [
                'id'      => $i->id,
                'product' => [
                    'id'    => $i->product->id,
                    'name'  => $i->product->name,
                    'slug'  => $i->product->slug,
                    'price' => $i->product->price,
                    'stock' => $i->product->stock,
                    'image' => $i->product->productImages->first()?->url,
                ],
                'variant_label' => $i->variant_label ?? null,
                'quantity'      => $i->quantity,
                'price'         => $i->price,
                'subtotal'      => $i->subtotal,
            ]),
            'subtotal'        => $subtotal,
            'shipping'        => $shipping,
            'total'           => $finalTotal,
            'discount'        => $totalDiscount,
            'points_discount' => $pointsDiscount,
            'coupon_discount' => $couponDiscount,
            'loyalty_points'  => $loyaltyPoints,
            'loyalty_value'   => $loyaltyValue,
            'points_used'     => $pointsUsed,
            'loyalty_enabled' => $loyaltyEnabled,
            'redeem_enabled'  => $redeemEnabled,
            'gateways' => PaymentGateway::where('is_enabled', true)->orderBy('sort_order')->get()
                ->map(fn($g) => [
                    'id'           => $g->id,
                    'code'         => $g->code,
                    'name'         => $g->name,
                    'instructions' => $g->instructions,
                    'logo'         => $g->logo,
                    'is_enabled'   => $g->is_enabled,
                    'bank_details' => $g->code === 'bank_transfer' ? ($g->credentials ?? []) : null,
                ]),
            'settings'    => Setting::allKeyed(),
            'user_profile' => $user ? [
                'name'    => $user->name,
                'email'   => $user->email,
                'phone'   => $user->phone ?? '',
                'address' => $user->address ?? '',
                'city'    => $user->city ?? '',
            ] : null,
        ]);
    }

    public function add(Request $request)
    {
        $data = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity'   => 'integer|min:1|max:100',
            'variant_id' => 'nullable|integer',
        ]);

        $product      = Product::findOrFail($data['product_id']);
        $qty          = (int)($data['quantity'] ?? 1);
        $sid          = $this->sessionId();
        $variantId    = $data['variant_id'] ?? null;
        $price        = $product->price;
        $variantLabel = null;
        $stock        = $product->stock;

        if ($variantId) {
            $variant = ProductVariant::find($variantId);
            if ($variant) {
                $price        = $variant->price ?? $product->price;
                $stock        = $variant->stock;
                $variantLabel = $variant->label ?? null;
            }
        }

        if ($stock < $qty) return back()->with('error', 'Not enough stock available.');

        $existing = CartItem::where('session_id', $sid)
            ->where('product_id', $product->id)
            ->where('variant_id', $variantId)
            ->first();

        if ($existing) {
            $existing->update(['quantity' => min($existing->quantity + $qty, $stock)]);
        } else {
            CartItem::create([
                'session_id'    => $sid,
                'product_id'    => $product->id,
                'variant_id'    => $variantId,
                'variant_label' => $variantLabel,
                'quantity'      => $qty,
                'price'         => $price,
            ]);
        }

        return back()->with('success', 'Added to cart!');
    }

    public function update(Request $request, int $id)
    {
        $data = $request->validate(['quantity' => 'required|integer|min:1|max:100']);
        $item = CartItem::where('id', $id)->where('session_id', $this->sessionId())->firstOrFail();
        if ($data['quantity'] > $item->product->stock) return back()->with('error', 'Not enough stock.');
        $item->update(['quantity' => $data['quantity']]);
        return back();
    }

    public function destroy(int $id)
    {
        CartItem::where('id', $id)->where('session_id', $this->sessionId())->delete();
        return back()->with('success', 'Item removed.');
    }

    public function redeemPoints(Request $request)
    {
        if (!auth()->check()) return back()->with('error', 'Please login to use loyalty points.');
        if (Setting::get('loyalty_redeem_enabled', '1') !== '1')
            return back()->with('error', 'Points redemption is currently disabled.');
        $user   = auth()->user();
        $points = min((int)$request->points, (int)$user->loyalty_points);
        if ($points <= 0) return back()->with('error', 'No loyalty points to redeem.');
        session(['loyalty_points_used' => $points]);
        return back()->with('success', 'Rs ' . round($points / 100 * 10, 2) . ' discount applied using ' . $points . ' points!');
    }

    public function removePoints()
    {
        session()->forget('loyalty_points_used');
        return back();
    }

    public function applyCoupon(Request $request)
    {
        $code   = strtoupper(trim($request->code ?? ''));
        $coupon = Coupon::active()->where('code', $code)->first();
        if (!$coupon || !$coupon->isValid())
            return back()->with('coupon_error', 'Invalid or expired coupon code.');
        $subtotal = $this->cartItems()->sum('subtotal');
        if ($subtotal < $coupon->min_order)
            return back()->with('coupon_error', 'Minimum order of Rs ' . number_format($coupon->min_order) . ' required.');
        // Logged-in users can be checked now; guests get the final check at
        // checkout once their email is known.
        if (auth()->check() && $coupon->reachedPerUserLimit(auth()->id(), auth()->user()->email))
            return back()->with('coupon_error', 'You\'ve already used this coupon the maximum number of times.');
        $discount = $coupon->calculateDiscount($subtotal);
        session(['coupon_code' => $code, 'coupon_discount' => $discount]);
        return back()->with('coupon_success', 'Coupon applied! You save Rs ' . number_format($discount));
    }

    public function removeCoupon()
    {
        session()->forget(['coupon_code', 'coupon_discount']);
        return back();
    }

    public function checkout(Request $request)
    {
        $data = $request->validate([
            'name'          => 'required|string|max:100',
            'phone'         => 'required|string|max:20',
            'email'         => 'nullable|email|max:100',
            'address'       => 'required|string|max:500',
            'city'          => 'required|string|max:100',
            'gateway'       => 'required|string|exists:payment_gateways,code',
            'notes'         => 'nullable|string|max:500',
            'payment_proof' => 'nullable|image|max:10240',
        ]);

        $items = $this->cartItems();
        if ($items->isEmpty()) return back()->with('error', 'Your cart is empty.');

        foreach ($items as $item) {
            if ($item->product->stock < $item->quantity)
                return back()->with('error', "\"{$item->product->name}\" only has {$item->product->stock} units left.");
        }

        $user      = auth()->user();
        $subtotal  = $items->sum('subtotal');
        $threshold = (float) Setting::get('delivery_threshold', '0');
        $shipping  = $threshold > 0 && $subtotal >= $threshold ? 0 : (float) Setting::get('shipping_fee', '0');

        // Coupon discount
        $couponCode     = session('coupon_code');
        $couponDiscount = (float)session('coupon_discount', 0);
        if ($couponCode) {
            $coupon = Coupon::active()->where('code', $couponCode)->first();
            if (!$coupon || !$coupon->isValid()) {
                $couponCode = null; $couponDiscount = 0;
            } elseif ($coupon->reachedPerUserLimit(auth()->id(), $data['email'] ?? $user?->email ?? null)) {
                // Per-customer limit enforced here (final safety check, using the
                // email just entered) since a guest's email isn't known yet at
                // the "apply coupon" step on the cart page.
                $couponCode = null; $couponDiscount = 0;
            }
        }

        // Loyalty points discount
        $redeemEnabled  = Setting::get('loyalty_redeem_enabled', '1') === '1';
        $pointsUsed     = ($user && $redeemEnabled && session('loyalty_points_used'))
            ? min((int)session('loyalty_points_used'), (int)$user->loyalty_points) : 0;
        $pointsDiscount = $pointsUsed > 0 ? min(round($pointsUsed / 100 * 10, 2), $subtotal * 0.5) : 0;

        $discount = $couponDiscount + $pointsDiscount;
        $total    = max(0, $subtotal + $shipping - $discount);

        $order = Order::create([
            'user_id'          => auth()->id(),
            'customer_name'    => $data['name'],
            'customer_phone'   => $data['phone'],
            'customer_email'   => $data['email'] ?? $user?->email ?? null,
            'customer_address' => $data['address'] . ', ' . $data['city'],
            'city'             => $data['city'],
            'payment_method'   => $data['gateway'],
            'notes'            => $data['notes'] ?? null,
            'coupon_code'      => $couponCode ?? null,
            'discount'         => $discount,
            'subtotal'         => $subtotal,
            'shipping'         => $shipping,
            'total'            => max(0, $total),
            'status'           => 'pending',
            'payment_status'   => 'pending',
        ]);

        foreach ($items as $item) {
            $order->items()->create([
                'product_id'    => $item->product_id,
                'product_name'  => $item->product->name,
                'variant_label' => $item->variant_label ?? null,
                'price'         => $item->price,
                'quantity'      => $item->quantity,
                'subtotal'      => $item->subtotal,
            ]);
        }

        if ($request->hasFile('payment_proof')) {
            $path = $request->file('payment_proof')->store('payment-proofs', 'uploads');
            $order->update(['payment_proof' => '/uploads/' . $path]);
        }

        $order->load('items.product');
        $order->reduceStock();

        // Coupon usage
        if ($couponCode) {
            Coupon::where('code', $couponCode)->increment('used_count');
            session()->forget(['coupon_code', 'coupon_discount']);
        }

        // Deduct loyalty points
        if ($user && $pointsUsed > 0) {
            $user->redeemPoints(
                $pointsUsed,
                'Redeemed for order ' . ($order->order_number ?? '#' . $order->id),
                $order->id
            );
            session()->forget('loyalty_points_used');
        }

        // Clear cart
        CartItem::where('session_id', $this->sessionId())->delete();

        // Send all notifications — deferred to run AFTER the HTTP response is
        // already sent to the browser. Previously this ran inline and blocked
        // the whole checkout on 1-2 real SMTP round-trips (plus WhatsApp/SMS
        // API calls if enabled) before the customer ever saw the confirmation
        // page. Using afterResponse() means the redirect happens immediately;
        // the emails/WhatsApp/SMS still send, just invisibly in the background
        // within the same request lifecycle — no queue worker needed.
        $orderForNotify = $order->fresh();
        dispatch(function () use ($orderForNotify) {
            try {
                (new OrderNotificationService())->notifyNewOrder($orderForNotify);
            } catch (\Throwable $e) {
                \Log::error('Notification failed: ' . $e->getMessage());
            }
        })->afterResponse();

        $gatewayCode = $data['gateway'];
        if (in_array($gatewayCode, ['cod', 'bank_transfer'])) {
            return redirect()->route('order.confirmed', ['id' => $order->id]);
        }

        $paymentRoutes = [
            'payfast'     => 'payment.payfast',
            'jazzcash'    => 'payment.jazzcash',
            'easypaisa'   => 'payment.easypaisa',
            'stripe'      => 'payment.stripe',
            'paypal'      => 'payment.paypal',
        ];

        if (isset($paymentRoutes[$gatewayCode])) {
            return redirect()->route($paymentRoutes[$gatewayCode], $order->id);
        }

        return redirect()->route('order.confirmed', ['id' => $order->id]);
    }
}
