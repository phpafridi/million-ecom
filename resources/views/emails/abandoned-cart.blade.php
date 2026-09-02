<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>You left something behind</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
         background:#f0f2f5; padding:24px 16px; color:#1a1a2e; }
  .wrap { max-width:600px; margin:0 auto; }
  .card { background:white; border-radius:16px; overflow:hidden;
          box-shadow:0 2px 12px rgba(0,0,0,0.08); margin-bottom:16px; }
  .header { background:{{ $primaryColor ?? '#0a0a0a' }}; padding:32px; text-align:center; }
  .header img { height:40px; width:auto; }
  .header .store-name { font-size:20px; font-weight:900; color:white; letter-spacing:0.05em; }
  .body { padding:32px; text-align:center; }
  .body h1 { font-size:22px; font-weight:900; margin-bottom:10px; }
  .body p.sub { font-size:14px; color:#6b7280; margin-bottom:24px; }
  table.items { width:100%; border-collapse:collapse; margin-bottom:24px; text-align:left; }
  table.items td { padding:12px; border-bottom:1px solid #f0f2f5; font-size:14px; color:#374151; }
  table.items tr:last-child td { border-bottom:none; }
  .cta-btn { display:inline-block; background:{{ $accentColor ?? '#C9A84C' }};
             color:{{ $primaryColor ?? '#0a0a0a' }}; font-weight:900; font-size:14px;
             padding:14px 40px; border-radius:12px; text-decoration:none; margin-top:8px; }
  .footer { text-align:center; padding:24px; }
  .footer p { font-size:12px; color:#9ca3af; line-height:1.6; }
</style>
</head>
<body>
<div class="wrap">
  <div class="card">
    <div class="header">
      @if($logoUrl)
        <img src="{{ $logoUrl }}" alt="{{ $siteName }}">
      @else
        <span class="store-name">{{ strtoupper($siteName ?? 'STORE') }}</span>
      @endif
    </div>
    <div class="body">
      <div style="font-size:44px;margin-bottom:12px;">🛒</div>
      <h1>{{ $customerName ? "Hey {$customerName}, " : '' }}you left something behind</h1>
      <p class="sub">Your cart is still saved — complete your order before it's gone.</p>

      @if(!empty($cartData['items']))
      <table class="items">
        @foreach($cartData['items'] as $item)
        <tr>
          <td>
            <strong>{{ $item['name'] ?? $item['product_name'] ?? 'Item' }}</strong>
            @if(!empty($item['variant_label']))<br><span style="color:#9ca3af;font-size:12px">{{ $item['variant_label'] }}</span>@endif
          </td>
          <td style="text-align:center">× {{ $item['quantity'] ?? 1 }}</td>
          <td style="text-align:right">Rs {{ number_format($item['price'] ?? $item['subtotal'] ?? 0) }}</td>
        </tr>
        @endforeach
      </table>
      @endif

      <a href="{{ $shopUrl }}" class="cta-btn">Complete Your Order →</a>
    </div>
  </div>
  <div class="footer">
    <p>You're receiving this because you left items in your cart at <strong>{{ $siteName }}</strong>.<br>© {{ date('Y') }} {{ $siteName }}. All rights reserved.</p>
  </div>
</div>
</body>
</html>
