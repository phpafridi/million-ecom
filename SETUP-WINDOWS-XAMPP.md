# MOIN Electronics — Windows + XAMPP Setup Guide

## THE CORRECT WAY — Read This First

The ZIP contains only SOURCE FILES (controllers, pages, models etc).
You must CREATE a fresh Laravel project first, then copy the files in.

---

## Step 1 — Open Command Prompt as Administrator

Press Win key → type `cmd` → right-click → "Run as Administrator"

---

## Step 2 — Go to your XAMPP folder

```cmd
cd C:\xampp\htdocs
```

---

## Step 3 — Create a fresh Laravel project

```cmd
composer create-project laravel/laravel moin
```

This downloads Laravel into `C:\xampp\htdocs\moin`.
Takes 2-3 minutes. Wait for it to finish.

---

## Step 4 — Go into the new project

```cmd
cd moin
```

Now `php artisan` will work here.

---

## Step 5 — Install required packages

```cmd
composer require inertiajs/inertia-laravel tightenco/ziggy spatie/laravel-medialibrary
```

---

## Step 6 — Copy files from the ZIP into your project

Extract the ZIP. You will see a folder called `moin-laravel`.
Copy the CONTENTS of that folder into `C:\xampp\htdocs\moin`:

| Copy FROM (inside moin-laravel\)  | Copy TO (C:\xampp\htdocs\moin\) |
|-----------------------------------|----------------------------------|
| app\Http\Controllers\Admin\       | app\Http\Controllers\Admin\      |
| app\Http\Controllers\Shop\        | app\Http\Controllers\Shop\       |
| app\Http\Middleware\              | app\Http\Middleware\             |
| app\Models\                       | app\Models\ (merge/replace)      |
| database\migrations\              | database\migrations\ (add these) |
| database\seeders\DatabaseSeeder.php | database\seeders\             |
| resources\js\                     | resources\js\ (replace all)      |
| resources\css\app.css             | resources\css\app.css            |
| resources\views\app.blade.php     | resources\views\app.blade.php    |
| routes\web.php                    | routes\web.php                   |
| vite.config.ts                    | vite.config.ts                   |
| tsconfig.json                     | tsconfig.json                    |
| package.json                      | package.json                     |

---

## Step 7 — Create the database

1. Open XAMPP Control Panel
2. Start MySQL → click Admin (phpMyAdmin opens)
3. Click New on the left sidebar
4. Database name: `moin_electronics`
5. Collation: `utf8mb4_unicode_ci`
6. Click Create

---

## Step 8 — Configure .env

In `C:\xampp\htdocs\moin` open the `.env` file in Notepad.
Change these lines:

```env
APP_NAME="MOIN Electronics"
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=moin_electronics
DB_USERNAME=root
DB_PASSWORD=
```

---

## Step 9 — Run these commands (in C:\xampp\htdocs\moin)

```cmd
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan storage:link
```

---

## Step 10 — Install Node packages and build

```cmd
npm install
npm run build
```

---

## Step 11 — Start the app

```cmd
php artisan serve
```

Open browser: http://localhost:8000
Admin panel:  http://localhost:8000/admin

---

## Every time you work on it


Window 1:
```cmd
php artisan serve
```

Window 2 (for live CSS/JS updates):
```cmd
npm run dev
```

