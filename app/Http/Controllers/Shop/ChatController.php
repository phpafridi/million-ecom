<?php
namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{DB, Log};
use Illuminate\Support\Str;

/**
 * Chat System Flow:
 * 1. Widget opens → bot greets, asks name/email
 * 2. Shows FAQ categories as quick buttons
 * 3. User picks topic or types keyword → bot searches chat_faqs
 * 4. If found → shows answer + "Was this helpful?"
 * 5. If not found or user wants human → asks to wait for agent
 * 6. Session status changes to 'waiting' → admin notified
 * 7. Agent picks up from admin Chat panel → real-time polling
 */
class ChatController extends Controller
{
    // ── Start or resume session ───────────────────────────────────────
    public function start(Request $request)
    {
        $sessionId = $request->cookie('chat_session') ?? Str::uuid()->toString();

        $session = DB::table('chat_sessions')->where('session_id', $sessionId)->first();

        if (!$session) {
            $id = DB::table('chat_sessions')->insertGetId([
                'session_id'   => $sessionId,
                'user_id'      => auth()->id(),
                'visitor_name' => auth()->user()?->name,
                'visitor_email'=> auth()->user()?->email,
                'status'       => 'bot',
                'bot_step'     => 0,
                'created_at'   => now(),
                'updated_at'   => now(),
            ]);

            // Initial bot greeting
            $this->botMessage($id, $this->greeting());
        }

        $messages = DB::table('chat_messages')
            ->where('session_id', $session?->id ?? DB::table('chat_sessions')->where('session_id', $sessionId)->value('id'))
            ->orderBy('created_at')
            ->get();

        $fresh = DB::table('chat_sessions')->where('session_id', $sessionId)->first();

        return response()->json([
            'session_id' => $sessionId,
            'status'     => $fresh->status,
            'messages'   => $messages,
        ])->cookie('chat_session', $sessionId, 60 * 24 * 7); // 7 days
    }

    // ── Customer sends message ────────────────────────────────────────
    public function send(Request $request)
    {
        $request->validate(['message' => 'required|string|max:1000', 'session_id' => 'required|string']);

        $session = DB::table('chat_sessions')->where('session_id', $request->session_id)->first();
        if (!$session) return response()->json(['error' => 'Session not found'], 404);

        // Save visitor message
        $this->visitorMessage($session->id, $request->message);

        // If agent is active — just store, agent sees it
        if ($session->status === 'active') {
            return response()->json(['status' => 'sent']);
        }

        // Bot handles it
        $reply = $this->botProcess($session, $request->message);

        return response()->json(['status' => 'bot', 'reply' => $reply]);
    }

    // ── Poll for new messages (long-poll every 3s) ────────────────────
    public function poll(Request $request)
    {
        $session = DB::table('chat_sessions')->where('session_id', $request->session_id)->first();
        if (!$session) return response()->json(['messages' => [], 'status' => 'closed']);

        $since    = $request->since ?? 0;
        $messages = DB::table('chat_messages')
            ->where('session_id', $session->id)
            ->where('id', '>', $since)
            ->orderBy('id')
            ->get();

        // Mark agent messages as read
        DB::table('chat_messages')
            ->where('session_id', $session->id)
            ->where('sender_type', 'agent')
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json([
            'messages' => $messages,
            'status'   => $session->status,
            'agent'    => $session->agent_id ? DB::table('users')->where('id', $session->agent_id)->value('name') : null,
        ]);
    }

    // ── Request human agent ───────────────────────────────────────────
    public function requestAgent(Request $request)
    {
        $session = DB::table('chat_sessions')->where('session_id', $request->session_id)->first();
        if (!$session) return response()->json(['error' => 'Not found'], 404);

        DB::table('chat_sessions')->where('id', $session->id)->update([
            'status'     => 'waiting',
            'updated_at' => now(),
        ]);

        $this->botMessage($session->id, "I'm connecting you with a customer support agent. Please wait — average wait time is 2-5 minutes.\n\nYou can also reach us on WhatsApp for faster response.", 'system');

        return response()->json(['status' => 'waiting']);
    }

