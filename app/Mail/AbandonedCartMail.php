<?php
namespace App\Mail;

use App\Models\Setting;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\{Content, Envelope};
use Illuminate\Queue\SerializesModels;
use Illuminate\Bus\Queueable;

class AbandonedCartMail extends Mailable
{
    use Queueable, SerializesModels;
    public function __construct(public array $cartData, public string $customerName = '') {}

    public function envelope(): Envelope
    {
        $siteName = Setting::get('site_name', 'MILLIONAIRE');
        return new Envelope(subject: "🛒 You left something behind — {$siteName}");
    }

    public function content(): Content
    {
        $s = Setting::allKeyed();
        return new Content(view: 'emails.abandoned-cart', with: [
            'cartData'     => $this->cartData,
            'customerName' => $this->customerName,
            'siteName'     => $s['site_name'] ?? 'MILLIONAIRE',
            'logoUrl'      => $s['logo_url']  ?? null,
            'shopUrl'      => url('/shop'),
        ]);
    }
}
