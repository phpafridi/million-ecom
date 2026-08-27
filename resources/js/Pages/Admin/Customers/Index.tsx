import { Head, usePage } from '@inertiajs/react'
import { IconUsers, IconShoppingBag, IconCurrencyRupee, IconUserCheck } from '@tabler/icons-react'
import AdminLayout from '@/Layouts/AdminLayout'

interface Customer {
    id: string | number; name: string; email: string | null; phone: string | null
    type: 'registered' | 'guest'; order_count: number; total_spent: number; created_at: string
}
interface Props {
    customers: Customer[]
    stats: { total: number; registered: number; guests: number; total_revenue: number }
}

export default function CustomersIndex({ customers, stats }: Props) {
    const { props } = usePage<{ adminPath?: string }>()
    const ap = `/${props.adminPath ?? 'ml-admin'}`
    const fmt = (n: number) => `Rs ${Number(n).toLocaleString('en-PK')}`

    return (
        <AdminLayout title="Customers">
            <Head title="Customers — Admin"/>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {[
                    { label:'Total Customers', value: stats.total,      icon: IconUsers,          color:'blue' },
                    { label:'Registered',      value: stats.registered, icon: IconUserCheck,       color:'green' },
                    { label:'Guest Buyers',    value: stats.guests,     icon: IconShoppingBag,    color:'purple' },
                    { label:'Total Revenue',   value: fmt(stats.total_revenue), icon: IconCurrencyRupee, color:'amber' },
                ].map(s => (
                    <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{ background:'var(--color-primary)15', color:'var(--color-primary)' }}>
                                <s.icon size={20}/>
                            </div>
                            <div>
                                <div className="text-[11.5px] text-gray-500 font-semibold">{s.label}</div>
                                <div className="font-manrope font-black text-[18px]" style={{ color:'var(--color-dark-bg)' }}>{s.value}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px]">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                {['Customer','Contact','Type','Orders','Total Spent','Last Seen'].map(h => (
                                    <th key={h} className="text-left text-[11px] font-black text-gray-400 uppercase tracking-wider px-5 py-3.5">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {customers.length === 0 ? (
                                <tr><td colSpan={6} className="px-5 py-16 text-center">
                                    <IconUsers size={36} className="text-gray-300 mx-auto mb-3"/>
                                    <div className="text-gray-400 text-[13px]">No customers yet. Customers appear here once they place an order.</div>
                                </td></tr>
                            ) : customers.map(c => (
                                <tr key={c.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-[13px] text-white flex-shrink-0"
                                                style={{ background:'var(--color-primary)' }}>
                                                {c.name[0]?.toUpperCase()}
                                            </div>
                                            <div className="font-semibold text-[13.5px] text-gray-900">{c.name}</div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        {c.phone && <div className="text-[12.5px] text-gray-700">{c.phone}</div>}
                                        {c.email && <div className="text-[11.5px] text-gray-400">{c.email}</div>}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${c.type === 'registered' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                                            {c.type === 'registered' ? '✓ Registered' : 'Guest'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-[13px] font-semibold text-gray-700">{c.order_count} orders</td>
                                    <td className="px-5 py-3.5 font-manrope font-bold text-[13px]" style={{ color:'var(--color-dark-bg)' }}>{fmt(c.total_spent)}</td>
                                    <td className="px-5 py-3.5 text-[12px] text-gray-400">
                                        {c.created_at ? new Date(c.created_at).toLocaleDateString('en-PK', { day:'numeric', month:'short', year:'numeric' }) : '—'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    )
}
