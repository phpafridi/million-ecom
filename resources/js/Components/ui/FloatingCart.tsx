import { Link, usePage } from '@inertiajs/react'
import { useState, useEffect } from 'react'
import { IconShoppingCart, IconX, IconArrowRight, IconCreditCard } from '@tabler/icons-react'

interface Props { settings: Record<string, string> }

export default function FloatingCart({ settings }: Props) {
    const { props }           = usePage<{ cartCount?: number; cartTotal?: number }>()
    const cartCount           = props.cartCount ?? 0
    const cartTotal           = props.cartTotal ?? 0
    const [dismissed, setDismiss] = useState(false)
    const [visible, setVisible]   = useState(false)

    useEffect(() => {
        if (cartCount > 0 && !dismissed) setVisible(true)
        if (cartCount === 0) { setVisible(false); setDismiss(false) }
    }, [cartCount, dismissed])

    if (!visible) return null

    const bg  = settings?.cart_bubble_color || '#0a0a0a'
    const fmt = (n: number) => `Rs ${Math.round(n).toLocaleString('en-PK')}`

    return (
        <>
            <style>{`
                @keyframes mlFCSlideUp {
                    from { opacity:0; transform:translateX(-50%) translateY(24px) }
                    to   { opacity:1; transform:translateX(-50%) translateY(0) }
                }
                .ml-fc {
                    position: fixed;
                    bottom: 28px;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 9980;
                    display: flex;
                    align-items: stretch;
                    border-radius: 100px;
                    overflow: hidden;
                    box-shadow: 0 12px 44px rgba(0,0,0,0.30);
                    animation: mlFCSlideUp 0.4s cubic-bezier(.34,1.56,.64,1) both;
                }
                @media (max-width: 1023px) {
                    .ml-fc {
                        bottom: calc(56px + env(safe-area-inset-bottom,0px) + 10px);
                        left: 12px;
                        right: 12px;
                        transform: none;
                        border-radius: 16px;
                        width: auto;
                    }
                }
            `}</style>

            <div className="ml-fc">

                {/* Left — dark section: icon + count + total */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 11,
                    background: bg, padding: '12px 18px', flex: 1, minWidth: 0,
                }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: 9,
                        background: 'rgba(255,255,255,0.12)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        position: 'relative', flexShrink: 0,
                    }}>
                        <IconShoppingCart size={18} color="white" />
                        <span style={{
                            position: 'absolute', top: -6, right: -6,
                            background: 'var(--color-primary,#C9A84C)',
                            color: 'var(--color-primary-text,#0a0a0a)',
                            width: 18, height: 18, borderRadius: '50%',
                            fontSize: 10, fontWeight: 900,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: `2px solid ${bg}`,
                        }}>
                            {cartCount > 9 ? '9+' : cartCount}
                        </span>
                    </div>
                    <div style={{ minWidth: 0 }}>
                        <div style={{ color: 'white', fontSize: 13, fontWeight: 800, lineHeight: 1.2, whiteSpace: 'nowrap' }}>
                            {cartCount} item{cartCount !== 1 ? 's' : ''} in cart
                        </div>
                        {cartTotal > 0 && (
                            <div style={{ color: 'var(--color-primary,#C9A84C)', fontSize: 11.5, fontWeight: 700, marginTop: 1 }}>
                                {fmt(cartTotal)}
                            </div>
                        )}
                    </div>
                </div>

                {/* View Cart — clearly visible white text on slightly lighter bg */}
                <Link href="/cart" style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    background: 'rgba(255,255,255,0.18)',
                    color: '#ffffff',
                    padding: '0 16px',
                    textDecoration: 'none',
                    fontSize: 12.5, fontWeight: 800,
                    whiteSpace: 'nowrap',
                    borderLeft: '1px solid rgba(255,255,255,0.12)',
                }}>
                    View Cart <IconArrowRight size={13} />
                </Link>

                {/* Checkout — gold */}
                <Link href="/cart" style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    background: 'var(--color-primary,#C9A84C)',
                    color: 'var(--color-primary-text,#0a0a0a)',
                    padding: '0 18px',
                    textDecoration: 'none',
                    fontSize: 13, fontWeight: 900,
                    whiteSpace: 'nowrap',
                }}>
                    <IconCreditCard size={15} /> Checkout
                </Link>

                {/* Dismiss */}
                <button onClick={() => setDismiss(true)} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 40, flexShrink: 0,
                    background: 'rgba(0,0,0,0.25)',
                    border: 'none', color: 'rgba(255,255,255,0.7)',
                    cursor: 'pointer', padding: 0,
                }}>
                    <IconX size={14} />
                </button>

            </div>
        </>
    )
}
