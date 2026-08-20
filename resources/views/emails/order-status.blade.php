<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
body{font-family:Manrope,Arial,sans-serif;background:#f5f5f0;margin:0;padding:20px}
.wrap{max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden}
.header{background:#0a0a0a;padding:28px 32px;text-align:center}
.header img{height:40px}
.header h1{color:#C9A84C;font-size:22px;margin:8px 0 0;letter-spacing:2px}
.body{padding:32px}
.status-badge{display:inline-block;padding:8px 20px;border-radius:100px;font-weight:800;font-size:14px;margin-bottom:20px}
.info-row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:14px}
.info-label{color:#888}
.info-value{font-weight:700;color:#111}
.btn{display:inline-block;padding:14px 32px;border-radius:100px;font-weight:800;font-size:14px;text-decoration:none;margin-top:20px}
.footer{background:#f9f9f7;padding:20px 32px;text-align:center;font-size:12px;color:#999}
</style></head>
<body>
<div class="wrap">
  <div class="header">
    @if($logoUrl)<img src="{{ $logoUrl }}" alt="{{ $siteName }}">@else<h1>{{ strtoupper($siteName) }}</h1>@endif
  </div>
  <div class="body">
    @php
      $statusInfo = match($status) {
          'processing' => ['bg'=>'#D1FAE5','color'=>'#065F46','text'=>'✅ Order Confirmed'],
          'shipped'    => ['bg'=>'#DBEAFE','color'=>'#1E40AF','text'=>'🚚 Order Shipped'],
          'delivered'  => ['bg'=>'#D1FAE5','color'=>'#065F46','text'=>'🎉 Order Delivered'],
          'cancelled'  => ['bg'=>'#FEE2E2','color'=>'#991B1B','text'=>'❌ Order Cancelled'],
          'refunded'   => ['bg'=>'#FEF3C7','color'=>'#92400E','text'=>'💰 Refund Processed'],
          default      => ['bg'=>'#F3F4F6','color'=>'#374151','text'=>ucfirst($status)],
      };
    @endphp
    <span class="status-badge" style="background:{{ $statusInfo['bg'] }};color:{{ $statusInfo['color'] }}">
      {{ $statusInfo['text'] }}
    </span>
    <h2 style="font-size:22px;margin:0 0 8px">Hi {{ $order->customer_name }},</h2>
    @if($status === 'shipped')
      <p style="color:#555">Great news! Your order has been shipped and is on its way.</p>
      @if($order->tracking_number)
        <p style="color:#555">Tracking: <strong>{{ $order->courier }} — {{ $order->tracking_number }}</strong></p>
      @endif
    @elseif($status === 'delivered')
      <p style="color:#555">Your order has been delivered! We hope you love it. Please leave a review.</p>
    @elseif($status === 'cancelled')
      <p style="color:#555">Your order has been cancelled. If you paid online, a refund will be processed within 3-5 business days.</p>
    @else
      <p style="color:#555">Your order status has been updated to <strong>{{ $status }}</strong>.</p>
    @endif

    <div style="background:#f9f9f7;border-radius:12px;padding:16px;margin:20px 0">
      <div class="info-row"><span class="info-label">Order #</span><span class="info-value">{{ $order->id }}</span></div>
      <div class="info-row"><span class="info-label">Total</span><span class="info-value">Rs {{ number_format($order->total) }}</span></div>
      <div class="info-row"><span class="info-label">Payment</span><span class="info-value">{{ ucfirst($order->payment_status) }}</span></div>
      <div class="info-row"><span class="info-label">Items</span><span class="info-value">{{ $order->items->count() }} item(s)</span></div>
    </div>

    <a href="{{ $trackUrl }}" class="btn" style="background:#C9A84C;color:#0a0a0a">Track Your Order →</a>
  </div>
  <div class="footer">
    <p>{{ $siteName }} · {{ $siteUrl }}</p>
    @if($phone)<p>📞 {{ $phone }}</p>@endif
    <p>This email was sent because you placed an order with us.</p>
  </div>
</div>
</body></html>
