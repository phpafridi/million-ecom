<?php
use App\Http\Controllers\Admin;
use App\Http\Controllers\Shop;
use App\Http\Controllers\Shop\PaymentController;
use App\Http\Controllers\Shop\PayFastController;
use App\Http\Controllers\Shop\SupportController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\SeoController;
use App\Models\Setting;
use Illuminate\Support\Facades\Route;

// ── AUTH
Route::get('/login',    [LoginController::class, 'show'])->name('login');
Route::post('/login',   [LoginController::class, 'store'])->name('login.store')->middleware('throttle:5,1');
Route::post('/logout',  [LoginController::class, 'destroy'])->name('logout')->middleware('auth');
Route::get('/register', [RegisterController::class, 'show'])->name('register');
Route::post('/register',[RegisterController::class, 'store'])->name('register.store')->middleware('throttle:10,1');

// ── ADMIN LOGIN — a genuinely separate route, not the same public /login
// endpoint with header-sniffing bolted on. This is what makes the stricter
// admin-tier rate limiting actually enforceable (route-based, not spoofable
// via an absent/faked Referer header) and stops customer-role accounts and
// admin-role accounts from ever successfully authenticating through the
// wrong entry point.
try { $adminLoginPath = Setting::get('admin_path', 'ml-admin'); }
catch (\Throwable $e) { $adminLoginPath = 'ml-admin'; }
Route::get("/{$adminLoginPath}/login",  [LoginController::class, 'showAdmin'])->name('admin.login');
Route::post("/{$adminLoginPath}/login", [LoginController::class, 'storeAdmin'])->name('admin.login.store')->middleware('throttle:5,1');

// ── SEO
Route::get('/sitemap.xml', [SeoController::class, 'sitemap'])->name('seo.sitemap');
Route::get('/robots.txt',  [SeoController::class, 'robots'])->name('seo.robots');

// ── STOREFRONT
Route::get('/',                [Shop\HomeController::class,    'index'])->name('home');
Route::get('/shop',            [Shop\ProductController::class, 'index'])->name('shop.index');
Route::get('/products/{slug}', [Shop\ProductController::class, 'show'])->name('shop.show');
Route::post('/products/{product}/reviews', [Shop\ReviewController::class, 'store'])->name('reviews.store')->middleware('throttle:3,1');
Route::get('/about',   [Shop\PageController::class, 'about'])->name('about');
Route::get('/contact', [Shop\PageController::class, 'contact'])->name('contact');
Route::post('/contact',[Shop\PageController::class, 'contactSend'])->name('contact.send');


// ── PAYMENT GATEWAY ROUTES ──
// Was referencing App\Http\Middleware\VerifyCsrfToken — a file that
// doesn't exist in this project (Laravel 11+ removed it from the default
// structure; CSRF is now handled internally by the framework under a
// different class). ::class on a non-existent class still compiles fine
// since it's just a string, so this silently excluded nothing — every
// route below kept enforcing CSRF the whole time, which is exactly why
// PayFast's ITN callback (and every other gateway's server-to-server
// callback) was failing with 419 Page Expired.
$csrf = [\Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class];

// JazzCash
Route::get( '/payment/jazzcash/{order}',          [Shop\PaymentController::class, 'jazzcashRedirect']  )->name('payment.jazzcash');
Route::post('/payment/jazzcash/callback',          [Shop\PaymentController::class, 'jazzcashCallback']  )->name('payment.jazzcash.callback')->withoutMiddleware($csrf);

// Easypaisa
Route::get( '/payment/easypaisa/{order}',          [Shop\PaymentController::class, 'easypaisaRedirect'] )->name('payment.easypaisa');
Route::post('/payment/easypaisa/callback',          [Shop\PaymentController::class, 'easypaisaCallback'] )->name('payment.easypaisa.callback')->withoutMiddleware($csrf);

// Stripe
Route::get('/payment/stripe/{order}',              [Shop\PaymentController::class, 'stripeCheckout']    )->name('payment.stripe');
Route::get('/payment/stripe/{orderId}/success',    [Shop\PaymentController::class, 'stripeSuccess']     )->name('payment.stripe.success');
Route::get('/payment/stripe/{orderId}/cancel',     [Shop\PaymentController::class, 'stripeCancel']      )->name('payment.stripe.cancel');

