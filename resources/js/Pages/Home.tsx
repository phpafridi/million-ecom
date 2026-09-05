import { useState, useEffect } from 'react'
import { Head, Link } from '@inertiajs/react'
import { IconTruck, IconHeadset } from '@tabler/icons-react'
import { motion } from 'framer-motion'
import type { PageProps } from '@/types'

interface CategoryLite {
    id: number; name: string; slug: string
    image?: string; mobile_image?: string
}

interface Props extends PageProps {
    categories: CategoryLite[]
    settings: Record<string, string>
}

// Deliberately standalone — does NOT use StorefrontLayout at all, so
// there is no code path by which any header/nav component can possibly
// render on this page, regardless of any prop wiring.
export default function Home({ categories, settings }: Props) {
    const tiles = categories.slice(0, 2)

    // Utility cards start expanded with labels (so a first-time visitor
    // actually learns what they are), then collapse to icon-only circles
    // after a few seconds — stays out of the way once the point's made.
    // Clicking either one works identically in both states.
    const [expanded, setExpanded] = useState(true)
    useEffect(() => {
        const t = setTimeout(() => setExpanded(false), 3000)
        return () => clearTimeout(t)
    }, [])

    return (
        <>
            <Head title="Home" />

            <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: 20, left: 0, right: 0, textAlign: 'center', zIndex: 5 }}>
                    <Link href="/" className="no-underline" style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                        {settings?.logo_url && (
                            <img src={settings.logo_url} alt={settings?.site_name ?? 'Logo'}
                                style={{ height: 'clamp(30px,4vw,44px)', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))' }} />
                        )}
                        <span style={{ color: '#fff', fontSize: 'clamp(20px,3vw,28px)', fontWeight: 500, letterSpacing: '0.15em', textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
                            {settings?.site_name ?? 'MILLIONAIRE'}
                        </span>
                    </Link>
                    {settings?.site_tagline && (
                        <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 'clamp(10px,1.3vw,13px)', letterSpacing: '0.2em', marginTop: 8, textShadow: '0 1px 6px rgba(0,0,0,0.4)' }}>
                            {settings.site_tagline.toUpperCase()}
                        </div>
                    )}
                </div>

                {/* Utility cards — Track Order + Support only. Replaces the
                    old 3-item bottom footer-style row entirely; this is
                    the only place these two links live now. */}
                <div style={{ position: 'absolute', top: 20, right: 16, zIndex: 6, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <motion.a href="/track-order" className="no-underline" layout
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                        style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: expanded ? 10 : 999, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: expanded ? '8px 14px' : 0, width: expanded ? 'auto' : 34, height: expanded ? 'auto' : 34, overflow: 'hidden' }}>
                        <IconTruck size={16} style={{ color: '#C9A84C', flexShrink: 0 }} />
                        {expanded && <span style={{ color: '#fff', fontSize: 10, fontWeight: 600, whiteSpace: 'nowrap' }}>Track Order</span>}
                    </motion.a>
                    <motion.a href="/contact" className="no-underline" layout
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                        style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: expanded ? 10 : 999, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: expanded ? '8px 14px' : 0, width: expanded ? 'auto' : 34, height: expanded ? 'auto' : 34, overflow: 'hidden' }}>
                        <IconHeadset size={16} style={{ color: '#C9A84C', flexShrink: 0 }} />
                        {expanded && <span style={{ color: '#fff', fontSize: 10, fontWeight: 600, whiteSpace: 'nowrap' }}>Support 24/7</span>}
                    </motion.a>
                </div>

                <div className="flex flex-col sm:flex-row" style={{ height: '100dvh' }}>
                    {tiles.map(cat => (
                        <Link key={cat.id} href={`/category/${cat.slug}`}
                            className="relative block no-underline overflow-hidden group flex-1"
                            style={{ minHeight: '50dvh' }}>
                            <picture>
                                <source media="(min-width: 640px)" srcSet={cat.image ?? '/images/placeholder.jpg'} />
                                <img src={cat.mobile_image ?? cat.image ?? '/images/placeholder.jpg'} alt={cat.name}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                    loading="lazy" />
                            </picture>
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(0,0,0,0.6) 0%,transparent 50%)' }} />
                            <div style={{ position: 'absolute', bottom: 28, left: 0, right: 0, textAlign: 'center' }}>
                                <span style={{ display: 'block', color: '#fff', fontSize: 'clamp(22px,3vw,30px)', fontWeight: 500, letterSpacing: '0.1em' }}>
                                    {cat.name.toUpperCase()}
                                </span>
                                <span style={{ display: 'block', color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 6 }}>Shop the collection →</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    )
}
