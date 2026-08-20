# MOIN Electronics — Full-Stack Laravel App

**Stack:** Laravel 11 · Inertia.js v2 · React 19 · Tailwind CSS v4 · Shadcn/UI · Framer Motion

---

## 🚀 Quick Start

```bash
# 1. Create a new Laravel project and copy these files into it
laravel new moin-electronics
cd moin-electronics

# OR clone this structure directly, then:
bash setup.sh
```

## 📋 Manual Setup

```bash
# PHP dependencies
composer require inertiajs/inertia-laravel tightenco/ziggy spatie/laravel-medialibrary

# JS dependencies  
npm install @inertiajs/react @tabler/icons-react framer-motion recharts zustand
npm install @radix-ui/react-dialog @radix-ui/react-select class-variance-authority clsx tailwind-merge
npm install -D @tailwindcss/vite tailwindcss @vitejs/plugin-react typescript @types/react @types/react-dom

# Publish Inertia middleware
php artisan inertia:middleware

# Run migrations + seed
php artisan migrate --seed

# Create storage link
php artisan storage:link

# Build assets
npm run dev
```

## 🗄️ Database

Create a MySQL database called `moin_electronics`, then update `.env`:
```
DB_DATABASE=moin_electronics
DB_USERNAME=your_user
DB_PASSWORD=your_pass
```

## 🔐 Admin Access

After seeding:
- **URL:** `/admin`
- **Email:** `admin@moin.pk`
- **Password:** `password`

## 📁 Key Files

| Path | Purpose |
|------|---------|
| `resources/js/Pages/Home.tsx` | Storefront homepage |
| `resources/js/Pages/Shop/Index.tsx` | Shop with filters |
| `resources/js/Pages/Admin/Dashboard.tsx` | Admin dashboard with charts |
| `resources/js/Pages/Admin/Products/Index.tsx` | Product management |
| `resources/js/Pages/Admin/Products/Edit.tsx` | Create/edit product + image upload |
| `resources/js/Pages/Admin/Orders/Index.tsx` | Order management |
| `resources/js/Pages/Admin/HeroSlides/Index.tsx` | Hero slider management |
| `resources/js/Pages/Admin/Settings.tsx` | Site settings |
| `resources/js/Layouts/StorefrontLayout.tsx` | Full header + nav + footer |
| `resources/js/Layouts/AdminLayout.tsx` | Collapsible admin sidebar |
| `resources/js/Components/Storefront/HeroSlider.tsx` | Animated hero slider |
| `resources/js/Components/Storefront/ProductCard.tsx` | Product card with cart/wishlist |
| `app/Http/Controllers/Shop/HomeController.php` | Homepage data |
| `app/Http/Controllers/Admin/ProductController.php` | Product CRUD |
| `app/Http/Controllers/Admin/HeroSlideController.php` | Slide management |
| `app/Http/Controllers/Admin/SettingController.php` | Settings |
| `database/seeders/DatabaseSeeder.php` | 12 products + categories + slides |

## ✨ Features

### Storefront
- Animated hero slider (Framer Motion)
- Live ticker strip
- Featured/On Sale/Top Rated/New tabs
- Category grid, brand strip
- Full-width responsive layout
- Session-based cart
- Working search + category filters

### Admin Panel
- Revenue/orders dashboard with Recharts
- Products: full CRUD, image upload (Spatie Media Library), toggle active/featured
- Orders: status management (pending → shipped → delivered)
- Hero Slides: upload images, edit text/pricing, toggle active
- Settings: site info, contact, social media, SEO
- Collapsible sidebar, mobile-responsive

## 🎨 Design Tokens

```css
--color-orange-500: #FF5C00   /* Primary accent */
--color-ink-900:    #0d0d14   /* Hero/sidebar background */
--font-manrope:     Manrope   /* Display/headings */
--font-inter:       Inter     /* Body text */
```
# million-ecom
