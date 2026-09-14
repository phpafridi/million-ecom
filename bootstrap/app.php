<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Without this, every request's IP is seen as whatever proxy sits in
        // front of the app (e.g. Cloudflare) rather than the real visitor —
        // which quietly breaks every IP-based rate limit in this app (login
        // throttling, checkout throttling, order tracking, suspicious-login
        // detection) by making all visitors look like the same one IP.
        // Trusting only Cloudflare's published ranges (not "trust everyone")
        // avoids the opposite risk of anyone being able to spoof their IP via
        // a forged X-Forwarded-For header sent directly to the server.
        $middleware->trustProxies(
            headers: \Illuminate\Http\Request::HEADER_X_FORWARDED_FOR,
            at: [
                '103.21.244.0/22','103.22.200.0/22','103.31.4.0/22',
                '104.16.0.0/13','104.24.0.0/14','108.162.192.0/18',
                '131.0.72.0/22','141.101.64.0/18','162.158.0.0/15',
                '172.64.0.0/13','173.245.48.0/20','188.114.96.0/20',
                '190.93.240.0/20','197.234.240.0/22','198.41.128.0/17',
            ]
        );
        $middleware->web(append: [
            \App\Http\Middleware\IpFirewall::class,
        ]);
        $middleware->web(append: [
            \App\Http\Middleware\SanitizeInput::class,
        ]);
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
        ]);
        $middleware->alias([
            'admin' => \App\Http\Middleware\AdminMiddleware::class,
        ]);
        // Belt-and-suspenders alongside the route-level withoutMiddleware()
        // calls in routes/web.php — this is Laravel's own officially
        // documented way to exclude CSRF for webhook/callback URLs that
        // external payment gateways POST to directly (they can't send a
        // Laravel session CSRF token, so these must always stay excluded).
        $middleware->validateCsrfTokens(except: [
            'payment/payfast/itn',
            'payment/jazzcash/callback',
            'payment/easypaisa/callback',
            'payment/razorpay/*/success',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
