<?php
namespace App\Mail;

use App\Models\Setting;
use App\Traits\EmailBrandingHelper;
use Illuminate\Mail\Mailable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailables\{Content, Envelope};
use Illuminate\Queue\SerializesModels;
use Illuminate\Bus\Queueable;

class AbandonedCartMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels, EmailBrandingHelper;
    public function __construct(public array $cartData, public string $customerName = '') {}

    public function envelope(): Envelope
    {
        $siteName = Setting::get('site_name', 'MILLIONAIRE');
        return new Envelope(subject: "🛒 You left something behind — {$siteName}");
    }

    public function content(): Content
    {
        $s = Setting::allKeyed();
        $branding = $this->emailBranding($s);
        $branding['siteName'] = $branding['storeName'];
        return new Content(view: 'emails.abandoned-cart', with: array_merge($branding, [
            'cartData'     => $this->cartData,
            'customerName' => $this->customerName,
            'shopUrl'      => url('/shop'),
        ]));
    }
}
