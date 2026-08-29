<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\{User, Order, Setting, EmailSubscriber};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Mail, Log};
use Inertia\Inertia;

class EmailCampaignController extends Controller
{
    public function index()
    {
        $subscribers    = EmailSubscriber::where('is_active', true)->orderByDesc('subscribed_at')->get();
        $orderedEmails  = Order::whereNotNull('customer_email')->distinct('customer_email')->count();
        $registeredEmails = User::where('role','customer')->whereNotNull('email')->count();

        return Inertia::render('Admin/EmailCampaigns/Index', [
            'subscribers'      => $subscribers,
            'subscriberCount'  => $subscribers->count(),
            'orderedCount'     => $orderedEmails,
            'registeredCount'  => $registeredEmails,
            'totalCount'       => $subscribers->count() + $orderedEmails + $registeredEmails,
        ]);
    }

    // Add single subscriber
    public function addSubscriber(Request $request)
    {
        $data = $request->validate([
            'email' => 'required|email|unique:email_subscribers,email',
            'name'  => 'nullable|string|max:100',
        ]);

        EmailSubscriber::create([
            'email'  => $data['email'],
            'name'   => $data['name'] ?? null,
            'source' => 'manual',
        ]);

        return back()->with('success', "Added {$data['email']} to subscribers.");
    }

    // Bulk import from CSV paste or file
    public function importSubscribers(Request $request)
    {
        $request->validate([
            'emails' => 'required|string',
        ]);

        $lines   = preg_split('/[\r\n,;]+/', $request->emails);
        $added   = 0; $skipped = 0;

        foreach ($lines as $line) {
            $line = trim($line);
            // Handle "Name <email>" or "email, Name" or just "email" formats
            $email = $name = null;

            if (preg_match('/^(.+)<(.+@.+)>$/', $line, $m)) {
                $name  = trim($m[1]);
                $email = trim($m[2]);
            } elseif (preg_match('/^(.+@\S+),\s*(.+)$/', $line, $m)) {
                $email = trim($m[1]);
                $name  = trim($m[2]);
            } elseif (filter_var($line, FILTER_VALIDATE_EMAIL)) {
                $email = $line;
            }

            if ($email && filter_var($email, FILTER_VALIDATE_EMAIL)) {
                EmailSubscriber::firstOrCreate(
                    ['email' => strtolower($email)],
                    ['name' => $name, 'source' => 'import', 'is_active' => true]
                ) ? $added++ : $skipped++;
            }
        }

        return back()->with('success', "{$added} subscribers added, {$skipped} already existed.");
    }

    // Remove subscriber
    public function removeSubscriber(EmailSubscriber $subscriber)
    {
        $subscriber->delete();
        return back()->with('success', 'Subscriber removed.');
    }

    // Send test email
    public function sendTest(Request $request)
    {
        $data = $request->validate([
            'subject'    => 'required|string|max:200',
            'body'       => 'required|string',
            'test_email' => 'required|email',
        ]);

        $settings = Setting::allKeyed();
        $html     = $this->buildHtml($data['body'], [
            'name'       => 'Test User',
            'store_name' => $settings['site_name'] ?? 'Our Store',
            'store_url'  => url('/'),
        ], $settings);

        try {
            Mail::html($html, function($m) use ($data, $settings) {
                $m->to($data['test_email'])
                  ->subject('[TEST] ' . $data['subject'])
                  ->from($settings['email'] ?? config('mail.from.address'),
                         $settings['site_name'] ?? config('mail.from.name'));
            });
            return back()->with('success', 'Test email sent to ' . $data['test_email']);
        } catch (\Throwable $e) {
            Log::error('Test email failed: ' . $e->getMessage());
            return back()->with('error', 'Failed: ' . $e->getMessage());
        }
    }

