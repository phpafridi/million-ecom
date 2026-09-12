<?php
namespace App\Mail;
use App\Models\{Order, Setting};
use App\Traits\EmailBrandingHelper;
use Illuminate\Mail\Mailable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailables\{Content, Envelope};
use Illuminate\Queue\SerializesModels;
use Illuminate\Bus\Queueable;

class NewOrderAdminMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels, EmailBrandingHelper;
    public function __construct(public Order $order) {}

    public function envelope(): Envelope {
        return new Envelope(subject: "🛍 New Order #{$this->order->id} — Rs " . number_format($this->order->total));
    }

    public function content(): Content {
        $s        = Setting::allKeyed();
        $adminPath= $s['admin_path'] ?? 'million-admin';
        return new Content(view: 'emails.new-order-admin', with: array_merge($this->emailBranding($s), [
            'order'    => $this->order->load('items'),
            'adminUrl' => url($adminPath),
        ]));
    }
}
