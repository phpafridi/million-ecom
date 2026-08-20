<?php
namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\{Order, PaymentGateway, Setting};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Http, Log};

class PaymentController extends Controller
{
    // ─────────────────────────────────────────────────────
    // HELPERS
    // ─────────────────────────────────────────────────────

    private function markPaid(Order $order, string $txnId = ''): void
    {
        $order->update([
            'payment_status' => 'paid',
            'status'         => 'processing',
            'notes'          => trim(($order->notes ?? '') . ($txnId ? " [TxnID: $txnId]" : '')),
        ]);
        Log::info("Order #{$order->id} marked paid. TxnID: {$txnId}");
    }

    private function markFailed(Order $order, string $reason = ''): void
    {
        $order->update([
            'payment_status' => 'failed',
            'status'         => 'cancelled',
            'notes'          => trim(($order->notes ?? '') . " [Failed: $reason]"),
        ]);
        // Restore stock
        $order->load('items.product');
        foreach ($order->items as $item) {
            if ($item->product) {
                $item->product->increment('stock', $item->quantity);
                $item->product->decrement('stock_sold', $item->quantity);
            }
        }
        Log::warning("Order #{$order->id} payment failed. Reason: {$reason}");
    }

    private function cred(string $code): array
    {
        return PaymentGateway::where('code', $code)->first()?->credentials ?? [];
    }

    private function isTest(string $code): bool
    {
        return PaymentGateway::where('code', $code)->first()?->is_test_mode ?? true;
    }

    // ─────────────────────────────────────────────────────
    // JAZZCASH
    // ─────────────────────────────────────────────────────
    public function jazzcashRedirect(Order $order)
    {
        $gw   = PaymentGateway::where('code','jazzcash')->first();
        $cred = $gw?->credentials ?? [];

        $merchantId   = $cred['merchant_id']       ?? '';
        $password     = $cred['merchant_password'] ?? '';
        $integrityKey = $cred['integrity_salt']    ?? '';

        if (!$merchantId || !$password || !$integrityKey) {
            return redirect()->route('payment.failed')->with('reason', 'JazzCash credentials not configured.');
        }

        $txnRefNo = 'TJ' . $order->id . time();
        $amount   = str_pad((string)round($order->total * 100), 12, '0', STR_PAD_LEFT);
        $dateTime = date('YmdHis');
        $expiry   = date('YmdHis', strtotime('+1 hour'));
        $returnUrl= route('payment.jazzcash.callback');

        $data = [
            'pp_Version'              => '1.1',
            'pp_TxnType'              => 'MWALLET',
            'pp_Language'             => 'EN',
            'pp_MerchantID'           => $merchantId,
            'pp_Password'             => $password,
            'pp_TxnRefNo'             => $txnRefNo,
            'pp_Amount'               => $amount,
            'pp_TxnCurrency'          => 'PKR',
            'pp_TxnDateTime'          => $dateTime,
            'pp_BillReference'        => 'billRef' . $order->id,
            'pp_Description'          => 'Order #' . $order->id,
            'pp_TxnExpiryDateTime'    => $expiry,
            'pp_ReturnURL'            => $returnUrl,
            'pp_SubMerchantID'        => '',
            'pp_MobileNumber'         => preg_replace('/\D/', '', $order->customer_phone ?? ''),
            'ppmpf_1'                 => $order->id, // store order ID for callback
        ];

        ksort($data);
        $hashStr = $integrityKey . '&' . implode('&', array_values($data));
        $data['pp_SecureHash'] = hash_hmac('sha256', $hashStr, $integrityKey);

        $url = $gw->is_test_mode
            ? 'https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform'
            : 'https://payments.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform';

        $order->update(['notes' => trim(($order->notes ?? '') . " [JC:{$txnRefNo}]")]);

        return response($this->autoPostForm($url, $data));
    }

    public function jazzcashCallback(Request $request)
    {
        $code   = $request->pp_ResponseCode ?? '';
        $txnRef = $request->pp_TxnRefNo    ?? '';
        $orderId= $request->ppmpf_1        ?? '';

        $order  = Order::find($orderId)
            ?? Order::where('notes','like',"%JC:{$txnRef}%")->first();

        if (!$order) {
            return redirect()->route('home');
        }

        if ($code === '000') {
            $this->markPaid($order, $txnRef);
        } else {
            $this->markFailed($order, "JazzCash code: {$code}");
        }

        return $code === '000'
            ? redirect()->route('order.confirmed', $order->id)
            : redirect()->route('payment.failed')->with('reason', 'JazzCash payment was not completed (code: '.$code.').');
    }

