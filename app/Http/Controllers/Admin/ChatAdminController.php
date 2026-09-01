<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class ChatAdminController extends Controller
{
    public function index()
    {
        // Was running 2 extra queries per session in a map() callback (10
        // active chats = 20 extra queries on every single poll of this
        // page). Replaced with subqueries joined in directly — one query
        // total. Uses a correlated subquery for "last message" rather than
        // a ROW_NUMBER() window function, since that requires MySQL 8.0+
        // and this avoids depending on a specific server version.
        $sessions = DB::table('chat_sessions')
            ->leftJoin('users as agents', 'chat_sessions.agent_id', '=', 'agents.id')
            ->leftJoin('chat_messages as last_msg', function ($join) {
                $join->on('last_msg.session_id', '=', 'chat_sessions.id')
                     ->whereRaw('last_msg.id = (
                         SELECT MAX(id) FROM chat_messages
                         WHERE chat_messages.session_id = chat_sessions.id
                     )');
            })
            ->leftJoinSub(
                DB::table('chat_messages')
                    ->selectRaw('session_id, COUNT(*) as unread_count')
                    ->where('sender_type', 'visitor')
                    ->where('is_read', false)
                    ->groupBy('session_id'),
                'unread',
                fn($join) => $join->on('chat_sessions.id', '=', 'unread.session_id')
            )
            ->select(
                'chat_sessions.*',
                'agents.name as agent_name',
                'last_msg.message as last_message',
                DB::raw('COALESCE(unread.unread_count, 0) as unread_count')
            )
            ->whereIn('chat_sessions.status', ['waiting', 'active'])
            ->orderByRaw("FIELD(chat_sessions.status,'waiting','active')")
            ->orderBy('chat_sessions.updated_at', 'desc')
            ->get();

        return Inertia::render('Admin/Chat/Index', [
            'sessions' => $sessions,
            'faqs'     => DB::table('chat_faqs')->orderBy('sort_order')->get(),
            'stats'    => [
                'waiting'    => DB::table('chat_sessions')->where('status', 'waiting')->count(),
                'my_active'  => DB::table('chat_sessions')->where('status', 'active')->where('agent_id', auth()->id())->count(),
                'today'      => DB::table('chat_sessions')->whereDate('created_at', today())->count(),
                'avg_rating' => round(DB::table('chat_sessions')->whereNotNull('rating')->avg('rating') ?? 0, 1),
            ],
        ]);
    }

    public function join(Request $request, int $id)
    {
        DB::table('chat_sessions')->where('id', $id)->update(['status' => 'active', 'agent_id' => auth()->id(), 'agent_joined_at' => now(), 'updated_at' => now()]);
        $msg = '✅ ' . auth()->user()->name . ' has joined. You are now connected with a live agent!';
        DB::table('chat_messages')->insert(['session_id' => $id, 'sender_type' => 'system', 'message' => $msg, 'message_type' => 'system', 'is_read' => false, 'created_at' => now(), 'updated_at' => now()]);
        broadcast(new \App\Events\ChatMessageSent($id, $msg, 'system', now()->toISOString(), status: 'active', agentName: auth()->user()->name));
        broadcast(new \App\Events\ChatWaitingCountChanged());
        return response()->json(['ok' => true]);
    }

    public function reply(Request $request, int $id)
    {
        $data = $request->validate(['message' => 'required|string|max:2000']);
        DB::table('chat_messages')->insert(['session_id' => $id, 'sender_type' => 'agent', 'sender_id' => auth()->id(), 'message' => $data['message'], 'message_type' => 'text', 'is_read' => false, 'created_at' => now(), 'updated_at' => now()]);
        DB::table('chat_sessions')->where('id', $id)->update(['updated_at' => now()]);
        broadcast(new \App\Events\ChatMessageSent($id, $data['message'], 'agent', now()->toISOString()));
        return response()->json(['ok' => true]);
    }

    public function sessionPoll(Request $request, int $id)
    {
        $since    = $request->since ?? 0;
        $messages = DB::table('chat_messages')->where('session_id', $id)->where('id', '>', $since)->orderBy('id')->get();
        DB::table('chat_messages')->where('session_id', $id)->where('sender_type', 'visitor')->where('is_read', false)->update(['is_read' => true]);
        return response()->json(['messages' => $messages, 'session' => DB::table('chat_sessions')->where('id', $id)->first(), 'unread_waiting' => DB::table('chat_messages')->join('chat_sessions', 'chat_messages.session_id', '=', 'chat_sessions.id')->where('chat_sessions.status', 'waiting')->where('chat_messages.is_read', false)->count()]);
    }

    public function sessionMessages(int $id)
    {
        return response()->json(['session' => DB::table('chat_sessions')->where('id', $id)->first(), 'messages' => DB::table('chat_messages')->where('session_id', $id)->orderBy('id')->get()]);
    }

    public function close(int $id)
    {
        DB::table('chat_sessions')->where('id', $id)->update(['status' => 'closed', 'closed_at' => now(), 'updated_at' => now()]);
        $msg = 'Chat closed by agent. Thank you!';
        DB::table('chat_messages')->insert(['session_id' => $id, 'sender_type' => 'system', 'message' => $msg, 'message_type' => 'system', 'is_read' => false, 'created_at' => now(), 'updated_at' => now()]);
        broadcast(new \App\Events\ChatMessageSent($id, $msg, 'system', now()->toISOString()));
        return response()->json(['ok' => true]);
    }

    public function heartbeat()
    {
        // Was hitting the DB twice on every call — this endpoint is polled
        // continuously by every staff member with the chat panel open (every
        // 15 seconds per the frontend interval, so this compounds fast
        // across multiple staff). Update online-status at most once per 30
        // seconds per user, and cache the waiting-count for 5 seconds
        // instead of recomputing it on every single heartbeat.
        $heartbeatKey = 'heartbeat_' . auth()->id();
        if (!Cache::has($heartbeatKey)) {
            DB::table('users')->where('id', auth()->id())
                ->update(['is_online' => true, 'last_seen_at' => now()]);
            Cache::put($heartbeatKey, true, 30);
        }

        $waiting = Cache::remember('chat_waiting_count', 5, fn() =>
            DB::table('chat_sessions')->where('status', 'waiting')->count()
        );

        return response()->json(['waiting' => $waiting, 'ok' => true]);
    }

    public function storeFaq(Request $request)
    {
        $data = $request->validate(['question' => 'required|string|max:300', 'answer' => 'required|string', 'category' => 'required|string|max:50', 'keywords' => 'nullable|string', 'sort_order' => 'nullable|integer']);
        $kws  = array_filter(array_map('trim', explode(',', $data['keywords'] ?? '')));
        DB::table('chat_faqs')->insert(['question' => $data['question'], 'answer' => $data['answer'], 'category' => $data['category'], 'keywords' => json_encode($kws), 'sort_order' => $data['sort_order'] ?? 0, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()]);
        return back()->with('success', 'FAQ added.');
    }

    public function destroyFaq(int $id)
    {
        DB::table('chat_faqs')->where('id', $id)->delete();
        return back()->with('success', 'FAQ deleted.');
    }
}
