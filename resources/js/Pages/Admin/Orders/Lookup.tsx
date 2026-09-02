import { Head, Link, router, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { IconSearch, IconTruck, IconPhone, IconMail, IconMapPin, IconEye } from '@tabler/icons-react'
import AdminLayout from '@/Layouts/AdminLayout'

interface OrderItem { id: number; product_name: string; variant_label?: string | null; quantity: number; price: number; subtotal: number }
interface OrderReturn { id: number; status: string }
interface Order {
    id: number; order_number?: string; customer_name: string; customer_phone: string; customer_email: string | null
    customer_address: string; city?: string; payment_method: string; payment_status: string; status: string
    courier: string | null; tracking_number: string | null
    subtotal: number; shipping: number; discount: number; total: number; created_at: string
    items: OrderItem[]; returns: OrderReturn[]
}
interface Props { results: Order[]; query: string | null }

const STATUS_COLOR: Record<string,string> = {
    pending:'bg-amber-50 text-amber-700 border-amber-200',
    processing:'bg-blue-50 text-blue-700 border-blue-200',
    shipped:'bg-purple-50 text-purple-700 border-purple-200',
    delivered:'bg-green-50 text-green-700 border-green-200',
    cancelled:'bg-red-50 text-red-600 border-red-200',
}
const PAY_COLOR: Record<string,string> = {
    pending:'bg-amber-50 text-amber-700', paid:'bg-green-50 text-green-700',
    failed:'bg-red-50 text-red-600', refunded:'bg-gray-100 text-gray-600',
}

export default function OrderLookup({ results, query }: Props) {
    const { props: pageProps } = usePage<{ adminPath?: string; auth?: { user?: { role?: string; permissions?: string[] | null } } }>()
    const ap = `/${pageProps.adminPath ?? 'ml-admin'}`
    // Lookup-only staff (orders_lookup but not the full orders permission)
    // shouldn't see a "Full Details" link at all — clicking it would just
    // hit a 403, since that page requires full order access to edit
    // status or delete. Full admins and staff with full orders access
    // still see it normally.
    const perms = pageProps.auth?.user?.permissions
    const canViewFull = pageProps.auth?.user?.role !== 'staff' || !Array.isArray(perms) || perms.includes('orders')
    const [q, setQ] = useState(query ?? '')
    const fmt = (n: number) => `Rs ${Number(n).toLocaleString('en-PK')}`

    function search(e: React.FormEvent) {
        e.preventDefault()
        router.get(`${ap}/orders/lookup`, { q }, { preserveState: true })
    }

    return (
        <AdminLayout title="Order Lookup">
            <Head title="Order Lookup" />

            <div className="mb-6">
                <h1 className="font-black text-[22px] mb-1">🔍 Order Lookup</h1>
                <p className="text-[13.5px] text-gray-500">Search any order by order number, customer name, phone, courier, or tracking number — full details shown immediately, no clicking through required.</p>
            </div>

            <form onSubmit={search} className="mb-6">
                <div className="relative max-w-xl">
                    <IconSearch size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        autoFocus
                        value={q}
                        onChange={e => setQ(e.target.value)}
                        placeholder="Order #, name, phone, courier, or tracking number…"
                        className="w-full h-12 pl-12 pr-4 border-2 border-gray-200 rounded-2xl text-[14px] outline-none focus:border-[var(--color-primary)] bg-white"
                    />
                </div>
            </form>

            {query && results.length === 0 && (
                <div className="text-center py-16 text-gray-400">
                    <IconSearch size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="font-semibold">No orders matched "{query}"</p>
                </div>
            )}

            {!query && (
                <div className="text-center py-16 text-gray-400">
                    <IconSearch size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="font-semibold">Type above to search — results appear instantly</p>
                </div>
            )}

            <div className="space-y-4">
                {results.map(order => (
                    <div key={order.id} className="bg-white rounded-2xl border border-gray-100 p-5">
                        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-black text-[16px]">Order #{order.order_number ?? order.id}</span>
                                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border capitalize ${STATUS_COLOR[order.status] || ''}`}>{order.status}</span>
                                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full capitalize ${PAY_COLOR[order.payment_status] || ''}`}>{order.payment_status}</span>
                                    {order.returns?.length > 0 && (
                                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-orange-50 text-orange-700">Return: {order.returns[0].status}</span>
                                    )}
                                </div>
                                <p className="text-[12px] text-gray-400">{new Date(order.created_at).toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                            </div>
                            {canViewFull && (
                                <Link href={`${ap}/orders/${order.id}`}
                                    className="flex items-center gap-1.5 h-9 px-4 rounded-xl text-[12.5px] font-bold no-underline border-2 border-gray-200 text-gray-700 hover:border-[var(--color-primary)]">
                                    <IconEye size={14} /> Full Details
                                </Link>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            <div>
                                <p className="text-[10.5px] font-bold text-gray-400 uppercase tracking-wide mb-1">Customer</p>
                                <p className="text-[13px] font-semibold text-gray-800">{order.customer_name}</p>
                                <p className="text-[12px] text-gray-500 flex items-center gap-1"><IconPhone size={11} /> {order.customer_phone}</p>
                                {order.customer_email && <p className="text-[12px] text-gray-500 flex items-center gap-1"><IconMail size={11} /> {order.customer_email}</p>}
                            </div>
                            <div>
                                <p className="text-[10.5px] font-bold text-gray-400 uppercase tracking-wide mb-1">Delivery Address</p>
                                <p className="text-[12.5px] text-gray-600 flex items-start gap-1"><IconMapPin size={12} className="mt-0.5 flex-shrink-0" /> {order.customer_address}{order.city ? `, ${order.city}` : ''}</p>
                            </div>
                            <div>
                                <p className="text-[10.5px] font-bold text-gray-400 uppercase tracking-wide mb-1">Shipping / Tracking</p>
                                {(order.courier || order.tracking_number) ? (
                                    <p className="text-[12.5px] text-gray-700 flex items-center gap-1">
                                        <IconTruck size={13} className="flex-shrink-0" />
                                        {order.courier && <span className="font-semibold">{order.courier}</span>}
                                        {order.tracking_number && <span className="font-mono">{order.tracking_number}</span>}
                                    </p>
                                ) : (
                                    <p className="text-[12px] text-gray-400 italic">Not set yet</p>
                                )}
                            </div>
                            <div>
                                <p className="text-[10.5px] font-bold text-gray-400 uppercase tracking-wide mb-1">Payment</p>
                                <p className="text-[12.5px] text-gray-700 capitalize">{order.payment_method}</p>
                                <p className="font-black text-[15px]" style={{ color: 'var(--color-primary)' }}>{fmt(order.total)}</p>
                            </div>
                        </div>

                        <div className="pt-3 border-t border-gray-50">
                            <p className="text-[10.5px] font-bold text-gray-400 uppercase tracking-wide mb-2">{order.items.length} Item(s)</p>
                            <div className="flex flex-wrap gap-2">
                                {order.items.map(item => (
                                    <span key={item.id} className="text-[12px] bg-gray-50 rounded-lg px-3 py-1.5">
                                        {item.product_name}{item.variant_label && <span className="text-gray-400"> ({item.variant_label})</span>} × {item.quantity}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </AdminLayout>
    )
}
