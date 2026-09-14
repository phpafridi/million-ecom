import { Head } from '@inertiajs/react'
import { useState, useEffect, ReactNode } from 'react'
import { motion } from 'framer-motion'
import StorefrontLayout from '@/Layouts/StorefrontLayout'
import AccountSidebar from './Partials/AccountSidebar'
import { IconScissors, IconMapPin, IconCalendar, IconCash, IconAlertCircle, IconClipboardCheck, IconPackage, IconCircleCheck, IconX } from '@tabler/icons-react'

interface TailorOrder {
    order_number: string
    franchise: string
    garment_type: string
    quantity: number
    status: string
    status_label: string
    order_date: string
    promised_date: string | null
    ready_date: string | null
    delivered_date: string | null
    total_price: number
    advance_paid: number
    balance_due: number
}

interface Props {
    settings: Record<string, string>
    auth: any
}

const STATUS_COLOR: Record<string, string> = {
    pending:      'bg-gray-50 text-gray-600 border-gray-200',
    received:     'bg-gray-50 text-gray-600 border-gray-200',
    in_process:   'bg-blue-50 text-blue-700 border-blue-200',
    ready:        'bg-purple-50 text-purple-700 border-purple-200',
    delivered:    'bg-green-50 text-green-700 border-green-200',
    cancelled:    'bg-red-50 text-red-600 border-red-200',
}

// One small animated icon per status, shown next to the badge — distinct
// motion for each stage so the order's progress reads at a glance, not
// just from the text label.
// Large, prominent animated status display — a proper visual moment per
// stage rather than a small badge icon, using motion+color+scale instead
// of hand-drawn scenes (which risk looking inconsistent/amateurish at
// small sizes — this stays reliably clean across every status).
function StatusHero({ status }: { status: string }) {
    const configs: Record<string, { bg: string; ring: string; icon: ReactNode }> = {
        pending: {
            bg: '#F3F4F6', ring: '#D1D5DB',
            icon: (
                <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.8, repeat: Infinity }}>
                    <IconClipboardCheck size={30} color="#6B7280" />
                </motion.div>
            ),
        },
        received: {
            bg: '#F3F4F6', ring: '#D1D5DB',
            icon: (
                <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.8, repeat: Infinity }}>
                    <IconClipboardCheck size={30} color="#6B7280" />
                </motion.div>
            ),
        },
        in_process: {
            bg: '#EFF6FF', ring: '#BFDBFE',
            icon: (
                <motion.div animate={{ rotate: [0, -18, 18, 0] }} transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}>
                    <IconScissors size={30} color="#2563EB" />
                </motion.div>
            ),
        },
        ready: {
            bg: '#FAF5FF', ring: '#E9D5FF',
            icon: (
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}>
                    <IconPackage size={30} color="#9333EA" />
                </motion.div>
            ),
        },
        delivered: {
            bg: '#F0FDF4', ring: '#BBF7D0',
            icon: (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 350, damping: 14 }}>
                    <IconCircleCheck size={30} color="#16A34A" />
                </motion.div>
            ),
        },
        cancelled: {
            bg: '#FEF2F2', ring: '#FECACA',
            icon: <IconX size={30} color="#DC2626" />,
        },
    }
    const cfg = configs[status] ?? configs.pending
    const isActive = status === 'in_process' || status === 'ready' || status === 'pending' || status === 'received'

    return (
        <div className="relative flex-shrink-0" style={{ width: 64, height: 64 }}>
            {isActive && (
                <motion.div
                    animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                    className="absolute inset-0 rounded-full"
                    style={{ background: cfg.ring }}
                />
            )}
            <div className="relative w-full h-full rounded-full flex items-center justify-center border-2"
                style={{ background: cfg.bg, borderColor: cfg.ring }}>
                {cfg.icon}
            </div>
        </div>
    )
}

