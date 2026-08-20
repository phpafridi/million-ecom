import { Head, Link, router, useForm, usePage } from '@inertiajs/react'
import { useState, useRef, useCallback } from 'react'
import {
    IconBrandWhatsapp, IconBrandFacebookFilled, IconPhone, IconMail,
    IconHeart, IconCheck, IconTag, IconChevronRight, IconShoppingCart,
    IconPlus, IconMinus, IconStar, IconStarFilled, IconPackage,
    IconZoomIn, IconX, IconChevronLeft
} from '@tabler/icons-react'
import { motion, AnimatePresence } from 'framer-motion'
import StorefrontLayout from '@/Layouts/StorefrontLayout'
import ProductCard from '@/Components/Storefront/ProductCard'
import type { Product, ProductVariant, PageProps } from '@/types'

interface Props extends PageProps {
    product: Product
    related: Product[]
    wishlisted: boolean
    settings: Record<string, string>
}

function StarRating({ rating, count, size = 14 }: { rating: number | string; count: number; size?: number }) {
    const r = Number(rating) || 0
    return (
        <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i => (
                    <IconStarFilled key={i} size={size} className={i <= Math.round(r) ? 'text-amber-400' : 'text-gray-200'} />
                ))}
            </div>
            <span className="text-[13px] text-gray-500">{r.toFixed(1)} ({count} review{count !== 1 ? 's' : ''})</span>
        </div>
    )
}

// ── Parse product description into structured specs ──────────────────
function parseDescription(desc: string) {
    if (!desc) return { specs: [], prose: '' }

    const lines = desc.split('\n').map(l => l.trim()).filter(Boolean)
    const specs: { label: string; value: string }[] = []
    const proseLines: string[] = []

    for (const line of lines) {
        const colonIdx = line.indexOf(':')
        // Must have colon and label should be short (< 25 chars) to be a spec
        if (colonIdx > 0 && colonIdx < 25) {
            const label = line.slice(0, colonIdx).trim()
            const value = line.slice(colonIdx + 1).trim()
            if (label && value) {
                specs.push({ label, value })
            } else {
                proseLines.push(line)
            }
        } else {
            proseLines.push(line)
        }
    }

    return { specs, prose: proseLines.join('\n') }
}

