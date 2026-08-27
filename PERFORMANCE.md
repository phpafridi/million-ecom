# Performance Optimizations Applied

## What was slow
Every page request ran these DB queries:
1. `SELECT * FROM settings` — for every single page
2. `SELECT * FROM cart_items + JOIN products` — for cart count/items
3. `SELECT * FROM categories + activeChildren` — for nav menu
4. `SELECT COUNT FROM wishlist` — for wishlist badge
5. `SELECT product_id FROM wishlist` — for wishlist heart icons

Total: ~5 DB queries on EVERY page load.

## What's fixed
- **Settings** — cached for 60 minutes. One DB hit per hour, not per request.
- **Nav categories** — cached for 30 minutes. Menu never queries DB.
- **Cart** — cached 5 minutes per session. Cleared instantly when cart changes.
- **Cache cleared automatically** when:
  - Admin saves settings → `Setting::clearCache()`
  - Cart add/remove/checkout → `clearCartCache()`
  - Category saved in admin → clear `nav_categories`

## On production (cPanel VPS)
Change `.env` cache driver:
```
CACHE_DRIVER=file    # Default - works on shared cPanel
CACHE_DRIVER=redis   # Best - if Redis available on VPS
```

For Redis on Hostinger VPS:
```bash
sudo apt install redis-server
# Then in .env:
REDIS_HOST=127.0.0.1
CACHE_DRIVER=redis
SESSION_DRIVER=redis
```

## Result
- Page loads: ~5 DB queries → ~1-2 DB queries
- Settings save: instant (was slow because Setting::get() hits DB individually)
- Expected speedup: 3-5x faster on every page
