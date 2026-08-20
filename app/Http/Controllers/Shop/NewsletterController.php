<?php
namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\{NewsletterSubscriber, User};
use Illuminate\Http\Request;

class NewsletterController extends Controller
{
    public function subscribe(Request $request)
    {
        $data = $request->validate([
            'email' => 'required|email|max:255',
            'name'  => 'nullable|string|max:100',
        ]);

        $existing = NewsletterSubscriber::where('email', $data['email'])->first();

        if ($existing) {
            if ($existing->is_active) {
                return back()->with('newsletter_message', 'You are already subscribed!');
            }
            // Re-subscribe
            $existing->update(['is_active' => true, 'unsubscribed_at' => null, 'subscribed_at' => now()]);
        } else {
            NewsletterSubscriber::create($data);
        }

        // Also update user record if logged in
        if (auth()->check()) {
            auth()->user()->update([
                'newsletter_subscribed'    => true,
                'newsletter_subscribed_at' => now(),
            ]);
        }

        return back()->with('newsletter_message', '🎉 You\'re subscribed! Expect exclusive offers soon.');
    }

    public function unsubscribe(string $token)
    {
        $subscriber = NewsletterSubscriber::where('token', $token)->firstOrFail();
        $subscriber->update(['is_active' => false, 'unsubscribed_at' => now()]);

        return inertia('Info/Unsubscribed', ['settings' => \App\Models\Setting::allKeyed()]);
    }
}
