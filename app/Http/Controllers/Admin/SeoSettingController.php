<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SeoSettingController extends Controller
{
    public function index()
    {
        $s = Setting::allKeyed();

        return Inertia::render('Admin/Seo/Index', [
            'seo' => [
                'meta_title'           => $s['meta_title']           ?? '',
                'meta_description'     => $s['meta_description']     ?? '',
                'meta_keywords'        => $s['meta_keywords']        ?? '',
                'site_url'             => $s['site_url']             ?? url('/'),
                'favicon_url'          => $s['favicon_url']          ?? null,
                'og_image_url'         => $s['og_image_url']         ?? null,
                'seo_indexing_enabled' => $s['seo_indexing_enabled'] ?? '1',
                'custom_head_scripts'  => $s['custom_head_scripts']  ?? '',
            ],
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'meta_title'           => 'nullable|string|max:70',
            'meta_description'     => 'nullable|string|max:160',
            'meta_keywords'        => 'nullable|string|max:255',
            'site_url'             => 'nullable|string|max:255',
            'seo_indexing_enabled' => 'nullable|in:0,1',
            'custom_head_scripts'  => 'nullable|string',
            'favicon'              => 'nullable|image|mimes:png,ico,jpg,webp|max:1024',
            'og_image'             => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        // Save text fields
        foreach (['meta_title','meta_description','meta_keywords','site_url','seo_indexing_enabled','custom_head_scripts'] as $key) {
            if ($request->has($key)) {
                Setting::set($key, (string) $request->input($key));
            }
        }

        // ── Favicon — auto-crop to 64×64 ─────────────────────────────
        if ($request->hasFile('favicon')) {
            $url = ImageService::process(
                $request->file('favicon'),
                'seo',
                'favicon',
                'favicon_' . time()
            );
            Setting::set('favicon_url', $url);
        }

        // ── OG Image — auto-crop to 1200×630 ─────────────────────────
        if ($request->hasFile('og_image')) {
            $url = ImageService::process(
                $request->file('og_image'),
                'seo',
                'og_image',
                'og_image_' . time()
            );
            Setting::set('og_image_url', $url);
        }

        return back()->with('success', 'SEO settings saved! Favicon and social image updated.');
    }
}
