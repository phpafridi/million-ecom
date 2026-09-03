<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Services\UnsplashService;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    // Search terms are deliberately different from the display name —
    // "Millionaire Clothing" means nothing to a photo search, "mens
    // fashion clothing" does. Kept in one place so they're easy to tune
    // if a particular result doesn't land well.
    private const TREE = [
        'Millionaire Clothing' => [
            'search' => 'mens fashion clothing',
            'subs' => [
                "Men's Clothing"   => 'mens streetwear fashion',
                "Women's Clothing" => 'womens fashion clothing',
                'Kids Clothing'    => 'kids fashion clothing',
            ],
        ],
        'Millionaire Shoes' => [
            'search' => 'sneakers shoes fashion',
            'subs' => [
                "Men's Shoes"  => 'mens leather shoes',
                "Women's Shoes" => 'womens shoes fashion',
                'Sneakers'      => 'sneakers streetwear',
            ],
        ],
        'Millionaire Watches' => [
            'search' => 'luxury wristwatch',
            'subs' => [
                "Men's Watches"  => 'mens luxury watch',
                "Women's Watches" => 'womens watch elegant',
                'Smart Watches'   => 'smartwatch technology',
            ],
        ],
        'Millionaire Optical' => [
            'search' => 'sunglasses eyewear',
            'subs' => [
                'Sunglasses'                => 'aviator sunglasses gold',
                'Optical Frames'            => 'eyeglasses frames',
                'Prescription Frames'       => 'prescription glasses frames',
                'Premium / Luxury Frames'   => 'luxury designer eyeglasses',
            ],
        ],
        'Millionaire Accessories' => [
            'search' => 'mens fashion accessories',
            'subs' => [
                'Belts'    => 'leather belt fashion',
                'Wallets'  => 'leather wallet',
                'Caps'     => 'baseball cap fashion',
                'Jewelry'  => 'jewelry bracelet fashion',
            ],
        ],
        'Millionaire Perfumes' => [
            'search' => 'luxury perfume bottle',
            'subs' => [
                "Men's Perfumes"   => 'mens cologne bottle',
                "Women's Perfumes" => 'womens perfume bottle',
                'Gift Sets'         => 'perfume gift set',
            ],
        ],
    ];

    public function run(): void
    {
        // Cleans up the earlier Men/Women top-level attempt, in case that
        // version of this seeder already ran — this version keeps your
        // original 6 categories at the top level instead.
        $genderIds = Category::whereIn('slug', ['men', 'women'])->pluck('id');
        if ($genderIds->isNotEmpty()) {
            Category::whereIn('parent_id', $genderIds)->update(['is_active' => false, 'show_in_nav' => false]);
            Category::whereIn('id', $genderIds)->update(['is_active' => false, 'show_in_nav' => false]);
        }

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
                    'mobile_banner_image' => $photo,
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
                        'banner_image'        => $subPhoto,
                        'mobile_banner_image' => $subPhoto,
                    ], fn($v) => $v !== null)
                );
                $subOrder++;
            }
        }
    }
}
