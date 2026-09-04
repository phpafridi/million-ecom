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

        // Every product assigned to a LEAF subcategory under Men or
        // Women (e.g. "mens-clothing", "womens-optical") — matches the
        // new 2-level tree from CategorySeeder. 3 products per
        // subcategory, 12 subcategories total = 36 products.
        $products = [
            'mens-clothing' => [
                ['name' => 'Signature Logo Hoodie',     'price' => 6500, 'compare' => 8500, 'featured' => true, 'search' => 'black hoodie mens fashion'],
                ['name' => 'Classic Oversized T-Shirt', 'price' => 3200, 'compare' => null, 'search' => 'oversized tshirt mens'],
                ['name' => 'Premium Bomber Jacket',     'price' => 12500, 'compare' => 15000, 'new' => true, 'search' => 'bomber jacket mens fashion'],
            ],
            'mens-shoes' => [
                ['name' => 'Street Runner Sneakers',    'price' => 9500, 'compare' => 12000, 'featured' => true, 'search' => 'mens running sneakers'],
                ['name' => 'Classic Leather Loafers',   'price' => 8200, 'compare' => null, 'search' => 'mens leather loafers'],
                ['name' => 'Formal Oxford Shoes',       'price' => 9800, 'compare' => 11000, 'new' => true, 'search' => 'mens oxford shoes formal'],
            ],
            'mens-watches' => [
                ['name' => 'Chrono Steel Watch',            'price' => 18500, 'compare' => 22000, 'featured' => true, 'search' => 'mens steel chronograph watch'],
                ['name' => 'Minimalist Leather Strap Watch','price' => 9800, 'compare' => null, 'search' => 'mens leather watch minimal'],
                ['name' => 'Diver Sport Watch',             'price' => 16000, 'compare' => 19000, 'new' => true, 'search' => 'mens dive sport watch'],
            ],
            'mens-optical' => [
                ['name' => 'Aviator Sunglasses — Gold', 'price' => 4500, 'compare' => 5500, 'featured' => true, 'search' => 'gold aviator sunglasses mens'],
                ['name' => 'Classic Wayfarer Sunglasses','price' => 3800, 'compare' => null, 'search' => 'wayfarer sunglasses black'],
                ['name' => 'Titanium Prescription Frames', 'price' => 7500, 'compare' => 9000, 'new' => true, 'search' => 'titanium glasses frames mens'],
            ],
            'mens-accessories' => [
                ['name' => 'Signature Buckle Belt',     'price' => 3800, 'compare' => 4500, 'featured' => true, 'search' => 'leather belt buckle fashion'],
                ['name' => 'Leather Card Holder Wallet', 'price' => 3200, 'compare' => null, 'search' => 'leather card wallet mens'],
                ['name' => 'Chain Link Bracelet',       'price' => 2800, 'compare' => 3400, 'new' => true, 'search' => 'chain bracelet jewelry mens'],
            ],
            'mens-perfumes' => [
                ['name' => 'Millionaire Noir EDP 100ml', 'price' => 8500, 'compare' => 10000, 'featured' => true, 'search' => 'black perfume bottle luxury mens'],
                ['name' => 'Millionaire Sport EDT 50ml', 'price' => 4500, 'compare' => 5500, 'new' => true, 'search' => 'cologne bottle sport mens'],
                ['name' => 'Millionaire Oud Intense',    'price' => 9800, 'compare' => null, 'search' => 'oud perfume bottle luxury'],
            ],
            'womens-clothing' => [
                ['name' => "Women's Silk Blouse",       'price' => 5200, 'compare' => 6200, 'featured' => true, 'search' => 'womens silk blouse fashion'],
                ['name' => "Women's Tailored Blazer",   'price' => 8900, 'compare' => null, 'search' => 'womens blazer fashion'],
                ['name' => "Women's Wrap Dress",        'price' => 6700, 'compare' => 7900, 'new' => true, 'search' => 'womens dress fashion elegant'],
            ],
            'womens-shoes' => [
                ['name' => "Women's Heeled Sandals",    'price' => 5400, 'compare' => 6200, 'featured' => true, 'search' => 'womens heels sandals'],
                ['name' => "Women's Ballet Flats",      'price' => 4200, 'compare' => null, 'search' => 'womens flats shoes'],
                ['name' => "Women's Ankle Boots",       'price' => 7600, 'compare' => 8900, 'new' => true, 'search' => 'womens ankle boots'],
            ],
            'womens-watches' => [
                ['name' => 'Rose Gold Dress Watch',     'price' => 21000, 'compare' => 25000, 'new' => true, 'search' => 'womens rose gold watch elegant'],
                ['name' => "Women's Bracelet Watch",    'price' => 14500, 'compare' => null, 'search' => 'womens bracelet watch'],
                ['name' => "Women's Mother of Pearl Watch", 'price' => 17800, 'compare' => 20000, 'featured' => true, 'search' => 'womens elegant watch pearl'],
            ],
            'womens-optical' => [
                ['name' => 'Round Acetate Frames',      'price' => 5200, 'compare' => null, 'search' => 'round eyeglasses frames womens'],
                ['name' => 'Gold-Trim Luxury Frames',   'price' => 15000, 'compare' => 18000, 'featured' => true, 'search' => 'gold trim luxury glasses womens'],
                ['name' => 'Cat-Eye Sunglasses',        'price' => 4600, 'compare' => 5400, 'new' => true, 'search' => 'cat eye sunglasses womens'],
            ],
            'womens-accessories' => [
                ['name' => 'Leather Tote Handbag',      'price' => 8500, 'compare' => 10000, 'featured' => true, 'search' => 'leather handbag womens fashion'],
                ['name' => 'Silk Scarf',                'price' => 2400, 'compare' => null, 'search' => 'silk scarf fashion womens'],
                ['name' => 'Statement Earrings',        'price' => 1900, 'compare' => 2300, 'new' => true, 'search' => 'statement earrings jewelry'],
            ],
            'womens-perfumes' => [
                ['name' => 'Millionaire Gold EDT 100ml', 'price' => 7200, 'compare' => null, 'search' => 'gold perfume bottle luxury womens'],
                ['name' => 'Millionaire Rose Bloom',     'price' => 7800, 'compare' => 8900, 'featured' => true, 'search' => 'rose perfume bottle womens'],
                ['name' => 'Millionaire Blush EDP',      'price' => 6900, 'compare' => null, 'search' => 'pink perfume bottle womens'],
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
