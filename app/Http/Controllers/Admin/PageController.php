<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PageController extends Controller
{
    private array $pages = [
        'about' => [
            'title'  => 'About Page',
            'icon'   => '🏆',
            'fields' => [
                ['key'=>'about_tagline',  'label'=>'Hero Tagline',  'type'=>'text'],
                ['key'=>'about_mission',  'label'=>'Our Mission (paragraph 1)', 'type'=>'textarea'],
                ['key'=>'about_mission2', 'label'=>'Our Mission (paragraph 2)', 'type'=>'textarea'],
                ['key'=>'about_vision',   'label'=>'Our Vision (paragraph 1)',  'type'=>'textarea'],
                ['key'=>'about_vision2',  'label'=>'Our Vision (paragraph 2)',  'type'=>'textarea'],
            ],
        ],
        'return-policy' => [
            'title'  => 'Return & Exchange Policy',
            'icon'   => '↩️',
            'fields' => [
                ['key'=>'policy_return_title',    'label'=>'Page Title',    'type'=>'text'],
                ['key'=>'policy_return_subtitle', 'label'=>'Subtitle',      'type'=>'text'],
                ['key'=>'policy_return_s1_title', 'label'=>'Section 1 — Title',   'type'=>'text'],
                ['key'=>'policy_return_s1',       'label'=>'Section 1 — Content', 'type'=>'textarea'],
                ['key'=>'policy_return_s2_title', 'label'=>'Section 2 — Title',   'type'=>'text'],
                ['key'=>'policy_return_s2',       'label'=>'Section 2 — Content', 'type'=>'textarea'],
                ['key'=>'policy_return_s3_title', 'label'=>'Section 3 — Title',   'type'=>'text'],
                ['key'=>'policy_return_s3',       'label'=>'Section 3 — Content', 'type'=>'textarea'],
                ['key'=>'policy_return_s4_title', 'label'=>'Section 4 — Title',   'type'=>'text'],
                ['key'=>'policy_return_s4',       'label'=>'Section 4 — Content', 'type'=>'textarea'],
                ['key'=>'policy_return_s5_title', 'label'=>'Section 5 — Title',   'type'=>'text'],
                ['key'=>'policy_return_s5',       'label'=>'Section 5 — Content', 'type'=>'textarea'],
                ['key'=>'policy_return_s6_title', 'label'=>'Section 6 — Title',   'type'=>'text'],
                ['key'=>'policy_return_s6',       'label'=>'Section 6 — Content', 'type'=>'textarea'],
                ['key'=>'policy_return_s7_title', 'label'=>'Section 7 — Title',   'type'=>'text'],
                ['key'=>'policy_return_s7',       'label'=>'Section 7 — Content', 'type'=>'textarea'],
                ['key'=>'policy_return_s8_title', 'label'=>'Section 8 — Title',   'type'=>'text'],
                ['key'=>'policy_return_s8',       'label'=>'Section 8 — Content', 'type'=>'textarea'],
            ],
        ],
        'privacy-policy' => [
            'title'  => 'Privacy Policy',
            'icon'   => '🔒',
            'fields' => [
                ['key'=>'policy_privacy_title',    'label'=>'Page Title', 'type'=>'text'],
                ['key'=>'policy_privacy_subtitle', 'label'=>'Subtitle',   'type'=>'text'],
                ['key'=>'policy_privacy_s1_title', 'label'=>'Section 1 — Title',   'type'=>'text'],
                ['key'=>'policy_privacy_s1',       'label'=>'Section 1 — Content', 'type'=>'textarea'],
                ['key'=>'policy_privacy_s2_title', 'label'=>'Section 2 — Title',   'type'=>'text'],
                ['key'=>'policy_privacy_s2',       'label'=>'Section 2 — Content', 'type'=>'textarea'],
                ['key'=>'policy_privacy_s3_title', 'label'=>'Section 3 — Title',   'type'=>'text'],
                ['key'=>'policy_privacy_s3',       'label'=>'Section 3 — Content', 'type'=>'textarea'],
                ['key'=>'policy_privacy_s4_title', 'label'=>'Section 4 — Title',   'type'=>'text'],
                ['key'=>'policy_privacy_s4',       'label'=>'Section 4 — Content', 'type'=>'textarea'],
                ['key'=>'policy_privacy_s5_title', 'label'=>'Section 5 — Title',   'type'=>'text'],
                ['key'=>'policy_privacy_s5',       'label'=>'Section 5 — Content', 'type'=>'textarea'],
                ['key'=>'policy_privacy_s6_title', 'label'=>'Section 6 — Title',   'type'=>'text'],
                ['key'=>'policy_privacy_s6',       'label'=>'Section 6 — Content', 'type'=>'textarea'],
            ],
        ],
        'terms' => [
            'title'  => 'Terms of Service',
            'icon'   => '📋',
            'fields' => [
                ['key'=>'policy_terms_title',    'label'=>'Page Title', 'type'=>'text'],
                ['key'=>'policy_terms_subtitle', 'label'=>'Subtitle',   'type'=>'text'],
                ['key'=>'policy_terms_s1_title', 'label'=>'Section 1 — Title',   'type'=>'text'],
                ['key'=>'policy_terms_s1',       'label'=>'Section 1 — Content', 'type'=>'textarea'],
                ['key'=>'policy_terms_s2_title', 'label'=>'Section 2 — Title',   'type'=>'text'],
                ['key'=>'policy_terms_s2',       'label'=>'Section 2 — Content', 'type'=>'textarea'],
                ['key'=>'policy_terms_s3_title', 'label'=>'Section 3 — Title',   'type'=>'text'],
                ['key'=>'policy_terms_s3',       'label'=>'Section 3 — Content', 'type'=>'textarea'],
                ['key'=>'policy_terms_s4_title', 'label'=>'Section 4 — Title',   'type'=>'text'],
                ['key'=>'policy_terms_s4',       'label'=>'Section 4 — Content', 'type'=>'textarea'],
                ['key'=>'policy_terms_s5_title', 'label'=>'Section 5 — Title',   'type'=>'text'],
                ['key'=>'policy_terms_s5',       'label'=>'Section 5 — Content', 'type'=>'textarea'],
                ['key'=>'policy_terms_s6_title', 'label'=>'Section 6 — Title',   'type'=>'text'],
                ['key'=>'policy_terms_s6',       'label'=>'Section 6 — Content', 'type'=>'textarea'],
                ['key'=>'policy_terms_s7_title', 'label'=>'Section 7 — Title',   'type'=>'text'],
                ['key'=>'policy_terms_s7',       'label'=>'Section 7 — Content', 'type'=>'textarea'],
                ['key'=>'policy_terms_s8_title', 'label'=>'Section 8 — Title',   'type'=>'text'],
                ['key'=>'policy_terms_s8',       'label'=>'Section 8 — Content', 'type'=>'textarea'],
            ],
        ],
        'shipping-policy' => [
            'title'  => 'Shipping Policy',
            'icon'   => '🚚',
            'fields' => [
                ['key'=>'policy_shipping_title',    'label'=>'Page Title', 'type'=>'text'],
                ['key'=>'policy_shipping_subtitle', 'label'=>'Subtitle',   'type'=>'text'],
                ['key'=>'policy_shipping_s1_title', 'label'=>'Section 1 — Title',   'type'=>'text'],
                ['key'=>'policy_shipping_s1',       'label'=>'Section 1 — Content', 'type'=>'textarea'],
                ['key'=>'policy_shipping_s2_title', 'label'=>'Section 2 — Title',   'type'=>'text'],
                ['key'=>'policy_shipping_s2',       'label'=>'Section 2 — Content', 'type'=>'textarea'],
                ['key'=>'policy_shipping_s3_title', 'label'=>'Section 3 — Title',   'type'=>'text'],
                ['key'=>'policy_shipping_s3',       'label'=>'Section 3 — Content', 'type'=>'textarea'],
                ['key'=>'policy_shipping_s4_title', 'label'=>'Section 4 — Title',   'type'=>'text'],
                ['key'=>'policy_shipping_s4',       'label'=>'Section 4 — Content', 'type'=>'textarea'],
                ['key'=>'policy_shipping_s5_title', 'label'=>'Section 5 — Title',   'type'=>'text'],
                ['key'=>'policy_shipping_s5',       'label'=>'Section 5 — Content', 'type'=>'textarea'],
                ['key'=>'policy_shipping_s6_title', 'label'=>'Section 6 — Title',   'type'=>'text'],
                ['key'=>'policy_shipping_s6',       'label'=>'Section 6 — Content', 'type'=>'textarea'],
            ],
        ],
        'payment-policy' => [
            'title'  => 'Payment Policy',
            'icon'   => '💳',
            'fields' => [
                ['key'=>'policy_payment_title',    'label'=>'Page Title', 'type'=>'text'],
                ['key'=>'policy_payment_subtitle', 'label'=>'Subtitle',   'type'=>'text'],
                ['key'=>'policy_payment_s1_title', 'label'=>'Section 1 — Title',   'type'=>'text'],
                ['key'=>'policy_payment_s1',       'label'=>'Section 1 — Content', 'type'=>'textarea'],
                ['key'=>'policy_payment_s2_title', 'label'=>'Section 2 — Title',   'type'=>'text'],
                ['key'=>'policy_payment_s2',       'label'=>'Section 2 — Content', 'type'=>'textarea'],
                ['key'=>'policy_payment_s3_title', 'label'=>'Section 3 — Title',   'type'=>'text'],
                ['key'=>'policy_payment_s3',       'label'=>'Section 3 — Content', 'type'=>'textarea'],
                ['key'=>'policy_payment_s4_title', 'label'=>'Section 4 — Title',   'type'=>'text'],
                ['key'=>'policy_payment_s4',       'label'=>'Section 4 — Content', 'type'=>'textarea'],
                ['key'=>'policy_payment_s5_title', 'label'=>'Section 5 — Title',   'type'=>'text'],
                ['key'=>'policy_payment_s5',       'label'=>'Section 5 — Content', 'type'=>'textarea'],
                ['key'=>'policy_payment_s6_title', 'label'=>'Section 6 — Title',   'type'=>'text'],
                ['key'=>'policy_payment_s6',       'label'=>'Section 6 — Content', 'type'=>'textarea'],
            ],
        ],
        'contact' => [
            'title'  => 'Contact Page',
            'icon'   => '📞',
            'fields' => [],
        ],
    ];

    public function index()
    {
        $allKeys = collect($this->pages)
            ->flatMap(fn($p) => collect($p['fields'])->pluck('key'))
            ->unique()->values()->toArray();

        $settings = Setting::allKeyed();

        return Inertia::render('Admin/Pages/Index', [
            'pages'    => $this->pages,
            'settings' => $settings,
        ]);
    }

    public function update(Request $request, string $key)
    {
        if (!isset($this->pages[$key])) abort(404);

        foreach ($request->except('_token', '_method') as $k => $v) {
            Setting::set($k, (string) $v);
        }

        return back()->with('success', ($this->pages[$key]['title'] ?? $key) . ' updated successfully.');
    }
}
