<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if (!$user) {
            $adminPath = \App\Models\Setting::get('admin_path', 'ml-admin');
            return redirect("/{$adminPath}/login")->with('error', 'Please login to continue.');
        }

        if (!in_array($user->role, ['admin', 'staff'])) {
            abort(403, 'Access denied.');
        }

        // Staff permission checks
        if ($user->role === 'staff') {
            $permissions = is_array($user->permissions)
                ? $user->permissions
                : json_decode($user->permissions ?? '[]', true);

            $path = $request->path();

            // Admin-only areas
            $adminOnly = ['staff','settings','payments','theme','seo','analytics','reports'];
            foreach ($adminOnly as $r) {
                if (str_contains($path, '/'.$r)) {
                    if ($request->wantsJson() || $request->header('X-Inertia')) {
                        return Inertia::render('Admin/Errors/NoPermission', [
                            'message' => 'This area is restricted to administrators only.',
                            'section' => ucfirst($r),
                        ])->toResponse($request)->setStatusCode(403);
                    }
                    abort(403);
                }
            }

            // Permission map
            $map = [
                'orders'      => 'orders',
                'products'    => 'products',
                'customers'   => 'customers',
                'categories'  => 'categories',
                'coupons'     => 'coupons',
                'reviews'     => 'reviews',
                'banners'     => 'banners',
                'hero-slides' => 'hero_slides',
                'chat'        => 'chat',
                'support'     => 'support_tickets',
                'pages'       => 'pages',
                'returns'     => 'returns',
            ];

            foreach ($map as $seg => $perm) {
                if (str_contains($path, '/'.$seg)) {
                    if (!in_array($perm, $permissions ?? [])) {
                        if ($request->header('X-Inertia')) {
                            return Inertia::render('Admin/Errors/NoPermission', [
                                'message' => "You don't have permission to access this section.",
                                'section' => ucfirst(str_replace('-',' ',$seg)),
                            ])->toResponse($request)->setStatusCode(403);
                        }
                        abort(403);
                    }
                    break;
                }
            }
        }

        return $next($request);
    }
}
