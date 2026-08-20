<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            SettingsSeeder::class,
            PaymentGatewaySeeder::class,
            CategorySeeder::class,
            ProductSeeder::class,
            AdminUserSeeder::class,
            HeroSlideSeeder::class,
            BannerSeeder::class,
        ]);
    }
}
