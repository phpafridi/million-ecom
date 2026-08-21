<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Remove unwanted payment gateways and keep only:
 * - COD (Cash on Delivery)
 * - Bank Transfer
 * - JazzCash
 * - Easypaisa
 * - PayFast
 * - Stripe (international)
 * - PayPal (international)
 * - Safepay
 */
class CleanPaymentGatewaysSeeder extends Seeder
{
    public function run(): void
    {
        // Remove these gateways
        $remove = ['flutterwave', 'paystack', 'razorpay', 'checkout', 'paymob'];
        DB::table('payment_gateways')->whereIn('code', $remove)->delete();

        // Ensure the ones we keep exist with correct data
        $keep = [
            [
                'code'         => 'cod',
                'name'         => 'Cash on Delivery',
                'region'       => 'Pakistan',
                'instructions' => 'Pay in cash when your order is delivered to your door.',
                'is_enabled'   => true,
                'is_test_mode' => false,
                'sort_order'   => 1,
            ],
            [
                'code'         => 'bank_transfer',
                'name'         => 'Bank Transfer',
                'region'       => 'Pakistan',
                'instructions' => 'Transfer the amount to our bank account and upload payment proof.',
                'is_enabled'   => true,
                'is_test_mode' => false,
                'sort_order'   => 2,
            ],
            [
                'code'         => 'jazzcash',
                'name'         => 'JazzCash',
                'region'       => 'Pakistan',
                'instructions' => 'Pay via JazzCash mobile wallet or card.',
                'is_enabled'   => false,
                'is_test_mode' => true,
                'sort_order'   => 3,
            ],
            [
                'code'         => 'easypaisa',
                'name'         => 'Easypaisa',
                'region'       => 'Pakistan',
                'instructions' => 'Pay via Easypaisa mobile wallet.',
                'is_enabled'   => false,
                'is_test_mode' => true,
                'sort_order'   => 4,
            ],
            [
                'code'         => 'payfast',
                'name'         => 'PayFast (Cards / EFT / SnapScan)',
                'region'       => 'International',
                'instructions' => 'Pay securely with Credit Card, Debit Card, EFT or SnapScan via PayFast.',
                'is_enabled'   => true,
                'is_test_mode' => true,
                'sort_order'   => 5,
            ],
            [
                'code'         => 'stripe',
                'name'         => 'Stripe (International Cards)',
                'region'       => 'International',
                'instructions' => 'Pay with Visa, Mastercard or American Express via Stripe.',
                'is_enabled'   => false,
                'is_test_mode' => true,
                'sort_order'   => 6,
            ],
            [
                'code'         => 'paypal',
                'name'         => 'PayPal',
                'region'       => 'International',
                'instructions' => 'Pay via your PayPal account or card.',
                'is_enabled'   => false,
                'is_test_mode' => true,
                'sort_order'   => 7,
            ],
            [
                'code'         => 'safepay',
                'name'         => 'Safepay',
                'region'       => 'Pakistan',
                'instructions' => 'Pay securely via Safepay.',
                'is_enabled'   => false,
                'is_test_mode' => true,
                'sort_order'   => 8,
            ],
        ];

        foreach ($keep as $gw) {
            DB::table('payment_gateways')->updateOrInsert(
                ['code' => $gw['code']],
                array_merge($gw, ['updated_at' => now()])
            );
        }

        $this->command->info('✅ Payment gateways cleaned.');
        $this->command->info('   Removed: Flutterwave, Paystack, Razorpay, Checkout.com, Paymob');
        $this->command->info('   Kept: COD, Bank Transfer, JazzCash, Easypaisa, PayFast, Stripe, PayPal, Safepay');
    }
}
