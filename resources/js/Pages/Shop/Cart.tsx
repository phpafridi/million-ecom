import { Head, Link, router, useForm, usePage } from '@inertiajs/react'
import { useState, useRef, useEffect } from 'react'
import {
    IconTrash, IconPlus, IconMinus, IconShoppingCart, IconArrowLeft,
    IconCheck, IconTruck, IconTag, IconUpload, IconX, IconAlertCircle,
    IconCreditCard, IconBuildingBank, IconPhone, IconBrandWhatsapp, IconLoader2
} from '@tabler/icons-react'
import StorefrontLayout from '@/Layouts/StorefrontLayout'
import { motion, AnimatePresence } from 'framer-motion'

interface CartItem {
    id: number
    product: { id: number; name: string; slug: string; price: number; stock: number; image: string | null }
    quantity: number; price: number; subtotal: number
}
interface Gateway {
    id: number; code: string; name: string; is_enabled: boolean
    logo: string | null; instructions: string | null
    bank_details?: Record<string, string> | null
}
interface Props {
    items: CartItem[]; subtotal: number; shipping: number; total: number
    discount?: number; points_discount?: number; coupon_discount?: number
    coupon_code?: string | null
    loyalty_points?: number; loyalty_value?: number; points_used?: number
    loyalty_enabled?: boolean; redeem_enabled?: boolean
    gateways: Gateway[]; settings: Record<string, string>; auth: any
    user_profile?: { name:string; email:string; phone:string; address:string; city:string } | null
}

const FIELD_ERRORS: Record<string, string> = {}

