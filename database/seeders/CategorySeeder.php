<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Services\UnsplashService;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    // Men and Women are now the only two top-level categories — the
    // landing page shows just these two as full-bleed picture tiles.
    // Everything that used to be top-level (Clothing, Shoes, Watches,
    // Optical, Accessories, Perfumes) is now a subcategory under each,
    // so clicking Men/Women shows these as the next set of full-cover
    // picture tiles, exactly like Optical's drill-down already worked.
    private const TREE = [
        'Men' => [
            'search' => 'mens fashion editorial',
            'subs' => [
                "Men's Clothing"     => 'mens streetwear fashion',
                "Men's Shoes"        => 'mens leather shoes',
                "Men's Watches"      => 'mens luxury watch',
                "Men's Optical"      => 'mens sunglasses eyewear',
                "Men's Accessories"  => 'mens fashion accessories',
                "Men's Perfumes"     => 'mens cologne bottle',
            ],
        ],
        'Women' => [
            'search' => 'womens fashion editorial',
            'subs' => [
                "Women's Clothing"    => 'womens fashion clothing',
                "Women's Shoes"       => 'womens shoes fashion',
                "Women's Watches"     => 'womens watch elegant',
                "Women's Optical"     => 'womens sunglasses eyewear',
                "Women's Accessories" => 'womens fashion accessories',
                "Women's Perfumes"    => 'womens perfume bottle',
            ],
        ],
    ];

    public function run(): void
    {
        // Deactivate the old flat 6-category structure — replaced by the
        // Men/Women tree, not deleted (existing seeded products stay
        // safely linked to their category_id, just hidden from nav).
        Category::whereIn('slug', [
            'millionaire-clothing', 'millionaire-shoes', 'millionaire-watches',
            'millionaire-optical', 'millionaire-accessories', 'millionaire-perfumes',
            'mens-clothing', 'womens-clothing', 'kids-clothing',
            'mens-shoes', 'womens-shoes', 'sneakers',
            'mens-watches', 'womens-watches', 'smart-watches',
            'sunglasses', 'optical-frames', 'prescription-frames', 'premium-luxury-frames',
            'belts', 'wallets', 'caps', 'jewelry',
            'mens-perfumes', 'womens-perfumes', 'gift-sets',
        ])->update(['is_active' => false, 'show_in_nav' => false]);

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
                ], fn($v) => $v !== null)
            );
            $topOrder++;

            $subOrder = 1;
            foreach ($data['subs'] as $subName => $subQuery) {
                $subPhoto = $unsplash->photoUrl($subQuery);

                Category::updateOrCreate(
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
                    ], fn($v) => $v !== null)
                );
                $subOrder++;
            }
        }
    }
}
