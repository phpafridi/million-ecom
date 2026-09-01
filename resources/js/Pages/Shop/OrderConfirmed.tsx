import { Head, Link } from '@inertiajs/react'
import { IconCheck, IconShoppingBag, IconHome, IconPhone, IconBrandWhatsapp, IconClock, IconCreditCard } from '@tabler/icons-react'
import StorefrontLayout from '@/Layouts/StorefrontLayout'

interface OrderItemLine {
    product_name: string; variant_label?: string | null
    quantity: number; price: number; subtotal: number
}
interface Order {
    id: number; order_number?: string; tracking_token?: string
    total: number; payment_method: string
    payment_status: string; status: string
    customer_name: string; customer_phone: string; items_count: number
    items?: OrderItemLine[]
    subtotal?: number; shipping?: number; discount?: number; coupon_code?: string | null
}
interface Props { order: Order | null; auth: any; settings: Record<string, string> }

const PAYMENT_LABELS: Record<string, string> = {
    cod: 'Cash on Delivery', bank_transfer: 'Bank Transfer',
    jazzcash: 'JazzCash', easypaisa: 'Easypaisa', safepay: 'Safepay',
    stripe: 'Stripe (Card)', paypal: 'PayPal', razorpay: 'Razorpay',
    paystack: 'Paystack', flutterwave: 'Flutterwave',
}

