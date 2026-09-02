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

    // Global flash sale is a site-wide % discount (Settings: sale_enabled,
    // sale_discount, sale_ends_at) shown on the product page and product
    // cards — but it was never actually applied when adding to cart or
    // calculating checkout totals. A customer could see "20% off" on a
    // product, add it, and still get charged full price. Shared here so
    // add() and cartItems() can't drift out of sync with each other.
    private function flashSalePrice(float $basePrice): float
    {
        $enabled  = Setting::get('sale_enabled', '0') === '1';
        $discount = (int) Setting::get('sale_discount', '0');
        $endsAt   = Setting::get('sale_ends_at', '');
        $active   = $enabled && $discount > 0
            && (!$endsAt || now()->lt(\Carbon\Carbon::parse($endsAt)));
        return $active ? round($basePrice * (1 - $discount / 100), 2) : $basePrice;
    }

    private function cartItems()
    {
        $items = CartItem::where('session_id', $this->sessionId())
            ->with(['product.productImages'])
            ->get();

        // Keep stored cart prices in sync with the flash sale's current
        // state — handles the sale turning on/off or the discount % changing
        // after an item was already added, without ever discounting a
        // variant-priced item (variants aren't part of this global sale).
        foreach ($items as $item) {
            if ($item->variant_id || !$item->product) continue;
            $correctPrice = $this->flashSalePrice($item->product->price);
            if ((float) $item->price !== $correctPrice) {
                $item->update(['price' => $correctPrice]);
                $item->price = $correctPrice;
            }
        }

        return $items;
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
            // Needed so the frontend can show "Coupon applied: CODE ✕" and
            // let the customer actually remove it — previously only the
            // discount amount was sent, with no code and no way to cancel.
            'coupon_code'     => session('coupon_code'),
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
                // Sync mode: color/size are customer-facing labels only —
                // stock lives once on the product, not per combination.
                $stock        = $product->track_variant_stock ? $variant->stock : $product->stock;
                $variantLabel = $variant->label ?? null;
            }
        } else {
            $price = $this->flashSalePrice($price);
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
        // Same fix as checkout() — was only ever checking the parent
        // product's stock, ignoring variant_id, so increasing quantity on
        // a variant item with real stock could still be wrongly blocked.
        $availableStock = ($item->variant_id && $item->product->track_variant_stock)
            ? (\App\Models\ProductVariant::find($item->variant_id)?->stock ?? 0)
            : $item->product->stock;
        if ($data['quantity'] > $availableStock) return back()->with('error', 'Not enough stock.');
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
            'email'         => 'required|email|max:100',
            'address'       => 'required|string|max:500',
            'city'          => 'required|string|max:100',
            'gateway'       => 'required|string|exists:payment_gateways,code',
            'notes'         => 'nullable|string|max:500',
            'payment_proof' => 'nullable|image|max:10240',
        ]);

        $items = $this->cartItems();
        if ($items->isEmpty()) return back()->with('error', 'Your cart is empty.');

        foreach ($items as $item) {
            // Was only ever checking the parent product's own stock column,
            // completely ignoring variant_id — harmless before, since no
            // product actually had real per-variant stock records. Now that
            // it does, a variant's real stock could be 10 while the parent
            // product's own stock field sits at 0 (never meant to be used
            // once variants exist), failing every single checkout for any
            // variant product regardless of real availability.
            $availableStock = ($item->variant_id && $item->product->track_variant_stock)
                ? (\App\Models\ProductVariant::find($item->variant_id)?->stock ?? 0)
                : $item->product->stock;
            if ($availableStock < $item->quantity)
                return back()->with('error', "\"{$item->product->name}\" only has {$availableStock} units left.");
        }

        // COD doesn't require any real payment to place an order, which makes
        // it the one method someone could abuse to exhaust real stock with
        // fake orders (place, never pay, never collect). Online gateways
        // naturally self-limit this since each attempt needs a real card/
        // wallet. This only blocks *repeated* COD orders from the same phone
        // number in a short window — legitimate customers reordering later
        // are unaffected.
        if ($data['gateway'] === 'cod') {
            $recentCodOrders = Order::where('customer_phone', $data['phone'])
                ->where('payment_method', 'cod')
                ->where('created_at', '>=', now()->subHours(2))
                ->count();
            if ($recentCodOrders >= 3) {
                return back()->with('error', 'Too many orders placed from this number recently. Please contact us directly to complete your order.');
            }
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

        // Without this, the order timeline in admin started completely
        // blank — no record of when the order was actually placed.
        $order->addStatusHistory('pending', 'Order placed by customer', 'customer');

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
        // Stock is reduced only on confirmed online payment (PaymentController::markPaid)
        // or when admin confirms a COD order for shipping (Admin/OrderController::update).
        // Reducing it here — at mere order placement, before any payment or shipping
        // confirmation — let anyone exhaust real stock with fake/abandoned COD orders,
        // and could double-reduce or wrongly reduce stock for online payments that later
        // fail. See BUG 1.1 / BUG 5.1 in the audit.

        // Coupon usage is counted only once this order is genuinely
        // confirmed (online payment succeeds, or admin confirms a COD/bank
        // transfer order) — see Order::countCouponUsage(). Incrementing it
        // here at raw checkout meant a coupon could exhaust itself entirely
        // from abandoned or failed online payments with zero real purchases
        // behind them.
        if ($couponCode) {
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

        // Send all notifications via the real queue — not afterResponse().
        // afterResponse() relies on fastcgi_finish_request() to actually
        // close the connection early, which only exists under PHP-FPM —
        // under `php artisan serve` (the built-in dev server) that function
        // doesn't exist, so the browser likely still waited for the full
        // notification round-trip anyway despite this "fix". A real queued
        // dispatch is genuinely decoupled from the request/response cycle
        // regardless of which web server is running — the HTTP request just
        // inserts a row into the jobs table (fast) and returns immediately;
        // a separate `php artisan queue:work` process picks it up on its
        // own schedule.
        $orderForNotify = $order->fresh();
        dispatch(function () use ($orderForNotify) {
            try {
                (new OrderNotificationService())->notifyNewOrder($orderForNotify);
            } catch (\Throwable $e) {
                \Log::error('Notification failed: ' . $e->getMessage());
            }
        });

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
