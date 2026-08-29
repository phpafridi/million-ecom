<?php
namespace App\Mail;
use App\Models\{Order, Setting};
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\{Content, Envelope};
use Illuminate\Queue\SerializesModels;
use Illuminate\Bus\Queueable;

class NewOrderAdminMail extends Mailable
{
    use Queueable, SerializesModels;
    public function __construct(public Order $order) {}

    public function envelope(): Envelope {
        return new Envelope(subject: "🛍 New Order #{$this->order->id} — Rs " . number_format($this->order->total));
    }

    public function content(): Content {
        $s        = Setting::allKeyed();
        $adminPath= $s['admin_path'] ?? 'tijar-admin';
        return new Content(view: 'emails.new-order-admin', with: [
            'order'     => $this->order->load('items'),
            'storeName' => $s['site_name'] ?? 'Our Store',
            'adminUrl'  => url($adminPath),
        ]);
    }
}
