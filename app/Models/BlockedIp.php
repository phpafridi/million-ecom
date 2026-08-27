<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class BlockedIp extends Model
{
    protected $fillable = ['ip_address','reason','type','hit_count','blocked_by','expires_at','is_active'];
    protected $casts    = ['expires_at'=>'datetime','is_active'=>'boolean'];

    public function blocker() { return $this->belongsTo(User::class, 'blocked_by'); }

    // ── Check if IP is blocked (cached 5 min per IP) ──────────────
    public static function isBlocked(string $ip): bool
    {
        return Cache::remember("blocked_ip_{$ip}", 300, function () use ($ip) {
            return static::where('ip_address', $ip)
                ->where('is_active', true)
                ->where(fn($q) => $q->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now()))
                ->exists();
        });
    }

    // ── Block an IP ───────────────────────────────────────────────
    public static function block(
        string $ip,
        string $reason,
        string $type = 'manual',
        ?int $hours = null
    ): void {
        static::updateOrCreate(['ip_address' => $ip], [
            'reason'     => $reason,
            'type'       => $type,
            'is_active'  => true,
            'expires_at' => $hours ? now()->addHours($hours) : null,
            'blocked_by' => auth()->id(),
        ]);
        Cache::forget("blocked_ip_{$ip}");

        try {
            ActivityLog::log('ip.blocked', "IP {$ip} blocked: {$reason}", 'warning');
        } catch (\Throwable $e) {}
    }

    // ── Unblock ───────────────────────────────────────────────────
    public static function unblock(string $ip): void
    {
        static::where('ip_address', $ip)->update(['is_active' => false]);
        Cache::forget("blocked_ip_{$ip}");
        Cache::forget("blocked_log_{$ip}");

        try {
            ActivityLog::log('ip.unblocked', "IP {$ip} unblocked", 'info');
        } catch (\Throwable $e) {}
    }

    // ── Auto-block (24 hours) ─────────────────────────────────────
    public static function autoBlock(string $ip, string $reason, string $type): void
    {
        // Don't re-block if already blocked
        if (static::where('ip_address', $ip)->where('is_active', true)->exists()) return;

        static::block($ip, $reason, $type, 24);

        try {
            ActivityLog::log('ip.auto_blocked',
                "IP {$ip} auto-blocked ({$type}): {$reason}", 'danger');
        } catch (\Throwable $e) {}
    }

    // ── Clean expired blocks ──────────────────────────────────────
    public static function cleanExpired(): int
    {
        return static::where('is_active', true)
            ->whereNotNull('expires_at')
            ->where('expires_at', '<', now())
            ->update(['is_active' => false]);
    }
}
