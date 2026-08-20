<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PageController extends Controller
{
    private array $pages = [
        'about'   => ['title' => 'About Page',   'fields' => ['about_tagline','about_mission','about_mission2']],
        'contact' => ['title' => 'Contact Page',  'fields' => []],
    ];

    public function index()
    {
        $settings = Setting::allKeyed();
        return Inertia::render('Admin/Pages/Index', [
            'pages'    => $this->pages,
            'settings' => $settings,
        ]);
    }

    public function update(Request $request, string $key)
    {
        foreach ($request->except('_token','_method') as $k => $v) {
            Setting::set($k, (string) $v);
        }
        return back()->with('success', ucfirst($key) . ' page updated.');
    }
}