// PayPal
Route::get('/payment/paypal/{order}',              [Shop\PaymentController::class, 'paypalCheckout']    )->name('payment.paypal');
Route::get('/payment/paypal/{orderId}/success',    [Shop\PaymentController::class, 'paypalSuccess']     )->name('payment.paypal.success');
Route::get('/payment/paypal/{orderId}/cancel',     [Shop\PaymentController::class, 'paypalCancel']      )->name('payment.paypal.cancel');

// Safepay
Route::get('/payment/safepay/{order}',             [Shop\PaymentController::class, 'safepayCheckout']   )->name('payment.safepay');
Route::get('/payment/safepay/{orderId}/callback',  [Shop\PaymentController::class, 'safepayCallback']   )->name('payment.safepay.callback');
Route::get('/payment/safepay/{orderId}/cancel',    [Shop\PaymentController::class, 'safepayCancel']     )->name('payment.safepay.cancel');

// Razorpay
Route::get( '/payment/razorpay/{order}',           [Shop\PaymentController::class, 'razorpayCheckout']  )->name('payment.razorpay');
Route::post('/payment/razorpay/{orderId}/success',  [Shop\PaymentController::class, 'razorpaySuccess']   )->name('payment.razorpay.success')->withoutMiddleware($csrf);
Route::get( '/payment/razorpay/{orderId}/cancel',   [Shop\PaymentController::class, 'razorpayCancel']    )->name('payment.razorpay.cancel');

// Paystack
Route::get('/payment/paystack/{order}',             [Shop\PaymentController::class, 'paystackCheckout']  )->name('payment.paystack');
Route::get('/payment/paystack/{orderId}/callback',  [Shop\PaymentController::class, 'paystackCallback']  )->name('payment.paystack.callback');
Route::get('/payment/paystack/{orderId}/cancel',    [Shop\PaymentController::class, 'paystackCancel']    )->name('payment.paystack.cancel');

// Flutterwave
Route::get('/payment/flutterwave/{order}',          [Shop\PaymentController::class, 'flutterwaveCheckout'])->name('payment.flutterwave');
Route::get('/payment/flutterwave/{orderId}/callback',[Shop\PaymentController::class,'flutterwaveCallback'])->name('payment.flutterwave.callback');
Route::get('/payment/flutterwave/{orderId}/cancel', [Shop\PaymentController::class, 'flutterwaveCancel'] )->name('payment.flutterwave.cancel');

// ── PAYFAST ──────────────────────────────────────────────────────────────────
Route::get( '/payment/payfast/{orderNumber}',          [PayFastController::class, 'redirect']  )->name('payment.payfast');
Route::post('/payment/payfast/itn',              [PayFastController::class, 'itn']       )->name('payment.payfast.itn')->withoutMiddleware($csrf);
Route::get( '/payment/payfast/{orderNumber}/return', [PayFastController::class, 'returnUrl'] )->name('payment.payfast.return');
Route::get( '/payment/payfast/{orderNumber}/cancel', [PayFastController::class, 'cancel']    )->name('payment.payfast.cancel');

// Generic failed page
Route::get('/payment/failed',                      fn() => inertia('Shop/PaymentFailed', ['settings' => \App\Models\Setting::allKeyed(), 'reason' => session('reason')]))->name('payment.failed');

