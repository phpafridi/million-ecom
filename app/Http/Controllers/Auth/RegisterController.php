<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\{User, Setting};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Auth, Hash};
use Inertia\Inertia;

class RegisterController extends Controller
{
    public function show()
    {
        try { $settings = Setting::allKeyed(); } catch (\Throwable $e) { $settings = []; }
        return Inertia::render('Auth/Register', ['settings' => $settings]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'phone'    => 'nullable|string|max:20',
            'address'  => 'nullable|string|max:500',
            'city'     => 'nullable|string|max:100',
            'password' => 'required|min:8|confirmed',
        ]);

        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'phone'    => $data['phone'] ?? null,
            'address'  => $data['address'] ?? null,
            'city'     => $data['city'] ?? null,
            'password' => Hash::make($data['password']),
            'role'     => 'customer',
        ]);

        Auth::login($user);

        try {
            \Illuminate\Support\Facades\Mail::to($user->email)->send(new \App\Mail\WelcomeMail($user));
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('Welcome email failed: ' . $e->getMessage());
        }

        return redirect('/');
    }
}