    // ── Rate chat ─────────────────────────────────────────────────────
    public function rate(Request $request)
    {
        $data = $request->validate([
            'session_id' => 'required|string',
            'rating'     => 'required|integer|min:1|max:5',
            'comment'    => 'nullable|string|max:500',
        ]);

        DB::table('chat_sessions')->where('session_id', $data['session_id'])->update([
            'rating'         => $data['rating'],
            'rating_comment' => $data['comment'] ?? null,
        ]);

        return response()->json(['ok' => true]);
    }

    // ── Bot processing logic ──────────────────────────────────────────
    private function botProcess(object $session, string $input): string
    {
        $input = strtolower(trim($input));
        $step  = $session->bot_step;

        // Check for escalation triggers first
        $escalate = ['human','agent','person','staff','representative','help me','talk to someone','real person','customer service'];
        foreach ($escalate as $word) {
            if (str_contains($input, $word)) {
                DB::table('chat_sessions')->where('id', $session->id)->update(['status' => 'waiting', 'updated_at' => now()]);
                $msg = "I'm connecting you with a live agent now. Please hold on — someone from our team will join shortly.\n\nWhile you wait, you can also WhatsApp us at " . (Setting::get('whatsapp_number', '') ? '+' . Setting::get('whatsapp_number') : 'our number in the footer') . '.';
                $this->botMessage($session->id, $msg, 'system');
                return $msg;
            }
        }

        // Step 0: Get name if not set
        if ($step === 0 && !$session->visitor_name) {
            DB::table('chat_sessions')->where('id', $session->id)->update([
                'visitor_name' => ucwords($input),
                'bot_step'     => 1,
                'updated_at'   => now(),
            ]);
            $reply = "Nice to meet you, " . ucwords($input) . "! How can I help you today?\n\nYou can ask me anything or choose a topic:";
            $this->botMessage($session->id, $reply, 'text', $this->mainMenu());
            return $reply;
        }

        // Search FAQ database
        $faq = $this->searchFaq($input);
        if ($faq) {
            DB::table('chat_faqs')->where('id', $faq->id)->increment('helpful_count');
            $reply = $faq->answer . "\n\n_Was this helpful? If you need more help, just ask or type 'agent' to speak with our team._";
            $this->botMessage($session->id, $reply);
            return $reply;
        }

        // Keyword shortcuts
        $reply = $this->keywordReply($input, $session);
        if ($reply) {
            $this->botMessage($session->id, $reply);
            return $reply;
        }

        // Fallback
        $siteName = Setting::get('site_name', 'MILLIONAIRE');
        $fallback = "I'm sorry, I couldn't find a specific answer for that. Here's what I can help with:";
        $this->botMessage($session->id, $fallback, 'text', $this->mainMenu());
        return $fallback;
    }

    private function searchFaq(string $input): ?object
    {
        $faqs = DB::table('chat_faqs')->where('is_active', true)->get();
        foreach ($faqs as $faq) {
            // Direct question match
            if (str_contains(strtolower($faq->question), $input) || str_contains($input, strtolower($faq->question))) {
                return $faq;
            }
            // Keyword match
            $keywords = json_decode($faq->keywords ?? '[]', true) ?? [];
            foreach ($keywords as $kw) {
                if (str_contains($input, strtolower($kw))) return $faq;
            }
        }
        return null;
    }