// ── CART
Route::get('/cart',            [Shop\CartController::class, 'index'])->name('cart.index');
Route::post('/cart/add',       [Shop\CartController::class, 'add'])->name('cart.add')->middleware('throttle:60,1');
Route::patch('/cart/{id}',     [Shop\CartController::class, 'update'])->name('cart.update');
Route::delete('/cart/{id}',    [Shop\CartController::class, 'destroy'])->name('cart.destroy');
Route::post('/cart/coupon',    [Shop\CartController::class, 'applyCoupon'])->name('cart.coupon');
Route::delete('/cart/coupon',  [Shop\CartController::class, 'removeCoupon'])->name('cart.coupon.remove');
Route::post('/cart/points/redeem', [Shop\CartController::class, 'redeemPoints'])->name('cart.points.redeem');
Route::post('/cart/points/remove', [Shop\CartController::class, 'removePoints'])->name('cart.points.remove');
Route::post('/cart/checkout',  [Shop\CartController::class, 'checkout'])->name('cart.checkout')->middleware('throttle:5,1');
Route::get('/order/{orderNumber}/confirmed', function(string $orderNumber) {
    $order = \App\Models\Order::with('items')->where('order_number', $orderNumber)->first();
    if (!$order) abort(404);
    return inertia('Shop/OrderConfirmed', [
        'order' => [
            'id'             => $order->id,
            'order_number'   => $order->order_number ?? ('MLN-' . str_pad($order->id, 5, '0', STR_PAD_LEFT)),
            'total'          => $order->total,
            'payment_method' => $order->payment_method,
            'payment_status' => $order->payment_status,
            'status'         => $order->status,
            'customer_name'  => $order->customer_name,
            'customer_phone' => $order->customer_phone,
            'tracking_token' => $order->tracking_token,
            'items_count'    => $order->items->count(),
            // Previously only items_count (a bare number) was sent — no
            // product names, no variant/size/color, no per-item price, and
            // no discount/subtotal breakdown at all. The confirmation page
            // is effectively the customer's receipt; it should actually
            // show what they bought and what they were charged for it.
            'items'          => $order->items->map(fn($i) => [
                'product_name'  => $i->product_name,
                'variant_label' => $i->variant_label ?? null,
                'quantity'      => $i->quantity,
                'price'         => $i->price,
                'subtotal'      => $i->subtotal,
            ]),
            'subtotal'       => $order->subtotal,
            'shipping'       => $order->shipping,
            'discount'       => $order->discount,
            'coupon_code'    => $order->coupon_code,
        ],
        'settings' => \App\Models\Setting::allKeyed(),
    ]);
})->name('order.confirmed');

Route::get('/order/payment-failed', fn() => redirect()->route('payment.failed'));

// ── ORDER TRACKING
Route::get('/track-order',   [Shop\OrderTrackingController::class, 'index'])->name('track.index');
Route::post('/track-order',  [Shop\OrderTrackingController::class, 'track'])->name('track.search')->middleware('throttle:10,1');
Route::get('/track/{token}', [Shop\OrderTrackingController::class, 'show'])->name('track.show');

// ── NEWSLETTER
Route::post('/newsletter/subscribe',          [Shop\NewsletterController::class, 'subscribe'])->name('newsletter.subscribe')->middleware('throttle:3,10');
Route::get('/newsletter/unsubscribe/{token}', [Shop\NewsletterController::class, 'unsubscribe'])->name('newsletter.unsubscribe');

// ── WISHLIST
Route::get('/wishlist',              [Shop\WishlistController::class, 'index'])->name('wishlist.index');
Route::post('/wishlist/toggle',      [Shop\WishlistController::class, 'toggle'])->name('wishlist.toggle');
Route::get('/wishlist/check',        [Shop\WishlistController::class, 'checkAll'])->name('wishlist.check');
Route::get('/wishlist/check-single', [Shop\WishlistController::class, 'checkSingle'])->name('wishlist.check.single');

// ── CUSTOMER ACCOUNT

// ── POLICY PAGES ──────────────────────────────────────────────────────────────
Route::get('/pages/return-policy',   [Shop\PageController::class, 'returnPolicy'])->name('pages.return-policy');
Route::get('/pages/privacy-policy',  [Shop\PageController::class, 'privacyPolicy'])->name('pages.privacy-policy');
Route::get('/pages/terms',           [Shop\PageController::class, 'termsOfService'])->name('pages.terms');
Route::get('/pages/shipping-policy', [Shop\PageController::class, 'shippingPolicy'])->name('pages.shipping-policy');
Route::get('/pages/payment-policy',  [Shop\PageController::class, 'paymentPolicy'])->name('pages.payment-policy');



// ── SUPPORT ───────────────────────────────────────────────────────────────────
Route::get('/support',            [SupportController::class, 'index'])->name('support.index');
Route::post('/support',           [SupportController::class, 'store'])->name('support.store');
Route::get('/support/my-tickets', [SupportController::class, 'myTickets'])->name('support.my-tickets')->middleware('auth');

// ── NEW ARRIVALS ──────────────────────────────────────────────────────────────
Route::get('/new-arrivals', [Shop\ProductController::class, 'newArrivals'])->name('shop.new-arrivals');

// ── POLICY PAGES ──────────────────────────────────────────────────────────────
Route::get('/pages/return-policy',   [Shop\PageController::class, 'returnPolicy'])->name('pages.return-policy');
Route::get('/pages/privacy-policy',  [Shop\PageController::class, 'privacyPolicy'])->name('pages.privacy-policy');
Route::get('/pages/terms',           [Shop\PageController::class, 'termsOfService'])->name('pages.terms');
Route::get('/pages/shipping-policy', [Shop\PageController::class, 'shippingPolicy'])->name('pages.shipping-policy');
Route::get('/pages/payment-policy',  [Shop\PageController::class, 'paymentPolicy'])->name('pages.payment-policy');


