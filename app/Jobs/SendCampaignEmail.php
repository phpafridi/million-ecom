<?php
namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\{Mail, Log};

class SendCampaignEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries   = 2;
    public int $backoff = 30;

    public function __construct(
        public string $toEmail,
        public string $toName,
        public string $subject,
        public string $html,
        public string $fromEmail,
        public string $fromName,
        public ?int   $campaignId = null
    ) {}

    public function handle(): void
    {
        try {
            Mail::html($this->html, function ($m) {
                $m->to($this->toEmail, $this->toName)
                  ->from($this->fromEmail, $this->fromName)
                  ->subject($this->subject);
            });
            if ($this->campaignId) {
                \App\Models\EmailCampaign::where('id', $this->campaignId)->increment('sent_count');
            }
        } catch (\Throwable $e) {
            Log::warning("Campaign email failed to {$this->toEmail}: " . $e->getMessage());
            throw $e; // let the queue's retry/backoff handle it
        }
    }
}
