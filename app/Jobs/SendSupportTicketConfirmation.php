<?php
namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendSupportTicketConfirmation implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 2;

    public function __construct(
        public string $toEmail,
        public string $toName,
        public string $ticketNumber,
        public string $subject,
        public string $storeName
    ) {}

    public function handle(): void
    {
        Mail::raw(
            "Hi {$this->toName},\n\nTicket #{$this->ticketNumber} created.\nSubject: {$this->subject}\n\nWe'll reply within 24 hours.\n\n— {$this->storeName} Support",
            fn($m) => $m->to($this->toEmail)->subject("Support Ticket #{$this->ticketNumber} Created")
        );
    }
}
