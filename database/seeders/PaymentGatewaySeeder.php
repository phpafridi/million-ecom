<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\PaymentGateway;

class PaymentGatewaySeeder extends Seeder
{
    public function run(): void
    {
        $gateways = [
            ['code'=>'cod',           'name'=>'Cash on Delivery',  'is_enabled'=>true,  'sort_order'=>1, 'instructions'=>'Pay cash when your order arrives at your door. No advance needed.'],
            ['code'=>'bank_transfer', 'name'=>'Bank Transfer',     'is_enabled'=>true,  'sort_order'=>2, 'instructions'=>'Transfer to our bank account and upload your payment proof.'],
            ['code'=>'jazzcash',      'name'=>'JazzCash',          'is_enabled'=>false, 'sort_order'=>3, 'instructions'=>'Pay via JazzCash mobile wallet.'],
            ['code'=>'easypaisa',     'name'=>'Easypaisa',         'is_enabled'=>false, 'sort_order'=>4, 'instructions'=>'Pay via Easypaisa mobile wallet.'],
            ['code'=>'payfast',       'name'=>'PayFast',           'is_enabled'=>false, 'sort_order'=>5, 'instructions'=>'Secure online payment via PayFast.'],
        ];
        foreach ($gateways as $gw) {
            PaymentGateway::firstOrCreate(['code' => $gw['code']], $gw);
        }
    }
}