Route::middleware('auth')->group(function () {
    Route::get('/account',                   [Shop\AccountController::class, 'index'])->name('account.index');
    Route::get('/account/orders',            [Shop\AccountController::class, 'orders'])->name('account.orders');
    Route::get('/account/orders/{id}',       [Shop\AccountController::class, 'orderShow'])->name('account.orders.show');
    Route::get('/account/wishlist',          [Shop\AccountController::class, 'wishlist'])->name('account.wishlist');
    Route::get('/account/loyalty',           [Shop\AccountController::class, 'loyalty'])->name('account.loyalty');
    Route::get('/account/profile',           [Shop\AccountController::class, 'profile'])->name('account.profile');
    Route::post('/account/profile',          [Shop\AccountController::class, 'updateProfile'])->name('account.profile.update');
    Route::get('/account/tailor-orders',     [\App\Http\Controllers\TailorStatusController::class, 'index'])->name('account.tailor-orders');
    Route::get('/api/tailor-status',         [\App\Http\Controllers\TailorStatusController::class, 'checkStatus'])->name('tailor-status.check');
    Route::post('/account/avatar',           [Shop\AccountController::class, 'uploadAvatar'])->name('account.avatar');
    Route::post('/account/addresses',        [Shop\AccountController::class, 'storeAddress'])->name('account.addresses.store');
    Route::delete('/account/addresses/{id}', [Shop\AccountController::class, 'destroyAddress'])->name('account.addresses.destroy');
});

// ── ADMIN
try {
    $adminPath = Setting::get('admin_path', 'ml-admin');
} catch (\Throwable $e) {
    $adminPath = 'ml-admin';
}

