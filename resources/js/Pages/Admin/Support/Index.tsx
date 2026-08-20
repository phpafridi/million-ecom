import { Head, Link, router } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import { useState } from 'react'
import { IconTicket, IconAlertTriangle, IconCheck, IconClock, IconUser } from '@tabler/icons-react'

interface Ticket {
    id: number; ticket_number: string; name: string; email: string
    subject: string; status: string; priority: string
    customer_name: string; assignee_name: string; created_at: string
}
interface Props {
    tickets: { data: Ticket[]; total: number }
    staff: Array<{ id: number; name: string }>
    stats: { open: number; in_progress: number; resolved: number; urgent: number }
}

const priorityColor: Record<string, string> = {
    urgent: '#EF4444', high: '#F59E0B', normal: '#3B82F6', low: '#6B7280'
}
const statusColor: Record<string, string> = {
    open: '#F59E0B', in_progress: '#3B82F6', resolved: '#10B981', closed: '#6B7280'
}

export default function SupportIndex({ tickets, staff, stats }: Props) {
    const [search, setSearch] = useState('')

    function changeStatus(id: number, status: string) {
        router.patch(`/ml-admin/support/${id}`, { status }, { preserveScroll: true })
    }

    return (
        <AdminLayout title="Support Tickets">
            <Head title="Support Tickets" />

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                {[
                    { label: 'Open', value: stats.open, color: '#F59E0B', icon: '📬' },
                    { label: 'In Progress', value: stats.in_progress, color: '#3B82F6', icon: '⚙️' },
                    { label: 'Resolved', value: stats.resolved, color: '#10B981', icon: '✅' },
                    { label: 'Urgent', value: stats.urgent, color: '#EF4444', icon: '🚨' },
                ].map(s => (
                    <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4">
                        <div className="text-2xl mb-1">{s.icon}</div>
                        <p className="font-black text-[24px]" style={{ color: s.color }}>{s.value}</p>
                        <p className="text-[12px] text-gray-400">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Search */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex gap-3">
                    <input value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search by subject, email, ticket number..."
                        className="flex-1 h-10 px-4 border border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)]" />
                    <button onClick={() => router.get('/ml-admin/support', { search }, { preserveState: true })}
                        className="h-10 px-5 rounded-xl font-bold text-[13px] border-none cursor-pointer text-white"
                        style={{ background: 'var(--color-primary)', color: 'var(--color-primary-text)' }}>
                        Search
                    </button>
                </div>

                <table className="w-full text-[13px]">
                    <thead>
                        <tr className="border-b border-gray-100">
                            {['Ticket','Customer','Subject','Priority','Status','Date','Actions'].map(h => (
                                <th key={h} className="text-left px-5 py-3.5 text-[11px] font-black text-gray-400 uppercase tracking-wide">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {tickets.data.map(t => (
                            <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-5 py-4">
                                    <span className="font-mono font-bold text-[12px] text-gray-500">{t.ticket_number}</span>
                                </td>
                                <td className="px-5 py-4">
                                    <p className="font-semibold text-gray-800">{t.name}</p>
                                    <p className="text-[11.5px] text-gray-400">{t.email}</p>
                                </td>
                                <td className="px-5 py-4 max-w-[200px]">
                                    <p className="font-semibold text-gray-800 truncate">{t.subject}</p>
                                </td>
                                <td className="px-5 py-4">
                                    <span className="text-[11px] font-black px-2.5 py-1 rounded-full text-white"
                                        style={{ background: priorityColor[t.priority] || '#6B7280' }}>
                                        {t.priority}
                                    </span>
                                </td>
                                <td className="px-5 py-4">
                                    <select value={t.status}
                                        onChange={e => changeStatus(t.id, e.target.value)}
                                        className="text-[12px] font-bold px-3 py-1 rounded-lg border-none cursor-pointer"
                                        style={{ background: statusColor[t.status] + '20', color: statusColor[t.status] }}>
                                        <option value="open">Open</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="resolved">Resolved</option>
                                        <option value="closed">Closed</option>
                                    </select>
                                </td>
                                <td className="px-5 py-4 text-gray-400 text-[12px]">
                                    {new Date(t.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-5 py-4">
                                    <Link href={`/ml-admin/support/${t.id}`}
                                        className="text-[12px] font-bold no-underline px-3 py-1.5 rounded-lg"
                                        style={{ color: 'var(--color-primary)', background: 'var(--color-primary)10' }}>
                                        Reply →
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {tickets.data.length === 0 && (
                            <tr><td colSpan={7} className="px-5 py-12 text-center text-gray-400">
                                <IconTicket size={36} className="mx-auto mb-3 opacity-30" />
                                <p className="font-bold">No support tickets yet</p>
                            </td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    )
}
