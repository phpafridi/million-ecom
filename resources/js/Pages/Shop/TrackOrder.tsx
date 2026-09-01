import { useState } from 'react'
import { Head, useForm, usePage } from '@inertiajs/react'
import StorefrontLayout from '@/Layouts/StorefrontLayout'
import { IconSearch, IconPackage, IconTruck, IconCheck, IconX, IconClock, IconMapPin, IconReceipt } from '@tabler/icons-react'

interface TrackingStep { key: string; label: string; done: boolean; active: boolean }
interface OrderItem { name: string; variant_label?: string | null; quantity: number; price: number; subtotal: number; image?: string }
interface TrackingHistory { status: string; note?: string; created_by: string; date: string }

interface TrackingResult {
    id: number
    tracking_token: string
    customer_name: string
    customer_phone: string
    status: string
    payment_status: string
    payment_method: string
    subtotal: number
    shipping: number
    discount: number
    total: number
    created_at: string
    current_step: number
    steps: TrackingStep[]
    cancelled: boolean
    items: OrderItem[]
    history: TrackingHistory[]
}

interface Props {
    order?: TrackingResult
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

export default function TrackOrder({ order: initialOrder, settings, auth }: Props) {
    const { props } = usePage<any>()
    const flashResult = props.flash?.tracking_result as TrackingResult | undefined
    const flashError  = props.flash?.tracking_error as string | undefined

    const order = flashResult || initialOrder
    const fmt = (n: number) => `Rs ${Number(n).toLocaleString('en-PK')}`

    const { data, setData, post, processing } = useForm({ query: '' })

    return (
        <StorefrontLayout auth={auth} settings={settings}>
            <Head title="Track Your Order" />

            <div className="min-h-screen py-10 px-4" style={{ background: 'var(--color-body-bg)' }}>
                <div className="max-w-3xl mx-auto">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
                            style={{ background: 'var(--color-primary)' }}>
                            <IconTruck size={32} color="white" />
                        </div>
                        <h1 className="font-black text-3xl mb-2" style={{ color: 'var(--color-dark-bg)' }}>
                            Track Your Order
                        </h1>
                        <p className="text-gray-500 text-[15px]">
                            Enter your tracking number, order ID, or phone number
                        </p>
                    </div>

                    {/* Search Box */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
                        <form onSubmit={e => { e.preventDefault(); post('/track-order') }}>
                            <div className="flex gap-3">
                                <div className="flex-1 relative">
                                    <IconSearch size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={data.query}
                                        onChange={e => setData('query', e.target.value)}
                                        placeholder="e.g. ABC123XYZ or 03001234567"
                                        className="w-full pl-11 pr-4 h-12 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:ring-2 focus:border-transparent"
                                        style={{ '--tw-ring-color': 'var(--color-primary)' } as any}
                                    />
                                </div>
                                <button type="submit" disabled={processing}
                                    className="h-12 px-6 rounded-xl font-bold text-[14px] disabled:opacity-60 transition-opacity"
                                    style={{ background: 'var(--color-primary)', color: 'var(--color-primary-text)' }}>
                                    {processing ? 'Searching...' : 'Track'}
                                </button>
                            </div>
                        </form>

                        {flashError && (
                            <div className="mt-4 flex items-center gap-2 text-red-600 bg-red-50 rounded-xl px-4 py-3 text-[13.5px]">
                                <IconX size={16} /> {flashError}
                            </div>
                        )}
                    </div>

                    {/* Result */}
                    {order && (
                        <div className="space-y-4">

                            {/* Status Card */}
                            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                                <div className="flex items-start justify-between mb-5">
                                    <div>
                                        <p className="text-gray-400 text-[12px] font-semibold uppercase tracking-wide mb-1">Order #{order.id}</p>
                                        <p className="font-black text-xl" style={{ color: 'var(--color-dark-bg)' }}>
                                            {order.customer_name}
                                        </p>
                                        <p className="text-gray-400 text-[13px] mt-0.5">{order.customer_phone} · {order.created_at}</p>
                                    </div>
                                    <span className={`text-[12px] font-bold px-3 py-1 rounded-full border ${STATUS_COLOR[order.status] || ''}`}>
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                </div>

                                {/* Tracking Token */}
                                <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2.5 mb-6">
                                    <span className="text-[12px] text-gray-500 font-medium">Tracking #:</span>
                                    <span className="font-mono font-bold text-[13px]" style={{ color: 'var(--color-primary)' }}>
                                        {order.tracking_token}
                                    </span>
                                </div>

                                {/* Progress Stepper */}
                                {!order.cancelled ? (
                                    <div className="relative">
                                        {/* Line */}
                                        <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-100" />
                                        <div
                                            className="absolute top-6 left-6 h-0.5 transition-all duration-700"
                                            style={{
                                                background: 'var(--color-primary)',
                                                width: `${order.current_step === 0 ? 0 : (order.current_step / 3) * 100}%`,
                                                right: 'auto',
                                            }}
                                        />

                                        <div className="relative flex justify-between">
                                            {order.steps.map((step, i) => {
                                                const Icon = STEP_ICONS[i]
                                                return (
                                                    <div key={step.key} className="flex flex-col items-center gap-2 w-1/4">
                                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all
                                                            ${step.done ? 'border-transparent text-white' : 'border-gray-200 text-gray-300 bg-white'}
                                                            ${step.active ? 'ring-4 ring-offset-2' : ''}`}
                                                            style={{
                                                                background: step.done ? 'var(--color-primary)' : undefined,
                                                                ['--tw-ring-color' as any]: 'var(--color-primary)',
                                                            }}>
                                                            <Icon size={20} />
                                                        </div>
                                                        <span className={`text-[11px] font-bold text-center leading-tight
                                                            ${step.active ? '' : step.done ? 'text-gray-600' : 'text-gray-300'}`}
                                                            style={step.active ? { color: 'var(--color-primary)' } : {}}>
                                                            {step.label}
                                                        </span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-5 py-4">
                                        <IconX size={22} className="text-red-500 shrink-0" />
                                        <div>
                                            <p className="font-bold text-red-600 text-[14px]">Order Cancelled</p>
                                            <p className="text-red-400 text-[12px] mt-0.5">This order has been cancelled.</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Order Items */}
                            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                                <h3 className="font-black text-[16px] mb-4" style={{ color: 'var(--color-dark-bg)' }}>
                                    Order Items
                                </h3>
                                <div className="space-y-3">
                                    {order.items.map((item, i) => (
                                        <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                                            {item.image ? (
                                                <img src={item.image} className="w-14 h-14 rounded-xl object-cover bg-gray-50" />
                                            ) : (
                                                <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center">
                                                    <IconPackage size={20} className="text-gray-300" />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-[13.5px] text-gray-800 truncate">{item.name}</p>
                                                {item.variant_label && (
                                                    <p className="text-gray-500 text-[11.5px] mt-0.5">{item.variant_label}</p>
                                                )}
                                                <p className="text-gray-400 text-[12px] mt-0.5">Qty: {item.quantity} × {fmt(item.price)}</p>
                                            </div>
                                            <p className="font-bold text-[14px]" style={{ color: 'var(--color-dark-bg)' }}>
                                                {fmt(item.subtotal)}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* Summary */}
                                <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                                    <div className="flex justify-between text-[13px] text-gray-500">
                                        <span>Subtotal</span><span>{fmt(order.subtotal)}</span>
                                    </div>
                                    {order.shipping > 0 && (
                                        <div className="flex justify-between text-[13px] text-gray-500">
                                            <span>Shipping</span><span>{fmt(order.shipping)}</span>
                                        </div>
                                    )}
                                    {order.discount > 0 && (
                                        <div className="flex justify-between text-[13px] text-green-600">
                                            <span>Discount</span><span>-{fmt(order.discount)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between font-black text-[16px] pt-2 border-t border-gray-100">
                                        <span style={{ color: 'var(--color-dark-bg)' }}>Total</span>
                                        <span style={{ color: 'var(--color-primary)' }}>{fmt(order.total)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Status History */}
                            {order.history.length > 0 && (
                                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                                    <h3 className="font-black text-[16px] mb-5" style={{ color: 'var(--color-dark-bg)' }}>
                                        Tracking History
                                    </h3>
                                    <div className="relative space-y-0">
                                        {order.history.map((h, i) => (
                                            <div key={i} className="flex gap-4 pb-6 last:pb-0">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-3 h-3 rounded-full mt-1 shrink-0"
                                                        style={{ background: i === 0 ? 'var(--color-primary)' : '#D1D5DB' }} />
                                                    {i < order.history.length - 1 && (
                                                        <div className="w-px flex-1 bg-gray-100 mt-1" />
                                                    )}
                                                </div>
                                                <div className="pb-1">
                                                    <p className="font-bold text-[13.5px] capitalize" style={{ color: 'var(--color-dark-bg)' }}>
                                                        {h.status}
                                                    </p>
                                                    {h.note && <p className="text-gray-500 text-[12.5px] mt-0.5">{h.note}</p>}
                                                    <p className="text-gray-400 text-[11.5px] mt-1">{h.date} · {h.created_by}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    )}

                    {/* Help text */}
                    {!order && !flashError && (
                        <div className="text-center py-8 text-gray-400 text-[13.5px]">
                            <IconReceipt size={40} className="mx-auto mb-3 text-gray-200" />
                            <p>Your tracking number is in your order confirmation email or SMS.</p>
                        </div>
                    )}
                </div>
            </div>
        </StorefrontLayout>
    )
}