Route::middleware(['auth', 'admin'])  // Only admin role
    ->prefix($adminPath)
    ->name('admin.')
    ->group(function () {

    Route::get('/', [Admin\DashboardController::class, 'index'])->name('dashboard');

    // Products
    Route::get('products',               [Admin\ProductController::class, 'index'])->name('products.index');
    Route::get('products/export',        [Admin\ProductController::class, 'export'])->name('products.export');
    Route::post('products/import',       [Admin\ProductController::class, 'import'])->name('products.import');
    Route::post('products/bulk',         [Admin\ProductController::class, 'bulkAction'])->name('products.bulk');
    Route::get('products/create',        [Admin\ProductController::class, 'create'])->name('products.create');
    Route::post('products',              [Admin\ProductController::class, 'store'])->name('products.store');
    Route::get('products/{product}/edit',[Admin\ProductController::class, 'edit'])->name('products.edit');
    Route::put('products/{product}',     [Admin\ProductController::class, 'update'])->name('products.update');
    Route::post('products/{product}',    [Admin\ProductController::class, 'update']);
    Route::delete('products/{product}',  [Admin\ProductController::class, 'destroy'])->name('products.destroy');
    Route::patch('products/{product}/stock', function(\Illuminate\Http\Request $req, \App\Models\Product $product) {
        $product->update(['stock' => max(0, (int)$req->validate(['stock'=>'required|integer|min:0'])['stock'])]);
        return back()->with('success','Stock updated.');
    })->name('products.stock');
    Route::post('products/{product}/variants', [Admin\ProductController::class, 'storeVariant'])->name('products.variants');
    Route::post('products/{product}/variant-stock', [Admin\ProductController::class, 'updateVariantStock'])->name('products.variant-stock');

    // Categories
    Route::get('categories',              [Admin\CategoryController::class, 'index'])->name('categories.index');
    Route::post('categories',             [Admin\CategoryController::class, 'store'])->name('categories.store');
    Route::post('categories/reorder',     [Admin\CategoryController::class, 'reorder'])->name('categories.reorder');
    Route::put('categories/{category}',   [Admin\CategoryController::class, 'update'])->name('categories.update');
    Route::post('categories/{category}',  [Admin\CategoryController::class, 'update']);
    Route::delete('categories/{category}',[Admin\CategoryController::class, 'destroy'])->name('categories.destroy');

    // Orders
    Route::get('orders/create',          [Admin\OrderController::class, 'createManual'])->name('orders.create');
    Route::post('orders/manual',         [Admin\OrderController::class, 'storeManual'])->name('orders.manual');
    Route::get('orders',                 [Admin\OrderController::class, 'index'])->name('orders.index');
    Route::get('orders/lookup',          [Admin\OrderController::class, 'lookup'])->name('orders.lookup');
    Route::get('orders/{order}',         [Admin\OrderController::class, 'show'])->name('orders.show');
    Route::patch('orders/{order}',       [Admin\OrderController::class, 'update'])->name('orders.update');
    Route::delete('orders/{order}',      [Admin\OrderController::class, 'destroy'])->name('orders.destroy');
    Route::post('orders/{order}/return', [Admin\OrderController::class, 'storeReturn'])->name('orders.return');
    Route::get('orders/{order}/invoice', [Admin\OrderController::class, 'invoice'])->name('orders.invoice');

    // Customers
    Route::get('customers', [Admin\CustomerController::class, 'index'])->name('customers.index');

    // Hero Slides
    Route::get('hero-slides',              [Admin\HeroSlideController::class, 'index'])->name('hero-slides.index');
    Route::post('hero-slides',             [Admin\HeroSlideController::class, 'store'])->name('hero-slides.store');
    Route::post('hero-slides/reorder',     [Admin\HeroSlideController::class, 'reorder'])->name('hero-slides.reorder');
    Route::put('hero-slides/{heroSlide}',  [Admin\HeroSlideController::class, 'update'])->name('hero-slides.update');
    Route::post('hero-slides/{heroSlide}', [Admin\HeroSlideController::class, 'update']);
    Route::delete('hero-slides/{heroSlide}',[Admin\HeroSlideController::class, 'destroy'])->name('hero-slides.destroy');

    // Banners
    Route::get('banners',           [Admin\BannerController::class, 'index'])->name('banners.index');
    Route::post('banners',          [Admin\BannerController::class, 'store'])->name('banners.store');
    Route::put('banners/{banner}',  [Admin\BannerController::class, 'update'])->name('banners.update');
    Route::post('banners/{banner}', [Admin\BannerController::class, 'update']);
    Route::delete('banners/{banner}',[Admin\BannerController::class, 'destroy'])->name('banners.destroy');

    // Coupons
    Route::get('coupons',           [Admin\CouponController::class, 'index'])->name('coupons.index');
    Route::post('coupons',          [Admin\CouponController::class, 'store'])->name('coupons.store');
    Route::put('coupons/{coupon}',  [Admin\CouponController::class, 'update'])->name('coupons.update');
    Route::delete('coupons/{coupon}',[Admin\CouponController::class, 'destroy'])->name('coupons.destroy');

    // Reviews
    Route::get('reviews',                    [Admin\ReviewController::class, 'index'])->name('reviews.index');
    Route::patch('reviews/{review}/approve', [Admin\ReviewController::class, 'approve'])->name('reviews.approve');
    Route::delete('reviews/{review}',        [Admin\ReviewController::class, 'destroy'])->name('reviews.destroy');

    // Promo Video
    Route::get('promo-video',  [Admin\PromoVideoController::class, 'index'])->name('promo-video.index');
    Route::post('promo-video', [Admin\PromoVideoController::class, 'update'])->name('promo-video.update');

    // Pages
    Route::get('pages',       [Admin\PageController::class, 'index'])->name('pages.index');
    Route::put('pages/{key}', [Admin\PageController::class, 'update'])->name('pages.update');

    // Theme
    Route::get('theme',  [Admin\ThemeController::class, 'index'])->name('theme.index');
    Route::post('theme', [Admin\ThemeController::class, 'update'])->name('theme.update');

    // Payments
    Route::get('payments',                    [Admin\PaymentGatewayController::class, 'index'])->name('payments.index');
    Route::put('payments/{gateway}',          [Admin\PaymentGatewayController::class, 'update'])->name('payments.update');
    Route::patch('payments/{gateway}/toggle', [Admin\PaymentGatewayController::class, 'toggleEnabled'])->name('payments.toggle');

    // Profile + Settings + SEO
    Route::get('profile',  [Admin\ProfileController::class, 'index'])->name('profile.index');
    Route::post('profile', [Admin\ProfileController::class, 'update'])->name('profile.update');
    // Blocked IPs / Firewall
    Route::get('blocked-ips',               [Admin\BlockedIpController::class, 'index'])->name('blocked-ips.index');
    Route::post('blocked-ips',              [Admin\BlockedIpController::class, 'store'])->name('blocked-ips.store');
    Route::patch('blocked-ips/{ip}/unblock',[Admin\BlockedIpController::class, 'unblock'])->name('blocked-ips.unblock');
    Route::delete('blocked-ips/{id}',       [Admin\BlockedIpController::class, 'destroy'])->name('blocked-ips.destroy');

    // System Logs
    Route::get('system-logs',           [Admin\SystemLogController::class, 'index'])->name('system-logs.index');
    Route::delete('system-logs/clear',  [Admin\SystemLogController::class, 'clear'])->name('system-logs.clear');

    // Database Backups
    Route::get('backup',                [Admin\BackupController::class, 'index'])->name('backup.index');
    Route::post('backup',               [Admin\BackupController::class, 'create'])->name('backup.create');
    Route::get('backup/{id}/download',  [Admin\BackupController::class, 'download'])->name('backup.download');
    Route::delete('backup/{id}',        [Admin\BackupController::class, 'destroy'])->name('backup.destroy');

    // WhatsApp settings consolidated into the main Settings page — this
    // controller only ever had two real capabilities: rendering this now-
    // deleted duplicate settings page, and sendOrderNotification(), which
    // was never actually called from anywhere in the app.

    Route::get('settings',  [Admin\SettingController::class, 'index'])->name('settings.index');
    Route::post('settings', [Admin\SettingController::class, 'update'])->name('settings.update');
    Route::get('branding',  [Admin\SettingController::class, 'branding'])->name('settings.branding');
    Route::get('notifications', [Admin\SettingController::class, 'notifications'])->name('settings.notifications');
    Route::get('seo',  [Admin\SeoSettingController::class, 'index'])->name('seo.index');

    // Email Campaigns
    Route::get('email-campaigns',      [Admin\EmailCampaignController::class, 'index'])->name('email-campaigns.index');
    Route::post('email-campaigns/test',                    [Admin\EmailCampaignController::class, 'sendTest'])->name('email-campaigns.test');
    Route::post('email-campaigns/send',                    [Admin\EmailCampaignController::class, 'send'])->name('email-campaigns.send');
    Route::post('email-campaigns/subscribers',             [Admin\EmailCampaignController::class, 'addSubscriber'])->name('email-campaigns.add');
    Route::post('email-campaigns/subscribers/import',      [Admin\EmailCampaignController::class, 'importSubscribers'])->name('email-campaigns.import');
    Route::delete('email-campaigns/subscribers/{subscriber}',[Admin\EmailCampaignController::class, 'removeSubscriber'])->name('email-campaigns.remove');
    Route::post('seo', [Admin\SeoSettingController::class, 'update'])->name('seo.update');

    // ── STAFF ────────────────────────────────────────────────────────────
    Route::get('staff',           [Admin\StaffController::class, 'index'])->name('staff.index');
    Route::post('staff',          [Admin\StaffController::class, 'store'])->name('staff.store');
    Route::put('staff/{user}',    [Admin\StaffController::class, 'update'])->name('staff.update');
    Route::delete('staff/{user}', [Admin\StaffController::class, 'destroy'])->name('staff.destroy');

    // ── SUPPORT TICKETS ───────────────────────────────────────────────────
    Route::get('support',              [Admin\SupportTicketController::class, 'index'])->name('support.admin.index');
    Route::get('support/{id}',         [Admin\SupportTicketController::class, 'show'])->name('support.admin.show');
    Route::post('support/{id}/reply',  [Admin\SupportTicketController::class, 'reply'])->name('support.admin.reply');
    Route::patch('support/{id}',       [Admin\SupportTicketController::class, 'update'])->name('support.admin.update');

    // ── REPORTS ───────────────────────────────────────────────────────────
    Route::get('reports',        [Admin\ReportsController::class, 'index'])->name('reports.index');
    Route::get('reports/export', [Admin\ReportsController::class, 'export'])->name('reports.export');

    // ── RETURNS ───────────────────────────────────────────────────────────
    Route::get('returns',        [Admin\ReturnController::class, 'index'])->name('returns.index');
    Route::patch('returns/{id}', [Admin\ReturnController::class, 'update'])->name('returns.update');

    // ── ANALYTICS ────────────────────────────────────────────────────────
    Route::get('analytics', [Admin\AnalyticsController::class, 'index'])->name('analytics.index');

});
