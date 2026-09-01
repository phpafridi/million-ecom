import { Head, router, usePage } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import { useState, useEffect, useRef } from 'react'
import { useEchoPublic } from '@laravel/echo-react'
import { IconSend, IconX, IconPlus, IconTrash, IconRobot, IconMessageCircle } from '@tabler/icons-react'

interface Session { id:number; visitor_name:string; visitor_email:string; status:string; agent_name:string; last_message:string; unread_count:number; created_at:string }
interface Faq { id:number; question:string; answer:string; category:string; keywords:string; is_active:boolean }
interface Message { id:number; sender_type:string; message:string; message_type:string; created_at:string }
interface Props { sessions:Session[]; faqs:Faq[]; stats:{waiting:number;my_active:number;today:number;avg_rating:number} }

export default function ChatAdmin({ sessions, faqs, stats }:Props) {
    const { props: __p } = usePage<{ adminPath?: string }>()
    const ap = `/${__p?.adminPath ?? 'ml-admin'}`
    const [active, setActive]   = useState<Session|null>(null)
    // Same stale-closure fix as the customer widget — the useEchoPublic
    // callback below was reading `active` from whatever render created the
    // closure, not the current value, which could permanently miss updates
    // after switching between chats. Ref always reads the live value.
    const activeRef = useRef<Session|null>(null)
    const [msgs, setMsgs]       = useState<Message[]>([])
    const [input, setInput]     = useState('')
    const [lastId, setLastId]   = useState(0)
    const [waiting, setWaiting] = useState(stats.waiting)
    const [tab, setTab]         = useState<'chats'|'faq'>('chats')
    const [faqForm, setFaqForm] = useState(false)
    const [faq, setFaq]         = useState({ question:'', answer:'', category:'general', keywords:'' })
    const bottomRef = useRef<HTMLDivElement>(null)
    const csrf = ()=>(document.querySelector('meta[name=csrf-token]') as HTMLInputElement)?.content||''

    // Heartbeat removed entirely — it wrote is_online/last_seen_at to the
    // database every 15 seconds, but nothing anywhere in the app actually
    // displays or acts on that data (verified — only a scheduled cleanup
    // command reads it, to clear a value nothing shows). Its one genuinely
    // useful function, the waiting-count, now arrives via a real broadcast
    // instead — fired whenever a chat enters or leaves 'waiting' status.
    useEchoPublic('admin-chat-waiting', '.waiting.changed', (e: any) => {
        if (typeof e.waiting === 'number') setWaiting(e.waiting)
    })

    // Was polling every 2.5 seconds for new messages in whatever
    // conversation the admin has open — more aggressive than the customer
    // widget's old 15-second poll, and running for as long as an agent had
    // any chat window open. Now uses the same ChatMessageSent broadcast
    // already firing on this channel (customer widget listens on the exact
    // same channel/event) — one real-time pipeline for both sides instead
    // of two separate polling systems.
    useEffect(() => { activeRef.current = active }, [active])

    useEchoPublic(active ? `chat.${active.id}` : 'chat.__none__', '.message.sent', (e: any) => {
        if (!activeRef.current) return
        setMsgs(m => [...m, {
            id: Date.now(),
            sender_type: e.senderType,
            message: e.message,
            message_type: 'text',
            created_at: e.createdAt,
        }])
        if (e.status === 'closed') {
            // Reflect a customer-initiated close (e.g. they rated and ended
            // the chat) without needing a poll to notice it.
            router.reload({ only: ['sessions'] })
        }
    })

    useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:'smooth'}) },[msgs])

    async function join(s:Session){
        await fetch(`${ap}/chat/sessions/${s.id}/join`,{method:'POST',headers:{'X-CSRF-TOKEN':csrf()}})
        const r=await fetch(`${ap}/chat/sessions/${s.id}/messages`)
        const d=await r.json()
        setMsgs(d.messages||[])
        setLastId(d.messages?.length?d.messages[d.messages.length-1].id:0)
        setActive({...s,status:'active'})
        router.reload({only:['sessions']})
    }

    // Clicking any chat that ISN'T waiting (already active, closed,
    // historical) only ever set which session was "selected" — it never
    // actually fetched that conversation's messages, so the message panel
    // just stayed empty. join() isn't appropriate here since it also POSTs
    // to claim the chat as this agent's — fine for accepting a new waiting
    // chat, wrong for just viewing a closed one.
    async function viewSession(s:Session){
        setActive(s)
        setMsgs([])
        try {
            const r = await fetch(`${ap}/chat/sessions/${s.id}/messages`)
            const d = await r.json()
            setMsgs(d.messages||[])
            setLastId(d.messages?.length?d.messages[d.messages.length-1].id:0)
        } catch {}
    }

    async function sendReply(){
        if(!input.trim()||!active) return
        const msg=input.trim(); setInput('')
        // No longer adding this to local state immediately — that caused
        // the message to show twice, since the broadcast (now confirmed
        // fast and reliable) echoes it right back through the same
        // useEchoPublic listener a moment later. Relying purely on the
        // broadcast for display now, for both the agent's own messages and
        // the visitor's.
        await fetch(`${ap}/chat/sessions/${active.id}/reply`,{method:'POST',headers:{'Content-Type':'application/json','X-CSRF-TOKEN':csrf()},body:JSON.stringify({message:msg})})
    }

    async function closeChat(){
        if(!active) return
        await fetch(`${ap}/chat/sessions/${active.id}/close`,{method:'POST',headers:{'X-CSRF-TOKEN':csrf()}})
        setActive(null); setMsgs([]); router.reload({only:['sessions']})
    }

    function addFaq(e:React.FormEvent){
        e.preventDefault(); router.post(`${ap}/chat/faqs`,faq,{onSuccess:()=>{ setFaq({question:'',answer:'',category:'general',keywords:''}); setFaqForm(false) }}) }

    const bgColor:Record<string,string>={visitor:'#F3F4F6',agent:'var(--color-dark-bg,#0a0a0a)',bot:'#EFF6FF',system:'#F9FAFB'}
    const txtColor:Record<string,string>={visitor:'#111',agent:'white',bot:'#1E40AF',system:'#6B7280'}
    const inp="w-full h-10 px-3 border border-gray-200 rounded-xl text-[13px] outline-none focus:border-[var(--color-primary)]"

    return (
        <AdminLayout title="Live Chat">
            <Head title="Live Chat"/>
            <div className="grid grid-cols-4 gap-3 mb-5">
                {[{l:'Waiting',v:waiting,c:'#F59E0B',i:'⏳'},{l:'My Active',v:stats.my_active,c:'#10B981',i:'💬'},{l:'Today',v:stats.today,c:'#3B82F6',i:'📊'},{l:'Avg Rating',v:stats.avg_rating+'★',c:'#F59E0B',i:'⭐'}].map(s=>(
                    <div key={s.l} className="bg-white rounded-2xl border border-gray-100 p-4">
                        <div className="text-xl mb-1">{s.i}</div>
                        <p className="font-black text-[22px]" style={{color:s.c}}>{s.v}</p>
                        <p className="text-[12px] text-gray-400">{s.l}</p>
                    </div>
                ))}
            </div>

            <div className="flex gap-2 mb-4">
                {[['chats','💬 Live Chats'],['faq','🤖 Bot FAQs']].map(([k,l])=>(
                    <button key={k} onClick={()=>setTab(k as any)} className="px-5 py-2 rounded-xl font-bold text-[13px] border-none cursor-pointer" style={{background:tab===k?'var(--color-dark-bg)':'#F3F4F6',color:tab===k?'white':'#6B7280'}}>{l}</button>
                ))}
            </div>

            {tab==='chats'?(
                <div className="grid grid-cols-3 gap-4" style={{height:'calc(100vh - 300px)'}}>
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-y-auto">
                        <div className="p-4 border-b border-gray-100 font-black text-[14px] text-gray-800">Conversations {waiting>0&&<span className="ml-2 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{waiting} waiting</span>}</div>
                        {sessions.length===0&&<div className="p-8 text-center text-gray-400"><IconMessageCircle size={36} className="mx-auto mb-3 opacity-20"/><p className="font-bold text-[13px]">No active chats</p></div>}
                        {sessions.map(s=>(
                            <div key={s.id} onClick={()=>s.status==='waiting'?join(s):viewSession(s)} className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${active?.id===s.id?'bg-blue-50':''}`}>
                                <div className="flex items-center justify-between mb-1">
                                    <p className="font-bold text-[13px] text-gray-800">{s.visitor_name||'Visitor'}</p>
                                    <div className="flex items-center gap-1.5">
                                        {s.unread_count>0&&<span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center">{s.unread_count}</span>}
                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${s.status==='waiting'?'bg-amber-100 text-amber-700':'bg-green-100 text-green-700'}`}>{s.status==='waiting'?'Waiting':'Active'}</span>
                                    </div>
                                </div>
                                <p className="text-[12px] text-gray-400 truncate">{s.last_message||'No messages'}</p>
                                {s.status==='waiting'&&<button className="mt-2 text-[11px] font-black px-3 py-1 rounded-lg text-white border-none cursor-pointer" style={{background:'var(--color-primary)',color:'var(--color-primary-text)'}}>Join Chat →</button>}
                            </div>
                        ))}
                    </div>
                    <div className="col-span-2 bg-white rounded-2xl border border-gray-100 flex flex-col overflow-hidden">
                        {!active?(
                            <div className="flex-1 flex items-center justify-center text-gray-400">
                                <div className="text-center"><IconMessageCircle size={48} className="mx-auto mb-3 opacity-20"/><p className="font-bold">Select a conversation</p></div>
                            </div>
                        ):(
                            <>
                                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                                    <div><p className="font-bold text-[14px] text-gray-800">{active.visitor_name||'Visitor'}</p><p className="text-[12px] text-gray-400">{active.visitor_email}</p></div>
                                    <button onClick={closeChat} className="h-9 px-4 rounded-xl text-[12px] font-bold border border-red-200 text-red-500 bg-white cursor-pointer">End Chat</button>
                                </div>
                                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                    {msgs.map((m,i)=>(
                                        <div key={m.id||i}>
                                            {m.sender_type==='system'?<p className="text-center text-[11px] text-gray-400 bg-gray-50 rounded-lg py-1.5 px-3">{m.message}</p>:(
                                                <div style={{display:'flex',flexDirection:m.sender_type==='visitor'?'row':'row-reverse',gap:8,alignItems:'flex-end'}}>
                                                    <div style={{maxWidth:'70%',background:bgColor[m.sender_type]||'#F3F4F6',color:txtColor[m.sender_type]||'#111',borderRadius:12,padding:'8px 12px',fontSize:13,lineHeight:1.5,whiteSpace:'pre-line'}}>
                                                        {m.sender_type==='bot'&&<span className="text-[10px] font-black opacity-60 block mb-0.5">🤖 Bot</span>}
                                                        {m.message}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    <div ref={bottomRef}/>
                                </div>
                                <div className="p-3 border-t border-gray-100 flex gap-2">
                                    <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&(e.preventDefault(),sendReply())} placeholder="Type reply..." className={inp+" flex-1"}/>
                                    <button onClick={sendReply} disabled={!input.trim()} className="w-11 h-10 rounded-xl border-none flex items-center justify-center cursor-pointer disabled:opacity-40" style={{background:'var(--color-dark-bg)'}}><IconSend size={17} color="white"/></button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            ):(
                <div className="bg-white rounded-2xl border border-gray-100">
                    <div className="flex items-center justify-between p-5 border-b border-gray-100">
                        <div><h3 className="font-black text-[15px] text-gray-800">Bot FAQ Answers</h3><p className="text-[12px] text-gray-400 mt-0.5">Bot searches these when customers ask questions</p></div>
                        <button onClick={()=>setFaqForm(true)} className="flex items-center gap-2 h-9 px-4 rounded-xl font-bold text-[13px] border-none cursor-pointer" style={{background:'var(--color-primary)',color:'var(--color-primary-text)'}}><IconPlus size={15}/> Add FAQ</button>
                    </div>
                    {faqForm&&(
                        <div className="p-5 border-b border-gray-100 bg-gray-50">
                            <form onSubmit={addFaq} className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div><label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">Question *</label><input className={inp} value={faq.question} onChange={e=>setFaq(f=>({...f,question:e.target.value}))} required placeholder="What is your return policy?"/></div>
                                    <div><label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">Category</label>
                                        <select className={inp+" bg-white"} value={faq.category} onChange={e=>setFaq(f=>({...f,category:e.target.value}))}>
                                            {['general','orders','shipping','returns','payment','products'].map(c=><option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div><label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">Answer *</label><textarea className="w-full px-3 py-2 border border-gray-200 rounded-xl text-[13px] outline-none focus:border-[var(--color-primary)] resize-none" rows={3} value={faq.answer} onChange={e=>setFaq(f=>({...f,answer:e.target.value}))} required/></div>
                                <div><label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">Keywords (comma separated)</label><input className={inp} value={faq.keywords} onChange={e=>setFaq(f=>({...f,keywords:e.target.value}))} placeholder="return, refund, exchange"/></div>
                                <div className="flex gap-2">
                                    <button type="submit" className="h-9 px-5 rounded-xl font-bold text-[13px] border-none cursor-pointer" style={{background:'var(--color-primary)',color:'var(--color-primary-text)'}}>Save FAQ</button>
                                    <button type="button" onClick={()=>setFaqForm(false)} className="h-9 px-4 rounded-xl font-bold border border-gray-200 text-gray-600 bg-white cursor-pointer">Cancel</button>
                                </div>
                            </form>
                        </div>
                    )}
                    <div className="divide-y divide-gray-50">
                        {faqs.map(f=>(
                            <div key={f.id} className="p-5 hover:bg-gray-50 flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1"><span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{f.category}</span></div>
                                    <p className="font-bold text-[13.5px] text-gray-800 mb-1">Q: {f.question}</p>
                                    <p className="text-[12.5px] text-gray-500">{f.answer.slice(0,120)}{f.answer.length>120?'...':''}</p>
                                    {f.keywords&&<p className="text-[11px] text-gray-400 mt-1">Keywords: {typeof f.keywords==='string'?f.keywords:JSON.stringify(f.keywords)}</p>}
                                </div>
                                <button onClick={()=>{ if(confirm('Delete this FAQ?')) router.delete(`${ap}/chat/faqs/${f.id}`, {preserveScroll:true}) }} className="w-8 h-8 rounded-lg border border-red-100 flex items-center justify-center text-red-400 hover:bg-red-50 cursor-pointer bg-white flex-shrink-0"><IconTrash size={14}/></button>
                            </div>
                        ))}
                        {faqs.length===0&&<div className="p-12 text-center text-gray-400"><IconRobot size={40} className="mx-auto mb-3 opacity-20"/><p className="font-bold">No FAQs yet — add some so the bot can answer questions</p></div>}
                    </div>
                </div>
            )}
        </AdminLayout>
    )
}
