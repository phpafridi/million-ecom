<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@millionaire.pk'],
            [
                'name'     => 'Millionaire Admin',
                'email'    => 'admin@millionaire.pk',
                'password' => Hash::make('Millionaire@2026'),
                'role'     => 'admin',
                'phone'    => '+92 300 0000000',
            ]
        );

        User::updateOrCreate(
            ['email' => 'customer@test.com'],
            [
                'name'                => 'Test Customer',
                'email'               => 'customer@test.com',
                'password'            => Hash::make('password'),
                'role'                => 'customer',
                'phone'               => '+92 301 1234567',
                'loyalty_points'      => 500,
                'total_points_earned' => 500,
            ]
        );

        $this->command->info('✅ Admin & test users seeded.');
        $this->command->info('   Admin: admin@millionaire.pk / Millionaire@2026');
        $this->command->info('   Customer: customer@test.com / password');
    }
}
