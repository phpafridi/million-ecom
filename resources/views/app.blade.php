<!DOCTYPE html>
@php
    $s        = \App\Models\Setting::allKeyed();
    $darkMode = $s['theme_dark_mode'] ?? 'light';
    if ($darkMode === 'dark')     { $darkClass = 'dark'; }
    elseif ($darkMode === 'auto') { $darkClass = 'auto'; }
    else                          { $darkClass = ''; }

    $t = [
        'primary'      => $s['theme_primary']       ?? '#C9A84C',
        'primary_dark' => $s['theme_primary_dark']  ?? '#B8973B',
        'primary_text' => $s['theme_primary_text']  ?? '#0a0a0a',
        'accent'       => $s['theme_accent']        ?? '#C9A84C',
        'dark_bg'      => $s['theme_dark_bg']       ?? '#0a0a0a',
        'dark_bg2'     => $s['theme_dark_bg2']      ?? '#111111',
        'body_bg'      => $s['theme_body_bg']       ?? '#FAFAFA',
        'radius'       => ($s['theme_border_radius'] ?? '8') . 'px',
        'topbar_bg'    => $s['topbar_bg'] ?? $s['theme_topbar_bg'] ?? '#0a0a0a',
        'navbar_bg'    => $s['theme_nav_bg']        ?? '#ffffff',
        'navbar_text'  => $s['theme_nav_text']      ?? '#111111',
        'navbar_border'=> $s['theme_nav_border']    ?? '#e5e7eb',
        'subnav_bg'    => $s['theme_nav_bg']        ?? '#ffffff',
        'logo_box_bg'  => $s['theme_dark_bg']       ?? '#0a0a0a',
        'header_bg'    => $s['theme_header_bg']     ?? '#ffffff',
        'header_text'  => $s['theme_header_text']   ?? '#0a0a0a',
        'header_border'=> $s['theme_header_border'] ?? '#e5e7eb',
    ];

    $seo       = $page['props']['seo'] ?? [];
    $siteName  = $s['site_name'] ?? 'MILLIONAIRE';
    $metaTitle = $seo['title']       ?? $s['seo_title']       ?? $siteName;
    $metaDesc  = $seo['description'] ?? $s['seo_description'] ?? '';
    $metaKeys  = $seo['keywords']    ?? $s['seo_keywords']    ?? '';
    $ogImage   = $seo['image']       ?? $s['seo_image']       ?? null;
    $canonical = $seo['url']         ?? url()->current();
    $ogType    = $seo['type']        ?? 'website';
    $favicon   = $s['favicon_url']   ?? null;
    $logoUrl   = $s['logo_url']      ?? null;
    $schema    = $seo['schema']      ?? null;
    $robots    = ($s['seo_indexing_enabled'] ?? '1') === '1' ? 'index,follow' : 'noindex,nofollow';
    $customJs  = $s['custom_head_scripts'] ?? '';
    $siteVerification = $s['google_site_verification'] ?? '';

    // Tracking
    $gaId     = ($s['ga_enabled']          ?? '0') === '1' ? ($s['ga_measurement_id'] ?? '') : '';
    $gtmId    = ($s['gtm_enabled']         ?? '0') === '1' ? ($s['gtm_id']            ?? '') : '';
    $fbId     = ($s['fb_pixel_enabled']    ?? '0') === '1' ? ($s['fb_pixel_id']       ?? '') : '';
    $tiktokId = ($s['tiktok_pixel_enabled']?? '0') === '1' ? ($s['tiktok_pixel_id']  ?? '') : '';
