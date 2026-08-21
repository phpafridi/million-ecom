<?php
namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ChatController extends Controller
{
    public function start(Request $request)
    {
        $sessionId = $request->cookie('chat_session') ?? Str::uuid()->toString();
        $session   = DB::table('chat_sessions')->where('session_id', $sessionId)->first();

        if (!$session) {
            $id = DB::table('chat_sessions')->insertGetId([
                'session_id'    => $sessionId,
                'user_id'       => auth()->id(),
                'visitor_name'  => auth()->user()?->name,
                'visitor_email' => auth()->user()?->email,
                'status'        => 'bot',
                'bot_step'      => 0,
                'created_at'    => now(), 'updated_at' => now(),
            ]);
            $this->botMsg($id, $this->greeting(), 'text', $this->mainMenu());
        }

        $sid      = DB::table('chat_sessions')->where('session_id', $sessionId)->value('id');
        $messages = DB::table('chat_messages')->where('session_id', $sid)->orderBy('created_at')->get();
        $fresh    = DB::table('chat_sessions')->where('session_id', $sessionId)->first();

        return response()->json([
            'session_id' => $sessionId,
            'status'     => $fresh->status,
            'messages'   => $messages,
        ])->cookie('chat_session', $sessionId, 60 * 24 * 7);
    }

    public function send(Request $request)
    {
        $request->validate(['message' => 'required|string|max:1000', 'session_id' => 'required|string']);
        $session = DB::table('chat_sessions')->where('session_id', $request->session_id)->first();
        if (!$session) return response()->json(['error' => 'Not found'], 404);

        $this->visitorMsg($session->id, $request->message);
        if ($session->status === 'active') return response()->json(['status' => 'sent']);

        $this->botProcess($session, $request->message);
        return response()->json(['status' => 'ok']);
    }

    public function poll(Request $request)
    {
        $session = DB::table('chat_sessions')->where('session_id', $request->session_id)->first();
        if (!$session) return response()->json(['messages' => [], 'status' => 'closed']);

        $since    = $request->since ?? 0;
        $messages = DB::table('chat_messages')
            ->where('session_id', $session->id)->where('id', '>', $since)
            ->orderBy('id')->get();

        DB::table('chat_messages')
            ->where('session_id', $session->id)->where('sender_type', 'agent')->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json([
            'messages' => $messages,
            'status'   => $session->status,
            'agent'    => $session->agent_id ? DB::table('users')->where('id', $session->agent_id)->value('name') : null,
        ]);
    }

    public function requestAgent(Request $request)
    {
        $session = DB::table('chat_sessions')->where('session_id', $request->session_id)->first();
        if (!$session) return response()->json(['error' => 'Not found'], 404);
        DB::table('chat_sessions')->where('id', $session->id)->update(['status' => 'waiting', 'updated_at' => now()]);
        $wa  = Setting::get('whatsapp_number', '');
        $msg = "Connecting you with a live agent. Average wait: 2-5 minutes." . ($wa ? "\n\nFor faster help: WhatsApp +{$wa}" : '');
        $this->botMsg($session->id, $msg, 'system');
        return response()->json(['status' => 'waiting']);
    }

    public function rate(Request $request)
    {
        $data = $request->validate(['session_id' => 'required|string', 'rating' => 'required|integer|min:1|max:5']);
        DB::table('chat_sessions')->where('session_id', $data['session_id'])->update(['rating' => $data['rating']]);
        return response()->json(['ok' => true]);
    }

    private function botProcess(object $session, string $input): void
    {
        $lower = strtolower(trim($input));
        // Check escalation
        foreach (['human','agent','person','staff','real','talk to'] as $w) {
            if (str_contains($lower, $w)) {
                DB::table('chat_sessions')->where('id', $session->id)->update(['status' => 'waiting', 'updated_at' => now()]);
                $this->botMsg($session->id, "Connecting you with a live agent now. Please hold on...", 'system');
                return;
            }
        }
        // Collect name
        if ($session->bot_step === 0 && !$session->visitor_name) {
            DB::table('chat_sessions')->where('id', $session->id)->update(['visitor_name' => ucwords($lower), 'bot_step' => 1, 'updated_at' => now()]);
            $this->botMsg($session->id, "Nice to meet you, " . ucwords($lower) . "! How can I help you today?", 'text', $this->mainMenu());
            return;
        }
        // FAQ search
        $faq = DB::table('chat_faqs')->where('is_active', true)->get();
        foreach ($faq as $f) {
            $kws = json_decode($f->keywords ?? '[]', true) ?? [];
            if (str_contains(strtolower($f->question), $lower) || str_contains($lower, strtolower($f->question))) {
                $this->botMsg($session->id, $f->answer . "\n\n_Was this helpful? Type 'agent' to speak with a person._");
                return;
            }
            foreach ($kws as $kw) { if (str_contains($lower, strtolower($kw))) { $this->botMsg($session->id, $f->answer); return; } }
        }
        // Keyword shortcuts
        $url = config('app.url');
        $wa  = Setting::get('whatsapp_number', '');
        if (str_contains($lower, 'track') || str_contains($lower, 'order')) { $this->botMsg($session->id, "Track your order here: {$url}/track-order\nEnter your order ID or email."); return; }
        if (str_contains($lower, 'return') || str_contains($lower, 'refund')) { $this->botMsg($session->id, "7-day return policy. Contact us via WhatsApp or submit a ticket at {$url}/support"); return; }
        if (str_contains($lower, 'deliver') || str_contains($lower, 'shipping')) { $this->botMsg($session->id, "Delivery: Lahore/Karachi/Islamabad 2-3 days, Other cities 3-5 days. Free on orders Rs 5,000+"); return; }
        if (str_contains($lower, 'payment') || str_contains($lower, 'pay')) { $this->botMsg($session->id, "We accept: COD, PayFast (Cards), JazzCash, Easypaisa, Bank Transfer. All payments secure."); return; }
        // Fallback
        $this->botMsg($session->id, "I couldn't find an answer. Choose a topic below or type 'agent' to chat with our team:", 'text', $this->mainMenu());
    }

    private function mainMenu(): array { return ['Track My Order','Returns & Refunds','Delivery Times','Payment Methods','Talk to Agent']; }
    private function greeting(): string
    {
        $h = now()->hour;
        $g = $h < 12 ? 'Good morning' : ($h < 17 ? 'Good afternoon' : 'Good evening');
        return "{$g}! 👋 Welcome to " . Setting::get('site_name', 'MILLIONAIRE') . " support.\n\nWhat's your name? (or type your question)";
    }
    private function botMsg(int $sid, string $msg, string $type = 'text', array $opts = []): void
    {
        DB::table('chat_messages')->insert(['session_id' => $sid, 'sender_type' => 'bot', 'message' => $msg, 'message_type' => $type, 'options' => $opts ? json_encode($opts) : null, 'is_read' => false, 'created_at' => now(), 'updated_at' => now()]);
    }
    private function visitorMsg(int $sid, string $msg): void
    {
        DB::table('chat_messages')->insert(['session_id' => $sid, 'sender_type' => 'visitor', 'sender_id' => auth()->id(), 'message' => $msg, 'message_type' => 'text', 'is_read' => false, 'created_at' => now(), 'updated_at' => now()]);
    }
}
