import { Head, Link } from '@inertiajs/react'
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { IconArrowRight, IconCircleCheck, IconBrandWhatsapp, IconTruck, IconMapPin, IconHeadset, IconChevronDown } from '@tabler/icons-react'
import StorefrontLayout from '@/Layouts/StorefrontLayout'
import HeroSlider from '@/Components/Storefront/HeroSlider'
import ProductScroller from '@/Components/Storefront/ProductScroller'
import type { Product, Category, HeroSlide, PageProps } from '@/types'

interface Props extends PageProps {
    heroSlides: HeroSlide[]
    onSaleProducts: Product[]
    categories: Category[]
    banners: Record<string, any>
    settings: Record<string, string>
}

function SectionHeader({ eyebrow, title, viewAll }: { eyebrow: string; title: string; viewAll?: string }) {
    return (
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
                <div className="w-1 h-6 sm:h-7 bg-[var(--color-primary,#00c8ff)] rounded-sm flex-shrink-0" style={{ boxShadow: '0 0 8px rgba(0,200,255,0.4)' }} />
                <div>
                    <div className="text-[10px] sm:text-[11px] font-bold text-[var(--color-primary,#00c8ff)] uppercase tracking-[.12em]">{eyebrow}</div>
                    <h2 className="font-manrope font-black text-[18px] sm:text-[21px] tracking-tight leading-snug" style={{ color: 'var(--color-body-text)' }}>{title}</h2>
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

export default function Home({ heroSlides, onSaleProducts, categories, banners, settings, auth }: Props) {
    const [loaded, setLoaded] = useState(false)
    const whatsapp = settings?.whatsapp_number ?? ''

    useEffect(() => { const t = setTimeout(() => setLoaded(true), 350); return () => clearTimeout(t) }, [])

    const b = (pos: string) => banners[pos]

    // Tracks which category is currently in view for the progress dots.
    // Two SEPARATE concerns, deliberately kept apart: sectionRef+its own
    // observer decides purely whether the whole category block is
    // anywhere on screen (controls whether dots show at all); catRefs+its
    // observer decides which individual category is most visible (which
    // dot is highlighted). Mixing these into one observer previously
    // caused the show/hide state to get out of sync after scrolling up
    // and back down multiple times.
    const [activeCat, setActiveCat] = useState(0)
    const [categoriesInView, setCategoriesInView] = useState(false)
    const sectionRef = useRef<HTMLDivElement | null>(null)
    const catRefs = useRef<(HTMLElement | null)[]>([])

    useEffect(() => {
        if (!sectionRef.current) return
        const sectionObserver = new IntersectionObserver(
            ([entry]) => setCategoriesInView(entry.isIntersecting),
            { threshold: 0 }
        )
        sectionObserver.observe(sectionRef.current)
        return () => sectionObserver.disconnect()
    }, [loaded])

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const idx = catRefs.current.findIndex(el => el === entry.target)
                    if (idx !== -1) setActiveCat(idx)
                }
            })
        }, { threshold: 0.5 })
        catRefs.current.forEach(el => el && observer.observe(el))
        return () => observer.disconnect()
    }, [categories, loaded])

    return (
        <StorefrontLayout auth={auth} settings={settings}>
            <Head title="Home" />

            <HeroSlider slides={heroSlides} />

            {/* SHOP THE SALE — discount carousel, sits between hero and categories per the approved design */}
            {onSaleProducts.length > 0 && (
                <ProductScroller
                    eyebrow="Limited time"
                    title="Shop the Sale"
                    viewAllHref="/shop?sort=discount"
                    products={onSaleProducts}
                    whatsapp={whatsapp}
                    loading={!loaded}
                />
            )}

            {/* CATEGORIES — full-cover, stacked one by one on mobile, 2-across on desktop. Order follows Admin → Categories sort order. */}
            <section className="py-8 sm:py-10">
                <div className="text-center mb-6 sm:mb-8 px-4">
                    <div className="text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.25em] mb-2" style={{ color: 'var(--color-primary)' }}>Shop by</div>
                    <h2 className="font-manrope font-black" style={{ fontSize: 'clamp(24px,4vw,40px)', color: 'var(--color-body-text)' }}>All Categories</h2>
                </div>

                <div className="relative" ref={sectionRef}>
                    {/* Progress dots — right edge, tracks scroll position via IntersectionObserver above */}
                    {loaded && categoriesInView && categories.length > 1 && (
                        <div className="hidden sm:flex fixed z-20 flex-col gap-2" style={{ right: 18, top: '50%', transform: 'translateY(-50%)' }}>
                            {categories.slice(0,8).map((cat, i) => (
                                <div key={cat.id} style={{
                                    width: 8, height: i === activeCat ? 24 : 8, borderRadius: 4,
                                    background: i === activeCat ? '#fff' : 'rgba(255,255,255,0.4)',
                                    boxShadow: '0 0 0 1px rgba(0,0,0,0.15)', transition: 'all 0.3s',
                                }} />
                            ))}
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2" style={{ scrollSnapType: 'y proximity' }}>
                        {!loaded
                            ? Array(6).fill(0).map((_,i)=>(
                                <div key={i} className="animate-pulse bg-gray-200" style={{ height: '100dvh' }} />
                            ))
                            : categories.slice(0,8).map((cat, i) => (
                                <motion.div key={cat.id}
                                    ref={(el: HTMLElement | null) => { catRefs.current[i] = el }}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-100px' }}
                                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                    style={{ scrollSnapAlign: 'start' }}>
                                    <Link href={`/category/${cat.slug}`}
                                        className="relative block no-underline overflow-hidden group"
                                        style={{ height: '100dvh' }}>
                                        <picture>
                                            <source media="(min-width: 1024px)" srcSet={cat.image ?? '/images/placeholder.jpg'} />
                                            <img src={cat.mobile_image ?? cat.image ?? '/images/placeholder.jpg'} alt={cat.name}
                                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                                style={{ objectPosition: 'center 20%' }} loading="lazy" />
                                        </picture>
                                        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(0,0,0,0.65) 0%,rgba(0,0,0,0.05) 55%,transparent 100%)' }} />
                                        <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'32px' }}>
                                            <span style={{ display:'block', color:'#fff', fontSize:'clamp(24px,3vw,34px)', fontWeight:500, lineHeight:1.2 }}>{cat.name}</span>
                                            <span style={{ display:'block', color:'rgba(255,255,255,0.85)', fontSize:14, marginTop:8 }}>Shop the collection →</span>
                                        </div>
                                        {/* Scroll cue — first category only, hints there's more below */}
                                        {i === 0 && (
                                            <div style={{ position:'absolute', bottom:20, left:0, right:0, textAlign:'center', pointerEvents:'none' }}
                                                className="animate-bounce">
                                                <IconChevronDown size={22} style={{ color:'#fff', opacity:0.85 }} />
                                                <div style={{ color:'rgba(255,255,255,0.8)', fontSize:10, letterSpacing:'0.15em', marginTop:2 }}>SCROLL TO EXPLORE</div>
                                            </div>
                                        )}
                                    </Link>
                                </motion.div>
                            ))
                        }
                    </div>
                </div>
            </section>

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

            {/* ORDER TRACKING / STORE LOCATOR / SUPPORT — minimal icon row, matches the approved reference design. Grid-based so it can never overflow/overlap at any screen width, unlike the previous flex+gap version. */}
            <section className="py-6 sm:py-8 lg:py-12" style={{ background: '#f7f5f0' }}>
                <div className="grid grid-cols-3 max-w-3xl mx-auto px-4">
                    <Link href="/track-order" className="flex flex-col items-center gap-1.5 lg:gap-3 no-underline px-1">
                        <IconTruck size={22} className="lg:hidden" style={{ color: 'var(--color-primary)' }} />
                        <IconTruck size={36} className="hidden lg:block" style={{ color: 'var(--color-primary)' }} />
                        <span className="text-[9px] sm:text-[10px] lg:text-[12px] font-bold tracking-wider text-center leading-tight" style={{ color: '#555' }}>ORDER<br /> TRACKING</span>
                    </Link>
                    <Link href="/contact" className="flex flex-col items-center gap-1.5 lg:gap-3 no-underline px-1">
                        <IconMapPin size={22} className="lg:hidden" style={{ color: 'var(--color-primary)' }} />
                        <IconMapPin size={36} className="hidden lg:block" style={{ color: 'var(--color-primary)' }} />
                        <span className="text-[9px] sm:text-[10px] lg:text-[12px] font-bold tracking-wider text-center leading-tight" style={{ color: '#555' }}>STORE<br /> LOCATOR</span>
                    </Link>
                    <Link href="/contact" className="flex flex-col items-center gap-1.5 lg:gap-3 no-underline px-1">
                        <IconHeadset size={22} className="lg:hidden" style={{ color: 'var(--color-primary)' }} />
                        <IconHeadset size={36} className="hidden lg:block" style={{ color: 'var(--color-primary)' }} />
                        <span className="text-[9px] sm:text-[10px] lg:text-[12px] font-bold tracking-wider text-center leading-tight" style={{ color: '#555' }}>SUPPORT<br /> 24/7</span>
                    </Link>
                </div>
            </section>


        </StorefrontLayout>
    )
}
