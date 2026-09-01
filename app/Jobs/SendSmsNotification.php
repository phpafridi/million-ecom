<?php
namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SendSmsNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries   = 3;
    public int $backoff = 10;

    public function __construct(
        public string $provider,
        public string $apiKey,
        public string $phone,
        public string $message,
        public string $sender    = '',
        public string $apiSecret = '',
        public string $apiUrl    = ''
    ) {}

    public function handle(): void
    {
        $res = match($this->provider) {
            'twilio' => Http::withBasicAuth($this->apiKey, $this->apiSecret)
                ->post("https://api.twilio.com/2010-04-01/Accounts/{$this->apiKey}/Messages.json", [
                    'From' => $this->sender,
                    'To'   => "+{$this->phone}",
                    'Body' => $this->message,
                ]),
            default => Http::post($this->apiUrl, [
                'api_key' => $this->apiKey,
                'sender'  => $this->sender,
                'phone'   => $this->phone,
                'message' => $this->message,
            ]),
        };
        if (!$res->successful()) {
            Log::warning('SMS failed: ' . $res->body());
            $this->fail();
        } else {
            Log::info("SMS sent to {$this->phone}");
        }
    }
}
