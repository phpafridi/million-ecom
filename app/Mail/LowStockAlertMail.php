<?php
namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailables\{Content, Envelope};
use Illuminate\Queue\SerializesModels;
use Illuminate\Bus\Queueable;

class LowStockAlertMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;
    public function __construct(public array $products) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: '⚠️ Low Stock Alert — ' . count($this->products) . ' products need restocking');
    }

    public function content(): Content
    {
        return new Content(view: 'emails.low-stock', with: ['products' => $this->products]);
    }
}
