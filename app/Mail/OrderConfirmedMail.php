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
        return new Envelope(subject: "✅ Order " . ($this->order->order_number ?? '#'.$this->order->id) . " Confirmed — " . Setting::get('site_name','MILLIONAIRE'));
    }

    public function content(): Content {
        $s = Setting::allKeyed();
        $logoRaw = $s['logo_url'] ?? null;
        return new Content(view: 'emails.order-confirmed', with: [
            'order'        => $this->order->load('items'),
            'storeName'    => $s['site_name']       ?? 'MILLIONAIRE',
            'logoUrl'      => $logoRaw ? (str_starts_with($logoRaw, 'http') ? $logoRaw : url($logoRaw)) : null,
            'primaryColor' => $s['theme_dark_bg']   ?? '#0a0a0a',
            'accentColor'  => $s['theme_primary']   ?? '#C9A84C',
            'whatsapp'     => $s['whatsapp_number'] ?? '',
            'phone'        => $s['phone']           ?? '',
            'email'        => $s['email']           ?? '',
            'storeAddress' => $s['address']         ?? '',
            'trackUrl'     => url('/track/' . ($this->order->tracking_token ?? '')),
        ]);
    }
}
