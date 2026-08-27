import { Head, router } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import { useState } from 'react'

interface Return { id:number; return_number:string; customer_name:string; customer_email:string; order_id:number; reason:string; description:string; status:string; refund_amount:number; created_at:string; order_total:number }
interface Props { returns:{data:Return[];total:number}; stats:{requested:number;approved:number;refunded:number;total_refunded:number} }

const SC:Record<string,string>={requested:'#F59E0B',approved:'#3B82F6',received:'#8B5CF6',refunded:'#10B981',rejected:'#EF4444'}
const fmt=(n:number)=>'Rs '+Number(n).toLocaleString('en-PK')

export default function ReturnsIndex({ returns, stats }:Props) {
    const ap='/ml-admin'
    const [editing, setEditing] = useState<Return|null>(null)
    const [form, setForm]       = useState({ status:'', admin_notes:'', refund_amount:'' })

    function startEdit(r:Return){ setEditing(r); setForm({ status:r.status, admin_notes:'', refund_amount:String(r.refund_amount||r.order_total||0) }) }
    function submit(e:React.FormEvent){
        e.preventDefault(); if(!editing) return; router.patch(`${ap}/returns/${editing.id}`, form, { onSuccess:()=>setEditing(null) }) }

    return (
        <AdminLayout title="Returns & Refunds">
            <Head title="Returns"/>
            <div className="grid grid-cols-4 gap-3 mb-5">
                {[{l:'Requested',v:stats.requested,c:'#F59E0B'},{l:'Approved',v:stats.approved,c:'#3B82F6'},{l:'Refunded',v:stats.refunded,c:'#10B981'},{l:'Total Refunded',v:fmt(stats.total_refunded),c:'#EF4444'}].map(s=>(
                    <div key={s.l} className="bg-white rounded-2xl border border-gray-100 p-4">
                        <p className="font-black text-[22px]" style={{color:s.c}}>{s.v}</p>
                        <p className="text-[12px] text-gray-400">{s.l}</p>
                    </div>
                ))}
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <table className="w-full text-[13px]">
                    <thead><tr className="border-b border-gray-100">{['Return#','Customer','Order','Reason','Status','Amount','Date',''].map(h=><th key={h} className="text-left px-5 py-3.5 text-[11px] font-black text-gray-400 uppercase tracking-wide">{h}</th>)}</tr></thead>
                    <tbody className="divide-y divide-gray-50">
                        {returns.data.map(r=>(
                            <tr key={r.id} className="hover:bg-gray-50">
                                <td className="px-5 py-4 font-mono text-[12px] text-gray-500">{r.return_number}</td>
                                <td className="px-5 py-4"><p className="font-semibold text-gray-800">{r.customer_name}</p><p className="text-[11.5px] text-gray-400">{r.customer_email}</p></td>
                                <td className="px-5 py-4"><a href={`${ap}/orders/${r.order_id}`} className="font-bold no-underline" style={{color:'var(--color-primary)'}}>#{r.order_id}</a><p className="text-[11px] text-gray-400">{fmt(r.order_total)}</p></td>
                                <td className="px-5 py-4 max-w-[150px]"><p className="font-semibold text-gray-800 truncate">{r.reason}</p></td>
                                <td className="px-5 py-4"><span className="text-[11px] font-black px-2.5 py-1 rounded-full text-white" style={{background:SC[r.status]||'#6B7280'}}>{r.status}</span></td>
                                <td className="px-5 py-4 font-bold text-gray-800">{r.refund_amount?fmt(r.refund_amount):'—'}</td>
                                <td className="px-5 py-4 text-gray-400 text-[12px]">{new Date(r.created_at).toLocaleDateString()}</td>
                                <td className="px-5 py-4">{!['refunded','rejected'].includes(r.status)&&<button onClick={()=>startEdit(r)} className="text-[12px] font-bold px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 bg-white cursor-pointer hover:bg-gray-50">Update</button>}</td>
                            </tr>
                        ))}
                        {returns.data.length===0&&<tr><td colSpan={8} className="px-5 py-12 text-center text-gray-400 font-bold">No return requests yet</td></tr>}
                    </tbody>
                </table>
            </div>

            {editing&&<div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:'rgba(0,0,0,0.5)'}}>
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                    <h3 className="font-black text-[17px] mb-1">Update Return {editing.return_number}</h3>
                    <p className="text-[13px] text-gray-400 mb-5">{editing.customer_name} · Order #{editing.order_id}</p>
                    <form onSubmit={submit} className="space-y-4">
                        <div><label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">Status</label>
                            <select className="w-full h-11 px-4 border border-gray-200 rounded-xl text-[13.5px] outline-none bg-white" value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>
                                {[['approved','Approve'],['rejected','Reject'],['received','Mark Received'],['refunded','Refund Processed']].map(([v,l])=><option key={v} value={v}>{l}</option>)}
                            </select>
                        </div>
                        {form.status==='refunded'&&<div><label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">Refund Amount</label><input type="number" className="w-full h-11 px-4 border border-gray-200 rounded-xl text-[13.5px] outline-none" value={form.refund_amount} onChange={e=>setForm(f=>({...f,refund_amount:e.target.value}))}/></div>}
                        <div><label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">Note to Customer</label><textarea className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-[13.5px] outline-none resize-none" rows={3} value={form.admin_notes} onChange={e=>setForm(f=>({...f,admin_notes:e.target.value}))} placeholder="Explain decision to customer..."/></div>
                        <div className="flex gap-3">
                            <button type="submit" className="flex-1 h-11 rounded-xl font-bold text-[14px] border-none cursor-pointer" style={{background:'var(--color-primary)',color:'var(--color-primary-text)'}}>Save & Email Customer</button>
                            <button type="button" onClick={()=>setEditing(null)} className="h-11 px-5 rounded-xl border-2 border-gray-200 text-gray-600 font-bold cursor-pointer bg-white">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>}
        </AdminLayout>
    )
}
