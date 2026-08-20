<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:DejaVu Sans,Arial,sans-serif; font-size:13px; color:#333; padding:30px; }
  .header { display:flex; justify-content:space-between; margin-bottom:32px; padding-bottom:24px; border-bottom:2px solid #f0f0f0; }
  .logo h1 { font-size:22px; font-weight:900; color:#0a0e1a; letter-spacing:2px; }
  .logo p  { color:#999; font-size:11px; margin-top:4px; }
  .invoice-meta { text-align:right; }
  .invoice-meta h2 { font-size:20px; font-weight:900; color:#0a0e1a; }
  .invoice-meta p  { font-size:12px; color:#666; margin-top:3px; }
  .addresses { display:flex; gap:40px; margin-bottom:24px; }
  .addr-box { flex:1; }
  .addr-box h4 { font-size:10px; font-weight:700; text-transform:uppercase; color:#999; letter-spacing:.08em; margin-bottom:6px; padding-bottom:4px; border-bottom:1px solid #eee; }
  .addr-box p  { font-size:13px; line-height:1.6; }
  table { width:100%; border-collapse:collapse; margin-bottom:16px; }
  thead th { background:#0a0e1a; color:white; text-align:left; padding:10px 14px; font-size:11px; text-transform:uppercase; }
  tbody tr:nth-child(even) { background:#f9f9f9; }
  tbody td { padding:10px 14px; border-bottom:1px solid #f0f0f0; }
  .totals { float:right; width:220px; }
  .tr { display:flex; justify-content:space-between; padding:5px 0; font-size:13px; }
  .tr.grand { font-weight:900; font-size:16px; border-top:2px solid #0a0e1a; margin-top:6px; padding-top:8px; }
  .footer { clear:both; margin-top:40px; padding-top:16px; border-top:1px solid #eee; text-align:center; color:#999; font-size:11px; }
</style>
</head>
<body>
<div class="header">
  <div class="logo">
    <h1>{{ $storeName }}</h1>
    @if($storePhone)<p>{{ $storePhone }}</p>@endif
    @if($storeEmail)<p>{{ $storeEmail }}</p>@endif
  </div>
  <div class="invoice-meta">
    <h2>INVOICE</h2>
    <p><strong>Order #{{ $order->id }}</strong></p>
    <p>{{ $order->created_at->format('d M Y, h:i A') }}</p>
    <p>{{ ucfirst(str_replace('_',' ',$order->payment_method)) }} — {{ ucfirst($order->payment_status) }}</p>
  </div>
</div>
<div class="addresses">
  <div class="addr-box">
    <h4>Customer</h4>
    <p><strong>{{ $order->customer_name }}</strong></p>
    <p>{{ $order->customer_phone }}</p>
    @if($order->customer_email)<p>{{ $order->customer_email }}</p>@endif
    <p>{{ $order->customer_address }}</p>
  </div>
  <div class="addr-box">
    <h4>Order Details</h4>
    <p>Order Status: <strong>{{ ucfirst($order->status) }}</strong></p>
    <p>Items: {{ $order->items->count() }}</p>
    @if($order->coupon_code)<p>Coupon: {{ $order->coupon_code }}</p>@endif
  </div>
</div>
<table>
  <thead><tr><th>#</th><th>Product</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr></thead>
  <tbody>
    @foreach($order->items as $i => $item)
    <tr><td>{{ $i+1 }}</td><td>{{ $item->product_name }}</td><td>{{ $item->quantity }}</td><td>Rs {{ number_format($item->price) }}</td><td>Rs {{ number_format($item->subtotal) }}</td></tr>
    @endforeach
  </tbody>
</table>
<div class="totals">
  <div class="tr"><span>Subtotal</span><span>Rs {{ number_format($order->subtotal) }}</span></div>
  @if(isset($order->discount) && $order->discount > 0)
  <div class="tr" style="color:#059669"><span>Discount</span><span>-Rs {{ number_format($order->discount) }}</span></div>
  @endif
  <div class="tr"><span>Shipping</span><span>{{ $order->shipping > 0 ? 'Rs '.number_format($order->shipping) : 'Free' }}</span></div>
  <div class="tr grand"><span>TOTAL</span><span>Rs {{ number_format($order->total) }}</span></div>
</div>
@if($order->notes)
<p style="margin-top:20px;padding:10px;background:#f9f9f9;border-radius:6px;font-size:12px;clear:both"><strong>Notes:</strong> {{ $order->notes }}</p>
@endif
<div class="footer">{{ $storeName }} · {{ $storePhone }} · Thank you for your business!</div>
</body></html>
