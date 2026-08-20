<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Auth, Hash};
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Profile', [
            'user' => Auth::user()->only('id','name','email'),
        ]);
    }

    public function update(Request $request)
    {
        $user = Auth::user();
        $data = $request->validate([
            'name'                  => 'required|string|max:100',
            'email'                 => "required|email|unique:users,email,{$user->id}",
            'current_password'      => 'nullable|string',
            'password'              => 'nullable|string|min:8|confirmed',
        ]);

        // Verify current password if changing password
        if (!empty($data['password'])) {
            if (empty($data['current_password']) || !Hash::check($data['current_password'], $user->password)) {
                return back()->withErrors(['current_password' => 'Current password is incorrect.']);
            }
            $user->password = Hash::make($data['password']);
        }

        $user->name  = $data['name'];
        $user->email = $data['email'];
        $user->save();

        return back()->with('success', 'Profile updated successfully.');
    }
}
