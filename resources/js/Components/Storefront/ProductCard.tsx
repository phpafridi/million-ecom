import { Link, router, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { IconHeart, IconEye, IconShoppingBag } from '@tabler/icons-react'
import QuickViewModal from './QuickViewModal'
import type { Product } from '@/types'

interface Props { product: Product; whatsapp?: string }

export default function ProductCard({ product, whatsapp }: Props) {
    const { props }           = usePage<{ wishlistIds?: number[] }>()
    const wishIds             = Array.isArray(props?.wishlistIds) ? props.wishlistIds : []
    const [wished, setWished] = useState(wishIds.includes(product.id))
    const [hover, setHover]   = useState(false)
    const [adding, setAdding] = useState(false)
    const [showQuickView, setShowQuickView] = useState(false)

    // All available photos, not just the first two — dot indicators let
    // a shopper tap through every image on the card itself (mobile
    // especially, where hover doesn't exist), matching the swipeable
    // cards on the Limelight reference.
    const imgs = Array.isArray(product.images) && product.images.length > 0
        ? product.images : [{ id: 0, url: '/images/placeholder.jpg', thumb: '/images/placeholder.jpg' }]
    const [activeImg, setActiveImg] = useState(0)
    const currentImg = imgs[activeImg]?.url ?? imgs[0]?.url ?? '/images/placeholder.jpg'
    const fmt    = (n: number) => `Rs ${Math.round(n).toLocaleString('en-PK')}`

    // Flash sale: read from shared settings
    const settings   = (usePage<any>().props?.settings ?? {}) as Record<string,string>
    const saleActive = settings.sale_enabled === '1'
        && !!settings.sale_ends_at
        && new Date(settings.sale_ends_at) > new Date()
    const salePct    = saleActive && settings.sale_discount ? parseInt(settings.sale_discount) : 0

    // Price calculation: if flash sale active, apply discount to original price
    const origPrice  = product.price
    const salePrice  = salePct > 0 ? Math.round(origPrice * (1 - salePct / 100)) : origPrice

    // Compare price: if flash sale, original price becomes strikethrough
    const cmp  = salePct > 0 ? origPrice : (product.compare_price ?? 0)
    const disc = salePct > 0 ? salePct
        : (product.discount_pct ?? (product.compare_price && product.compare_price > origPrice
            ? Math.round(((product.compare_price - origPrice) / product.compare_price) * 100) : 0))

    // Final displayed price
    const displayPrice = salePct > 0 ? salePrice : origPrice
    const rating = product.rating_avg ?? 0
    const rcount = product.rating_count ?? 0

    function toggleWishlist(e: React.MouseEvent) {
        e.preventDefault(); e.stopPropagation()
        setWished(w => !w)
        router.post('/wishlist/toggle', { product_id: product.id }, {
            preserveScroll: true, preserveState: true,
            onError: () => setWished(w => !w),
        })
    }

    // Quick-add straight from the card — only works cleanly for products
    // with no variants (color/size); those still need the product page
    // so a real selection gets made, same reasoning as the wishlist
    // quick-add fix from earlier this session.
    function quickAdd(e: React.MouseEvent) {
        e.preventDefault(); e.stopPropagation()
        setShowQuickView(true)
    }

    function selectImage(e: React.MouseEvent, i: number) {
        e.preventDefault(); e.stopPropagation()
        setActiveImg(i)
    }

    return (
        <>
        <Link href={`/products/${product.slug}`}
            onMouseEnter={() => { setHover(true); if (imgs.length > 1) setActiveImg(1) }}
            onMouseLeave={() => { setHover(false); setActiveImg(0) }}
            style={{
                display: 'block', textDecoration: 'none', borderRadius: 16,
                overflow: 'hidden', background: 'white',
                boxShadow: hover ? '0 12px 40px rgba(0,0,0,0.12)' : '0 2px 12px rgba(0,0,0,0.06)',
                // Blocks the "ghost click" mobile browsers sometimes fire
                // ~300ms after a touch — without this, that delayed
                // synthetic click can land on this still-present link
                // underneath the modal and silently navigate away.
                pointerEvents: showQuickView ? 'none' : 'auto',
                transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                transform: hover ? 'translateY(-4px)' : 'translateY(0)',
            }}>

            {/* Image */}
            <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', background: '#F5F5F3' }}>

                <img src={currentImg} alt={product.name} loading="lazy" style={{
                    position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
                    transition: 'opacity 0.3s, transform 0.6s',
                    transform: hover ? 'scale(1.06)' : 'scale(1)',
                }} />

                {/* Discount badge — matches Limelight exactly: solid red
                    square (not rounded pill), "X% OFF" wording, not "-X%" */}
                {disc > 0 && (
                    <div style={{
                        position: 'absolute', top: 10, left: 10,
                        background: '#E31E24', color: '#ffffff',
                        fontSize: 11, fontWeight: 800, padding: '5px 9px', borderRadius: 3,
                    }}>{disc}% OFF</div>
                )}

                {/* Wishlist button */}
                <button onClick={toggleWishlist} style={{
                    position: 'absolute', top: 10, right: 10, width: 32, height: 32,
                    borderRadius: '50%',
                    background: wished ? 'var(--color-primary,#C9A84C)' : 'rgba(255,255,255,0.92)',
                    border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                }}>
                    <IconHeart size={15}
                        fill={wished ? 'var(--color-primary-text,#0a0a0a)' : 'none'}
                        color={wished ? 'var(--color-primary-text,#0a0a0a)' : '#374151'} />
                </button>

                {/* Quick-add bag button — bottom-right circle, matches the
                    Limelight reference's always-visible add-to-bag icon. */}
                <button onClick={quickAdd} disabled={adding} style={{
                    position: 'absolute', bottom: 10, right: 10, width: 36, height: 36,
                    borderRadius: '50%', background: 'rgba(255,255,255,0.95)',
                    border: 'none', cursor: adding ? 'default' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.15)', transition: 'transform 0.15s',
                    opacity: adding ? 0.6 : 1,
                }}>
                    <IconShoppingBag size={16} color="#111" />
                </button>

                {/* Dot indicators — one per photo, tap any dot to jump to
                    that image directly. Only shown when there's actually
                    more than one photo. */}
                {imgs.length > 1 && (
                    <div style={{ position: 'absolute', bottom: 10, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 4 }}>
                        {imgs.map((_, i) => (
                            <button key={i} onClick={(e) => selectImage(e, i)}
                                style={{
                                    width: i === activeImg ? 14 : 5, height: 5, borderRadius: 3,
                                    background: i === activeImg ? '#fff' : 'rgba(255,255,255,0.6)',
                                    border: 'none', cursor: 'pointer', padding: 0,
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.3)', transition: 'width 0.2s',
                                }} />
                        ))}
                    </div>
                )}

                {/* View Product — was full-width before, which covered
                    the quick-add bag icon in the bottom-right corner.
                    Now spans only the left half, leaving the icon's
                    corner clear. */}
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: '50%',
                    background: 'var(--color-dark-bg,#0a0a0a)', color: '#ffffff',
                    fontSize: 11, fontWeight: 800, padding: '10px 6px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                    transition: 'transform 0.3s ease, opacity 0.3s ease',
                    transform: hover ? 'translateY(0)' : 'translateY(100%)',
                    opacity: hover ? 1 : 0,
                    pointerEvents: 'none',
                }}>
                    <IconEye size={13} /> View
                </div>
            </div>

            {/* Info — no category eyebrow label here, matches the
                reference exactly: just the product name and price. */}
            <div style={{ padding: '12px 12px 14px' }}>
                <p style={{ fontSize: 13.5, fontWeight: 700, color: '#111', margin: '0 0 6px', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {product.name}
                </p>

                {rating > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                        <div style={{ display: 'flex', gap: 1 }}>
                            {[1,2,3,4,5].map(s => (
                                <svg key={s} width="11" height="11" viewBox="0 0 24 24" fill={s <= Math.round(rating) ? 'var(--color-primary,#C9A84C)' : '#E5E7EB'}>
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                </svg>
                            ))}
                        </div>
                        {rcount > 0 && <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600 }}>({rcount})</span>}
                    </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                        <span style={{ fontSize: 15, fontWeight: 900, color: salePct > 0 ? '#DC2626' : '#111' }}>{fmt(displayPrice)}</span>
                        {(salePct > 0 || cmp > product.price) && (
                            <span style={{ fontSize: 11.5, color: '#9CA3AF', textDecoration: 'line-through', fontWeight: 500 }}>{fmt(salePct > 0 ? origPrice : cmp)}</span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
        {showQuickView && <QuickViewModal product={product} onClose={() => setShowQuickView(false)} />}
        </>
    )
}
