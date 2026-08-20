<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class BannerSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('banners')->truncate();

        $hasVideo = Schema::hasColumn('banners', 'video_url');

        $banners = [
            [
                'title'      => 'MILLIONAIRE CLOTH',
                'subtitle'   => 'ROYAL COLLECTION — NEW ARRIVALS',
                'cta_text'   => 'Shop Now',
                'link'       => '/shop?category=millionaire-cloth',
                'position'   => 'full_hero',
                'image_path' => 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&q=80',
                'video_url'  => null, // Paste MP4 URL here or add from Admin panel
                'is_active'  => true,
            ],
            [
                'title'      => 'MILLIONAIRE WATCH',
                'subtitle'   => 'PRECISION. ELEGANCE. STATUS.',
                'cta_text'   => 'Explore',
                'link'       => '/shop?category=millionaire-watch',
                'position'   => 'wide_bottom',
                'image_path' => 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=80',
                'video_url'  => null,
                'is_active'  => true,
            ],
            [
                'title'      => 'OUD COLLECTION',
                'subtitle'   => 'MILLIONAIRE PERFUME',
                'cta_text'   => 'Discover',
                'link'       => '/shop?category=millionaire-perfume',
                'position'   => 'small_top_1',
                'image_path' => 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=700&q=80',
                'video_url'  => null,
                'is_active'  => true,
            ],
            [
                'title'      => 'PREMIUM FOOTWEAR',
                'subtitle'   => 'MILLIONAIRE SHOES',
                'cta_text'   => 'Shop',
                'link'       => '/shop?category=millionaire-shoes',
                'position'   => 'small_top_2',
                'image_path' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&q=80',
                'video_url'  => null,
                'is_active'  => true,
            ],
        ];

        foreach ($banners as $banner) {
            $row = [
                'title'      => $banner['title'],
                'subtitle'   => $banner['subtitle'],
                'cta_text'   => $banner['cta_text'],
                'link'       => $banner['link'],
                'position'   => $banner['position'],
                'image_path' => $banner['image_path'],
                'is_active'  => $banner['is_active'],
                'created_at' => now(),
                'updated_at' => now(),
            ];
            if ($hasVideo) $row['video_url'] = $banner['video_url'];

            DB::table('banners')->insert($row);
        }

        $this->command->info('✅ Banners seeded with video support!');
    }
}
