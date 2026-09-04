<?php
namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\{Order, PaymentGateway, Setting};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Log, Http};
use Inertia\Inertia;

class PayFastController extends Controller
{
    private function baseUrl(bool $sandbox): string
    {
        return $sandbox
            ? 'https://sandbox.payfast.co.za/eng/process'
            : 'https://www.payfast.co.za/eng/process';
    }

    private function validateUrl(bool $sandbox): string
    {
        return $sandbox
            ? 'https://sandbox.payfast.co.za/eng/query/validate'
            : 'https://www.payfast.co.za/eng/query/validate';
    }

    private function creds(): array
    {
        $gw = PaymentGateway::where('code', 'payfast')->first();
        $credentials = $gw?->credentials ?? [];
        if (is_string($credentials)) {
            $credentials = json_decode($credentials, true) ?? [];
        }
        return [
            'merchant_id'  => $credentials['merchant_id']  ?? '',
            'merchant_key' => $credentials['merchant_key'] ?? '',
            'passphrase'   => $credentials['passphrase']   ?? '',
            'sandbox'      => (bool) ($gw?->is_test_mode ?? true),
        ];
    }

    /**
     * PayFast signature — EXACT algorithm from official PHP SDK
     * https://github.com/PayFast/pg-php-sdk
     *
     * Rules:
     * 1. ksort the array
     * 2. Build query string using http_build_query (it handles encoding)
     * 3. If passphrase set, append &passphrase=PASSPHRASE (NOT encoded)
     * 4. md5 the string
     */
    private function buildSignature(array $data, string $passphrase = ''): string
    {
        // PayFast signs in DOCUMENT ORDER (the order fields are defined)
        // NOT alphabetically — do NOT use ksort here
        // Source: PayFast PHP sample code pfHost parameter
        //
        // CONFIRMED BUG (2026-09-04): this used to skip empty/null fields
        // entirely, but PayFast's actual algorithm includes every field
        // that was present in the payload, even blank ones, as `key=&`.
        // Verified by reproducing a real ITN signature byte-for-byte —
        // skipping empties produced a different hash every time; including
        // them (even though empty) matched PayFast's signature exactly.
        $pfOutput = '';
        foreach ($data as $key => $val) {
            $pfOutput .= $key . '=' . urlencode(trim((string) $val)) . '&';
        }
        $pfOutput = rtrim($pfOutput, '&');

        if (!empty($passphrase)) {
            $pfOutput .= '&passphrase=' . urlencode(trim($passphrase));
        }

        Log::info('PayFast signature string: ' . $pfOutput);
        return md5($pfOutput);
    }

    public function redirect(string $orderNumber)
    {
        $order = \App\Models\Order::where('order_number', $orderNumber)->firstOrFail();
        $creds = $this->creds();

        if (!$creds['merchant_id'] || !$creds['merchant_key']) {
            return redirect()->route('payment.failed')
                ->with('reason', 'PayFast credentials not configured. Go to Admin → Payments → PayFast.');
        }

        $gw = PaymentGateway::where('code', 'payfast')->where('is_enabled', true)->first();
        if (!$gw) {
            return redirect()->route('payment.failed')
                ->with('reason', 'PayFast is not enabled.');
        }

        // ── Only include fields that PayFast accepts ──────────────────
        // Source: https://developers.payfast.co.za/docs#step_1_form_fields
        $pfData = [];

        // Merchant
        $pfData['merchant_id']  = $creds['merchant_id'];
        $pfData['merchant_key'] = $creds['merchant_key'];

        // URLs — order_number, not the raw sequential id, since these
        // land in the customer's browser address bar during the PayFast
        // redirect flow (same reasoning as item_name above).
        $pfData['return_url'] = route('payment.payfast.return', $order->order_number);
        $pfData['cancel_url'] = route('payment.payfast.cancel', $order->order_number);
        $pfData['notify_url'] = route('payment.payfast.itn');

        // Buyer info (only if present)
        $firstName = trim($this->firstName($order->customer_name));
        $lastName  = trim($this->lastName($order->customer_name));
        if ($firstName) $pfData['name_first']    = substr($firstName, 0, 100);
        if ($lastName)  $pfData['name_last']     = substr($lastName, 0, 100);
        if ($order->customer_email) $pfData['email_address'] = $order->customer_email;

        // Transaction
        $pfData['m_payment_id'] = (string) $order->id;
        $pfData['amount']       = number_format((float) $order->total, 2, '.', '');
        // Customer-visible on PayFast's own payment page — was using the
        // raw sequential DB id ("Millionaire Order 2"), directly revealing
        // total order volume to anyone who completes checkout. order_number
        // is the same randomized identifier already shown everywhere else
        // customer-facing (order confirmation, tracking, etc).
        $pfData['item_name']    = 'Millionaire Order ' . $order->order_number;

        // Custom fields to identify order in ITN callback
        $pfData['custom_int1']  = (string) $order->id;

        // Build signature BEFORE adding it to array
        $signature = $this->buildSignature($pfData, $creds['passphrase']);
        $pfData['signature'] = $signature;

        Log::info('PayFast redirect', [
            'order_id'    => $order->id,
            'amount'      => $pfData['amount'],
            'merchant_id' => $pfData['merchant_id'],
            'signature'   => $signature,
            'sandbox'     => $creds['sandbox'],
        ]);

        return Inertia::render('Shop/PayFastRedirect', [
            'payfast_url' => $this->baseUrl($creds['sandbox']),
            'data'        => $pfData,
            'order'       => [
                'id'    => $order->id,
                'total' => $order->total,
                'name'  => $order->customer_name,
            ],
            'sandbox' => $creds['sandbox'],
        ]);
    }