    // ─────────────────────────────────────────────────────
    // EASYPAISA
    // ─────────────────────────────────────────────────────
    public function easypaisaRedirect(Order $order)
    {
        $gw   = PaymentGateway::where('code','easypaisa')->first();
        $cred = $gw?->credentials ?? [];
        $storeId = $cred['store_id'] ?? '';
        $hashKey = $cred['hash_key'] ?? '';

        if (!$storeId || !$hashKey) {
            return redirect()->route('payment.failed')->with('reason', 'Easypaisa credentials not configured.');
        }

        $epOrderId  = 'EP' . $order->id . time();
        $amount     = number_format($order->total, 2, '.', '');
        $returnUrl  = route('payment.easypaisa.callback');
        $expiry     = date('YmdHis', strtotime('+1 hour'));

        $postData = [
            'storeId'                  => $storeId,
            'orderId'                  => $epOrderId,
            'transactionAmount'        => $amount,
            'mobileAccountNo'          => preg_replace('/\D/', '', $order->customer_phone ?? ''),
            'emailAddress'             => $order->customer_email ?? '',
            'transactionType'          => 'InitialRequest',
            'tokenExpiry'              => $expiry,
            'bankIdentificationNumber' => '',
            'encryptedHashRequest'     => '',
            'paymentMethod'            => 'MA_PAYMENT',
            'postBackURL'              => $returnUrl,
            'merchantHashedReq'        => '',
        ];

        $hashStr = $storeId . '&' . $amount . '&' . $epOrderId . '&' . $expiry . '&' . $returnUrl;
        $postData['merchantHashedReq'] = hash_hmac('sha256', $hashStr, $hashKey);

        $url = $gw->is_test_mode
            ? 'https://easypaisasandbox.pk/api/generatetoken'
            : 'https://easypaisa.com.pk/easypay/Index.jsf';

        $order->update(['notes' => trim(($order->notes ?? '') . " [EP:{$epOrderId}]")]);

        return response($this->autoPostForm($url, $postData));
    }

    public function easypaisaCallback(Request $request)
    {
        $responseCode = $request->responseCode ?? $request->status ?? '';
        $epOrderId    = $request->orderId ?? '';

        $order = Order::where('notes','like',"%EP:{$epOrderId}%")->first();

        if (!$order) {
            return redirect()->route('home');
        }

        if (in_array($responseCode, ['00', '0000', '200'])) {
            $this->markPaid($order, $epOrderId);
            return redirect()->route('order.confirmed', $order->id);
        }

        $this->markFailed($order, "Easypaisa code: {$responseCode}");
        return redirect()->route('payment.failed')->with('reason', 'Easypaisa payment was not completed.');
    }

    // ─────────────────────────────────────────────────────
    // STRIPE
    // ─────────────────────────────────────────────────────
    public function stripeCheckout(Order $order)
    {
        $secretKey = $this->cred('stripe')['secret_key'] ?? '';

        if (!$secretKey) {
            return redirect()->route('payment.failed')->with('reason', 'Stripe not configured.');
        }

        $lineItems = [];
        foreach ($order->items as $item) {
            $lineItems[] = [
                'price_data[currency]'                  => 'pkr',
                'price_data[product_data][name]'        => $item->product_name,
                'price_data[unit_amount]'               => (int)($item->price * 100),
                'quantity'                              => $item->quantity,
            ];
        }
        if ($order->shipping > 0) {
            $lineItems[] = [
                'price_data[currency]'                  => 'pkr',
                'price_data[product_data][name]'        => 'Shipping',
                'price_data[unit_amount]'               => (int)($order->shipping * 100),
                'quantity'                              => 1,
            ];
        }

        // Stripe requires flat key format for form encoding
        $params = [
            'mode'                   => 'payment',
            'payment_method_types[]' => 'card',
            'success_url'            => route('payment.stripe.success', $order->id) . '?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url'             => route('payment.stripe.cancel',  $order->id),
            'client_reference_id'    => $order->id,
            'customer_email'         => $order->customer_email ?? '',
        ];

        foreach ($lineItems as $i => $item) {
            foreach ($item as $k => $v) {
                $params["line_items[{$i}][{$k}]"] = $v;
            }
        }

        $res = Http::withToken($secretKey)->asForm()
            ->post('https://api.stripe.com/v1/checkout/sessions', $params);

        if ($res->failed()) {
            Log::error('Stripe error: ' . $res->body());
            $this->markFailed($order, 'Stripe session creation failed');
            return redirect()->route('payment.failed')->with('reason', 'Could not connect to Stripe. Please try again.');
        }

        return redirect($res->json('url'));
    }

