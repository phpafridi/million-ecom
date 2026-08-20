<?php
namespace App\Http\Middleware;

use App\Models\{Setting, Category, CartItem, Wishlist};
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function share(Request $request): array
    {
        try { $settings = Setting::allKeyed(); } catch (\Throwable $e) { $settings = []; }

        $adminPath = $settings['admin_path'] ?? 'tijar-admin';

        try {
            $cartCount = CartItem::where('session_id', session()->getId())->sum('quantity');
        } catch (\Throwable $e) { $cartCount = 0; }

        try {
            $navCategories = Category::active()
                ->navVisible()->topLevel()
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
                ]);
        } catch (\Throwable $e) { $navCategories = []; }

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user() ? [
                    'id'    => $request->user()->id,
                    'name'  => $request->user()->name,
                    'email' => $request->user()->email,
                    'role'  => $request->user()->role,
                ] : null,
            ],
            'flash' => [
                'success'           => session('success'),
                'error'             => session('error'),
                'newsletter_message'=> session('newsletter_message'),
                'tracking_result'   => session('tracking_result'),
                'tracking_error'    => session('tracking_error'),
            ],
            'settings'      => $settings,
            'adminPath'     => $adminPath,
            'cartCount'     => $cartCount,
            'wishlistCount' => Wishlist::where('session_id', session()->getId())->count(),
            'wishlistIds'   => Wishlist::where('session_id', session()->getId())->pluck('product_id')->toArray(),
            'navCategories' => $navCategories,
            'theme' => [
                'primary'       => $settings['theme_primary']       ?? '#00c8ff',
                'primary_dark'  => $settings['theme_primary_dark']  ?? '#00b0e0',
                'primary_text'  => $settings['theme_primary_text']  ?? '#0a0e1a',
                'accent'        => $settings['theme_accent']        ?? '#e91e63',
                'dark_bg'       => $settings['theme_dark_bg']       ?? '#0a0e1a',
                'dark_bg2'      => $settings['theme_dark_bg2']      ?? '#070b14',
                'body_bg'       => $settings['theme_body_bg']       ?? '#f0f2f5',
                'border_radius' => $settings['theme_border_radius'] ?? '12',
                'topbar_bg'     => $settings['topbar_bg']            ?? '#0a0a0a',
            ],
        ]);
    }

    private function getNotifications(\Illuminate\Http\Request $request): array
    {
        if (!$request->user() || $request->user()->role !== 'admin') {
            return ['pending_orders' => 0, 'pending_reviews' => 0, 'low_stock' => 0, 'total' => 0];
        }
        try {
            $pendingOrders  = \App\Models\Order::where('status', 'pending')->count();
            $pendingReviews = \App\Models\Review::where('is_approved', false)->count();
            $lowStock       = \App\Models\Product::where('is_active', true)->where('stock', '<=', 5)->count();
            return [
                'pending_orders'  => $pendingOrders,
                'pending_reviews' => $pendingReviews,
                'low_stock'       => $lowStock,
                'total'           => $pendingOrders + $pendingReviews + $lowStock,
            ];
        } catch (\Throwable $e) {
            return ['pending_orders' => 0, 'pending_reviews' => 0, 'low_stock' => 0, 'total' => 0];
        }
    }
}
