<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Access Blocked — MILLIONAIRE</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, sans-serif; background: #0a0a0a; color: #fff;
         display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; }
  .card { background: #111; border: 1px solid #222; border-radius: 20px; padding: 48px 40px; max-width: 440px; text-align: center; }
  .icon { width: 72px; height: 72px; background: rgba(220,38,38,0.15); border: 2px solid rgba(220,38,38,0.3);
          border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; font-size: 32px; }
  h1 { font-size: 22px; font-weight: 900; margin-bottom: 8px; color: #fff; }
  p { color: #9CA3AF; font-size: 14px; line-height: 1.6; margin-bottom: 6px; }
  .ip { font-family: monospace; background: #1a1a1a; padding: 4px 12px; border-radius: 6px; font-size: 13px; color: #C9A84C; display: inline-block; margin-top: 8px; }
  .code { color: #DC2626; font-weight: 700; font-size: 13px; margin-top: 16px; }
  a { color: #C9A84C; text-decoration: none; font-size: 13px; display: inline-block; margin-top: 20px; }
</style>
</head>
<body>
<div class="card">
    <div class="icon">🚫</div>
    <h1>Access Blocked</h1>
    <p>Your IP address has been blocked due to suspicious activity.</p>
    <p>If you believe this is a mistake, please contact support.</p>
    <div class="ip">{{ $ip ?? request()->ip() }}</div>
    @if(isset($reason))
        <div class="code">
            {{ $reason === 'ddos' ? 'Reason: Too many requests (DDoS protection)' : 'Reason: Spam detection triggered' }}
        </div>
    @endif
    <br>
    <a href="/">← Return to Homepage</a>
</div>
</body>
</html>
