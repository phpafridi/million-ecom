<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PaymentGatewaySeeder extends Seeder
{
    public function run(): void
    {
        $gateways = [
            ['code'=>'cod',          'name'=>'Cash on Delivery',           'region'=>'Pakistan',      'is_enabled'=>true,  'is_test_mode'=>false, 'sort_order'=>1,  'instructions'=>'Pay cash when your order arrives.',                                       'credentials'=>null],
            ['code'=>'bank_transfer','name'=>'Bank Transfer',              'region'=>'Pakistan',      'is_enabled'=>true,  'is_test_mode'=>false, 'sort_order'=>2,  'instructions'=>'Transfer to our account and upload proof.',                               'credentials'=>['bank_name'=>'HBL','account_title'=>'Millionaire','account_number'=>'0000-0000000-00','iban'=>'PK00HABB0000000000000000']],
            ['code'=>'jazzcash',     'name'=>'JazzCash',                   'region'=>'Pakistan',      'is_enabled'=>false, 'is_test_mode'=>true,  'sort_order'=>3,  'instructions'=>'Pay via JazzCash mobile wallet.',                                         'credentials'=>['merchant_id'=>'','merchant_password'=>'','integrity_salt'=>'']],
            ['code'=>'easypaisa',    'name'=>'Easypaisa',                  'region'=>'Pakistan',      'is_enabled'=>false, 'is_test_mode'=>true,  'sort_order'=>4,  'instructions'=>'Pay via Easypaisa.',                                                      'credentials'=>['store_id'=>'','hash_key'=>'','account_num'=>'']],
            ['code'=>'paymob',       'name'=>'Paymob (Visa/Mastercard)',   'region'=>'Pakistan',      'is_enabled'=>false, 'is_test_mode'=>true,  'sort_order'=>5,  'instructions'=>'Pay securely with Visa or Mastercard via Paymob.',                       'credentials'=>['api_key'=>'','integration_id'=>'','iframe_id'=>'','hmac_secret'=>'']],
            ['code'=>'checkout',     'name'=>'Checkout.com (Cards)',       'region'=>'International', 'is_enabled'=>false, 'is_test_mode'=>true,  'sort_order'=>6,  'instructions'=>'Pay with Visa, Mastercard or any international card via Checkout.com.',  'credentials'=>['secret_key'=>'','public_key'=>'','webhook_secret'=>'']],
            ['code'=>'stripe',       'name'=>'Stripe',                     'region'=>'International', 'is_enabled'=>false, 'is_test_mode'=>true,  'sort_order'=>7,  'instructions'=>'Pay with international cards via Stripe.',                                'credentials'=>['publishable_key'=>'','secret_key'=>'','webhook_secret'=>'']],
            ['code'=>'paypal',       'name'=>'PayPal',                     'region'=>'International', 'is_enabled'=>false, 'is_test_mode'=>true,  'sort_order'=>8,  'instructions'=>'Pay with your PayPal account.',                                           'credentials'=>['client_id'=>'','client_secret'=>'']],
            ['code'=>'safepay',      'name'=>'Safepay',                    'region'=>'Pakistan',      'is_enabled'=>false, 'is_test_mode'=>true,  'sort_order'=>9,  'instructions'=>'Pay securely with Safepay.',                                              'credentials'=>['api_key'=>'','api_secret'=>'']],
            ['code'=>'razorpay',     'name'=>'Razorpay',                   'region'=>'International', 'is_enabled'=>false, 'is_test_mode'=>true,  'sort_order'=>10, 'instructions'=>'Pay via Razorpay.',                                                      'credentials'=>['key_id'=>'','key_secret'=>'','webhook_secret'=>'']],
            ['code'=>'paystack',     'name'=>'Paystack',                   'region'=>'International', 'is_enabled'=>false, 'is_test_mode'=>true,  'sort_order'=>11, 'instructions'=>'Pay via Paystack.',                                                      'credentials'=>['public_key'=>'','secret_key'=>'']],
            ['code'=>'flutterwave',  'name'=>'Flutterwave',                'region'=>'International', 'is_enabled'=>false, 'is_test_mode'=>true,  'sort_order'=>12, 'instructions'=>'Pay via Flutterwave.',                                                   'credentials'=>['public_key'=>'','secret_key'=>'','encryption_key'=>'']],
        ];

        foreach ($gateways as $gateway) {
            $gateway['credentials'] = $gateway['credentials'] ? json_encode($gateway['credentials']) : null;
            DB::table('payment_gateways')->updateOrInsert(
                ['code' => $gateway['code']],
                array_merge($gateway, ['created_at' => now(), 'updated_at' => now()])
            );
        }

        $this->command->info('✅ Payment gateways seeded (incl. Checkout.com + Paymob).');
    }
}
