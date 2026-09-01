<?php
namespace App\Mail;
use App\Models\{Order, Setting};
use Illuminate\Mail\Mailable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailables\{Content, Envelope};
use Illuminate\Queue\SerializesModels;
use Illuminate\Bus\Queueable;

class OrderShippedMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;
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
        return new Content(view: 'emails.order-shipped', with: [
            'order'          => $this->order->load('items'),
            'storeName'      => $s['site_name']      ?? 'Our Store',
            'primaryColor'   => $s['dark_bg']         ?? '#0a0e1a',
            'accentColor'    => $s['primary']          ?? '#00c8ff',
            'whatsapp'       => $s['whatsapp_number']  ?? '',
            'trackingNumber' => $this->trackingNumber,
            'courierName'    => $this->courierName,
        ]);
    }
}
