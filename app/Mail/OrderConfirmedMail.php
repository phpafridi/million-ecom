<?php
namespace App\Mail;
use App\Models\{Order, Setting};
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\{Content, Envelope};
use Illuminate\Queue\SerializesModels;
use Illuminate\Bus\Queueable;

class OrderConfirmedMail extends Mailable
{
    use Queueable, SerializesModels;
    public function __construct(public Order $order) {}

    public function envelope(): Envelope {
        return new Envelope(subject: "✅ Order #{$this->order->id} Confirmed — " . Setting::get('site_name','Tijar Store'));
    }

    public function content(): Content {
        $s = Setting::allKeyed();
        return new Content(view: 'emails.order-confirmed', with: [
            'order'        => $this->order->load('items'),
            'storeName'    => $s['site_name']    ?? 'Tijar Store',
            'primaryColor' => $s['dark_bg']      ?? '#0a0e1a',
            'accentColor'  => $s['primary']      ?? '#00c8ff',
            'whatsapp'     => $s['whatsapp_number'] ?? '',
            'phone'        => $s['phone']         ?? '',
            'email'        => $s['email']         ?? '',
            'storeAddress' => $s['address']       ?? '',
        ]);
    }
}