export default function Cart({ items, subtotal, shipping, total, discount=0, points_discount=0, coupon_discount=0, coupon_code=null, loyalty_points=0, loyalty_value=0, points_used=0, loyalty_enabled=true, redeem_enabled=true, user_profile, gateways, settings, auth }: Props) {
    const [step, setStep] = useState<'cart' | 'checkout' | 'payment'>(() => {
        // Lets "Buy It Now" jump straight to the checkout form instead of
        // landing on the cart page first — /cart?step=checkout
        if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('step') === 'checkout') return 'checkout'
        return 'cart'
    })
    const [proofFile, setProofFile] = useState<File | null>(null)
    const [proofPreview, setProofPreview] = useState<string | null>(null)
    const [couponCode, setCouponCode] = useState('')
    const [couponLoading, setCouponLoading] = useState(false)
    // The backend has always correctly sent success/error flash messages
    // when applying a coupon — nothing on this page ever actually read or
    // displayed them, so an invalid/expired code (or one that doesn't meet
    // the minimum order amount) failed completely silently. The customer
    // saw the loading state finish and then... nothing, with no way to know
    // why.
    const { props: pageProps } = usePage<{ flash?: { coupon_success?: string; coupon_error?: string; error?: string; success?: string } }>()
    const [couponMsg, setCouponMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
    useEffect(() => {
        if (pageProps.flash?.coupon_success) {
            setCouponMsg({ type: 'success', text: pageProps.flash.coupon_success })
        } else if (pageProps.flash?.coupon_error) {
            setCouponMsg({ type: 'error', text: pageProps.flash.coupon_error })
        }
    }, [pageProps.flash?.coupon_success, pageProps.flash?.coupon_error])

    // Checkout failures — stock, gateway, phone format, COD limits, etc. —
    // were ALL sent correctly by the backend via this same flash mechanism,
    // but nothing on this page ever read or displayed them at all. Every
    // failure just looked like a silent bounce back to the same step with
    // zero indication of why, regardless of what the actual reason was.
    const [checkoutError, setCheckoutError] = useState<string | null>(null)
    useEffect(() => {
        if (pageProps.flash?.error) setCheckoutError(pageProps.flash.error)
    }, [pageProps.flash?.error])

    const fileRef = useRef<HTMLInputElement>(null)
    const fmt = (n: number) => `Rs ${n.toLocaleString('en-PK')}`

    const { data, setData, post, processing, errors, setError, clearErrors } = useForm({
        name:    user_profile?.name    ?? auth?.user?.name  ?? '',
        phone:   user_profile?.phone   ?? '',
        email:   user_profile?.email   ?? auth?.user?.email ?? '',
        address: user_profile?.address ?? '',
        city:    user_profile?.city    ?? '',
        gateway: gateways[0]?.code ?? 'cod',
        notes:   '',
    })

    const selectedGateway = gateways.find(g => g.code === data.gateway)
    const isBankTransfer  = data.gateway === 'bank_transfer'
    const isOnlinePayment = !['cod','bank_transfer'].includes(data.gateway)
    const hasBankDetails  = isBankTransfer && selectedGateway?.bank_details && Object.values(selectedGateway.bank_details).some(v => v)

    function updateQty(id: number, qty: number) {
        router.patch(`/cart/${id}`, { quantity: qty }, { preserveScroll: true })
    }
    function removeItem(id: number) {
        router.delete(`/cart/${id}`, { preserveScroll: true })
    }

    function applyCoupon(e: React.FormEvent) {
        e.preventDefault()
        if (!couponCode.trim()) return
        setCouponLoading(true)
        setCouponMsg(null)
        router.post('/cart/coupon', { code: couponCode }, {
            preserveScroll: true,
            onFinish: () => setCouponLoading(false)
        })
    }

    function removeCoupon() {
        setCouponLoading(true)
        router.delete('/cart/coupon', {
            preserveScroll: true,
            onFinish: () => { setCouponLoading(false); setCouponCode('') }
        })
    }

    function pickProof(file: File) {
        setProofFile(file)
        setProofPreview(URL.createObjectURL(file))
    }

    // CLIENT-SIDE VALIDATION
    function validateForm(): boolean {
        clearErrors()
        let valid = true
        if (!data.name.trim()) { setError('name', 'Full name is required'); valid = false }
        if (!data.phone.trim()) { setError('phone', 'Phone number is required'); valid = false }
        else if (!/^[\d\s\+\-\(\)]{7,15}$/.test(data.phone.trim())) { setError('phone', 'Enter a valid phone number'); valid = false }
        if (!data.email.trim()) { setError('email', 'Email is required') ; valid = false }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) { setError('email', 'Enter a valid email address'); valid = false }
        if (!data.address.trim()) { setError('address', 'Delivery address is required'); valid = false }
        if (!data.city.trim()) { setError('city', 'City is required'); valid = false }
        return valid
    }

    function goToPayment(e: React.FormEvent) {
        e.preventDefault()
        if (!validateForm()) return
        if (isBankTransfer) {
            setStep('payment')
        } else {
            post('/cart/checkout')
        }
    }

    function submitWithProof(e: React.FormEvent) {
        e.preventDefault()
        if (!proofFile) return

        // Upload proof + submit order
        const form = new FormData()
        form.append('name',    data.name)
        form.append('phone',   data.phone)
        form.append('email',   data.email)
        form.append('address', data.address)
        form.append('city',    data.city)
        form.append('gateway', data.gateway)
        form.append('notes',   data.notes)
        form.append('payment_proof', proofFile)

        router.post('/cart/checkout', form as any, { forceFormData: true })
    }

    const inputCls = (err?: string) =>
        `w-full h-11 px-4 border-2 rounded-xl text-[13.5px] outline-none transition-colors ${err ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-[var(--color-primary)]'}`

    // Empty cart
    if (items.length === 0 && step === 'cart') {
        return (
            <StorefrontLayout auth={auth} settings={settings}>
                <Head title="Cart" />
                <div className="max-w-lg mx-auto px-4 py-20 text-center">
                    <div className="text-7xl mb-6">🛒</div>
                    <h2 className="font-manrope font-black text-[26px] mb-3" style={{ color: 'var(--color-body-text)' }}>Your cart is empty</h2>
                    <p className="text-gray-500 mb-8">Browse our products and add items to your cart.</p>
                    <Link href="/shop" className="inline-flex items-center gap-2 font-black text-[14px] h-12 px-8 rounded-xl no-underline"
                        style={{ background: 'var(--color-primary)', color: 'var(--color-primary-text)' }}>
                        <IconShoppingCart size={18} /> Start Shopping
                    </Link>
                </div>
            </StorefrontLayout>
        )
    }

    // STEP 3: Bank transfer proof upload
    if (step === 'payment') {
        const whatsapp = settings?.whatsapp_number ?? ''
        const bankFields = selectedGateway?.bank_details ?? {}
        const hasAny = Object.values(bankFields).some(v => v)

        return (
            <StorefrontLayout auth={auth} settings={settings}>
                <Head title="Complete Payment" />
                <div className="max-w-2xl mx-auto px-4 py-10">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        {/* Header */}
                        <div className="px-6 py-5 border-b border-gray-100" style={{ background: 'var(--color-dark-bg)' }}>
                            <h2 className="font-manrope font-black text-white text-[20px]">Complete Your Bank Transfer</h2>
                            <p className="text-white/60 text-[13px] mt-1">Transfer the amount below, then upload your payment receipt</p>
                        </div>

                        <div className="p-6 space-y-5">
                            {/* Order amount */}
                            <div className="flex items-center justify-between p-4 rounded-xl border-2"
                                style={{ borderColor: 'var(--color-primary)', background: 'var(--color-primary)08' }}>
                                <div>
                                    <div className="text-[11px] font-black uppercase tracking-wider text-gray-500">Amount to Transfer</div>
                                    <div className="font-manrope font-black text-[28px]" style={{ color: 'var(--color-primary)' }}>{fmt(total)}</div>
                                    <div className="text-[12px] text-gray-500 mt-0.5">Order for: {data.name}</div>
                                </div>
                                <IconBuildingBank size={40} className="text-gray-200"/>
                            </div>

                            {/* Bank account details */}
                            {hasAny && (
                                <div>
                                    <h3 className="font-bold text-[15px] mb-3 flex items-center gap-2" style={{ color: 'var(--color-body-text)' }}>
                                        <IconBuildingBank size={17} style={{ color: 'var(--color-primary)' }}/> Bank Account Details
                                    </h3>
                                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2.5">
                                        {Object.entries(bankFields).map(([k, v]) => v ? (
                                            <div key={k} className="flex items-center gap-3">
                                                <span className="text-[12px] font-semibold text-blue-600 min-w-[130px] capitalize">{k.replace(/_/g,' ')}:</span>
                                                <span className="font-manrope font-black text-[14px] text-blue-900 select-all cursor-text">{v}</span>
                                                <button type="button" onClick={() => navigator.clipboard.writeText(v)}
                                                    title="Copy"
                                                    className="text-[11px] text-blue-400 hover:text-blue-600 border border-blue-200 rounded px-1.5 py-0.5 bg-white cursor-pointer transition-colors">
                                                    Copy
                                                </button>
                                            </div>
                                        ) : null)}
                                        <div className="pt-2 border-t border-blue-200">
                                            <p className="text-[12px] text-blue-700">
                                                ⚠️ Include your <strong>name or phone number</strong> in the transfer description so we can match your payment.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {selectedGateway?.instructions && (
                                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-[13px] text-amber-800">
                                    📋 {selectedGateway.instructions}
                                </div>
                            )}

                            {/* Proof upload */}
                            <form onSubmit={submitWithProof}>
                                <h3 className="font-bold text-[15px] mb-3 flex items-center gap-2" style={{ color: 'var(--color-body-text)' }}>
                                    <IconUpload size={17} style={{ color: 'var(--color-primary)' }}/> Upload Payment Receipt
                                    <span className="text-red-500 text-[12px] font-normal">* Required</span>
                                </h3>

                                {proofPreview ? (
                                    <div className="relative mb-4">
                                        <img src={proofPreview} alt="Payment proof" className="w-full max-h-60 object-contain rounded-xl border border-gray-200 bg-gray-50"/>
                                        <button type="button" onClick={() => { setProofFile(null); setProofPreview(null) }}
                                            className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center border-none cursor-pointer shadow-md">
                                            <IconX size={14}/>
                                        </button>
                                        <div className="mt-2 flex items-center gap-2 text-[12.5px] text-green-600">
                                            <IconCheck size={14}/> {proofFile?.name} — Ready to submit
                                        </div>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-[var(--color-primary)] rounded-xl p-8 cursor-pointer transition-colors mb-4 group">
                                        <input ref={fileRef} type="file" accept="image/*,.pdf" className="hidden"
                                            onChange={e => { const f = e.target.files?.[0]; if (f) pickProof(f) }}/>
                                        <IconUpload size={28} className="text-gray-400 group-hover:text-[var(--color-primary)] mb-3 transition-colors"/>
                                        <div className="text-[14px] font-semibold text-gray-700 mb-1">Click to upload payment screenshot</div>
                                        <div className="text-[12px] text-gray-400">PNG, JPG, PDF — screenshot of bank transfer or mobile payment</div>
                                    </label>
                                )}

                                {/* WhatsApp alternative */}
                                {whatsapp && (
                                    <div className="p-4 bg-[#25D366]/8 border border-[#25D366]/30 rounded-xl mb-4">
                                        <p className="text-[13px] text-gray-700 font-semibold mb-2">
                                            📱 Alternatively, send receipt via WhatsApp:
                                        </p>
                                        <a href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hi, I made a bank transfer for my order. Amount: ${fmt(total)}. My name: ${data.name}. Phone: ${data.phone}`)}`}
                                            target="_blank" rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 w-full h-11 bg-[#25D366] text-white font-bold text-[13.5px] rounded-xl no-underline hover:bg-[#1da853] transition-colors">
                                            <IconBrandWhatsapp size={18}/> Send Receipt on WhatsApp
                                        </a>
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <button type="button" onClick={() => setStep('checkout')}
                                        className="flex items-center gap-2 h-12 px-5 border-2 border-gray-200 rounded-xl font-semibold text-[13px] text-gray-600 bg-white cursor-pointer hover:border-gray-300 transition-all">
                                        <IconArrowLeft size={15}/> Back
                                    </button>
                                    <button type="submit" disabled={!proofFile || processing}
                                        className="flex-1 flex items-center justify-center gap-2 h-12 font-black text-[15px] rounded-xl border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        style={{ background: 'var(--color-primary)', color: 'var(--color-primary-text)' }}>
                                        <IconCheck size={18}/>
                                        {processing ? 'Submitting Order…' : 'Confirm Order & Submit Receipt'}
                                    </button>
                                </div>
                                {!proofFile && (
                                    <p className="flex items-center gap-1.5 text-[12px] text-red-500 mt-2">
                                        <IconAlertCircle size={13}/> Please upload your payment receipt to continue
                                    </p>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </StorefrontLayout>
        )
    }

    return (
        <StorefrontLayout auth={auth} settings={settings}>
            <Head title="Cart" />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

                {/* Steps indicator */}
                <div className="flex items-center gap-2 mb-8">
                    {[
                        { n: 1, label: 'Cart',       active: step === 'cart' },
                        { n: 2, label: 'Checkout',   active: step === 'checkout' },
                        { n: 3, label: 'Payment',    active: step === 'payment' },
                    ].map((s, i) => (
                        <div key={s.n} className="flex items-center gap-2">
                            <div className={`flex items-center gap-2 text-[13px] font-semibold ${s.active ? '' : 'text-gray-400'}`}>
                                <span className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-black"
                                    style={{ background: s.active ? 'var(--color-primary)' : '#e5e7eb', color: s.active ? 'var(--color-primary-text)' : '#9ca3af' }}>
                                    {s.n}
                                </span>
                                <span className="hidden sm:block">{s.label}</span>
                            </div>
                            {i < 2 && <div className="w-8 sm:w-12 h-px bg-gray-200 mx-1"/>}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left */}
                    <div className="lg:col-span-2">

                        {/* STEP 1: Cart items */}
                        {step === 'cart' && (
                            <div className="space-y-3">
                                <AnimatePresence>
                                    {items.map(item => (
                                        <motion.div key={item.id}
                                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                                            className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4">
                                            <Link href={`/products/${item.product.slug}`} className="flex-shrink-0 no-underline">
                                                <div className="w-20 h-20 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center">
                                                    {item.product.image
                                                        ? <img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain"/>
                                                        : <IconShoppingCart size={28} className="text-gray-300"/>}
                                                </div>
                                            </Link>
                                            <div className="flex-1 min-w-0">
                                                <Link href={`/products/${item.product.slug}`}
                                                    className="font-semibold text-[14px] no-underline hover:text-[var(--color-primary)] transition-colors line-clamp-2" style={{ color: 'var(--color-body-text)' }}>
                                                    {item.product.name}
                                                </Link>
                                                <div className="text-[13px] text-gray-500 mt-0.5">{fmt(item.price)} each</div>
                                                <div className="flex items-center gap-3 mt-2">
                                                    <div className="flex items-center gap-1 border border-gray-200 rounded-xl overflow-hidden">
                                                        <button onClick={() => updateQty(item.id, Math.max(1, item.quantity - 1))}
                                                            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 border-none bg-transparent cursor-pointer">
                                                            <IconMinus size={14}/>
                                                        </button>
                                                        <span className="w-8 text-center text-[13px] font-semibold">{item.quantity}</span>
                                                        <button onClick={() => updateQty(item.id, Math.min(item.product.stock, item.quantity + 1))}
                                                            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 border-none bg-transparent cursor-pointer">
                                                            <IconPlus size={14}/>
                                                        </button>
                                                    </div>
                                                    <button onClick={() => removeItem(item.id)}
                                                        className="text-red-400 hover:text-red-600 border-none bg-transparent cursor-pointer p-1">
                                                        <IconTrash size={16}/>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="font-manrope font-black text-[16px] flex-shrink-0" style={{ color: 'var(--color-body-text)' }}>
                                                {fmt(item.subtotal)}
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                <Link href="/shop" className="flex items-center gap-2 text-[13px] font-semibold text-gray-500 hover:text-[var(--color-primary)] no-underline transition-colors mt-2">
                                    <IconArrowLeft size={15}/> Continue Shopping
                                </Link>
                            </div>
                        )}

                        {/* STEP 2: Checkout form */}
                        {step === 'checkout' && (
                            <form onSubmit={goToPayment} className="space-y-5" noValidate>

                                {checkoutError && (
                                    <div className="bg-red-50 border-2 border-red-200 text-red-700 rounded-2xl px-4 py-3.5 text-[13.5px] font-semibold flex items-start gap-2.5">
                                        <IconAlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                                        <span>{checkoutError}</span>
                                    </div>
                                )}

                                {/* Customer info */}
                                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                                    <h3 className="font-manrope font-bold text-[16px] mb-4">📦 Delivery Information</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[12.5px] font-semibold text-gray-700 mb-1.5">Full Name *</label>
                                            <input value={data.name} onChange={e => setData('name', e.target.value)}
                                                placeholder="Ali Khan" className={inputCls(errors.name)}/>
                                            {errors.name && <p className="text-[12px] text-red-500 mt-1 flex items-center gap-1"><IconAlertCircle size={12}/> {errors.name}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-[12.5px] font-semibold text-gray-700 mb-1.5">Phone Number *</label>
                                            <input value={data.phone} onChange={e => setData('phone', e.target.value)}
                                                placeholder="03001234567" type="tel" className={inputCls(errors.phone)}/>
                                            {errors.phone && <p className="text-[12px] text-red-500 mt-1 flex items-center gap-1"><IconAlertCircle size={12}/> {errors.phone}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-[12.5px] font-semibold text-gray-700 mb-1.5">Email *</label>
                                            <input value={data.email} onChange={e => setData('email', e.target.value)}
                                                placeholder="ali@email.com" type="email" required className={inputCls(errors.email)}/>
                                            {errors.email && <p className="text-[12px] text-red-500 mt-1 flex items-center gap-1"><IconAlertCircle size={12}/> {errors.email}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-[12.5px] font-semibold text-gray-700 mb-1.5">City *</label>
                                            <input value={data.city} onChange={e => setData('city', e.target.value)}
                                                placeholder="Karachi" className={inputCls(errors.city)}/>
                                            {errors.city && <p className="text-[12px] text-red-500 mt-1 flex items-center gap-1"><IconAlertCircle size={12}/> {errors.city}</p>}
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="block text-[12.5px] font-semibold text-gray-700 mb-1.5">Full Address *</label>
                                            <textarea value={data.address} onChange={e => setData('address', e.target.value)} rows={2}
                                                placeholder="House No., Street, Area — be as specific as possible"
                                                className={`w-full px-4 py-3 border-2 rounded-xl text-[13.5px] outline-none resize-none transition-colors ${errors.address ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-[var(--color-primary)]'}`}/>
                                            {errors.address && <p className="text-[12px] text-red-500 mt-1 flex items-center gap-1"><IconAlertCircle size={12}/> {errors.address}</p>}
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="block text-[12.5px] font-semibold text-gray-700 mb-1.5">Order Notes <span className="text-gray-400 font-normal">(optional)</span></label>
                                            <textarea value={data.notes} onChange={e => setData('notes', e.target.value)} rows={2}
                                                placeholder="Colour preference, delivery time, apartment buzzer code…"
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)] resize-none transition-colors"/>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment method */}
                                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                                    <h3 className="font-manrope font-bold text-[16px] mb-4">💳 Payment Method</h3>
                                    {gateways.length === 0 ? (
                                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-[13px] text-amber-800">
                                            No payment methods are currently available. Please contact us.
                                        </div>
                                    ) : (
                                        <div className="space-y-2.5">
                                            {gateways.map(gw => (
                                                <label key={gw.code}
                                                    className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${data.gateway === gw.code ? 'border-[var(--color-primary)]' : 'border-gray-200 hover:border-gray-300'}`}
                                                    style={data.gateway === gw.code ? { background: 'var(--color-primary)08' } : {}}>
                                                    <input type="radio" name="gateway" value={gw.code}
                                                        checked={data.gateway === gw.code}
                                                        onChange={() => setData('gateway', gw.code)}
                                                        className="mt-1 flex-shrink-0" style={{ accentColor: 'var(--color-primary)' }}/>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-[14px]" style={{ color: 'var(--color-body-text)' }}>{gw.name}</span>
                                                            {gw.code === 'cod' && <span className="text-[10.5px] px-2 py-0.5 rounded-full font-bold bg-green-100 text-green-700">No advance needed</span>}
                                                            {gw.code === 'bank_transfer' && <span className="text-[10.5px] px-2 py-0.5 rounded-full font-bold bg-blue-100 text-blue-700">Proof required</span>}
                                                        </div>

                                                        {/* COD description */}
                                                        {gw.code === 'cod' && data.gateway === 'cod' && (
                                                            <p className="text-[12.5px] text-gray-500 mt-1.5">Pay cash to our delivery rider when your order arrives. No advance payment needed.</p>
                                                        )}

                                                        {/* Bank transfer — show bank details inline */}
                                                        {gw.code === 'bank_transfer' && data.gateway === 'bank_transfer' && (
                                                            <div className="mt-2 space-y-2">
                                                                {gw.instructions && (
                                                                    <p className="text-[12.5px] text-gray-600">{gw.instructions}</p>
                                                                )}
                                                                {gw.bank_details && Object.values(gw.bank_details).some(v => v) ? (
                                                                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                                                                        <p className="text-[11px] font-black text-blue-600 uppercase tracking-wider mb-2">Our Bank Account</p>
                                                                        {Object.entries(gw.bank_details).map(([k, v]) => v ? (
                                                                            <div key={k} className="flex items-center gap-2 text-[12.5px] py-0.5">
                                                                                <span className="text-blue-500 capitalize min-w-[110px]">{k.replace(/_/g,' ')}:</span>
                                                                                <span className="font-bold text-blue-900">{v}</span>
                                                                            </div>
                                                                        ) : null)}
                                                                        <p className="text-[11.5px] text-blue-600 mt-2 pt-2 border-t border-blue-200">
                                                                            You will upload the payment receipt on the next step.
                                                                        </p>
                                                                    </div>
                                                                ) : (
                                                                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[12.5px] text-amber-700">
                                                                        Bank details not configured. Contact us on WhatsApp for account details.
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}

                                                        {/* Other gateways */}
                                                        {!['cod','bank_transfer'].includes(gw.code) && gw.instructions && data.gateway === gw.code && (
                                                            <p className="text-[12.5px] text-gray-500 mt-1.5">{gw.instructions}</p>
                                                        )}
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-3">
                                    <button type="button" onClick={() => setStep('cart')}
                                        className="flex items-center gap-2 h-12 px-6 border-2 border-gray-200 rounded-xl font-semibold text-[13px] text-gray-600 bg-white cursor-pointer hover:border-gray-300 transition-all">
                                        <IconArrowLeft size={16}/> Back
                                    </button>
                                    <button type="submit" disabled={processing || gateways.length === 0}
                                        className="flex-1 flex items-center justify-center gap-2 h-12 font-black text-[14px] rounded-xl border-none cursor-pointer disabled:opacity-90 transition-all"
                                        style={{ background: 'var(--color-primary)', color: 'var(--color-primary-text)' }}>
                                        {processing
                                            ? <IconLoader2 size={18} className="animate-spin" />
                                            : <IconCheck size={18}/>
                                        }
                                        {isBankTransfer ? 'Continue to Upload Receipt →' : processing ? 'Placing Your Order…' : `Place Order — ${fmt(total)}`}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Full-screen processing overlay — a disabled button with
                        changed text alone doesn't read as "something is
                        genuinely happening" on a slower connection; this
                        gives clear, reassuring feedback instead of leaving
                        the customer wondering if their click even registered. */}
                    {processing && !isBankTransfer && (
                        <div className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ background: 'rgba(10,10,10,0.55)', backdropFilter: 'blur(3px)' }}>
                            <div className="bg-white rounded-2xl px-10 py-9 flex flex-col items-center gap-4 shadow-2xl mx-4 max-w-[320px] text-center">
                                <div className="relative w-14 h-14">
                                    <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
                                    <div className="absolute inset-0 rounded-full border-4 border-transparent animate-spin"
                                        style={{ borderTopColor: 'var(--color-primary)', borderRightColor: 'var(--color-primary)' }}></div>
                                </div>
                                <div>
                                    <p className="font-manrope font-black text-[15px]" style={{ color: 'var(--color-body-text)' }}>Placing your order</p>
                                    <p className="text-[12.5px] text-gray-500 mt-1">Just a moment — don't close this window</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Right: Order summary */}
                    <div>
                        <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-[130px]">
                            <h3 className="font-manrope font-bold text-[15px] mb-4">Order Summary</h3>

                            {/* Cart items mini list */}
                            <div className="space-y-2.5 mb-4 max-h-48 overflow-y-auto">
                                {items.map(item => (
                                    <div key={item.id} className="flex items-center gap-2.5">
                                        {item.product.image && (
                                            <img src={item.product.image} className="w-9 h-9 rounded-lg object-contain bg-gray-50 border border-gray-100 flex-shrink-0" alt=""/>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <div className="text-[12px] font-semibold text-gray-800 truncate">{item.product.name}</div>
                                            <div className="text-[11.5px] text-gray-400">× {item.quantity}</div>
                                        </div>
                                        <div className="text-[12.5px] font-bold flex-shrink-0">{fmt(item.subtotal)}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-2 border-t border-gray-100 pt-3 text-[13.5px]">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-semibold">{fmt(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span className="flex items-center gap-1.5"><IconTruck size={14}/> Shipping</span>
                                    <span className="font-semibold">{shipping === 0 ? <span className="text-green-600">Free</span> : fmt(shipping)}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-green-600 font-semibold">
                                        <span>✓ Discount</span>
                                        <span>-{fmt(discount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between font-black text-[16px] pt-2 border-t border-gray-100">
                                    <span>Total</span>
                                    <span style={{ color: 'var(--color-primary)' }}>{fmt(total)}</span>
                                </div>
                            </div>

                            {/* Coupon */}
                            {step === 'cart' && (
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    {coupon_code ? (
                                        // Was previously always showing the "apply" input even
                                        // after a coupon was already applied — no indication a
                                        // coupon was active, and no way to remove it at all.
                                        <div className="flex items-center justify-between px-3 h-9 rounded-xl border-2" style={{ borderColor: 'var(--color-primary)', background: 'rgba(201,168,76,0.06)' }}>
                                            <span className="text-[12.5px] font-bold text-green-700">✓ Coupon "{coupon_code}" applied</span>
                                            <button type="button" onClick={removeCoupon} disabled={couponLoading}
                                                className="text-[11px] font-bold text-red-500 bg-transparent border-none cursor-pointer disabled:opacity-50 underline">
                                                {couponLoading ? '…' : 'Remove'}
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <form onSubmit={applyCoupon} className="flex gap-2">
                                                <input value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())}
                                                    placeholder="Coupon code" maxLength={30}
                                                    className="flex-1 h-9 px-3 border border-gray-200 rounded-xl text-[12.5px] font-mono outline-none focus:border-[var(--color-primary)] uppercase"/>
                                                <button type="submit" disabled={couponLoading || !couponCode.trim()}
                                                    className="h-9 px-3 font-bold text-[12px] rounded-xl border-none cursor-pointer disabled:opacity-50"
                                                    style={{ background: 'var(--color-primary)', color: 'var(--color-primary-text)' }}>
                                                    {couponLoading ? '…' : 'Apply'}
                                                </button>
                                            </form>
                                            {couponMsg && (
                                                <p className={`text-[11.5px] font-semibold mt-2 ${couponMsg.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                                                    {couponMsg.type === 'success' ? '✓ ' : '⚠ '}{couponMsg.text}
                                                </p>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}

                            {step === 'cart' && auth?.user && loyalty_enabled && redeem_enabled && loyalty_points > 0 && (
                                <div className="mt-4 p-4 rounded-xl border-2 border-dashed" style={{ borderColor:'var(--color-primary,#C9A84C)', background:'rgba(201,168,76,0.06)' }}>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[13px] font-bold text-gray-800">🪙 Loyalty Points</p>
                                            <p className="text-[11px] text-gray-500 mt-0.5">{loyalty_points} pts ≈ Rs {loyalty_value.toLocaleString('en-PK')} discount</p>
                                        </div>
                                        {points_used > 0 ? (
                                            <button type="button" onClick={() => router.post('/cart/points/remove', {}, { preserveScroll:true })} className="text-[11px] font-bold text-red-500 border border-red-200 rounded-lg px-3 py-1.5 bg-white cursor-pointer">Remove</button>
                                        ) : (
                                            <button type="button" onClick={() => router.post('/cart/points/redeem', { points: loyalty_points }, { preserveScroll:true })} className="text-[12px] font-black rounded-lg px-3 py-1.5 border-none cursor-pointer" style={{ background:'var(--color-primary,#C9A84C)', color:'var(--color-primary-text,#0a0a0a)' }}>Use Points</button>
                                        )}
                                    </div>
                                    {points_used > 0 && (
                                        <div className="mt-2 flex items-center gap-2 text-[12px] font-semibold text-green-700 bg-green-50 rounded-lg px-3 py-2">✓ {points_used} points applied — Rs {points_discount.toLocaleString('en-PK')} off</div>
                                    )}
                                </div>
                            )}
                            {step === 'cart' && (
                                <button onClick={() => setStep('checkout')} disabled={items.length === 0}
                                    className="w-full mt-5 h-12 flex items-center justify-center gap-2 font-black text-[14px] rounded-xl border-none cursor-pointer disabled:opacity-50 transition-all"
                                    style={{ background: 'var(--color-primary)', color: 'var(--color-primary-text)' }}>
                                    Proceed to Checkout →
                                </button>
                            )}

                            {shipping > 0 && parseFloat(settings?.delivery_threshold ?? '0') > 0 && (
                                <p className="text-[11.5px] text-gray-400 mt-3 text-center">
                                    Add {fmt(parseFloat(settings.delivery_threshold) - subtotal)} more for free shipping
                                </p>
                            )}

                            {/* Trust signals */}
                            <div className="mt-5 pt-4 border-t border-gray-100 space-y-2">
                                {['🔒 Secure & encrypted checkout','📦 Fast delivery to your door','↩️ 7-day easy returns'].map(t => (
                                    <div key={t} className="flex items-center gap-2 text-[12px] text-gray-500">
                                        <span>{t}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </StorefrontLayout>
    )
}
