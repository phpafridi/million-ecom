export const IMAGE_SPECS = {
    logo:        { w: 400,  h: 120,  label: 'Logo',               hint: 'Landscape icon+wordmark (or a compact square icon) — transparent PNG, extra padding is auto-trimmed' },
    hero_slide:  { w: 1920, h: 1080, label: 'Hero Slide',         hint: 'Full-width slider background — keep subject centered, edges get cropped per screen size' },
    banner_tall: { w: 1080, h: 1080, label: 'Promo Tall Card (left)', hint: 'This tile is portrait on desktop but landscape on mobile — use a square, centered image so both crops look right' },
    banner_sm:   { w: 900,  h: 540,  label: 'Small Banner',       hint: 'Top-right 2 banners in promo grid — keep subject centered' },
    banner_wide: { w: 1600, h: 450,  label: 'Wide Banner',        hint: 'Bottom-left wide banner in promo grid (desktop only)' },
    category:    { w: 900,  h: 1080, label: 'Category Image',     hint: 'Nearly square, slightly portrait, subject centered — shown as a square on desktop and 3:4 portrait on mobile' },
    product:     { w: 800,  h: 1067, label: 'Product Image',      hint: 'Portrait 3:4 ratio, white/transparent background — matches the product card shape' },
    full_banner: { w: 1920, h: 520,  label: 'Full-Width Banner',  hint: 'Gaming/section full-width banner — keep subject centered' },
} as const
