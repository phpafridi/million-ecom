import { useRef, useState, useEffect, useCallback } from 'react'
import { Link } from '@inertiajs/react'
import { IconArrowRight, IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
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

// How many cards visible at once by breakpoint
function getVisible(): number {
    if (typeof window === 'undefined') return 5
    if (window.innerWidth < 480)  return 2
    if (window.innerWidth < 768)  return 3
    if (window.innerWidth < 1024) return 4
    return 5
}

export default function ProductScroller({
    title, eyebrow, viewAllHref, products, whatsapp, loading
}: Props) {
    const trackRef   = useRef<HTMLDivElement>(null)
    const [index,    setIndex]   = useState(0)          // current left-most card index
    const [visible,  setVisible] = useState(getVisible)
    const [cardW,    setCardW]   = useState(0)          // px width of one card incl gap
    const GAP = 12

    // Touch tracking
    const tx0     = useRef<number | null>(null)
    const ty0     = useRef<number | null>(null)
    const locked  = useRef(false)   // true = vertical scroll won

    const items = loading ? Array(10).fill(null) : products.slice(0, 20)
    const max   = Math.max(0, items.length - visible)   // max index

    // ── Measure card width whenever layout changes ──────────────────
    function measure() {
        const track = trackRef.current
        if (!track) return
        const firstCard = track.firstElementChild as HTMLElement | null
        if (!firstCard) return
        setCardW(firstCard.offsetWidth + GAP)
    }

    useEffect(() => {
        measure()
        const obs = new ResizeObserver(measure)
        if (trackRef.current) obs.observe(trackRef.current)
        return () => obs.disconnect()
    }, [items.length, visible])

    useEffect(() => {
        const fn = () => {
            setVisible(getVisible())
            setIndex(0)
        }
        window.addEventListener('resize', fn, { passive: true })
        return () => window.removeEventListener('resize', fn)
    }, [])

    // ── Slide to index ───────────────────────────────────────────────
    const slideTo = useCallback((i: number, animate = true) => {
        const clamped = Math.max(0, Math.min(max, i))
        const track   = trackRef.current
        if (!track) return
        track.style.transition = animate
            ? 'transform 0.36s cubic-bezier(0.25,0.46,0.45,0.94)'
            : 'none'
        track.style.transform = `translateX(${-clamped * cardW}px)`
        setIndex(clamped)
    }, [cardW, max])

    // Keep track in sync when cardW or max change (e.g. resize)
    useEffect(() => {
        slideTo(Math.min(index, max), false)
    }, [cardW, max])

    // ── Touch handlers ───────────────────────────────────────────────
    function onTouchStart(e: React.TouchEvent) {
        tx0.current  = e.touches[0].clientX
        ty0.current  = e.touches[0].clientY
        locked.current = false
        // Pause transition so it follows finger
        if (trackRef.current) trackRef.current.style.transition = 'none'
    }

    function onTouchMove(e: React.TouchEvent) {
        if (tx0.current === null || ty0.current === null) return
        const dx = e.touches[0].clientX - tx0.current
        const dy = e.touches[0].clientY - ty0.current
        // Determine axis on first move
        if (!locked.current && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
            locked.current = Math.abs(dy) > Math.abs(dx) // vertical wins
        }
        if (locked.current) return
        e.preventDefault()
        const track = trackRef.current
        if (!track || cardW === 0) return
        track.style.transform = `translateX(${-index * cardW + dx}px)`
    }

    function onTouchEnd(e: React.TouchEvent) {
        if (tx0.current === null || locked.current) {
            tx0.current = null; ty0.current = null; return
        }
        const dx = e.changedTouches[0].clientX - tx0.current
        tx0.current = null; ty0.current = null
        // Swipe threshold: 60px or 30% of card width
        const threshold = Math.min(60, cardW * 0.3)
        if      (dx < -threshold) slideTo(index + 1)
        else if (dx >  threshold) slideTo(index - 1)
        else                      slideTo(index)        // snap back
    }

    if (!loading && products.length === 0) return null

    const pad      = 'clamp(16px,5vw,48px)'
    const canLeft  = index > 0
    const canRight = index < max

    // Dot pages (one dot per visible-width window)
    const totalDots = Math.ceil(items.length / visible)
    const activeDot = Math.round(index / visible)

    return (
        <section style={{ padding:'32px 0', width:'100%', boxSizing:'border-box' }}>

            {/* Header */}
            <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', padding:`0 ${pad}`, marginBottom:22 }}>
                <div>
                    <p style={{ fontSize:11, fontWeight:800, color:'var(--color-primary)', textTransform:'uppercase', letterSpacing:'0.12em', margin:'0 0 4px' }}>
                        {eyebrow}
                    </p>
                    <h2 style={{ fontSize:'clamp(20px,3vw,26px)', fontWeight:900, color:'#111', margin:0, fontFamily:'Manrope,sans-serif', lineHeight:1.1 }}>
                        {title}
                    </h2>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    {viewAllHref && (
                        <Link href={viewAllHref}
                            style={{ display:'flex', alignItems:'center', gap:5, fontSize:13, fontWeight:700, color:'#111', textDecoration:'none', whiteSpace:'nowrap' }}>
                            View all <IconArrowRight size={15}/>
                        </Link>
                    )}
                    {/* Arrow buttons */}
                    <div style={{ display:'flex', gap:6 }}>
                        {([[-1, canLeft],[1, canRight]] as [number,boolean][]).map(([d, can]) => (
                            <button key={d} onClick={() => slideTo(index + (d as number))}
                                style={{
                                    width:36, height:36, borderRadius:'50%',
                                    border:`1.5px solid ${can?'#111':'#E5E7EB'}`,
                                    background: can?'#111':'white',
                                    color: can?'white':'#D1D5DB',
                                    display:'flex', alignItems:'center', justifyContent:'center',
                                    cursor: can?'pointer':'default',
                                    transition:'all 0.2s',
                                    flexShrink: 0,
                                }}>
                                {d === -1 ? <IconChevronLeft size={16}/> : <IconChevronRight size={16}/>}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Cards track — overflow hidden wrapper */}
            <div
                style={{ padding:`0 ${pad}`, overflow:'hidden', touchAction:'pan-y' }}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                {/*
                    Single flat row of ALL cards.
                    Each card = (wrapper_width - (visible-1)*gap) / visible wide.
                    We slide by cardW px per arrow click / swipe.
                */}
                <div
                    ref={trackRef}
                    style={{
                        display: 'flex',
                        gap: GAP,
                        willChange: 'transform',
                        // width is auto — each child has fixed width
                    }}
                >
                    {items.map((p, i) => (
                        <div key={(p as any)?.id ?? i}
                            style={{
                                // Each card occupies exactly 1/visible of the wrapper
                                // We use calc so it's responsive
                                flexShrink: 0,
                                width: `calc((100% - ${(visible - 1) * GAP}px) / ${visible})`,
                            }}>
                            {loading || !p
                                ? <ProductCardSkeleton />
                                : <ProductCard product={p as Product} whatsapp={whatsapp} />
                            }
                        </div>
                    ))}
                </div>
            </div>

            {/* Dot indicators */}
            {totalDots > 1 && (
                <div style={{ display:'flex', justifyContent:'center', gap:6, marginTop:20 }}>
                    {Array(totalDots).fill(0).map((_,i) => (
                        <button key={i}
                            onClick={() => slideTo(i * visible)}
                            style={{
                                width: i===activeDot ? 24 : 8,
                                height: 8, borderRadius:100,
                                background: i===activeDot ? 'var(--color-primary)' : '#D1D5DB',
                                border:'none', cursor:'pointer',
                                transition:'all 0.3s', padding:0,
                            }}
                        />
                    ))}
                </div>
            )}
        </section>
    )
}
