<?php
namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;

// Broadcasts the current count of customers waiting for a live agent, on a
// fixed admin-wide channel (not per-session — every staff member watching
// the chat panel needs this same number). Replaces the heartbeat's polling
// of this value; fired whenever a session enters or leaves 'waiting'.
class ChatWaitingCountChanged implements ShouldBroadcastNow
{
    use SerializesModels;

    public int $waiting;

    public function __construct()
    {
        $this->waiting = DB::table('chat_sessions')->where('status', 'waiting')->count();
    }

    public function broadcastOn(): Channel
    {
        return new Channel('admin-chat-waiting');
    }

    public function broadcastAs(): string
    {
        return 'waiting.changed';
    }
}
