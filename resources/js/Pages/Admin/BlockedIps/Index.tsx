import { Head, router } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import { useState } from 'react'
import { IconShield, IconX, IconPlus, IconAlertTriangle, IconBan, IconCheck } from '@tabler/icons-react'
import ConfirmDeleteModal from '@/Components/Admin/ConfirmDeleteModal'

export default function BlockedIps({ ips, suspicious, stats, filters }: any) {
    const [showAdd, setShowAdd] = useState(false)
    const [pendingRemove, setPendingRemove] = useState<{ id: number; ip: string } | null>(null)
    const [form, setForm] = useState({ ip:'', reason:'', hours:'' })
    const [search, setSearch] = useState(filters?.search ?? '')

    function apply(params: any) {
        router.get(window.location.pathname, { ...filters, ...params }, { preserveState: true })
    }

    function addIp() {
        if (!form.ip || !form.reason) return
        router.post(window.location.pathname, form, {
            onSuccess: () => { setShowAdd(false); setForm({ ip:'', reason:'', hours:'' }) },
            preserveScroll: true,
        })
    }

    const typeColor = (t: string) => ({
        ddos:   { bg:'#FEF2F2', color:'#DC2626' },
        spam:   { bg:'#FFFBEB', color:'#D97706' },
        manual: { bg:'#EDE9FE', color:'#7C3AED' },
        auto:   { bg:'#FEF2F2', color:'#DC2626' },
    }[t] ?? { bg:'#F3F4F6', color:'#6B7280' })

    return (
        <AdminLayout title="IP Firewall">
            <Head title="IP Firewall" />

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5">
                {[
                    { label:'Total Blocked', val: stats.total,  color:'#374151' },
                    { label:'Active Blocks', val: stats.active, color:'#DC2626' },
                    { label:'DDoS',          val: stats.ddos,   color:'#DC2626' },
                    { label:'Spam',          val: stats.spam,   color:'#D97706' },
                    { label:'Manual',        val: stats.manual, color:'#7C3AED' },
                ].map(s => (
                    <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 text-center">
                        <div className="text-[22px] font-black" style={{ color: s.color }}>{s.val}</div>
                        <div className="text-[11px] text-gray-500 mt-0.5">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Suspicious IPs not yet blocked */}
            {suspicious.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
                    <div className="flex items-center gap-2 mb-3">
                        <IconAlertTriangle size={17} className="text-amber-600" />
                        <span className="font-bold text-amber-700 text-[14px]">Suspicious IPs (multiple failed logins — not yet blocked)</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {suspicious.map((s: any) => (
                            <div key={s.ip_address} className="flex items-center gap-2 bg-white border border-amber-200 rounded-lg px-3 py-1.5">
                                <span className="font-mono text-[12px] font-semibold">{s.ip_address}</span>
                                <span className="text-[11px] text-amber-600">{s.attempts} attempts</span>
                                <button onClick={() => router.post(window.location.pathname, { ip: s.ip_address, reason: `Auto: ${s.attempts} failed logins`, hours: 24 }, { preserveScroll: true })}
                                    className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded cursor-pointer border-none">
                                    Block 24h
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Filters + Add */}
            <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4 flex flex-wrap gap-3 items-end justify-between">
                <div className="flex flex-wrap gap-3 items-end">
                    <div>
                        <label className="text-[11px] font-bold text-gray-500 uppercase block mb-1">Search IP/Reason</label>
                        <input className="border border-gray-200 rounded-lg px-3 py-2 text-[13px] w-48"
                            placeholder="192.168.1.1" value={search}
                            onChange={e => setSearch(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && apply({ search })} />
                    </div>
                    <div>
                        <label className="text-[11px] font-bold text-gray-500 uppercase block mb-1">Type</label>
                        <select className="border border-gray-200 rounded-lg px-3 py-2 text-[13px]"
                            value={filters?.type ?? 'all'} onChange={e => apply({ type: e.target.value })}>
                            <option value="all">All Types</option>
                            <option value="ddos">DDoS</option>
                            <option value="spam">Spam</option>
                            <option value="manual">Manual</option>
                            <option value="auto">Auto</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-[11px] font-bold text-gray-500 uppercase block mb-1">Status</label>
                        <select className="border border-gray-200 rounded-lg px-3 py-2 text-[13px]"
                            value={filters?.status ?? 'all'} onChange={e => apply({ status: e.target.value })}>
                            <option value="all">All</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>
                <button onClick={() => setShowAdd(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-[13px] border-none cursor-pointer"
                    style={{ background:'var(--color-primary,#C9A84C)', color:'var(--color-primary-text,#0a0a0a)' }}>
                    <IconPlus size={15}/> Block IP
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <table className="w-full text-[13px]">
                    <thead style={{ background:'#0a0a0a' }}>
                        <tr>
                            {['IP Address','Reason','Type','Status','Blocked By','Expires','Actions'].map(h => (
                                <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider" style={{ color:'#C9A84C' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {ips.data?.map((b: any) => (
                            <tr key={b.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-mono font-semibold text-gray-800">{b.ip}</td>
                                <td className="px-4 py-3 text-gray-600 max-w-[160px] truncate">{b.reason}</td>
                                <td className="px-4 py-3">
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                                        style={typeColor(b.type)}>
                                        {b.type}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${b.is_active ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                                        {b.is_active ? 'Blocked' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-gray-500">{b.blocked_by}</td>
                                <td className="px-4 py-3 text-[11px] text-gray-400">{b.expires_at}</td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-2">
                                        {b.is_active ? (
                                            <button onClick={() => confirm('Unblock this IP? It will be able to access the site again immediately.') && router.patch(`${window.location.pathname}/${b.ip}/unblock`, {}, { preserveScroll:true })}
                                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold border-none cursor-pointer bg-green-50 text-green-700">
                                                <IconCheck size={12}/> Unblock
                                            </button>
                                        ) : (
                                            <button onClick={() => setPendingRemove({ id: b.id, ip: b.ip })}
                                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold border-none cursor-pointer bg-red-50 text-red-600">
                                                <IconX size={12}/> Remove
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!ips.data?.length && (
                    <div className="py-16 text-center">
                        <IconShield size={40} className="mx-auto mb-3 text-gray-300" />
                        <p className="text-gray-400 text-[14px]">No blocked IPs. Your firewall is clean.</p>
                    </div>
                )}
            </div>

            {/* Add IP Modal */}
            {showAdd && (
                <>
                    <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowAdd(false)} />
                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="font-black text-[16px] flex items-center gap-2"><IconBan size={18}/> Block IP Address</h3>
                            <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-gray-700 border-none bg-transparent cursor-pointer"><IconX size={18}/></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[12px] font-bold text-gray-600 block mb-1.5">IP Address *</label>
                                <input className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] font-mono outline-none focus:border-red-400"
                                    placeholder="192.168.1.1" value={form.ip} onChange={e => setForm({...form, ip:e.target.value})} />
                            </div>
                            <div>
                                <label className="text-[12px] font-bold text-gray-600 block mb-1.5">Reason *</label>
                                <input className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-red-400"
                                    placeholder="e.g. Spamming contact form, DDoS attack" value={form.reason} onChange={e => setForm({...form, reason:e.target.value})} />
                            </div>
                            <div>
                                <label className="text-[12px] font-bold text-gray-600 block mb-1.5">Duration (hours) — leave blank for permanent</label>
                                <input type="number" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-red-400"
                                    placeholder="24 (blank = permanent)" value={form.hours} onChange={e => setForm({...form, hours:e.target.value})} />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-5">
                            <button onClick={addIp}
                                className="flex-1 py-2.5 rounded-xl font-bold text-[13px] border-none cursor-pointer"
                                style={{ background:'#DC2626', color:'white' }}>
                                <IconBan size={14} className="inline mr-1.5" /> Block IP
                            </button>
                            <button onClick={() => setShowAdd(false)}
                                className="flex-1 py-2.5 rounded-xl font-bold text-[13px] border border-gray-200 bg-white cursor-pointer text-gray-600">
                                Cancel
                            </button>
                        </div>
                    </div>
                </>
            )}
            <ConfirmDeleteModal
                open={!!pendingRemove}
                title="Remove this IP block? It will be able to access the site again immediately."
                itemName={pendingRemove?.ip}
                onConfirm={() => { if (pendingRemove) router.delete(`${window.location.pathname}/${pendingRemove.id}`, { preserveScroll: true, onFinish: () => setPendingRemove(null) }) }}
                onCancel={() => setPendingRemove(null)}
            />
        </AdminLayout>
    )
}
