<?php
namespace App\Console\Commands;

use App\Models\Order;
use App\Models\Setting;
use Illuminate\Console\Command;

class CancelAbandonedOrders extends Command
{
    protected $signature   = 'orders:cancel-abandoned';
    protected $description = 'Auto-cancel pending COD orders past the expiry window';

    public function handle(): void
    {
        $hours = (int) Setting::get('cod_expiry_hours', 48);

        Order::where('payment_method', 'cod')
            ->where('status', 'pending')
            ->where('created_at', '<=', now()->subHours($hours))
            ->each(function (Order $order) use ($hours) {
                $order->update([
                    'status' => 'cancelled',
                    'notes'  => trim(($order->notes ?? '') . ' [Auto-cancelled: unconfirmed after ' . $hours . 'h]'),
                ]);
                // No restoreStock() call needed — pending COD orders never had
                // stock reduced in the first place (only happens once admin
                // confirms for shipping). restoreStock() is also internally
                // guarded via the stock_reduced flag, so calling it here would
                // be a safe no-op anyway, but it's clearer to just not call it.
                $this->info("Auto-cancelled order #{$order->id}");
            });
    }
}
