<?php

namespace App\Http\Controllers;

use App\Models\{Product, Category, Setting};
use Illuminate\Http\Response;

class SeoController extends Controller
{
    public function sitemap(): Response
    {
        $baseUrl = Setting::get('site_url', url('/'));
        $urls = [
            ['loc' => $baseUrl, 'priority' => '1.0'],
            ['loc' => $baseUrl . '/shop', 'priority' => '0.9'],
            ['loc' => $baseUrl . '/about', 'priority' => '0.5'],
            ['loc' => $baseUrl . '/contact', 'priority' => '0.5'],
        ];

        foreach (Category::active()->get() as $cat) {
            $urls[] = ['loc' => $baseUrl . '/shop?category=' . $cat->slug, 'priority' => '0.7'];
        }

        foreach (Product::active()->get() as $product) {
            $urls[] = [
                'loc'      => $baseUrl . '/products/' . $product->slug,
                'priority' => '0.6',
                'lastmod'  => $product->updated_at->toAtomString(),
            ];
        }

        $xml = view('seo.sitemap', compact('urls'))->render();
        return response($xml, 200)->header('Content-Type', 'text/xml');
    }

    public function robots(): Response
    {
        $indexingEnabled = Setting::get('seo_indexing_enabled', '1') === '1';
        $baseUrl = Setting::get('site_url', url('/'));

        if ($indexingEnabled) {
            $content = "User-agent: *\nAllow: /\n\nSitemap: {$baseUrl}/sitemap.xml";
        } else {
            $content = "User-agent: *\nDisallow: /";
        }

        return response($content, 200)->header('Content-Type', 'text/plain');
    }
}
