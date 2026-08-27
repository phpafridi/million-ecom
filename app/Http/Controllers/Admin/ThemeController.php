<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ThemeController extends Controller
{
    public function index()
    {
        $s = Setting::allKeyed();
        return Inertia::render('Admin/Theme/Index', [
            'theme' => [
                'preset'        => $s['theme_preset']        ?? 'millionaire',
                // Brand
                'primary'       => $s['theme_primary']       ?? '#C9A84C',
                'primary_dark'  => $s['theme_primary_dark']  ?? '#b8943f',
                'primary_text'  => $s['theme_primary_text']  ?? '#0a0a0a',
                'accent'        => $s['theme_accent']        ?? '#C9A84C',
                'dark_bg'       => $s['theme_dark_bg']       ?? '#0a0a0a',
                'dark_bg2'      => $s['theme_dark_bg2']      ?? '#050505',
                'body_bg'       => $s['theme_body_bg']       ?? '#FAFAFA',
                // Header bar
                'header_bg'     => $s['theme_header_bg']     ?? '#ffffff',
                'header_text'   => $s['theme_header_text']   ?? '#0a0a0a',
                'header_border' => $s['theme_header_border'] ?? '#e5e7eb',
                // Topbar
                'topbar_bg'     => $s['theme_topbar_bg']     ?? '#0a0a0a',
                'topbar_text'   => $s['theme_topbar_text']   ?? 'rgba(255,255,255,0.7)',
                // Nav bar
                'nav_bg'        => $s['theme_nav_bg']        ?? '#ffffff',
                'nav_text'      => $s['theme_nav_text']      ?? '#374151',
                'nav_border'    => $s['theme_nav_border']    ?? '#e5e7eb',
                // Typography
                'font_heading'  => $s['theme_font_heading']  ?? 'Manrope',
                'font_body'     => $s['theme_font_body']     ?? 'Inter',
                'border_radius' => $s['theme_border_radius'] ?? '12',
                'dark_mode'     => $s['theme_dark_mode']     ?? 'light',
            ],
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'preset'        => 'nullable|string|max:30',
            'primary'       => 'nullable|string|max:30',
            'primary_dark'  => 'nullable|string|max:30',
            'primary_text'  => 'nullable|string|max:30',
            'accent'        => 'nullable|string|max:30',
            'dark_bg'       => 'nullable|string|max:30',
            'dark_bg2'      => 'nullable|string|max:30',
            'body_bg'       => 'nullable|string|max:30',
            'header_bg'     => 'nullable|string|max:30',
            'header_text'   => 'nullable|string|max:30',
            'header_border' => 'nullable|string|max:30',
            'topbar_bg'     => 'nullable|string|max:50',
            'topbar_text'   => 'nullable|string|max:50',
            'nav_bg'        => 'nullable|string|max:30',
            'nav_text'      => 'nullable|string|max:30',
            'nav_border'    => 'nullable|string|max:30',
            'font_heading'  => 'nullable|string|max:50',
            'font_body'     => 'nullable|string|max:50',
            'border_radius' => 'nullable|integer|min:0|max:24',
            'dark_mode'     => 'nullable|string|in:light,dark,auto',
        ]);

        foreach ($data as $key => $val) {
            Setting::set('theme_' . $key, (string) $val);
        }

        return back()->with('success', 'Theme saved — live for all visitors.');
    }
}