    private function keywordReply(string $input, object $session): ?string
    {
        $wa  = Setting::get('whatsapp_number', '');
        $ph  = Setting::get('phone', '');
        $url = config('app.url');

        if (str_contains($input, 'track') || str_contains($input, 'order status') || str_contains($input, 'where is my')) {
            return "You can track your order here: {$url}/track-order\n\nJust enter your order ID or the email you used when placing the order.";
        }
        if (str_contains($input, 'return') || str_contains($input, 'refund')) {
            return "We have a 7-day return policy on all items.\n\n**To return an item:**\n1. Contact us via WhatsApp or submit a ticket\n2. Pack the item in original packaging\n3. We'll arrange collection\n4. Refund processed within 3-5 business days\n\nFor faster help: {$url}/support";
        }
        if (str_contains($input, 'delivery') || str_contains($input, 'shipping') || str_contains($input, 'how long')) {
            return "**Delivery Times:**\n• Lahore/Karachi/Islamabad: 2-3 days\n• Other cities: 3-5 days\n• Remote areas: 5-7 days\n\nFree delivery on orders over Rs 5,000.";
        }
        if (str_contains($input, 'payment') || str_contains($input, 'pay') || str_contains($input, 'method')) {
            return "**We accept:**\n• Cash on Delivery (COD)\n• PayFast (Credit/Debit Cards)\n• JazzCash & Easypaisa\n• Bank Transfer\n\nAll online payments are 100% secure.";
        }
        if (str_contains($input, 'size') || str_contains($input, 'sizing') || str_contains($input, 'fit')) {
            return "For sizing questions, please check the size guide on the product page, or send us your measurements via WhatsApp and we'll recommend the right size.\n\nWhatsApp: " . ($wa ? "+{$wa}" : 'number in footer');
        }
        if (str_contains($input, 'contact') || str_contains($input, 'phone') || str_contains($input, 'call')) {
            $reply = "**Contact Us:**\n";
            if ($wa) $reply .= "• WhatsApp: +{$wa}\n";
            if ($ph) $reply .= "• Phone: {$ph}\n";
            $reply .= "• Support Ticket: {$url}/support\n• Email us via the contact form";
            return $reply;
        }
        if (str_contains($input, 'cancel') || str_contains($input, 'cancellation')) {
            return "Orders can be cancelled before they are shipped.\n\nTo cancel: Log in → My Orders → Cancel, or WhatsApp us immediately with your order number.";
        }
        if (str_contains($input, 'price') || str_contains($input, 'discount') || str_contains($input, 'offer') || str_contains($input, 'sale')) {
            return "Check our website for latest offers and sales. You can also sign up for our newsletter to get exclusive discount codes!\n\nVisit: " . config('app.url');
        }
        return null;
    }

    private function mainMenu(): array
    {
        return [
            'Track My Order',
            'Returns & Refunds',
            'Payment Methods',
            'Delivery Times',
            'Contact Us',
            'Talk to Agent',
        ];
    }

    private function greeting(): string
    {
        $hour     = now()->hour;
        $greeting = $hour < 12 ? 'Good morning' : ($hour < 17 ? 'Good afternoon' : 'Good evening');
        $name     = Setting::get('site_name', 'MILLIONAIRE');
        return "{$greeting}! 👋 Welcome to {$name} support.\n\nWhat's your name? (or type your question directly)";
    }

    private function botMessage(int $sessionId, string $message, string $type = 'text', array $options = []): void
    {
        DB::table('chat_messages')->insert([
            'session_id'   => $sessionId,
            'sender_type'  => 'bot',
            'message'      => $message,
            'message_type' => $type,
            'options'      => $options ? json_encode($options) : null,
            'is_read'      => false,
            'created_at'   => now(),
            'updated_at'   => now(),
        ]);
    }

    private function visitorMessage(int $sessionId, string $message): void
    {
        DB::table('chat_messages')->insert([
            'session_id'   => $sessionId,
            'sender_type'  => 'visitor',
            'sender_id'    => auth()->id(),
            'message'      => $message,
            'message_type' => 'text',
            'is_read'      => false,
            'created_at'   => now(),
            'updated_at'   => now(),
        ]);
    }
}
