import { Head, Link, router } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import { useState } from 'react'
import { IconShieldCheck, IconAlertTriangle, IconX, IconTrash, IconRefresh } from '@tabler/icons-react'

interface Log {
    id: number; user_name: string; user_role: string; action: string
    model_type?: string; model_id?: number; description: string
    ip_address: string; severity: 'info'|'warning'|'danger'; created_at: string
    old_values?: any; new_values?: any
}
interface Suspicious { ip_address: string; attempts: number }

export default function SystemLogs({ logs, suspicious, stats, filters, settings, auth }: any) {
    const ap = `/${(window as any).__inertia?.page?.props?.adminPath ?? 'ml-admin'}`
    const [filter, setFilter] = useState(filters ?? {})
    const [selected, setSelected] = useState<Log|null>(null)

    function apply(key: string, val: string) {
        const f = { ...filter, [key]: val }
        setFilter(f)
        router.get(window.location.pathname, f, { preserveState: true })
    }

    const severityColor = (s: string) => s === 'danger' ? '#DC2626' : s === 'warning' ? '#D97706' : '#059669'
    const severityBg    = (s: string) => s === 'danger' ? '#FEF2F2' : s === 'warning' ? '#FFFBEB' : '#F0FDF4'

    return (
        <AdminLayout title="System Logs">
            <Head title="System Logs" />

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
                {[
                    { label: 'Total Logs',     val: stats.total,        color: '#6B7280' },
                    { label: 'Danger (24h)',   val: stats.danger,       color: '#DC2626' },
                    { label: 'Warnings (24h)', val: stats.warnings,     color: '#D97706' },
                    { label: 'Logins (24h)',   val: stats.logins,       color: '#059669' },
                    { label: 'Failed (24h)',   val: stats.failed_logins,color: '#7C3AED' },
                ].map(s => (
                    <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 text-center">
                        <div className="text-[22px] font-black" style={{ color: s.color }}>{s.val}</div>
                        <div className="text-[11px] text-gray-500 mt-0.5">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Suspicious IPs */}
            {suspicious.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5">
                    <div className="flex items-center gap-2 mb-2">
                        <IconAlertTriangle size={18} className="text-red-600" />
                        <span className="font-bold text-red-700 text-[14px]">
                            Suspicious Activity Detected — Multiple Failed Logins
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {suspicious.map((s: Suspicious) => (
                            <span key={s.ip_address} className="text-[12px] bg-red-100 text-red-700 px-3 py-1 rounded-full font-semibold">
                                {s.ip_address} — {s.attempts} attempts
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4 flex flex-wrap gap-3 items-end">
                <div>
                    <label className="text-[11px] font-bold text-gray-500 uppercase block mb-1">Severity</label>
                    <select className="border border-gray-200 rounded-lg px-3 py-2 text-[13px]"
                        value={filter.severity ?? 'all'} onChange={e => apply('severity', e.target.value)}>
                        <option value="all">All</option>
                        <option value="info">Info</option>
                        <option value="warning">Warning</option>
                        <option value="danger">Danger</option>
                    </select>
                </div>
                <div>
                    <label className="text-[11px] font-bold text-gray-500 uppercase block mb-1">Action</label>
                    <input className="border border-gray-200 rounded-lg px-3 py-2 text-[13px] w-40"
                        placeholder="e.g. login.failed" value={filter.action ?? ''}
                        onChange={e => apply('action', e.target.value)} />
                </div>
                <div>
                    <label className="text-[11px] font-bold text-gray-500 uppercase block mb-1">User</label>
                    <input className="border border-gray-200 rounded-lg px-3 py-2 text-[13px] w-36"
                        placeholder="Name" value={filter.user ?? ''}
                        onChange={e => apply('user', e.target.value)} />
                </div>
                <div>
                    <label className="text-[11px] font-bold text-gray-500 uppercase block mb-1">From</label>
                    <input type="date" className="border border-gray-200 rounded-lg px-3 py-2 text-[13px]"
                        value={filter.from ?? ''} onChange={e => apply('from', e.target.value)} />
                </div>
                <div>
                    <label className="text-[11px] font-bold text-gray-500 uppercase block mb-1">To</label>
                    <input type="date" className="border border-gray-200 rounded-lg px-3 py-2 text-[13px]"
                        value={filter.to ?? ''} onChange={e => apply('to', e.target.value)} />
                </div>
                <button onClick={() => { setFilter({}); router.get(window.location.pathname) }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-[13px] text-gray-600 hover:bg-gray-50 cursor-pointer bg-white">
                    <IconRefresh size={14} /> Reset
                </button>
                <div className="ml-auto">
                    <button onClick={() => {
                        if (confirm('Clear logs older than 30 days?'))
                            router.delete(window.location.pathname + '/clear', { data: { days: 30 } })
                    }} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-600 text-[13px] hover:bg-red-100 cursor-pointer">
                        <IconTrash size={14} /> Clear Old Logs
                    </button>
                </div>
            </div>

            {/* Log Table */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <table className="w-full text-[13px]">
                    <thead style={{ background: '#0a0a0a' }}>
                        <tr>
                            {['Time','User','Action','Description','IP','Severity'].map(h => (
                                <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider" style={{ color: '#C9A84C' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {logs.data?.map((log: Log) => (
                            <tr key={log.id} onClick={() => setSelected(log)}
                                className="hover:bg-gray-50 cursor-pointer transition-colors">
                                <td className="px-4 py-3 text-[11px] text-gray-400 whitespace-nowrap">{log.created_at}</td>
                                <td className="px-4 py-3">
                                    <div className="font-semibold text-gray-800">{log.user_name}</div>
                                    <div className="text-[10px] text-gray-400">{log.user_role}</div>
                                </td>
                                <td className="px-4 py-3 font-mono text-[11px] text-gray-600">{log.action}</td>
                                <td className="px-4 py-3 text-gray-600 max-w-[200px] truncate">{log.description}</td>
                                <td className="px-4 py-3 font-mono text-[11px] text-gray-500">{log.ip_address}</td>
                                <td className="px-4 py-3">
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                                        style={{ background: severityBg(log.severity), color: severityColor(log.severity) }}>
                                        {log.severity}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!logs.data?.length && (
                    <div className="py-12 text-center text-gray-400">No logs found</div>
                )}
            </div>

            {/* Pagination */}
            {logs.last_page > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                    {Array.from({length: logs.last_page}, (_,i) => i+1).map(p => (
                        <button key={p} onClick={() => router.get(window.location.pathname, {...filter,page:p})}
                            className="w-8 h-8 rounded-lg text-[13px] font-semibold border cursor-pointer"
                            style={{ background: p === logs.current_page ? 'var(--color-primary)' : 'white', color: p === logs.current_page ? '#0a0a0a' : '#374151', borderColor: '#E5E7EB' }}>
                            {p}
                        </button>
                    ))}
                </div>
            )}

            {/* Detail Modal */}
            {selected && (
                <>
                    <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSelected(null)} />
                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-black text-[16px] text-gray-800">Log Detail</h3>
                            <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-700 border-none bg-transparent cursor-pointer"><IconX size={18}/></button>
                        </div>
                        <div className="space-y-3 text-[13px]">
                            <div className="flex justify-between"><span className="text-gray-500">Time</span><span className="font-semibold">{selected.created_at}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">User</span><span className="font-semibold">{selected.user_name} ({selected.user_role})</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Action</span><span className="font-mono bg-gray-100 px-2 py-0.5 rounded">{selected.action}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">IP</span><span className="font-mono">{selected.ip_address}</span></div>
                            <div><span className="text-gray-500">Description</span><p className="mt-1 text-gray-800">{selected.description}</p></div>
                            {selected.old_values && <div><span className="text-gray-500">Before</span><pre className="mt-1 bg-gray-50 rounded p-2 text-[11px] overflow-auto max-h-24">{JSON.stringify(selected.old_values, null, 2)}</pre></div>}
                            {selected.new_values && <div><span className="text-gray-500">After</span><pre className="mt-1 bg-green-50 rounded p-2 text-[11px] overflow-auto max-h-24">{JSON.stringify(selected.new_values, null, 2)}</pre></div>}
                        </div>
                    </div>
                </>
            )}
        </AdminLayout>
    )
}
