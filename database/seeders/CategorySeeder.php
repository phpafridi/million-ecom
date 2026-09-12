<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Services\UnsplashService;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    // Men and Women are the only two top-level categories — confirmed
    // correct and intentional, not stale data (matches the live sidebar
    // filter structure). Each has 6 subcategories, and each of those now
    // has a 3rd level too, enabling the deeper circular carousel pattern
    // (matches the reference's "Accessories → Jewellery, Shawls,
    // Scarves..." style sections).
    private const TREE = [
        'Men' => [
            'search' => 'mens fashion editorial',
            'subs' => [
                "Men's Clothing" => [
                    'search' => 'mens streetwear fashion',
                    'items'  => ['Shirts', 'T-Shirts', 'Jackets', 'Pants', 'Hoodies'],
                ],
                "Men's Shoes" => [
                    'search' => 'mens leather shoes',
                    'items'  => ['Sneakers', 'Loafers', 'Formal Shoes', 'Boots'],
                ],
                "Men's Watches" => [
                    'search' => 'mens luxury watch',
                    'items'  => ['Chronograph', 'Dress Watches', 'Sport Watches'],
                ],
                "Men's Optical" => [
                    'search' => 'mens sunglasses eyewear',
                    'items'  => ['Sunglasses', 'Prescription Frames', 'Blue-Light Glasses'],
                ],
                "Men's Accessories" => [
                    'search' => 'mens fashion accessories',
                    'items'  => ['Belts', 'Wallets', 'Caps', 'Bracelets'],
                ],
                "Men's Perfumes" => [
                    'search' => 'mens cologne bottle',
                    'items'  => ['Eau de Parfum', 'Eau de Toilette', 'Gift Sets'],
                ],
            ],
        ],
        'Women' => [
            'search' => 'womens fashion editorial',
            'subs' => [
                "Women's Clothing" => [
                    'search' => 'womens fashion clothing',
                    'items'  => ['Dresses', 'Tops', 'Blazers', 'Trousers', 'Skirts'],
                ],
                "Women's Shoes" => [
                    'search' => 'womens shoes fashion',
                    'items'  => ['Heels', 'Flats', 'Sandals', 'Boots'],
                ],
                "Women's Watches" => [
                    'search' => 'womens watch elegant',
                    'items'  => ['Dress Watches', 'Bracelet Watches', 'Smart Watches'],
                ],
                "Women's Optical" => [
                    'search' => 'womens sunglasses eyewear',
                    'items'  => ['Sunglasses', 'Cat-Eye Frames', 'Prescription Frames'],
                ],
                "Women's Accessories" => [
                    'search' => 'womens fashion accessories',
                    'items'  => ['Jewellery', 'Scarves', 'Handbags', 'Hair Accessories'],
                ],
                "Women's Perfumes" => [
                    'search' => 'womens perfume bottle',
                    'items'  => ['Eau de Parfum', 'Eau de Toilette', 'Gift Sets'],
                ],
            ],
        ],
        'Kids' => [
            'search' => 'kids fashion clothing',
            'subs' => [
                "Kids Clothing" => [
                    'search' => 'kids clothing fashion',
                    'items'  => ['T-Shirts', 'Shorts', 'Dresses', 'Jackets'],
                ],
                "Kids Shoes" => [
                    'search' => 'kids shoes sneakers',
                    'items'  => ['Sneakers', 'Sandals', 'School Shoes'],
                ],
                "Kids Accessories" => [
                    'search' => 'kids accessories toys',
                    'items'  => ['Caps', 'Bags', 'Socks'],
                ],
            ],
        ],
    ];

    public function run(): void
    {
        $unsplash = new UnsplashService();
        $topOrder = 1;

        foreach (self::TREE as $topName => $data) {
            $photo = $unsplash->photoUrl($data['search']);

            $top = Category::updateOrCreate(
                ['slug' => Str::slug($topName)],
                array_filter([
                    'name'                => $topName,
                    'sort_order'          => $topOrder,
                    'nav_order'           => $topOrder,
                    'is_active'           => true,
                    'show_in_nav'         => true,
                    'image'               => $photo,
                    'mobile_image'        => $photo,
                    'banner_image'        => $photo,
                ], fn($v) => $v !== null)
            );
            $topOrder++;

            $subOrder = 1;
            foreach ($data['subs'] as $subName => $subData) {
                $subPhoto = $unsplash->photoUrl($subData['search']);

                $sub = Category::updateOrCreate(
                    ['slug' => Str::slug($subName)],
                    array_filter([
                        'name'                => $subName,
                        'parent_id'           => $top->id,
                        'sort_order'          => $subOrder,
                        'nav_order'           => $subOrder,
                        'is_active'           => true,
                        'show_in_nav'         => true,
                        'image'               => $subPhoto,
                        'mobile_image'        => $subPhoto,
                        'banner_image'        => $subPhoto,
                    ], fn($v) => $v !== null)
                );
                $subOrder++;

                // 3rd level — no Unsplash calls here at all (avoiding the
                // rate-limit wall from earlier in this session). Images
                // stay blank; upload real ones via admin whenever ready.
                $itemOrder = 1;
                foreach ($subData['items'] as $itemName) {
                    Category::updateOrCreate(
                        ['slug' => Str::slug($itemName . '-' . $subName)],
                        [
                            'name'        => $itemName,
                            'parent_id'   => $sub->id,
                            'sort_order'  => $itemOrder,
                            'nav_order'   => $itemOrder,
                            'is_active'   => true,
                            'show_in_nav' => false, // too deep for the main mega-menu, only shown in the category-page carousel
                        ]
                    );
                    $itemOrder++;
                }
            }
        }
    }
}
