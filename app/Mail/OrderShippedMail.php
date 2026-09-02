<?php
namespace App\Mail;
use App\Models\{Order, Setting};
use App\Traits\EmailBrandingHelper;
use Illuminate\Mail\Mailable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailables\{Content, Envelope};
use Illuminate\Queue\SerializesModels;
use Illuminate\Bus\Queueable;

class OrderShippedMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels, EmailBrandingHelper;
    public function __construct(
        public Order $order,
        public string $trackingNumber = '',
        public string $courierName = ''
    ) {}

    public function envelope(): Envelope {
        return new Envelope(subject: "🚚 Your Order #{$this->order->id} is On Its Way!");
    }

    public function content(): Content {
        $s = Setting::allKeyed();
        return new Content(view: 'emails.order-shipped', with: array_merge($this->emailBranding($s), [
            'order'          => $this->order->load('items'),
            'whatsapp'       => $s['whatsapp_number']  ?? '',
            'trackingNumber' => $this->trackingNumber,
            'courierName'    => $this->courierName,
        ]));
    }
}
