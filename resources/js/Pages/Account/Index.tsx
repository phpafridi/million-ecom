import { Head, Link } from '@inertiajs/react'
import StorefrontLayout from '@/Layouts/StorefrontLayout'
import AccountSidebar from './Partials/AccountSidebar'
import { IconPackage, IconStar, IconTrendingUp, IconShoppingBag, IconChevronRight, IconTruck } from '@tabler/icons-react'

interface Order {
    id: number; tracking_token: string; status: string; payment_status: string
    payment_method: string; total: number; items_count: number; created_at: string
}
interface Level { name: string; color: string; next: number | null; progress: number }
interface Stats {
    total_orders: number; total_spent: number; loyalty_points: number
    points_value: number; level: Level; wishlist_count: number
}
interface Props { orders: Order[]; stats: Stats; settings: Record<string, string>; auth: any }

const STATUS_COLOR: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    processing: 'bg-blue-50 text-blue-700 border-blue-200',
    shipped: 'bg-purple-50 text-purple-700 border-purple-200',
    delivered: 'bg-green-50 text-green-700 border-green-200',
    cancelled: 'bg-red-50 text-red-600 border-red-200',
}

export default function AccountIndex({ orders, stats, settings, auth }: Props) {
    const fmt = (n: number) => `Rs ${Number(n).toLocaleString('en-PK')}`
    const user = auth?.user

    return (
        <StorefrontLayout auth={auth} settings={settings}>
            <Head title="My Account" />
            <div className="min-h-screen py-0 lg:py-8 px-0 lg:px-4" style={{ background: 'var(--color-body-bg)' }}>
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">

                        <AccountSidebar auth={auth} active="dashboard" />

                        <div className="lg:col-span-3 space-y-5 px-4 pt-5 lg:px-0 lg:pt-0">

                            {/* Welcome Banner */}
                            <div className="rounded-2xl p-6 text-white relative overflow-hidden"
                                style={{ background: 'linear-gradient(135deg, var(--color-dark-bg) 0%, var(--color-dark-bg2) 100%)' }}>
                                <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-5"
                                    style={{ background: 'var(--color-primary)', transform: 'translate(30%, -30%)' }} />
                                <p className="text-white/60 text-[13px] font-medium mb-1">Welcome back,</p>
                                <h2 className="font-black text-2xl mb-1">{user?.name}</h2>
                                <div className="flex items-center gap-2 mt-3">
                                    <span className="text-[12px] font-bold px-3 py-1 rounded-full"
                                        style={{ background: stats.level.color + '30', color: stats.level.color }}>
                                        {stats.level.name} Member
                                    </span>
                                    <span className="text-white/50 text-[12px]">
                                        {stats.loyalty_points.toLocaleString()} points · {fmt(stats.points_value)} value
                                    </span>
                                </div>
                                {stats.level.next && (
                                    <div className="mt-4">
                                        <div className="flex justify-between text-[11px] text-white/50 mb-1.5">
                                            <span>Progress to next level</span>
                                            <span>{stats.level.progress}%</span>
                                        </div>
                                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full rounded-full transition-all duration-700"
                                                style={{ width: `${stats.level.progress}%`, background: stats.level.color }} />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {[
                                    { label: 'Total Orders',   value: stats.total_orders,                      icon: IconPackage,     color: '#3B82F6' },
                                    { label: 'Total Spent',    value: fmt(stats.total_spent),                  icon: IconShoppingBag, color: '#10B981' },
                                    { label: 'Loyalty Points', value: stats.loyalty_points.toLocaleString(),   icon: IconStar,        color: '#F59E0B' },
                                    { label: 'Wishlist Items', value: stats.wishlist_count,                    icon: IconTrendingUp,  color: '#EF4444' },
                                ].map(s => (
                                    <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4">
                                        <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                                            style={{ background: s.color + '15' }}>
                                            <s.icon size={18} style={{ color: s.color }} />
                                        </div>
                                        <p className="font-black text-[20px]" style={{ color: 'var(--color-body-text)' }}>{s.value}</p>
                                        <p className="text-gray-400 text-[11.5px] mt-0.5">{s.label}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Recent Orders */}
                            <div className="bg-white rounded-2xl border border-gray-100 p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-black text-[16px]" style={{ color: 'var(--color-body-text)' }}>Recent Orders</h3>
                                    <Link href="/account/orders" className="text-[12.5px] font-bold no-underline flex items-center gap-1"
                                        style={{ color: 'var(--color-primary)' }}>
                                        View all <IconChevronRight size={14} />
                                    </Link>
                                </div>

                                {orders.length === 0 ? (
                                    <div className="text-center py-10">
                                        <IconPackage size={36} className="text-gray-200 mx-auto mb-3" />
                                        <p className="text-gray-400 text-[13.5px] mb-4">No orders yet.</p>
                                        <Link href="/shop" className="inline-flex items-center gap-2 font-bold text-[13px] h-10 px-5 rounded-xl no-underline"
                                            style={{ background: 'var(--color-primary)', color: 'var(--color-primary-text)' }}>
                                            Start Shopping →
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {orders.map(order => (
                                            <Link key={order.id} href={`/account/orders/${order.id}`}
                                                className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all no-underline group">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                                        style={{ background: 'var(--color-primary)' + '15' }}>
                                                        <IconTruck size={18} style={{ color: 'var(--color-primary)' }} />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-[13.5px]" style={{ color: 'var(--color-body-text)' }}>
                                                            {(order as any).order_number ?? `Order #${order.id}`}
                                                        </p>
                                                        <p className="text-gray-400 text-[11.5px]">
                                                            {order.items_count} item{order.items_count !== 1 ? 's' : ''} · {order.created_at}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${STATUS_COLOR[order.status] || ''}`}>
                                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                    </span>
                                                    <p className="font-black text-[14px]" style={{ color: 'var(--color-body-text)' }}>
                                                        {fmt(order.total)}
                                                    </p>
                                                    <IconChevronRight size={16} className="text-gray-300 group-hover:text-gray-400 transition-colors" />
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Quick Links */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {[
                                    { href: '/account/orders', label: 'All Orders',       sub: 'View order history',   icon: IconPackage },
                                    { href: '/account/loyalty', label: 'Loyalty Points',  sub: `${stats.loyalty_points} pts available`, icon: IconStar },
                                    { href: '/account/wishlist', label: 'My Wishlist',    sub: `${stats.wishlist_count} saved items`,   icon: IconShoppingBag },
                                ].map(q => (
                                    <Link key={q.href} href={q.href}
                                        className="bg-white rounded-2xl border border-gray-100 p-4 hover:border-gray-200 hover:shadow-sm transition-all no-underline group flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                            style={{ background: 'var(--color-primary)' + '15' }}>
                                            <q.icon size={18} style={{ color: 'var(--color-primary)' }} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-[13px]" style={{ color: 'var(--color-body-text)' }}>{q.label}</p>
                                            <p className="text-gray-400 text-[11.5px] truncate">{q.sub}</p>
                                        </div>
                                        <IconChevronRight size={15} className="text-gray-300 ml-auto group-hover:text-gray-400 shrink-0" />
                                    </Link>
                                ))}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </StorefrontLayout>
    )
}
