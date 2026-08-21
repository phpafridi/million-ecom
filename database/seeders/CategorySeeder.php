<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        DB::table('categories')->delete();

        $hasGender    = Schema::hasColumn('categories', 'gender');
        $hasBrandLine = Schema::hasColumn('categories', 'brand_line');

        $main = [
            ['name'=>'Men','slug'=>'men','gender'=>'men','icon'=>'👔','color'=>'#1a1a1a','nav_order'=>1,'sort_order'=>1,
             'image'=>'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80',
             'banner_image'=>'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1400&q=80',
             'description'=>'Premium menswear.',
             'children'=>[
                ['name'=>'Clothing',    'slug'=>'men-clothing',    'sort_order'=>1,'image'=>'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80'],
                ['name'=>'Shoes',       'slug'=>'men-shoes',       'sort_order'=>2,'image'=>'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=400&q=80'],
                ['name'=>'Watches',     'slug'=>'men-watches',     'sort_order'=>3,'image'=>'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80'],
                ['name'=>'Perfumes',    'slug'=>'men-perfumes',    'sort_order'=>4,'image'=>'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80'],
                ['name'=>'Sunglasses',  'slug'=>'men-sunglasses',  'sort_order'=>5,'image'=>'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80'],
                ['name'=>'Accessories', 'slug'=>'men-accessories', 'sort_order'=>6,'image'=>'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80'],
            ]],
            ['name'=>'Women','slug'=>'women','gender'=>'women','icon'=>'👗','color'=>'#1a1a1a','nav_order'=>2,'sort_order'=>2,
             'image'=>'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80',
             'banner_image'=>'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&q=80',
             'description'=>'Premium womenswear.',
             'children'=>[
                ['name'=>'Clothing',    'slug'=>'women-clothing',    'sort_order'=>1,'image'=>'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&q=80'],
                ['name'=>'Shoes',       'slug'=>'women-shoes',       'sort_order'=>2,'image'=>'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80'],
                ['name'=>'Perfumes',    'slug'=>'women-perfumes',    'sort_order'=>3,'image'=>'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=400&q=80'],
                ['name'=>'Watches',     'slug'=>'women-watches',     'sort_order'=>4,'image'=>'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=400&q=80'],
                ['name'=>'Sunglasses',  'slug'=>'women-sunglasses',  'sort_order'=>5,'image'=>'https://images.unsplash.com/photo-1577803645773-f96470509666?w=400&q=80'],
                ['name'=>'Accessories', 'slug'=>'women-accessories', 'sort_order'=>6,'image'=>'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80'],
            ]],
            ['name'=>'Millionaire Cloth','slug'=>'millionaire-cloth','brand_line'=>'millionaire_cloth','icon'=>'💎','color'=>'#C9A84C','nav_order'=>3,'sort_order'=>3,
             'image'=>'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&q=80',
             'banner_image'=>'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1400&q=80',
             'description'=>'Premium cotton. Designed for those who know their worth.',
             'children'=>[
                ['name'=>'Royal Collection',     'slug'=>'cloth-royal',     'sort_order'=>1,'image'=>'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80'],
                ['name'=>'Classic Collection',   'slug'=>'cloth-classic',   'sort_order'=>2,'image'=>'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80'],
                ['name'=>'Essential Collection', 'slug'=>'cloth-essential', 'sort_order'=>3,'image'=>'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80'],
                ['name'=>'Value Collection',     'slug'=>'cloth-value',     'sort_order'=>4,'image'=>'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&q=80'],
            ]],
            ['name'=>'Millionaire Perfume','slug'=>'millionaire-perfume','brand_line'=>'millionaire_perfume','icon'=>'🌸','color'=>'#C9A84C','nav_order'=>4,'sort_order'=>4,
             'image'=>'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&q=80',
             'banner_image'=>'https://images.unsplash.com/photo-1541643600914-78b084683702?w=1400&q=80',
             'description'=>'Luxury fragrances and signature scents.',
             'children'=>[
                ['name'=>"Men's Fragrance",  'slug'=>'perfume-men',   'sort_order'=>1,'image'=>'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80'],
                ['name'=>"Women's Fragrance",'slug'=>'perfume-women', 'sort_order'=>2,'image'=>'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=400&q=80'],
                ['name'=>'Oud Collection',    'slug'=>'perfume-oud',   'sort_order'=>3,'image'=>'https://images.unsplash.com/photo-1583467875263-d50ab73e8b97?w=400&q=80'],
                ['name'=>'Gift Sets',         'slug'=>'perfume-gifts', 'sort_order'=>4,'image'=>'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=400&q=80'],
            ]],
            ['name'=>'Millionaire Shoes','slug'=>'millionaire-shoes','brand_line'=>'millionaire_shoes','icon'=>'👟','color'=>'#C9A84C','nav_order'=>5,'sort_order'=>5,
             'image'=>'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
             'banner_image'=>'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1400&q=80',
             'description'=>'Premium footwear for every occasion.',
             'children'=>[
                ['name'=>"Men's Shoes",  'slug'=>'shoes-men',     'sort_order'=>1,'image'=>'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=400&q=80'],
                ['name'=>"Women's Shoes",'slug'=>'shoes-women',   'sort_order'=>2,'image'=>'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80'],
                ['name'=>'Formal',        'slug'=>'shoes-formal',  'sort_order'=>3,'image'=>'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=400&q=80'],
                ['name'=>'Sneakers',      'slug'=>'shoes-sneakers','sort_order'=>4,'image'=>'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80'],
            ]],
            ['name'=>'Millionaire Watch','slug'=>'millionaire-watch','brand_line'=>'millionaire_watch','icon'=>'⌚','color'=>'#C9A84C','nav_order'=>6,'sort_order'=>6,
             'image'=>'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
             'banner_image'=>'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1400&q=80',
             'description'=>'Luxury timepieces.',
             'children'=>[
                ['name'=>"Men's Watches",  'slug'=>'watch-men',   'sort_order'=>1,'image'=>'https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=400&q=80'],
                ['name'=>"Women's Watches",'slug'=>'watch-women', 'sort_order'=>2,'image'=>'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=400&q=80'],
                ['name'=>'Luxury',          'slug'=>'watch-luxury','sort_order'=>3,'image'=>'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=400&q=80'],
                ['name'=>'Smart Watches',   'slug'=>'watch-smart', 'sort_order'=>4,'image'=>'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&q=80'],
            ]],
            ['name'=>'Millionaire Sunglasses','slug'=>'millionaire-sunglasses','brand_line'=>'millionaire_sunglasses','icon'=>'🕶️','color'=>'#C9A84C','nav_order'=>7,'sort_order'=>7,
             'image'=>'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80',
             'banner_image'=>'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=1400&q=80',
             'description'=>'Designer sunglasses with UV protection.',
             'children'=>[
                ['name'=>"Men's",  'slug'=>'sunglass-men',     'sort_order'=>1,'image'=>'https://images.unsplash.com/photo-1553735945-bded53aba973?w=400&q=80'],
                ['name'=>"Women's",'slug'=>'sunglass-women',   'sort_order'=>2,'image'=>'https://images.unsplash.com/photo-1577803645773-f96470509666?w=400&q=80'],
                ['name'=>'Aviator', 'slug'=>'sunglass-aviator', 'sort_order'=>3,'image'=>'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=400&q=80'],
                ['name'=>'Wayfarer','slug'=>'sunglass-wayfarer','sort_order'=>4,'image'=>'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&q=80'],
            ]],
            ['name'=>'New Arrivals','slug'=>'new-arrivals','icon'=>'✨','color'=>'#C9A84C','nav_order'=>8,'sort_order'=>8,
             'image'=>'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80',
             'banner_image'=>'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&q=80',
             'description'=>'The latest from Millionaire.',
             'children'=>[]],
        ];

        foreach ($main as $cat) {
            $children = $cat['children'];
            unset($cat['children']);
            $row = [
                'name'=>$cat['name'],'slug'=>$cat['slug'],
                'description'=>$cat['description']??null,'icon'=>$cat['icon']??null,
                'color'=>$cat['color']??null,'image'=>$cat['image']??null,
                'banner_image'=>$cat['banner_image']??null,
                'nav_order'=>$cat['nav_order']??0,'sort_order'=>$cat['sort_order']??0,
                'show_in_nav'=>true,'is_active'=>true,'created_at'=>now(),'updated_at'=>now(),
            ];
            if ($hasGender    && isset($cat['gender']))     $row['gender']     = $cat['gender'];
            if ($hasBrandLine && isset($cat['brand_line'])) $row['brand_line'] = $cat['brand_line'];
            $parentId = DB::table('categories')->insertGetId($row);
            foreach ($children as $child) {
                DB::table('categories')->insert([
                    'name'=>$child['name'],'slug'=>$child['slug'],
                    'image'=>$child['image']??null,'parent_id'=>$parentId,
                    'sort_order'=>$child['sort_order']??0,'show_in_nav'=>false,
                    'is_active'=>true,'created_at'=>now(),'updated_at'=>now(),
                ]);
            }
        }
        $this->command->info('✅ Millionaire categories seeded!');
    }
}