export default function TailorOrders({ settings, auth }: Props) {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [orders, setOrders] = useState<TailorOrder[]>([])
    const [found, setFound] = useState(true)

    useEffect(() => {
        fetch('/api/tailor-status', { headers: { 'Accept': 'application/json' } })
            .then(res => {
                if (!res.ok) throw new Error('failed')
                return res.json()
            })
            .then(data => {
                setFound(data.found ?? false)
                setOrders(data.orders ?? [])
            })
            .catch(() => setError('Could not load your tailor orders right now. Please try again shortly.'))
            .finally(() => setLoading(false))
    }, [])

    const fmt = (n: number) => `Rs ${Number(n).toLocaleString('en-PK')}`
    const fmtDate = (d: string | null) => d ? new Date(d).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

    return (
        <StorefrontLayout auth={auth} settings={settings}>
            <Head title="Tailor Orders" />

            <div className="lg:flex max-w-7xl mx-auto">
                <AccountSidebar auth={auth} />

                <div className="flex-1 p-4 sm:p-6 lg:p-8">
                    <div className="flex items-center gap-2.5 mb-6">
                        <IconScissors size={22} style={{ color: 'var(--color-primary)' }} />
                        <h1 className="font-manrope font-black text-[22px] sm:text-[26px]">Tailor Orders</h1>
                    </div>

                    {loading && (
                        <div className="flex items-center gap-2 text-gray-400 text-[13px] py-10 justify-center">
                            <div className="w-4 h-4 border-2 border-gray-300 border-t-[var(--color-primary)] rounded-full animate-spin" />
                            Loading your tailor orders...
                        </div>
                    )}

                    {!loading && error && (
                        <div className="flex flex-col items-center gap-3 py-16 text-center">
                            <IconAlertCircle size={32} className="text-gray-300" />
                            <p className="text-gray-500 text-[13.5px] max-w-xs">{error}</p>
                        </div>
                    )}

                    {!loading && !error && !found && (
                        <div className="flex flex-col items-center gap-3 py-16 text-center">
                            <IconScissors size={32} className="text-gray-300" />
                            <p className="text-gray-700 font-semibold text-[14px]">No tailor orders found</p>
                            <p className="text-gray-400 text-[13px] max-w-xs">
                                Tailor orders placed at any Millionaire branch will show up here once matched to your account by phone or email.
                            </p>
                        </div>
                    )}

                    {!loading && !error && found && orders.length === 0 && (
                        <div className="flex flex-col items-center gap-3 py-16 text-center">
                            <IconScissors size={32} className="text-gray-300" />
                            <p className="text-gray-500 text-[13.5px]">You don't have any tailor orders yet.</p>
                        </div>
                    )}

                    {!loading && !error && orders.length > 0 && (
                        <div className="space-y-4">
                            {orders.map(order => (
                                <div key={order.order_number} className="bg-white border border-gray-100 rounded-2xl p-5">
                                    <div className="flex items-start gap-4 mb-4">
                                        <StatusHero status={order.status} />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-start justify-between gap-2">
                                                <div>
                                                    <p className="font-bold text-[15px]">{order.garment_type} × {order.quantity}</p>
                                                    <p className="text-[12px] text-gray-400 mt-0.5">Order #{order.order_number}</p>
                                                </div>
                                                <span className={`text-[11px] font-bold px-3 py-1.5 rounded-full border ${STATUS_COLOR[order.status] ?? 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                                                    {order.status_label}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1.5 text-[12.5px] text-gray-500 mb-4">
                                        <IconMapPin size={14} />
                                        {order.franchise}
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 pb-4 border-b border-gray-50">
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">Ordered</p>
                                            <p className="text-[12.5px] font-semibold flex items-center gap-1"><IconCalendar size={12} />{fmtDate(order.order_date)}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">Promised</p>
                                            <p className="text-[12.5px] font-semibold flex items-center gap-1"><IconCalendar size={12} />{fmtDate(order.promised_date)}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">Ready</p>
                                            <p className="text-[12.5px] font-semibold flex items-center gap-1"><IconCalendar size={12} />{fmtDate(order.ready_date)}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">Delivered</p>
                                            <p className="text-[12.5px] font-semibold flex items-center gap-1"><IconCalendar size={12} />{fmtDate(order.delivered_date)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between flex-wrap gap-2">
                                        <div className="flex items-center gap-1.5 text-[12.5px] text-gray-500">
                                            <IconCash size={14} />
                                            Total {fmt(order.total_price)} · Paid {fmt(order.advance_paid)}
                                        </div>
                                        {order.balance_due > 0 ? (
                                            <span className="text-[12.5px] font-bold text-red-600">Balance due: {fmt(order.balance_due)}</span>
                                        ) : (
                                            <span className="text-[12.5px] font-bold text-green-600">Fully paid</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </StorefrontLayout>
    )
}
