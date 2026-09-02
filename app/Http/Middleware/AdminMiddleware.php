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

            // "Can Delete" is a separate, cross-cutting permission — a
            // staff member can have full view/edit access to a section
            // (products, orders, etc.) without being allowed to actually
            // delete anything in it, unless this is granted too. Checked
            // once here for every DELETE request, rather than gating
            // delete separately inside each individual section below.
            if ($request->isMethod('delete') && !in_array('can_delete', $permissions ?? [])) {
                if ($request->header('X-Inertia')) {
                    return Inertia::render('Admin/Errors/NoPermission', [
                        'message' => "You don't have permission to delete items.",
                        'section' => 'Delete',
                    ])->toResponse($request)->setStatusCode(403);
                }
                abort(403);
            }

            // Dashboard is the bare admin-path root — no /segment for any
            // of the checks below to match against, so it was completely
            // unrestricted for every staff account regardless of their
            // actual permissions. Checked explicitly here instead.
            $adminPath = \App\Models\Setting::get('admin_path', 'ml-admin');
            if ($path === $adminPath || $path === $adminPath . '/') {
                if (!in_array('dashboard', $permissions ?? [])) {
                    if ($request->header('X-Inertia')) {
                        return Inertia::render('Admin/Errors/NoPermission', [
                            'message' => "You don't have permission to access this section.",
                            'section' => 'Dashboard',
                        ])->toResponse($request)->setStatusCode(403);
                    }
                    abort(403);
                }
                return $next($request);
            }

            // Admin-only areas. Several sensitive sections were missing
            // from this list entirely — branding, notifications, the IP
            // firewall, system logs, backups, and core settings were all
            // reachable by ANY staff member regardless of their assigned
            // role or permissions, since nothing here was blocking them.
            $adminOnly = ['staff','settings','payments','theme','seo','analytics','reports',
                'branding','notifications','blocked-ips','system-logs','backup'];
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
            // /orders/lookup is checked separately, and BEFORE the general
            // 'orders' map below, since '/orders' is a substring of
            // '/orders/lookup' — without this, the general check would
            // always match first and there'd be no way to grant lookup
            // access without also granting full order management (status
            // changes, deletion) on the same permission.
            if (str_contains($path, '/orders/lookup')) {
                if (!in_array('orders_lookup', $permissions ?? []) && !in_array('orders', $permissions ?? [])) {
                    if ($request->header('X-Inertia')) {
                        return Inertia::render('Admin/Errors/NoPermission', [
                            'message' => "You don't have permission to access this section.",
                            'section' => 'Order Lookup',
                        ])->toResponse($request)->setStatusCode(403);
                    }
                    abort(403);
                }
                return $next($request);
            }

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
                'email-campaigns' => 'email_campaigns',
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