export default function OrderConfirmed({ order, auth, settings }: Props) {
    const fmt      = (n: number) => `Rs ${Number(n).toLocaleString('en-PK')}`
    const displayNum = order?.order_number ?? `#${order?.id}`
    const whatsapp = settings?.whatsapp_number ?? ''
    const phone    = settings?.phone ?? ''
    const isPaid   = order?.payment_status === 'paid'
    const isCOD    = order?.payment_method === 'cod'
    const isBank   = order?.payment_method === 'bank_transfer'
    const method   = PAYMENT_LABELS[order?.payment_method ?? ''] ?? order?.payment_method ?? ''

    const waMsg = order ? encodeURIComponent(
        `Hi, I placed order ${displayNum} for ${fmt(order.total)} via ${method}. Please confirm. Name: ${order.customer_name}, Phone: ${order.customer_phone}`
    ) : ''

    return (
        <StorefrontLayout auth={auth} settings={settings}>
            <Head title="Order Confirmed" />
            <div className="max-w-xl mx-auto px-4 py-12 sm:py-20">

                {/* Success icon */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg"
                        style={{ background: 'var(--color-primary)' }}>
                        <IconCheck size={38} style={{ color: 'var(--color-primary-text)' }}/>
                    </div>
                    <h1 className="font-manrope font-black text-[28px] sm:text-[32px] text-gray-900 mb-2">Order Placed!</h1>
                    <p className="text-gray-500 text-[15px]">
                        {order ? `${displayNum} confirmed — ${order.items_count} item${order.items_count !== 1 ? 's' : ''}` : 'Your order has been received.'}
                    </p>
                </div>

                {order && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-5">

                        {/* Line items — previously the confirmation page only
                            showed a bare item count and the final total, no
                            product names, variants, or discount breakdown at
                            all. This is effectively the customer's receipt. */}
                        {order.items && order.items.length > 0 && (
                            <div className="p-5 border-b border-gray-100 space-y-3">
                                {order.items.map((item, i) => (
                                    <div key={i} className="flex justify-between items-start gap-3">
                                        <div className="min-w-0">
                                            <p className="text-[13.5px] font-semibold text-gray-900 truncate">{item.product_name}</p>
                                            {item.variant_label && (
                                                <p className="text-[12px] text-gray-500 mt-0.5">{item.variant_label}</p>
                                            )}
                                            <p className="text-[12px] text-gray-400 mt-0.5">{fmt(item.price)} × {item.quantity}</p>
                                        </div>
                                        <span className="text-[13.5px] font-bold text-gray-900 whitespace-nowrap">{fmt(item.subtotal)}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Order summary */}
                        <div className="p-5 border-b border-gray-100">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-[13px] font-semibold text-gray-600">Order Number</span>
                                <span className="font-manrope font-black text-[15px]">{displayNum}</span>
                            </div>
                            {typeof order.subtotal === 'number' && (
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-[13px] font-semibold text-gray-600">Subtotal</span>
                                    <span className="text-[13.5px] text-gray-900">{fmt(order.subtotal)}</span>
                                </div>
                            )}
                            {!!order.discount && order.discount > 0 && (
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-[13px] font-semibold text-green-600">Discount{order.coupon_code ? ` (${order.coupon_code})` : ''}</span>
                                    <span className="text-[13.5px] font-semibold text-green-600">-{fmt(order.discount)}</span>
                                </div>
                            )}
                            {typeof order.shipping === 'number' && (
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-[13px] font-semibold text-gray-600">Shipping</span>
                                    <span className="text-[13.5px] text-gray-900">{order.shipping > 0 ? fmt(order.shipping) : 'Free'}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-[13px] font-semibold text-gray-600">Total</span>
                                <span className="font-manrope font-black text-[18px]" style={{ color: 'var(--color-primary)' }}>{fmt(order.total)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[13px] font-semibold text-gray-600">Payment Method</span>
                                <span className="font-semibold text-[13.5px] text-gray-900">{method}</span>
                            </div>
                        </div>

                        {/* Payment status block */}
                        <div className={`p-5 ${isPaid ? 'bg-green-50' : isCOD ? 'bg-amber-50' : isBank ? 'bg-blue-50' : 'bg-gray-50'}`}>
                            <div className="flex items-start gap-3">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isPaid ? 'bg-green-100' : isCOD ? 'bg-amber-100' : 'bg-blue-100'}`}>
                                    {isPaid ? <IconCheck size={18} className="text-green-600"/>
                                    : isCOD  ? <IconClock size={18} className="text-amber-600"/>
                                    : <IconCreditCard size={18} className="text-blue-600"/>}
                                </div>
                                <div>
                                    {isPaid && (
                                        <>
                                            <p className="font-bold text-[14px] text-green-800">✓ Payment Confirmed</p>
                                            <p className="text-[12.5px] text-green-700 mt-0.5">Your payment was received. We're preparing your order.</p>
                                        </>
                                    )}
                                    {!isPaid && isCOD && (
                                        <>
                                            <p className="font-bold text-[14px] text-amber-800">Cash on Delivery</p>
                                            <p className="text-[12.5px] text-amber-700 mt-0.5">Pay <strong>{fmt(order.total)}</strong> in cash when your order arrives at your door. No advance payment needed.</p>
                                        </>
                                    )}
                                    {!isPaid && isBank && (
                                        <>
                                            <p className="font-bold text-[14px] text-blue-800">⏳ Awaiting Payment Confirmation</p>
                                            <p className="text-[12.5px] text-blue-700 mt-0.5">We received your order and payment receipt. We'll confirm once the transfer is verified (usually within 1-2 hours).</p>
                                        </>
                                    )}
                                    {!isPaid && !isCOD && !isBank && (
                                        <>
                                            <p className="font-bold text-[14px] text-gray-800">⏳ Payment Pending</p>
                                            <p className="text-[12.5px] text-gray-600 mt-0.5">Your order is placed. Payment status will update once confirmed by the gateway.</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* What happens next */}
                        <div className="p-5 border-t border-gray-100">
                            <p className="text-[11.5px] font-black text-gray-400 uppercase tracking-wider mb-3">What Happens Next</p>
                            <div className="space-y-2.5">
                                {[
                                    { n: '1', text: isPaid ? 'Order confirmed & being prepared' : isCOD ? 'We confirm your order & prepare it' : isBank ? 'We verify your payment receipt' : 'Payment verified by gateway', done: isPaid },
                                    { n: '2', text: 'We contact you to confirm delivery details', done: false },
                                    { n: '3', text: 'Order dispatched & delivered to you', done: false },
                                ].map(s => (
                                    <div key={s.n} className="flex items-center gap-3">
                                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black flex-shrink-0 ${s.done ? 'text-white' : 'bg-gray-100 text-gray-500'}`}
                                            style={s.done ? { background: 'var(--color-primary)', color: 'var(--color-primary-text)' } : {}}>
                                            {s.done ? '✓' : s.n}
                                        </span>
                                        <span className={`text-[12.5px] ${s.done ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>{s.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Contact buttons */}
                <div className="space-y-2.5 mb-6">
                    {whatsapp && (
                        <a href={`https://wa.me/${whatsapp}?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2.5 h-12 w-full bg-[#25D366] text-white font-bold text-[14px] rounded-xl no-underline hover:bg-[#1da853] transition-colors">
                            <IconBrandWhatsapp size={20}/> Contact Us on WhatsApp
                        </a>
                    )}
                    {phone && (
                        <a href={`tel:${phone}`}
                            className="flex items-center justify-center gap-2.5 h-11 w-full border-2 border-gray-200 text-gray-700 font-semibold text-[13.5px] rounded-xl no-underline hover:border-gray-300 transition-colors">
                            <IconPhone size={16}/> Call Us: {phone}
                        </a>
                    )}
                </div>

                {/* Nav buttons */}
                <div className="flex gap-3">
                    <Link href="/"
                        className="flex-1 flex items-center justify-center gap-2 h-11 border-2 border-gray-200 rounded-xl font-semibold text-[13px] text-gray-600 no-underline hover:border-gray-300 transition-all">
                        <IconHome size={15}/> Home
                    </Link>
                    <Link href="/shop"
                        className="flex-1 flex items-center justify-center gap-2 h-11 font-black text-[13px] rounded-xl no-underline transition-all"
                        style={{ background: 'var(--color-primary)', color: 'var(--color-primary-text)' }}>
                        <IconShoppingBag size={15}/> Shop More
                    </Link>
                </div>
            </div>
        </StorefrontLayout>
    )
}
