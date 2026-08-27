<?php
namespace App\Services;

use App\Mail\{OrderStatusMail, OrderConfirmedMail, NewOrderAdminMail};
use App\Models\{Order, Setting, User};
use Illuminate\Support\Facades\{Mail, Http, Log};

class OrderNotificationService
{
    private array $s;

    public function __construct()
    {
        $this->s = Setting::allKeyed();
        $this->applySmtp();
    }

    private function applySmtp(): void
    {
        if (!empty($this->s['mail_host'])) {
            config([
                'mail.mailers.smtp.host'       => $this->s['mail_host'],
                'mail.mailers.smtp.port'       => (int)($this->s['mail_port'] ?? 587),
                'mail.mailers.smtp.username'   => $this->s['mail_username']     ?? '',
                'mail.mailers.smtp.password'   => $this->s['mail_password']     ?? '',
                'mail.mailers.smtp.encryption' => $this->s['mail_encryption']   ?? 'tls',
                'mail.from.address'            => $this->s['mail_from_address'] ?? $this->s['email'] ?? '',
                'mail.from.name'               => $this->s['mail_from_name']    ?? $this->s['site_name'] ?? 'MILLIONAIRE',
            ]);
        }
    }

    private function num(Order $order): string
    {
        return $order->order_number ?? ('MLN-' . str_pad($order->id, 5, '0', STR_PAD_LEFT));
    }

    private function getStatuses(string $key): array
    {
        $val = $this->s[$key] ?? '';
        return $val ? array_map('trim', explode(',', $val))
                    : ['processing', 'shipped', 'delivered', 'cancelled'];
    }

    // ── Called on new order ──────────────────────────────────────────
    public function notifyNewOrder(Order $order): void
    {
        $order->load('items.product');
        $this->emailCustomer($order, 'new_order');
        $this->emailAdmin($order);
        $this->waCustomer($order, 'placed');
        $this->waAdmin($order, 'pending');
        $this->smsCustomer($order, 'placed');
    }

    // ── Called on status change ──────────────────────────────────────
    public function notifyStatusChange(Order $order, string $newStatus): void
    {
        $order->load('items.product');

        if (in_array($newStatus, $this->getStatuses('email_notify_on')))
            $this->emailCustomer($order, $newStatus);

        if (in_array($newStatus, ['pending', 'processing']))
            $this->emailAdmin($order);

        if (in_array($newStatus, $this->getStatuses('whatsapp_notify_on'))) {
            $this->waCustomer($order, $newStatus);
            $this->waAdmin($order, $newStatus);
        }

        if (in_array($newStatus, $this->getStatuses('sms_notify_on')))
            $this->smsCustomer($order, $newStatus);
    }

    // ── EMAIL ────────────────────────────────────────────────────────
    private function emailCustomer(Order $order, string $type): void
    {
        if (($this->s['email_notify_customer'] ?? '1') !== '1') return;
        $email = $order->customer_email
            ?? ($order->user_id ? User::find($order->user_id)?->email : null);
        if (!$email) return;
        try {
            $type === 'new_order'
                ? Mail::to($email)->send(new OrderConfirmedMail($order))
                : Mail::to($email)->send(new OrderStatusMail($order, $type));
        } catch (\Throwable $e) {
            Log::error("Email to customer failed [{$type}]: " . $e->getMessage());
        }
    }

    private function emailAdmin(Order $order): void
    {
        if (($this->s['email_notify_admin'] ?? '1') !== '1') return;
        $adminEmail = $this->s['admin_email'] ?? $this->s['email'] ?? null;
        if (!$adminEmail) return;
        try {
            Mail::to($adminEmail)->send(new NewOrderAdminMail($order));
        } catch (\Throwable $e) {
            Log::error("Admin email failed: " . $e->getMessage());
        }
    }

    // ── WHATSAPP ─────────────────────────────────────────────────────
    private function waCustomer(Order $order, string $status): void
    {
        if (($this->s['whatsapp_enabled'] ?? '0') !== '1') return;
        if (($this->s['whatsapp_notify_customer'] ?? '1') !== '1') return;
        $key = $this->s['whatsapp_api_key'] ?? '';
        $pid = $this->s['whatsapp_phone_id'] ?? '';
        if (!$key || !$pid) return;
        $phone = preg_replace('/\D/', '', $order->customer_phone ?? '');
        if (!$phone) return;
        $tplMap = ['placed'=>'whatsapp_order_template','processing'=>'whatsapp_order_template',
                   'shipped'=>'whatsapp_ship_template','delivered'=>'whatsapp_deliver_template',
                   'cancelled'=>'whatsapp_cancel_template'];
        $tpl = $this->s[$tplMap[$status] ?? ''] ?? $this->waTpl($status);
        $this->wa($key, $pid, $phone, $this->fill($tpl, $order));
    }

