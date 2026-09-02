<?php
namespace App\Traits;

trait SeoHelper
{
    /**
     * Build SEO array for a product page
     */
    protected function productSeo($product, string $baseUrl): array
    {
        $image = $product->productImages->first()?->url ?? asset('images/og-default.jpg');

        return [
            'title'       => $product->name . ' | ' . config('app.name'),
            'description' => strip_tags(substr($product->description ?? '', 0, 160)),
            'image'       => $image,
            'url'         => $baseUrl . '/products/' . $product->slug,
            'type'        => 'product',
            'keywords'    => $product->name . ', ' . ($product->category?->name ?? '') . ', buy online Pakistan',
            'schema'      => [
                '@context'    => 'https://schema.org',
                '@type'       => 'Product',
                'name'        => $product->name,
                'description' => strip_tags($product->description ?? ''),
                'image'       => $image,
                'url'         => $baseUrl . '/products/' . $product->slug,
                'brand'       => ['@type' => 'Brand', 'name' => config('app.name')],
                'offers'      => [
                    '@type'         => 'Offer',
                    'price'         => (string) $product->price,
                    'priceCurrency' => 'PKR',
                    'availability'  => $product->stock > 0
                        ? 'https://schema.org/InStock'
                        : 'https://schema.org/OutOfStock',
                    'url'           => $baseUrl . '/products/' . $product->slug,
                    'seller'        => ['@type' => 'Organization', 'name' => config('app.name')],
                ],
                'aggregateRating' => $product->review_count > 0 ? [
                    '@type'       => 'AggregateRating',
                    'ratingValue' => (string) $product->avg_rating,
                    'reviewCount' => (string) $product->review_count,
                ] : null,
            ],
        ];
    }

    /**
     * Build SEO array for a category/shop page
     */
    protected function categorySeo(?object $category, string $baseUrl): array
    {
        if (!$category) {
            return [
                'title'       => 'Shop All Products | ' . config('app.name'),
                'description' => 'Browse our full collection of premium clothes, perfumes, shoes, watches and sunglasses.',
                'url'         => $baseUrl . '/shop',
                'type'        => 'website',
            ];
        }

        // banner_image is stored as a portable relative path (/uploads/...,
        // via ImageService), not a "storage/" relative path — asset('storage/'
        // . $x) was building a URL to a file that doesn't exist there at all.
        $categoryImage = $category->banner_image
            ? (str_starts_with($category->banner_image, 'http') ? $category->banner_image : $baseUrl . $category->banner_image)
            : null;

        return [
            'title'       => $category->name . ' | ' . config('app.name'),
            'description' => strip_tags(substr($category->description ?? "Shop {$category->name} online in Pakistan.", 0, 160)),
            'image'       => $categoryImage,
            'url'         => $baseUrl . '/shop?category=' . $category->slug,
            'type'        => 'website',
            'keywords'    => $category->name . ', buy ' . $category->name . ' online Pakistan',
            'schema'      => [
                '@context'        => 'https://schema.org',
                '@type'           => 'CollectionPage',
                'name'            => $category->name,
                'description'     => strip_tags($category->description ?? ''),
                'url'             => $baseUrl . '/shop?category=' . $category->slug,
            ],
        ];
    }

    /**
     * Build SEO for home page
     */
    protected function homeSeo(array $settings, string $baseUrl): array
    {
        // Was reading $settings['logo'] — that key never actually exists;
        // the real setting is 'logo_url' (confirmed against
        // SettingController, which saves it under that name). This meant
        // the Organization schema's logo was always empty. Also fixing the
        // same asset('storage/'...) issue as categorySeo() — logo_url is
        // already a portable /uploads/... path, not a storage/ one.
        $logo = !empty($settings['logo_url'])
            ? (str_starts_with($settings['logo_url'], 'http') ? $settings['logo_url'] : $baseUrl . $settings['logo_url'])
            : null;

        return [
            'title'       => $settings['seo_title']       ?? (($settings['site_name'] ?? config('app.name')) . ' | Premium Fashion Pakistan'),
            'description' => $settings['seo_description'] ?? 'Shop premium clothes, perfumes, shoes, watches and sunglasses. Fast delivery across Pakistan.',
            'image'       => $settings['seo_image']       ?? $logo,
            'url'         => $baseUrl,
            'type'        => 'website',
            'schema'      => [
                '@context'    => 'https://schema.org',
                '@type'       => 'Organization',
                'name'        => $settings['site_name'] ?? config('app.name'),
                'url'         => $baseUrl,
                'logo'        => $logo,
                'contactPoint'=> [
                    '@type'             => 'ContactPoint',
                    'telephone'         => $settings['phone'] ?? '',
                    'contactType'       => 'customer service',
                    'availableLanguage' => ['English', 'Urdu'],
                ],
                'address' => [
                    '@type'           => 'PostalAddress',
                    'addressCountry'  => 'PK',
                    'addressLocality' => $settings['city'] ?? 'Pakistan',
                ],
            ],
        ];
    }
}
