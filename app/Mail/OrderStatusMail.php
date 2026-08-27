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
            'processing' => "✅ Order " . ($this->order->order_number ?? '#'.$this->order->id) . " Confirmed — {$siteName}",
            'shipped'    => "🚚 Your Order " . ($this->order->order_number ?? '#'.$this->order->id) . " Has Been Shipped!",
            'delivered'  => "🎉 Order " . ($this->order->order_number ?? '#'.$this->order->id) . " Delivered — Thank You!",
            'cancelled'  => "❌ Order " . ($this->order->order_number ?? '#'.$this->order->id) . " Cancelled — {$siteName}",
            'refunded'   => "💰 Refund for Order " . ($this->order->order_number ?? '#'.$this->order->id),
            default      => "Order " . ($this->order->order_number ?? '#'.$this->order->id) . " Update — {$siteName}",
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
            'logoUrl'   => isset($s['logo_url']) ? (str_starts_with($s['logo_url'], 'http') ? $s['logo_url'] : url($s['logo_url'])) : null,
            'siteUrl'   => $s['site_url'] ?? url('/'),
            'phone'     => $s['phone']     ?? '',
            'trackUrl'  => url("/track/{$this->order->tracking_token}"),
        ]);
    }
}
