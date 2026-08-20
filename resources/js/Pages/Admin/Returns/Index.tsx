import { Head, router } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import { useState } from 'react'
import { IconCheck, IconX } from '@tabler/icons-react'

interface Return { id:number; return_number:string; customer_name:string; customer_email:string; order_id:number; reason:string; description:string; status:string; refund_amount:number; refund_method:string; created_at:string; order_total:number }
interface Props { returns:{data:Return[];total:number}; stats:{requested:number;approved:number;refunded:number;total_refunded:number} }

const statusColor:Record<string,string> = { requested:'#F59E0B', approved:'#3B82F6', received:'#8B5CF6', refunded:'#10B981', rejected:'#EF4444' }

export default function ReturnsIndex({ returns, stats }: Props) {
    const [editing, setEditing] = useState<Return | null>(null)
    const [form, setForm]       = useState({ status:'', admin_notes:'', refund_amount:'', refund_method:'original' })
    const ap = '/ml-admin'

    function startEdit(r: Return) {
        setEditing(r)
        setForm({ status: r.status, admin_notes:'', refund_amount: String(r.refund_amount||r.order_total), refund_method: r.refund_method||'original' })
    }

    function submit(e: React.FormEvent) {
        e.preventDefault()
        if (!editing) return
        router.patch(`${ap}/returns/${editing.id}`, form, { onSuccess: () => setEditing(null) })
    }

    const fmt = (n:number) => 'Rs ' + Number(n).toLocaleString('en-PK')

    return (
        <AdminLayout title="Returns & Refunds">
            <Head title="Returns" />

            <div className="grid grid-cols-4 gap-3 mb-5">
                {[
                    { label:'Requested', value:stats.requested, color:'#F59E0B' },
                    { label:'Approved', value:stats.approved, color:'#3B82F6' },
                    { label:'Refunded', value:stats.refunded, color:'#10B981' },
                    { label:'Total Refunded', value:fmt(stats.total_refunded), color:'#EF4444' },
                ].map(s=>(
                    <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4">
                        <p className="font-black text-[22px]" style={{color:s.color}}>{s.value}</p>
                        <p className="text-[12px] text-gray-400">{s.label}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <table className="w-full text-[13px]">
                    <thead>
                        <tr className="border-b border-gray-100">
                            {['Return#','Customer','Order','Reason','Status','Amount','Date','Action'].map(h=>(
                                <th key={h} className="text-left px-5 py-3.5 text-[11px] font-black text-gray-400 uppercase tracking-wide">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {returns.data.map(r=>(
                            <tr key={r.id} className="hover:bg-gray-50">
                                <td className="px-5 py-4 font-mono text-[12px] text-gray-500">{r.return_number}</td>
                                <td className="px-5 py-4">
                                    <p className="font-semibold text-gray-800">{r.customer_name}</p>
                                    <p className="text-[11.5px] text-gray-400">{r.customer_email}</p>
                                </td>
                                <td className="px-5 py-4">
                                    <a href={`${ap}/orders/${r.order_id}`} className="font-bold text-[var(--color-primary)] no-underline">#{r.order_id}</a>
                                    <p className="text-[11px] text-gray-400">{fmt(r.order_total)}</p>
                                </td>
                                <td className="px-5 py-4 max-w-[150px]">
                                    <p className="font-semibold text-gray-800 truncate">{r.reason}</p>
                                    {r.description && <p className="text-[11.5px] text-gray-400 truncate">{r.description.slice(0,60)}</p>}
                                </td>
                                <td className="px-5 py-4">
                                    <span className="text-[11px] font-black px-2.5 py-1 rounded-full text-white"
                                        style={{background:statusColor[r.status]||'#6B7280'}}>
                                        {r.status}
                                    </span>
                                </td>
                                <td className="px-5 py-4 font-bold text-gray-800">{r.refund_amount ? fmt(r.refund_amount) : '—'}</td>
                                <td className="px-5 py-4 text-gray-400 text-[12px]">{new Date(r.created_at).toLocaleDateString()}</td>
                                <td className="px-5 py-4">
                                    {!['refunded','rejected'].includes(r.status) && (
                                        <button onClick={()=>startEdit(r)}
                                            className="text-[12px] font-bold px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 bg-white cursor-pointer hover:bg-gray-50">
                                            Update
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {returns.data.length===0 && (
                            <tr><td colSpan={8} className="px-5 py-12 text-center text-gray-400">
                                <p className="font-bold">No return requests yet</p>
                            </td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {editing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:'rgba(0,0,0,0.5)'}}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                        <h3 className="font-black text-[17px] text-gray-900 mb-1">Update Return {editing.return_number}</h3>
                        <p className="text-[13px] text-gray-400 mb-5">Customer: {editing.customer_name} · Order #{editing.order_id}</p>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">Status</label>
                                <select className="w-full h-11 px-4 border border-gray-200 rounded-xl text-[13.5px] outline-none bg-white"
                                    value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>
                                    <option value="approved">Approve Return</option>
                                    <option value="rejected">Reject Return</option>
                                    <option value="received">Item Received</option>
                                    <option value="refunded">Refund Processed</option>
                                </select>
                            </div>
                            {form.status==='refunded' && (
                                <>
                                    <div>
                                        <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">Refund Amount</label>
                                        <input type="number" className="w-full h-11 px-4 border border-gray-200 rounded-xl text-[13.5px] outline-none"
                                            value={form.refund_amount} onChange={e=>setForm(f=>({...f,refund_amount:e.target.value}))} />
                                    </div>
                                    <div>
                                        <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">Refund Method</label>
                                        <select className="w-full h-11 px-4 border border-gray-200 rounded-xl text-[13.5px] outline-none bg-white"
                                            value={form.refund_method} onChange={e=>setForm(f=>({...f,refund_method:e.target.value}))}>
                                            <option value="original">Original Payment Method</option>
                                            <option value="bank">Bank Transfer</option>
                                            <option value="wallet">Store Wallet/Credit</option>
                                        </select>
                                    </div>
                                </>
                            )}
                            <div>
                                <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">Notes to Customer</label>
                                <textarea className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-[13.5px] outline-none resize-none"
                                    rows={3} value={form.admin_notes} onChange={e=>setForm(f=>({...f,admin_notes:e.target.value}))}
                                    placeholder="Explain the decision to the customer..." />
                            </div>
                            <div className="flex gap-3">
                                <button type="submit" className="flex-1 h-11 rounded-xl font-bold text-[14px] border-none cursor-pointer text-white" style={{background:'var(--color-primary)',color:'var(--color-primary-text)'}}>
                                    Save & Email Customer
                                </button>
                                <button type="button" onClick={()=>setEditing(null)} className="h-11 px-5 rounded-xl border-2 border-gray-200 text-gray-600 font-bold cursor-pointer bg-white">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    )
}
