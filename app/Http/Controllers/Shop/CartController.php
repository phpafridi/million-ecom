<?php
namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\{CartItem, Product, PaymentGateway, Setting, Order, Coupon};
use App\Mail\{OrderConfirmedMail, NewOrderAdminMail};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class CartController extends Controller
{
    private function sessionId(): string { return session()->getId(); }

    private function cartItems()
    {
        return CartItem::where('session_id', $this->sessionId())
            ->with('product.productImages')
            ->get();
    }

    public function index()
    {
        $items     = $this->cartItems();
        $subtotal  = $items->sum('subtotal');
        $threshold = (float) Setting::get('delivery_threshold', '0');
        $shipping  = $threshold > 0 && $subtotal >= $threshold ? 0 : (float) Setting::get('shipping_fee', '0');

        return Inertia::render('Shop/Cart', [
            'items'    => $items->map(fn($i) => [
                'id'      => $i->id,
                'product' => [
                    'id'    => $i->product->id,
                    'name'  => $i->product->name,
                    'slug'  => $i->product->slug,
                    'price' => $i->product->price,
                    'stock' => $i->product->stock,
                    'image' => $i->product->productImages->first()?->url,
                ],
                'quantity' => $i->quantity,
                'price'    => $i->price,
                'subtotal' => $i->subtotal,
            ]),
            'subtotal'   => $subtotal,
            'shipping'   => $shipping,
            'total'      => $subtotal + $shipping,
            'gateways'   => PaymentGateway::where('is_enabled', true)->orderBy('sort_order')->get()
                ->map(fn($g) => [
                    'id'           => $g->id,
                    'code'         => $g->code,
                    'name'         => $g->name,
                    'instructions' => $g->instructions,
                    'logo'         => $g->logo,
                    'is_enabled'   => $g->is_enabled,
                    // Only expose bank credentials (not API keys) to frontend
                    'bank_details' => $g->code === 'bank_transfer' ? ($g->credentials ?? []) : null,
                ]),
            'settings'   => Setting::allKeyed(),
        ]);
    }

    public function add(Request $request)
    {
        $data    = $request->validate(['product_id'=>'required|exists:products,id','quantity'=>'integer|min:1|max:100']);
        $product = Product::findOrFail($data['product_id']);
        $qty     = (int)($data['quantity'] ?? 1);
        $sid     = $this->sessionId();

        if ($product->stock < $qty) {
            return back()->with('error', 'Not enough stock available.');
        }

        $existing = CartItem::where('session_id', $sid)->where('product_id', $product->id)->first();
        if ($existing) {
            $existing->update(['quantity' => min($existing->quantity + $qty, $product->stock)]);
        } else {
            CartItem::create(['session_id'=>$sid,'product_id'=>$product->id,'quantity'=>$qty,'price'=>$product->price]);
        }

        return back()->with('success', 'Added to cart!');
    }

    public function update(Request $request, int $id)
    {
        $data = $request->validate(['quantity'=>'required|integer|min:1|max:100']);
        $item = CartItem::where('id',$id)->where('session_id',$this->sessionId())->firstOrFail();
        if ($data['quantity'] > $item->product->stock) return back()->with('error','Not enough stock.');
        $item->update(['quantity'=>$data['quantity']]);
        return back()->with('success','Cart updated.');
    }

    public function destroy(int $id)
    {
        CartItem::where('id',$id)->where('session_id',$this->sessionId())->delete();
        return back()->with('success','Item removed.');
    }

    public function applyCoupon(Request $request)
    {
        $code   = strtoupper(trim($request->code ?? ''));
        $coupon = Coupon::active()->where('code', $code)->first();

        if (!$coupon || !$coupon->isValid()) {
            return back()->with('coupon_error', 'Invalid or expired coupon code.');
        }

        $items    = $this->cartItems();
        $subtotal = $items->sum('subtotal');

        if ($subtotal < $coupon->min_order) {
            return back()->with('coupon_error', "Minimum order of Rs " . number_format($coupon->min_order) . " required.");
        }

        $discount = $coupon->calculateDiscount($subtotal);
        session(['coupon_code' => $code, 'coupon_discount' => $discount]);

        return back()->with('coupon_success', "Coupon applied! You save Rs " . number_format($discount));
    }

    public function removeCoupon()
    {
        session()->forget(['coupon_code', 'coupon_discount']);
        return back()->with('success', 'Coupon removed.');
    }

    public function checkout(Request $request)
    {
        $data = $request->validate([
            'name'           => 'required|string|max:100',
            'phone'          => 'required|string|max:20',
            'email'          => 'nullable|email|max:100',
            'address'        => 'required|string|max:500',
            'city'           => 'required|string|max:100',
            'gateway'        => 'required|string|exists:payment_gateways,code',
            'notes'          => 'nullable|string|max:500',
            'payment_proof'  => 'nullable|image|max:10240',
        ]);

        $items = $this->cartItems();
        if ($items->isEmpty()) return back()->with('error','Your cart is empty.');

        // Validate stock for all items
        foreach ($items as $item) {
            if ($item->product->stock < $item->quantity) {
                return back()->with('error', "\"{$item->product->name}\" only has {$item->product->stock} units left.");
            }
        }

        $subtotal  = $items->sum('subtotal');
        $threshold = (float) Setting::get('delivery_threshold', '0');
        $shipping  = $threshold > 0 && $subtotal >= $threshold ? 0 : (float) Setting::get('shipping_fee', '0');

        // Apply coupon
        $couponCode = session('coupon_code');
        $discount   = session('coupon_discount', 0);
        if ($couponCode) {
            $coupon = Coupon::active()->where('code', $couponCode)->first();
            if (!$coupon || !$coupon->isValid()) {
                $couponCode = null; $discount = 0;
            }
        }

        $total = $subtotal + $shipping - $discount;

        $order = Order::create([
            'customer_name'    => $data['name'],
            'customer_phone'   => $data['phone'],
            'customer_email'   => $data['email'] ?? null,
            'customer_address' => $data['address'] . ', ' . $data['city'],
            'payment_method'   => $data['gateway'],
            'notes'            => $data['notes'] ?? null,
            'coupon_code'      => $couponCode,
            'discount'         => $discount,
            'subtotal'         => $subtotal,
            'shipping'         => $shipping,
            'total'            => max(0, $total),
            'status'           => 'pending',
            'payment_status'   => 'pending',
        ]);

        foreach ($items as $item) {
            $order->items()->create([
                'product_id'   => $item->product_id,
                'product_name' => $item->product->name,
                'price'        => $item->price,
                'quantity'     => $item->quantity,
                'subtotal'     => $item->subtotal,
            ]);
        }

        // Save payment proof if uploaded (bank transfer)
        if ($request->hasFile('payment_proof')) {
            $path = $request->file('payment_proof')->store('payment-proofs', 'uploads');
            $order->update(['payment_proof' => asset('uploads/' . $path)]);
        }

        // Reduce stock
        $order->load('items.product');
        $order->reduceStock();

        // Update coupon usage
        if ($couponCode) {
            Coupon::where('code', $couponCode)->increment('used_count');
            session()->forget(['coupon_code', 'coupon_discount']);
        }

        // Clear cart
        CartItem::where('session_id', $this->sessionId())->delete();

        // Send emails
        try {
            if ($data['email']) {
                Mail::to($data['email'])->send(new OrderConfirmedMail($order));
            }
            $adminEmail = Setting::get('email');
            if ($adminEmail) {
                Mail::to($adminEmail)->send(new NewOrderAdminMail($order));
            }
        } catch (\Throwable $e) {
            // Don't fail order if email fails
            \Log::warning("Order email failed: " . $e->getMessage());
        }

        $gatewayCode = $data['gateway'];

        // COD and Bank Transfer — go straight to confirmation
        if (in_array($gatewayCode, ['cod', 'bank_transfer'])) {
            return redirect()->route('order.confirmed', ['order' => $order->id]);
        }

        // Route to dedicated payment handler for each gateway
        $paymentRoutes = [
            'jazzcash'    => 'payment.jazzcash',
            'easypaisa'   => 'payment.easypaisa',
            'stripe'      => 'payment.stripe',
            'paypal'      => 'payment.paypal',
            'safepay'     => 'payment.safepay',
            // These redirect to their own hosted pages via JS SDK
            // callbacks are handled when they return to our URLs
        ];

        // Add Razorpay, Paystack, Flutterwave to routes
        $paymentRoutes['razorpay']    = 'payment.razorpay';
        $paymentRoutes['paystack']    = 'payment.paystack';
        $paymentRoutes['flutterwave'] = 'payment.flutterwave';
        $paymentRoutes['payfast']     = 'payment.payfast';

        if (isset($paymentRoutes[$gatewayCode])) {
            return redirect()->route($paymentRoutes[$gatewayCode], $order->id);
        }

        // Generic gateways (Razorpay, Paystack, Flutterwave etc)
        // For now redirect to confirmation — they can be wired up individually
        return redirect()->route('order.confirmed', ['order' => $order->id]);
    }
}
