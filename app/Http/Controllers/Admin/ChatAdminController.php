<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ChatAdminController extends Controller
{
    // ── Chat Dashboard — agent view ───────────────────────────────────
    public function index()
    {
        $waiting  = DB::table('chat_sessions')->where('status', 'waiting')->count();
        $active   = DB::table('chat_sessions')->where('status', 'active')->where('agent_id', auth()->id())->count();
        $today    = DB::table('chat_sessions')->whereDate('created_at', today())->count();
        $avgRating = DB::table('chat_sessions')->whereNotNull('rating')->avg('rating');

        $sessions = DB::table('chat_sessions')
            ->leftJoin('users as agents', 'chat_sessions.agent_id', '=', 'agents.id')
            ->select('chat_sessions.*', 'agents.name as agent_name')
            ->whereIn('chat_sessions.status', ['waiting', 'active'])
            ->orderByRaw("FIELD(chat_sessions.status,'waiting','active')")
            ->orderBy('chat_sessions.updated_at', 'desc')
            ->get()
            ->map(fn($s) => array_merge((array)$s, [
                'last_message' => DB::table('chat_messages')
                    ->where('session_id', $s->id)
                    ->latest()->value('message'),
                'unread_count' => DB::table('chat_messages')
                    ->where('session_id', $s->id)
                    ->where('sender_type', 'visitor')
                    ->where('is_read', false)->count(),
            ]));

        $faqs = DB::table('chat_faqs')->orderBy('sort_order')->get();

        return Inertia::render('Admin/Chat/Index', [
            'sessions'   => $sessions,
            'faqs'       => $faqs,
            'stats'      => [
                'waiting'   => $waiting,
                'my_active' => $active,
                'today'     => $today,
                'avg_rating'=> round($avgRating ?? 0, 1),
            ],
        ]);
    }

    // ── Agent joins a chat session ────────────────────────────────────
    public function join(Request $request, int $id)
    {
        $session = DB::table('chat_sessions')->where('id', $id)->first();
        if (!$session || !in_array($session->status, ['waiting', 'active'])) {
            return back()->with('error', 'Session not available.');
        }

        DB::table('chat_sessions')->where('id', $id)->update([
            'status'          => 'active',
            'agent_id'        => auth()->id(),
            'agent_joined_at' => now(),
            'updated_at'      => now(),
        ]);

        // Notify visitor
        $agentName = auth()->user()->name;
        DB::table('chat_messages')->insert([
            'session_id'   => $id,
            'sender_type'  => 'system',
            'message'      => "✅ {$agentName} has joined the chat. You're now connected with a live agent!",
            'message_type' => 'system',
            'is_read'      => false,
            'created_at'   => now(),
            'updated_at'   => now(),
        ]);

        return response()->json(['ok' => true, 'session' => DB::table('chat_sessions')->where('id', $id)->first()]);
    }

    // ── Agent sends message ───────────────────────────────────────────
    public function reply(Request $request, int $id)
    {
        $data = $request->validate(['message' => 'required|string|max:2000']);

        DB::table('chat_messages')->insert([
            'session_id'   => $id,
            'sender_type'  => 'agent',
            'sender_id'    => auth()->id(),
            'message'      => $data['message'],
            'message_type' => 'text',
            'is_read'      => false,
            'created_at'   => now(),
            'updated_at'   => now(),
        ]);

        DB::table('chat_sessions')->where('id', $id)->update(['updated_at' => now()]);
        return response()->json(['ok' => true]);
    }

    // ── Poll for new messages in a session ────────────────────────────
    public function poll(Request $request, int $id)
    {
        $since    = $request->since ?? 0;
        $messages = DB::table('chat_messages')
            ->where('session_id', $id)
            ->where('id', '>', $since)
            ->orderBy('id')
            ->get();

        // Mark visitor messages as read
        DB::table('chat_messages')
            ->where('session_id', $id)
            ->where('sender_type', 'visitor')
            ->where('is_read', false)
            ->update(['is_read' => true]);

        $session  = DB::table('chat_sessions')->where('id', $id)->first();
        $unreadWaiting = DB::table('chat_messages')
            ->join('chat_sessions', 'chat_messages.session_id', '=', 'chat_sessions.id')
            ->where('chat_sessions.status', 'waiting')
            ->where('chat_messages.is_read', false)
            ->count();

        return response()->json([
            'messages'      => $messages,
            'session'       => $session,
            'unread_waiting'=> $unreadWaiting,
        ]);
    }

    // ── Close chat session ────────────────────────────────────────────
    public function close(int $id)
    {
        DB::table('chat_sessions')->where('id', $id)->update([
            'status'     => 'closed',
            'closed_at'  => now(),
            'updated_at' => now(),
        ]);
        DB::table('chat_messages')->insert([
            'session_id'   => $id,
            'sender_type'  => 'system',
            'message'      => 'Chat session closed by agent. Thank you for contacting us!',
            'message_type' => 'system',
            'is_read'      => false,
            'created_at'   => now(),
            'updated_at'   => now(),
        ]);
        return response()->json(['ok' => true]);
    }

    // ── Agent online status ───────────────────────────────────────────
    public function heartbeat(Request $request)
    {
        DB::table('users')->where('id', auth()->id())->update([
            'is_online'   => true,
            'last_seen_at'=> now(),
        ]);
        $waiting = DB::table('chat_sessions')->where('status','waiting')->count();
        return response()->json(['waiting' => $waiting, 'ok' => true]);
    }

    // ── FAQ Management ────────────────────────────────────────────────
    public function faqs()
    {
        return response()->json(DB::table('chat_faqs')->orderBy('category')->orderBy('sort_order')->get());
    }

    public function storeFaq(Request $request)
    {
        $data = $request->validate([
            'question'   => 'required|string|max:300',
            'answer'     => 'required|string',
            'category'   => 'required|string|max:50',
            'keywords'   => 'nullable|string',
            'sort_order' => 'nullable|integer',
        ]);
        $keywords = array_filter(array_map('trim', explode(',', $data['keywords'] ?? '')));
        DB::table('chat_faqs')->insert([
            'question'   => $data['question'],
            'answer'     => $data['answer'],
            'category'   => $data['category'],
            'keywords'   => json_encode($keywords),
            'sort_order' => $data['sort_order'] ?? 0,
            'is_active'  => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        return back()->with('success', 'FAQ added.');
    }

    public function updateFaq(Request $request, int $id)
    {
        $data     = $request->validate(['question'=>'string|max:300','answer'=>'string','is_active'=>'boolean','keywords'=>'nullable|string']);
        $keywords = array_filter(array_map('trim', explode(',', $data['keywords'] ?? '')));
        DB::table('chat_faqs')->where('id', $id)->update(array_merge($data, ['keywords' => json_encode($keywords), 'updated_at' => now()]));
        return back()->with('success', 'FAQ updated.');
    }

    public function destroyFaq(int $id)
    {
        DB::table('chat_faqs')->where('id', $id)->delete();
        return back()->with('success', 'FAQ deleted.');
    }

    // ── History ───────────────────────────────────────────────────────
    public function history()
    {
        $sessions = DB::table('chat_sessions')
            ->leftJoin('users as agents', 'chat_sessions.agent_id', '=', 'agents.id')
            ->select('chat_sessions.*', 'agents.name as agent_name')
            ->whereIn('chat_sessions.status', ['closed'])
            ->orderBy('chat_sessions.created_at', 'desc')
            ->paginate(20);
        return Inertia::render('Admin/Chat/History', ['sessions' => $sessions]);
    }

    public function sessionMessages(int $id)
    {
        $session  = DB::table('chat_sessions')->where('id', $id)->first();
        $messages = DB::table('chat_messages')->where('session_id', $id)->orderBy('id')->get();
        return response()->json(['session' => $session, 'messages' => $messages]);
    }
}
