import { Link, router, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { IconHeart, IconEye } from '@tabler/icons-react'
import type { Product } from '@/types'

interface Props { product: Product; whatsapp?: string }

export default function ProductCard({ product, whatsapp }: Props) {
    const { props }           = usePage<{ wishlistIds?: number[] }>()
    const wishIds             = Array.isArray(props?.wishlistIds) ? props.wishlistIds : []
    const [wished, setWished] = useState(wishIds.includes(product.id))
    const [hover, setHover]   = useState(false)

    const imgs   = Array.isArray(product.images) && product.images.length > 0
        ? product.images : [{ id: 0, url: '/images/placeholder.jpg', thumb: '/images/placeholder.jpg' }]
    const img1   = imgs[0]?.url ?? '/images/placeholder.jpg'
    const img2   = imgs[1]?.url ?? null
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

    return (
        <Link href={`/products/${product.slug}`}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                display: 'block', textDecoration: 'none', borderRadius: 16,
                overflow: 'hidden', background: 'white',
                boxShadow: hover ? '0 12px 40px rgba(0,0,0,0.12)' : '0 2px 12px rgba(0,0,0,0.06)',
                transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                transform: hover ? 'translateY(-4px)' : 'translateY(0)',
            }}>

            {/* Image */}
            <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', background: '#F5F5F3' }}>

                <img src={img1} alt={product.name} loading="lazy" style={{
                    position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
                    transition: 'opacity 0.4s, transform 0.6s',
                    opacity: hover && img2 ? 0 : 1,
                    transform: hover ? 'scale(1.06)' : 'scale(1)',
                }} />

                {img2 && <img src={img2} alt={product.name} loading="lazy" style={{
                    position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
                    transition: 'opacity 0.4s, transform 0.6s',
                    opacity: hover ? 1 : 0,
                    transform: hover ? 'scale(1.06)' : 'scale(1.03)',
                }} />}

                {/* Discount */}
                {disc > 0 && (
                    <div style={{
                        position: 'absolute', top: 10, left: 10,
                        background: 'var(--color-primary,#C9A84C)', color: 'var(--color-primary-text,#0a0a0a)',
                        fontSize: 10, fontWeight: 800, padding: '4px 8px', borderRadius: 100,
                    }}>-{disc}%</div>
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

                {/* View Product — slides up on hover */}
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    background: 'var(--color-dark-bg,#0a0a0a)', color: '#ffffff',
                    fontSize: 12, fontWeight: 800, padding: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                    transition: 'transform 0.3s ease, opacity 0.3s ease',
                    transform: hover ? 'translateY(0)' : 'translateY(100%)',
                    opacity: hover ? 1 : 0,
                }}>
                    <IconEye size={14} /> View Product
                </div>
            </div>

            {/* Info */}
            <div style={{ padding: '12px 12px 14px' }}>
                <p style={{ fontSize: 9.5, fontWeight: 800, color: 'var(--color-primary,#C9A84C)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 4px' }}>
                    {product.category?.name ?? ''}
                </p>
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
    )
}
