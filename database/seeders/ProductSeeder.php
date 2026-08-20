<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('product_images')->delete();
        DB::table('products')->delete();

        $cats = DB::table('categories')->pluck('id', 'slug');

        // Check which extended columns exist
        $extCols = ['collection','color_name','color_code','fabric','fabric_composition',
                    'gsm','fabric_width','fit','care_instructions','made_in','sku','tags','available_sizes'];
        $hasCols = [];
        foreach ($extCols as $col) {
            $hasCols[$col] = Schema::hasColumn('products', $col);
        }

        $products = [
            // ── MILLIONAIRE CLOTH ──────────────────────────────────
            ['name'=>'Millionaire Cotton — Black','category'=>'millionaire-cloth','price'=>4500,'compare_price'=>5500,'stock'=>100,'is_featured'=>true,
             'description'=>"A refined premium cotton fabric designed for comfort, clean finishing and sophisticated everyday style.\n\nCollection: Royal\nColor: Millionaire Black\nFabric: Premium Cotton",
             'collection'=>'Royal Collection','color_name'=>'Millionaire Black','color_code'=>'MC-01','fabric'=>'Premium Cotton','fabric_composition'=>'100% Premium Cotton','gsm'=>'180 GSM','fit'=>'Regular Fit','made_in'=>'Pakistan','sku'=>'MC-01-R',
             'tags'=>['Premium','Cotton','Men','Royal Collection','Black','Millionaire Cloth','Made in Pakistan'],
             'available_sizes'=>['S','M','L','XL','XXL'],
             'images'=>['https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80','https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600&q=80']],

            ['name'=>'Millionaire Cotton — White','category'=>'millionaire-cloth','price'=>4500,'compare_price'=>5500,'stock'=>100,'is_featured'=>true,
             'description'=>"Pure white premium cotton. A clean, sophisticated staple for the modern Millionaire wardrobe.\n\nCollection: Royal\nColor: Millionaire White\nFabric: Premium Cotton",
             'collection'=>'Royal Collection','color_name'=>'Millionaire White','color_code'=>'MC-02','fabric'=>'Premium Cotton','fabric_composition'=>'100% Premium Cotton','gsm'=>'180 GSM','fit'=>'Regular Fit','made_in'=>'Pakistan','sku'=>'MC-02-R',
             'tags'=>['Premium','Cotton','Men','Royal Collection','White','Millionaire Cloth','Made in Pakistan'],
             'available_sizes'=>['S','M','L','XL','XXL'],
             'images'=>['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80','https://images.unsplash.com/photo-1603252109303-2751441dd157?w=600&q=80']],

            ['name'=>'Millionaire Cotton — Navy','category'=>'millionaire-cloth','price'=>4500,'compare_price'=>5500,'stock'=>80,'is_featured'=>true,
             'description'=>"Deep navy premium cotton. Rich tone, refined look. A Millionaire Classic.\n\nCollection: Classic\nColor: Millionaire Navy\nFabric: Premium Cotton",
             'collection'=>'Classic Collection','color_name'=>'Millionaire Navy','color_code'=>'MC-04','fabric'=>'Premium Cotton','fabric_composition'=>'100% Premium Cotton','gsm'=>'180 GSM','fit'=>'Regular Fit','made_in'=>'Pakistan','sku'=>'MC-04-C',
             'tags'=>['Premium','Cotton','Men','Classic Collection','Navy','Millionaire Cloth','Made in Pakistan'],
             'available_sizes'=>['S','M','L','XL','XXL'],
             'images'=>['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80','https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80']],

            ['name'=>'Millionaire Cotton — Grey','category'=>'millionaire-cloth','price'=>3800,'compare_price'=>4800,'stock'=>90,'is_featured'=>false,
             'description'=>"Sophisticated grey premium cotton. Versatile, refined and effortlessly premium.\n\nCollection: Essential\nColor: Millionaire Grey\nFabric: Premium Cotton",
             'collection'=>'Essential Collection','color_name'=>'Millionaire Grey','color_code'=>'MC-03','fabric'=>'Premium Cotton','fabric_composition'=>'100% Premium Cotton','gsm'=>'160 GSM','fit'=>'Regular Fit','made_in'=>'Pakistan','sku'=>'MC-03-E',
             'tags'=>['Premium','Cotton','Men','Essential Collection','Grey','Millionaire Cloth','Made in Pakistan'],
             'available_sizes'=>['S','M','L','XL','XXL'],
             'images'=>['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80','https://images.unsplash.com/photo-1527719327859-c6ce80353573?w=600&q=80']],

            ['name'=>'Millionaire Cotton — Camel','category'=>'millionaire-cloth','price'=>3800,'compare_price'=>4800,'stock'=>70,'is_featured'=>false,
             'description'=>"Warm camel premium cotton. A distinctive Millionaire tone.\n\nCollection: Essential\nColor: Millionaire Camel\nFabric: Premium Cotton",
             'collection'=>'Essential Collection','color_name'=>'Millionaire Camel','color_code'=>'MC-05','fabric'=>'Premium Cotton','fabric_composition'=>'100% Premium Cotton','gsm'=>'160 GSM','fit'=>'Regular Fit','made_in'=>'Pakistan','sku'=>'MC-05-E',
             'tags'=>['Premium','Cotton','Men','Essential Collection','Camel','Millionaire Cloth','Made in Pakistan'],
             'available_sizes'=>['S','M','L','XL','XXL'],
             'images'=>['https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80','https://images.unsplash.com/photo-1604176354204-9268737828e4?w=600&q=80']],

            ['name'=>'Millionaire Cotton — Off White','category'=>'millionaire-cloth','price'=>2800,'compare_price'=>3500,'stock'=>150,'is_featured'=>false,
             'description'=>"Soft off-white premium cotton. The value choice with full Millionaire identity.\n\nCollection: Value\nColor: Millionaire Off-White\nFabric: Premium Cotton",
             'collection'=>'Value Collection','color_name'=>'Millionaire Off-White','color_code'=>'MC-06','fabric'=>'Premium Cotton','fabric_composition'=>'100% Premium Cotton','gsm'=>'140 GSM','fit'=>'Regular Fit','made_in'=>'Pakistan','sku'=>'MC-06-V',
             'tags'=>['Cotton','Men','Value Collection','Off-White','Millionaire Cloth','Made in Pakistan'],
             'available_sizes'=>['S','M','L','XL','XXL'],
             'images'=>['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80','https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80']],

            // ── MILLIONAIRE PERFUME ────────────────────────────────
            ['name'=>'Oud Al Millionaire','category'=>'millionaire-perfume','price'=>8500,'compare_price'=>10000,'stock'=>50,'is_featured'=>true,
             'description'=>"The signature Millionaire fragrance. Rich, deep and commanding.\n\nTop Notes: Rose & Saffron\nHeart: Oud & Sandalwood\nBase: Musk & Amber\n\n12+ hours lasting.",
             'collection'=>'Oud Collection','made_in'=>'Pakistan','sku'=>'MP-OUD-001',
             'tags'=>['Premium','Oud','Men','Signature','Millionaire Perfume','Best Seller'],
             'images'=>['https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80','https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&q=80']],

            ['name'=>'Royal Rose EDP 100ml','category'=>'millionaire-perfume','price'=>5500,'compare_price'=>7000,'stock'=>45,'is_featured'=>true,
             'description'=>"An elegant rose-based eau de parfum for women. Refined, feminine and long lasting.\n\nTop: Fresh Rose\nHeart: Jasmine & Peony\nBase: White Musk\n\n100ml. 12+ hours.",
             'collection'=>"Women's Fragrance",'made_in'=>'Pakistan','sku'=>'MP-ROSE-001',
             'tags'=>['Premium','Women','Rose','Millionaire Perfume','Exclusive'],
             'images'=>['https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600&q=80','https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&q=80']],

            ['name'=>'Black Oud Intense','category'=>'millionaire-perfume','price'=>12000,'compare_price'=>15000,'stock'=>30,'is_featured'=>true,
             'description'=>"Intense, powerful, commanding. For the Millionaire who makes a statement without saying a word.\n\nTop: Black Pepper & Cardamom\nHeart: Dark Oud & Leather\nBase: Vetiver & Amber",
             'collection'=>'Oud Collection','made_in'=>'Pakistan','sku'=>'MP-BOUD-001',
             'tags'=>['Premium','Oud','Men','Exclusive','Millionaire Perfume','New Arrival'],
             'images'=>['https://images.unsplash.com/photo-1583467875263-d50ab73e8b97?w=600&q=80','https://images.unsplash.com/photo-1590156562745-5e9b8c6de1ef?w=600&q=80']],

            // ── MILLIONAIRE SHOES ──────────────────────────────────
            ['name'=>'Millionaire Oxford — Black','category'=>'millionaire-shoes','price'=>9500,'compare_price'=>12000,'stock'=>40,'is_featured'=>true,
             'description'=>"Handcrafted premium leather Oxford. Genuine leather upper, cushioned insole.\n\nMaterial: Genuine Leather\nSole: Rubber\nMade in Pakistan",
             'collection'=>"Men's Shoes",'made_in'=>'Pakistan','sku'=>'MS-OX-BLK-001',
             'tags'=>['Premium','Leather','Men','Formal','Millionaire Shoes','Best Seller'],
             'available_sizes'=>['40','41','42','43','44','45'],
             'images'=>['https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&q=80','https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&q=80']],

            ['name'=>'Millionaire Sneaker — White','category'=>'millionaire-shoes','price'=>6500,'compare_price'=>8000,'stock'=>60,'is_featured'=>true,
             'description'=>"Premium designer sneakers. Clean white. Lightweight and unmistakably Millionaire.\n\nMaterial: Premium Leather & Mesh\nSole: Cushioned EVA\nMade in Pakistan",
             'collection'=>'Sneakers','made_in'=>'Pakistan','sku'=>'MS-SN-WHT-001',
             'tags'=>['Premium','Sneakers','Men','Casual','Millionaire Shoes','New Arrival'],
             'available_sizes'=>['40','41','42','43','44','45'],
             'images'=>['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80','https://images.unsplash.com/photo-1608231387042-66d1773d3028?w=600&q=80']],

            // ── MILLIONAIRE WATCH ──────────────────────────────────
            ['name'=>'Millionaire Classic Timepiece','category'=>'millionaire-watch','price'=>45000,'compare_price'=>55000,'stock'=>20,'is_featured'=>true,
             'description'=>"The flagship Millionaire timepiece. Stainless steel, sapphire crystal, automatic movement.\n\nCase: 42mm Stainless Steel\nGlass: Sapphire Crystal\nMovement: Automatic\nWater Resistance: 50m",
             'collection'=>'Luxury','made_in'=>'Pakistan','sku'=>'MW-CL-001',
             'tags'=>['Premium','Luxury','Men','Automatic','Millionaire Watch','Exclusive','Best Seller'],
             'images'=>['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80','https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=600&q=80']],

            ['name'=>'Millionaire Gold Timepiece','category'=>'millionaire-watch','price'=>28000,'compare_price'=>35000,'stock'=>25,'is_featured'=>true,
             'description'=>"Gold plated luxury watch. Premium leather strap, Japanese quartz movement.\n\nCase: Gold Plated 40mm\nStrap: Premium Leather\nMovement: Japanese Quartz",
             'collection'=>'Luxury','made_in'=>'Pakistan','sku'=>'MW-GL-001',
             'tags'=>['Premium','Gold','Men','Quartz','Millionaire Watch','Exclusive'],
             'images'=>['https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=600&q=80','https://images.unsplash.com/photo-1542496658-e33a6d0d655f?w=600&q=80']],

            // ── MILLIONAIRE SUNGLASSES ─────────────────────────────
            ['name'=>'Millionaire Aviator — Gold','category'=>'millionaire-sunglasses','price'=>4500,'compare_price'=>6000,'stock'=>60,'is_featured'=>true,
             'description'=>"Classic aviator with premium gold frame. UV400 protection. Polarized lenses.\n\nFrame: Gold Metal\nLens: Polarized UV400\nStyle: Aviator",
             'collection'=>'Aviator','made_in'=>'Pakistan','sku'=>'MG-AV-GLD-001',
             'tags'=>['Premium','Aviator','Men','Gold','Millionaire Sunglasses','Best Seller'],
             'images'=>['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80','https://images.unsplash.com/photo-1553735945-bded53aba973?w=600&q=80']],

            ['name'=>'Millionaire Wayfarer — Black','category'=>'millionaire-sunglasses','price'=>3800,'compare_price'=>5000,'stock'=>50,'is_featured'=>true,
             'description'=>"Timeless wayfarer in premium matte black. Polarized lenses, acetate frame.\n\nFrame: Matte Black Acetate\nLens: Polarized UV400\nStyle: Wayfarer",
             'collection'=>'Wayfarer','made_in'=>'Pakistan','sku'=>'MG-WF-BLK-001',
             'tags'=>['Premium','Wayfarer','Men','Black','Millionaire Sunglasses'],
             'images'=>['https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80','https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600&q=80']],

            // ── MEN + WOMEN ───────────────────────────────────────
            ['name'=>'Millionaire Classic Suit','category'=>'men','price'=>18000,'compare_price'=>22000,'stock'=>25,'is_featured'=>true,
             'description'=>"A tailored suit from the Millionaire wardrobe. Premium fabric, expert craftsmanship.\n\nFit: Slim Tailored\nFabric: Premium Wool Blend\nMade in Pakistan",
             'collection'=>'Royal Collection','made_in'=>'Pakistan','sku'=>'MC-SUIT-001',
             'tags'=>['Premium','Suit','Men','Formal','New Arrival','Royal Collection'],
             'images'=>['https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80','https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600&q=80']],

            ['name'=>'Millionaire Floral Dress','category'=>'women','price'=>5500,'compare_price'=>7000,'stock'=>40,'is_featured'=>true,
             'description'=>"Elegant floral dress from the Millionaire Women collection. For the woman who wears her status.\n\nFit: Regular\nFabric: Premium Chiffon\nMade in Pakistan",
             'collection'=>'Classic Collection','made_in'=>'Pakistan','sku'=>'WC-DRESS-001',
             'tags'=>['Premium','Women','Dress','Floral','New Arrival','Classic Collection'],
             'images'=>['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80','https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80']],
        ];

        foreach ($products as $i => $p) {
            $catId = $cats[$p['category']] ?? null;
            if (!$catId) {
                $this->command->warn("Category not found: {$p['category']}");
                continue;
            }

            $images = $p['images']          ?? [];
            $tags   = $p['tags']            ?? [];
            $sizes  = $p['available_sizes'] ?? [];
            unset($p['images'], $p['category'], $p['tags'], $p['available_sizes']);

            $productData = [
                'name'          => $p['name'],
                'slug'          => Str::slug($p['name']),
                'description'   => $p['description'] ?? null,
                'price'         => $p['price'],
                'compare_price' => $p['compare_price'] ?? null,
                'category_id'   => $catId,
                'stock'         => $p['stock'] ?? 0,
                'is_featured'   => $p['is_featured'] ?? false,
                'is_active'     => true,
                'sort_order'    => $i + 1,
                'avg_rating'    => round(rand(42, 50) / 10, 1),
                'review_count'  => rand(5, 80),
                'created_at'    => now()->subDays(rand(1, 30)),
                'updated_at'    => now(),
            ];

            // Only add extended fields if columns exist
            foreach (['collection','color_name','color_code','fabric','fabric_composition','gsm','fabric_width','fit','care_instructions','made_in','sku'] as $col) {
                if ($hasCols[$col] && isset($p[$col])) {
                    $productData[$col] = $p[$col];
                }
            }
            if ($hasCols['tags'])            $productData['tags']            = json_encode($tags);
            if ($hasCols['available_sizes']) $productData['available_sizes'] = json_encode($sizes);

            $productId = DB::table('products')->insertGetId($productData);

            foreach ($images as $order => $url) {
                DB::table('product_images')->insert([
                    'product_id' => $productId,
                    'path'       => $url,
                    'sort_order' => $order,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        $this->command->info('✅ ' . count($products) . ' Millionaire products seeded!');
    }
}
