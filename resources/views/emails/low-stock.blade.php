<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Low Stock Alert</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
         background:#f0f2f5; padding:24px 16px; color:#1a1a2e; }
  .wrap { max-width:600px; margin:0 auto; }
  .card { background:white; border-radius:16px; overflow:hidden;
          box-shadow:0 2px 12px rgba(0,0,0,0.08); margin-bottom:16px; }
  .header { background:{{ $primaryColor ?? '#0a0a0a' }}; padding:28px 32px; text-align:center; }
  .header img { height:36px; width:auto; margin-bottom:8px; }
  .header .store-name { display:block; font-size:18px; font-weight:900; color:white; letter-spacing:0.05em; margin-bottom:4px; }
  .header h1 { color:white; font-size:18px; font-weight:800; }
  .body { padding:28px 32px; }
  table { width:100%; border-collapse:collapse; }
  th { background:#f8fafc; padding:10px 12px; text-align:left; font-size:11px; font-weight:700;
       color:#9ca3af; text-transform:uppercase; letter-spacing:0.08em; }
  td { padding:12px; border-bottom:1px solid #f0f2f5; font-size:14px; color:#374151; }
  tr:last-child td { border-bottom:none; }
  .stock-badge { display:inline-block; padding:3px 10px; border-radius:50px; font-size:12px; font-weight:800; }
  .stock-out { background:#fef2f2; color:#dc2626; }
  .stock-low { background:#fffbeb; color:#d97706; }
  .footer { text-align:center; padding:20px; }
  .footer p { font-size:12px; color:#9ca3af; }
</style>
</head>
<body>
<div class="wrap">
  <div class="card">
    <div class="header">
      @if($logoUrl)<img src="{{ $logoUrl }}" alt="{{ $siteName }}"><br>@endif
      <span class="store-name">{{ strtoupper($siteName ?? 'STORE') }}</span>
      <h1>⚠️ {{ count($products) }} Product(s) Low on Stock</h1>
    </div>
    <div class="body">
      <table>
        <thead><tr><th>Product</th><th>SKU</th><th style="text-align:center">Stock Left</th></tr></thead>
        <tbody>
          @foreach($products as $p)
          <tr>
            <td><strong>{{ $p['name'] }}</strong></td>
            <td style="color:#9ca3af">{{ $p['sku'] ?? '—' }}</td>
            <td style="text-align:center">
              <span class="stock-badge {{ $p['stock'] <= 0 ? 'stock-out' : 'stock-low' }}">
                {{ $p['stock'] <= 0 ? 'Out of Stock' : $p['stock'] . ' left' }}
              </span>
            </td>
          </tr>
          @endforeach
        </tbody>
      </table>
    </div>
  </div>
  <div class="footer">
    <p>Automated low stock alert from {{ $siteName ?? 'your store' }}'s admin panel.</p>
  </div>
</div>
</body>
</html>
