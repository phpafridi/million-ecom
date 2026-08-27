import { Head, Link, usePage } from '@inertiajs/react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts'
import { IconTrendingUp, IconShoppingBag, IconUsers, IconPackage, IconAlertTriangle, IconStar, IconEye } from '@tabler/icons-react'
import AdminLayout from '@/Layouts/AdminLayout'

interface Props {
    stats: { revenue: number; orders: number; customers: number; products: number; pending_orders: number; pending_reviews: number }
    revenueChart: { month: string; revenue: number; orders: number }[]
    topProducts: { name: string; sold: number; revenue: number }[]
    recentOrders: { id: number; customer: string; total: number; status: string; payment: string; date: string }[]
    lowStock: { id: number; name: string; stock: number }[]
}

const STATUS_COLORS: Record<string, string> = {
    pending:'bg-amber-50 text-amber-700 border-amber-200',
    processing:'bg-blue-50 text-blue-700 border-blue-200',
    shipped:'bg-purple-50 text-purple-700 border-purple-200',
    delivered:'bg-green-50 text-green-700 border-green-200',
    cancelled:'bg-red-50 text-red-600 border-red-200',
}

export default function Dashboard({ stats, revenueChart, topProducts, recentOrders, lowStock }: Props) {
    const { props } = usePage<{ adminPath?: string }>()
    const ap = `/${props.adminPath ?? 'ml-admin'}`
    const fmt = (n: number) => `Rs ${Number(n).toLocaleString('en-PK')}`

    const statCards = [
        { label:'Total Revenue',  value: fmt(stats.revenue),  icon: IconTrendingUp, change:'+12%',  color:'var(--color-primary)' },
        { label:'Total Orders',   value: stats.orders,        icon: IconShoppingBag, change: stats.pending_orders > 0 ? `${stats.pending_orders} pending` : null, color:'#8b5cf6' },
        { label:'Customers',      value: stats.customers,     icon: IconUsers,      change:null,    color:'#10b981' },
        { label:'Active Products',value: stats.products,      icon: IconPackage,    change:null,    color:'#f59e0b' },
    ]

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (!active || !payload?.length) return null
        return (
            <div className="bg-[var(--color-dark-bg)] rounded-xl px-4 py-3 text-white shadow-xl border border-white/10">
                <p className="text-[11px] font-black uppercase tracking-wider text-white/50 mb-1">{label}</p>
                <p className="text-[15px] font-black">{fmt(payload[0]?.value ?? 0)}</p>
                {payload[1] && <p className="text-[12px] text-white/60">{payload[1].value} orders</p>}
            </div>
        )
    }

    return (
        <AdminLayout title="Dashboard">
            <Head title="Dashboard"/>

            {/* Alert banners */}
            {(stats.pending_orders > 0 || stats.pending_reviews > 0) && (
                <div className="flex flex-wrap gap-2 mb-5">
                    {stats.pending_orders > 0 && (
                        <Link href={`${ap}/orders?status=pending`}
                            className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-300 rounded-xl text-amber-800 text-[13px] font-semibold no-underline hover:bg-amber-100 transition-colors">
                            <IconAlertTriangle size={16}/> {stats.pending_orders} pending order{stats.pending_orders > 1 ? 's' : ''} need attention
                        </Link>
                    )}
                    {stats.pending_reviews > 0 && (
                        <Link href={`${ap}/reviews`}
                            className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 border border-blue-300 rounded-xl text-blue-800 text-[13px] font-semibold no-underline hover:bg-blue-100 transition-colors">
                            <IconStar size={16}/> {stats.pending_reviews} review{stats.pending_reviews > 1 ? 's' : ''} pending approval
                        </Link>
                    )}
                </div>
            )}

            {/* Stat cards */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
                {statCards.map((s, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-3.5">
                        <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                            style={{ background: s.color + '18' }}>
                            <s.icon size={21} style={{ color: s.color }}/>
                        </div>
                        <div className="min-w-0">
                            <div className="text-[11.5px] text-gray-500 font-semibold truncate">{s.label}</div>
                            <div className="font-manrope font-black text-[20px] leading-none mt-1" style={{ color:'var(--color-dark-bg)' }}>{s.value}</div>
                            {s.change && <div className="text-[11px] font-semibold text-green-500 mt-1">{s.change}</div>}
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
                {/* Revenue chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h3 className="font-manrope font-bold text-[16px]" style={{ color:'var(--color-dark-bg)' }}>Revenue (12 months)</h3>
                            <p className="text-[12px] text-gray-400 mt-0.5">Monthly revenue trend</p>
                        </div>
                        <div className="text-right">
                            <div className="font-manrope font-black text-[18px]" style={{ color:'var(--color-primary)' }}>{fmt(stats.revenue)}</div>
                            <div className="text-[11px] text-gray-400">Total all time</div>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={revenueChart} margin={{ top:5, right:5, left:5, bottom:5 }}>
                            <defs>
                                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.25}/>
                                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false}/>
                            <XAxis dataKey="month" tick={{ fontSize:11, fill:'#999' }} axisLine={false} tickLine={false}/>
                            <YAxis tick={{ fontSize:11, fill:'#999' }} axisLine={false} tickLine={false} tickFormatter={v => `Rs ${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`}/>
                            <Tooltip content={<CustomTooltip/>}/>
                            <Area type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={2.5} fill="url(#revGrad)" dot={false} activeDot={{ r:5 }}/>
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Top Products */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                    <h3 className="font-manrope font-bold text-[16px] mb-4" style={{ color:'var(--color-dark-bg)' }}>Top Products</h3>
                    {topProducts.length === 0 ? (
                        <div className="flex items-center justify-center h-[200px] text-gray-300 text-[13px]">No sales yet</div>
                    ) : (
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={topProducts} layout="vertical" margin={{ top:0, right:10, left:0, bottom:0 }}>
                                <XAxis type="number" tick={{ fontSize:10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}`}/>
                                <YAxis type="category" dataKey="name" tick={{ fontSize:10, fill:'#666' }} axisLine={false} tickLine={false} width={70}
                                    tickFormatter={v => v.length > 10 ? v.slice(0,10)+'…' : v}/>
                                <Tooltip formatter={(v: number) => [`${v} sold`, 'Units']}/>
                                <Bar dataKey="sold" radius={[0,6,6,0]}>
                                    {topProducts.map((_, i) => (
                                        <Cell key={i} fill="var(--color-primary)" fillOpacity={1 - i * 0.15}/>
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* Recent orders + Low stock */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                        <h3 className="font-manrope font-bold text-[15px]">Recent Orders</h3>
                        <Link href={`${ap}/orders`} className="text-[12.5px] font-bold no-underline hover:underline" style={{ color:'var(--color-primary)' }}>View all →</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[500px]">
                            <tbody>
                                {recentOrders.length === 0 ? (
                                    <tr><td className="px-5 py-10 text-center text-gray-400 text-[13px]">No orders yet</td></tr>
                                ) : recentOrders.map(o => (
                                    <tr key={o.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                        <td className="px-5 py-3.5">
                                            <div className="font-bold text-[13px]" style={{ color:'var(--color-primary)' }}>#{o.id}</div>
                                            <div className="text-[11px] text-gray-400">{o.date}</div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="font-semibold text-[13px] text-gray-900">{o.customer}</div>
                                        </td>
                                        <td className="px-5 py-3.5 font-bold text-[13px]" style={{ color:'var(--color-dark-bg)' }}>{fmt(o.total)}</td>
                                        <td className="px-5 py-3.5">
                                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border capitalize ${STATUS_COLORS[o.status] ?? STATUS_COLORS.pending}`}>{o.status}</span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <Link href={`${ap}/orders/${o.id}`} className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 no-underline hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all">
                                                <IconEye size={13}/>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Low stock */}
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                        <h3 className="font-manrope font-bold text-[15px]">Low Stock</h3>
                        <Link href={`${ap}/products`} className="text-[12.5px] font-bold no-underline hover:underline" style={{ color:'var(--color-primary)' }}>Manage →</Link>
                    </div>
                    {lowStock.length === 0 ? (
                        <div className="px-5 py-10 text-center text-gray-400 text-[13px]">✓ All products well stocked</div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {lowStock.map(p => (
                                <div key={p.id} className="flex items-center gap-3 px-5 py-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[13px] font-semibold text-gray-900 truncate">{p.name}</div>
                                    </div>
                                    <span className={`text-[11.5px] font-bold px-2.5 py-0.5 rounded-full border flex-shrink-0
                                        ${p.stock === 0 ? 'bg-red-50 text-red-600 border-red-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                                        {p.stock === 0 ? 'Out of stock' : `${p.stock} left`}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    )
}
