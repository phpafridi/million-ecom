import { Head, router, useForm } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import { IconSend, IconArrowLeft } from '@tabler/icons-react'

interface Reply { id:number; message:string; is_staff:boolean; replier_name:string; created_at:string }
interface Props { ticket:any; replies:Reply[] }

export default function SupportShow({ ticket, replies }:Props) {
    const ap = '/ml-admin'
    const { data, setData, post, processing, reset } = useForm({ message:'' })
    function send(e:React.FormEvent){ e.preventDefault(); post(`${ap}/support/${ticket.id}/reply`, { onSuccess:()=>reset() }) }
    const PC:Record<string,string> = { urgent:'#EF4444', high:'#F59E0B', normal:'#3B82F6', low:'#6B7280' }

    return (
        <AdminLayout title={`Ticket #${ticket.ticket_number}`}>
            <Head title={`Support — ${ticket.ticket_number}`}/>
            <div className="mb-4">
                <button onClick={()=>router.visit(`${ap}/support`)} className="flex items-center gap-2 text-[13px] font-bold text-gray-500 hover:text-gray-800 bg-transparent border-none cursor-pointer">
                    <IconArrowLeft size={15}/> Back to Tickets
                </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2 space-y-4">
                    {/* Original message */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-5">
                        <div className="flex items-center justify-between mb-3">
                            <p className="font-black text-[15px] text-gray-800">{ticket.subject}</p>
                            <span className="text-[11px] font-black px-2.5 py-1 rounded-full text-white" style={{background:PC[ticket.priority]||'#6B7280'}}>{ticket.priority}</span>
                        </div>
                        <p className="text-[13.5px] text-gray-600 leading-relaxed whitespace-pre-line">{ticket.message}</p>
                        <p className="text-[11px] text-gray-400 mt-3">{new Date(ticket.created_at).toLocaleString()}</p>
                    </div>
                    {/* Replies */}
                    {replies.map(r=>(
                        <div key={r.id} className={`rounded-2xl border p-4 ${r.is_staff?'border-blue-100 bg-blue-50':'bg-white border-gray-100'}`}>
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`text-[11px] font-black px-2 py-0.5 rounded-full ${r.is_staff?'bg-blue-600 text-white':'bg-gray-100 text-gray-600'}`}>{r.is_staff?'Staff: '+r.replier_name:'Customer'}</span>
                                <span className="text-[11px] text-gray-400">{new Date(r.created_at).toLocaleString()}</span>
                            </div>
                            <p className="text-[13.5px] text-gray-700 whitespace-pre-line">{r.message}</p>
                        </div>
                    ))}
                    {/* Reply form */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-5">
                        <p className="font-bold text-[14px] text-gray-800 mb-3">Reply to Customer</p>
                        <form onSubmit={send} className="space-y-3">
                            <textarea className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)] resize-none" rows={5} value={data.message} onChange={e=>setData('message',e.target.value)} required placeholder="Type your reply... Customer will receive this via email."/>
                            <button type="submit" disabled={processing} className="flex items-center gap-2 h-11 px-6 rounded-xl font-bold text-[13px] border-none cursor-pointer disabled:opacity-60" style={{background:'var(--color-primary)',color:'var(--color-primary-text)'}}>
                                <IconSend size={15}/> {processing?'Sending...':'Send Reply & Email'}
                            </button>
                        </form>
                    </div>
                </div>
                {/* Ticket info */}
                <div className="space-y-4">
                    <div className="bg-white rounded-2xl border border-gray-100 p-5">
                        <p className="font-black text-[13px] text-gray-500 uppercase tracking-wide mb-3">Ticket Info</p>
                        {[['Ticket#',ticket.ticket_number],['From',ticket.name],['Email',ticket.email],['Phone',ticket.phone||'—'],['Status',ticket.status],['Priority',ticket.priority],['Created',new Date(ticket.created_at).toLocaleDateString()]].map(([l,v])=>(
                            <div key={l} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 text-[13px]">
                                <span className="text-gray-400 font-semibold">{l}</span>
                                <span className="font-bold text-gray-800">{v}</span>
                            </div>
                        ))}
                        <div className="mt-4">
                            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">Update Status</label>
                            <select className="w-full h-10 px-3 border border-gray-200 rounded-xl text-[13px] outline-none bg-white"
                                defaultValue={ticket.status}
                                onChange={e=>router.patch(`${ap}/support/${ticket.id}`,{status:e.target.value},{preserveScroll:true})}>
                                {['open','in_progress','resolved','closed'].map(s=><option key={s} value={s}>{s.replace('_',' ')}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
