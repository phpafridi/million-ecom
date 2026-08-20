<?php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class MarkAgentsOffline extends Command
{
    protected $signature   = 'shop:agents-offline';
    protected $description = 'Mark agents as offline if no heartbeat in 2 minutes';

    public function handle(): void
    {
        $updated = DB::table('users')
            ->where('is_online', true)
            ->where('last_seen_at', '<', now()->subMinutes(2))
            ->update(['is_online' => false]);

        $this->info("Marked {$updated} agent(s) offline.");
    }
}
