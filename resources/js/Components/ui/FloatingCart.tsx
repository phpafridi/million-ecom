import { Link, usePage } from '@inertiajs/react'
import { useState, useEffect, useRef } from 'react'
import { IconShoppingCart, IconX, IconArrowRight, IconCreditCard } from '@tabler/icons-react'

interface Props { settings: Record<string, string> }

export default function FloatingCart({ settings }: Props) {
    const { props }     = usePage<{ cartCount?: number; cartTotal?: number }>()
    const cartCount     = props.cartCount ?? 0
    const cartTotal     = props.cartTotal ?? 0
    const [open, setOpen] = useState(false)
    const panelRef = useRef<HTMLDivElement>(null)

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
                        bottom: calc(56px + env(safe-area-inset-bottom,0px) + 66px) !important;
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
            <button className="ml-cart-fab" style={{ background: bg }} onClick={() => setOpen(v => !v)} aria-label="Cart">
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
                <div className="ml-cart-panel" ref={panelRef} style={{ background: '#161616' }}>
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

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
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
