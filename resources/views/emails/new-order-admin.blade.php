<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>New Order {{ ($order->order_number ?? ('MLN-' . str_pad($order->id, 5, '0', STR_PAD_LEFT))) }}</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
         background:#f0f2f5; padding:24px 16px; }
  .wrap { max-width:600px; margin:0 auto; }
  .card { background:white; border-radius:16px; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,0.08); }
  .header { background:{{ $primaryColor ?? '#1e293b' }}; padding:28px 32px; }
  .header h1 { color:white; font-size:20px; font-weight:800; margin:0 0 4px; }
  .header p { color:rgba(255,255,255,0.5); font-size:13px; margin:0; }
  .alert { background:#f59e0b; padding:14px 32px; font-size:13px; font-weight:700; color:#1c0a00; }
  .body { padding:28px 32px; }
  .big-amount { font-size:36px; font-weight:900; color:#1e293b; margin:16px 0; }
  .meta-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:24px; }
  .meta-box { background:#f8fafc; border-radius:10px; padding:14px; }
  .meta-box h4 { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.1em;
                 color:#94a3b8; margin-bottom:5px; }
  .meta-box p { font-size:13px; font-weight:600; color:#334155; line-height:1.4; }
  table { width:100%; border-collapse:collapse; margin-bottom:20px; }
  th { background:#f1f5f9; padding:10px 12px; text-align:left; font-size:11px;
       font-weight:700; color:#94a3b8; text-transform:uppercase; }
  td { padding:11px 12px; border-bottom:1px solid #f1f5f9; font-size:13px; color:#374151; }
  .total-row td { font-weight:800; font-size:15px; color:#1e293b; border-top:2px solid #e2e8f0; }
  .cta { display:block; text-align:center; background:#2563eb; color:white; font-weight:800;
         font-size:14px; padding:14px; border-radius:10px; text-decoration:none; margin-top:16px; }
  .footer { text-align:center; padding:20px; font-size:12px; color:#94a3b8; }
  @media(max-width:480px){.meta-grid{grid-template-columns:1fr;}.body{padding:20px;}}
</style>
</head>
<body>
<div class="wrap">
  <div class="card">
    <div class="header">
      @if($logoUrl)<img src="{{ $logoUrl }}" alt="{{ $storeName }}" style="height:28px;width:auto;margin-bottom:10px;display:block;">@endif
      <h1>🛍 New Order Received</h1>
      <p>{{ now()->format('D, d M Y — H:i') }}</p>
    </div>
    <div class="alert">⚡ Action required — Order {{ ($order->order_number ?? ('MLN-' . str_pad($order->id, 5, '0', STR_PAD_LEFT))) }} is waiting for processing</div>
    <div class="body">
      <div class="big-amount">Rs {{ number_format($order->total) }}</div>

      <div class="meta-grid">
        <div class="meta-box">
          <h4>Customer</h4>
          <p>{{ $order->customer_name }}<br>{{ $order->customer_phone }}</p>
          @if($order->customer_email)<p style="color:#64748b;font-size:12px;">{{ $order->customer_email }}</p>@endif
        </div>
        <div class="meta-box">
          <h4>Payment</h4>
          <p>{{ ucwords(str_replace('_',' ',$order->payment_method)) }}</p>
          <p style="margin-top:4px;font-size:12px;color:{{ $order->payment_status === 'paid' ? '#10b981' : '#f59e0b' }}">
            {{ $order->payment_status === 'paid' ? '✓ Paid' : '⏳ Pending' }}
          </p>
        </div>
        <div class="meta-box">
          <h4>Delivery City</h4>
          <p>{{ $order->customer_city }}</p>
        </div>
        <div class="meta-box">
          <h4>Order Status</h4>
          <p style="text-transform:capitalize">{{ $order->status }}</p>
        </div>
      </div>

      <table>
        <thead><tr><th>Item</th><th>Qty</th><th style="text-align:right">Amount</th></tr></thead>
        <tbody>
          @foreach($order->items as $item)
          <tr>
            <td>{{ $item->product_name }}</td>
            <td>{{ $item->quantity }}</td>
            <td style="text-align:right">Rs {{ number_format($item->subtotal) }}</td>
          </tr>
          @endforeach
          @if($order->discount > 0)
          <tr><td colspan="2" style="color:#10b981">Discount</td><td style="text-align:right;color:#10b981">− Rs {{ number_format($order->discount) }}</td></tr>
          @endif
          <tr><td colspan="2">Shipping</td><td style="text-align:right">{{ $order->shipping > 0 ? 'Rs '.number_format($order->shipping) : 'Free' }}</td></tr>
        </tbody>
        <tfoot><tr class="total-row"><td colspan="2">Total</td><td style="text-align:right">Rs {{ number_format($order->total) }}</td></tr></tfoot>
      </table>

      @if($order->customer_address)
      <div style="background:#f8fafc;border-radius:10px;padding:14px;margin-bottom:16px;">
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#94a3b8;margin-bottom:6px;">Delivery Address</div>
        <div style="font-size:13px;font-weight:600;color:#334155;">{{ $order->customer_address }}, {{ $order->customer_city }}</div>
      </div>
      @endif

      @if($order->notes)
      <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:14px;margin-bottom:16px;">
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#92400e;margin-bottom:4px;">Customer Note</div>
        <div style="font-size:13px;color:#78350f;">{{ $order->notes }}</div>
      </div>
      @endif

      <a href="{{ $adminUrl }}/orders/{{ $order->id }}" class="cta">View & Process Order →</a>
    </div>
  </div>
  <div class="footer"><p>This is an automated notification from {{ $storeName }}.</p></div>
</div>
</body>
</html>
