<?php
namespace App\Mail;

use App\Models\{Order, Setting};
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\{Content, Envelope};
use Illuminate\Queue\SerializesModels;
use Illuminate\Bus\Queueable;

class OrderStatusMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Order $order,
        public string $newStatus
    ) {}

    public function envelope(): Envelope
    {
        $siteName = Setting::get('site_name', 'MILLIONAIRE');
        $subject  = match($this->newStatus) {
            'processing' => "✅ Order #{$this->order->id} Confirmed — {$siteName}",
            'shipped'    => "🚚 Your Order #{$this->order->id} Has Been Shipped!",
            'delivered'  => "🎉 Order #{$this->order->id} Delivered — Thank You!",
            'cancelled'  => "❌ Order #{$this->order->id} Cancelled — {$siteName}",
            'refunded'   => "💰 Refund Processed for Order #{$this->order->id}",
            default      => "Order #{$this->order->id} Update — {$siteName}",
        };
        return new Envelope(subject: $subject);
    }

    public function content(): Content
    {
        $s = Setting::allKeyed();
        return new Content(view: 'emails.order-status', with: [
            'order'     => $this->order->load('items.product'),
            'status'    => $this->newStatus,
            'siteName'  => $s['site_name'] ?? 'MILLIONAIRE',
            'logoUrl'   => $s['logo_url']  ?? null,
            'siteUrl'   => $s['site_url']  ?? url('/'),
            'phone'     => $s['phone']     ?? '',
            'trackUrl'  => url("/track/{$this->order->tracking_token}"),
        ]);
    }
}
