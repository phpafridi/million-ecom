<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PayFastSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('payment_gateways')->updateOrInsert(
            ['code' => 'payfast'],
            [
                'code'         => 'payfast',
                'name'         => 'PayFast (Cards / EFT / SnapScan)',
                'region'       => 'South Africa / International',
                'is_enabled'   => false, // Enable after adding keys
                'is_test_mode' => true,  // Sandbox by default
                'sort_order'   => 6,
                'instructions' => 'Pay securely with Credit Card, Debit Card, EFT or SnapScan via PayFast.',
                'credentials'  => json_encode([
                    'merchant_id'  => '',  // From payfast.co.za → Settings → Merchant Details
                    'merchant_key' => '',  // From payfast.co.za → Settings → Merchant Details
                    'passphrase'   => '',  // Set in payfast.co.za → Settings → Security → Passphrase
                ]),
                'created_at'   => now(),
                'updated_at'   => now(),
            ]
        );

        $this->command->info('✅ PayFast gateway seeded.');
        $this->command->info('   Sandbox Merchant ID:  10000100');
        $this->command->info('   Sandbox Merchant Key: 46f0cd694581a');
        $this->command->info('   Sandbox Passphrase:   jt7NOE43FZPn (if you set one)');
        $this->command->info('   Test Card: 4000000000000002 | 12/25 | 123');
    }
}
