<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@millionaire.pk'],
            [
                'name'     => 'Millionaire Admin',
                'password' => Hash::make('Millionaire@2026'),
                'role'     => 'admin',
            ]
        );
    }
}
