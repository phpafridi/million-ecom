<?php
namespace App\Http\Middleware;

use App\Models\{Setting, Category, CartItem, Wishlist};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function share(Request $request): array
    {
        $sid = session()->getId();

        // ── Settings: cached 1hr, cleared on admin save ──────────────
        try {
            $settings = Setting::allKeyed();
        } catch (\Throwable $e) {
            $settings = [];
        }

        // Apply SMTP from DB if admin has configured it
        if (!empty($settings['mail_host'])) {
            config([
                'mail.mailers.smtp.host'       => $settings['mail_host'],
                'mail.mailers.smtp.port'       => (int)($settings['mail_port'] ?? 587),
                'mail.mailers.smtp.username'   => $settings['mail_username'] ?? '',
                'mail.mailers.smtp.password'   => $settings['mail_password'] ?? '',
                'mail.mailers.smtp.encryption' => $settings['mail_encryption'] ?? 'tls',
                'mail.from.address'            => $settings['mail_from_address'] ?? $settings['email'] ?? '',
                'mail.from.name'               => $settings['mail_from_name'] ?? $settings['site_name'] ?? 'MILLIONAIRE',
            ]);
        }

        // ── Nav categories: cached 30min, cleared on category change ─
        $navCategories = Cache::remember('nav_categories', 1800, function () {
            try {
                return Category::active()->navVisible()->topLevel()
                    ->with(['activeChildren' => fn($q) => $q->select('id','name','slug','parent_id','sort_order')])
                    ->orderBy('nav_order')->orderBy('sort_order')
                    ->get(['id','name','slug','nav_order','sort_order'])
                    ->map(fn($c) => [
                        'label'    => $c->name,
                        'href'     => "/shop?category={$c->slug}",
                        'children' => $c->activeChildren->map(fn($ch) => [
                            'label' => $ch->name,
                            'href'  => "/shop?category={$ch->slug}",
                        ])->values(),
                    ])->toArray();
            } catch (\Throwable $e) {
                return [];
            }
        });

        // ── Cart: ALWAYS FRESH — prices/stock change, never cache ────
        try {
            $cartItems = CartItem::where('session_id', $sid)
                ->with(['product' => fn($q) => $q->select('id','name','slug','price','stock')
                    ->with(['productImages' => fn($q) => $q->select('product_id','path')
                        ->orderBy('sort_order')->limit(1)])])
                ->get();
            $cartMapped = $cartItems->map(fn($i) => [
                'id'            => $i->id,
                'product_id'    => $i->product_id,
                'product_name'  => $i->product?->name ?? 'Product',
                'product_image' => $i->product?->productImages->first()?->url ?? null,
                'variant_label' => $i->variant_label ?? null,
                'price'         => (float)$i->price,
                'quantity'      => $i->quantity,
                'subtotal'      => (float)($i->price * $i->quantity),
            ]);
            $cartCount = (int)$cartItems->sum('quantity');
            $cartTotal = (float)$cartMapped->sum('subtotal');
        } catch (\Throwable $e) {
            $cartMapped = collect();
            $cartCount  = 0;
            $cartTotal  = 0;
        }

        // ── Wishlist: ALWAYS FRESH ────────────────────────────────────
        try {
            $wishlistIds = Wishlist::where('session_id', $sid)->pluck('product_id')->toArray();
        } catch (\Throwable $e) {
            $wishlistIds = [];
        }

        $adminPath = $settings['admin_path'] ?? 'ml-admin';

        // Admin notifications (only for admin users - cached 2min)
        $adminNotifications = [];
        if ($request->user()?->role === 'admin') {
            $adminNotifications = Cache::remember('admin_notifications', 120, function () {
                try {
                    $pendingOrders  = \App\Models\Order::where('status', 'pending')->count();
                    $threshold      = (int)(\App\Models\Setting::get('low_stock_threshold', 5) ?: 5);
                    $lowStockCount  = \App\Models\Product::where('stock', '<=', $threshold)->where('stock', '>', 0)->where('is_active', true)->count();
                    $pendingReviews = \App\Models\Review::where('is_approved', false)->count();
                    $total          = $pendingOrders + $lowStockCount + $pendingReviews;
                    return compact('pendingOrders', 'lowStockCount', 'pendingReviews', 'total');
                } catch (\Throwable $e) {
                    return ['pendingOrders' => 0, 'lowStockCount' => 0, 'pendingReviews' => 0, 'total' => 0];
                }
            });
        }

        return array_merge(parent::share($request), [
            'auth' => ['user' => $request->user() ? [
                'id'             => $request->user()->id,
                'name'           => $request->user()->name,
                'email'          => $request->user()->email,
                'role'           => $request->user()->role,
                'loyalty_points' => $request->user()->loyalty_points ?? 0,
            ] : null],
            'flash' => [
                'success'            => session('success'),
                'error'              => session('error'),
                'coupon_success'     => session('coupon_success'),
                'coupon_error'       => session('coupon_error'),
                'newsletter_message' => session('newsletter_message'),
                'tracking_result'    => session('tracking_result'),
                'tracking_error'     => session('tracking_error'),
            ],
            'settings'      => $settings,
            'adminPath'     => $adminPath,
            'cartCount'     => $cartCount,
            'cartItems'     => $cartMapped->values(),
            'cartTotal'     => $cartTotal,
            'wishlistCount' => count($wishlistIds),
            'wishlistIds'   => $wishlistIds,
            'navCategories'       => $navCategories,
            'adminNotifications'  => $adminNotifications,
            'theme' => [
                'primary'       => $settings['theme_primary']       ?? '#C9A84C',
                'primary_dark'  => $settings['theme_primary_dark']  ?? '#b8923e',
                'primary_text'  => $settings['theme_primary_text']  ?? '#0a0a0a',
                'accent'        => $settings['theme_accent']        ?? '#e91e63',
                'dark_bg'       => $settings['theme_dark_bg']       ?? '#0a0a0a',
                'dark_bg2'      => $settings['theme_dark_bg2']      ?? '#111111',
                'body_bg'       => $settings['theme_body_bg']       ?? '#f5f5f5',
                'border_radius' => $settings['theme_border_radius'] ?? '12',
                'topbar_bg'     => $settings['topbar_bg']           ?? '#0a0a0a',
                'topbar_text'   => $settings['topbar_text']         ?? '#ffffff',
                'nav_bg'        => $settings['nav_bg']              ?? '#ffffff',
                'nav_text'      => $settings['nav_text']            ?? '#111111',
                'header_bg'     => $settings['header_bg']           ?? '#0a0a0a',
                'header_text'   => $settings['header_text']         ?? '#ffffff',
            ],
        ]);
    }
}
