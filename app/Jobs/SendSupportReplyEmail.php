<?php
namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendSupportReplyEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 2;

    public function __construct(
        public string $toEmail,
        public string $toName,
        public string $subject,
        public string $ticketNumber,
        public string $message,
        public string $storeName
    ) {}

    public function handle(): void
    {
        Mail::raw(
            "Hi {$this->toName},\n\nReply to ticket #{$this->ticketNumber}:\n\n{$this->message}\n\n— {$this->storeName} Support",
            fn($m) => $m->to($this->toEmail)
                        ->subject("Re: {$this->subject} [#{$this->ticketNumber}]")
        );
    }
}
