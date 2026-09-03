<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\HeroSlide;
use App\Services\UnsplashService;

class HeroSlideSeeder extends Seeder
{
    private const SLIDES = [
        [
            'title'    => 'Wear Your Status',
            'subtitle' => 'New Arrivals',
            'description' => 'Discover the new season collection.',
            'cta_text' => 'Shop Now',
            'cta_url'  => '/shop',
            'search'   => 'mens streetwear outfit portrait',
        ],
        [
            'title'    => 'End of Season Sale',
            'subtitle' => 'Up to 50% Off',
            'description' => "Don't miss the styles you love.",
            'cta_text' => 'Shop the Sale',
            'cta_url'  => '/shop?sort=discount',
            'discount_pct' => 50,
            'search'   => 'shopping bags retail store',
        ],
        [
            'title'    => 'Timeless Elegance',
            'subtitle' => 'Watches & Optical',
            'description' => 'Crafted for those who notice the details.',
            'cta_text' => 'Explore',
            'cta_url'  => '/category/millionaire-watches',
            'search'   => 'wristwatch closeup detail',
        ],
    ];

    public function run(): void
    {
        $unsplash = new UnsplashService();

        foreach (self::SLIDES as $i => $slide) {
            $exists = HeroSlide::where('title', $slide['title'])->first();
            if ($exists && $exists->image_path) continue; // already has an image, don't re-fetch

            $photo = $unsplash->photoUrl($slide['search']);

            HeroSlide::updateOrCreate(
                ['title' => $slide['title']],
                [
                    'subtitle'      => $slide['subtitle'],
                    'description'   => $slide['description'],
                    'cta_text'      => $slide['cta_text'],
                    'cta_url'       => $slide['cta_url'],
                    'discount_pct'  => $slide['discount_pct'] ?? 0,
                    'image_path'    => $photo,
                    'sort_order'    => $i + 1,
                    'is_active'     => true,
                ]
            );
        }
    }
}
