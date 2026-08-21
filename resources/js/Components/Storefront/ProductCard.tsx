import { Link, router, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { IconHeart, IconShoppingCart, IconCheck, IconEye, IconBrandWhatsapp } from '@tabler/icons-react'
import type { Product } from '@/types'

interface Props { product: Product; whatsapp?: string }

export default function ProductCard({ product, whatsapp }: Props) {
    const { props }           = usePage<{ wishlistIds?: number[] }>()
    const wishIds             = Array.isArray(props?.wishlistIds) ? props.wishlistIds : []
    const [wished, setWished] = useState(wishIds.includes(product.id))
    const [adding, setAdding] = useState(false)
    const [added, setAdded]   = useState(false)
    const [hover, setHover]   = useState(false)

    const imgs     = Array.isArray(product.images) && product.images.length > 0 ? product.images : [{ id: 0, url: '/images/placeholder.jpg', thumb: '/images/placeholder.jpg' }]
    const img1     = imgs[0]?.url ?? '/images/placeholder.jpg'
    const img2     = imgs[1]?.url ?? null
    const cmp      = product.compare_price ?? 0
    const disc     = product.discount_pct ?? (cmp > product.price && cmp > 0 ? Math.round(((cmp - product.price) / cmp) * 100) : 0)
    const hasVars  = (product.variant_attributes?.length ?? 0) > 0 || (product.variants?.length ?? 0) > 0
    const fmt      = (n: number) => `Rs ${Number(n).toLocaleString('en-PK')}`
    const waMsg    = encodeURIComponent(`Hi! I'm interested in: ${product.name} — ${fmt(product.price)}`)

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
        if (hasVars) { window.location.href = `/products/${product.slug}`; return }
        if (adding || added) return
        setAdding(true)
        router.post('/cart/add', { product_id: product.id, quantity: 1 }, {
            preserveScroll: true, preserveState: true,
            onSuccess: () => { setAdding(false); setAdded(true); setTimeout(() => setAdded(false), 2000) },
            onError:   () => setAdding(false),
        })
    }

    const rating = product.rating_avg ?? 0
    const rcount = product.rating_count ?? 0

    return (
        <Link href={`/products/${product.slug}`}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{ display: 'block', textDecoration: 'none', borderRadius: 16, overflow: 'hidden', background: 'white', boxShadow: hover ? '0 12px 40px rgba(0,0,0,0.12)' : '0 2px 12px rgba(0,0,0,0.06)', transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)', transform: hover ? 'translateY(-4px)' : 'translateY(0)' }}>

            {/* Image container */}
            <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', background: '#F5F5F3' }}>

                {/* Main image */}
                <img src={img1} alt={product.name} loading="lazy"
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.4s, transform 0.6s', opacity: hover && img2 ? 0 : 1, transform: hover ? 'scale(1.06)' : 'scale(1)' }} />

                {/* Hover image */}
                {img2 && <img src={img2} alt={product.name} loading="lazy"
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.4s, transform 0.6s', opacity: hover ? 1 : 0, transform: hover ? 'scale(1.06)' : 'scale(1.03)' }} />}

                {/* Discount badge */}
                {disc > 0 && (
                    <div style={{ position: 'absolute', top: 10, left: 10, background: 'var(--color-primary)', color: 'var(--color-primary-text, #0a0a0a)', fontSize: 10, fontWeight: 800, padding: '4px 8px', borderRadius: 100 }}>
                        -{disc}%
                    </div>
                )}

                {/* Wishlist */}
                <button onClick={toggleWishlist}
                    style={{ position: 'absolute', top: 10, right: 10, width: 32, height: 32, borderRadius: '50%', background: wished ? 'var(--color-primary)' : 'rgba(255,255,255,0.92)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}>
                    <IconHeart size={15} fill={wished ? 'var(--color-primary-text,#0a0a0a)' : 'none'} color={wished ? 'var(--color-primary-text,#0a0a0a)' : '#374151'} />
                </button>

                {/* Quick view badge */}
                {hover && (
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'rgba(0,0,0,0.75)', color: 'white', fontSize: 11, fontWeight: 700, padding: '6px 14px', borderRadius: 100, display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap', backdropFilter: 'blur(4px)' }}>
                        <IconEye size={13} /> Quick View
                    </div>
                )}

                {/* Add to cart bar — appears on hover */}
                <div onClick={addToCart}
                    style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: added ? '#10B981' : 'var(--color-dark-bg, #0a0a0a)', color: 'white', fontSize: 12, fontWeight: 800, padding: '11px', textAlign: 'center', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, transition: 'all 0.3s', transform: hover ? 'translateY(0)' : 'translateY(100%)', opacity: hover ? 1 : 0 }}>
                    {added ? <><IconCheck size={14}/> Added!</> : adding ? 'Adding...' : hasVars ? <><IconEye size={14}/> Select Options</> : <><IconShoppingCart size={14}/> Add to Cart</>}
                </div>
            </div>

            {/* Info */}
            <div style={{ padding: '12px 12px 14px' }}>
                {/* Category */}
                <p style={{ fontSize: 9.5, fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 4px' }}>
                    {product.category?.name ?? ''}
                </p>

                {/* Name */}
                <p style={{ fontSize: 13.5, fontWeight: 700, color: '#111', margin: '0 0 6px', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {product.name}
                </p>

                {/* Stars */}
                {rating > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                        <div style={{ display: 'flex', gap: 1 }}>
                            {[1,2,3,4,5].map(s => (
                                <svg key={s} width="11" height="11" viewBox="0 0 24 24" fill={s <= Math.round(rating) ? 'var(--color-primary)' : '#E5E7EB'}>
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                </svg>
                            ))}
                        </div>
                        {rcount > 0 && <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600 }}>({rcount})</span>}
                    </div>
                )}

                {/* Price row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                        <span style={{ fontSize: 15, fontWeight: 900, color: '#111' }}>{fmt(product.price)}</span>
                        {cmp > product.price && <span style={{ fontSize: 11.5, color: '#9CA3AF', textDecoration: 'line-through', fontWeight: 500 }}>{fmt(cmp)}</span>}
                    </div>
                    {/* WhatsApp */}
                    {whatsapp && (
                        <a href={`https://wa.me/${whatsapp}?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            style={{ width: 28, height: 28, borderRadius: '50%', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, textDecoration: 'none' }}>
                            <IconBrandWhatsapp size={14} color="white" />
                        </a>
                    )}
                </div>
            </div>
        </Link>
    )
}