    public function itn(Request $request)
    {
        $data = $request->all();
        Log::info('PayFast ITN received', $data);

        $creds = $this->creds();

        // ── Security 1: IP whitelist (skip in sandbox) ─────────────
        if (!$creds['sandbox']) {
            $validIps = ['197.97.145.144','197.97.145.145','197.97.145.146','197.97.145.147','41.74.179.192','41.74.179.193','41.74.179.194','41.74.179.195'];
            if (!in_array($request->ip(), $validIps)) {
                Log::warning('PayFast ITN: invalid IP ' . $request->ip());
                return response('INVALID_IP', 403);
            }
        }

        // ── Security 2: Signature ──────────────────────────────────
        $receivedSignature = $data['signature'] ?? '';
        unset($data['signature']);

        $calculatedSignature = $this->buildSignature($data, $creds['passphrase']);
        if ($calculatedSignature !== $receivedSignature) {
            Log::warning('PayFast ITN: signature mismatch', [
                'received'   => $receivedSignature,
                'calculated' => $calculatedSignature,
            ]);
            return response('INVALID_SIGNATURE', 400);
        }

        // ── Security 3: Verify with PayFast ───────────────────────
        $verify = Http::asForm()->post($this->validateUrl($creds['sandbox']), $request->all());
        if (trim($verify->body()) !== 'VALID') {
            Log::warning('PayFast ITN: validation failed — ' . $verify->body());
            return response('INVALID', 400);
        }

        // ── Find order ─────────────────────────────────────────────
        $orderId = $data['custom_int1'] ?? null;
        if (!$orderId) {
            preg_match('/^(\d+)$/', $data['m_payment_id'] ?? '', $m);
            $orderId = $m[1] ?? null;
        }

        $order = Order::find($orderId);
        if (!$order) {
            Log::error('PayFast ITN: order not found: ' . $orderId);
            return response('ORDER_NOT_FOUND', 404);
        }

        // ── Security 4: Amount ─────────────────────────────────────
        $paid     = (float)($data['amount_gross'] ?? 0);
        $expected = (float)$order->total;
        if (abs($paid - $expected) > 0.05) {
            Log::error('PayFast amount mismatch', ['paid' => $paid, 'expected' => $expected]);
            $order->update(['notes' => ($order->notes ?? '') . ' [AMOUNT MISMATCH paid=' . $paid . ']']);
            return response('AMOUNT_MISMATCH', 400);
        }

        // ── Process ────────────────────────────────────────────────
        $status = $data['payment_status'] ?? '';
        $pfId   = $data['pf_payment_id']  ?? '';

        match($status) {
            'COMPLETE' => $this->handleComplete($order, $pfId),
            'FAILED'   => $this->handleFailed($order, 'Payment failed'),
            'PENDING'  => Log::info("PayFast: Order #{$order->id} PENDING"),
            default    => Log::info("PayFast: Unknown status {$status}"),
        };

        return response('OK', 200);
    }

    public function returnUrl(Request $request, string $orderNumber)
    {
        $order = Order::where('order_number', $orderNumber)->firstOrFail();
        return redirect()->route('order.confirmed', $order->id)
            ->with('success', $order->payment_status === 'paid' ? '✅ Payment successful!' : '⏳ Payment processing...');
    }

    public function cancel(Request $request, string $orderNumber)
    {
        $order = Order::where('order_number', $orderNumber)->first();
        if ($order && $order->payment_status === 'pending') {
            $this->handleFailed($order, 'Customer cancelled');
        }
        return redirect()->route('payment.failed')
            ->with('reason', 'Payment cancelled. No charge was made.');
    }

    private function handleComplete(Order $order, string $pfId): void
    {
        if ($order->payment_status === 'paid') {
            Log::info("PayFast: Order #{$order->id} already paid — skip");
            return;
        }
        $order->update([
            'payment_status' => 'paid',
            'status'         => 'processing',
            'notes'          => trim(($order->notes ?? '') . " [PayFast:{$pfId}]"),
        ]);
        // Stock reduces here — on confirmed payment, not at checkout (BUG 1.1/1.2).
        $order->load('items.product');
        $order->reduceStock();
        // Was completely missing before — customer never got any confirmation.
        try {
            (new \App\Services\OrderNotificationService())->notify($order->fresh(), 'processing');
        } catch (\Throwable $e) {
            Log::error('PayFast notify failed: ' . $e->getMessage());
        }
        if (method_exists($order, 'addStatusHistory')) {
            $order->addStatusHistory('processing', "Paid via PayFast. ID: {$pfId}", 'payfast');
        }
        // Loyalty points are awarded on DELIVERY only (Admin/OrderController),
        // using the admin-configurable rate — not here at payment time. This
        // used to award points a second time with a different, hardcoded
        // rate, meaning PayFast customers got double points at an inconsistent
        // value compared to every other payment method.
        Log::info("PayFast: Order #{$order->id} COMPLETE. PF ID: {$pfId}");
    }

    private function handleFailed(Order $order, string $reason): void
    {
        if (in_array($order->status, ['delivered','shipped','processing'])) return;
        $order->update(['payment_status' => 'failed', 'status' => 'cancelled', 'notes' => trim(($order->notes ?? '') . " [Failed:{$reason}]")]);
        // restoreStock() only actually restores anything if stock was really
        // reduced for this order in the first place (internally guarded) —
        // the old manual loop here had no such check and would also silently
        // never update stock_sold.
        $order->load('items.product');
        $order->restoreStock();
        if (method_exists($order, 'addStatusHistory')) {
            $order->addStatusHistory('cancelled', $reason, 'payfast');
        }
    }

    private function firstName(string $name): string { $p = explode(' ', trim($name), 2); return $p[0]; }
    private function lastName(string $name): string  { $p = explode(' ', trim($name), 2); return $p[1] ?? $p[0]; }
}
