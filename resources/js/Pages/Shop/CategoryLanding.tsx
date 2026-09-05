import { Head, Link } from '@inertiajs/react'
import { IconChevronLeft } from '@tabler/icons-react'
import type { PageProps } from '@/types'

interface CategoryLite {
    id: number; name: string; slug: string
    image?: string; mobile_image?: string
}

interface Props extends PageProps {
    category: CategoryLite
    children: CategoryLite[]
    settings: Record<string, string>
}

// Rebuilt as a static grid — every subcategory visible at once, no
// scrolling, no swipe gestures. Those made sense for the old full-screen
// one-tile-at-a-time version; a grid doesn't need them. The one thing
// kept from before: a clear way back to the Men/Women home tiles.
export default function CategoryLanding({ category, children, settings }: Props) {
    return (
        <>
            <Head title={category.name} />

            <div style={{ background: settings?.category_page_bg_color || 'var(--color-dark-bg, #0a0a0a)', minHeight: '100dvh', paddingBottom: 24 }}>
                <div style={{ position: 'relative', padding: '20px 16px 16px', background: '#000' }}>
                    <Link href="/" aria-label="Back to home"
                        className="no-underline"
                        style={{ position: 'absolute', top: 16, left: 16, width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                        <IconChevronLeft size={20} />
                    </Link>
                    <div style={{ textAlign: 'center' }}>
                        <Link href="/" className="no-underline" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                            {settings?.logo_url && (
                                <img src={settings.logo_url} alt={settings?.site_name ?? 'Logo'}
                                    style={{ height: 'clamp(24px,3vw,32px)', width: 'auto', objectFit: 'contain' }} />
                            )}
                            <span style={{ color: settings?.category_page_title_color || '#fff', fontSize: 'clamp(15px,2vw,20px)', fontWeight: 500, letterSpacing: '0.15em' }}>
                                {settings?.site_name ?? 'MILLIONAIRE'}
                            </span>
                        </Link>
                        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 6, letterSpacing: '0.1em' }}>
                            {category.name.toUpperCase()}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2" style={{ padding: '4px 12px 0' }}>
                    {children.map(child => (
                        <Link key={child.id} href={`/category/${child.slug}`}
                            className="relative block no-underline overflow-hidden group"
                            style={{ borderRadius: 10, height: 'clamp(140px,20vw,220px)' }}>
                            <picture>
                                <source media="(min-width: 1024px)" srcSet={child.image ?? '/images/placeholder.jpg'} />
                                <img src={child.mobile_image ?? child.image ?? '/images/placeholder.jpg'} alt={child.name}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                                    loading="lazy" />
                            </picture>
                            <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(0,0,0,0.65) 0%,rgba(0,0,0,0.05) 50%,transparent 100%)' }} />
                            <div style={{ position:'absolute', bottom:10, left:0, right:0, textAlign: 'center' }}>
                                <span style={{ display:'block', color:'#fff', fontSize:'clamp(11px,1.4vw,14px)', fontWeight:600, letterSpacing: '0.04em' }}>{child.name.toUpperCase()}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    )
}
