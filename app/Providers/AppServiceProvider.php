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
        //
        // Was previously all-or-nothing, gated entirely on mail_host being
        // non-empty — meaning filling in port/username/password/encryption
        // correctly but leaving Host blank silently discarded ALL FIVE
        // fields, with zero indication why. Now each field is applied
        // independently: whichever ones are actually filled in the admin
        // panel get used, and only the ones left blank fall back to .env.
        try {
            $settings = \App\Models\Setting::allKeyed();
            $mailOverrides = [];
            if (!empty($settings['mail_host']))       $mailOverrides['mail.mailers.smtp.host']       = $settings['mail_host'];
            if (!empty($settings['mail_port']))        $mailOverrides['mail.mailers.smtp.port']       = (int) $settings['mail_port'];
            if (!empty($settings['mail_username']))    $mailOverrides['mail.mailers.smtp.username']   = $settings['mail_username'];
            if (!empty($settings['mail_password']))    $mailOverrides['mail.mailers.smtp.password']   = $settings['mail_password'];
            if (!empty($settings['mail_encryption']))  $mailOverrides['mail.mailers.smtp.encryption'] = $settings['mail_encryption'];
            if (!empty($settings['mail_from_address'])) $mailOverrides['mail.from.address'] = $settings['mail_from_address'];
            elseif (!empty($settings['email']))         $mailOverrides['mail.from.address'] = $settings['email'];
            if (!empty($settings['mail_from_name']))   $mailOverrides['mail.from.name'] = $settings['mail_from_name'];
            elseif (!empty($settings['site_name']))     $mailOverrides['mail.from.name'] = $settings['site_name'];
            if ($mailOverrides) config($mailOverrides);
        } catch (\Throwable $e) {
            // DB not ready yet (e.g. during migrations) — fall back to .env defaults
        }
    }
}
