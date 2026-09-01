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

        // ── Nav categories: cached 30min, cleared on category change ─
        $navCategories = Cache::remember('nav_categories', 1800, function () {
            try {
                return Category::active()->navVisible()->topLevel()
                    ->with(['children' => fn($q) => $q->where('is_active', true)->select('id','name','slug','parent_id','sort_order')])
                    ->orderBy('nav_order')->orderBy('sort_order')
                    ->get(['id','name','slug','nav_order','sort_order'])
                    ->map(fn($c) => [
                        'label'    => $c->name,
                        'href'     => "/shop?category={$c->slug}",
                        'children' => $c->children->map(fn($ch) => [
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

        // The real admin path was being sent to EVERY visitor on EVERY page
        // — both as its own top-level prop and buried inside the general
        // settings object — completely unconditionally. Anyone could view
        // page source on the homepage and find the real hidden admin URL,
        // making the entire point of having a non-default admin path
        // pointless. Only actual staff/admin accounts have any legitimate
        // use for this (building the "Back to Admin" link in the
        // storefront header) — everyone else gets a generic placeholder.
        $isStaffViewer = in_array($request->user()?->role, ['admin', 'staff']);
        $sharedSettings = $settings;
        if (!$isStaffViewer) {
            unset($sharedSettings['admin_path']);
        }
        $sharedAdminPath = $isStaffViewer ? $adminPath : null;

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
            'settings'      => $sharedSettings,
            'adminPath'     => $sharedAdminPath,
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
                'topbar_bg'     => $settings['theme_topbar_bg']     ?? '#0a0a0a',
                'topbar_text'   => $settings['theme_topbar_text']   ?? 'rgba(255,255,255,0.7)',
                'nav_bg'        => $settings['theme_nav_bg']        ?? '#ffffff',
                'nav_text'      => $settings['theme_nav_text']      ?? '#111111',
                'nav_border'    => $settings['theme_nav_border']    ?? '#e5e7eb',
                'header_bg'     => $settings['theme_header_bg']     ?? '#ffffff',
                'header_text'   => $settings['theme_header_text']   ?? '#0a0a0a',
                'header_border' => $settings['theme_header_border'] ?? '#e5e7eb',
            ],
        ]);
    }
}
