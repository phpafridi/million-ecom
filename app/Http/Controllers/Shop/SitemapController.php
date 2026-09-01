<?php
namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\{Product, Category, Setting};
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index(): Response
    {
        // Was loading every single product and category into memory at
        // once with zero caching — every bot crawl rebuilt the whole thing
        // from scratch, and at real scale (thousands of products) this
        // risked a memory spike on every crawl. Cached for 1 hour, and
        // products are chunked rather than loaded all at once.
        $xml = \Illuminate\Support\Facades\Cache::remember('sitemap_xml', 3600, function () {
            $baseUrl = rtrim(Setting::get('site_url', url('/')), '/');

            $xml  = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
            $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

            // Static pages
            $statics = [
                ['loc' => '/',             'priority' => '1.0',  'freq' => 'daily'],
                ['loc' => '/shop',         'priority' => '0.9',  'freq' => 'daily'],
                ['loc' => '/about',        'priority' => '0.6',  'freq' => 'monthly'],
                ['loc' => '/contact',      'priority' => '0.6',  'freq' => 'monthly'],
                ['loc' => '/track-order',  'priority' => '0.5',  'freq' => 'monthly'],
                ['loc' => '/new-arrivals', 'priority' => '0.8',  'freq' => 'daily'],
            ];

            foreach ($statics as $p) {
                $xml .= "  <url>\n";
                $xml .= "    <loc>{$baseUrl}{$p['loc']}</loc>\n";
                $xml .= "    <changefreq>{$p['freq']}</changefreq>\n";
                $xml .= "    <priority>{$p['priority']}</priority>\n";
                $xml .= "  </url>\n";
            }

            // Categories — usually a small, bounded number, fine to load all
            Category::active()->select('slug', 'updated_at')->each(function ($cat) use (&$xml, $baseUrl) {
                $xml .= "  <url>\n";
                $xml .= "    <loc>{$baseUrl}/shop?category={$cat->slug}</loc>\n";
                $xml .= "    <lastmod>" . $cat->updated_at->toAtomString() . "</lastmod>\n";
                $xml .= "    <changefreq>weekly</changefreq>\n";
                $xml .= "    <priority>0.8</priority>\n";
                $xml .= "  </url>\n";
            });

            // Products — chunked to avoid loading everything into memory at once
            Product::active()->select('slug', 'updated_at')->chunk(500, function ($products) use (&$xml, $baseUrl) {
                foreach ($products as $product) {
                    $xml .= "  <url>\n";
                    $xml .= "    <loc>{$baseUrl}/products/{$product->slug}</loc>\n";
                    $xml .= "    <lastmod>" . $product->updated_at->toAtomString() . "</lastmod>\n";
                    $xml .= "    <changefreq>weekly</changefreq>\n";
                    $xml .= "    <priority>0.9</priority>\n";
                    $xml .= "  </url>\n";
                }
            });

            $xml .= '</urlset>';
            return $xml;
        });

        return response($xml, 200, [
            'Content-Type'  => 'application/xml',
            'Cache-Control' => 'public, max-age=3600',
        ]);
    }

    public function robots(): Response
    {
        $baseUrl = rtrim(Setting::get('site_url', url('/')), '/');
        $ap      = Setting::get('admin_path', 'ml-admin');

        $txt = "User-agent: *\n";
        $txt .= "Allow: /\n";
        $txt .= "Disallow: /{$ap}/\n";
        $txt .= "Disallow: /cart\n";
        $txt .= "Disallow: /checkout\n";
        $txt .= "Disallow: /account\n";
        $txt .= "Disallow: /login\n";
        $txt .= "Disallow: /register\n\n";
        $txt .= "Sitemap: {$baseUrl}/sitemap.xml\n";

        return response($txt, 200, ['Content-Type' => 'text/plain']);
    }
}
