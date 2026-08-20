<?php
namespace App\Console\Commands;

use App\Mail\LowStockAlertMail;
use App\Models\{Product, Setting};
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class SendLowStockAlerts extends Command
{
    protected $signature   = 'shop:low-stock-alert {--threshold=5 : Stock level to trigger alert}';
    protected $description = 'Send low stock email alert to admin';

    public function handle(): void
    {
        $threshold = $this->option('threshold');
        $products  = Product::where('is_active', true)
            ->where('stock', '<=', $threshold)
            ->select('id','name','stock','sku')
            ->orderBy('stock')
            ->get()
            ->toArray();

        if (empty($products)) {
            $this->info('All products are well stocked.');
            return;
        }

        $adminEmail = Setting::get('email');
        if (!$adminEmail) {
            $this->warn('No admin email configured in Settings.');
            return;
        }

        try {
            Mail::to($adminEmail)->send(new LowStockAlertMail($products));
            $this->info("Low stock alert sent for " . count($products) . " products.");
        } catch (\Throwable $e) {
            $this->error("Email failed: " . $e->getMessage());
        }
    }
}
