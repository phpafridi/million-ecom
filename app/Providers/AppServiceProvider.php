<?php
namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        // Ensure uploaded files are accessible
        if (!file_exists(public_path('storage'))) {
            try {
                app(\Illuminate\Filesystem\FilesystemManager::class)
                    ->disk('public')
                    ->getAdapter();
                \Artisan::call('storage:link');
            } catch (\Throwable $e) {
                // Silently fail - admin can run php artisan storage:link manually
            }
        }
    }
}
