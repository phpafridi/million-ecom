import { Head, Link, router, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { IconSearch, IconEye, IconTrash, IconPackage, IconChevronDown } from '@tabler/icons-react'
import AdminLayout from '@/Layouts/AdminLayout'

interface Order {
    id: number; customer_name: string; customer_phone: string; customer_email: string | null
    payment_method: string; payment_status: string; status: string
    subtotal: number; shipping: number; total: number; created_at: string
    items: { id: number; product_name: string; quantity: number; price: number; subtotal: number }[]
}
interface Props {
    orders: { data: Order[]; total: number; current_page: number; last_page: number }
    filters: { q?: string; status?: string }
}

const STATUS_COLORS: Record<string, string> = {
    pending:    'bg-amber-50  text-amber-700  border-amber-200',
    processing: 'bg-blue-50   text-blue-700   border-blue-200',
    shipped:    'bg-purple-50 text-purple-700 border-purple-200',
    delivered:  'bg-green-50  text-green-700  border-green-200',
    cancelled:  'bg-red-50    text-red-600    border-red-200',
}
const PAY_COLORS: Record<string, string> = {
    pending:  'bg-amber-50 text-amber-600 border-amber-200',
    paid:     'bg-green-50 text-green-600 border-green-200',
    failed:   'bg-red-50   text-red-600   border-red-200',
    refunded: 'bg-gray-100 text-gray-600  border-gray-200',
}

export default function OrdersIndex({ orders, filters }: Props) {
    const { props } = usePage<{ adminPath?: string }>()
    const ap = `/${props.adminPath ?? 'ml-admin'}`
    const [search, setSearch] = useState(filters.q ?? '')
    const fmt = (n: number) => `Rs ${Number(n).toLocaleString('en-PK')}`

    function doSearch(e: React.FormEvent) {
        e.preventDefault()
        router.get(`${ap}/orders`, { q: search, status: filters.status }, { preserveState: true })
    }

    function setStatus(status: string) {
        router.get(`${ap}/orders`, { q: filters.q, status: status || undefined }, { preserveState: true })
    }

    function updateStatus(id: number, status: string) {
        router.patch(`${ap}/orders/${id}`, { status }, { preserveScroll: true })
    }

    function del(id: number) {
        if (!confirm('Delete this order permanently?')) return
        router.delete(`${ap}/orders/${id}`)
    }

    return (
        <AdminLayout title="Orders">
            <Head title="Orders — Admin" />

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
                <form onSubmit={doSearch} className="flex flex-1 min-w-[200px] max-w-sm bg-white border border-gray-200 rounded-xl overflow-hidden h-10 focus-within:border-[var(--color-primary)] transition-colors">
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, phone, ID…" className="flex-1 px-4 text-[13px] outline-none border-none" />
                    <button type="submit" className="px-4 text-[var(--color-primary)] border-none bg-transparent cursor-pointer"><IconSearch size={17} /></button>
                </form>
                <div className="flex gap-1.5 flex-wrap">
                    {['', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                        <button key={s} onClick={() => setStatus(s)}
                            className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold border transition-all cursor-pointer
                                ${(filters.status ?? '') === s ? 'text-white border-transparent' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}
                            style={(filters.status ?? '') === s ? { background: 'var(--color-primary)' } : {}}>
                            {s || 'All'}
                        </button>
                    ))}
                </div>
                <span className="ml-auto text-[13px] text-gray-500">{orders.total} orders</span>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                {['Order','Customer','Items','Total','Payment','Status','Actions'].map(h => (
                                    <th key={h} className="text-left text-[11px] font-black text-gray-400 uppercase tracking-wider px-5 py-3.5">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {orders.data.map(order => (
                                <tr key={order.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-5 py-3.5">
                                        <div className="font-bold text-[13px]" style={{ color: 'var(--color-dark-bg)' }}>{(order as any).order_number ?? `#${order.id}`}</div>
                                        <div className="text-[11px] text-gray-400">{new Date(order.created_at).toLocaleDateString('en-PK', { day:'numeric', month:'short', year:'numeric' })}</div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="font-semibold text-[13px] text-gray-900">{order.customer_name}</div>
                                        <div className="text-[11.5px] text-gray-400">{order.customer_phone}</div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="text-[13px] text-gray-700 font-medium">{order.items?.length ?? 0} item{(order.items?.length ?? 0) !== 1 ? 's' : ''}</div>
                                    </td>
                                    <td className="px-5 py-3.5 font-manrope font-bold text-[13px]" style={{ color: 'var(--color-dark-bg)' }}>{fmt(order.total)}</td>
                                    <td className="px-5 py-3.5">
                                        <div className="text-[12.5px] font-semibold text-gray-800 capitalize mb-0.5">
                                            {order.payment_method === 'cod' ? 'Cash on Delivery'
                                             : order.payment_method === 'bank_transfer' ? 'Bank Transfer'
                                             : (order.payment_method ?? '').replace(/_/g,' ')}
                                        </div>
                                        <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded-full border capitalize ${PAY_COLORS[order.payment_status] ?? PAY_COLORS.pending}`}>
                                            {order.payment_status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="relative">
                                            <select value={order.status} onChange={e => updateStatus(order.id, e.target.value)}
                                                className={`text-[11px] font-bold px-2.5 py-1 pr-6 rounded-full border appearance-none cursor-pointer outline-none ${STATUS_COLORS[order.status] ?? STATUS_COLORS.pending}`}>
                                                {['pending','processing','shipped','delivered','cancelled'].map(s => (
                                                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex gap-1.5 ">
                                            <a href={`${ap}/orders/${order.id}/invoice`} target="_blank" title="Print Invoice"
                                                className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 no-underline hover:border-gray-400 transition-all text-[11px]">
                                                🖨️
                                            </a>
                                            <Link href={`${ap}/orders/${order.id}`}
                                                className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 no-underline hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all">
                                                <IconEye size={14} />
                                            </Link>
                                            <button onClick={() => del(order.id)}
                                                className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 bg-white cursor-pointer hover:border-red-400 hover:text-red-500 hover:bg-red-50 transition-all">
                                                <IconTrash size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {orders.data.length === 0 && (
                                <tr><td colSpan={7} className="px-5 py-16 text-center">
                                    <IconPackage size={36} className="text-gray-300 mx-auto mb-3" />
                                    <div className="text-gray-400 text-[13px]">No orders yet</div>
                                </td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {orders.last_page > 1 && (
                    <div className="px-5 py-3.5 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-[13px] text-gray-500">Page {orders.current_page} of {orders.last_page}</span>
                        <div className="flex gap-2">
                            {orders.current_page > 1 && <button onClick={() => router.get(`${ap}/orders`, { ...filters, page: orders.current_page - 1 })} className="h-8 px-4 text-[12px] border border-gray-200 rounded-lg bg-white cursor-pointer hover:border-[var(--color-primary)]">← Prev</button>}
                            {orders.current_page < orders.last_page && <button onClick={() => router.get(`${ap}/orders`, { ...filters, page: orders.current_page + 1 })} className="h-8 px-4 text-[12px] border border-gray-200 rounded-lg bg-white cursor-pointer hover:border-[var(--color-primary)]">Next →</button>}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    )
}
