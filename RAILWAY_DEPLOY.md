# MILLIONAIRE — Railway Deployment Guide

## Files in this ZIP

| File | Action |
|---|---|
| `vite.config.ts` | Replace — adds SSR entry |
| `resources/js/ssr.tsx` | New — SSR entry point |
| `resources/js/app.tsx` | Replace — fixes title |
| `config/inertia.php` | New — enables SSR |
| `routes/web.php` | Replace — adds all missing routes |
| `railway.toml` | New — Railway build config |
| `nixpacks.toml` | New — Railway PHP+Node config |
| `.env.railway` | Template — copy to .env on Railway |

---

## Step 1 — Install SSR Package

```bash
composer require inertiajs/inertia-laravel
```

---

## Step 2 — Copy All Files

Copy all files from this ZIP to your project root (same folder structure).

---

## Step 3 — Deploy to Railway

### A) Create Railway Project
1. Go to railway.app
2. New Project → Deploy from GitHub repo
3. Select your TijaaratX repo

### B) Add MySQL Service
1. In Railway dashboard → New Service → Database → MySQL
2. Railway auto-links it to your app

### C) Set Environment Variables
In Railway dashboard → Your app service → Variables tab:

```
APP_NAME=MILLIONAIRE
APP_ENV=production
APP_KEY=           ← php artisan key:generate --show
APP_DEBUG=false
APP_URL=https://your-app.railway.app

DB_CONNECTION=mysql
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_DATABASE=${{MySQL.MYSQLDATABASE}}
DB_USERNAME=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}

QUEUE_CONNECTION=database
SESSION_DRIVER=file
CACHE_STORE=file

INERTIA_SSR_ENABLED=true
INERTIA_SSR_URL=http://127.0.0.1:13714

MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=info@millionaire.pk
MAIL_FROM_NAME=MILLIONAIRE
```

### D) Deploy
Push to GitHub → Railway auto-deploys

---

## Step 4 — After First Deploy

SSH into Railway terminal or use Railway CLI:

```bash
php artisan migrate --force
php artisan db:seed --force
php artisan storage:link
```

---

## Step 5 — Verify SSR Working

```bash
# In Railway terminal
curl http://localhost:13714
# Should return HTML ✅

# Or check Railway logs for:
# "Inertia SSR server started on port 13714" ✅
```

---

## Step 6 — Custom Domain

1. Railway → Your app → Settings → Custom Domain
2. Add: millionaire.pk
3. Update DNS CNAME to Railway URL
4. Update APP_URL in Railway variables

---

## What's Fixed in This Update

### SSR (SEO)
- `ssr.tsx` — React renders on server
- Google sees full product content ✅
- All pages indexed properly ✅

### Missing Routes Added
- `/account/orders` — order history ✅
- `/account/orders/{id}` — order detail ✅
- `/account/wishlist` — wishlist page ✅
- `/account/loyalty` — points page ✅
- `/account/addresses` — saved addresses ✅
- `/track-order` — public tracking ✅
- `/track/{token}` — direct tracking link ✅
- `/newsletter/subscribe` — subscribe ✅
- `/payment/checkout/*` — Checkout.com ✅
- `/payment/paymob/*` — Paymob ✅

### Brand Fixed


---

## What's Still Missing (Future Work)

### Features
- [ ] Mobile app (React Native + Expo)
- [ ] WhatsApp order notifications
- [ ] SMS notifications (Twilio/local)
- [ ] Advanced inventory management
- [ ] Multi-warehouse support
- [ ] POS system integration
- [ ] ERP integration

### SEO (now working with SSR)
- [ ] Submit sitemap to Google Search Console
- [ ] Set up Google Analytics
- [ ] Add structured data for breadcrumbs

### Admin Panel
- [ ] Bulk product import via CSV
- [ ] Sales reports with charts
- [ ] Customer analytics
- [ ] Abandoned cart recovery
