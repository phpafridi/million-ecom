<?php
namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Queue\SerializesModels;

// ShouldBroadcastNow instead of ShouldBroadcast — the latter queues the
// broadcast and only actually sends it to Reverb once a queue worker picks
// it up. With chat's polling fallback now removed entirely, that made chat
// silently depend on `php artisan queue:work` being alive at every single
// moment, on top of Reverb itself — if the worker wasn't actively running
// right then, the message would just sit in the jobs table forever and the
// customer would see nothing. Broadcasting to Reverb is a fast, local
// operation (unlike slow external SMTP/API calls elsewhere in this app),
// so sending it immediately is the right trade — no queue dependency for
// chat delivery specifically.
class ChatMessageSent implements ShouldBroadcastNow
{
    use SerializesModels;

    public function __construct(
        public int     $sessionId,
        public string  $message,
        public string  $senderType,
        public string  $createdAt,
        public ?string $status    = null,
        public ?string $agentName = null,
    ) {}

    public function broadcastOn(): Channel
    {
        return new Channel('chat.' . $this->sessionId);
    }

    public function broadcastAs(): string
    {
        return 'message.sent';
    }
}