    public function stripeSuccess(Request $request, int $orderId)
    {
        $order     = Order::findOrFail($orderId);
        $secretKey = $this->cred('stripe')['secret_key'] ?? '';
        $sessionId = $request->session_id;

        if ($secretKey && $sessionId) {
            $session = Http::withToken($secretKey)
                ->get("https://api.stripe.com/v1/checkout/sessions/{$sessionId}")->json();

            if (($session['payment_status'] ?? '') === 'paid') {
                $this->markPaid($order, $sessionId);
                return redirect()->route('order.confirmed', $orderId);
            }

            $this->markFailed($order, 'Stripe session not paid: ' . ($session['payment_status'] ?? 'unknown'));
            return redirect()->route('payment.failed')->with('reason', 'Payment was not completed on Stripe.');
        }

        return redirect()->route('order.confirmed', $orderId);
    }

    public function stripeCancel(int $orderId)
    {
        $order = Order::find($orderId);
        if ($order) $this->markFailed($order, 'Cancelled by customer on Stripe');
        return redirect()->route('payment.failed')->with('reason', 'You cancelled the payment. Your order has not been placed.');
    }

    // ─────────────────────────────────────────────────────
    // PAYPAL
    // ─────────────────────────────────────────────────────
    public function paypalCheckout(Order $order)
    {
        $cred   = $this->cred('paypal');
        $isTest = $this->isTest('paypal');
        $base   = $isTest ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com';

        $tokenRes = Http::withBasicAuth($cred['client_id'] ?? '', $cred['client_secret'] ?? '')
            ->asForm()->post("{$base}/v1/oauth2/token", ['grant_type'=>'client_credentials']);

        if ($tokenRes->failed()) {
            $this->markFailed($order, 'PayPal auth failed');
            return redirect()->route('payment.failed')->with('reason', 'Could not connect to PayPal.');
        }

        $token    = $tokenRes->json('access_token');
        $orderRes = Http::withToken($token)->post("{$base}/v2/checkout/orders", [
            'intent' => 'CAPTURE',
            'purchase_units' => [[
                'reference_id' => (string)$order->id,
                'amount'       => [
                    'currency_code' => 'USD',
                    'value'         => number_format($order->total / 280, 2),
                ],
                'description' => 'Order #' . $order->id . ' - ' . config('app.name'),
            ]],
            'application_context' => [
                'return_url' => route('payment.paypal.success', $order->id),
                'cancel_url' => route('payment.paypal.cancel',  $order->id),
                'user_action'=> 'PAY_NOW',
            ],
        ]);

        if ($orderRes->failed()) {
            $this->markFailed($order, 'PayPal order creation failed');
            return redirect()->route('payment.failed')->with('reason', 'PayPal order creation failed.');
        }

        $approveLink = collect($orderRes->json('links'))->firstWhere('rel','approve');
        return redirect($approveLink['href'] ?? route('payment.failed'));
    }

    public function paypalSuccess(Request $request, int $orderId)
    {
        $order  = Order::findOrFail($orderId);
        $cred   = $this->cred('paypal');
        $isTest = $this->isTest('paypal');
        $base   = $isTest ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com';

        $tokenRes = Http::withBasicAuth($cred['client_id'] ?? '', $cred['client_secret'] ?? '')
            ->asForm()->post("{$base}/v1/oauth2/token", ['grant_type'=>'client_credentials']);

        if ($tokenRes->ok()) {
            $captureRes = Http::withToken($tokenRes->json('access_token'))
                ->post("{$base}/v2/checkout/orders/{$request->token}/capture");

            $captureStatus = $captureRes->json('status') ?? '';
            if ($captureStatus === 'COMPLETED') {
                $txnId = $captureRes->json('purchase_units.0.payments.captures.0.id') ?? $request->token;
                $this->markPaid($order, $txnId);
                return redirect()->route('order.confirmed', $orderId);
            }

            $this->markFailed($order, "PayPal capture status: {$captureStatus}");
            return redirect()->route('payment.failed')->with('reason', 'PayPal payment was not completed.');
        }

        return redirect()->route('payment.failed')->with('reason', 'PayPal verification failed.');
    }