@endphp
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="{{ $darkClass }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="theme-color" content="{{ $t['primary'] ?? '#C9A84C' }}">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="{{ $siteName }}">
    <link rel="manifest" href="/manifest.json">
    <link rel="apple-touch-icon" href="/images/icon-192.png">

    <title inertia>{{ $metaTitle }}</title>
    <meta name="description" content="{{ $metaDesc }}">
    <meta name="robots"      content="{{ $robots }}">
    @if($siteVerification)
    <meta name="google-site-verification" content="{{ $siteVerification }}">
    @endif
    <link rel="canonical"    href="{{ $canonical }}">

    @if($metaKeys)
        <meta name="keywords" content="{{ $metaKeys }}">
    @endif

    @if($favicon)
        <link rel="icon" type="image/png" href="{{ $favicon }}">
    @endif

    <meta property="og:type"        content="{{ $ogType }}">
    <meta property="og:title"       content="{{ $metaTitle }}">
    <meta property="og:description" content="{{ $metaDesc }}">
    <meta property="og:url"         content="{{ $canonical }}">
    <meta property="og:site_name"   content="{{ $siteName }}">

    @if($ogImage)
        <meta property="og:image"  content="{{ $ogImage }}">
        <meta name="twitter:image" content="{{ $ogImage }}">
    @endif

    <meta name="twitter:card"        content="summary_large_image">
    <meta name="twitter:title"       content="{{ $metaTitle }}">
    <meta name="twitter:description" content="{{ $metaDesc }}">

    @if($schema)
        <script type="application/ld+json">{!! json_encode($schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) !!}</script>
    @endif

    {{-- Google Tag Manager --}}
    @if($gtmId)
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','{{ $gtmId }}');</script>
    @endif

    {{-- Google Analytics 4 --}}
    @if($gaId)
    <script async src="https://www.googletagmanager.com/gtag/js?id={{ $gaId }}"></script>
    <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','{{ $gaId }}');</script>
    @endif

    {{-- Facebook Pixel --}}
    @if($fbId)
    <script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','{{ $fbId }}');fbq('track','PageView');</script>
    <noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id={{ $fbId }}&ev=PageView&noscript=1"/></noscript>
    @endif

    {{-- TikTok Pixel --}}
    @if($tiktokId)
    <script>!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};ttq.load('{{ $tiktokId }}');ttq.page();}(window,document,'ttq');</script>
    @endif

    <style>
        :root {
            --color-primary:       {{ $t['primary'] }};
            --color-primary-dark:  {{ $t['primary_dark'] }};
            --color-primary-text:  {{ $t['primary_text'] }};
            --color-accent:        {{ $t['accent'] }};
            --color-dark-bg:       {{ $t['dark_bg'] }};
            --color-dark-bg2:      {{ $t['dark_bg2'] }};
            --color-body-bg:       {{ $t['body_bg'] }};
            /* New — was missing entirely. Every page-content text fix this
               session used --color-dark-bg directly, which is your fixed
               brand dark color (for things like the footer/logo box) and
               never changes — not a "text that adapts to light vs dark
               mode" variable. Using this new one instead means flipping
               dark mode below actually does something, instead of always
               rendering dark text no matter what. Defaults to the exact
               same value as --color-dark-bg so nothing changes visually
               for anyone not using dark mode. */
            --color-body-text:     {{ $t['dark_bg'] }};
            --radius:              {{ $t['radius'] }};
            --color-topbar-bg:     {{ $t['topbar_bg'] }};
            --color-navbar-bg:     {{ $t['navbar_bg'] }};
            --color-navbar-text:   {{ $t['navbar_text'] }};
            --color-navbar-border: {{ $t['navbar_border'] }};
            --color-subnav-bg:     {{ $t['subnav_bg'] }};
            --color-logo-box-bg:   {{ $t['logo_box_bg'] }};
            --color-header-bg:     {{ $t['header_bg'] }};
            --color-header-text:   {{ $t['header_text'] }};
            --color-header-border: {{ $t['header_border'] }};
        }
        /* This block never existed at all — the dark mode toggle has been
           flipping a CSS class with nothing attached to it since it was
           built. Overrides the core variables so the toggle actually
           produces a real dark theme: dark body, light readable text,
           dark header/nav so they don't stay stranded as bright white
           bars on an otherwise-dark page. */
        html.dark {
            --color-body-bg:       #121212;
            --color-body-text:     #f1f1f1;
            --color-header-bg:     #161616;
            --color-header-text:   #f1f1f1;
            --color-header-border: #2a2a2a;
            --color-navbar-bg:     #161616;
            --color-navbar-text:   #f1f1f1;
            --color-navbar-border: #2a2a2a;
            --color-subnav-bg:     #1a1a1a;
        }
        html.dark body { background: var(--color-body-bg); color: var(--color-body-text); }
        /* Cards/panels across the app use plain white backgrounds with no
           variable at all — this keeps them from staying stark white
           islands on a dark page without needing to touch every single
           page's markup individually. */
        html.dark .bg-white { background-color: #1c1c1c !important; }
        html.dark .bg-gray-50 { background-color: #191919 !important; }
        html.dark .border-gray-100, html.dark .border-gray-200 { border-color: #2a2a2a !important; }
        *, *::before, *::after { box-sizing: border-box; }
        /* Mobile optimizations */
        @media (max-width: 1024px) {
            html { -webkit-text-size-adjust: 100%; }
            img { max-width: 100%; height: auto; }
            * { -webkit-tap-highlight-color: transparent; }
        }
        /* Smooth scrolling */
        html { scroll-behavior: smooth; }
        /* Better touch targets */
        button, a { touch-action: manipulation; }
        html, body { overflow-x: hidden !important; max-width: 100%; width: 100%; margin: 0; padding: 0; }
        body { background: var(--color-body-bg); }

        /* ── Splash / Preloader ────────────────────────────────────── */
        #app-splash {
            position: fixed; inset: 0; z-index: 99999;
            display: flex; align-items: center; justify-content: center;
            background: var(--color-dark-bg, #0a0a0a);
            transition: opacity .45s ease, visibility .45s ease;
        }
        #app-splash.splash-hide { opacity: 0; visibility: hidden; pointer-events: none; }
        .splash-mark {
            position: relative;
            width: 180px; height: 180px;
            display: flex; align-items: center; justify-content: center;
            animation: splashPulse 1.8s ease-in-out infinite;
        }
        .splash-mark img {
            max-width: 80%; max-height: 80%; width: auto; height: auto; object-fit: contain;
            filter: drop-shadow(0 2px 16px rgba(201,168,76,0.4));
        }
        .splash-mark .splash-letter {
            font-family: 'Manrope', -apple-system, sans-serif;
            font-weight: 900; font-size: 34px; letter-spacing: 1px;
            color: var(--color-primary, #C9A84C);
        }
        .splash-ring {
            position: absolute; inset: -10px;
            border-radius: 50%;
            border: 2px solid transparent;
            border-top-color: var(--color-primary, #C9A84C);
            animation: splashSpin 1s linear infinite;
        }
        @keyframes splashPulse {
            0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(201,168,76,0.15); }
            50%      { transform: scale(1.04); box-shadow: 0 0 0 10px rgba(201,168,76,0); }
        }
        @keyframes splashSpin { to { transform: rotate(360deg); } }
        .splash-brand {
            position: absolute; bottom: 46px; left: 0; right: 0;
            text-align: center;
            font-family: 'Manrope', -apple-system, sans-serif;
            font-weight: 800; font-size: 12px; letter-spacing: 3px;
            color: rgba(255,255,255,0.35); text-transform: uppercase;
        }

        /* ── Skeleton shimmer (used by resources/js/Components/ui/Skeleton.tsx) ── */
        .skeleton-shimmer {
            background: linear-gradient(90deg, #eee 25%, #f5f5f5 37%, #eee 63%);
            background-size: 400% 100%;
            animation: skeletonShimmer 1.4s ease infinite;
        }
        @keyframes skeletonShimmer {
            0%   { background-position: 100% 50%; }
            100% { background-position: 0 50%; }
        }
    </style>

    @if($customJs)
        @php
            // This is a defense-in-depth layer, not a real guarantee — an
            // attacker with genuine admin access could still embed harmful
            // code alongside one of these substrings and pass this check.
            // The actual protection is that this field is already
            // restricted to full Admin accounts only (not Staff) at save
            // time. This just catches accidental mistakes or unrelated
            // injected content, and keeps the field itself well below the
            // rest of the page in unrestricted-execution risk.
            $safeJsPatterns = ['gtag(', 'fbq(', 'ttq.', 'dataLayer',
                '_linkedin_partner_id', 'klaviyo', 'hotjar',
                'clarity', 'pinterest', 'snapchat', 'intercom'];
            $customJsLooksSafe = collect($safeJsPatterns)->contains(fn($p) => str_contains($customJs, $p));
        @endphp
        @if($customJsLooksSafe)
            {!! $customJs !!}
        @endif
    @endif

    @viteReactRefresh
    @vite(['resources/js/app.tsx'])
    @inertiaHead
    <style>
        .banner-desktop { display: none !important; }
        .banner-mobile  { display: flex !important; flex-direction: column; gap: 12px; }
        @media (min-width: 768px) {
            .banner-desktop { display: grid !important; gap: 12px; grid-template-columns: 340px 1fr; grid-template-rows: 220px 228px; }
            .banner-mobile  { display: none !important; }
        }
    </style>
</head>
<body class="antialiased">
    @if($gtmId)
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id={{ $gtmId }}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    @endif

    {{-- First-load splash screen. Hidden automatically once Inertia mounts the page. --}}
    <div id="app-splash">
        <div class="splash-mark">
            <div class="splash-ring"></div>
            @if($logoUrl)
                <img src="{{ $logoUrl }}" alt="{{ $siteName }}">
            @else
                <span class="splash-letter">{{ mb_substr($siteName, 0, 1) }}</span>
            @endif
        </div>
        <div class="splash-brand">{{ $siteName }}</div>
    </div>
    <script>
        (function () {
            function hideSplash() {
                var el = document.getElementById('app-splash');
                if (!el) return;
                el.classList.add('splash-hide');
                setTimeout(function () { el.remove(); }, 500);
            }
            // Hide as soon as Inertia has painted the first page,
            // with a small minimum so it doesn't just flash on fast connections.
            var minShow = new Promise(function (r) { setTimeout(r, 350); });
            var ready = new Promise(function (r) {
                if (document.readyState === 'complete') return r();
                window.addEventListener('load', r, { once: true });
            });
            Promise.all([minShow, ready]).then(hideSplash);
            // Safety net in case something above never fires
            setTimeout(hideSplash, 4000);
        })();
    </script>

    @inertia
</body>
</html>
