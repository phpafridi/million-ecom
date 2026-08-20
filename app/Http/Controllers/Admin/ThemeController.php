<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ThemeController extends Controller
{
    const PRESETS = [
        'cyan'   => ['primary'=>'#00c8ff','primary_dark'=>'#00b0e0','primary_text'=>'#0a0e1a','accent'=>'#e91e63','dark_bg'=>'#0a0e1a','dark_bg2'=>'#070b14','body_bg'=>'#f0f2f5'],
        'purple' => ['primary'=>'#7c3aed','primary_dark'=>'#6d28d9','primary_text'=>'#ffffff','accent'=>'#f59e0b','dark_bg'=>'#1e1b4b','dark_bg2'=>'#0f0e29','body_bg'=>'#f5f3ff'],
        'green'  => ['primary'=>'#10b981','primary_dark'=>'#059669','primary_text'=>'#ffffff','accent'=>'#f97316','dark_bg'=>'#064e3b','dark_bg2'=>'#022c22','body_bg'=>'#f0fdf4'],
        'red'    => ['primary'=>'#ef4444','primary_dark'=>'#dc2626','primary_text'=>'#ffffff','accent'=>'#3b82f6','dark_bg'=>'#1f0a0a','dark_bg2'=>'#0f0505','body_bg'=>'#fff5f5'],
        'orange' => ['primary'=>'#f97316','primary_dark'=>'#ea580c','primary_text'=>'#ffffff','accent'=>'#8b5cf6','dark_bg'=>'#1c0a00','dark_bg2'=>'#0f0500','body_bg'=>'#fff7ed'],
        'custom' => [],
    ];

    public function index()
    {
        $s = Setting::allKeyed();
        return Inertia::render('Admin/Theme/Index', [
            'theme' => [
                'preset'        => $s['theme_preset']        ?? 'cyan',
                'primary'       => $s['theme_primary']       ?? '#00c8ff',
                'primary_dark'  => $s['theme_primary_dark']  ?? '#00b0e0',
                'primary_text'  => $s['theme_primary_text']  ?? '#0a0e1a',
                'accent'        => $s['theme_accent']        ?? '#e91e63',
                'dark_bg'       => $s['theme_dark_bg']       ?? '#0a0e1a',
                'dark_bg2'      => $s['theme_dark_bg2']      ?? '#070b14',
                'body_bg'       => $s['theme_body_bg']       ?? '#f0f2f5',
                'font_heading'  => $s['theme_font_heading']  ?? 'Manrope',
                'font_body'     => $s['theme_font_body']     ?? 'Inter',
                'border_radius' => $s['theme_border_radius'] ?? '12',
                'dark_mode'     => $s['theme_dark_mode']     ?? 'light',
            ],
            'presets' => self::PRESETS,
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'preset'        => 'nullable|string|max:20',
            'primary'       => 'nullable|string|max:20',
            'primary_dark'  => 'nullable|string|max:20',
            'primary_text'  => 'nullable|string|max:20',
            'accent'        => 'nullable|string|max:20',
            'dark_bg'       => 'nullable|string|max:20',
            'dark_bg2'      => 'nullable|string|max:20',
            'body_bg'       => 'nullable|string|max:20',
            'font_heading'  => 'nullable|string|max:50',
            'font_body'     => 'nullable|string|max:50',
            'border_radius' => 'nullable|integer|min:0|max:24',
            'dark_mode'     => 'nullable|string|in:light,dark,auto',
        ]);

        foreach ($data as $key => $val) {
            Setting::set('theme_' . $key, (string) $val);
        }

        return back()->with('success', 'Theme updated successfully.');
    }
}