export default function ProductShow({ product, related, wishlisted: initWishlisted, settings, auth }: Props) {
    const { props: pageProps } = usePage<PageProps>()

    // ── State ─────────────────────────────────────────────────────────
    const [activeImg, setActiveImg]     = useState(0)
    const [wished, setWished]           = useState(initWishlisted)
    const [qty, setQty]                 = useState(1)
    const [adding, setAdding]           = useState(false)
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
        product.variants?.find(v => v.is_active && v.stock > 0) ?? null
    )
    const [selectedValues, setSelectedValues] = useState<Record<number, number>>({})
    const [showReviewForm, setShowReviewForm] = useState(false)

    // ── Zoom state ────────────────────────────────────────────────────
    const [lightbox, setLightbox]   = useState(false)
    const [zoomActive, setZoomActive] = useState(false)
    const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({})
    const mainImgRef = useRef<HTMLDivElement>(null)

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        if (!mainImgRef.current) return
        const rect = mainImgRef.current.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        setZoomStyle({
            transformOrigin: `${x}% ${y}%`,
            transform: 'scale(2.5)',
        })
    }

    // ── Product data ──────────────────────────────────────────────────
    const fmt = (n: number) => `Rs ${Number(n).toLocaleString('en-PK')}`
    const imgs = product.images?.length
        ? product.images
        : [{ id: 0, url: '/images/placeholder.jpg', thumb: '/images/placeholder.jpg' }]

    const hasVariants   = (product.variant_attributes?.length ?? 0) > 0
    const activePrice   = selectedVariant?.price         ?? product.price
    const activeCompare = selectedVariant?.compare_price ?? product.compare_price
    const activeStock   = selectedVariant?.stock         ?? product.stock
    const activeDiscount = activeCompare > activePrice
        ? Math.round(((activeCompare - activePrice) / activeCompare) * 100) : 0

    const whatsapp      = settings?.whatsapp_number ?? ''
    const pageSettings  = (pageProps as any).settings ?? settings ?? {}
    const contactMethod = pageSettings.product_contact_method ?? 'whatsapp'
    const messengerUrl  = pageSettings.messenger_url ?? ''
    const waProductMsg  = pageSettings.whatsapp_product_msg ?? 'Hi! I am interested in: {product_name} (Rs {price}). Please provide details.'
    const waMsg = encodeURIComponent(
        waProductMsg.replace('{product_name}', product.name).replace('{price}', String(activePrice))
    )

    const { specs, prose } = parseDescription(product.description ?? '')
    const reviews = product.approved_reviews ?? []

    // ── Actions ───────────────────────────────────────────────────────
    function selectValue(attrId: number, valueId: number) {
        const newSel = { ...selectedValues, [attrId]: valueId }
        setSelectedValues(newSel)
        const allAttrIds = product.variant_attributes?.map(a => a.id) ?? []
        if (allAttrIds.every(id => newSel[id] !== undefined)) {
            const match = product.variants?.find(v =>
                v.is_active &&
                allAttrIds.every(id => v.variant_values?.some(vv => vv.variant_attribute_id === id && vv.id === newSel[id]))
            )
            setSelectedVariant(match ?? null)
        }
    }

    function addToCart() {
        if (hasVariants && !selectedVariant) { alert('Please select all options'); return }
        if (adding) return
        setAdding(true)
        router.post('/cart/add', {
            product_id: product.id,
            quantity: qty,
            variant_id: selectedVariant?.id ?? null,
        }, { preserveScroll: true, onFinish: () => setAdding(false) })
    }

    function toggleWishlist() {
        setWished(w => !w)
        router.post('/wishlist/toggle', { product_id: product.id }, {
            preserveScroll: true, preserveState: true,
            onError: () => setWished(w => !w),
        })
    }

    const { data: revData, setData: setRevData, post: postReview, processing: revProcessing, reset: resetRev } = useForm({
        name: auth?.user?.name ?? '',
        email: auth?.user?.email ?? '',
        rating: 5, title: '', body: '',
    })
    function submitReview(e: React.FormEvent) {
        e.preventDefault()
        postReview(`/products/${product.id}/reviews`, {
            onSuccess: () => { setShowReviewForm(false); resetRev() }
        })
    }

    const currentImgUrl = selectedVariant?.image ?? imgs[activeImg]?.url ?? '/images/placeholder.jpg'

    return (
        <StorefrontLayout auth={auth} settings={settings}>
            <Head title={product.name} />

            {/* ── Lightbox ── */}
            <AnimatePresence>
                {lightbox && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center"
                        style={{ background: 'rgba(0,0,0,0.96)' }}
                        onClick={() => setLightbox(false)}>

                        <button onClick={() => setLightbox(false)}
                            className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white cursor-pointer hover:bg-white/20 transition-all z-10">
                            <IconX size={20} />
                        </button>

                        {imgs.length > 1 && <>
                            <button onClick={e => { e.stopPropagation(); setActiveImg(i => (i-1+imgs.length)%imgs.length) }}
                                className="absolute left-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white cursor-pointer hover:bg-white/20 transition-all z-10">
                                <IconChevronLeft size={22} />
                            </button>
                            <button onClick={e => { e.stopPropagation(); setActiveImg(i => (i+1)%imgs.length) }}
                                className="absolute right-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white cursor-pointer hover:bg-white/20 transition-all z-10">
                                <IconChevronRight size={22} />
                            </button>
                        </>}

                        <motion.img
                            key={activeImg}
                            initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            src={currentImgUrl} alt={product.name}
                            className="max-w-[88vw] max-h-[88vh] object-contain rounded-2xl select-none"
                            style={{ boxShadow: '0 0 80px rgba(0,0,0,0.8)' }}
                            onClick={e => e.stopPropagation()}
                            draggable={false}
                        />

                        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/40 text-sm font-semibold tracking-wider">
                            {activeImg + 1} / {imgs.length}
                        </div>

                        {imgs.length > 1 && (
                            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2">
                                {imgs.map((_,i) => (
                                    <button key={i} onClick={e => { e.stopPropagation(); setActiveImg(i) }}
                                        className="rounded-full cursor-pointer border-none transition-all h-2"
                                        style={{ width: i===activeImg?24:8, background: i===activeImg?'var(--color-primary)':'rgba(255,255,255,0.3)' }} />
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Breadcrumb ── */}
            <div className="bg-white border-b border-gray-100 px-4 sm:px-8 lg:px-12 py-3">
                <div className="flex items-center gap-1.5 text-[12px] text-gray-400 overflow-x-auto whitespace-nowrap">
                    <Link href="/" className="hover:text-gray-700 no-underline transition-colors">Home</Link>
                    <IconChevronRight size={11} />
                    <Link href="/shop" className="hover:text-gray-700 no-underline transition-colors">Shop</Link>
                    {product.category && <>
                        <IconChevronRight size={11} />
                        <Link href={`/shop?category=${product.category.slug}`} className="hover:text-gray-700 no-underline transition-colors">{product.category.name}</Link>
                    </>}
                    <IconChevronRight size={11} />
                    <span className="text-gray-700 font-semibold truncate max-w-[200px]">{product.name}</span>
                </div>
            </div>

            <div className="px-4 sm:px-8 lg:px-12 py-6 max-w-[1400px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">

                    {/* ═══ LEFT — IMAGE GALLERY ═══════════════════════════════════════ */}
                    <div className="flex gap-4">

                        {/* Vertical thumbnails — desktop */}
                        {imgs.length > 1 && (
                            <div className="hidden lg:flex flex-col gap-2.5 w-[72px] flex-shrink-0">
                                {imgs.map((img, i) => (
                                    <button key={img.id} onClick={() => setActiveImg(i)}
                                        className="relative w-[72px] h-[72px] rounded-xl overflow-hidden border-2 bg-gray-50 flex-shrink-0 cursor-pointer transition-all hover:opacity-100"
                                        style={{
                                            borderColor: i === activeImg ? 'var(--color-primary)' : 'transparent',
                                            opacity: i === activeImg ? 1 : 0.55,
                                        }}>
                                        <img src={img.thumb ?? img.url} alt="" className="w-full h-full object-contain p-1" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Main image */}
                        <div className="flex-1 flex flex-col gap-3">
                            <div
                                ref={mainImgRef}
                                className="relative bg-[#F7F7F7] rounded-2xl overflow-hidden cursor-zoom-in select-none"
                                style={{ aspectRatio: '1/1' }}
                                onMouseEnter={() => setZoomActive(true)}
                                onMouseLeave={() => { setZoomActive(false); setZoomStyle({}) }}
                                onMouseMove={handleMouseMove}
                                onClick={() => setLightbox(true)}>

                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={activeImg}
                                        src={currentImgUrl}
                                        alt={product.name}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="w-full h-full object-contain p-8 lg:p-12 will-change-transform"
                                        style={zoomActive ? zoomStyle : { transition: 'transform 0.1s ease' }}
                                        draggable={false}
                                    />
                                </AnimatePresence>

                                {/* Discount badge */}
                                {activeDiscount > 0 && (
                                    <div className="absolute top-4 left-4 flex items-center gap-1 text-white text-[11px] font-black px-3 py-1.5 rounded-full pointer-events-none"
                                        style={{ background: 'var(--color-accent)' }}>
                                        <IconTag size={12} /> -{activeDiscount}%
                                    </div>
                                )}

                                {/* Wishlist */}
                                <button onClick={e => { e.stopPropagation(); toggleWishlist() }}
                                    className={`absolute top-4 right-4 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer z-10
                                        ${wished ? 'text-white border-transparent' : 'bg-white border-gray-200 text-gray-400 hover:border-rose-300 hover:text-rose-400'}`}
                                    style={wished ? { background: '#EF4444', borderColor: '#EF4444' } : {}}>
                                    <IconHeart size={17} fill={wished ? 'currentColor' : 'none'} />
                                </button>

                                {/* Zoom hint */}
                                {!zoomActive && (
                                    <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-black/40 text-white/80 text-[10.5px] font-semibold px-2.5 py-1.5 rounded-lg backdrop-blur-sm pointer-events-none">
                                        <IconZoomIn size={13} /> Hover to zoom · Click to expand
                                    </div>
                                )}

                                {/* Nav arrows */}
                                {imgs.length > 1 && <>
                                    <button onClick={e => { e.stopPropagation(); setActiveImg(i => (i-1+imgs.length)%imgs.length) }}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 border border-gray-200 shadow-sm flex items-center justify-center cursor-pointer hover:bg-white transition-all z-10 text-gray-600 text-lg font-bold leading-none">
                                        ‹
                                    </button>
                                    <button onClick={e => { e.stopPropagation(); setActiveImg(i => (i+1)%imgs.length) }}
                                        className="absolute right-14 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 border border-gray-200 shadow-sm flex items-center justify-center cursor-pointer hover:bg-white transition-all z-10 text-gray-600 text-lg font-bold leading-none">
                                        ›
                                    </button>
                                </>}
                            </div>

                            {/* Mobile thumbnails */}
                            {imgs.length > 1 && (
                                <div className="flex lg:hidden gap-2 overflow-x-auto pb-1">
                                    {imgs.map((img, i) => (
                                        <button key={img.id} onClick={() => setActiveImg(i)}
                                            className="w-16 h-16 rounded-xl overflow-hidden border-2 bg-gray-50 flex-shrink-0 cursor-pointer transition-all"
                                            style={{
                                                borderColor: i === activeImg ? 'var(--color-primary)' : 'transparent',
                                                opacity: i === activeImg ? 1 : 0.5,
                                            }}>
                                            <img src={img.thumb ?? img.url} alt="" className="w-full h-full object-contain p-1" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ═══ RIGHT — PRODUCT INFO ════════════════════════════════════════ */}
                    <div className="flex flex-col gap-5">

                        {/* Category + stock */}
                        <div className="flex items-center gap-2 flex-wrap">
                            {product.category && (
                                <Link href={`/shop?category=${product.category.slug}`}
                                    className="text-[10.5px] font-black uppercase tracking-[.15em] px-3 py-1.5 rounded-full no-underline"
                                    style={{ color: 'var(--color-primary)', background: 'var(--color-primary)12' }}>
                                    {product.category.name}
                                </Link>
                            )}
                            <span className={`flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-full border
                                ${activeStock > 0 ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-500 border-red-200'}`}>
                                {activeStock > 0 ? `✓ In Stock (${activeStock})` : '✕ Out of Stock'}
                            </span>
                        </div>

                        {/* Name */}
                        <div>
                            <h1 className="font-black text-[26px] sm:text-[30px] lg:text-[32px] leading-[1.15] tracking-tight"
                                style={{ fontFamily: 'Manrope,sans-serif', color: 'var(--color-dark-bg)' }}>
                                {product.name}
                            </h1>
                            {(product.review_count ?? 0) > 0 && (
                                <div className="mt-2">
                                    <StarRating rating={product.avg_rating ?? 0} count={product.review_count ?? 0} size={15} />
                                </div>
                            )}
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-4 flex-wrap py-4 border-y border-gray-100">
                            <span className="font-black text-[32px] sm:text-[36px] leading-none"
                                style={{ fontFamily: 'Manrope,sans-serif', color: 'var(--color-dark-bg)' }}>
                                {fmt(activePrice)}
                            </span>
                            {activeCompare > activePrice && <>
                                <span className="text-[16px] text-gray-400 line-through font-medium">{fmt(activeCompare)}</span>
                                <span className="text-[12px] font-black px-3 py-1 rounded-full"
                                    style={{ background: '#FEF3C7', color: '#D97706' }}>
                                    Save {fmt(activeCompare - activePrice)}
                                </span>
                            </>}
                        </div>

                        {/* SKU / Made in */}
                        {((product as any).sku || (product as any).made_in) && (
                            <div className="flex gap-4 text-[12px] text-gray-400">
                                {(product as any).sku && <span>SKU: <strong className="text-gray-600">{(product as any).sku}</strong></span>}
                                {(product as any).made_in && <span>Made in: <strong className="text-gray-600">{(product as any).made_in}</strong></span>}
                            </div>
                        )}

                        {/* Variants */}
                        {hasVariants && product.variant_attributes?.map(attr => (
                            <div key={attr.id}>
                                <div className="text-[12px] font-black text-gray-700 uppercase tracking-wide mb-2.5">{attr.name}:</div>
                                <div className="flex gap-2 flex-wrap">
                                    {attr.values.map(val => {
                                        const isSelected = selectedValues[attr.id] === val.id
                                        return val.color_hex ? (
                                            <button key={val.id} onClick={() => selectValue(attr.id, val.id)}
                                                title={val.value}
                                                className={`w-9 h-9 rounded-full border-2 cursor-pointer transition-all ${isSelected ? 'scale-110 shadow-md' : 'border-gray-300 hover:border-gray-500'}`}
                                                style={{ background: val.color_hex, borderColor: isSelected ? 'var(--color-primary)' : undefined }}>
                                                {isSelected && <IconCheck size={14} className="text-white mx-auto" />}
                                            </button>
                                        ) : (
                                            <button key={val.id} onClick={() => selectValue(attr.id, val.id)}
                                                className={`px-4 py-2 rounded-xl text-[12.5px] font-bold border-2 cursor-pointer transition-all
                                                    ${isSelected ? 'text-[var(--color-primary-text)]' : 'bg-white border-gray-200 text-gray-700 hover:border-gray-400'}`}
                                                style={isSelected ? { background: 'var(--color-primary)', borderColor: 'var(--color-primary)' } : {}}>
                                                {val.value}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}

                        {/* Quantity + Add to Cart */}
                        {activeStock > 0 && (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                                    <button onClick={() => setQty(Math.max(1, qty-1))}
                                        className="w-11 h-12 flex items-center justify-center text-gray-500 hover:bg-gray-50 border-none bg-transparent cursor-pointer transition-colors">
                                        <IconMinus size={15} />
                                    </button>
                                    <span className="w-12 text-center text-[15px] font-black" style={{ color: 'var(--color-dark-bg)' }}>{qty}</span>
                                    <button onClick={() => setQty(Math.min(activeStock, qty+1))}
                                        className="w-11 h-12 flex items-center justify-center text-gray-500 hover:bg-gray-50 border-none bg-transparent cursor-pointer transition-colors">
                                        <IconPlus size={15} />
                                    </button>
                                </div>
                                <span className="text-[12.5px] text-gray-400 font-medium">{activeStock} units available</span>
                            </div>
                        )}

                        {/* CTA Buttons */}
                        <div className="flex flex-col gap-2.5">
                            {activeStock > 0 && (
                                <div className="grid grid-cols-2 gap-2.5">
                                    <button onClick={addToCart}
                                        disabled={adding || (hasVariants && !selectedVariant)}
                                        className="col-span-2 flex items-center justify-center gap-2.5 h-[54px] font-black text-[14px] rounded-2xl transition-all border-none cursor-pointer disabled:opacity-60 hover:opacity-90"
                                        style={{ background: 'var(--color-dark-bg)', color: '#fff' }}>
                                        <IconShoppingCart size={20} />
                                        {adding ? 'Adding…' : hasVariants && !selectedVariant ? 'Select Options First' : 'Add to Cart'}
                                    </button>
                                    <Link href="/cart"
                                        className="flex items-center justify-center gap-2 h-[48px] font-bold text-[13px] rounded-2xl no-underline border-2 transition-all hover:opacity-80"
                                        style={{ borderColor: 'var(--color-dark-bg)', color: 'var(--color-dark-bg)', background: 'transparent' }}>
                                        View Cart
                                    </Link>
                                    <button onClick={() => toggleWishlist()}
                                        className={`flex items-center justify-center gap-2 h-[48px] font-bold text-[13px] rounded-2xl border-2 cursor-pointer transition-all
                                            ${wished ? 'text-white border-transparent' : 'border-gray-200 text-gray-600 bg-transparent hover:border-rose-300 hover:text-rose-500'}`}
                                        style={wished ? { background: '#EF4444', borderColor: '#EF4444' } : {}}>
                                        <IconHeart size={16} fill={wished ? 'currentColor' : 'none'} />
                                        {wished ? 'Saved' : 'Wishlist'}
                                    </button>
                                </div>
                            )}

                            {/* WhatsApp */}
                            {contactMethod === 'whatsapp' && whatsapp && (
                                <a href={`https://wa.me/${whatsapp}?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2.5 bg-[#25D366] text-white font-bold text-[14px] h-[52px] rounded-2xl no-underline hover:bg-[#1da853] transition-all">
                                    <IconBrandWhatsapp size={21} /> Order via WhatsApp
                                </a>
                            )}
                            {contactMethod === 'messenger' && messengerUrl && (
                                <a href={messengerUrl} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2.5 bg-[#0084FF] text-white font-bold text-[14px] h-[52px] rounded-2xl no-underline hover:bg-[#0070d6] transition-all">
                                    <IconBrandFacebookFilled size={21} /> Message on Messenger
                                </a>
                            )}
                            {settings?.phone && (
                                <a href={`tel:${settings.phone}`}
                                    className="flex items-center justify-center gap-2 h-[46px] font-bold text-[13px] rounded-2xl no-underline border-2 transition-all"
                                    style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>
                                    <IconPhone size={17} /> {settings.phone}
                                </a>
                            )}
                        </div>

                        {/* Trust badges */}
                        <div className="grid grid-cols-2 gap-2.5">
                            {[['🛡️','100% Genuine','Verified quality'],['🚚','Fast Delivery','Pakistan-wide'],['↩️','7-Day Returns','Hassle-free'],['✅','Warranty','Covered']].map(([icon,title,sub]) => (
                                <div key={title} className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100">
                                    <span className="text-xl">{icon}</span>
                                    <div>
                                        <p className="text-[12px] font-bold text-gray-800 leading-none">{title}</p>
                                        <p className="text-[10.5px] text-gray-400 mt-0.5">{sub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ═══ PRODUCT DETAILS TABS ════════════════════════════════════════════ */}
                <div className="mt-8 bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    {/* Description + Specs */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">

                        {/* Left: Prose description */}
                        {prose && (
                            <div className="p-6 lg:p-8">
                                <h2 className="font-black text-[15px] uppercase tracking-wider mb-4 pb-3 border-b border-gray-100"
                                    style={{ color: 'var(--color-dark-bg)', fontFamily: 'Manrope,sans-serif' }}>
                                    About This Product
                                </h2>
                                <p className="text-[14px] text-gray-600 leading-[1.85] whitespace-pre-line">{prose}</p>
                            </div>
                        )}

                        {/* Right: Structured specs */}
                        {specs.length > 0 && (
                            <div className="p-6 lg:p-8">
                                <h2 className="font-black text-[15px] uppercase tracking-wider mb-4 pb-3 border-b border-gray-100"
                                    style={{ color: 'var(--color-dark-bg)', fontFamily: 'Manrope,sans-serif' }}>
                                    Specifications
                                </h2>
                                <div className="divide-y divide-gray-50">
                                    {specs.map((s, i) => (
                                        <div key={i} className="flex py-3 gap-4">
                                            <span className="text-[12.5px] font-bold text-gray-400 uppercase tracking-wide w-36 flex-shrink-0 pt-0.5">{s.label}</span>
                                            <span className="text-[13.5px] font-semibold text-gray-800">{s.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Fallback: single column description */}
                        {!prose && specs.length === 0 && product.description && (
                            <div className="p-6 lg:p-8 lg:col-span-2">
                                <h2 className="font-black text-[15px] uppercase tracking-wider mb-4 pb-3 border-b border-gray-100"
                                    style={{ color: 'var(--color-dark-bg)', fontFamily: 'Manrope,sans-serif' }}>
                                    Product Details
                                </h2>
                                <p className="text-[14px] text-gray-600 leading-[1.85]">{product.description}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ═══ REVIEWS ═════════════════════════════════════════════════════════ */}
                <div className="mt-6 bg-white rounded-2xl border border-gray-100 p-6 lg:p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="font-black text-[20px]" style={{ fontFamily: 'Manrope,sans-serif', color: 'var(--color-dark-bg)' }}>
                                Customer Reviews
                            </h2>
                            {reviews.length > 0 && (
                                <div className="mt-1.5">
                                    <StarRating rating={product.avg_rating ?? 0} count={product.review_count ?? 0} size={16} />
                                </div>
                            )}
                        </div>
                        <button onClick={() => setShowReviewForm(!showReviewForm)}
                            className="h-10 px-5 font-bold text-[13px] rounded-xl border-2 cursor-pointer transition-all bg-white"
                            style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>
                            {showReviewForm ? '✕ Cancel' : '+ Write Review'}
                        </button>
                    </div>

                    {showReviewForm && (
                        <motion.form onSubmit={submitReview}
                            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-5 bg-gray-50 border border-gray-200 rounded-2xl space-y-4">
                            <h3 className="font-bold text-[15px] text-gray-800">Write Your Review</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">Name *</label>
                                    <input value={revData.name} onChange={e => setRevData('name', e.target.value)} required placeholder="Ali Khan"
                                        className="w-full h-11 px-4 border border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)] bg-white" />
                                </div>
                                <div>
                                    <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">Email (optional)</label>
                                    <input type="email" value={revData.email} onChange={e => setRevData('email', e.target.value)} placeholder="ali@email.com"
                                        className="w-full h-11 px-4 border border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)] bg-white" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-2">Rating *</label>
                                <div className="flex gap-1.5">
                                    {[1,2,3,4,5].map(n => (
                                        <button key={n} type="button" onClick={() => setRevData('rating', n)} className="border-none bg-transparent cursor-pointer p-0">
                                            <IconStarFilled size={30} className={n <= revData.rating ? 'text-amber-400' : 'text-gray-200'} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">Title</label>
                                <input value={revData.title} onChange={e => setRevData('title', e.target.value)} placeholder="Great product!"
                                    className="w-full h-11 px-4 border border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)] bg-white" />
                            </div>
                            <div>
                                <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">Review</label>
                                <textarea value={revData.body} onChange={e => setRevData('body', e.target.value)} rows={3}
                                    placeholder="Share your honest experience…"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)] resize-none bg-white" />
                            </div>
                            <div className="flex items-center gap-3">
                                <button type="submit" disabled={revProcessing}
                                    className="h-11 px-8 font-black text-[13px] rounded-xl border-none cursor-pointer disabled:opacity-60"
                                    style={{ background: 'var(--color-primary)', color: 'var(--color-primary-text)' }}>
                                    {revProcessing ? 'Submitting…' : 'Submit Review'}
                                </button>
                                <p className="text-[12px] text-gray-400">Reviews are published after approval.</p>
                            </div>
                        </motion.form>
                    )}

                    {reviews.length === 0 ? (
                        <div className="py-12 text-center">
                            <IconStar size={38} className="mx-auto mb-3 text-gray-200" />
                            <p className="font-bold text-[14px] text-gray-400">No reviews yet.</p>
                            <p className="text-[13px] text-gray-400 mt-1">Be the first to review this product!</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {reviews.map(r => (
                                <div key={r.id} className="py-5">
                                    <div className="flex items-start gap-3 mb-2">
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-white text-[14px] flex-shrink-0"
                                            style={{ background: 'var(--color-primary)' }}>
                                            {r.name[0]?.toUpperCase()}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between flex-wrap gap-2">
                                                <span className="font-bold text-[13.5px] text-gray-900">{r.name}</span>
                                                <span className="text-[11.5px] text-gray-400">{new Date(r.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex gap-0.5 mt-1">
                                                {[1,2,3,4,5].map(i => (
                                                    <IconStarFilled key={i} size={12} className={i <= r.rating ? 'text-amber-400' : 'text-gray-200'} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    {r.title && <p className="font-bold text-[13.5px] text-gray-900 mb-1 ml-13">{r.title}</p>}
                                    {r.body && <p className="text-[13.5px] text-gray-600 leading-relaxed">{r.body}</p>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ═══ RELATED PRODUCTS ════════════════════════════════════════════════ */}
                {related.length > 0 && (
                    <div className="mt-8">
                        <h2 className="font-black text-[20px] mb-5" style={{ fontFamily: 'Manrope,sans-serif', color: 'var(--color-dark-bg)' }}>
                            You May Also Like
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
                            {related.slice(0, 4).map(p => <ProductCard key={p.id} product={p} whatsapp={whatsapp} />)}
                        </div>
                    </div>
                )}
            </div>
        </StorefrontLayout>
    )
}
