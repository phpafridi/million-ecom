<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Your Order is On Its Way!</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
         background:#f0f2f5; padding:24px 16px; }
  .wrap { max-width:600px; margin:0 auto; }
  .card { background:white; border-radius:16px; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,0.08); margin-bottom:16px; }
  .header { background:{{ $primaryColor ?? '#0a0e1a' }}; padding:36px 32px; text-align:center; }
  .header h1 { color:white; font-size:24px; font-weight:800; margin-bottom:8px; }
  .header p { color:rgba(255,255,255,0.6); font-size:14px; }
  .body { padding:32px; }
  .track-bar { display:flex; align-items:center; justify-content:space-between;
               margin:24px 0; padding:20px; background:#f8fafc; border-radius:12px; }
  .track-step { text-align:center; flex:1; }
  .track-icon { font-size:24px; margin-bottom:6px; }
  .track-label { font-size:11px; font-weight:700; color:#6b7280; }
  .track-line { flex:1; height:2px; background:#e5e7eb; position:relative; }
  .track-line.done { background:{{ $accentColor ?? '#00c8ff' }}; }
  .info-box { background:#f8fafc; border-radius:10px; padding:16px; margin-bottom:16px; }
  .info-box h4 { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.08em;
                 color:#9ca3af; margin-bottom:6px; }
  .info-box p { font-size:14px; font-weight:600; color:#374151; }
  .cta { display:block; text-align:center; background:{{ $accentColor ?? '#00c8ff' }};
         color:{{ $primaryColor ?? '#0a0e1a' }}; font-weight:900; font-size:14px;
         padding:14px 32px; border-radius:12px; text-decoration:none; margin-top:20px; }
  .footer { text-align:center; padding:20px; font-size:12px; color:#9ca3af; }
</style>
</head>
<body>
<div class="wrap">
  <div class="card">
    <div class="header">
      <div style="font-size:56px;margin-bottom:16px;">🚚</div>
      <h1>Your Order is On Its Way!</h1>
      <p>Order #{{ $order->id }} has been dispatched and is heading to you.</p>
    </div>
    <div class="body">
      <div class="track-bar">
        <div class="track-step"><div class="track-icon">✅</div><div class="track-label">Ordered</div></div>
        <div class="track-line done"></div>
        <div class="track-step"><div class="track-icon">📦</div><div class="track-label">Packed</div></div>
        <div class="track-line done"></div>
        <div class="track-step"><div class="track-icon" style="font-size:28px">🚚</div><div class="track-label" style="color:{{ $accentColor ?? '#00c8ff' }};font-weight:900">Shipped</div></div>
        <div class="track-line"></div>
        <div class="track-step"><div class="track-icon" style="opacity:0.3">🏠</div><div class="track-label" style="opacity:0.4">Delivered</div></div>
      </div>

      <div class="info-box">
        <h4>Delivering To</h4>
        <p>{{ $order->customer_name }} — {{ $order->customer_city }}<br>
        <span style="font-size:13px;font-weight:400;color:#6b7280">{{ $order->customer_address }}</span></p>
      </div>

      @if($trackingNumber ?? null)
      <div class="info-box" style="border:2px solid {{ $accentColor ?? '#00c8ff' }}30;background:{{ $accentColor ?? '#00c8ff' }}08;">
        <h4>Tracking Number</h4>
        <p style="font-family:monospace;font-size:18px;letter-spacing:0.05em">{{ $trackingNumber }}</p>
        @if($courierName ?? null)
        <p style="margin-top:4px;font-size:13px;color:#6b7280">via {{ $courierName }}</p>
        @endif
      </div>
      @endif

      <div class="info-box">
        <h4>Order Summary</h4>
        @foreach($order->items as $item)
        <p style="margin-bottom:4px">{{ $item->product_name }} × {{ $item->quantity }}</p>
        @endforeach
        <p style="margin-top:8px;font-size:15px;font-weight:900">Total: Rs {{ number_format($order->total) }}</p>
      </div>

      <p style="font-size:13px;color:#6b7280;line-height:1.6;text-align:center;margin-top:20px;">
        Estimated delivery: <strong>1–3 business days</strong><br>
        Our delivery rider will call you before arriving.
      </p>

      @if($whatsapp)
      <a href="https://wa.me/{{ $whatsapp }}?text={{ urlencode('Hi, I want to track my Order #' . $order->id) }}" class="cta">💬 Track via WhatsApp</a>
      @endif
    </div>
  </div>
  <div class="footer"><p>© {{ date('Y') }} {{ $storeName }}. All rights reserved.</p></div>
</div>
</body>
</html>
