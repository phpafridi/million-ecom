<?php
namespace App\Http\Middleware;

use App\Models\{BlockedIp, ActivityLog};
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Cache, RateLimiter};

class IpFirewall
{
    // ── Thresholds ────────────────────────────────────────────────────
    const DDOS_LIMIT  = 200;  // requests per minute (raised from 120 - safer for real users)
    const SPAM_LIMIT  = 30;   // suspicious POSTs per 10 min (raised from 20)
    const DDOS_WINDOW = 60;   // seconds
    const SPAM_WINDOW = 600;  // seconds

    // ── Routes excluded from spam counter (legitimate high-frequency POSTs) ──
    const SPAM_EXCLUDED = [
        'cart',       // add to cart
        'wishlist',   // wishlist toggle
        'chat',       // live chat
        'login',      // login (handled by RateLimiter separately)
        'logout',     // logout
    ];

    // ── Always allow these IPs (add your office/home IP here) ────────
    const WHITELIST = [
        '127.0.0.1',
        '::1',
        'localhost',
    ];

    public function handle(Request $request, Closure $next)
    {
        $ip = $request->ip();

        // 1. Whitelist — never block these
        if (in_array($ip, self::WHITELIST)) {
            return $next($request);
        }

        // 2. Check manual/auto block (cached 5 min)
        if (BlockedIp::isBlocked($ip)) {
            // Only log every 10 hits to avoid DB flood from attackers
            $logKey = "blocked_log_{$ip}";
            $logHit = Cache::get($logKey, 0) + 1;
            Cache::put($logKey, $logHit, 60);
            if ($logHit % 10 === 1) {
                ActivityLog::log('ip.blocked_hit',
                    "Blocked IP {$ip} — {$logHit} attempts on: " . $request->path(), 'danger');
            }
            return response()->view('errors.blocked', ['ip' => $ip], 403);
        }

        // 3. DDoS detection — use RateLimiter (atomic, no race condition)
        $ddosKey = "ddos_{$ip}";
        if (RateLimiter::tooManyAttempts($ddosKey, self::DDOS_LIMIT)) {
            BlockedIp::autoBlock($ip,
                "DDoS: exceeded " . self::DDOS_LIMIT . " requests/min", 'ddos');
            return response()->view('errors.blocked', ['ip' => $ip, 'reason' => 'ddos'], 429);
        }
        RateLimiter::hit($ddosKey, self::DDOS_WINDOW);

        // 4. Spam detection — only count suspicious POST routes
        if ($request->isMethod('POST')) {
            $path     = $request->path();
            $excluded = false;
            foreach (self::SPAM_EXCLUDED as $ex) {
                if (str_contains($path, $ex)) { $excluded = true; break; }
            }

            if (!$excluded) {
                $spamKey = "spam_{$ip}";
                if (RateLimiter::tooManyAttempts($spamKey, self::SPAM_LIMIT)) {
                    BlockedIp::autoBlock($ip,
                        "Spam: exceeded " . self::SPAM_LIMIT . " form submissions in 10 min", 'spam');
                    return response()->view('errors.blocked', ['ip' => $ip, 'reason' => 'spam'], 429);
                }
                RateLimiter::hit($spamKey, self::SPAM_WINDOW);
            }
        }

        return $next($request);
    }
}
