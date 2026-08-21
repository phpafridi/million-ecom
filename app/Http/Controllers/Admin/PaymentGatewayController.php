<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PaymentGateway;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class PaymentGatewayController extends Controller
{
    // ── All gateway configs — credential fields, docs, test info ─────
    private function gatewayConfig(): array
    {
        return [
            'cod' => [
                'status' => 'always_works',
                'credential_fields' => [],
                'docs' => '',
                'note' => 'No API keys needed. Works immediately.',
                'test_card' => null,
            ],
            'bank_transfer' => [
                'status' => 'always_works',
                'credential_fields' => [
                    ['key'=>'bank_name',      'label'=>'Bank Name',      'type'=>'text',    'placeholder'=>'e.g. HBL, Meezan, MCB'],
                    ['key'=>'account_title',  'label'=>'Account Title',  'type'=>'text',    'placeholder'=>'Millionaire Pvt Ltd'],
                    ['key'=>'account_number', 'label'=>'Account Number', 'type'=>'text',    'placeholder'=>'0000-0000000-00'],
                    ['key'=>'iban',           'label'=>'IBAN',           'type'=>'text',    'placeholder'=>'PK00HABB0000000000000000'],
                    ['key'=>'branch_code',    'label'=>'Branch Code',    'type'=>'text',    'placeholder'=>'0000'],
                ],
                'docs' => '',
                'note' => 'These bank details are shown to customers at checkout. They transfer manually and upload proof.',
                'test_card' => null,
            ],
            'jazzcash' => [
                'status' => 'sandbox_available',
                'credential_fields' => [
                    ['key'=>'merchant_id',       'label'=>'Merchant ID',       'type'=>'text',     'placeholder'=>'Enter JazzCash Merchant ID'],
                    ['key'=>'merchant_password', 'label'=>'Merchant Password', 'type'=>'password', 'placeholder'=>'Enter JazzCash Password'],
                    ['key'=>'integrity_salt',    'label'=>'Integrity Salt',    'type'=>'password', 'placeholder'=>'Enter Integrity Salt'],
                ],
                'docs' => 'https://sandbox.jazzcash.com.pk/Application/DocumentCenter',
                'note' => 'Apply at jazzcash.com.pk/business. Sandbox credentials available for testing.',
                'test_card' => ['number'=>'5123456789012346','expiry'=>'12/25','cvv'=>'100','pin'=>'1234'],
            ],
            'easypaisa' => [
                'status' => 'sandbox_available',
                'credential_fields' => [
                    ['key'=>'store_id',   'label'=>'Store ID',   'type'=>'text',     'placeholder'=>'Enter Easypaisa Store ID'],
                    ['key'=>'hash_key',   'label'=>'Hash Key',   'type'=>'password', 'placeholder'=>'Enter Hash Key'],
                    ['key'=>'account_num','label'=>'Account No', 'type'=>'text',     'placeholder'=>'03xx-xxxxxxx'],
                ],
                'docs' => 'https://easypaisa.com.pk/business',
                'note' => 'Register at easypaisa.com.pk as a merchant. Get Store ID and Hash Key from your Easypaisa merchant portal.',
                'test_card' => null,
            ],
            'payfast' => [
                'status' => 'sandbox_available',
                'credential_fields' => [
                    ['key'=>'merchant_id',  'label'=>'Merchant ID',  'type'=>'text',     'placeholder'=>'10000100 (sandbox) or your live Merchant ID'],
                    ['key'=>'merchant_key', 'label'=>'Merchant Key', 'type'=>'text',     'placeholder'=>'46f0cd694581a (sandbox) or your live Key'],
                    ['key'=>'passphrase',   'label'=>'Passphrase',   'type'=>'password', 'placeholder'=>'Set in PayFast → Settings → Security → Passphrase'],
                ],
                'docs' => 'https://developers.payfast.co.za/docs',
                'note' => 'Sandbox: Merchant ID = 10000100, Merchant Key = 46f0cd694581a. Get live credentials from payfast.co.za → Settings → Merchant Details. Set Notify URL to: ' . url('/payment/payfast/itn'),
                'test_card' => ['number'=>'4000000000000002','expiry'=>'12/25','cvv'=>'123','note'=>'Use sandbox credentials with this test card'],
            ],


            'stripe' => [
                'status' => 'sandbox_available',
                'credential_fields' => [
                    ['key'=>'publishable_key', 'label'=>'Publishable Key', 'type'=>'text',     'placeholder'=>'pk_test_... or pk_live_...'],
                    ['key'=>'secret_key',      'label'=>'Secret Key',      'type'=>'password', 'placeholder'=>'sk_test_... or sk_live_...'],
                    ['key'=>'webhook_secret',  'label'=>'Webhook Secret',  'type'=>'password', 'placeholder'=>'whsec_...'],
                ],
                'docs' => 'https://dashboard.stripe.com/apikeys',
                'note' => 'Get keys from stripe.com → Developers → API Keys. Best for international cards.',
                'test_card' => ['number'=>'4242424242424242','expiry'=>'12/25','cvv'=>'123'],
            ],
            'paypal' => [
                'status' => 'sandbox_available',
                'credential_fields' => [
                    ['key'=>'client_id',     'label'=>'Client ID',     'type'=>'text',     'placeholder'=>'AeA...'],
                    ['key'=>'client_secret', 'label'=>'Client Secret', 'type'=>'password', 'placeholder'=>'EK4...'],
                ],
                'docs' => 'https://developer.paypal.com/api/rest',
                'note' => 'Create sandbox app at developer.paypal.com. Best for Gulf and international customers.',
                'test_card' => ['email'=>'sb-buyer@personal.example.com','password'=>'12345678'],
            ],
            'safepay' => [
                'status' => 'sandbox_available',
                'credential_fields' => [
                    ['key'=>'api_key',    'label'=>'API Key',    'type'=>'password', 'placeholder'=>'Enter Safepay API Key'],
                    ['key'=>'api_secret', 'label'=>'API Secret', 'type'=>'password', 'placeholder'=>'Enter Safepay Secret'],
                ],
                'docs' => 'https://getsafepay.com/docs',
                'note' => 'Register at getsafepay.com. Pakistan-focused payment gateway.',
                'test_card' => ['number'=>'4000000000000002','expiry'=>'12/25','cvv'=>'123'],
            ],



        ];
    }

    // ── Index ─────────────────────────────────────────────────────────
    public function index()
    {
        $config   = $this->gatewayConfig();
        $gateways = PaymentGateway::orderBy('sort_order')->get()
            ->map(fn($g) => array_merge($g->toArray(), [
                'config'      => $config[$g->code] ?? ['status'=>'sandbox_available','credential_fields'=>[],'docs'=>'','note'=>''],
                'credentials' => $g->credentials ?? [],
            ]));

        return Inertia::render('Admin/Payments/Index', [
            'gateways' => $gateways,
        ]);
    }

    // ── Update ────────────────────────────────────────────────────────
    public function update(Request $request, PaymentGateway $gateway)
    {
        $data = $request->validate([
            'is_enabled'    => 'boolean',
            'is_test_mode'  => 'boolean',
            'instructions'  => 'nullable|string|max:1000',
            'credentials'   => 'nullable|array',
            'credentials.*' => 'nullable|string|max:500',
            'sort_order'    => 'nullable|integer',
        ]);

        if (!empty($data['credentials'])) {
            $data['credentials'] = array_map('strip_tags', $data['credentials']);
        }

        $gateway->update($data);
        return back()->with('success', "{$gateway->name} settings saved.");
    }

    // ── Toggle ────────────────────────────────────────────────────────
    public function toggleEnabled(PaymentGateway $gateway)
    {
        $gateway->update(['is_enabled' => !$gateway->is_enabled]);
        $state = $gateway->fresh()->is_enabled ? 'enabled ✅' : 'disabled';
        return back()->with('success', "{$gateway->name} {$state}.");
    }

    // ── Test Connection ───────────────────────────────────────────────
    public function testConnection(Request $request, PaymentGateway $gateway)
    {
        $cred = $gateway->credentials ?? [];

        try {
            $result = match($gateway->code) {
                'stripe'   => $this->testStripe($cred),
                'paymob'   => $this->testPaymob($cred),
                'checkout' => $this->testCheckout($cred),
                'payfast'  => $this->testPayfast($cred, $gateway->is_test_mode),
                default    => ['success' => false, 'message' => 'Test not available for this gateway.'],
            };
        } catch (\Throwable $e) {
            $result = ['success' => false, 'message' => $e->getMessage()];
        }

        return response()->json($result);
    }

    private function testStripe(array $cred): array
    {
        if (empty($cred['secret_key'])) return ['success'=>false,'message'=>'Secret key not configured.'];
        $r = Http::withToken($cred['secret_key'])->get('https://api.stripe.com/v1/balance');
        return $r->successful()
            ? ['success'=>true, 'message'=>'✅ Stripe connected!']
            : ['success'=>false,'message'=>'Stripe: '.($r->json('error.message') ?? 'Invalid key')];
    }

    private function testPaymob(array $cred): array
    {
        if (empty($cred['api_key'])) return ['success'=>false,'message'=>'API key not configured.'];
        $r = Http::post('https://accept.paymob.com/api/auth/tokens', ['api_key'=>$cred['api_key']]);
        return ($r->successful() && $r->json('token'))
            ? ['success'=>true, 'message'=>'✅ Paymob connected!']
            : ['success'=>false,'message'=>'Paymob: Invalid API key'];
    }

    private function testCheckout(array $cred): array
    {
        if (empty($cred['secret_key'])) return ['success'=>false,'message'=>'Secret key not configured.'];
        $base = str_contains($cred['secret_key'], 'test') ? 'https://api.sandbox.checkout.com' : 'https://api.checkout.com';
        $r = Http::withToken($cred['secret_key'])->get("{$base}/payment-links");
        return $r->status() !== 401
            ? ['success'=>true, 'message'=>'✅ Checkout.com connected!']
            : ['success'=>false,'message'=>'Checkout.com: Invalid secret key'];
    }

    private function testPayfast(array $cred, bool $sandbox): array
    {
        if (empty($cred['merchant_id']) || empty($cred['merchant_key'])) {
            return ['success'=>false,'message'=>'Merchant ID and Key are required.'];
        }
        // PayFast doesn't have a dedicated test endpoint but we can validate credentials format
        $id  = $cred['merchant_id'];
        $key = $cred['merchant_key'];

        if ($sandbox && $id === '10000100') {
            return ['success'=>true, 'message'=>'✅ PayFast Sandbox credentials look correct! (ID: 10000100)'];
        }
        if (strlen($id) > 5 && strlen($key) > 8) {
            return ['success'=>true, 'message'=>'✅ PayFast credentials set. Make a test payment to fully verify.'];
        }
        return ['success'=>false,'message'=>'PayFast: Credentials appear incomplete.'];
    }
}
