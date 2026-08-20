import { useRef, useState, useEffect } from 'react'
import { Link } from '@inertiajs/react'
import { IconChevronLeft, IconChevronRight, IconArrowRight } from '@tabler/icons-react'
import ProductCard from './ProductCard'
import { ProductCardSkeleton } from '@/Components/ui/Skeleton'
import type { Product } from '@/types'

interface Props {
    title: string
    eyebrow: string
    viewAllHref?: string
    products: Product[]
    whatsapp?: string
    loading?: boolean
}

export default function ProductScroller({ title, eyebrow, viewAllHref, products, whatsapp, loading }: Props) {
    const scrollerRef = useRef<HTMLDivElement>(null)
    const [canLeft, setCanLeft]   = useState(false)
    const [canRight, setCanRight] = useState(true)

    function updateArrows() {
        const el = scrollerRef.current
        if (!el) return
        setCanLeft(el.scrollLeft > 8)
        setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8)
    }

    useEffect(() => {
        updateArrows()
        const el = scrollerRef.current
        if (!el) return
        el.addEventListener('scroll', updateArrows, { passive: true })
        window.addEventListener('resize', updateArrows)
        return () => {
            el.removeEventListener('scroll', updateArrows)
            window.removeEventListener('resize', updateArrows)
        }
    }, [products])

    function scrollCards(dir: 1 | -1) {
        const el = scrollerRef.current
        if (!el) return
        const card = el.querySelector('[data-card]') as HTMLElement
        const cardW = card ? card.offsetWidth + 12 : 260
        el.scrollBy({ left: dir * cardW * 2, behavior: 'smooth' })
    }

    if (!loading && products.length === 0) return null

    return (
        <section style={{ padding: '20px 0' }}>
            {/* ── Header ── */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: 16, padding: '0 clamp(16px, 4vw, 40px)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                        width: 4, height: 28, borderRadius: 2, flexShrink: 0,
                        background: 'var(--color-primary)',
                        boxShadow: '0 0 8px var(--color-primary)50',
                    }} />
                    <div>
                        <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 2 }}>
                            {eyebrow}
                        </div>
                        <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 900, fontSize: 'clamp(18px, 2.5vw, 26px)', color: 'var(--color-dark-bg)', margin: 0, lineHeight: 1.2 }}>
                            {title}
                        </h2>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    {viewAllHref && (
                        <Link href={viewAllHref}
                            style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12.5, fontWeight: 700, color: 'var(--color-primary)', textDecoration: 'none', marginRight: 4 }}
                            className="hidden sm:flex">
                            View all <IconArrowRight size={14} />
                        </Link>
                    )}
                    {/* Arrows */}
                    {[{ dir: -1 as const, can: canLeft, icon: <IconChevronLeft size={17} /> }, { dir: 1 as const, can: canRight, icon: <IconChevronRight size={17} /> }].map(({ dir, can, icon }) => (
                        <button key={dir} onClick={() => scrollCards(dir)} disabled={!can}
                            style={{
                                width: 36, height: 36, borderRadius: '50%',
                                border: `1.5px solid ${can ? 'var(--color-primary)' : '#e5e7eb'}`,
                                background: can ? 'white' : '#f9fafb',
                                color: can ? 'var(--color-primary)' : '#d1d5db',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: can ? 'pointer' : 'not-allowed',
                                transition: 'all 0.2s', flexShrink: 0,
                            }}>
                            {icon}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Scrollable cards ── */}
            <div
                ref={scrollerRef}
                style={{
                    display: 'flex',
                    gap: 12,
                    overflowX: 'auto',
                    overflowY: 'visible',
                    scrollBehavior: 'smooth',
                    scrollSnapType: 'x proximity',
                    paddingLeft: 'clamp(16px, 4vw, 40px)',
                    paddingRight: 'clamp(16px, 4vw, 40px)',
                    paddingBottom: 8,
                    // Hide scrollbar
                    msOverflowStyle: 'none',
                    scrollbarWidth: 'none',
                } as React.CSSProperties}>

                {loading
                    ? Array(6).fill(0).map((_, i) => (
                        <div key={i} data-card
                            style={{
                                flexShrink: 0,
                                width: 'clamp(160px, 22vw, 260px)',
                                scrollSnapAlign: 'start',
                            }}>
                            <ProductCardSkeleton />
                        </div>
                    ))
                    : products.slice(0, 12).map(p => (
                        <div key={p.id} data-card
                            style={{
                                flexShrink: 0,
                                width: 'clamp(160px, 22vw, 260px)',
                                scrollSnapAlign: 'start',
                            }}>
                            <ProductCard product={p} whatsapp={whatsapp} />
                        </div>
                    ))
                }
            </div>

            {/* Hide scrollbar for webkit */}
            <style>{`
                div::-webkit-scrollbar { display: none; }
            `}</style>
        </section>
    )
}
