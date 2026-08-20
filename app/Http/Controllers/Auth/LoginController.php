<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LoginController extends Controller
{
    private function adminPath(): string
    {
        try {
            return Setting::get('admin_path', 'tijar-admin');
        } catch (\Throwable $e) {
            return 'tijar-admin';
        }
    }

    public function show()
    {
        if (Auth::check()) {
            $path = $this->adminPath();
            return redirect(Auth::user()->role === 'admin' ? "/{$path}" : '/');
        }
        try {
            $settings = \App\Models\Setting::allKeyed();
        } catch (\Throwable $e) {
            $settings = [];
        }
        return Inertia::render('Auth/Login', ['settings' => $settings]);
    }

    public function store(Request $request)
    {
        $credentials = $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();
            $path = $this->adminPath();
            return redirect()->intended(
                Auth::user()->role === 'admin' ? "/{$path}" : '/'
            );
        }

        return back()->withErrors(['email' => 'These credentials do not match our records.']);
    }

    public function destroy(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/login');
    }
}
