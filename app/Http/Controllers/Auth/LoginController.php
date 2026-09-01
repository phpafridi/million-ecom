<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Auth, RateLimiter};
use Illuminate\Support\Str;
use Inertia\Inertia;

class LoginController extends Controller
{
    private function adminPath(): string
    {
        try { return Setting::get('admin_path', 'ml-admin'); }
        catch (\Throwable $e) { return 'ml-admin'; }
    }

    // Wishlist items were tied to session_id with no fallback to user_id
    // being read anywhere — meaning anything a guest wishlisted before
    // logging in became permanently invisible the moment their session
    // regenerated. Cart items had a similar (if less severe) gap. This
    // moves both onto the account. Wishlist merges one row at a time rather
    // than a blind mass UPDATE, since the account may already have some of
    // these products wishlisted from a previous session — a bulk update
    // would violate the (user_id, product_id) unique constraint the moment
    // that happens.
    private function mergeGuestData(string $oldSid, int $userId): void
    {
        \App\Models\Wishlist::where('session_id', $oldSid)->whereNull('user_id')
            ->get()->each(function ($item) use ($userId) {
                $exists = \App\Models\Wishlist::where('user_id', $userId)
                    ->where('product_id', $item->product_id)->exists();
                if ($exists) {
                    $item->delete();
                } else {
                    $item->update(['user_id' => $userId]);
                }
            });

        \App\Models\CartItem::where('session_id', $oldSid)
            ->update(['session_id' => session()->getId()]);
    }

    // ── PUBLIC / CUSTOMER LOGIN ──────────────────────────────────────
    public function show()
    {
        return $this->render(isAdmin: false);
    }

    public function store(Request $request)
    {
        return $this->attempt($request, isAdmin: false);
    }

    // ── ADMIN LOGIN — a separate route, not a header guess ───────────
    public function showAdmin()
    {
        return $this->render(isAdmin: true);
    }

    public function storeAdmin(Request $request)
    {
        return $this->attempt($request, isAdmin: true);
    }

    // ── Shared implementation ────────────────────────────────────────
    private function render(bool $isAdmin)
    {
        $path = $this->adminPath();
        if (Auth::check()) {
            $isStaffRole = in_array(Auth::user()->role, ['admin', 'staff']);
            return redirect($isStaffRole ? "/{$path}" : '/');
        }
        try { $settings = Setting::allKeyed(); } catch (\Throwable $e) { $settings = []; }
        // admin_path is only needed by the actual admin login form (to build
        // its POST URL) — Setting::allKeyed() returns everything with no
        // filtering, and this whole object gets sent to the browser as-is.
        // Leaving admin_path in it on the PUBLIC customer login page would
        // expose the real hidden admin URL to anyone who just views page
        // source, with no login attempt or credentials needed at all.
        if (!$isAdmin) {
            unset($settings['admin_path']);
        }
        return Inertia::render('Auth/Login', ['settings' => $settings, 'isAdmin' => $isAdmin]);
    }

    private function attempt(Request $request, bool $isAdmin)
    {
        $credentials = $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        // Rate limiting tier is decided purely by WHICH ROUTE was hit — the
        // route itself can't be spoofed the way a Referer header can, so the
        // stricter admin-tier limit can no longer be silently bypassed.
        if ($isAdmin) {
            $maxAttempts = (int)(Setting::get('admin_max_attempts', '3') ?: 3);
            $lockoutMins = (int)(Setting::get('admin_lockout_minutes', '30') ?: 30);
        } else {
            $maxAttempts = (int)(Setting::get('login_max_attempts', '5') ?: 5);
            $lockoutMins = (int)(Setting::get('login_lockout_minutes', '15') ?: 15);
        }
        $key = ($isAdmin ? 'admin_' : 'login_') . Str::lower($request->email) . '_' . $request->ip();

        if (RateLimiter::tooManyAttempts($key, $maxAttempts)) {
            $seconds = RateLimiter::availableIn($key);
            $minutes = ceil($seconds / 60);
            return back()->withErrors([
                'email' => "Too many login attempts. Please try again in {$minutes} minute(s).",
            ])->with('lockout_seconds', $seconds);
        }

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            // Capture the guest session ID before regenerate() changes it,
            // so any wishlist/cart items added before logging in can be
            // merged into the account instead of becoming orphaned.
            $oldSid = $request->session()->getId();

            RateLimiter::clear($key);
            $request->session()->regenerate();
            $this->mergeGuestData($oldSid, Auth::id());
            \App\Models\ActivityLog::log('login.success', 'Login: ' . auth()->user()->name . ' [' . auth()->user()->role . ']', 'info');
            $path = $this->adminPath();
            $role = Auth::user()->role;
            $isStaffRole = in_array($role, ['admin', 'staff']);

            // Each entry point only accepts its own kind of account. A
            // staff/admin account logging in through the public customer
            // form is rejected just as firmly as a customer account is
            // rejected on the staff form — no cross-authentication through
            // the wrong door either way. Neither message reveals the actual
            // admin path — doing that defeats the entire point of having a
            // custom/hidden admin URL the moment someone (or an attacker
            // with a phished/leaked credential) tries the well-known public
            // /login page first, which is the most natural thing to try.
            if ($isAdmin && !$isStaffRole) {
                Auth::logout();
                return back()->withErrors(['email' => 'These credentials are not valid for this login.']);
            }
            if (!$isAdmin && $isStaffRole) {
                Auth::logout();
                return back()->withErrors(['email' => 'These credentials are not valid for this login.']);
            }

            return redirect()->intended($isStaffRole ? "/{$path}" : '/');
        }

        RateLimiter::hit($key, $lockoutMins * 60);
        \App\Models\ActivityLog::log('login.failed', 'Failed login: ' . $request->email, 'warning');
        $remaining = $maxAttempts - RateLimiter::attempts($key);

        return back()->withErrors([
            'email' => "Invalid credentials." . ($remaining > 0 ? " {$remaining} attempt(s) remaining." : ''),
        ])->withInput($request->only('email'));
    }

    public function destroy(Request $request)
    {
        $wasStaff = Auth::check() && in_array(Auth::user()->role, ['admin', 'staff']);
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return $wasStaff ? redirect('/' . $this->adminPath() . '/login') : redirect('/login');
    }
}
