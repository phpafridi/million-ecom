<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Setting;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $defaults = [
            'site_name'              => 'MILLIONAIRE',
            'site_tagline'           => 'Wear Your Status',
            'admin_path'             => 'ml-admin',
            'shipping_fee'           => '200',
            'delivery_threshold'     => '5000',
            'low_stock_threshold'    => '5',
            'new_arrival_days'       => '30',
            'loyalty_enabled'        => '1',
            'loyalty_points_rate'    => '10',
            'loyalty_redeem_enabled' => '1',
            'loyalty_min_redeem'     => '100',
            'email_notify_customer'  => '1',
            'email_notify_admin'     => '1',
            'email_notify_on'        => 'processing,shipped,delivered,cancelled',
            'whatsapp_enabled'       => '0',
            'whatsapp_notify_on'     => 'processing,shipped,delivered,cancelled',
            'sms_enabled'            => '0',
            'sms_notify_on'          => 'shipped,delivered',
            'firewall_whitelist'     => '',
            'theme_primary'          => '#C9A84C',
            'theme_primary_dark'     => '#b8923e',
            'theme_primary_text'     => '#0a0a0a',
            'theme_dark_bg'          => '#0a0a0a',
            'theme_body_bg'          => '#f5f5f5',
            'login_max_attempts'     => '5',
            'login_lockout_minutes'  => '15',
            'admin_max_attempts'     => '3',
            'admin_lockout_minutes'  => '30',
        ];
        // Force admin_path to ml-admin always
        \App\Models\Setting::updateOrCreate(['key' => 'admin_path'], ['value' => 'ml-admin']);
        foreach ($defaults as $key => $value) {
            if ($key === 'admin_path') continue;
            \App\Models\Setting::firstOrCreate(['key' => $key], ['value' => $value]);
        }
    }
}
