<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\{Setting, Order};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class WhatsAppController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/WhatsApp/Index', [
            'settings' => Setting::allKeyed(),
            'stats'    => [
                'orders_today'   => Order::whereDate('created_at', today())->count(),
                'messages_sent'  => 0, // increment when API is used
            ],
        ]);
    }

    // ── Send order notification via WhatsApp Business API ─────────────
    public function sendOrderNotification(Order $order, string $type = 'placed'): bool
    {
        $settings  = Setting::allKeyed();
        $apiKey    = $settings['whatsapp_api_key']   ?? '';
        $phoneId   = $settings['whatsapp_phone_id']  ?? '';
        $notifyOn  = ($settings['whatsapp_order_notify'] ?? '0') === '1';

        // No API key or notifications disabled — skip silently
        if (!$apiKey || !$phoneId || !$notifyOn) return false;

        $phone    = self::normalizePhone($order->customer_phone ?? '');
        if (!$phone) return false;

        $template = match($type) {
            'shipped'   => $settings['whatsapp_ship_template']    ?? '',
            'delivered' => $settings['whatsapp_deliver_template'] ?? '',
            default     => $settings['whatsapp_order_template']   ?? '',
        };

        $message = str_replace(
            ['{name}', '{order_id}', '{order_number}', '{total}', '{tracking_url}', '{status}'],
            [
                $order->customer_name,
                $order->id,
                $order->order_number ?? '#'.$order->id,
                'Rs ' . number_format($order->total),
                url("/track/{$order->tracking_token}"),
                ucfirst($order->status),
            ],
            $template
        );

        try {
            $response = Http::withToken($apiKey)
                ->post("https://graph.facebook.com/v18.0/{$phoneId}/messages", [
                    'messaging_product' => 'whatsapp',
                    'to'                => $phone,
                    'type'              => 'text',
                    'text'              => ['body' => $message],
                ]);

            return $response->successful();
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('WhatsApp API error: ' . $e->getMessage());
            return false;
        }
    }

    // ── Generate WhatsApp link for product page ────────────────────────
    // Same normalization used in OrderNotificationService — local-format
    // numbers (leading 0) need the country code and no leading 0 for the
    // WhatsApp Business API to actually deliver.
    private static function normalizePhone(string $phone, string $defaultCountry = '92'): string
    {
        $phone = preg_replace('/\D/', '', $phone);
        if ($phone === '') return '';
        if (str_starts_with($phone, '0')) {
            $phone = $defaultCountry . substr($phone, 1);
        } elseif (!str_starts_with($phone, $defaultCountry)) {
            $phone = $defaultCountry . $phone;
        }
        return $phone;
    }

    public static function productLink(string $productName, float $price, string $whatsappNumber, string $template): string
    {
        $message = str_replace(
            ['{product_name}', '{price}'],
            [$productName, 'Rs ' . number_format($price)],
            $template
        );
        $number = self::normalizePhone($whatsappNumber);
        return "https://wa.me/{$number}?text=" . urlencode($message);
    }
}
