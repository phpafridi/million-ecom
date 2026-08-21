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
        'topbar_bg'    => $s['topbar_bg']           ?? '#0a0a0a',
        'navbar_bg'    => $s['navbar_bg']           ?? '#ffffff',
        'navbar_text'  => $s['navbar_text_color']   ?? '#111111',
        'navbar_border'=> $s['navbar_border_color'] ?? '#e5e7eb',
        'subnav_bg'    => $s['subnav_bg']           ?? '#ffffff',
        'logo_box_bg'  => $s['logo_box_bg']         ?? '#0a0a0a',
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
    $schema    = $seo['schema']      ?? null;
    $robots    = ($s['seo_indexing_enabled'] ?? '1') === '1' ? 'index,follow' : 'noindex,nofollow';
    $customJs  = $s['custom_head_scripts'] ?? '';

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

    <title inertia>{{ $metaTitle }}</title>
    <meta name="description" content="{{ $metaDesc }}">
    <meta name="robots"      content="{{ $robots }}">
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
            --radius:              {{ $t['radius'] }};
            --color-topbar-bg:     {{ $t['topbar_bg'] }};
            --color-navbar-bg:     {{ $t['navbar_bg'] }};
            --color-navbar-text:   {{ $t['navbar_text'] }};
            --color-navbar-border: {{ $t['navbar_border'] }};
            --color-subnav-bg:     {{ $t['subnav_bg'] }};
            --color-logo-box-bg:   {{ $t['logo_box_bg'] }};
        }
        *, *::before, *::after { box-sizing: border-box; }
        html, body { overflow-x: hidden !important; max-width: 100%; width: 100%; margin: 0; padding: 0; }
        body { background: var(--color-body-bg); }
    </style>

    @if($customJs)
        {!! $customJs !!}
    @endif

    @viteReactRefresh
    @vite(['resources/js/app.tsx'])
    @inertiaHead
</head>
<body class="antialiased">
    @if($gtmId)
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id={{ $gtmId }}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    @endif
    @inertia
</body>
</html>
