<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PromoVideoController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/PromoVideo/Index', [
            'current_video' => Setting::get('promo_video_url'),
            'video_title'   => Setting::get('promo_video_title', 'ASUS ROG Gaming PCs'),
            'video_tag'     => Setting::get('promo_video_tag',   '🔥 Hot Deal'),
            'video_cta'     => Setting::get('promo_video_cta',   'Enquire Now'),
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'video'       => 'nullable|file|mimes:mp4,webm,mov|max:51200', // 50MB max
            'video_title' => 'string|max:100',
            'video_tag'   => 'string|max:50',
            'video_cta'   => 'string|max:50',
        ]);

        if ($request->hasFile('video')) {
            $old = Setting::get('promo_video_path');
            if ($old) Storage::delete($old);
            $path = $request->file('video')->store('promo', 'uploads');
            Setting::set('promo_video_path', $path);
            Setting::set('promo_video_url', '/uploads/' . $path);
        }

        foreach (['video_title','video_tag','video_cta'] as $k) {
            if ($request->has($k)) Setting::set('promo_' . $k, $request->$k);
        }

        return back()->with('success', 'Promo video updated.');
    }
}
