import { Link, usePage } from '@inertiajs/react'
import { useState, useEffect, useRef } from 'react'
import { IconShoppingCart, IconX, IconArrowRight, IconCreditCard, IconTrash } from '@tabler/icons-react'
import { getFloatOffset } from '@/utils/floatingButtons'

interface CartLine { id: number; product_id: number; product_name: string; product_image: string | null; variant_label: string | null; price: number; quantity: number; subtotal: number }
interface Props { settings: Record<string, string> }

export default function FloatingCart({ settings }: Props) {
    const { props }     = usePage<{ cartCount?: number; cartTotal?: number; cartItems?: CartLine[] }>()
    const cartCount     = props.cartCount ?? 0
    const cartTotal     = props.cartTotal ?? 0
    // Already being shared globally on every page (HandleInertiaRequests)
    // with full name/image/variant/price detail — it just was never being
    // read here, so the panel only ever showed a bare count and total
    // instead of the actual items, unlike the reference design.
    const cartItems     = props.cartItems ?? []
    const [open, setOpen] = useState(false)
    const panelRef = useRef<HTMLDivElement>(null)

    // Auto-open when the count goes UP. A plain useRef for "previous count"
    // doesn't work for the most common case — adding the very first item
    // to an empty cart — because this component returns null and isn't
    // even mounted while the cart is empty, so it has no memory of "0"
    // to compare against once it mounts fresh already at 1. sessionStorage
    // persists across that mount/unmount boundary (and across full page
    // navigations) so the comparison actually works for every addition,
    // not just the second one onward.
    useEffect(() => {
        const key = 'ml_cart_last_count'
        const prev = Number(sessionStorage.getItem(key) ?? '0')
        if (cartCount > prev) {
            setOpen(true)
            const t = setTimeout(() => setOpen(false), 5000)
            sessionStorage.setItem(key, String(cartCount))
            return () => clearTimeout(t)
        }
        sessionStorage.setItem(key, String(cartCount))
    }, [cartCount])

    // Auto-close if the cart becomes empty (e.g. after checkout)
    useEffect(() => { if (cartCount === 0) setOpen(false) }, [cartCount])

    // Close when tapping outside the panel
    useEffect(() => {
        if (!open) return
        const handler = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [open])

    if (cartCount === 0) return null

    const bg  = settings?.cart_bubble_color || '#0a0a0a'
    const fmt = (n: number) => `Rs ${Math.round(n).toLocaleString('en-PK')}`
    // Own enable/position/size, auto-stacking with Chat/WhatsApp — previously
    // hardcoded to right:24px/bottom:96px with no way to disable or move it.
    const floatCfg = getFloatOffset(settings, 'cart', { chat: true, cart: true, whatsapp: false })
    if (!floatCfg.enabled) return null

    return (
        <>
            <style>{`
                @keyframes mlCartPop {
                    from { opacity:0; transform:scale(0.85) }
                    to   { opacity:1; transform:scale(1) }
                }
                @keyframes mlCartPanelIn {
                    from { opacity:0; transform:translateY(12px) scale(0.96) }
                    to   { opacity:1; transform:translateY(0) scale(1) }
                }
                .ml-cart-fab {
                    position: fixed;
                    z-index: 9985;
                    width: 52px; height: 52px;
                    border-radius: 50%;
                    border: none;
                    cursor: pointer;
                    display: flex; align-items: center; justify-content: center;
                    box-shadow: 0 8px 28px rgba(0,0,0,0.28);
                    animation: mlCartPop 0.3s cubic-bezier(.34,1.56,.64,1) both;
                    right: 24px;
                    bottom: 96px;
                }
                .ml-cart-badge {
                    position: absolute; top: -4px; right: -4px;
                    min-width: 20px; height: 20px; padding: 0 5px;
                    border-radius: 10px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 11px; font-weight: 900;
                }
                .ml-cart-panel {
                    position: fixed;
                    z-index: 9985;
                    width: 280px;
                    border-radius: 18px;
                    overflow: hidden;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.35);
                    animation: mlCartPanelIn 0.2s cubic-bezier(.34,1.56,.64,1) both;
                    right: 24px;
                    bottom: 158px;
                }
                @media (max-width: 1023px) {
                    .ml-cart-fab {
                        right: 16px !important;
                        bottom: calc(92px + env(safe-area-inset-bottom,0px) + 66px) !important;
                        width: 46px !important; height: 46px !important;
                    }
                    .ml-cart-panel {
                        right: 8px !important;
                        left: 8px !important;
                        width: auto !important;
                        bottom: calc(56px + env(safe-area-inset-bottom,0px) + 118px) !important;
                    }
                }
            `}</style>

            {/* Toggle button — sits directly above the chat bubble */}
            <button className="ml-cart-fab" style={{
                background: bg, width: floatCfg.diameter, height: floatCfg.diameter,
                bottom: floatCfg.bottom,
                ...(floatCfg.corner === 'left' ? { left: floatCfg.side, right: 'auto' } : { right: floatCfg.side, left: 'auto' }),
            }} onClick={() => setOpen(v => !v)} aria-label="Cart">
                {open
                    ? <IconX size={20} color="white" />
                    : <IconShoppingCart size={20} color="white" />
                }
                {!open && (
                    <span className="ml-cart-badge" style={{
                        background: 'var(--color-primary,#C9A84C)',
                        color: 'var(--color-primary-text,#0a0a0a)',
                        border: `2px solid ${bg}`,
                    }}>
                        {cartCount > 9 ? '9+' : cartCount}
                    </span>
                )}
            </button>

            {/* Preview panel */}
            {open && (
                <div className="ml-cart-panel" ref={panelRef} style={{
                    background: '#161616',
                    bottom: floatCfg.bottom + floatCfg.diameter + 10,
                    ...(floatCfg.corner === 'left' ? { left: floatCfg.side, right: 'auto' } : { right: floatCfg.side, left: 'auto' }),
                }}>
                    <div style={{ padding: '18px 18px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                            <span style={{ color: 'white', fontWeight: 900, fontSize: 14.5 }}>
                                Your Cart
                            </span>
                            <span style={{
                                background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)',
                                fontSize: 11, fontWeight: 800, padding: '3px 9px', borderRadius: 100,
                            }}>
                                {cartCount} item{cartCount !== 1 ? 's' : ''}
                            </span>
                        </div>

                        {cartTotal > 0 && (
                            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
                                <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12.5, fontWeight: 600 }}>Subtotal</span>
                                <span style={{ color: 'var(--color-primary,#C9A84C)', fontSize: 18, fontWeight: 900 }}>{fmt(cartTotal)}</span>
                            </div>
                        )}

                        {cartItems.length > 0 && (
                            <div style={{ maxHeight: 220, overflowY: 'auto', marginBottom: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {cartItems.map(item => (
                                    <div key={item.id} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                        <div style={{ width: 44, height: 44, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: 'rgba(255,255,255,0.06)' }}>
                                            {item.product_image
                                                ? <img src={item.product_image} alt={item.product_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconShoppingCart size={16} color="rgba(255,255,255,0.3)" /></div>
                                            }
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{ color: '#fff', fontSize: 12.5, fontWeight: 700, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.product_name}</p>
                                            {item.variant_label && <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: '2px 0 0' }}>{item.variant_label}</p>}
                                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, margin: '2px 0 0' }}>Qty {item.quantity} × {fmt(item.price)}</p>
                                        </div>
                                        <span style={{ color: '#fff', fontSize: 12.5, fontWeight: 800, flexShrink: 0 }}>{fmt(item.subtotal)}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <button onClick={() => setOpen(false)} style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                background: 'transparent', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.15)',
                                padding: '10px 14px', borderRadius: 11, cursor: 'pointer',
                                fontSize: 12.5, fontWeight: 700,
                            }}>
                                Continue Shopping
                            </button>
                            <Link href="/cart" onClick={() => setOpen(false)} style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                background: 'rgba(255,255,255,0.08)', color: '#fff',
                                padding: '11px 14px', borderRadius: 11,
                                textDecoration: 'none', fontSize: 13, fontWeight: 800,
                            }}>
                                View Cart <IconArrowRight size={14} />
                            </Link>
                            <Link href="/cart" onClick={() => setOpen(false)} style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                background: 'var(--color-primary,#C9A84C)', color: 'var(--color-primary-text,#0a0a0a)',
                                padding: '11px 14px', borderRadius: 11,
                                textDecoration: 'none', fontSize: 13, fontWeight: 900,
                            }}>
                                <IconCreditCard size={15} /> Checkout
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
