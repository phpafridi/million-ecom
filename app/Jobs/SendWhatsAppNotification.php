<?php
namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SendWhatsAppNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries   = 3;
    public int $backoff = 10;

    public function __construct(
        public string $apiKey,
        public string $phoneId,
        public string $phone,
        public string $message
    ) {}

    public function handle(): void
    {
        $res = Http::withToken($this->apiKey)
            ->post("https://graph.facebook.com/v18.0/{$this->phoneId}/messages", [
                'messaging_product' => 'whatsapp',
                'to'   => $this->phone,
                'type' => 'text',
                'text' => ['body' => $this->message],
            ]);
        if (!$res->successful()) {
            Log::warning('WhatsApp failed: ' . $res->body());
            $this->fail();
        }
    }
}