    // Send campaign
    public function send(Request $request)
    {
        $data = $request->validate([
            'subject'   => 'required|string|max:200',
            'body'      => 'required|string',
            'audiences' => 'required|array|min:1',
        ]);

        $settings  = Setting::allKeyed();
        $storeName = $settings['site_name'] ?? 'Our Store';
        $fromEmail = $settings['email']     ?? config('mail.from.address');
        $storeUrl  = url('/');

        // Build recipient list from selected audiences
        $recipients = collect();

        if (in_array('subscribers', $data['audiences'])) {
            EmailSubscriber::where('is_active', true)->get()
                ->each(fn($s) => $recipients->push(['name' => $s->name ?? 'Subscriber', 'email' => $s->email]));
        }
        if (in_array('ordered', $data['audiences'])) {
            Order::whereNotNull('customer_email')->distinct('customer_email')
                ->get(['customer_name as name','customer_email as email'])
                ->each(fn($o) => $recipients->push(['name' => $o->name, 'email' => $o->email]));
        }
        if (in_array('registered', $data['audiences'])) {
            User::where('role','customer')->whereNotNull('email')
                ->get(['name','email'])
                ->each(fn($u) => $recipients->push(['name' => $u->name, 'email' => $u->email]));
        }

        // Deduplicate by email
        $recipients = $recipients->unique('email')->values();

        $sent = 0; $failed = 0;

        foreach ($recipients as $r) {
            try {
                $html = $this->buildHtml($data['body'], [
                    'name'       => $r['name'] ?? 'Valued Customer',
                    'store_name' => $storeName,
                    'store_url'  => $storeUrl,
                ], $settings);

                Mail::html($html, function($m) use ($r, $data, $fromEmail, $storeName) {
                    $m->to($r['email'], $r['name'] ?? '')
                      ->subject($data['subject'])
                      ->from($fromEmail, $storeName);
                });
                $sent++;
                usleep(100000); // 100ms between sends
            } catch (\Throwable $e) {
                Log::warning("Campaign failed to {$r['email']}: " . $e->getMessage());
                $failed++;
            }
        }

        return back()->with('success',
            "Sent to {$sent} people" . ($failed > 0 ? ", {$failed} failed." : '.')
        );
    }

    private function buildHtml(string $body, array $vars, array $settings): string
    {
        $text = $body;
        foreach ($vars as $k => $v) {
            $text = str_replace('{' . $k . '}', $v, $text);
        }
        $lines   = array_map('nl2br', [htmlspecialchars($text)]);
        $content = implode('', $lines);
        $primary = $settings['dark_bg'] ?? '#0a0e1a';
        $accent  = $settings['primary'] ?? '#00c8ff';
        $name    = $settings['site_name'] ?? 'Our Store';
        $initial = strtoupper(substr($name, 0, 1));
        $url     = $vars['store_url'];

        return <<<HTML
<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;background:#f0f2f5;margin:0;padding:24px 16px;">
<div style="max-width:560px;margin:0 auto;">
  <div style="background:white;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
    <div style="background:{$primary};padding:28px 32px;text-align:center;">
      <div style="display:inline-block;width:44px;height:44px;border-radius:10px;background:{$accent};text-align:center;line-height:44px;font-size:20px;font-weight:900;color:{$primary};margin-bottom:12px;">{$initial}</div>
      <div style="font-size:18px;font-weight:900;color:white;">{$name}</div>
    </div>
    <div style="padding:32px;font-size:14px;color:#374151;line-height:1.8;">{$content}</div>
    <div style="padding:20px 32px;border-top:1px solid #f0f2f5;text-align:center;">
      <a href="{$url}" style="display:inline-block;background:{$accent};color:{$primary};font-weight:800;font-size:13px;padding:12px 28px;border-radius:10px;text-decoration:none;">Visit Our Store →</a>
    </div>
  </div>
  <p style="text-align:center;font-size:11px;color:#9ca3af;margin-top:16px;">© {$name}</p>
</div>
</body></html>
HTML;
    }
}
