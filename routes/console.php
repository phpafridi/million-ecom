<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// ── Scheduled jobs — none of these were registered before (BUG 18.1),
// meaning `orders:cancel-abandoned`, the low-stock alert, and the agent
// offline-status sweep never actually ran on their own even though the
// commands themselves existed.
Schedule::command('orders:cancel-abandoned')->hourly();
Schedule::command('shop:agents-offline')->everyTwoMinutes();
// Real command name is singular "alert", not "alerts" — using the wrong
// name here would silently match nothing and never fire, with no error
// (see BUG 15.6).
Schedule::command('shop:low-stock-alert')->dailyAt('08:00');
// Now that real queue infrastructure exists (this session added the jobs/
// failed_jobs tables), failed job records would otherwise accumulate
// forever with nothing ever cleaning them up.
Schedule::command('queue:prune-failed', ['--hours' => 72])->daily();
