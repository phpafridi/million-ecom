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
                // The tracking pixels (GA/GTM/FB/TikTok) turned out to
                // already have their own dedicated Analytics page — adding
                // them here too would have been the exact duplication this
                // whole reorganization is meant to fix. Only this one is
                // genuinely unique to SEO.
                'google_site_verification' => $s['google_site_verification'] ?? '',
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
            'google_site_verification' => 'nullable|string|max:100',
        ]);

        // custom_head_scripts renders raw, unescaped HTML/JS into every
        // single customer page load — the real risk here isn't a remote
        // attacker (this route already requires admin auth), it's blast
        // radius: any 'staff' role account could otherwise inject
        // site-wide malicious JS if that lower-privileged account is ever
        // compromised, not just a genuine 'admin' account. Restricting to
        // admin-only meaningfully shrinks that blast radius — unlike
        // pattern-matching for "gtag(" substrings, which a single comment
        // containing that string trivially defeats while injecting
        // anything else alongside it.
        $keys = ['meta_title','meta_description','meta_keywords','site_url','seo_indexing_enabled',
            'google_site_verification'];
        if (auth()->user()->role === 'admin') {
            $keys[] = 'custom_head_scripts';
        } elseif ($request->filled('custom_head_scripts')) {
            return back()->withErrors(['custom_head_scripts' => 'Only full admin accounts can edit custom head scripts.']);
        }

        // Save text fields
        foreach ($keys as $key) {
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
