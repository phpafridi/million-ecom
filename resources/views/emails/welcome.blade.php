<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Welcome to {{ $storeName }}</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
         background:#f0f2f5; padding:24px 16px; color:#1a1a2e; }
  .wrap { max-width:600px; margin:0 auto; }
  .card { background:white; border-radius:16px; overflow:hidden;
          box-shadow:0 2px 12px rgba(0,0,0,0.08); margin-bottom:16px; }
  .header { background:{{ $primaryColor ?? '#0a0e1a' }}; padding:40px 32px; text-align:center; }
  .logo-box { display:inline-flex; align-items:center; gap:12px; margin-bottom:20px; }
  .logo-letter { width:44px; height:44px; border-radius:10px; background:{{ $accentColor ?? '#00c8ff' }};
                 display:inline-flex; align-items:center; justify-content:center;
                 font-size:20px; font-weight:900; color:{{ $primaryColor ?? '#0a0e1a' }}; }
  .store-name { font-size:22px; font-weight:900; color:white; letter-spacing:0.05em; }
  .header h1 { color:white; font-size:24px; font-weight:800; margin-bottom:6px; }
  .header p { color:rgba(255,255,255,0.65); font-size:14px; }
  .body { padding:32px; }
  .greeting { font-size:16px; color:#374151; margin-bottom:20px; line-height:1.6; }
  .perks { margin-bottom:28px; }
  .perk { display:flex; align-items:flex-start; gap:12px; padding:14px 0;
          border-bottom:1px solid #f0f2f5; }
  .perk:last-child { border-bottom:none; }
  .perk-icon { width:36px; height:36px; border-radius:10px; flex-shrink:0;
               background:{{ $accentColor ?? '#00c8ff' }}18; display:flex;
               align-items:center; justify-content:center; font-size:16px; }
  .perk-text strong { display:block; font-size:14px; color:#1a1a2e; margin-bottom:2px; }
  .perk-text span { font-size:13px; color:#6b7280; }
  .cta-wrap { text-align:center; margin-bottom:8px; }
  .cta { display:inline-block; background:{{ $accentColor ?? '#00c8ff' }};
         color:{{ $primaryColor ?? '#0a0e1a' }}; font-weight:800; font-size:14px;
         padding:14px 32px; border-radius:100px; text-decoration:none; }
  .contact-row { text-align:center; padding-top:24px; margin-top:24px;
                 border-top:1px solid #f0f2f5; }
  .contact-row p { font-size:13px; color:#9ca3af; margin-bottom:10px; }
  .contact-row a { display:inline-block; margin:0 8px; font-size:13px; font-weight:700;
                   color:{{ $primaryColor ?? '#0a0e1a' }}; text-decoration:none; }
  .footer { text-align:center; padding:16px; }
  .footer p { font-size:11px; color:#9ca3af; line-height:1.6; }
</style>
</head>
<body>
<div class="wrap">
  <div class="card">
    <div class="header">
      <div class="logo-box">
        @if($logoUrl)
          <img src="{{ $logoUrl }}" alt="{{ $storeName }}" style="height:36px; width:auto;">
        @else
          <div class="logo-letter">{{ strtoupper(substr($storeName, 0, 1)) }}</div>
          <span class="store-name">{{ strtoupper($storeName) }}</span>
        @endif
      </div>
      <h1>Welcome, {{ $user->name }}! 🎉</h1>
      <p>Your account is all set up</p>
    </div>
    <div class="body">
      <p class="greeting">
        Thanks for creating an account at <strong>{{ $storeName }}</strong>. You're now ready to shop,
        track orders, and get rewarded every time you buy.
      </p>

      <div class="perks">
        <div class="perk">
          <div class="perk-icon">📦</div>
          <div class="perk-text"><strong>Track every order</strong><span>See real-time status from checkout to delivery.</span></div>
        </div>
        <div class="perk">
          <div class="perk-icon">❤️</div>
          <div class="perk-text"><strong>Save to your wishlist</strong><span>Keep an eye on the pieces you love.</span></div>
        </div>
        <div class="perk">
          <div class="perk-icon">🎁</div>
          <div class="perk-text"><strong>Earn loyalty points</strong><span>Every purchase brings you closer to a reward.</span></div>
        </div>
      </div>

      <div class="cta-wrap">
        <a href="{{ $shopUrl }}" class="cta">Start Shopping</a>
      </div>

      <div class="contact-row">
        <p>Questions? We're here to help.</p>
        @if($whatsapp)
        <a href="https://wa.me/{{ $whatsapp }}">💬 WhatsApp Us</a>
        @endif
        @if($phone)
        <a href="tel:{{ $phone }}">📞 {{ $phone }}</a>
        @endif
        @if($email)
        <a href="mailto:{{ $email }}">✉ {{ $email }}</a>
        @endif
      </div>
    </div>
  </div>

  <div class="footer">
    <p>
      You're receiving this because you created an account at <strong>{{ $storeName }}</strong>.<br>
      © {{ date('Y') }} {{ $storeName }}. All rights reserved.
    </p>
  </div>
</div>
</body>
</html>
