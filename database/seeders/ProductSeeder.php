<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\{Product, ProductImage, Category};
use App\Services\UnsplashService;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $unsplash = new UnsplashService();

        // Every product is assigned to the actual LEAF subcategory (e.g.
        // "mens-clothing"), never the parent ("millionaire-clothing") —
        // clicking into a specific subcategory needs its own products to
        // show, not just the top-level category. Every subcategory gets
        // at least 3 products.
        $products = [
            // ── Millionaire Clothing ──────────────────────────────────
            'mens-clothing' => [
                ['name' => 'Signature Logo Hoodie',     'price' => 6500, 'compare' => 8500, 'featured' => true, 'search' => 'black hoodie mens fashion'],
                ['name' => 'Classic Oversized T-Shirt', 'price' => 3200, 'compare' => null, 'search' => 'oversized tshirt mens'],
                ['name' => 'Premium Bomber Jacket',     'price' => 12500, 'compare' => 15000, 'new' => true, 'search' => 'bomber jacket mens fashion'],
            ],
            'womens-clothing' => [
                ['name' => "Women's Silk Blouse",       'price' => 5200, 'compare' => 6200, 'featured' => true, 'search' => 'womens silk blouse fashion'],
                ['name' => "Women's Tailored Blazer",   'price' => 8900, 'compare' => null, 'search' => 'womens blazer fashion'],
                ['name' => "Women's Wrap Dress",        'price' => 6700, 'compare' => 7900, 'new' => true, 'search' => 'womens dress fashion elegant'],
            ],
            'kids-clothing' => [
                ['name' => "Kids Graphic Tee",          'price' => 1800, 'compare' => null, 'search' => 'kids tshirt fashion'],
                ['name' => "Kids Denim Jacket",         'price' => 3400, 'compare' => 4000, 'featured' => true, 'search' => 'kids denim jacket fashion'],
                ['name' => "Kids Jogger Pants",         'price' => 2200, 'compare' => null, 'search' => 'kids joggers fashion'],
            ],

            // ── Millionaire Shoes ──────────────────────────────────────
            'mens-shoes' => [
                ['name' => 'Street Runner Sneakers',    'price' => 9500, 'compare' => 12000, 'featured' => true, 'search' => 'mens running sneakers'],
                ['name' => 'Classic Leather Loafers',   'price' => 8200, 'compare' => null, 'search' => 'mens leather loafers'],
                ['name' => 'Formal Oxford Shoes',       'price' => 9800, 'compare' => 11000, 'new' => true, 'search' => 'mens oxford shoes formal'],
            ],
            'womens-shoes' => [
                ['name' => "Women's Heeled Sandals",    'price' => 5400, 'compare' => 6200, 'featured' => true, 'search' => 'womens heels sandals'],
                ['name' => "Women's Ballet Flats",      'price' => 4200, 'compare' => null, 'search' => 'womens flats shoes'],
                ['name' => "Women's Ankle Boots",       'price' => 7600, 'compare' => 8900, 'new' => true, 'search' => 'womens ankle boots'],
            ],
            'sneakers' => [
                ['name' => 'High-Top Canvas Sneakers',  'price' => 6800, 'compare' => 8000, 'new' => true, 'search' => 'high top canvas sneakers'],
                ['name' => 'Low-Top Retro Sneakers',    'price' => 7200, 'compare' => null, 'search' => 'retro low top sneakers'],
                ['name' => 'Chunky Sole Sneakers',      'price' => 8500, 'compare' => 9800, 'featured' => true, 'search' => 'chunky sneakers streetwear'],
            ],

            // ── Millionaire Watches ────────────────────────────────────
            'mens-watches' => [
                ['name' => 'Chrono Steel Watch',            'price' => 18500, 'compare' => 22000, 'featured' => true, 'search' => 'mens steel chronograph watch'],
                ['name' => 'Minimalist Leather Strap Watch','price' => 9800, 'compare' => null, 'search' => 'mens leather watch minimal'],
                ['name' => 'Diver Sport Watch',             'price' => 16000, 'compare' => 19000, 'new' => true, 'search' => 'mens dive sport watch'],
            ],
            'womens-watches' => [
                ['name' => 'Rose Gold Dress Watch',     'price' => 21000, 'compare' => 25000, 'new' => true, 'search' => 'womens rose gold watch elegant'],
                ['name' => "Women's Bracelet Watch",    'price' => 14500, 'compare' => null, 'search' => 'womens bracelet watch'],
                ['name' => "Women's Mother of Pearl Watch", 'price' => 17800, 'compare' => 20000, 'featured' => true, 'search' => 'womens elegant watch pearl'],
            ],
            'smart-watches' => [
                ['name' => 'Fitness Smart Watch',       'price' => 12500, 'compare' => 15000, 'featured' => true, 'search' => 'smartwatch fitness technology'],
                ['name' => 'Classic Smart Watch',       'price' => 15800, 'compare' => null, 'search' => 'smartwatch technology modern'],
                ['name' => 'Sport Smart Watch',         'price' => 13900, 'compare' => 16000, 'new' => true, 'search' => 'sport smartwatch technology'],
            ],

            // ── Millionaire Optical → Sunglasses ──────────────────────
            'sunglasses' => [
                ['name' => 'Aviator Sunglasses — Gold', 'price' => 4500, 'compare' => 5500, 'featured' => true, 'search' => 'gold aviator sunglasses'],
                ['name' => 'Classic Wayfarer Sunglasses','price' => 3800, 'compare' => null, 'search' => 'wayfarer sunglasses black'],
                ['name' => 'Sport Wraparound Sunglasses','price' => 4200, 'compare' => 5000, 'new' => true, 'search' => 'sport sunglasses wraparound'],
            ],
            'optical-frames' => [
                ['name' => 'Round Acetate Frames',      'price' => 5200, 'compare' => null, 'search' => 'round eyeglasses frames'],
                ['name' => 'Slim Rectangle Frames',     'price' => 4800, 'compare' => 5800, 'featured' => true, 'search' => 'rectangle eyeglasses frames'],
                ['name' => 'Clear Blue-Light Frames',   'price' => 4500, 'compare' => null, 'search' => 'clear glasses frames'],
            ],
            'prescription-frames' => [
                ['name' => 'Titanium Prescription Frames', 'price' => 7500, 'compare' => 9000, 'new' => true, 'search' => 'titanium glasses frames'],
                ['name' => 'Classic Prescription Frames',  'price' => 5500, 'compare' => null, 'search' => 'prescription glasses classic'],
                ['name' => 'Lightweight Flex Frames',      'price' => 6200, 'compare' => 7200, 'search' => 'flexible glasses frames'],
            ],
            'premium-luxury-frames' => [
                ['name' => 'Gold-Trim Luxury Frames',         'price' => 15000, 'compare' => 18000, 'featured' => true, 'search' => 'gold trim luxury glasses'],
                ['name' => 'Handcrafted Tortoiseshell Frames','price' => 12800, 'compare' => null, 'search' => 'tortoiseshell glasses frames'],
                ['name' => 'Limited Edition Designer Frames', 'price' => 22000, 'compare' => 26000, 'new' => true, 'search' => 'designer eyeglasses luxury'],
            ],

            // ── Millionaire Accessories ────────────────────────────────
            'belts' => [
                ['name' => 'Signature Buckle Belt',     'price' => 3800, 'compare' => 4500, 'featured' => true, 'search' => 'leather belt buckle fashion'],
                ['name' => 'Reversible Leather Belt',   'price' => 4200, 'compare' => null, 'search' => 'reversible leather belt'],
                ['name' => 'Woven Casual Belt',         'price' => 2600, 'compare' => 3100, 'new' => true, 'search' => 'woven belt casual fashion'],
            ],
            'wallets' => [
                ['name' => 'Leather Card Holder Wallet', 'price' => 3200, 'compare' => null, 'search' => 'leather card wallet'],
                ['name' => 'Bifold Leather Wallet',      'price' => 3600, 'compare' => 4200, 'featured' => true, 'search' => 'bifold leather wallet mens'],
                ['name' => 'Zip Around Wallet',          'price' => 4100, 'compare' => null, 'search' => 'zip wallet leather'],
            ],
            'caps' => [
                ['name' => 'Stainless Steel Cap',       'price' => 2200, 'compare' => null, 'search' => 'baseball cap fashion'],
                ['name' => 'Classic Snapback Cap',      'price' => 2400, 'compare' => 2900, 'featured' => true, 'search' => 'snapback cap streetwear'],
                ['name' => 'Structured Dad Cap',        'price' => 1900, 'compare' => null, 'search' => 'dad cap fashion'],
            ],
            'jewelry' => [
                ['name' => 'Chain Link Bracelet',       'price' => 2800, 'compare' => 3400, 'new' => true, 'search' => 'chain bracelet jewelry'],
                ['name' => 'Signet Ring',               'price' => 3200, 'compare' => null, 'search' => 'signet ring jewelry mens'],
                ['name' => 'Cuban Link Necklace',       'price' => 4500, 'compare' => 5200, 'featured' => true, 'search' => 'cuban link chain necklace'],
            ],

            // ── Millionaire Perfumes ───────────────────────────────────
            'mens-perfumes' => [
                ['name' => 'Millionaire Noir EDP 100ml', 'price' => 8500, 'compare' => 10000, 'featured' => true, 'search' => 'black perfume bottle luxury mens'],
                ['name' => 'Millionaire Sport EDT 50ml', 'price' => 4500, 'compare' => 5500, 'new' => true, 'search' => 'cologne bottle sport mens'],
                ['name' => 'Millionaire Oud Intense',    'price' => 9800, 'compare' => null, 'search' => 'oud perfume bottle luxury'],
            ],
            'womens-perfumes' => [
                ['name' => 'Millionaire Gold EDT 100ml', 'price' => 7200, 'compare' => null, 'search' => 'gold perfume bottle luxury womens'],
                ['name' => 'Millionaire Rose Bloom',     'price' => 7800, 'compare' => 8900, 'featured' => true, 'search' => 'rose perfume bottle womens'],
                ['name' => 'Millionaire Blush EDP',      'price' => 6900, 'compare' => null, 'search' => 'pink perfume bottle womens'],
            ],
            'gift-sets' => [
                ['name' => 'Couples Perfume Gift Set',   'price' => 12500, 'compare' => 15000, 'featured' => true, 'search' => 'perfume gift set luxury'],
                ['name' => 'Travel Size Gift Set',       'price' => 6500, 'compare' => null, 'search' => 'perfume travel set gift'],
                ['name' => 'Deluxe Fragrance Gift Box',  'price' => 15800, 'compare' => 18500, 'new' => true, 'search' => 'fragrance gift box luxury'],
            ],
        ];

        foreach ($products as $categorySlug => $items) {
            $category = Category::where('slug', $categorySlug)->first();
            if (!$category) continue;

            foreach ($items as $i => $item) {
                $slug = Str::slug($item['name']);
                $product = Product::updateOrCreate(
                    ['slug' => $slug],
                    [
                        'name'          => $item['name'],
                        'description'   => "Premium quality {$item['name']} from Millionaire — crafted for those who wear their status.",
                        'price'         => $item['price'],
                        'compare_price' => $item['compare'] ?? null,
                        'category_id'   => $category->id,
                        'stock'         => rand(15, 60),
                        'is_featured'   => $item['featured'] ?? false,
                        'is_new'        => $item['new'] ?? false,
                        'is_active'     => true,
                        'sort_order'    => $i + 1,
                    ]
                );

                if (!$product->productImages()->exists()) {
                    $photo = $unsplash->photoUrl($item['search']);
                    if ($photo) {
                        ProductImage::create([
                            'product_id' => $product->id,
                            'path'       => $photo,
                            'sort_order' => 1,
                        ]);
                    }
                }
            }
        }
    }
}
