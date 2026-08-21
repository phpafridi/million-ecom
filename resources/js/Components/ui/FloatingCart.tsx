import { useState, useEffect } from 'react'
import { Link, router, usePage } from '@inertiajs/react'
import { IconX, IconShoppingCart, IconTrash, IconMinus, IconPlus, IconLock, IconBrandWhatsapp } from '@tabler/icons-react'

interface CartItem {
    id: number
    product_id: number
    product_name: string
    product_image?: string
    variant_label?: string
    price: number
    quantity: number
    subtotal: number
}

interface Props {
    settings: Record<string, string>
}

export default function FloatingCart({ settings }: Props) {
    const { props } = usePage<{ cartCount?: number; cartItems?: CartItem[]; cartTotal?: number; cartSubtotal?: number }>()
    const cartCount = props.cartCount ?? 0
    const cartItems = props.cartItems ?? []
    const cartTotal = props.cartTotal ?? 0
    const [open, setOpen] = useState(false)
    const [prevCount, setPrev] = useState(0)

    const cartColor = settings?.cart_bubble_color || 'var(--color-dark-bg, #0a0a0a)'
    const cartIcon  = settings?.cart_bubble_icon  || '🛒'
    const freeAbove = parseFloat(settings?.free_delivery_above || '5000')
    const delivery  = parseFloat(settings?.delivery_fee || '200')
    const fmt       = (n: number) => `Rs ${Number(n).toLocaleString('en-PK')}`
    const remaining = Math.max(0, freeAbove - cartTotal)
    const wa        = settings?.whatsapp_number || ''

    // Auto-open when item added
    useEffect(() => {
        if (cartCount > prevCount && prevCount >= 0) {
            setOpen(true)
        }
        if (cartCount === 0) {
            setOpen(false)
        }
        setPrev(cartCount)
    }, [cartCount])

    // Close on route change
    useEffect(() => {
        const off = router.on('start', () => setOpen(false))
        return off
    }, [])

    function updateQty(id: number, qty: number) {
        if (qty < 1) { removeItem(id); return }
        router.patch(`/cart/${id}`, { quantity: qty }, { preserveScroll: true, preserveState: true })
    }

    function removeItem(id: number) {
        router.delete(`/cart/${id}`, { preserveScroll: true, preserveState: true })
    }

    // WhatsApp order message
    const waMsg = cartItems.length > 0
        ? encodeURIComponent(`Hi! I want to order:\n${cartItems.map(i => `• ${i.product_name} x${i.quantity} = ${fmt(i.subtotal)}`).join('\n')}\n\nTotal: ${fmt(cartTotal)}`)
        : ''

    return (
        <>
            {/* Cart toggle button — only show when cart has items */}
            {cartCount > 0 && <button
                onClick={() => setOpen(o => !o)}
                style={{
                    position: 'fixed', bottom: 24, right: 88, zIndex: 9980,
                    width: 52, height: 52, borderRadius: '50%',
                    background: cartColor,
                    border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                    transition: 'transform 0.2s',
                }}>
                <IconShoppingCart size={22} color="white" />
                {cartCount > 0 && (
                    <span style={{
                        position: 'absolute', top: -4, right: -4,
                        background: '#EF4444', color: 'white',
                        borderRadius: '50%', width: 20, height: 20,
                        fontSize: 11, fontWeight: 800,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '2px solid white',
                    }}>{cartCount > 9 ? '9+' : cartCount}</span>
                )}
            </button>}

            {/* Backdrop */}
            {open && (
                <div
                    onClick={() => setOpen(false)}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 9981, backdropFilter: 'blur(2px)' }}
                />
            )}

            {/* Slide-in cart panel */}
            <div style={{
                position: 'fixed', top: 0, right: 0, bottom: 0,
                width: 'clamp(320px, 90vw, 400px)',
                background: 'white',
                zIndex: 9982,
                display: 'flex', flexDirection: 'column',
                transform: open ? 'translateX(0)' : 'translateX(100%)',
                transition: 'transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)',
                boxShadow: '-8px 0 40px rgba(0,0,0,0.15)',
            }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', borderBottom: '1px solid #F3F4F6' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <IconShoppingCart size={20} style={{ color: 'var(--color-primary)' }} />
                        <span style={{ fontWeight: 800, fontSize: 17, color: '#111' }}>Cart</span>
                        {cartCount > 0 && (
                            <span style={{ background: 'var(--color-primary)', color: 'var(--color-primary-text, #0a0a0a)', borderRadius: '50%', width: 24, height: 24, fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cartCount}</span>
                        )}
                    </div>
                    <button onClick={() => setOpen(false)} style={{ background: '#F3F4F6', border: 'none', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IconX size={16} color="#374151" />
                    </button>
                </div>

                {/* Free delivery progress */}
                {cartCount > 0 && freeAbove > 0 && (
                    <div style={{ padding: '10px 20px', background: '#F9FAFB', borderBottom: '1px solid #F3F4F6' }}>
                        {remaining > 0 ? (
                            <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>
                                Add <span style={{ fontWeight: 800, color: 'var(--color-primary)' }}>{fmt(remaining)}</span> more for free delivery
                            </p>
                        ) : (
                            <p style={{ fontSize: 12, color: '#10B981', fontWeight: 700, margin: 0 }}>✅ You qualify for free delivery!</p>
                        )}
                        <div style={{ height: 4, background: '#E5E7EB', borderRadius: 100, marginTop: 6, overflow: 'hidden' }}>
                            <div style={{ height: '100%', borderRadius: 100, background: 'var(--color-primary)', width: `${Math.min(100, (cartTotal / freeAbove) * 100)}%`, transition: 'width 0.4s' }} />
                        </div>
                    </div>
                )}

                {/* Items */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px' }}>
                    {cartItems.length === 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9CA3AF', gap: 12 }}>
                            <IconShoppingCart size={52} style={{ opacity: 0.2 }} />
                            <p style={{ fontWeight: 700, fontSize: 15, margin: 0 }}>Your cart is empty</p>
                            <Link href="/shop" onClick={() => setOpen(false)}
                                style={{ background: 'var(--color-primary)', color: 'var(--color-primary-text, #0a0a0a)', fontWeight: 800, fontSize: 13, padding: '10px 24px', borderRadius: 100, textDecoration: 'none' }}>
                                Shop Now
                            </Link>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {cartItems.map(item => (
                                <div key={item.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                    {/* Image */}
                                    <div style={{ width: 72, height: 90, borderRadius: 10, overflow: 'hidden', flexShrink: 0, background: '#F5F5F3' }}>
                                        {item.product_image ? (
                                            <img src={item.product_image} alt={item.product_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>👕</div>}
                                    </div>
                                    {/* Details */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontWeight: 700, fontSize: 13.5, color: '#111', margin: '0 0 2px', lineHeight: 1.3 }}>{item.product_name}</p>
                                        {item.variant_label && <p style={{ fontSize: 11.5, color: '#9CA3AF', margin: '0 0 6px' }}>{item.variant_label}</p>}
                                        <p style={{ fontWeight: 800, fontSize: 14, color: 'var(--color-primary)', margin: '0 0 10px' }}>{fmt(item.price)}</p>
                                        {/* Qty controls */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '1.5px solid #E5E7EB', borderRadius: 100, width: 'fit-content', overflow: 'hidden' }}>
                                            <button onClick={() => updateQty(item.id, item.quantity - 1)}
                                                style={{ width: 32, height: 32, background: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#374151' }}>
                                                <IconMinus size={13} />
                                            </button>
                                            <span style={{ padding: '0 10px', fontWeight: 800, fontSize: 13, color: '#111', minWidth: 28, textAlign: 'center' }}>{item.quantity}</span>
                                            <button onClick={() => updateQty(item.id, item.quantity + 1)}
                                                style={{ width: 32, height: 32, background: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#374151' }}>
                                                <IconPlus size={13} />
                                            </button>
                                        </div>
                                    </div>
                                    {/* Remove + subtotal */}
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
                                        <button onClick={() => removeItem(item.id)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 4 }}>
                                            <IconTrash size={15} />
                                        </button>
                                        <span style={{ fontWeight: 800, fontSize: 13, color: '#111' }}>{fmt(item.subtotal)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {cartItems.length > 0 && (
                    <div style={{ borderTop: '1px solid #F3F4F6', padding: '16px 20px', background: 'white' }}>
                        {/* Subtotal/delivery/total */}
                        <div style={{ marginBottom: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#6B7280' }}>
                                <span>Subtotal</span><span style={{ fontWeight: 600, color: '#111' }}>{fmt(cartTotal)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#6B7280' }}>
                                <span>Delivery</span>
                                <span style={{ fontWeight: 600, color: remaining === 0 ? '#10B981' : '#111' }}>{remaining === 0 ? 'FREE' : fmt(delivery)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 800, color: '#111', paddingTop: 8, borderTop: '1px solid #F3F4F6', marginTop: 2 }}>
                                <span>Total</span>
                                <span style={{ color: 'var(--color-primary)' }}>{fmt(remaining === 0 ? cartTotal : cartTotal + delivery)}</span>
                            </div>
                        </div>

                        {/* Checkout button */}
                        <Link href="/cart/checkout" onClick={() => setOpen(false)}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'var(--color-dark-bg, #0a0a0a)', color: 'white', fontWeight: 800, fontSize: 14, padding: '14px', borderRadius: 14, textDecoration: 'none', marginBottom: 10 }}>
                            <IconLock size={16} /> Checkout
                        </Link>

                        {/* WhatsApp Order */}
                        {wa && (
                            <a href={`https://wa.me/${wa}?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#25D366', color: 'white', fontWeight: 800, fontSize: 14, padding: '14px', borderRadius: 14, textDecoration: 'none' }}>
                                <IconBrandWhatsapp size={18} /> WhatsApp Order
                            </a>
                        )}

                        <Link href="/cart" onClick={() => setOpen(false)}
                            style={{ display: 'block', textAlign: 'center', marginTop: 10, fontSize: 12.5, color: '#9CA3AF', textDecoration: 'none', fontWeight: 600 }}>
                            View full cart →
                        </Link>
                    </div>
                )}
            </div>
        </>
    )
}
