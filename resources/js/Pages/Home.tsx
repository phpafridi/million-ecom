import { Head, Link } from '@inertiajs/react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { IconArrowRight, IconCircleCheck, IconBrandWhatsapp } from '@tabler/icons-react'
import StorefrontLayout from '@/Layouts/StorefrontLayout'
import HeroSlider from '@/Components/Storefront/HeroSlider'
import ProductScroller from '@/Components/Storefront/ProductScroller'
import { CategorySkeleton } from '@/Components/ui/Skeleton'
import type { Product, Category, HeroSlide, PageProps } from '@/types'

interface Props extends PageProps {
    heroSlides: HeroSlide[]
    featuredProducts: Product[]
    onSaleProducts: Product[]
    topRatedProducts: Product[]
    newProducts: Product[]
    categories: Category[]
    topCategories: Category[]
    categoryProducts: Record<string, Product[]>
    banners: Record<string, any>
    settings: Record<string, string>
}

const TABS = [
    { key: 'featured', label: 'Featured' },
    { key: 'sale',     label: 'On Sale' },
    { key: 'top',      label: 'Top Rated' },
]

function SectionHeader({ eyebrow, title, viewAll }: { eyebrow: string; title: string; viewAll?: string }) {
    return (
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
                <div className="w-1 h-6 sm:h-7 bg-[var(--color-primary,#00c8ff)] rounded-sm flex-shrink-0" style={{ boxShadow: '0 0 8px rgba(0,200,255,0.4)' }} />
                <div>
                    <div className="text-[10px] sm:text-[11px] font-bold text-[var(--color-primary,#00c8ff)] uppercase tracking-[.12em]">{eyebrow}</div>
                    <h2 className="font-manrope font-black text-[18px] sm:text-[21px] text-gray-900 tracking-tight leading-snug">{title}</h2>
                </div>
            </div>
            {viewAll && (
                <Link href={viewAll} className="text-[12px] sm:text-[12.5px] font-bold text-[var(--color-primary,#00c8ff)] flex items-center gap-1 no-underline flex-shrink-0">
                    View all <IconArrowRight size={14} />
                </Link>
            )}
        </div>
    )
}

function CatDots({ total }: { total: number }) {
    const [active, setActive] = useState(0)
    const pages = Math.ceil(total / 2)
    useEffect(() => {
        const track = document.getElementById('ml-cat-track')
        if (!track) return
        const iv = setInterval(() => {
            if (track.dataset.touching === '1') return
            setActive(p => {
                const next = (p + 1) % pages
                const w = track.scrollWidth / total
                track.scrollTo({ left: next * 2 * w, behavior: 'smooth' })
                return next
            })
        }, 3000)
        const onScroll = () => {
            const w = track.scrollWidth / total
            setActive(Math.min(Math.round(track.scrollLeft / (w * 2)), pages - 1))
        }
        track.addEventListener('scroll', onScroll, { passive: true })
        return () => { clearInterval(iv); track.removeEventListener('scroll', onScroll) }
    }, [total, pages])
    return (
        <div style={{ display:'flex', justifyContent:'center', gap:6, marginTop:10 }}>
            {Array(pages).fill(0).map((_,i) => (
                <button key={i}
                    onClick={() => {
                        const track = document.getElementById('ml-cat-track')
                        if (!track) return
                        const w = track.scrollWidth / total
                        track.scrollTo({ left: i * 2 * w, behavior: 'smooth' })
                        setActive(i)
                    }}
                    style={{ width:i===active?22:7, height:7, borderRadius:100, background:i===active?'var(--color-primary)':'#D1D5DB', border:'none', cursor:'pointer', padding:0, transition:'all 0.3s' }}
                />
            ))}
        </div>
    )
}

