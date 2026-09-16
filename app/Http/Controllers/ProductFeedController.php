<?php
namespace App\Http\Controllers;

use App\Models\{Product, Setting};
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cache;

/**
 * Product feed for Meta (Facebook/Instagram) Commerce Manager and Google
 * Merchant Center — both accept the same RSS 2.0 + <g:...> namespace format,
 * so one feed serves both.
 *
 * Setup (one-time, in Meta Commerce Manager):
 *   Catalog → Add Items → Data Feed → paste this feed's URL → set a daily
 *   refresh schedule. From then on, price/stock/new-product changes on your
 *   site update your ads automatically — no manual re-uploads.
 */
class ProductFeedController extends Controller
{
    public function facebook(): Response
    {
        $xml = Cache::remember('feed_facebook_products_xml', 3600, function () {
            $baseUrl  = rtrim(Setting::get('site_url', url('/')), '/');
            $siteName = Setting::get('site_name', 'MILLIONAIRE');
            $currency = Setting::get('currency_code', 'PKR');

            $items = '';
            Product::with('productImages')->active()->where('stock', '>', 0)
                ->chunk(200, function ($products) use (&$items, $baseUrl, $currency) {
                    foreach ($products as $p) {
                        $availability = $p->stock > 0 ? 'in stock' : 'out of stock';
                        $price        = number_format((float) $p->price, 2, '.', '') . ' ' . $currency;
                        $salePrice    = ($p->compare_price && $p->compare_price > $p->price)
                            ? number_format((float) $p->price, 2, '.', '') . ' ' . $currency
                            : null;
                        // When there's a compare_price (i.e. a real discount), the
                        // "price" Meta shows struck-through should be the higher
                        // compare_price, with sale_price as the actual charged price.
                        $displayPrice = $salePrice
                            ? number_format((float) $p->compare_price, 2, '.', '') . ' ' . $currency
                            : $price;

                        $items .= "  <item>\n";
                        $items .= '    <g:id>' . $p->id . "</g:id>\n";
                        $items .= '    <g:title>' . self::esc($p->name) . "</g:title>\n";
                        $items .= '    <g:description>' . self::esc(strip_tags((string) $p->description)) . "</g:description>\n";
                        $items .= '    <g:link>' . self::esc($baseUrl . '/products/' . $p->slug) . "</g:link>\n";
                        $items .= '    <g:image_link>' . self::esc($baseUrl . self::normalizeImage($p->first_image)) . "</g:image_link>\n";
                        $items .= '    <g:availability>' . $availability . "</g:availability>\n";
                        $items .= "    <g:condition>new</g:condition>\n";
                        $items .= '    <g:price>' . $displayPrice . "</g:price>\n";
                        if ($salePrice) {
                            $items .= '    <g:sale_price>' . $salePrice . "</g:sale_price>\n";
                        }
                        $items .= '    <g:brand>' . self::esc($p->category->name ?? Setting::get('site_name', 'MILLIONAIRE')) . "</g:brand>\n";
                        $items .= '    <g:google_product_category>Apparel &amp; Accessories</g:google_product_category>' . "\n";
                        $items .= "  </item>\n";
                    }
                });

            $out  = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
            $out .= '<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">' . "\n";
            $out .= "<channel>\n";
            $out .= '  <title>' . self::esc($siteName) . " Product Feed</title>\n";
            $out .= '  <link>' . self::esc($baseUrl) . "</link>\n";
            $out .= "  <description>Live product catalog for Meta &amp; Google Ads</description>\n";
            $out .= $items;
            $out .= "</channel>\n</rss>";

            return $out;
        });

        return response($xml, 200, [
            'Content-Type'  => 'application/xml',
            'Cache-Control' => 'public, max-age=3600',
        ]);
    }

    private static function esc(string $v): string
    {
        return htmlspecialchars($v, ENT_QUOTES | ENT_XML1, 'UTF-8');
    }

    private static function normalizeImage(?string $path): string
    {
        if (!$path) return '/images/placeholder.jpg';
        if (str_starts_with($path, 'http')) return $path;
        return $path;
    }
}
