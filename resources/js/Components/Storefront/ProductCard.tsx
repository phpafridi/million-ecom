import { Link, router, usePage } from '@inertiajs/react'
import { useState, useRef } from 'react'
import { IconHeart, IconBrandWhatsapp, IconShoppingCart, IconCheck, IconEye } from '@tabler/icons-react'
import type { Product } from '@/types'

interface Props { product: Product; whatsapp?: string }

export default function ProductCard({ product, whatsapp }: Props) {
    const { props }            = usePage<{ wishlistIds?: number[] }>()
    const [wished, setWished]  = useState((props.wishlistIds ?? []).includes(product.id))
    const [adding, setAdding]  = useState(false)
    const [added, setAdded]    = useState(false)
    const [hovering, setHover] = useState(false)
    const [imgIdx, setImgIdx]  = useState(0)
    const [flyActive, setFly]  = useState(false)
    const btnRef               = useRef<HTMLButtonElement>(null)

    const fmt   = (n: number) => `Rs ${Number(n).toLocaleString('en-PK')}`
    const imgs  = product.images?.length ? product.images : [{ id: 0, url: '/images/placeholder.jpg', thumb: '/images/placeholder.jpg' }]
    const img1  = imgs[0]?.url ?? '/images/placeholder.jpg'
    const img2  = imgs[1]?.url ?? null
    const disc  = product.discount_pct ?? (product.compare_price > product.price ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100) : 0)
    const waMsg = encodeURIComponent(`Hi! I am interested in: ${product.name} — ${fmt(product.price)}`)

    function toggleWishlist(e: React.MouseEvent) {
        e.preventDefault(); e.stopPropagation()
        setWished(w => !w)
        router.post('/wishlist/toggle', { product_id: product.id }, {
            preserveScroll: true, preserveState: true,
            onError: () => setWished(w => !w),
        })
    }

    function addToCart(e: React.MouseEvent) {
        e.preventDefault(); e.stopPropagation()
        if (adding || added) return
        setFly(true); setTimeout(() => setFly(false), 700)
        setAdding(true)
        router.post('/cart/add', { product_id: product.id, quantity: 1 }, {
            preserveScroll: true, preserveState: true,
            onSuccess: () => { setAdding(false); setAdded(true); setTimeout(() => setAdded(false), 2000) },
            onError:   () => setAdding(false),
        })
    }

    return (
        <div
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => { setHover(false); setImgIdx(0) }}
            style={{
                background: '#fff',
                borderRadius: 'var(--radius, 12px)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'box-shadow 0.3s',
                boxShadow: hovering ? '0 8px 32px rgba(0,0,0,0.12)' : '0 1px 4px rgba(0,0,0,0.06)',
                position: 'relative',
            }}>

            {/* ── Image area ── */}
            <Link href={`/products/${product.slug}`} style={{ display: 'block', textDecoration: 'none', position: 'relative', overflow: 'hidden', background: '#F5F5F3', flexShrink: 0 }}>

                <div style={{ position: 'relative', width: '100%', aspectRatio: '3/4', overflow: 'hidden' }}>
                    {/* Primary image */}
                    <img src={img1} alt={product.name}
                        style={{
                            position: 'absolute', inset: 0, width: '100%', height: '100%',
                            objectFit: 'cover',
                            transition: 'opacity 0.5s, transform 0.6s',
                            opacity: (img2 && hovering) ? 0 : 1,
                            transform: hovering ? 'scale(1.04)' : 'scale(1)',
                        }}
                        loading="lazy" />

                    {/* Secondary hover image */}
                    {img2 && (
                        <img src={img2} alt={product.name}
                            style={{
                                position: 'absolute', inset: 0, width: '100%', height: '100%',
                                objectFit: 'cover',
                                transition: 'opacity 0.5s, transform 0.6s',
                                opacity: hovering ? 1 : 0,
                                transform: hovering ? 'scale(1.04)' : 'scale(1)',
                            }}
                            loading="lazy" />
                    )}

                    {/* Discount badge */}
                    {disc > 0 && (
                        <div style={{ position: 'absolute', top: 10, left: 10, background: 'var(--color-accent, #e91e63)', color: '#fff', fontSize: 10, fontWeight: 800, padding: '3px 9px', borderRadius: 100, zIndex: 2 }}>
                            -{disc}%
                        </div>
                    )}

                    {/* Out of stock */}
                    {product.stock === 0 && (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3 }}>
                            <span style={{ background: '#111', color: '#fff', fontSize: 11, fontWeight: 800, padding: '6px 14px', borderRadius: 100, letterSpacing: '.08em' }}>SOLD OUT</span>
                        </div>
                    )}

                    {/* Right actions — slide in on hover */}
                    <div style={{
                        position: 'absolute', top: 10, right: 10,
                        display: 'flex', flexDirection: 'column', gap: 8,
                        transform: hovering ? 'translateX(0)' : 'translateX(52px)',
                        transition: 'transform 0.3s cubic-bezier(.4,0,.2,1)',
                        zIndex: 4,
                    }}>
                        <button onClick={toggleWishlist}
                            style={{
                                width: 36, height: 36, borderRadius: '50%',
                                background: wished ? 'var(--color-accent, #e91e63)' : '#fff',
                                border: 'none', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                                color: wished ? '#fff' : '#9CA3AF',
                                transition: 'all 0.2s',
                            }}>
                            <IconHeart size={15} fill={wished ? 'currentColor' : 'none'} />
                        </button>

                        <Link href={`/products/${product.slug}`}
                            onClick={e => e.stopPropagation()}
                            style={{
                                width: 36, height: 36, borderRadius: '50%',
                                background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                                color: '#6B7280', textDecoration: 'none', transition: 'color 0.2s',
                            }}>
                            <IconEye size={15} />
                        </Link>

                        {whatsapp && product.stock > 0 && (
                            <a href={`https://wa.me/${whatsapp}?text=${waMsg}`}
                                target="_blank" rel="noopener noreferrer"
                                onClick={e => e.stopPropagation()}
                                style={{
                                    width: 36, height: 36, borderRadius: '50%',
                                    background: '#25D366',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                                    textDecoration: 'none',
                                }}>
                                <IconBrandWhatsapp size={15} color="#fff" />
                            </a>
                        )}
                    </div>

                    {/* ── Add to Cart — SLIDES UP on hover ── */}
                    {product.stock > 0 && (
                        <button
                            ref={btnRef}
                            onClick={addToCart}
                            disabled={adding}
                            style={{
                                position: 'absolute', bottom: 0, left: 0, right: 0,
                                height: 46,
                                background: added ? '#22C55E' : 'var(--color-dark-bg, #0a0e1a)',
                                color: '#fff',
                                border: 'none', cursor: adding ? 'wait' : 'pointer',
                                fontWeight: 800, fontSize: 13,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                // SLIDE UP ON HOVER — key fix
                                transform: hovering ? 'translateY(0%)' : 'translateY(100%)',
                                transition: 'transform 0.32s cubic-bezier(.4,0,.2,1), background 0.2s',
                                zIndex: 5,
                                letterSpacing: '.02em',
                            }}>
                            {added
                                ? <><IconCheck size={15} /> Added!</>
                                : adding
                                    ? <><div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Adding…</>
                                    : <><IconShoppingCart size={15} /> Add to Cart</>}
                        </button>
                    )}

                    {/* Fly animation dot */}
                    {flyActive && (
                        <div style={{
                            position: 'absolute', bottom: 46, left: '50%',
                            width: 12, height: 12, borderRadius: '50%',
                            background: 'var(--color-primary)',
                            animation: 'flyUp 0.65s ease-in forwards',
                            pointerEvents: 'none', zIndex: 10,
                        }} />
                    )}
                </div>
            </Link>

            {/* ── Info ── */}
            <div style={{ padding: '12px 14px 14px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                {product.category?.name && (
                    <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.14em', color: 'var(--color-primary)', marginBottom: 4 }}>
                        {product.category.name}
                    </div>
                )}

                <Link href={`/products/${product.slug}`}
                    style={{ fontWeight: 600, fontSize: 13.5, lineHeight: 1.45, color: '#111', textDecoration: 'none', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: 6, flex: 1 }}>
                    {product.name}
                </Link>

                {/* Stars */}
                {(product.review_count ?? 0) > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginBottom: 6 }}>
                        {[1,2,3,4,5].map(i => (
                            <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill={i <= Math.round(Number(product.avg_rating) || 0) ? '#F59E0B' : '#E5E7EB'}>
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                        ))}
                        <span style={{ fontSize: 11, color: '#9CA3AF' }}>({product.review_count})</span>
                    </div>
                )}

                {/* Price */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span style={{ fontFamily: 'Manrope,sans-serif', fontWeight: 900, fontSize: 16, color: 'var(--color-dark-bg, #0a0e1a)' }}>
                        {fmt(product.price)}
                    </span>
                    {product.compare_price > product.price && (
                        <span style={{ fontSize: 12, color: '#9CA3AF', textDecoration: 'line-through' }}>{fmt(product.compare_price)}</span>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes flyUp { 0% { transform: translateX(-50%) translateY(0) scale(1); opacity:1; } 100% { transform: translateX(-50%) translateY(-80px) scale(0); opacity:0; } }
            `}</style>
        </div>
    )
}
