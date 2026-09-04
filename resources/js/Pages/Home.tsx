import { Head, Link } from '@inertiajs/react'
import { IconTruck, IconMapPin, IconHeadset } from '@tabler/icons-react'
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
// render on this page, regardless of any prop wiring. If this still
// shows a nav bar, the cause is not in this project's React code.
export default function Home({ categories, settings }: Props) {
    const tiles = categories.slice(0, 2)

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

            <div className="grid grid-cols-3" style={{ background: '#f7f5f0' }}>
                <Link href="/track-order" className="flex flex-col items-center gap-2 no-underline py-6">
                    <IconTruck size={22} style={{ color: 'var(--color-primary)' }} />
                    <span className="text-[9px] sm:text-[10px] font-bold tracking-wider text-center leading-tight" style={{ color: '#555' }}>ORDER<br />TRACKING</span>
                </Link>
                <Link href="/contact" className="flex flex-col items-center gap-2 no-underline py-6">
                    <IconMapPin size={22} style={{ color: 'var(--color-primary)' }} />
                    <span className="text-[9px] sm:text-[10px] font-bold tracking-wider text-center leading-tight" style={{ color: '#555' }}>STORE<br />LOCATOR</span>
                </Link>
                <Link href="/contact" className="flex flex-col items-center gap-2 no-underline py-6">
                    <IconHeadset size={22} style={{ color: 'var(--color-primary)' }} />
                    <span className="text-[9px] sm:text-[10px] font-bold tracking-wider text-center leading-tight" style={{ color: '#555' }}>SUPPORT<br />24/7</span>
                </Link>
            </div>
        </>
    )
}
