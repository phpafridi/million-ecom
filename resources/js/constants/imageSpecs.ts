export const IMAGE_SPECS = {
    logo:        { w: 200,  h: 200,  label: 'Logo',               hint: 'Square PNG with transparent background' },
    hero_slide:  { w: 1400, h: 460,  label: 'Hero Slide',         hint: 'Full-width slider background image' },
    banner_tall: { w: 600,  h: 500,  label: 'Tall Banner (left)', hint: 'Left side tall banner in promo grid' },
    banner_sm:   { w: 600,  h: 200,  label: 'Small Banner',       hint: 'Top-right 2 banners in promo grid' },
    banner_wide: { w: 900,  h: 252,  label: 'Wide Banner',        hint: 'Bottom-left wide banner in promo grid' },
    category:    { w: 300,  h: 300,  label: 'Category Image',     hint: 'Square category thumbnail' },
    product:     { w: 800,  h: 800,  label: 'Product Image',      hint: 'Square, white/transparent background' },
    full_banner: { w: 1400, h: 360,  label: 'Full-Width Banner',  hint: 'Gaming/section full-width banner' },
} as const