    private function waAdmin(Order $order, string $status): void
    {
        if (($this->s['whatsapp_enabled'] ?? '0') !== '1') return;
        if (($this->s['whatsapp_notify_admin'] ?? '1') !== '1') return;
        $key   = $this->s['whatsapp_api_key']    ?? '';
        $pid   = $this->s['whatsapp_phone_id']   ?? '';
        $admin = $this->s['whatsapp_admin_phone'] ?? $this->s['whatsapp_number'] ?? '';
        if (!$key || !$pid || !$admin) return;
        $num  = $this->num($order);
        $site = $this->s['site_name'] ?? 'MILLIONAIRE';
        $ap   = $this->s['admin_path'] ?? 'ml-admin';
        $msg = match($status) {
            'pending','processing' =>
                "🛍 NEW ORDER {$num} — {$site}\n👤 {$order->customer_name} | {$order->customer_phone}\n".
                "💰 Rs ".number_format($order->total)." | ".ucfirst($order->payment_method)."\n".
                "📦 ".$order->items->count()." item(s)\n".url("/{$ap}/orders/{$order->id}"),
            'shipped'   => "🚚 SHIPPED: Order {$num} — {$order->customer_name}",
            'delivered' => "✅ DELIVERED: Order {$num} — {$order->customer_name}",
            'cancelled' => "❌ CANCELLED: Order {$num} — Rs ".number_format($order->total),
            default     => null,
        };
        if ($msg) $this->wa($key, $pid, preg_replace('/\D/', '', $admin), $msg);
    }

    private function wa(string $key, string $pid, string $phone, string $msg): void
    {
        try {
            $res = Http::withToken($key)->post("https://graph.facebook.com/v18.0/{$pid}/messages", [
                'messaging_product' => 'whatsapp', 'to' => $phone,
                'type' => 'text', 'text' => ['body' => $msg],
            ]);
            if (!$res->successful()) Log::warning("WA API: " . $res->body());
        } catch (\Throwable $e) { Log::error("WA send failed: " . $e->getMessage()); }
    }

    // ── SMS ──────────────────────────────────────────────────────────
    private function smsCustomer(Order $order, string $status): void
    {
        if (($this->s['sms_enabled'] ?? '0') !== '1') return;
        $provider = $this->s['sms_provider'] ?? '';
        $key      = $this->s['sms_api_key']  ?? '';
        if (!$key || !$provider) return;
        $phone = preg_replace('/\D/', '', $order->customer_phone ?? '');
        if (!$phone) return;
        $tplMap = ['placed'=>'sms_order_template','processing'=>'sms_order_template',
                   'shipped'=>'sms_ship_template','delivered'=>'sms_deliver_template',
                   'cancelled'=>'sms_cancel_template'];
        $tpl = $this->s[$tplMap[$status] ?? ''] ?? $this->smsTpl($status);
        $msg = $this->fill($tpl, $order);
        $sender = $this->s['sms_sender_id'] ?? '';
        try {
            match($provider) {
                'twilio' => Http::withBasicAuth($key, $this->s['sms_api_secret'] ?? '')
                    ->post("https://api.twilio.com/2010-04-01/Accounts/{$key}/Messages.json",
                        ['From' => $sender, 'To' => "+{$phone}", 'Body' => $msg]),
                default  => Http::post($this->s['sms_api_url'] ?? '', [
                    'api_key' => $key, 'sender' => $sender, 'phone' => $phone, 'message' => $msg,
                ]),
            };
            Log::info("SMS sent to {$phone}");
        } catch (\Throwable $e) { Log::error("SMS failed: " . $e->getMessage()); }
    }

    // ── Template helpers ─────────────────────────────────────────────
    private function fill(string $tpl, Order $order): string
    {
        return str_replace(
            ['{name}','{order_id}','{order_number}','{total}','{tracking_url}','{status}','{items}'],
            [$order->customer_name, $order->id, $this->num($order),
             'Rs '.number_format($order->total), url("/track/{$order->tracking_token}"),
             ucfirst($order->status), $order->items->count()],
            $tpl
        );
    }

    private function waTpl(string $type): string
    {
        $site = $this->s['site_name'] ?? 'MILLIONAIRE';
        return match($type) {
            'placed','processing' => "Hi {name}! ✅ Order {order_number} confirmed at {$site}.\nTotal: {total}\nTrack: {tracking_url}",
            'shipped'   => "Hi {name}! 🚚 Order {order_number} shipped!\nTrack: {tracking_url}",
            'delivered' => "Hi {name}! 🎉 Order {order_number} delivered. Thank you!",
            'cancelled' => "Hi {name}, order {order_number} cancelled. Contact us if you have questions.",
            default     => "Hi {name}, order {order_number} update: {status}\n{tracking_url}",
        };
    }

    private function smsTpl(string $type): string
    {
        $site = $this->s['site_name'] ?? 'MILLIONAIRE';
        return match($type) {
            'placed','processing' => "{$site}: Order {order_number} confirmed. Total: {total}. Track: {tracking_url}",
            'shipped'   => "{$site}: Order {order_number} shipped. Track: {tracking_url}",
            'delivered' => "{$site}: Order {order_number} delivered. Thank you!",
            'cancelled' => "{$site}: Order {order_number} cancelled.",
            default     => "{$site}: Order {order_number} - {status}",
        };
    }
}
