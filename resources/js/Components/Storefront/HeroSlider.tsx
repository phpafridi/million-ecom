import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from '@inertiajs/react'
import { IconBrandWhatsapp, IconVolumeOff, IconVolume2 } from '@tabler/icons-react'
import { motion, AnimatePresence } from 'framer-motion'

interface HeroSlide {
    id: number; title: string; subtitle?: string; description?: string
    cta_text?: string; cta_url?: string; discount_pct?: number
    image?: string; image_path?: string; video_url?: string
}
interface Props { slides: HeroSlide[]; settings?: Record<string, string> }

const INTERVAL = 5500

export default function HeroSlider({ slides, settings }: Props) {
    const [cur, setCur]    = useState(0)
    const [dir, setDir]    = useState(1)
    const [muted, setMuted] = useState(true)
    const videoRef  = useRef<HTMLVideoElement>(null)
    const timerRef  = useRef<ReturnType<typeof setInterval>>()
    const tsX       = useRef<number | null>(null)
    const tsY       = useRef<number | null>(null)
    const tsLocked  = useRef(false)
    const wa        = settings?.whatsapp_number ?? ''

    const go = useCallback((n: number, d = 1) => {
        clearInterval(timerRef.current)
        setDir(d)
        setCur((n + slides.length) % slides.length)
        timerRef.current = setInterval(() => setCur(c => (c + 1) % slides.length), INTERVAL)
    }, [slides.length])

    useEffect(() => {
        timerRef.current = setInterval(() => setCur(c => (c + 1) % slides.length), INTERVAL)
        return () => clearInterval(timerRef.current)
    }, [slides.length])

    useEffect(() => {
        if (videoRef.current) videoRef.current.muted = muted
    }, [muted, cur])

    function onTouchStart(e: React.TouchEvent) {
        tsX.current     = e.touches[0].clientX
        tsY.current     = e.touches[0].clientY
        tsLocked.current = false
    }
    function onTouchMove(e: React.TouchEvent) {
        if (tsX.current === null || tsY.current === null) return
        const dx = e.touches[0].clientX - tsX.current
        const dy = e.touches[0].clientY - tsY.current
        if (!tsLocked.current && (Math.abs(dx) > 8 || Math.abs(dy) > 8))
            tsLocked.current = Math.abs(dy) > Math.abs(dx)
        if (!tsLocked.current) e.preventDefault()
    }
    function onTouchEnd(e: React.TouchEvent) {
        if (tsX.current === null || tsLocked.current) { tsX.current = null; tsY.current = null; return }
        const dx = e.changedTouches[0].clientX - tsX.current
        tsX.current = null; tsY.current = null
        if (Math.abs(dx) > 50) goTo(dx < 0 ? (cur + 1) % slides.length : (cur - 1 + slides.length) % slides.length)
    }

    if (!slides.length) return (
        <div style={{ width: '100%', height: 400, background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
            No slides — add from Admin → Hero Slides
        </div>
    )

    const s      = slides[cur]
    const imgUrl = s.image ?? (s as any).image_path ?? ''
    const vidUrl = (s as any).video_url ?? ''

    const variants = {
        enter:  (d: number) => ({ x: d > 0 ? '8%' : '-8%', opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit:   (d: number) => ({ x: d > 0 ? '-6%' : '6%', opacity: 0 }),
    }

    const H = 'clamp(260px, 31.2vw, 421px)'

    return (
        <section
            style={{ position: 'relative', width: '100%', height: H, overflow: 'hidden', background: '#080808', display: 'block', touchAction: 'pan-y' }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >

            {/* Background */}
            <AnimatePresence custom={dir} initial={false}>
                <motion.div key={`bg-${cur}`} custom={dir} variants={variants}
                    initial="enter" animate="center" exit="exit"
                    transition={{ duration: 0.75, ease: [0.25, 0.46, 0.45, 0.94] }}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>

                    {vidUrl ? (
                        <video ref={videoRef} src={vidUrl} autoPlay muted={muted} loop playsInline
                            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : imgUrl ? (
                        <motion.img src={imgUrl} alt={s.subtitle ?? s.title}
                            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
                            initial={{ scale: 1 }} animate={{ scale: 1.08 }}
                            transition={{ duration: INTERVAL / 1000, ease: 'linear' }} />
                    ) : (
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #0a0e1a, #1a1f35)' }} />
                    )}

                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(100deg, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.62) 42%, rgba(5,5,5,0.22) 72%, transparent 100%)' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(5,5,5,0.7) 0%, transparent 55%)' }} />
                </motion.div>
            </AnimatePresence>

            {/* Content */}
            <AnimatePresence mode="wait">
                <motion.div key={`c-${cur}`}
                    initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.5, delay: 0.18, ease: 'easeOut' }}
                    style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', paddingLeft: 'clamp(18px,7vw,96px)', paddingRight: 'clamp(18px,7vw,96px)', zIndex: 10 }}>

                    <div style={{ maxWidth: 'min(580px, 80vw)' }}>

                        {/* Label */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 'clamp(10px,1.8vw,20px)' }}>
                            <div style={{ width: 'clamp(22px,3vw,40px)', height: 2, background: 'var(--color-primary)', boxShadow: '0 0 10px var(--color-primary)' }} />
                            <span style={{ color: 'rgba(255,255,255,0.62)', fontWeight: 800, fontSize: 'clamp(8.5px,0.95vw,11px)', letterSpacing: '0.22em', textTransform: 'uppercase' }}>
                                {s.title}
                            </span>
                        </div>

                        {/* Headline */}
                        <h1 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 900, color: '#fff', lineHeight: 1.02, letterSpacing: '-0.025em', margin: '0 0 clamp(8px,1.4vw,16px)', fontSize: 'clamp(26px, 6.2vw, 76px)' }}>
                            {s.subtitle ?? s.title}
                        </h1>

                        {/* Description */}
                        {s.description && (
                            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 'clamp(12.5px,1.35vw,16px)', lineHeight: 1.72, margin: '0 0 clamp(14px,2.2vw,26px)', maxWidth: 420 }}>
                                {s.description.split('\n')[0]}
                            </p>
                        )}

                        {/* Badge */}
                        {(s.discount_pct ?? 0) > 0 && (
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 'clamp(12px,1.8vw,22px)', padding: '6px 16px', borderRadius: 100, border: '1px solid rgba(201,168,76,0.4)', background: 'rgba(201,168,76,0.12)' }}>
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-primary)', display: 'inline-block' }} />
                                <span style={{ color: '#fff', fontWeight: 800, fontSize: 'clamp(10px,1.1vw,12.5px)' }}>Up to {s.discount_pct}% OFF</span>
                            </div>
                        )}

                        {/* Buttons */}
                        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                            <Link href={s.cta_url ?? '/shop'}
                                style={{ display: 'inline-flex', alignItems: 'center', background: 'var(--color-primary)', color: 'var(--color-primary-text, #0a0e1a)', fontWeight: 800, fontSize: 'clamp(11.5px,1.2vw,14px)', letterSpacing: '0.04em', borderRadius: 100, padding: 'clamp(11px,1.3vw,15px) clamp(20px,2.6vw,36px)', textDecoration: 'none', flexShrink: 0, whiteSpace: 'nowrap' }}>
                                {s.cta_text ?? 'Shop Now'}
                            </Link>
                            {wa && settings?.whatsapp_float_enabled !== '1' && (
                                <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer"
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: 7, color: '#fff', fontWeight: 700, fontSize: 'clamp(11px,1.1vw,13px)', border: '1.5px solid rgba(255,255,255,0.25)', borderRadius: 100, padding: 'clamp(10px,1.2vw,14px) clamp(16px,2vw,26px)', textDecoration: 'none', flexShrink: 0, whiteSpace: 'nowrap' }}>
                                    <IconBrandWhatsapp size={15} /> WhatsApp
                                </a>
                            )}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Mute */}
            {vidUrl && (
                <button onClick={() => setMuted(m => !m)}
                    style={{ position: 'absolute', bottom: 'clamp(46px,5vw,58px)', right: 'clamp(12px,2vw,20px)', zIndex: 20, width: 34, height: 34, borderRadius: '50%', background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    {muted ? <IconVolumeOff size={14} /> : <IconVolume2 size={14} />}
                </button>
            )}

            {/* Dots */}
            {slides.length > 1 && (
                <div style={{ position: 'absolute', bottom: 'clamp(14px,2vw,20px)', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, alignItems: 'center', zIndex: 20 }}>
                    {slides.map((_, i) => (
                        <button key={i} onClick={() => go(i, i > cur ? 1 : -1)}
                            style={{ width: i === cur ? 28 : 8, height: 8, borderRadius: 100, background: i === cur ? 'var(--color-primary)' : 'rgba(255,255,255,0.32)', border: 'none', cursor: 'pointer', transition: 'all 0.4s', padding: 0, boxShadow: i === cur ? '0 0 8px var(--color-primary)' : 'none' }} />
                    ))}
                </div>
            )}

            {/* Counter */}
            <div style={{ position: 'absolute', bottom: 'clamp(14px,2vw,20px)', right: 'clamp(16px,2.5vw,26px)', color: 'rgba(255,255,255,0.32)', fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.15em', zIndex: 20 }}>
                {String(cur + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </div>
        </section>
    )
}
