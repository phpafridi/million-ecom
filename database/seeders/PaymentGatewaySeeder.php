<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PaymentGatewaySeeder extends Seeder
{
    public function run(): void
    {
        // ── REMOVE unwanted gateways first ───────────────────────────
        DB::table('payment_gateways')
            ->whereIn('code', ['flutterwave','paystack','razorpay','checkout','paymob'])
            ->delete();

        // ── Only these gateways are supported ────────────────────────
        $gateways = [
            [
                'code'         => 'cod',
                'name'         => 'Cash on Delivery',
                'region'       => 'Pakistan',
                'is_enabled'   => true,
                'is_test_mode' => false,
                'sort_order'   => 1,
                'instructions' => 'Pay cash when your order is delivered to your door. No advance payment needed.',
                'credentials'  => null,
            ],
            [
                'code'         => 'bank_transfer',
                'name'         => 'Bank Transfer',
                'region'       => 'Pakistan',
                'is_enabled'   => true,
                'is_test_mode' => false,
                'sort_order'   => 2,
                'instructions' => 'Transfer the amount to our bank account and upload your payment proof.',
                'credentials'  => json_encode([
                    'bank_name'      => 'HBL',
                    'account_title'  => 'MILLIONAIRE',
                    'account_number' => '0000-0000000-00',
                    'iban'           => 'PK00HABB0000000000000000',
                    'branch_code'    => '0000',
                ]),
            ],
            [
                'code'         => 'jazzcash',
                'name'         => 'JazzCash',
                'region'       => 'Pakistan',
                'is_enabled'   => false,
                'is_test_mode' => true,
                'sort_order'   => 3,
                'instructions' => 'Pay via JazzCash mobile wallet or JazzCash card.',
                'credentials'  => json_encode([
                    'merchant_id'       => '',
                    'merchant_password' => '',
                    'integrity_salt'    => '',
                ]),
            ],
            [
                'code'         => 'easypaisa',
                'name'         => 'Easypaisa',
                'region'       => 'Pakistan',
                'is_enabled'   => false,
                'is_test_mode' => true,
                'sort_order'   => 4,
                'instructions' => 'Pay via Easypaisa mobile wallet.',
                'credentials'  => json_encode([
                    'store_id'    => '',
                    'hash_key'    => '',
                    'account_num' => '',
                ]),
            ],
            [
                'code'         => 'payfast',
                'name'         => 'PayFast (Cards / EFT / SnapScan)',
                'region'       => 'International',
                'is_enabled'   => true,
                'is_test_mode' => true,
                'sort_order'   => 5,
                'instructions' => 'Pay securely with Credit Card, Debit Card, EFT or SnapScan via PayFast.',
                'credentials'  => json_encode([
                    'merchant_id'  => '',
                    'merchant_key' => '',
                    'passphrase'   => '',
                ]),
            ],
            [
                'code'         => 'stripe',
                'name'         => 'Stripe (International Cards)',
                'region'       => 'International',
                'is_enabled'   => false,
                'is_test_mode' => true,
                'sort_order'   => 6,
                'instructions' => 'Pay with Visa, Mastercard or American Express via Stripe.',
                'credentials'  => json_encode([
                    'publishable_key' => '',
                    'secret_key'      => '',
                    'webhook_secret'  => '',
                ]),
            ],
            [
                'code'         => 'paypal',
                'name'         => 'PayPal',
                'region'       => 'International',
                'is_enabled'   => false,
                'is_test_mode' => true,
                'sort_order'   => 7,
                'instructions' => 'Pay with your PayPal account or card.',
                'credentials'  => json_encode([
                    'client_id'     => '',
                    'client_secret' => '',
                ]),
            ],
            [
                'code'         => 'safepay',
                'name'         => 'Safepay',
                'region'       => 'Pakistan',
                'is_enabled'   => false,
                'is_test_mode' => true,
                'sort_order'   => 8,
                'instructions' => 'Pay securely via Safepay Pakistan.',
                'credentials'  => json_encode([
                    'api_key'    => '',
                    'api_secret' => '',
                ]),
            ],
        ];

        foreach ($gateways as $gw) {
            DB::table('payment_gateways')->updateOrInsert(
                ['code' => $gw['code']],
                array_merge($gw, ['created_at' => now(), 'updated_at' => now()])
            );
        }

        $this->command->info('✅ Payment gateways seeded — 8 gateways only.');
    }
}
