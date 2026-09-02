<?php
namespace App\Mail;
use App\Models\{Order, Setting};
use App\Traits\EmailBrandingHelper;
use Illuminate\Mail\Mailable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailables\{Content, Envelope};
use Illuminate\Queue\SerializesModels;
use Illuminate\Bus\Queueable;

class OrderConfirmedMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels, EmailBrandingHelper;
    public function __construct(public Order $order) {}

    public function envelope(): Envelope {
        return new Envelope(subject: "✅ Order " . ($this->order->order_number ?? '#'.$this->order->id) . " Confirmed — " . Setting::get('site_name','MILLIONAIRE'));
    }

    public function content(): Content {
        $s = Setting::allKeyed();
        return new Content(view: 'emails.order-confirmed', with: array_merge($this->emailBranding($s), [
            'order'        => $this->order->load('items'),
            'whatsapp'     => $s['whatsapp_number'] ?? '',
            'phone'        => $s['phone']           ?? '',
            'email'        => $s['email']           ?? '',
            'storeAddress' => $s['address']         ?? '',
            'trackUrl'     => url('/track/' . ($this->order->tracking_token ?? '')),
        ]));
    }
}
