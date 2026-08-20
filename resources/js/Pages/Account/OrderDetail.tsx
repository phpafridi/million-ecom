import { Head, Link } from '@inertiajs/react'
import StorefrontLayout from '@/Layouts/StorefrontLayout'
import AccountSidebar from './Partials/AccountSidebar'
import { IconArrowLeft, IconPackage, IconTruck, IconCheck, IconX, IconClock, IconCopy } from '@tabler/icons-react'
import { useState } from 'react'

interface Props {
    order: any
    settings: Record<string, string>
    auth: any
}

const STEP_ICONS = [IconPackage, IconClock, IconTruck, IconCheck]
const STATUS_COLOR: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    processing: 'bg-blue-50 text-blue-700 border-blue-200',
    shipped: 'bg-purple-50 text-purple-700 border-purple-200',
    delivered: 'bg-green-50 text-green-700 border-green-200',
    cancelled: 'bg-red-50 text-red-600 border-red-200',
}
const STEPS = ['pending', 'processing', 'shipped', 'delivered']
const STEP_LABELS = ['Order Placed', 'Processing', 'Shipped', 'Delivered']

export default function OrderDetail({ order, settings, auth }: Props) {
    const fmt = (n: number) => `Rs ${Number(n).toLocaleString('en-PK')}`
    const [copied, setCopied] = useState(false)

    const copyToken = () => {
        navigator.clipboard.writeText(order.tracking_token)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <StorefrontLayout auth={auth} settings={settings}>
            <Head title={`Order #${order.id}`} />
            <div className="min-h-screen py-8 px-4" style={{ background: 'var(--color-body-bg)' }}>
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
                        <AccountSidebar auth={auth} active="orders" />

                        <div className="lg:col-span-3 space-y-4">

                            {/* Back */}
                            <Link href="/account/orders" className="inline-flex items-center gap-2 text-[13px] font-semibold text-gray-500 no-underline hover:text-gray-700">
                                <IconArrowLeft size={16} /> Back to Orders
                            </Link>

                            {/* Header */}
                            <div className="bg-white rounded-2xl border border-gray-100 p-5">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h2 className="font-black text-xl" style={{ color: 'var(--color-dark-bg)' }}>Order #{order.id}</h2>
                                        <p className="text-gray-400 text-[13px] mt-0.5">Placed on {order.created_at}</p>
                                    </div>
                                    <span className={`text-[12px] font-bold px-3 py-1 rounded-full border ${STATUS_COLOR[order.status] || ''}`}>
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                </div>

                                {/* Tracking Token */}
                                <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 mb-5">
                                    <div>
                                        <p className="text-[11px] text-gray-400 font-medium">Tracking Number</p>
                                        <p className="font-mono font-black text-[15px]" style={{ color: 'var(--color-primary)' }}>
                                            {order.tracking_token}
                                        </p>
                                    </div>
                                    <button onClick={copyToken}
                                        className="flex items-center gap-1.5 text-[12px] font-semibold px-3 py-2 rounded-lg border border-gray-200 hover:bg-white transition-colors">
                                        <IconCopy size={13} />
                                        {copied ? 'Copied!' : 'Copy'}
                                    </button>
                                </div>

                                {/* Progress */}
                                {!order.cancelled ? (
                                    <div className="relative">
                                        <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-100" />
                                        <div className="absolute top-5 left-5 h-0.5 transition-all duration-700"
                                            style={{
                                                background: 'var(--color-primary)',
                                                width: order.current_step === 0 ? '0%' : `${(order.current_step / 3) * 100}%`,
                                            }} />
                                        <div className="relative flex justify-between">
                                            {STEPS.map((s, i) => {
                                                const Icon = STEP_ICONS[i]
                                                const done = i <= order.current_step
                                                const active = i === order.current_step
                                                return (
                                                    <div key={s} className="flex flex-col items-center gap-2 w-1/4">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all
                                                            ${done ? 'border-transparent text-white' : 'border-gray-200 text-gray-300 bg-white'}
                                                            ${active ? 'ring-4 ring-offset-1' : ''}`}
                                                            style={{
                                                                background: done ? 'var(--color-primary)' : undefined,
                                                                ['--tw-ring-color' as any]: 'var(--color-primary)' + '30',
                                                            }}>
                                                            <Icon size={18} />
                                                        </div>
                                                        <span className={`text-[11px] font-bold text-center ${active ? '' : done ? 'text-gray-500' : 'text-gray-300'}`}
                                                            style={active ? { color: 'var(--color-primary)' } : {}}>
                                                            {STEP_LABELS[i]}
                                                        </span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3 bg-red-50 rounded-xl px-4 py-3">
                                        <IconX size={18} className="text-red-500" />
                                        <p className="font-bold text-red-600 text-[13.5px]">This order was cancelled</p>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Items */}
                                <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:col-span-2">
                                    <h3 className="font-black text-[15px] mb-4" style={{ color: 'var(--color-dark-bg)' }}>Items</h3>
                                    <div className="space-y-3">
                                        {order.items.map((item: any, i: number) => (
                                            <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                                                {item.image ? (
                                                    <img src={item.image} className="w-14 h-14 rounded-xl object-cover bg-gray-50 shrink-0" />
                                                ) : (
                                                    <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                                                        <IconPackage size={18} className="text-gray-300" />
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-[13px] truncate" style={{ color: 'var(--color-dark-bg)' }}>{item.name}</p>
                                                    <p className="text-gray-400 text-[11.5px]">Qty {item.quantity} × {fmt(item.price)}</p>
                                                </div>
                                                <p className="font-bold text-[13.5px] shrink-0" style={{ color: 'var(--color-dark-bg)' }}>{fmt(item.subtotal)}</p>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Totals */}
                                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                                        <div className="flex justify-between text-[12.5px] text-gray-500"><span>Subtotal</span><span>{fmt(order.subtotal)}</span></div>
                                        {order.shipping > 0 && <div className="flex justify-between text-[12.5px] text-gray-500"><span>Shipping</span><span>{fmt(order.shipping)}</span></div>}
                                        {order.discount > 0 && (
                                            <div className="flex justify-between text-[12.5px] text-green-600">
                                                <span>Discount {order.coupon_code && `(${order.coupon_code})`}</span>
                                                <span>-{fmt(order.discount)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between font-black text-[15px] pt-2 border-t border-gray-100">
                                            <span style={{ color: 'var(--color-dark-bg)' }}>Total</span>
                                            <span style={{ color: 'var(--color-primary)' }}>{fmt(order.total)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Delivery Info */}
                                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                                    <h3 className="font-black text-[15px] mb-3" style={{ color: 'var(--color-dark-bg)' }}>Delivery</h3>
                                    <div className="space-y-2 text-[13px]">
                                        <p className="font-semibold">{order.customer_name}</p>
                                        <p className="text-gray-500">{order.customer_phone}</p>
                                        {order.customer_email && <p className="text-gray-500">{order.customer_email}</p>}
                                        <p className="text-gray-500">{order.customer_address}</p>
                                        {order.city && <p className="text-gray-500">{order.city}</p>}
                                    </div>
                                </div>

                                {/* Payment Info */}
                                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                                    <h3 className="font-black text-[15px] mb-3" style={{ color: 'var(--color-dark-bg)' }}>Payment</h3>
                                    <div className="space-y-2 text-[13px]">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Method</span>
                                            <span className="font-semibold capitalize">{order.payment_method.replace('_', ' ')}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Status</span>
                                            <span className={`font-bold capitalize ${order.payment_status === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>
                                                {order.payment_status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Status History */}
                            {order.history?.length > 0 && (
                                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                                    <h3 className="font-black text-[15px] mb-4" style={{ color: 'var(--color-dark-bg)' }}>Status History</h3>
                                    <div className="space-y-0">
                                        {order.history.map((h: any, i: number) => (
                                            <div key={i} className="flex gap-4 pb-5 last:pb-0">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0"
                                                        style={{ background: i === 0 ? 'var(--color-primary)' : '#D1D5DB' }} />
                                                    {i < order.history.length - 1 && <div className="w-px flex-1 bg-gray-100 mt-1" />}
                                                </div>
                                                <div className="pb-1 min-w-0">
                                                    <p className="font-bold text-[13px] capitalize" style={{ color: 'var(--color-dark-bg)' }}>{h.status}</p>
                                                    {h.note && <p className="text-gray-500 text-[12px] mt-0.5">{h.note}</p>}
                                                    <p className="text-gray-400 text-[11px] mt-1">{h.date}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </StorefrontLayout>
    )
}