    public function paypalCancel(int $orderId)
    {
        $order = Order::find($orderId);
        if ($order) $this->markFailed($order, 'Cancelled by customer on PayPal');
        return redirect()->route('payment.failed')->with('reason', 'You cancelled the PayPal payment.');
    }

    // ─────────────────────────────────────────────────────
    // SAFEPAY
    // ─────────────────────────────────────────────────────
    public function safepayCheckout(Order $order)
    {
        $cred   = $this->cred('safepay');
        $isTest = $this->isTest('safepay');
        $base   = $isTest ? 'https://sandbox.api.getsafepay.com' : 'https://api.getsafepay.com';
        $apiKey = $cred['api_key'] ?? '';

        if (!$apiKey) {
            return redirect()->route('payment.failed')->with('reason', 'Safepay not configured.');
        }

        $res = Http::withBasicAuth($apiKey, $cred['api_secret'] ?? '')
            ->post("{$base}/order/v1/init", [
                'merchant_api_key' => $apiKey,
                'amount'           => (int)($order->total * 100),
                'currency'         => 'PKR',
                'order_id'         => 'T' . $order->id,
                'redirect_url'     => route('payment.safepay.callback', $order->id),
                'cancel_url'       => route('payment.safepay.cancel',   $order->id),
            ]);

        if ($res->failed()) {
            $this->markFailed($order, 'Safepay init failed: ' . $res->status());
            return redirect()->route('payment.failed')->with('reason', 'Safepay connection failed.');
        }

        $tracker = $res->json('data.tracker.token') ?? '';
        $env     = $isTest ? 'sandbox' : 'production';
        return redirect("https://components.getsafepay.com/checkout?env={$env}&tbt={$tracker}&order_id=T{$order->id}");
    }

    public function safepayCallback(Request $request, int $orderId)
    {
        $order  = Order::findOrFail($orderId);
        $status = $request->payment_status ?? $request->status ?? '';

        if (in_array(strtolower($status), ['paid', 'success', 'completed'])) {
            $this->markPaid($order, $request->tracker ?? '');
            return redirect()->route('order.confirmed', $orderId);
        }

        $this->markFailed($order, "Safepay status: {$status}");
        return redirect()->route('payment.failed')->with('reason', 'Safepay payment was not completed.');
    }

    public function safepayCancel(int $orderId)
    {
        $order = Order::find($orderId);
        if ($order) $this->markFailed($order, 'Cancelled on Safepay');
        return redirect()->route('payment.failed')->with('reason', 'You cancelled the Safepay payment.');
    }


