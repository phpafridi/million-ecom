<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        DB::table('categories')->delete();

        $main = [
            ['name'=>'Clothes','slug'=>'clothes','icon'=>'👔','color'=>'#3B82F6','nav_order'=>1,'sort_order'=>1,
             'image'=>'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&q=80',
             'banner_image'=>'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80',
             'description'=>'Premium fashion clothing for men and women.',
             'children'=>[
                ['name'=>"Men's Wear",        'sort_order'=>1,'image'=>'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80'],
                ['name'=>"Women's Wear",       'sort_order'=>2,'image'=>'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&q=80'],
                ['name'=>'Kids Wear',          'sort_order'=>3,'image'=>'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&q=80'],
                ['name'=>'Formal Wear',        'sort_order'=>4,'image'=>'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=400&q=80'],
                ['name'=>'Casual Wear',        'sort_order'=>5,'image'=>'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80'],
                ['name'=>'Signature Collection','sort_order'=>6,'image'=>'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80'],
            ]],
            ['name'=>'Perfumes','slug'=>'perfumes','icon'=>'🌸','color'=>'#EC4899','nav_order'=>2,'sort_order'=>2,
             'image'=>'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&q=80',
             'banner_image'=>'https://images.unsplash.com/photo-1541643600914-78b084683702?w=1200&q=80',
             'description'=>'Luxury fragrances and perfumes.',
             'children'=>[
                ['name'=>"Men's Fragrance",  'sort_order'=>1,'image'=>'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80'],
                ['name'=>"Women's Fragrance",'sort_order'=>2,'image'=>'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=400&q=80'],
                ['name'=>'Oud Collection',   'sort_order'=>3,'image'=>'https://images.unsplash.com/photo-1583467875263-d50ab73e8b97?w=400&q=80'],
                ['name'=>'Gift Sets',        'sort_order'=>4,'image'=>'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=400&q=80'],
            ]],
            ['name'=>'Shoes','slug'=>'shoes','icon'=>'👟','color'=>'#F59E0B','nav_order'=>3,'sort_order'=>3,
             'image'=>'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
             'banner_image'=>'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80',
             'description'=>'Premium footwear for every occasion.',
             'children'=>[
                ['name'=>"Men's Shoes",  'sort_order'=>1,'image'=>'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=400&q=80'],
                ['name'=>"Women's Shoes",'sort_order'=>2,'image'=>'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80'],
                ['name'=>'Sneakers',     'sort_order'=>3,'image'=>'https://images.unsplash.com/photo-1608231387042-66d1773d3028?w=400&q=80'],
                ['name'=>'Sports Shoes', 'sort_order'=>4,'image'=>'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&q=80'],
            ]],
            ['name'=>'Watches','slug'=>'watches','icon'=>'⌚','color'=>'#6366F1','nav_order'=>4,'sort_order'=>4,
             'image'=>'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
             'banner_image'=>'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=80',
             'description'=>'Luxury and premium watches.',
             'children'=>[
                ['name'=>"Men's Watches",  'sort_order'=>1,'image'=>'https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=400&q=80'],
                ['name'=>"Women's Watches",'sort_order'=>2,'image'=>'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=400&q=80'],
                ['name'=>'Luxury Watches', 'sort_order'=>3,'image'=>'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=400&q=80'],
                ['name'=>'Smart Watches',  'sort_order'=>4,'image'=>'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&q=80'],
            ]],
            ['name'=>'Sunglasses','slug'=>'sunglasses','icon'=>'🕶️','color'=>'#10B981','nav_order'=>5,'sort_order'=>5,
             'image'=>'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80',
             'banner_image'=>'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=1200&q=80',
             'description'=>'Designer and premium sunglasses.',
             'children'=>[
                ['name'=>"Men's Sunglasses",  'sort_order'=>1,'image'=>'https://images.unsplash.com/photo-1553735945-bded53aba973?w=400&q=80'],
                ['name'=>"Women's Sunglasses",'sort_order'=>2,'image'=>'https://images.unsplash.com/photo-1577803645773-f96470509666?w=400&q=80'],
                ['name'=>'Aviators',          'sort_order'=>3,'image'=>'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=400&q=80'],
                ['name'=>'Wayfarer',          'sort_order'=>4,'image'=>'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&q=80'],
            ]],
            ['name'=>'Sale','slug'=>'sale','icon'=>'🔥','color'=>'#EF4444','nav_order'=>6,'sort_order'=>6,
             'image'=>'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&q=80',
             'banner_image'=>'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80',
             'description'=>'Best deals and discounts.',
             'children'=>[]],
        ];

        foreach ($main as $cat) {
            $children = $cat['children'];
            unset($cat['children']);
            $parentId = DB::table('categories')->insertGetId(array_merge($cat, [
                'show_in_nav' => true,
                'is_active'   => true,
                'created_at'  => now(),
                'updated_at'  => now(),
            ]));
            foreach ($children as $child) {
                DB::table('categories')->insert(array_merge($child, [
                    'slug'        => Str::slug($child['name']),
                    'parent_id'   => $parentId,
                    'show_in_nav' => false,
                    'is_active'   => true,
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ]));
            }
        }
        $this->command->info('✅ Categories seeded with real images!');
    }
}
