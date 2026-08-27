# MILLIONAIRE — Setup Instructions

## 1. After extracting this zip

### Install SSR package
```bash
composer require inertiajs/inertia-laravel
php artisan inertia:middleware
```

### Build SSR
```bash
npm install
npm run build
# This runs: vite build && vite build --ssr
```

### Start SSR server (production)
```bash
php artisan inertia:start-ssr
# Runs on port 13714 by default
```

### For cPanel — add to .htaccess or use a cron/supervisor to keep SSR running

### Queue worker (for email queuing)
```bash
php artisan queue:work --daemon
# On cPanel: add to cron jobs every minute:
# * * * * * cd /home/user/public_html && php artisan schedule:run >> /dev/null 2>&1
```

## 2. Environment Variables (.env)
```
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com        # or your host
MAIL_PORT=587
MAIL_USERNAME=your@email.com
MAIL_PASSWORD=your_app_password
MAIL_FROM_ADDRESS=noreply@millionaire.pk
MAIL_FROM_NAME="MILLIONAIRE"

QUEUE_CONNECTION=database       # use 'sync' if no queue worker

# WhatsApp Business API (optional)
# Set in Admin → Settings → WhatsApp
```

## 3. Database queue table
```bash
php artisan queue:table
php artisan migrate
```

## 4. Sitemap
Visit: https://yourdomain.com/sitemap.xml
Submit to Google Search Console.

## 5. Notification triggers
- Order placed (COD/bank) → customer email + admin email + WhatsApp
- Payment confirmed (PayFast/JazzCash) → customer email + admin email + WhatsApp  
- Admin changes status → customer email + WhatsApp
- All templates configurable from Admin → Settings → WhatsApp

## 6. WhatsApp Business API setup
1. Go to developers.facebook.com
2. Create app → WhatsApp Business
3. Get Phone ID and API token
4. Enter in Admin → Settings → WhatsApp section
5. Enable "WhatsApp Order Notifications"
