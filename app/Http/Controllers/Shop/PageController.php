<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PageController extends Controller
{
    public function about()
    {
        return Inertia::render('Info/About', [
            'settings' => Setting::allKeyed(),
            'content'  => [
                'about_tagline'  => Setting::get('about_tagline',  'Your trusted online store.'),
                'about_mission'  => Setting::get('about_mission',  'We were founded with a simple goal: give our customers quality products at honest prices.'),
                'about_mission2' => Setting::get('about_mission2', 'From Apple MacBooks to Sony headphones, gaming PCs to printers — we stock everything and back it with a service team that actually picks up the phone.'),
            ],
        ]);
    }

    public function contact()
    {
        return Inertia::render('Info/Contact', [
            'settings' => Setting::allKeyed(),
        ]);
    }

    public function contactSend(Request $request)
    {
        $request->validate([
            'name'    => 'required|string',
            'email'   => 'required|email',
            'message' => 'required|string',
        ]);
        // In production: send email or store to DB
        return back()->with('success', 'Message sent!');
    }
}
