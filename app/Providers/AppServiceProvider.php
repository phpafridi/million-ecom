<?php
namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        // Neither storage:link setup nor DB-driven mail config is needed
        // during Composer's package-discovery step (or artisan commands
        // generally used for setup like migrate/vendor:publish before the
        // app is fully configured) — skip entirely rather than relying only
        // on try/catch around DB calls that may not even be reachable yet
        // this early in a fresh install.
        $skipCommands = ['package:discover', 'vendor:publish', 'key:generate'];
        if ($this->app->runningInConsole() && in_array($_SERVER['argv'][1] ?? '', $skipCommands)) {
            return;
        }

        // Ensure uploaded files are accessible — only actually attempt the
        // storage:link call once (cached), rather than re-checking and
        // potentially re-invoking Artisan on every single request forever
        // if the symlink can't be created (e.g. read-only filesystem
        // permissions on some hosts), which wastes a filesystem check +
        // artisan bootstrap on every page load indefinitely.
        if (!file_exists(public_path('storage')) && !\Illuminate\Support\Facades\Cache::get('storage_link_attempted')) {
            try {
                \Artisan::call('storage:link');
            } catch (\Throwable $e) {
                // Silently fail - admin can run php artisan storage:link manually
            }
            \Illuminate\Support\Facades\Cache::put('storage_link_attempted', true, now()->addDay());
        }

        // Configure mail from DB settings once at boot — applies everywhere,
        // including queue workers, which never go through Inertia middleware
        // at all. Previously this only ran inside HandleInertiaRequests,
        // meaning every queued email (order confirmations, campaigns,
        // WhatsApp/SMS-adjacent mail) would silently use whatever's in
        // .env/config instead of the admin-configured SMTP settings the
        // moment it was actually processed by `php artisan queue:work`.
        try {
            $settings = \App\Models\Setting::allKeyed();
            if (!empty($settings['mail_host'])) {
                config([
                    'mail.mailers.smtp.host'       => $settings['mail_host'],
                    'mail.mailers.smtp.port'       => (int)($settings['mail_port'] ?? 587),
                    'mail.mailers.smtp.username'   => $settings['mail_username'] ?? '',
                    'mail.mailers.smtp.password'   => $settings['mail_password'] ?? '',
                    'mail.mailers.smtp.encryption' => $settings['mail_encryption'] ?? 'tls',
                    'mail.from.address'            => $settings['mail_from_address'] ?? $settings['email'] ?? '',
                    'mail.from.name'               => $settings['mail_from_name'] ?? $settings['site_name'] ?? config('app.name'),
                ]);
            }
        } catch (\Throwable $e) {
            // DB not ready yet (e.g. during migrations) — fall back to .env defaults
        }
    }
}
