<?php
namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class NotifyPasswordChanged implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 2;

    public function __construct(public string $toEmail, public string $toName) {}

    public function handle(): void
    {
        Mail::raw(
            "Hi {$this->toName},\n\nYour password was changed by an administrator.\n\nIf you did not request this, contact your administrator immediately.",
            fn($m) => $m->to($this->toEmail)->subject('Your Password Was Changed')
        );
    }
}
