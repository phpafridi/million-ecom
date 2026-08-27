<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Auth, RateLimiter, Cache};
use Illuminate\Support\Str;
use Inertia\Inertia;

class LoginController extends Controller
{
    private function adminPath(): string
    {
        try { return Setting::get('admin_path', 'ml-admin'); }
        catch (\Throwable $e) { return 'ml-admin'; }
    }

    public function show()
    {
        if (Auth::check()) {
            $path = $this->adminPath();
            return redirect(Auth::user()->role === 'admin' ? "/{$path}" : '/');
        }
        try { $settings = Setting::allKeyed(); } catch (\Throwable $e) { $settings = []; }
        return Inertia::render('Auth/Login', ['settings' => $settings]);
    }

    public function store(Request $request)
    {
        $credentials = $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        // ── Rate limiting: stricter for admin login ─────────────────
        $referer     = $request->header('referer', '');
        $adminPath   = $this->adminPath();
        $isAdminLogin = str_contains($referer, $adminPath) || str_contains($request->path(), $adminPath);

        if ($isAdminLogin) {
            $maxAttempts = (int)(Setting::get('admin_max_attempts', '3') ?: 3);
            $lockoutMins = (int)(Setting::get('admin_lockout_minutes', '30') ?: 30);
        } else {
            $maxAttempts = (int)(Setting::get('login_max_attempts', '5') ?: 5);
            $lockoutMins = (int)(Setting::get('login_lockout_minutes', '15') ?: 15);
        }
        $key = ($isAdminLogin ? 'admin_' : 'login_') . Str::lower($request->email) . '_' . $request->ip();

        if (RateLimiter::tooManyAttempts($key, $maxAttempts)) {
            $seconds  = RateLimiter::availableIn($key);
            $minutes  = ceil($seconds / 60);
            return back()->withErrors([
                'email' => "Too many login attempts. Please try again in {$minutes} minute(s).",
            ])->with('lockout_seconds', $seconds);
        }

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            RateLimiter::clear($key);
            $request->session()->regenerate();
            \App\Models\ActivityLog::log('login.success', 'Login: ' . auth()->user()->name . ' [' . auth()->user()->role . ']', 'info');
            $path = $this->adminPath();

            // Block customers from admin
            if (Auth::user()->role !== 'admin' && str_contains($request->header('referer', ''), $path)) {
                Auth::logout();
                return back()->withErrors(['email' => 'Access denied.']);
            }

            return redirect()->intended(
                Auth::user()->role === 'admin' ? "/{$path}" : '/'
            );
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
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/login');
    }
}
