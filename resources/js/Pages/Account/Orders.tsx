import { Head, Link, router } from '@inertiajs/react'
import StorefrontLayout from '@/Layouts/StorefrontLayout'
import AccountSidebar from './Partials/AccountSidebar'
import { IconPackage, IconChevronRight, IconTruck, IconFilter } from '@tabler/icons-react'
import { useState } from 'react'

interface Order {
    id: number; tracking_token: string; status: string
    payment_status: string; payment_method: string
    total: number; items_count: number; created_at: string
}
interface Props {
    orders: { data: Order[]; current_page: number; last_page: number; total: number }
    filters: { status?: string }
    settings: Record<string, string>
    auth: any
}

const STATUS_COLOR: Record<string, string> = {
    pending:    'bg-amber-50 text-amber-700 border-amber-200',
    processing: 'bg-blue-50 text-blue-700 border-blue-200',
    shipped:    'bg-purple-50 text-purple-700 border-purple-200',
    delivered:  'bg-green-50 text-green-700 border-green-200',
    cancelled:  'bg-red-50 text-red-600 border-red-200',
}

const STATUSES = ['', 'pending', 'processing', 'shipped', 'delivered', 'cancelled']

export default function AccountOrders({ orders, filters, settings, auth }: Props) {
    const fmt = (n: number) => `Rs ${Number(n).toLocaleString('en-PK')}`
    const [status, setStatus] = useState(filters.status ?? '')

    function filter(s: string) {
        setStatus(s)
        router.get('/account/orders', s ? { status: s } : {}, { preserveState: true })
    }

    return (
        <StorefrontLayout auth={auth} settings={settings}>
            <Head title="My Orders" />
            <div className="min-h-screen py-0 lg:py-8 px-0 lg:px-4" style={{ background: 'var(--color-body-bg)' }}>
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
                        <AccountSidebar auth={auth} active="orders" />

                        <div className="lg:col-span-3 space-y-4 px-4 pt-5 lg:px-0 lg:pt-0">
                            <div className="bg-white rounded-2xl border border-gray-100 p-5">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="font-black text-[18px]" style={{ color: 'var(--color-body-text)' }}>
                                        My Orders
                                        <span className="text-gray-400 font-normal text-[13px] ml-2">({orders.total})</span>
                                    </h2>
                                </div>

                                {/* Status Filter */}
                                <div className="flex gap-2 flex-wrap mb-5">
                                    {STATUSES.map(s => (
                                        <button key={s} onClick={() => filter(s)}
                                            className="h-8 px-3 rounded-lg text-[12px] font-bold border cursor-pointer transition-all"
                                            style={status === s
                                                ? { background: 'var(--color-primary)', color: 'var(--color-primary-text)', borderColor: 'var(--color-primary)' }
                                                : { background: 'white', color: '#6B7280', borderColor: '#E5E7EB' }}>
                                            {s === '' ? 'All Orders' : s.charAt(0).toUpperCase() + s.slice(1)}
                                        </button>
                                    ))}
                                </div>

                                {/* Orders List */}
                                {orders.data.length === 0 ? (
                                    <div className="text-center py-16">
                                        <IconPackage size={44} className="text-gray-200 mx-auto mb-4" />
                                        <p className="text-gray-400 text-[14px] mb-4">No orders found.</p>
                                        <Link href="/shop"
                                            className="inline-flex items-center gap-2 font-bold text-[13px] h-10 px-5 rounded-xl no-underline"
                                            style={{ background: 'var(--color-primary)', color: 'var(--color-primary-text)' }}>
                                            Start Shopping →
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {orders.data.map(order => (
                                            <Link key={order.id} href={`/account/orders/${order.id}`}
                                                className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all no-underline group">
                                                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                                                    style={{ background: 'var(--color-primary)' + '15' }}>
                                                    <IconTruck size={20} style={{ color: 'var(--color-primary)' }} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-0.5">
                                                        <p className="font-bold text-[14px]" style={{ color: 'var(--color-body-text)' }}>
                                                            {(order as any).order_number ?? `Order #${order.id}`}
                                                        </p>
                                                        {order.tracking_token && (
                                                            <span className="font-mono text-[10px] text-gray-400">#{order.tracking_token}</span>
                                                        )}
                                                    </div>
                                                    <p className="text-gray-400 text-[12px]">
                                                        {order.items_count} item{order.items_count !== 1 ? 's' : ''} · {order.created_at} · {order.payment_method?.replace('_', ' ')}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-3 shrink-0">
                                                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${STATUS_COLOR[order.status] || ''}`}>
                                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                    </span>
                                                    <p className="font-black text-[15px]" style={{ color: 'var(--color-body-text)' }}>
                                                        {fmt(order.total)}
                                                    </p>
                                                    <IconChevronRight size={16} className="text-gray-300 group-hover:text-gray-400" />
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}

                                {/* Pagination */}
                                {orders.last_page > 1 && (
                                    <div className="flex justify-center gap-2 mt-6">
                                        {Array.from({ length: orders.last_page }, (_, i) => i + 1).map(page => (
                                            <button key={page}
                                                onClick={() => router.get('/account/orders', { ...filters, page })}
                                                className="w-9 h-9 rounded-lg text-[13px] font-bold border cursor-pointer transition-all"
                                                style={page === orders.current_page
                                                    ? { background: 'var(--color-primary)', color: 'var(--color-primary-text)', borderColor: 'var(--color-primary)' }
                                                    : { background: 'white', color: '#6B7280', borderColor: '#E5E7EB' }}>
                                                {page}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </StorefrontLayout>
    )
}
