<?php
namespace App\Mail;

use App\Models\Setting;
use App\Traits\EmailBrandingHelper;
use Illuminate\Mail\Mailable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailables\{Content, Envelope};
use Illuminate\Queue\SerializesModels;
use Illuminate\Bus\Queueable;

class LowStockAlertMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels, EmailBrandingHelper;
    public function __construct(public array $products) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: '⚠️ Low Stock Alert — ' . count($this->products) . ' products need restocking');
    }

    public function content(): Content
    {
        $s = Setting::allKeyed();
        $branding = $this->emailBranding($s);
        // This template's variable is named siteName, not storeName —
        // aliasing rather than changing the template to keep this
        // consistent with how it was originally written.
        $branding['siteName'] = $branding['storeName'];
        return new Content(view: 'emails.low-stock', with: array_merge($branding, [
            'products' => $this->products,
        ]));
    }
}
