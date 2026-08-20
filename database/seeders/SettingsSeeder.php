<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            // ── Brand Identity ─────────────────────────────────────
            'site_name'             => 'MILLIONAIRE',
            'site_tagline'          => 'Wear Your Status',
            'site_email'            => 'info@millionaire.pk',
            'phone'                 => '+92 300 0000000',
            'whatsapp'              => '+923000000000',
            'address'               => 'Lahore, Pakistan',
            'city'                  => 'Lahore',
            'admin_path'            => 'ml-admin',

            // ── SEO ────────────────────────────────────────────────
            'seo_title'             => 'MILLIONAIRE — Wear Your Status | Premium Lifestyle Brand Pakistan',
            'seo_description'       => 'MILLIONAIRE is a premium lifestyle brand offering exclusive clothing, perfumes, shoes, watches and sunglasses. Premium fashion designed for those who know their worth.',
            'seo_keywords'          => 'Millionaire Clothing, Millionaire Cloth, Premium Cotton Pakistan, Premium Mens Clothing, Luxury Clothing Pakistan, Millionaire Cotton, Premium Shalwar Kameez, Luxury Fashion Pakistan, Millionaire Lifestyle Store',
            'seo_indexing_enabled'  => '1',

            // ── Shipping ───────────────────────────────────────────
            'shipping_fee'          => '200',
            'delivery_threshold'    => '10000',

            // ── Theme — BLACK / WHITE / GOLD ───────────────────────
            'theme_primary'         => '#C9A84C',   // Gold
            'theme_primary_dark'    => '#B8973B',   // Dark Gold
            'theme_primary_text'    => '#0a0a0a',   // Black text on gold
            'theme_accent'          => '#C9A84C',   // Gold accent
            'theme_dark_bg'         => '#0a0a0a',   // Pure Black
            'theme_dark_bg2'        => '#111111',   // Slightly lighter black
            'theme_body_bg'         => '#FAFAFA',   // Near White
            'theme_border_radius'   => '8',         // Slightly sharp corners — premium feel

            // ── Social ─────────────────────────────────────────────
            'facebook'              => 'https://facebook.com/millionairestyle',
            'instagram'             => 'https://instagram.com/millionairestyle',
            'tiktok'                => 'https://tiktok.com/@millionairestyle',

            // ── Loyalty ────────────────────────────────────────────
            'loyalty_enabled'       => '1',
            'loyalty_rate'          => '10',
            'loyalty_earn_per'      => '10',

            // ── Features ───────────────────────────────────────────
            'reviews_enabled'       => '1',
            'wishlist_enabled'      => '1',
            'newsletter_enabled'    => '1',
            'cod_enabled'           => '1',

            // ── Brand Statement ────────────────────────────────────
            'about_brand'           => 'MILLIONAIRE is a premium lifestyle brand created around fashion, confidence, quality and status. From clothing and footwear to fragrances, watches and sunglasses, Millionaire brings multiple expressions of modern luxury under one identity.',
            'brand_philosophy'      => 'Wear Your Status.',
        ];

        foreach ($settings as $key => $value) {
            DB::table('settings')->updateOrInsert(
                ['key'   => $key],
                ['value' => $value, 'updated_at' => now(), 'created_at' => now()]
            );
        }

        $this->command->info('✅ Millionaire brand settings seeded.');
    }
}
