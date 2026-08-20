<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class HeroSlideSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('hero_slides')->truncate();

        $slides = [
            [
                'title'        => 'MILLIONAIRE',
                'subtitle'     => 'Wear Your Status',
                'description'  => 'Premium fashion and lifestyle designed for those who know their worth.',
                'cta_text'     => 'Explore Collection',
                'cta_url'      => '/shop',
                'discount_pct' => 0,
                'image_path'   => 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1400&q=80',
                'sort_order'   => 1,
                'is_active'    => true,
            ],
            [
                'title'        => 'MILLIONAIRE CLOTH',
                'subtitle'     => 'Royal Collection',
                'description'  => 'Premium cotton. Six signature colors. One identity.',
                'cta_text'     => 'Shop Millionaire Cloth',
                'cta_url'      => '/shop?category=millionaire-cloth',
                'discount_pct' => 0,
                'image_path'   => 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1400&q=80',
                'sort_order'   => 2,
                'is_active'    => true,
            ],
            [
                'title'        => 'OUD AL MILLIONAIRE',
                'subtitle'     => 'Signature Fragrance',
                'description'  => 'A scent that commands every room. Rich oud. Lasting impression.',
                'cta_text'     => 'Discover Perfumes',
                'cta_url'      => '/shop?category=millionaire-perfume',
                'discount_pct' => 0,
                'image_path'   => 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=1400&q=80',
                'sort_order'   => 3,
                'is_active'    => true,
            ],
            [
                'title'        => 'MILLIONAIRE WATCH',
                'subtitle'     => 'Precision. Elegance. Status.',
                'description'  => 'Luxury timepieces crafted for those who value every second.',
                'cta_text'     => 'Shop Watches',
                'cta_url'      => '/shop?category=millionaire-watch',
                'discount_pct' => 0,
                'image_path'   => 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1400&q=80',
                'sort_order'   => 4,
                'is_active'    => true,
            ],
        ];

        foreach ($slides as $slide) {
            DB::table('hero_slides')->insert([...$slide, 'created_at' => now(), 'updated_at' => now()]);
        }

        $this->command->info('✅ Millionaire hero slides seeded.');
    }
}