    // ─────────────────────────────────────────────────────
    // RAZORPAY — hosted checkout via API-created order
    // ─────────────────────────────────────────────────────
    public function razorpayCheckout(Order $order)
    {
        $cred   = $this->cred('razorpay');
        $keyId  = $cred['key_id']     ?? '';
        $secret = $cred['key_secret'] ?? '';

        if (!$keyId || !$secret) {
            return redirect()->route('payment.failed')->with('reason', 'Razorpay not configured.');
        }

        // Create a Razorpay order via API
        $res = Http::withBasicAuth($keyId, $secret)
            ->post('https://api.razorpay.com/v1/orders', [
                'amount'          => (int)($order->total * 100), // paise
                'currency'        => 'INR',
                'receipt'         => 'order_' . $order->id,
                'payment_capture' => 1,
            ]);

        if ($res->failed()) {
            $this->markFailed($order, 'Razorpay order creation failed');
            return redirect()->route('payment.failed')->with('reason', 'Could not connect to Razorpay.');
        }

        $rzOrderId = $res->json('id');
        $order->update(['notes' => trim(($order->notes ?? '') . " [RZ:{$rzOrderId}]")]);

        // Render an HTML page with Razorpay checkout.js (loaded from their CDN - no npm needed)
        $storeName = \App\Models\Setting::get('site_name', 'Tijar Store');
        $callbackUrl = route('payment.razorpay.success', $order->id);
        $cancelUrl   = route('payment.razorpay.cancel', $order->id);

        return response(<<<HTML
<!DOCTYPE html>
<html>
<head>
    <title>Complete Payment — {$storeName}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body { font-family: sans-serif; display: flex; align-items: center; justify-content: center;
               min-height: 100vh; margin: 0; background: #f5f7fa; }
        .box { text-align: center; padding: 40px; background: white; border-radius: 16px;
               box-shadow: 0 4px 24px rgba(0,0,0,0.08); max-width: 420px; width: 90%; }
        .spinner { width: 40px; height: 40px; border: 3px solid #e5e7eb; border-top-color: #2563eb;
                   border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 20px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        p { color: #6b7280; margin: 0; }
        .cancel { display: inline-block; margin-top: 20px; color: #9ca3af; font-size: 13px;
                  text-decoration: none; }
        .cancel:hover { color: #ef4444; }
    </style>
</head>
<body>
<div class="box">
    <div class="spinner"></div>
    <p>Opening Razorpay secure payment…</p>
    <a href="{$cancelUrl}" class="cancel">Cancel and go back</a>
</div>
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
<script>
var options = {
    key: "{$keyId}",
    amount: {$res->json('amount')},
    currency: "{$res->json('currency')}",
    name: "{$storeName}",
    description: "Order #{$order->id}",
    order_id: "{$rzOrderId}",
    handler: function(response) {
        var form = document.createElement('form');
        form.method = 'POST';
        form.action = '{$callbackUrl}';
        var fields = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            _token: document.querySelector('meta[name=csrf-token]') ? document.querySelector('meta[name=csrf-token]').content : ''
        };
        for (var k in fields) {
            var input = document.createElement('input');
            input.type = 'hidden'; input.name = k; input.value = fields[k];
            form.appendChild(input);
        }
        document.body.appendChild(form);
        form.submit();
    },
    prefill: { name: "{$order->customer_name}", contact: "{$order->customer_phone}", email: "{$order->customer_email}" },
    theme: { color: "#2563eb" },
    modal: { ondismiss: function() { window.location.href = '{$cancelUrl}'; } }
};
var rzp = new Razorpay(options);
rzp.open();
</script>
</body>
</html>
HTML);
    }

    public function razorpayCancel(int $orderId)
    {
        $order = Order::find($orderId);
        if ($order) $this->markFailed($order, 'Cancelled by customer on Razorpay');
        return redirect()->route('payment.failed')->with('reason', 'You cancelled the Razorpay payment.');
    }

    // ─────────────────────────────────────────────────────
    // PAYSTACK — redirect to hosted checkout
    // ─────────────────────────────────────────────────────
    public function paystackCheckout(Order $order)
    {
        $cred      = $this->cred('paystack');
        $publicKey = $cred['public_key'] ?? '';
        $secretKey = $cred['secret_key'] ?? '';

        if (!$secretKey) {
            return redirect()->route('payment.failed')->with('reason', 'Paystack not configured.');
        }

        // Initialize transaction via Paystack API
        $ref = 'PS' . $order->id . time();
        $res = Http::withToken($secretKey)
            ->post('https://api.paystack.co/transaction/initialize', [
                'email'        => $order->customer_email ?: 'customer@example.com',
                'amount'       => (int)($order->total * 100), // kobo
                'reference'    => $ref,
                'callback_url' => route('payment.paystack.callback', $order->id),
                'metadata'     => ['order_id' => $order->id, 'cancel_action' => route('payment.paystack.cancel', $order->id)],
            ]);

        if ($res->failed() || !$res->json('status')) {
            $this->markFailed($order, 'Paystack init failed: ' . $res->json('message'));
            return redirect()->route('payment.failed')->with('reason', 'Could not connect to Paystack.');
        }

        $order->update(['notes' => trim(($order->notes ?? '') . " [PS:{$ref}]")]);
        return redirect($res->json('data.authorization_url'));
    }

    public function paystackCancel(int $orderId)
    {
        $order = Order::find($orderId);
        if ($order) $this->markFailed($order, 'Cancelled on Paystack');
        return redirect()->route('payment.failed')->with('reason', 'You cancelled the Paystack payment.');
    }

    // ─────────────────────────────────────────────────────
    // FLUTTERWAVE — redirect to hosted checkout
    // ─────────────────────────────────────────────────────
    public function flutterwaveCheckout(Order $order)
    {
        $cred      = $this->cred('flutterwave');
        $publicKey = $cred['public_key'] ?? '';
        $secretKey = $cred['secret_key'] ?? '';

        if (!$secretKey) {
            return redirect()->route('payment.failed')->with('reason', 'Flutterwave not configured.');
        }

        $txRef = 'FLW' . $order->id . time();
        $res   = Http::withToken($secretKey)
            ->post('https://api.flutterwave.com/v3/payments', [
                'tx_ref'          => $txRef,
                'amount'          => $order->total,
                'currency'        => 'NGN', // change to your currency
                'redirect_url'    => route('payment.flutterwave.callback', $order->id),
                'customer'        => [
                    'email' => $order->customer_email ?: 'customer@example.com',
                    'name'  => $order->customer_name,
                    'phone_number' => $order->customer_phone,
                ],
                'customizations'  => [
                    'title'       => \App\Models\Setting::get('site_name', 'Tijar Store'),
                    'description' => 'Order #' . $order->id,
                ],
                'meta'            => ['order_id' => $order->id],
            ]);

        if ($res->failed() || !$res->json('status') === 'success') {
            $this->markFailed($order, 'Flutterwave init failed');
            return redirect()->route('payment.failed')->with('reason', 'Could not connect to Flutterwave.');
        }

        $order->update(['notes' => trim(($order->notes ?? '') . " [FLW:{$txRef}]")]);
        return redirect($res->json('data.link'));
    }

    public function flutterwaveCancel(int $orderId)
    {
        $order = Order::find($orderId);
        if ($order) $this->markFailed($order, 'Cancelled on Flutterwave');
        return redirect()->route('payment.failed')->with('reason', 'You cancelled the Flutterwave payment.');
    }

    // ─────────────────────────────────────────────────────
    // RAZORPAY — verify callback
    // ─────────────────────────────────────────────────────
    public function razorpaySuccess(Request $request, int $orderId)
    {
        $order  = Order::findOrFail($orderId);
        $cred   = $this->cred('razorpay');
        $secret = $cred['key_secret'] ?? '';

        $paymentId = $request->razorpay_payment_id ?? '';
        $rzOrderId = $request->razorpay_order_id   ?? '';
        $signature = $request->razorpay_signature   ?? '';

        if ($secret && $paymentId && $signature) {
            $expected = hash_hmac('sha256', $rzOrderId . '|' . $paymentId, $secret);
            if (hash_equals($expected, $signature)) {
                $this->markPaid($order, $paymentId);
                return redirect()->route('order.confirmed', $orderId);
            }
            $this->markFailed($order, 'Razorpay signature mismatch');
            return redirect()->route('payment.failed')->with('reason', 'Payment verification failed.');
        }

        return redirect()->route('payment.failed')->with('reason', 'Razorpay payment incomplete.');
    }

    // ─────────────────────────────────────────────────────
    // PAYSTACK
    // ─────────────────────────────────────────────────────
    public function paystackCallback(Request $request, int $orderId)
    {
        $order  = Order::findOrFail($orderId);
        $secret = $this->cred('paystack')['secret_key'] ?? '';
        $ref    = $request->reference ?? $request->trxref ?? '';

        if ($secret && $ref) {
            $res = Http::withToken($secret)->get("https://api.paystack.co/transaction/verify/{$ref}");
            if ($res->json('data.status') === 'success') {
                $this->markPaid($order, $ref);
                return redirect()->route('order.confirmed', $orderId);
            }
            $this->markFailed($order, 'Paystack: ' . ($res->json('data.gateway_response') ?? 'failed'));
        }

        return redirect()->route('payment.failed')->with('reason', 'Paystack payment not verified.');
    }

    // ─────────────────────────────────────────────────────
    // FLUTTERWAVE
    // ─────────────────────────────────────────────────────
    public function flutterwaveCallback(Request $request, int $orderId)
    {
        $order  = Order::findOrFail($orderId);
        $secret = $this->cred('flutterwave')['secret_key'] ?? '';
        $txId   = $request->transaction_id ?? '';

        if ($secret && $txId) {
            $res = Http::withToken($secret)->get("https://api.flutterwave.com/v3/transactions/{$txId}/verify");
            if ($res->json('data.status') === 'successful') {
                $this->markPaid($order, $txId);
                return redirect()->route('order.confirmed', $orderId);
            }
            $this->markFailed($order, 'Flutterwave: ' . ($res->json('data.processor_response') ?? 'failed'));
        }

        return redirect()->route('payment.failed')->with('reason', 'Flutterwave payment not verified.');
    }

    // ─────────────────────────────────────────────────────
    // UTILITY
    // ─────────────────────────────────────────────────────
    private function autoPostForm(string $url, array $data): string
    {
        $fields = '';
        foreach ($data as $k => $v) {
            $fields .= '<input type="hidden" name="' . htmlspecialchars($k) . '" value="' . htmlspecialchars($v ?? '') . '">';
        }
        return '<!DOCTYPE html><html><head><title>Redirecting to payment…</title></head><body>
            <p style="font-family:sans-serif;text-align:center;margin-top:50px;color:#666">Redirecting to payment gateway…</p>
            <form id="pgform" method="POST" action="' . $url . '">' . $fields . '</form>
            <script>document.getElementById("pgform").submit();</script>
        </body></html>';
    }
}


    // ─────────────────────────────────────────────────────
    // CHECKOUT.COM
    // ─────────────────────────────────────────────────────
    public function checkoutRedirect(Order $order)
    {
        $cred      = $this->cred('checkout');
        $secretKey = $cred['secret_key'] ?? '';
        $isTest    = $this->isTest('checkout');

        if (!$secretKey) {
            return redirect()->route('payment.failed')->with('reason', 'Checkout.com not configured.');
        }

        $base = $isTest
            ? 'https://api.sandbox.checkout.com'
            : 'https://api.checkout.com';

        $response = Http::withToken($secretKey)
            ->post("{$base}/payments", [
                'amount'      => (int)($order->total * 100), // In paise/fils
                'currency'    => 'PKR',
                'reference'   => 'ORDER-' . $order->id,
                'description' => 'Millionaire Order #' . $order->id,
                'customer'    => [
                    'email' => $order->customer_email ?? 'customer@millionaire.pk',
                    'name'  => $order->customer_name,
                ],
                'success_url' => route('payment.checkout.success', $order->id),
                'failure_url' => route('payment.checkout.cancel', $order->id),
                '3ds'         => ['enabled' => true],
            ]);

        if ($response->successful()) {
            $data    = $response->json();
            $payLink = $data['_links']['redirect']['href'] ?? null;
            if ($payLink) {
                return redirect($payLink);
            }
        }

        Log::error('Checkout.com error: ' . $response->body());
        $this->markFailed($order, 'Checkout.com payment initiation failed.');
        return redirect()->route('payment.failed');
    }

    public function checkoutSuccess(Request $request, int $orderId)
    {
        $order     = Order::findOrFail($orderId);
        $cred      = $this->cred('checkout');
        $secretKey = $cred['secret_key'] ?? '';
        $isTest    = $this->isTest('checkout');
        $base      = $isTest ? 'https://api.sandbox.checkout.com' : 'https://api.checkout.com';

        $sessionId = $request->query('cko-session-id');
        if (!$sessionId) {
            $this->markFailed($order, 'Missing session ID.');
            return redirect()->route('payment.failed');
        }

        // ✅ Verify payment with Checkout.com — never trust callback alone
        $response = Http::withToken($secretKey)
            ->get("{$base}/payments/{$sessionId}");

        if ($response->successful()) {
            $payment = $response->json();
            if (($payment['status'] ?? '') === 'Authorized' || ($payment['status'] ?? '') === 'Captured') {
                $this->markPaid($order, $payment['id'] ?? $sessionId);
                return redirect()->route('order.confirmed', $order->id);
            }
        }

        $this->markFailed($order, 'Checkout.com verification failed.');
        return redirect()->route('payment.failed');
    }

    public function checkoutCancel(int $orderId)
    {
        $order = Order::findOrFail($orderId);
        $this->markFailed($order, 'Customer cancelled Checkout.com payment.');
        return redirect()->route('payment.failed');
    }

    // ─────────────────────────────────────────────────────
    // PAYMOB
    // ─────────────────────────────────────────────────────
    public function paymobRedirect(Order $order)
    {
        $cred          = $this->cred('paymob');
        $apiKey        = $cred['api_key']        ?? '';
        $integrationId = $cred['integration_id'] ?? '';
        $iframeId      = $cred['iframe_id']      ?? '';

        if (!$apiKey || !$integrationId || !$iframeId) {
            return redirect()->route('payment.failed')->with('reason', 'Paymob credentials not configured.');
        }

        try {
            // Step 1: Authenticate
            $authResponse = Http::post('https://accept.paymob.com/api/auth/tokens', [
                'api_key' => $apiKey,
            ]);
            $token = $authResponse->json('token');
            if (!$token) throw new \Exception('Paymob auth failed.');

            // Step 2: Register order
            $orderResponse = Http::post('https://accept.paymob.com/api/ecommerce/orders', [
                'auth_token'         => $token,
                'delivery_needed'    => false,
                'amount_cents'       => (int)($order->total * 100),
                'currency'           => 'PKR',
                'merchant_order_id'  => $order->id,
                'items'              => [],
            ]);
            $paymobOrderId = $orderResponse->json('id');
            if (!$paymobOrderId) throw new \Exception('Paymob order registration failed.');

            // Step 3: Get payment key
            $keyResponse = Http::post('https://accept.paymob.com/api/acceptance/payment_keys', [
                'auth_token'      => $token,
                'amount_cents'    => (int)($order->total * 100),
                'expiration'      => 3600,
                'order_id'        => $paymobOrderId,
                'billing_data'    => [
                    'apartment'       => 'NA',
                    'email'           => $order->customer_email ?? 'customer@millionaire.pk',
                    'floor'           => 'NA',
                    'first_name'      => $order->customer_name,
                    'street'          => $order->customer_address ?? 'NA',
                    'building'        => 'NA',
                    'phone_number'    => $order->customer_phone,
                    'shipping_method' => 'NA',
                    'postal_code'     => 'NA',
                    'city'            => $order->city ?? 'NA',
                    'country'         => 'PK',
                    'last_name'       => 'Customer',
                    'state'           => 'NA',
                ],
                'currency'           => 'PKR',
                'integration_id'     => (int)$integrationId,
            ]);
            $paymentKey = $keyResponse->json('token');
            if (!$paymentKey) throw new \Exception('Paymob payment key failed.');

            // Step 4: Redirect to iframe
            return redirect("https://accept.paymob.com/api/acceptance/iframes/{$iframeId}?payment_token={$paymentKey}");

        } catch (\Throwable $e) {
            Log::error('Paymob error: ' . $e->getMessage());
            $this->markFailed($order, 'Paymob error: ' . $e->getMessage());
            return redirect()->route('payment.failed');
        }
    }

    public function paymobCallback(Request $request)
    {
        $cred    = $this->cred('paymob');
        $hmacKey = $cred['hmac_secret'] ?? '';

        // ✅ Verify HMAC signature from Paymob
        if ($hmacKey) {
            $data = $request->all();
            $hmacFields = [
                'amount_cents', 'created_at', 'currency', 'error_occured',
                'has_parent_transaction', 'id', 'integration_id', 'is_3d_secure',
                'is_auth', 'is_capture', 'is_refunded', 'is_standalone_payment',
                'is_voided', 'order.id', 'owner', 'pending', 'source_data.pan',
                'source_data.sub_type', 'source_data.type', 'success',
            ];
            $str = '';
            foreach ($hmacFields as $field) {
                $keys  = explode('.', $field);
                $value = $data;
                foreach ($keys as $k) { $value = $value[$k] ?? ''; }
                $str .= $value;
            }
            $calculated = hash_hmac('sha512', $str, $hmacKey);
            if (!hash_equals($calculated, $request->query('hmac', ''))) {
                Log::warning('Paymob HMAC mismatch');
                return response('HMAC mismatch', 422);
            }
        }

        $orderId = $request->input('merchant_order_id') ?? $request->input('order.merchant_order_id');
        $success = filter_var($request->input('success'), FILTER_VALIDATE_BOOLEAN);
        $txnId   = $request->input('id', '');

        $order = Order::find($orderId);
        if (!$order) return response('Order not found', 404);

        if ($success) {
            $this->markPaid($order, 'Paymob-' . $txnId);
        } else {
            $this->markFailed($order, 'Paymob payment failed.');
        }

        return response('OK', 200);
    }

    public function paymobSuccess(int $orderId)
    {
        $order = Order::findOrFail($orderId);
        if ($order->payment_status === 'paid') {
            return redirect()->route('order.confirmed', $order->id);
        }
        return redirect()->route('payment.failed');
    }
}
