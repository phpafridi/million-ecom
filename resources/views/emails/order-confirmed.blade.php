<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Order #{{ $order->id }} Confirmed</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
         background:#f0f2f5; padding:24px 16px; color:#1a1a2e; }
  .wrap { max-width:600px; margin:0 auto; }
  .card { background:white; border-radius:16px; overflow:hidden;
          box-shadow:0 2px 12px rgba(0,0,0,0.08); margin-bottom:16px; }
  .header { background:{{ $primaryColor ?? '#0a0e1a' }}; padding:36px 32px; text-align:center; }
  .logo-box { display:inline-flex; align-items:center; gap:12px; margin-bottom:20px; }
  .logo-letter { width:44px; height:44px; border-radius:10px; background:{{ $accentColor ?? '#00c8ff' }};
                 display:inline-flex; align-items:center; justify-content:center;
                 font-size:20px; font-weight:900; color:{{ $primaryColor ?? '#0a0e1a' }}; }
  .store-name { font-size:22px; font-weight:900; color:white; letter-spacing:0.05em; }
  .check-circle { width:64px; height:64px; border-radius:50%;
                  background:{{ $accentColor ?? '#00c8ff' }}20;
                  border:2px solid {{ $accentColor ?? '#00c8ff' }}40;
                  display:flex; align-items:center; justify-content:center; margin:0 auto 16px; }
  .header h1 { color:white; font-size:24px; font-weight:800; margin-bottom:6px; }
  .header p { color:rgba(255,255,255,0.6); font-size:14px; }
  .body { padding:32px; }
  .status-pill { display:inline-block; background:{{ $accentColor ?? '#00c8ff' }}18;
                 color:{{ $accentColor ?? '#00c8ff' }}; border:1px solid {{ $accentColor ?? '#00c8ff' }}30;
                 font-weight:800; font-size:12px; padding:6px 16px; border-radius:50px;
                 letter-spacing:0.05em; text-transform:uppercase; margin-bottom:24px; }
  .section-title { font-size:11px; font-weight:800; text-transform:uppercase;
                   letter-spacing:0.12em; color:#9ca3af; margin-bottom:12px; }
  table.items { width:100%; border-collapse:collapse; margin-bottom:24px; }
  table.items th { background:#f8fafc; padding:10px 12px; text-align:left;
                   font-size:11px; font-weight:700; color:#9ca3af; text-transform:uppercase;
                   letter-spacing:0.08em; }
  table.items td { padding:12px; border-bottom:1px solid #f0f2f5; font-size:14px; color:#374151; }
  table.items tr:last-child td { border-bottom:none; }
  .totals { background:#f8fafc; border-radius:12px; padding:20px; margin-bottom:24px; }
  .total-row { display:flex; justify-content:space-between; padding:5px 0;
               font-size:14px; color:#6b7280; }
  .total-row.grand { border-top:1px solid #e5e7eb; margin-top:8px; padding-top:12px;
                     font-size:17px; font-weight:900; color:#1a1a2e; }
  .total-row.grand .amt { color:{{ $accentColor ?? '#00c8ff' }}; }
  .info-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:24px; }
  .info-box { background:#f8fafc; border-radius:10px; padding:16px; }
  .info-box h4 { font-size:11px; font-weight:700; text-transform:uppercase;
                 letter-spacing:0.08em; color:#9ca3af; margin-bottom:6px; }
  .info-box p { font-size:13px; font-weight:600; color:#374151; line-height:1.5; }
  .steps { margin-bottom:24px; }
  .step { display:flex; align-items:flex-start; gap:12px; padding:10px 0;
          border-bottom:1px solid #f0f2f5; }
  .step:last-child { border-bottom:none; }
  .step-num { width:28px; height:28px; border-radius:50%; background:{{ $accentColor ?? '#00c8ff' }}15;
              border:1px solid {{ $accentColor ?? '#00c8ff' }}30; flex-shrink:0; display:flex;
              align-items:center; justify-content:center; font-size:12px; font-weight:800;
              color:{{ $accentColor ?? '#00c8ff' }}; }
  .step-text { font-size:13px; color:#4b5563; padding-top:4px; line-height:1.4; }
  .cta-btn { display:block; text-align:center; background:{{ $accentColor ?? '#00c8ff' }};
             color:{{ $primaryColor ?? '#0a0e1a' }}; font-weight:900; font-size:14px;
             padding:14px 32px; border-radius:12px; text-decoration:none; margin-bottom:24px; }
  .contact-row { text-align:center; padding:16px; background:#f8fafc; border-radius:12px; margin-bottom:24px; }
  .contact-row p { font-size:13px; color:#6b7280; margin-bottom:8px; }
  .contact-row a { display:inline-block; margin:0 8px; font-size:13px; font-weight:600;
                   color:{{ $accentColor ?? '#00c8ff' }}; text-decoration:none; }
  .footer { text-align:center; padding:24px; }
  .footer p { font-size:12px; color:#9ca3af; line-height:1.6; }
  .footer a { color:{{ $accentColor ?? '#00c8ff' }}; text-decoration:none; }
  @media(max-width:480px) { .info-grid { grid-template-columns:1fr; } .body { padding:20px; } }
</style>
</head>
<body>
<div class="wrap">
  <div class="card">
    <!-- Header -->
    <div class="header">
      <div class="logo-box">
        <div class="logo-letter">{{ substr($storeName ?? 'T', 0, 1) }}</div>
        <div class="store-name">{{ strtoupper($storeName ?? 'Tijar Store') }}</div>
      </div>
      <div style="font-size:48px;margin-bottom:12px;">✅</div>
      <h1>Order Confirmed!</h1>
      <p>Thank you, {{ $order->customer_name }}. Your order is placed successfully.</p>
    </div>

    <div class="body">
      <div style="text-align:center;margin-bottom:24px;">
        <span class="status-pill">Order #{{ $order->id }}</span>
      </div>

      <!-- Items -->
      <div class="section-title">Your Items</div>
      <table class="items">
        <thead>
          <tr>
            <th>Product</th>
            <th style="text-align:center">Qty</th>
            <th style="text-align:right">Price</th>
          </tr>
        </thead>
        <tbody>
          @foreach($order->items as $item)
          <tr>
            <td><strong>{{ $item->product_name }}</strong></td>
            <td style="text-align:center">{{ $item->quantity }}</td>
            <td style="text-align:right">Rs {{ number_format($item->subtotal) }}</td>
          </tr>
          @endforeach
        </tbody>
      </table>

      <!-- Totals -->
      <div class="totals">
        <div class="total-row">
          <span>Subtotal</span>
          <span>Rs {{ number_format($order->subtotal) }}</span>
        </div>
        @if($order->discount > 0)
        <div class="total-row" style="color:#10b981;">
          <span>Discount</span>
          <span>− Rs {{ number_format($order->discount) }}</span>
        </div>
        @endif
        <div class="total-row">
          <span>Shipping</span>
          <span>{{ $order->shipping > 0 ? 'Rs ' . number_format($order->shipping) : 'Free' }}</span>
        </div>
        <div class="total-row grand">
          <span>Total</span>
          <span class="amt">Rs {{ number_format($order->total) }}</span>
        </div>
      </div>

      <!-- Payment info -->
      <div class="info-grid">
        <div class="info-box">
          <h4>Payment Method</h4>
          <p>{{ ucwords(str_replace('_', ' ', $order->payment_method)) }}</p>
          <p style="margin-top:4px">
            @if($order->payment_status === 'paid')
              <span style="color:#10b981;font-size:12px;">✓ Payment Received</span>
            @elseif($order->payment_method === 'cod')
              <span style="color:#f59e0b;font-size:12px;">Pay on delivery</span>
            @else
              <span style="color:#f59e0b;font-size:12px;">Pending confirmation</span>
            @endif
          </p>
        </div>
        <div class="info-box">
          <h4>Delivery Address</h4>
          <p>{{ $order->customer_name }}<br>{{ $order->customer_city }}<br>{{ $order->customer_address }}</p>
        </div>
      </div>

      <!-- What happens next -->
      <div class="section-title">What Happens Next</div>
      <div class="steps">
        @if($order->payment_method === 'bank_transfer' && $order->payment_status !== 'paid')
        <div class="step">
          <div class="step-num">1</div>
          <div class="step-text"><strong>Payment Verification</strong> — We'll verify your bank transfer receipt within 1–2 hours.</div>
        </div>
        @endif
        <div class="step">
          <div class="step-num">{{ $order->payment_method === 'bank_transfer' && $order->payment_status !== 'paid' ? '2' : '1' }}</div>
          <div class="step-text"><strong>Order Confirmation</strong> — We'll call or WhatsApp you to confirm delivery details.</div>
        </div>
        <div class="step">
          <div class="step-num">{{ $order->payment_method === 'bank_transfer' && $order->payment_status !== 'paid' ? '3' : '2' }}</div>
          <div class="step-text"><strong>Dispatch</strong> — Your order will be packed and dispatched within 1–2 business days.</div>
        </div>
        <div class="step">
          <div class="step-num">{{ $order->payment_method === 'bank_transfer' && $order->payment_status !== 'paid' ? '4' : '3' }}</div>
          <div class="step-text"><strong>Delivery</strong> — Delivered to {{ $order->customer_city }}. You'll receive tracking info.</div>
        </div>
      </div>

      <!-- Contact -->
      <div class="contact-row">
        <p>Need help with your order?</p>
        @if($whatsapp)
        <a href="https://wa.me/{{ $whatsapp }}?text={{ urlencode('Hi, I need help with Order #' . $order->id) }}">💬 WhatsApp Us</a>
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
      You're receiving this because you placed an order at <strong>{{ $storeName }}</strong>.<br>
      © {{ date('Y') }} {{ $storeName }}. All rights reserved.
      @if($storeAddress)<br>{{ $storeAddress }}@endif
    </p>
  </div>
</div>
</body>
</html>
