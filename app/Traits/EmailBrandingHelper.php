<?php
namespace App\Traits;

trait EmailBrandingHelper
{
    /**
     * Resolves final email branding from settings, applying the
     * email-specific overrides (email_primary_color, email_accent_color,
     * email_header_title) on top of the site's theme/branding defaults —
     * so admins can make emails look different from the storefront
     * without needing to touch their actual theme.
     */
    protected function emailBranding(array $s): array
    {
        $logoRaw = $s['logo_url'] ?? null;
        $logoUrl = $logoRaw ? (str_starts_with($logoRaw, 'http') ? $logoRaw : url($logoRaw)) : null;
        $showLogo = ($s['email_show_logo'] ?? '1') !== '0';

        return [
            'logoUrl'      => $showLogo ? $logoUrl : null,
            'storeName'    => ($s['email_header_title'] ?? null) ?: ($s['site_name'] ?? 'Our Store'),
            'primaryColor' => ($s['email_primary_color'] ?? null) ?: ($s['theme_dark_bg'] ?? '#0a0a0a'),
            'accentColor'  => ($s['email_accent_color'] ?? null)  ?: ($s['theme_primary'] ?? '#C9A84C'),
            'footerText'   => $s['email_footer_text'] ?? '',
        ];
    }
}
