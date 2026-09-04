import { Head, Link, router } from '@inertiajs/react'
import { IconArrowLeft, IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import { motion } from 'framer-motion'
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

// One tile — swipe right (mobile) or click the right arrow (any device)
// opens that subcategory's shop; swipe left or click the left arrow goes
// back to the Home tiles. The tile itself stays fully clickable too,
// exactly like before — these are additions, not a replacement.
function CategoryTile({ child }: { child: CategoryLite }) {
    // Swipe threshold in px — has to be a deliberate drag, not an
    // accidental brush, before it commits to navigating anywhere.
    const THRESHOLD = 80

    function handleDragEnd(_: unknown, info: { offset: { x: number } }) {
        // Directions were reversed on real touch devices vs. how mouse
        // drag reported it during testing — swapped to match actual
        // on-device behavior rather than the theoretical expectation.
        if (info.offset.x < -THRESHOLD) {
            router.visit(`/category/${child.slug}`)
        } else if (info.offset.x > THRESHOLD) {
            router.visit('/')
        }
    }

    return (
        <motion.div
            className="relative overflow-hidden"
            style={{ height: '100dvh' }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={handleDragEnd}>

            <Link href={`/category/${child.slug}`} className="relative block no-underline overflow-hidden group" style={{ height: '100%' }}>
                <picture>
                    <source media="(min-width: 1024px)" srcSet={child.image ?? '/images/placeholder.jpg'} />
                    <img src={child.mobile_image ?? child.image ?? '/images/placeholder.jpg'} alt={child.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        loading="lazy" draggable={false} />
                </picture>
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(0,0,0,0.65) 0%,rgba(0,0,0,0.05) 55%,transparent 100%)' }} />
                <div style={{ position:'absolute', bottom:32, left:0, right:0, textAlign: 'center' }}>
                    <span style={{ display:'block', color:'#fff', fontSize:'clamp(22px,3vw,30px)', fontWeight:500, letterSpacing: '0.1em' }}>{child.name.toUpperCase()}</span>
                    <span style={{ display:'block', color:'rgba(255,255,255,0.85)', fontSize:12, marginTop:8 }}>Shop the collection →</span>
                </div>
            </Link>

            {/* Centered arrows — vertically centered so they're actually
                noticeable, not tucked in a corner. Work as real click
                targets on desktop; on mobile they double as a visible hint
                that the tile is swipeable in both directions. */}
            <button onClick={() => router.visit('/')}
                aria-label="Back to home"
                className="no-underline"
                style={{ position: 'absolute', top: '50%', left: 16, transform: 'translateY(-50%)', width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', border: 'none', cursor: 'pointer' }}>
                <IconChevronLeft size={20} />
            </button>
            <button onClick={() => router.visit(`/category/${child.slug}`)}
                aria-label={`Shop ${child.name}`}
                className="no-underline"
                style={{ position: 'absolute', top: '50%', right: 16, transform: 'translateY(-50%)', width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', border: 'none', cursor: 'pointer' }}>
                <IconChevronRight size={20} />
            </button>
        </motion.div>
    )
}

// Standalone — same reasoning as Home.tsx: no StorefrontLayout import at
// all, so there is no code path by which a header/nav can render here.
export default function CategoryLanding({ category, children, settings }: Props) {
    return (
        <>
            <Head title={category.name} />

            <div style={{ position: 'relative', zIndex: 5 }}>
                <div style={{ position: 'absolute', top: 20, left: 0, right: 0, textAlign: 'center' }}>
                    <Link href="/" className="no-underline" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        {settings?.logo_url && (
                            <img src={settings.logo_url} alt={settings?.site_name ?? 'Logo'}
                                style={{ height: 'clamp(26px,3.5vw,36px)', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))' }} />
                        )}
                        <span style={{ color: '#fff', fontSize: 'clamp(18px,2.5vw,24px)', fontWeight: 500, letterSpacing: '0.15em', textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
                            {settings?.site_name ?? 'MILLIONAIRE'}
                        </span>
                    </Link>
                </div>
                <Link href="/" className="no-underline flex items-center gap-1.5" style={{ position: 'absolute', top: 22, left: 16, color: '#fff', fontSize: 13, textShadow: '0 2px 6px rgba(0,0,0,0.5)' }}>
                    <IconArrowLeft size={16} />
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2">
                {children.map(child => <CategoryTile key={child.id} child={child} />)}
            </div>
        </>
    )
}