export default function Home({ heroSlides, featuredProducts, onSaleProducts, topRatedProducts, newProducts, categories, topCategories, categoryProducts, banners, settings, auth }: Props) {
    const [tab, setTab] = useState('featured')
    const [loaded, setLoaded] = useState(false)
    const whatsapp = settings?.whatsapp_number ?? ''
    const dividerText = settings?.home_divider_text ?? 'Fresh Drops Meet Fan Favorites'

    // Trust bar — fully editable from Admin → Settings
    const TRUST = [1,2,3,4,5].map(n => ({
        icon:  settings?.[`trust_${n}_icon`]  || ['🚚','🛡️','↩️','🎧','💬'][n-1],
        title: settings?.[`trust_${n}_title`] || ['Free Delivery','100% Genuine','Easy Returns','24/7 Support','WhatsApp Us'][n-1],
        sub:   settings?.[`trust_${n}_sub`]   || ['On qualifying orders','Verified products only','7-day hassle-free','We are here to help','Quick response'][n-1],
    }))

    // Ticker — editable from Admin → Settings (pipe-separated)
    const TICKER = settings?.ticker_items
        ? settings.ticker_items.split('|').map((s: string) => s.trim()).filter(Boolean)
        : ['Free shipping available','7-day easy returns','Verified sellers','Secure payments','24/7 support']

    useEffect(() => { const t = setTimeout(() => setLoaded(true), 350); return () => clearTimeout(t) }, [])

    const b = (pos: string) => banners[pos]

    const productSets: Record<string, Product[]> = {
        featured: featuredProducts, sale: onSaleProducts, top: topRatedProducts, new: newProducts,
    }

    return (
        <StorefrontLayout auth={auth} settings={settings}>
            <Head title="Home" />

            <HeroSlider slides={heroSlides} />

            {/* TRUST BAR — 2 items mobile, 4 desktop */}
            <div style={{ background: settings?.trust_bar_bg || 'var(--color-dark-bg,#0a0a0a)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex lg:hidden">
                    {TRUST.slice(0,2).map((t, i) => (
                        <div key={i} className="flex flex-1 items-center gap-2.5 px-4 py-3"
                            style={{ borderRight: i===0 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                            <div className="w-8 h-8 rounded-[9px] flex items-center justify-center flex-shrink-0 text-[15px]"
                                style={{ background:(settings?.trust_icon_color||'var(--color-primary)')+'20', border:'1px solid '+(settings?.trust_icon_color||'var(--color-primary)')+'35' }}>
                                {t.icon}
                            </div>
                            <div className="min-w-0">
                                <div className="text-[11px] font-bold leading-tight text-white truncate">{t.title}</div>
                                <div className="text-[10px] mt-0.5 truncate" style={{ color:'rgba(255,255,255,0.45)' }}>{t.sub}</div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="hidden lg:grid lg:grid-cols-4">
                    {TRUST.slice(0,4).map((t, i) => (
                        <div key={i} className="flex items-center gap-3 px-5 py-4"
                            style={{ borderRight: i<3 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
                            <div className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0 text-base"
                                style={{ background:(settings?.trust_icon_color||'var(--color-primary)')+'18', border:'1px solid '+(settings?.trust_icon_color||'var(--color-primary)')+'30' }}>
                                {t.icon}
                            </div>
                            <div className="min-w-0">
                                <div className="text-[12px] font-bold leading-tight truncate" style={{ color:settings?.trust_title_color||'#fff' }}>{t.title}</div>
                                <div className="text-[10.5px] mt-0.5 truncate" style={{ color:settings?.trust_sub_color||'rgba(255,255,255,0.45)' }}>{t.sub}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* TICKER */}
            <div className="border-b border-gray-100 flex items-center overflow-hidden" style={{ height:36, background:settings?.ticker_bg||'#fff' }}>
                <div className="flex-shrink-0 flex items-center gap-1.5 px-3 h-full"
                    style={{ background:settings?.ticker_live_bg||'var(--color-primary)', color:settings?.ticker_live_text||'#0a0a0a', borderRight:'1px solid rgba(0,0,0,0.1)', minWidth:62, justifyContent:'center' }}>
                    <span style={{ width:6, height:6, borderRadius:'50%', background:'currentColor', flexShrink:0, animation:'mlLiveDot 1.4s ease-in-out infinite' }} />
                    <span style={{ fontSize:10, fontWeight:900, letterSpacing:'0.1em' }}>LIVE</span>
                </div>
                <div className="flex-1 min-w-0 overflow-hidden"
                    style={{ WebkitMaskImage:'linear-gradient(to right,transparent,black 40px,black calc(100% - 30px),transparent)', maskImage:'linear-gradient(to right,transparent,black 40px,black calc(100% - 30px),transparent)' }}>
                    <div style={{ display:'flex', width:'max-content', animation:'mlTickerScroll 30s linear infinite', willChange:'transform' }}>
                        {[...TICKER, ...TICKER].map((item, i) => (
                            <span key={i} style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'0 22px', whiteSpace:'nowrap', fontSize:11.5, fontWeight:500, color:'#555' }}>
                                <span style={{ width:4, height:4, borderRadius:'50%', background:'var(--color-primary)', flexShrink:0 }} />
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
                <style>{`@keyframes mlTickerScroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}@keyframes mlLiveDot{0%,100%{opacity:1}50%{opacity:0.2}}`}</style>
            </div>

            {/* CATEGORIES — swipe carousel on mobile, grid on desktop */}
            <section className="py-5 sm:py-6">
                <div className="px-4 sm:px-6 lg:px-10">
                    <SectionHeader eyebrow="Shop by" title="All Categories" viewAll="/shop" />
                </div>
                {/* Mobile swipe — touch-aware auto scroll */}
                <div className="lg:hidden">
                    <div id="ml-cat-track"
                        style={{ display:'flex', gap:12, padding:'0 16px 4px', overflowX:'auto', scrollSnapType:'x mandatory', WebkitOverflowScrolling:'touch', scrollbarWidth:'none', scrollBehavior:'smooth' }}
                        onTouchStart={() => { const el=document.getElementById('ml-cat-track'); if(el) el.dataset.touching='1' }}
                        onTouchEnd={()   => { const el=document.getElementById('ml-cat-track'); if(el) setTimeout(()=>{ el.dataset.touching='0' }, 800) }}>
                        {!loaded
                            ? Array(8).fill(0).map((_,i)=>(
                                <div key={i} className="flex-shrink-0 animate-pulse"
                                    style={{ width:'calc(50% - 6px)', scrollSnapAlign:'start' }}>
                                    <div className="bg-gray-200 rounded-[18px] w-full" style={{ aspectRatio:'1/1' }} />
                                </div>
                            ))
                            : categories.slice(0,8).map(cat=>(
                                <Link key={cat.id} href={`/shop?category=${cat.slug}`}
                                    className="no-underline flex-shrink-0 block"
                                    style={{ width:'calc(50% - 6px)', scrollSnapAlign:'start' }}>
                                    <div className="relative overflow-hidden rounded-[18px] w-full" style={{ aspectRatio:'1/1' }}>
                                        <img src={cat.mobile_image ?? cat.image ?? '/images/placeholder.jpg'} alt={cat.name}
                                            className="w-full h-full object-cover block" style={{ objectPosition: 'center 20%' }} loading="lazy" />
                                        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(0,0,0,0.75) 0%,rgba(0,0,0,0.05) 55%,transparent 100%)' }} />
                                        <span style={{ position:'absolute', bottom:0, left:0, right:0, padding:'10px 12px', color:'white', fontSize:13, fontWeight:700, lineHeight:1.2 }}>
                                            {cat.name}
                                        </span>
                                    </div>
                                </Link>
                            ))
                        }
                    </div>
                    <CatDots total={Math.min(categories.length,8)} />
                    <style>{`#ml-cat-track::-webkit-scrollbar{display:none}`}</style>
                </div>
                {/* Desktop grid */}
                <div className="hidden lg:grid lg:grid-cols-6 gap-4 px-10">
                    {!loaded
                        ? Array(6).fill(0).map((_,i)=><CategorySkeleton key={i} />)
                        : categories.slice(0,8).map((cat,i)=>(
                            <motion.div key={cat.id} initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} transition={{ delay:i*0.04 }}>
                                <Link href={`/shop?category=${cat.slug}`}
                                    className="bg-white rounded-[16px] border border-gray-200 overflow-hidden text-center no-underline block transition-all hover:border-[var(--color-primary)] hover:-translate-y-1 hover:shadow-[0_6px_20px_rgba(0,0,0,0.10)]">
                                    <img src={cat.image??'/images/placeholder.jpg'} alt={cat.name} className="w-full aspect-square object-cover block" style={{ objectPosition: 'center 20%' }} loading="lazy" />
                                    <span className="block text-[13px] font-bold text-gray-900 py-3 px-2 truncate">{cat.name}</span>
                                </Link>
                            </motion.div>
                        ))
                    }
                </div>
            </section>


            {/* ═══════════════════════════════════════════════════════════════
                DESKTOP BANNER GRID — only visible on screens ≥ 768px
                Uses desktop images. Completely separate from mobile.
            ════════════════════════════════════════════════════════════════ */}
            <motion.section className="hidden md:block px-4 sm:px-6 lg:px-10 pb-5 sm:pb-6"
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>

                {/* Full-Width Hero — desktop only, sits above the 4-card grid */}
                {b('full_hero') && (
                    <Link href={b('full_hero').link ?? '/shop'}
                        className="relative block rounded-[18px] overflow-hidden no-underline group mb-3"
                        style={{ height: 'clamp(220px, 32vw, 380px)' }}>
                        <img src={b('full_hero').image ?? '/images/placeholder.jpg'} alt={b('full_hero').title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" loading="lazy" />
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(7,11,20,0.15) 0%, rgba(7,11,20,0.55) 100%)' }} />
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                            {b('full_hero').subtitle && (
                                <span className="text-[12px] font-bold text-white/70 uppercase tracking-[.2em] mb-2">{b('full_hero').subtitle}</span>
                            )}
                            <h2 className="font-manrope font-black text-white leading-[1.05] tracking-tight mb-1" style={{ fontSize: 'clamp(22px, 4.5vw, 40px)' }}>
                                {b('full_hero').title}
                            </h2>
                            {b('full_hero').cta_text && (
                                <span className="mt-4 inline-flex items-center bg-white text-[var(--color-dark-bg,#0a0e1a)] font-black rounded-full" style={{ fontSize: 13, padding: '12px 28px' }}>
                                    {b('full_hero').cta_text}
                                </span>
                            )}
                        </div>
                    </Link>
                )}

                <div style={{ display:'grid', gap:12, gridTemplateColumns:'340px 1fr', gridTemplateRows:'220px 228px' }}>
                    {/* LEFT TALL CARD — use banner position 'promo' from Admin → Banners */}
                    {(() => {
                        const promo = b('promo') ?? b('featured') ?? (Object.keys(banners).length > 0 ? banners[Object.keys(banners)[0]] : null)
                        if (!promo) return (
                            <div style={{ gridColumn: 1, gridRow: '1 / 3', borderRadius: 18, overflow: 'hidden', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 12, textAlign: 'center', padding: 24 }}>
                                <div><div style={{fontSize:32,marginBottom:8}}>🖼️</div>Add a banner with position "promo" in<br/>Admin → Banners</div>
                            </div>
                        )
                        return (
                            <Link href={promo.link ?? '/shop'}
                                style={{ gridColumn: 1, gridRow: '1 / 3', position: 'relative', borderRadius: 18, overflow: 'hidden', display: 'block', textDecoration: 'none', background: 'var(--color-dark-bg,#0a0e1a)' }}>
                                {promo.video ? (
                                    <video autoPlay muted loop playsInline style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }}>
                                        <source src={promo.video} type="video/mp4"/>
                                    </video>
                                ) : promo.image ? (
                                    <img src={promo.image} alt={promo.title ?? ''} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }}/>
                                ) : null}
                                <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.2), transparent)' }}/>
                                <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:20, zIndex:5 }}>
                                    {promo.subtitle && <div style={{ fontSize:9.5, color:'var(--color-primary)', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', marginBottom:4 }}>{promo.subtitle}</div>}
                                    <div style={{ fontFamily:'Manrope,sans-serif', fontWeight:900, fontSize:19, color:'#fff', lineHeight:1.2, marginBottom:promo.cta_text?12:0 }}>{promo.title}</div>
                                    {promo.cta_text && <span style={{ display:'inline-flex', alignItems:'center', gap:7, background:'var(--color-primary)', color:'var(--color-primary-text,#0a0a0a)', fontSize:12, fontWeight:800, padding:'10px 16px', borderRadius:100 }}>{promo.cta_text}</span>}
                                </div>
                            </Link>
                        )
                    })()}

                    <div style={{ gridColumn: 2, gridRow: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        {(['small_top_1', 'small_top_2'] as const).map(pos => b(pos) && (
                            <Link key={pos} href={b(pos).link ?? '/shop'}
                                style={{ position: 'relative', borderRadius: 15, overflow: 'hidden', display: 'block', textDecoration: 'none', height: '100%', background: '#0a0e1a' }}
                                className="group cursor-pointer">
                                {b(pos).video ? (
                                    <video autoPlay muted loop playsInline
                                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .5s' }}
                                        className="group-hover:scale-[1.04]">
                                        <source src={b(pos).video} type="video/mp4" />
                                    </video>
                                ) : (
                                    <img src={b(pos).image ?? '/images/placeholder.jpg'} alt={b(pos).title}
                                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .5s' }}
                                        className="group-hover:scale-[1.04]" />
                                )}
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, rgba(7,11,20,0.82))' }} />
                                <div style={{ position: 'absolute', bottom: 14, left: 14, right: 14, zIndex: 10 }}>
                                    {b(pos).subtitle && <div style={{ fontSize: 9.5, color: 'var(--color-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 4 }}>{b(pos).subtitle}</div>}
                                    <h3 style={{ fontFamily: 'Manrope,sans-serif', fontWeight: 900, fontSize: 15, color: '#fff', lineHeight: 1.2, marginBottom: 8 }}>{b(pos).title}</h3>
                                    <span style={{ display: 'inline-flex', background: '#fff', color: 'var(--color-dark-bg, #0a0e1a)', fontSize: 11, fontWeight: 800, padding: '5px 12px', borderRadius: 100 }}>{b(pos).cta_text}</span>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div style={{ gridColumn: 2, gridRow: 2, position: 'relative', borderRadius: 15, overflow: 'hidden', cursor: 'pointer', background: '#0a0e1a' }} className="group">
                        {b('wide_bottom') ? (
                            <>
                                {b('wide_bottom').video ? (
                                    <video autoPlay muted loop playsInline
                                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .5s' }}
                                        className="group-hover:scale-[1.03]">
                                        <source src={b('wide_bottom').video} type="video/mp4" />
                                    </video>
                                ) : (
                                    <img src={b('wide_bottom').image ?? '/images/placeholder.jpg'} alt={b('wide_bottom').title}
                                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .5s' }}
                                        className="group-hover:scale-[1.03]" />
                                )}
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(7,11,20,0.88), rgba(7,11,20,0.4), transparent)' }} />
                                <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: 20, zIndex: 10, maxWidth: 300 }}>
                                    {b('wide_bottom').subtitle && <div style={{ fontSize: 9.5, color: 'var(--color-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>{b('wide_bottom').subtitle}</div>}
                                    <h3 style={{ fontFamily: 'Manrope,sans-serif', fontWeight: 900, fontSize: 20, color: '#fff', lineHeight: 1.15, marginBottom: 12 }}>{b('wide_bottom').title}</h3>
                                    <Link href={b('wide_bottom').link ?? '/shop'} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--color-primary)', color: 'var(--color-dark-bg, #0a0e1a)', fontSize: 12, fontWeight: 800, padding: '8px 16px', borderRadius: 100, textDecoration: 'none' }}>{b('wide_bottom').cta_text}</Link>
                                </div>
                            </>
                        ) : <div className="w-full h-full bg-gray-200 animate-pulse" />}
                    </div>
                </div>
            </motion.section>

            {/* ═══════════════════════════════════════════════════════════════
                MOBILE BANNER CARDS — only visible on screens < 768px
                3 cards: 1 full-width top + 2 side by side below.
                Uses mobile_image (square). Completely separate from desktop.
            ════════════════════════════════════════════════════════════════ */}
            <motion.section className="md:hidden px-4 pb-4 space-y-3"
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>

                {/* All 3 banners — full width, stacked one per row, same fixed
                    aspect ratio so every card is visibly the same size
                    regardless of what shape each source image happens to be. */}
                {(['full_hero', 'promo', 'small_top_1'] as const).map(pos => b(pos) && (
                    <Link key={pos} href={b(pos).link ?? '/shop'} className="block rounded-[16px] overflow-hidden no-underline relative"
                        style={{ aspectRatio: '16/9', background: '#f1f1f1' }}>
                        {b(pos).video
                            ? <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover"><source src={b(pos).video} type="video/mp4"/></video>
                            : <img src={b(pos).mobile_image ?? b(pos).image ?? ''} alt={b(pos).title ?? ''} className="absolute inset-0 w-full h-full object-cover"/>
                        }
                    </Link>
                ))}

            </motion.section>

            {/* NEW ARRIVALS — shown ahead of Featured so fresh stock gets first visibility */}
            <ProductScroller
                eyebrow="Just Landed"
                title="New Arrivals"
                viewAllHref="/shop?sort=newest"
                products={newProducts}
                whatsapp={whatsapp}
                loading={!loaded}
            />

            {/* ── Section divider — separates New Arrivals from Featured without
                needing a banner image. Pure CSS, auto-matches the active theme.
                Text is admin-configurable (Branding → Section Divider Text). ── */}
            <div className="px-4 sm:px-6 lg:px-10 my-8 sm:my-10">
                <div className="flex items-center gap-3 sm:gap-5 max-w-[1400px] mx-auto">
                    <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, var(--color-primary, #C9A84C) 60%, var(--color-primary, #C9A84C))' }} />
                    <div className="relative flex-shrink-0">
                        <div className="absolute inset-0 rounded-full blur-md opacity-40" style={{ background: 'var(--color-primary, #C9A84C)' }} />
                        <div className="relative flex items-center gap-2.5 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full shadow-lg"
                            style={{ background: 'linear-gradient(135deg, var(--color-primary, #C9A84C), var(--color-primary-dark, #B8973B))' }}>
                            <span className="text-[15px] sm:text-[17px]" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.15))' }}>✨</span>
                            <span className="font-manrope font-black text-[11px] sm:text-[13px] uppercase tracking-[0.12em] whitespace-nowrap"
                                style={{ color: 'var(--color-primary-text, #0a0a0a)' }}>
                                {dividerText}
                            </span>
                            <span className="text-[15px] sm:text-[17px]" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.15))' }}>✨</span>
                        </div>
                    </div>
                    <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, var(--color-primary, #C9A84C) 60%, var(--color-primary, #C9A84C))' }} />
                </div>
            </div>

            {/* FEATURED — horizontal scroller with tabs */}
            <section className="px-4 sm:px-6 lg:px-10 pb-1">
                <div className="flex flex-wrap items-end justify-between gap-3 mb-2">
                    <div className="flex bg-gray-100 rounded-[10px] p-1 gap-0.5">
                        {TABS.map(t => (
                            <button key={t.key} onClick={() => setTab(t.key)}
                                className={`px-2.5 sm:px-3.5 py-1.5 rounded-[8px] text-[11px] sm:text-[12px] font-semibold transition-all border-none cursor-pointer
                                    ${tab === t.key ? 'bg-white text-[var(--color-primary,#00c8ff)] shadow-sm' : 'text-gray-500 bg-transparent'}`}>
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>
            <ProductScroller
                eyebrow="Most Wanted"
                title="Featured Products"
                viewAllHref="/shop"
                products={productSets[tab] ?? []}
                whatsapp={whatsapp}
                loading={!loaded}
            />

            {/* CATEGORY SECTIONS — banner FIRST, then products */}
            {(topCategories ?? categories).map((cat, i) => (
                <div key={cat.id}>
                    {/* Category banner shown BEFORE the product list */}
                    {cat.banner_image && (
                        <motion.section className="px-4 sm:px-6 lg:px-10 pb-4 sm:pb-5"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-60px' }}
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
                            <Link href={`/shop?category=${cat.slug}`}
                                className="relative block rounded-[16px] sm:rounded-[18px] overflow-hidden no-underline group"
                                style={{ height: 'clamp(160px, 22vw, 260px)' }}>
                                {/* Mobile uses mobile_banner_image if set, desktop always uses banner_image */}
                                <img src={cat.banner_image} alt={cat.name}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03] hidden sm:block" loading="lazy" />
                                <img src={cat.mobile_banner_image ?? cat.banner_image} alt={cat.name}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03] sm:hidden"
                                    style={{ objectPosition: 'center 30%' }} loading="lazy" />
                                <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(7,11,20,0.78) 0%, rgba(7,11,20,0.3) 55%, transparent)' }} />
                                <div className="absolute top-1/2 -translate-y-1/2 left-5 sm:left-10 z-10">
                                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[.16em] mb-1.5 block" style={{ color: 'var(--color-primary)' }}>{cat.name}</span>
                                    <h3 className="font-manrope font-black text-white leading-[1.1] tracking-tight"
                                        style={{ fontSize: 'clamp(20px, 3vw, 32px)' }}>
                                        {cat.description || `Shop ${cat.name}`}
                                    </h3>
                                    <div className="mt-3 inline-flex items-center gap-2 text-[12px] font-bold text-white/80 border border-white/30 rounded-full px-3 py-1">
                                        View Collection →
                                    </div>
                                </div>
                            </Link>
                        </motion.section>
                    )}

                    {/* Products scroller for this category */}
                    <ProductScroller
                        eyebrow="Shop"
                        title={cat.name}
                        viewAllHref={`/shop?category=${cat.slug}`}
                        products={categoryProducts[cat.slug] ?? []}
                        whatsapp={whatsapp}
                        loading={!loaded}
                    />
                </div>
            ))}

            {/* 3-COL PROMO BANNERS */}
            {['promo_1','promo_2','promo_3'].some(p => b(p)) && (
                <motion.div className="grid grid-cols-1 sm:grid-cols-3 gap-3 px-4 sm:px-6 lg:px-10 pb-5 sm:pb-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
                    {(['promo_1','promo_2','promo_3'] as const).map(pos => b(pos) && (
                        <Link key={pos} href={b(pos).link ?? '/shop'} className="relative rounded-[16px] overflow-hidden group block no-underline" style={{ height: 190 }}>
                            <img src={b(pos).image ?? '/images/placeholder.jpg'} alt={b(pos).title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05] absolute inset-0" />
                            <div className="absolute inset-0" style={{ background: 'linear-gradient(120deg, rgba(7,11,20,0.88) 25%, rgba(7,11,20,0.4) 65%, transparent)' }} />
                            <div className="absolute left-4 sm:left-5 bottom-4 sm:bottom-5 z-10">
                                {b(pos).subtitle && <div className="text-[9.5px] text-[var(--color-primary,#00c8ff)] font-bold uppercase tracking-[.1em] mb-1.5">{b(pos).subtitle}</div>}
                                <h3 className="font-manrope font-black text-[16px] sm:text-[18px] text-white leading-[1.2] mb-2.5">{b(pos).title}</h3>
                                <span className="inline-flex items-center gap-1.5 bg-[var(--color-primary,#00c8ff)] text-[var(--color-dark-bg,#0a0e1a)] text-[11px] sm:text-[11.5px] font-black px-3 sm:px-3.5 py-1.5 rounded-full">
                                    {b(pos).cta_text} <IconArrowRight size={12} />
                                </span>
                            </div>
                        </Link>
                    ))}
                </motion.div>
            )}

            {/* BRANDS */}
            {settings?.brands_show !== '0' && (
            <motion.section className="px-4 sm:px-6 lg:px-10 pb-5 sm:pb-6"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
                <SectionHeader
                    eyebrow={settings?.brands_subtitle ?? 'Official Partners'}
                    title={settings?.brands_title ?? 'Top Brands'}
                />
                <div className="grid grid-cols-3 sm:grid-cols-6 bg-white rounded-[14px] border border-gray-200 overflow-hidden">
                    {(settings?.brands_items ?? 'Apple|Samsung|Sony|Dell|LG|ASUS')
                        .split('|').filter(Boolean).map((br: string) => (
                        <div key={br} className="flex items-center justify-center h-14 sm:h-[68px] border-r border-gray-100 last:border-r-0 font-manrope font-black text-[14px] sm:text-[17px] text-gray-300 hover:text-[var(--color-primary,#00c8ff)] hover:bg-[var(--color-primary-soft,#f0fbff)] transition-all cursor-pointer">{br.trim()}</div>
                    ))}
                </div>
            </motion.section>
            )}


        </StorefrontLayout>
    )
}
