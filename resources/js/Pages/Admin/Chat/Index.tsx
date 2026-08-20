import { Head, router } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import { useState, useEffect, useRef } from 'react'
import { IconSend, IconUserCheck, IconX, IconMessageCircle, IconRobot, IconPlus, IconTrash } from '@tabler/icons-react'

interface Session { id: number; session_id: string; visitor_name: string; visitor_email: string; status: string; agent_name: string; last_message: string; unread_count: number; created_at: string }
interface Faq { id: number; question: string; answer: string; category: string; keywords: string; is_active: boolean }
interface Message { id: number; sender_type: string; message: string; message_type: string; created_at: string }

interface Props {
    sessions: Session[]
    faqs: Faq[]
    stats: { waiting: number; my_active: number; today: number; avg_rating: number }
}

export default function ChatAdmin({ sessions, faqs, stats }: Props) {
    const ap = '/ml-admin'
    const [activeSession, setActiveSession] = useState<Session | null>(null)
    const [messages, setMessages]     = useState<Message[]>([])
    const [input, setInput]           = useState('')
    const [lastId, setLastId]         = useState(0)
    const [waitingCount, setWaiting]  = useState(stats.waiting)
    const [tab, setTab]               = useState<'chats'|'faq'>('chats')
    const [showFaqForm, setFaqForm]   = useState(false)
    const [faqData, setFaqData]       = useState({ question:'', answer:'', category:'general', keywords:'' })
    const bottomRef                   = useRef<HTMLDivElement>(null)
    const pollRef                     = useRef<ReturnType<typeof setInterval>>()

    // Heartbeat — marks agent as online
    useEffect(() => {
        const hb = setInterval(async () => {
            const r = await fetch(`${ap}/chat/heartbeat`, { method: 'POST', headers: { 'X-CSRF-TOKEN': document.querySelector<HTMLInputElement>('meta[name=csrf-token]')?.content || '' } })
            const d = await r.json()
            setWaiting(d.waiting)
        }, 15000)
        // Initial heartbeat
        fetch(`${ap}/chat/heartbeat`, { method: 'POST', headers: { 'X-CSRF-TOKEN': document.querySelector<HTMLInputElement>('meta[name=csrf-token]')?.content || '' } })
        return () => clearInterval(hb)
    }, [])

    // Poll active session messages
    useEffect(() => {
        if (!activeSession) return
        clearInterval(pollRef.current)
        pollRef.current = setInterval(async () => {
            const r = await fetch(`${ap}/chat/sessions/${activeSession.id}/poll?since=${lastId}`)
            const d = await r.json()
            if (d.messages?.length) {
                setMessages(m => [...m, ...d.messages])
                setLastId(d.messages[d.messages.length - 1].id)
            }
            setWaiting(d.unread_waiting ?? waitingCount)
        }, 2000)
        return () => clearInterval(pollRef.current)
    }, [activeSession, lastId])

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

    async function joinSession(s: Session) {
        await fetch(`${ap}/chat/sessions/${s.id}/join`, {
            method: 'POST',
            headers: { 'X-CSRF-TOKEN': document.querySelector<HTMLInputElement>('meta[name=csrf-token]')?.content || '' },
        })
        // Load messages
        const r = await fetch(`${ap}/chat/sessions/${s.id}/messages`)
        const d = await r.json()
        setMessages(d.messages || [])
        setLastId(d.messages?.length ? d.messages[d.messages.length-1].id : 0)
        setActiveSession({ ...s, status: 'active' })
        router.reload()
    }

    async function sendReply() {
        if (!input.trim() || !activeSession) return
        const msg = input.trim()
        setInput('')
        setMessages(m => [...m, { id: Date.now(), sender_type: 'agent', message: msg, message_type: 'text', created_at: new Date().toISOString() }])
        await fetch(`${ap}/chat/sessions/${activeSession.id}/reply`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.querySelector<HTMLInputElement>('meta[name=csrf-token]')?.content || '' },
            body: JSON.stringify({ message: msg }),
        })
    }

    async function closeSession() {
        if (!activeSession) return
        await fetch(`${ap}/chat/sessions/${activeSession.id}/close`, {
            method: 'POST',
            headers: { 'X-CSRF-TOKEN': document.querySelector<HTMLInputElement>('meta[name=csrf-token]')?.content || '' },
        })
        setActiveSession(null)
        setMessages([])
        router.reload()
    }

    function addFaq(e: React.FormEvent) {
        e.preventDefault()
        router.post(`${ap}/chat/faqs`, faqData, { onSuccess: () => { setFaqData({ question:'', answer:'', category:'general', keywords:'' }); setFaqForm(false) } })
    }

    const senderColor: Record<string, string> = { visitor: '#F3F4F6', agent: 'var(--color-dark-bg, #0a0a0a)', bot: '#EFF6FF', system: '#F9FAFB' }
    const senderText: Record<string, string>  = { visitor: '#111', agent: 'white', bot: '#1E40AF', system: '#6B7280' }

    return (
        <AdminLayout title="Live Chat">
            <Head title="Live Chat" />

            {/* Stats */}
            <div className="grid grid-cols-4 gap-3 mb-5">
                {[
                    { label:'Waiting', value: waitingCount, color:'#F59E0B', icon:'⏳' },
                    { label:'My Active', value: stats.my_active, color:'#10B981', icon:'💬' },
                    { label:'Today', value: stats.today, color:'#3B82F6', icon:'📊' },
                    { label:'Avg Rating', value: stats.avg_rating + '★', color:'#F59E0B', icon:'⭐' },
                ].map(s => (
                    <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4">
                        <div className="text-xl mb-1">{s.icon}</div>
                        <p className="font-black text-[22px]" style={{ color: s.color }}>{s.value}</p>
                        <p className="text-[12px] text-gray-400">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-4">
                {[['chats','💬 Live Chats'],['faq','🤖 Bot FAQs']].map(([k,l]) => (
                    <button key={k} onClick={() => setTab(k as any)}
                        className="px-5 py-2 rounded-xl font-bold text-[13px] border-none cursor-pointer transition-all"
                        style={{ background: tab === k ? 'var(--color-dark-bg)' : '#F3F4F6', color: tab === k ? 'white' : '#6B7280' }}>
                        {l}
                    </button>
                ))}
            </div>

            {tab === 'chats' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" style={{ height: 'calc(100vh - 280px)' }}>

                    {/* Session list */}
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-y-auto">
                        <div className="p-4 border-b border-gray-100">
                            <p className="font-black text-[14px] text-gray-800">Active Conversations</p>
                        </div>
                        {sessions.length === 0 && (
                            <div className="p-8 text-center text-gray-400">
                                <IconMessageCircle size={36} className="mx-auto mb-3 opacity-30" />
                                <p className="font-bold text-[13px]">No active chats</p>
                                <p className="text-[12px] mt-1">Waiting sessions will appear here</p>
                            </div>
                        )}
                        {sessions.map(s => (
                            <div key={s.id}
                                onClick={() => s.status === 'waiting' ? joinSession(s) : setActiveSession(s)}
                                className={`p-4 border-b border-gray-50 cursor-pointer transition-all hover:bg-gray-50 ${activeSession?.id === s.id ? 'bg-blue-50' : ''}`}>
                                <div className="flex items-center justify-between mb-1">
                                    <p className="font-bold text-[13px] text-gray-800">{s.visitor_name || 'Visitor'}</p>
                                    <div className="flex items-center gap-2">
                                        {s.unread_count > 0 && (
                                            <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center">{s.unread_count}</span>
                                        )}
                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${s.status === 'waiting' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                                            {s.status === 'waiting' ? '⏳ Waiting' : '🟢 Active'}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-[12px] text-gray-400 truncate">{s.last_message || 'No messages yet'}</p>
                                {s.status === 'waiting' && (
                                    <button className="mt-2 text-[11px] font-black px-3 py-1 rounded-lg text-white border-none cursor-pointer"
                                        style={{ background: 'var(--color-primary)', color: 'var(--color-primary-text)' }}>
                                        Join Chat →
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Chat window */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 flex flex-col overflow-hidden">
                        {!activeSession ? (
                            <div className="flex-1 flex items-center justify-center text-gray-400">
                                <div className="text-center">
                                    <IconMessageCircle size={48} className="mx-auto mb-3 opacity-20" />
                                    <p className="font-bold">Select a conversation</p>
                                    <p className="text-[12px] mt-1">or wait for new chats</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Chat header */}
                                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                                    <div>
                                        <p className="font-bold text-[14px] text-gray-800">{activeSession.visitor_name || 'Visitor'}</p>
                                        <p className="text-[12px] text-gray-400">{activeSession.visitor_email}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="text-[11px] font-black px-3 py-1 rounded-full bg-green-100 text-green-700">🟢 You're Connected</span>
                                        <button onClick={closeSession}
                                            className="h-9 px-4 rounded-xl text-[12px] font-bold border border-red-200 text-red-500 bg-white cursor-pointer hover:bg-red-50 transition-all">
                                            End Chat
                                        </button>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                    {messages.map((m, i) => (
                                        <div key={m.id || i}>
                                            {m.sender_type === 'system' ? (
                                                <p className="text-center text-[11px] text-gray-400 bg-gray-50 rounded-lg py-1.5 px-3">{m.message}</p>
                                            ) : (
                                                <div style={{ display:'flex', flexDirection: m.sender_type === 'visitor' ? 'row' : 'row-reverse', gap: 8, alignItems:'flex-end' }}>
                                                    <div style={{
                                                        maxWidth:'70%',
                                                        background: senderColor[m.sender_type] || '#F3F4F6',
                                                        color: senderText[m.sender_type] || '#111',
                                                        borderRadius: 14, padding:'8px 12px',
                                                        fontSize: 13, lineHeight: 1.5, whiteSpace:'pre-line',
                                                    }}>
                                                        {m.sender_type === 'bot' && <span className="text-[10px] font-black opacity-60 block mb-0.5">🤖 Bot</span>}
                                                        {m.message}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    <div ref={bottomRef} />
                                </div>

                                {/* Input */}
                                <div className="p-3 border-t border-gray-100 flex gap-2">
                                    <input value={input} onChange={e => setInput(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendReply())}
                                        placeholder="Type reply to customer..."
                                        className="flex-1 h-11 px-4 border border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)]" />
                                    <button onClick={sendReply} disabled={!input.trim()}
                                        className="w-11 h-11 rounded-xl border-none flex items-center justify-center cursor-pointer disabled:opacity-40"
                                        style={{ background: 'var(--color-dark-bg)' }}>
                                        <IconSend size={18} color="white" />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            ) : (
                /* FAQ Management */
                <div className="bg-white rounded-2xl border border-gray-100">
                    <div className="flex items-center justify-between p-5 border-b border-gray-100">
                        <div>
                            <h3 className="font-black text-[15px] text-gray-800">Bot FAQ Answers</h3>
                            <p className="text-[12px] text-gray-400 mt-0.5">The bot searches these when customers ask questions</p>
                        </div>
                        <button onClick={() => setFaqForm(true)}
                            className="flex items-center gap-2 h-9 px-4 rounded-xl font-bold text-[13px] border-none cursor-pointer text-white"
                            style={{ background: 'var(--color-primary)', color: 'var(--color-primary-text)' }}>
                            <IconPlus size={15} /> Add FAQ
                        </button>
                    </div>

                    {showFaqForm && (
                        <div className="p-5 border-b border-gray-100 bg-gray-50">
                            <form onSubmit={addFaq} className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">Question *</label>
                                        <input className="w-full h-10 px-3 border border-gray-200 rounded-xl text-[13px] outline-none focus:border-[var(--color-primary)]"
                                            value={faqData.question} onChange={e => setFaqData(d => ({...d, question: e.target.value}))} required placeholder="What is your return policy?" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">Category</label>
                                        <select className="w-full h-10 px-3 border border-gray-200 rounded-xl text-[13px] outline-none bg-white"
                                            value={faqData.category} onChange={e => setFaqData(d => ({...d, category: e.target.value}))}>
                                            {['general','orders','shipping','returns','payment','products'].map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">Answer *</label>
                                    <textarea className="w-full px-3 py-2 border border-gray-200 rounded-xl text-[13px] outline-none focus:border-[var(--color-primary)] resize-none"
                                        rows={3} value={faqData.answer} onChange={e => setFaqData(d => ({...d, answer: e.target.value}))} required
                                        placeholder="We have a 7-day return policy..." />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">Keywords (comma separated)</label>
                                    <input className="w-full h-10 px-3 border border-gray-200 rounded-xl text-[13px] outline-none focus:border-[var(--color-primary)]"
                                        value={faqData.keywords} onChange={e => setFaqData(d => ({...d, keywords: e.target.value}))}
                                        placeholder="return, refund, exchange, send back" />
                                </div>
                                <div className="flex gap-2">
                                    <button type="submit" className="h-9 px-5 rounded-xl font-bold text-[13px] border-none cursor-pointer text-white" style={{ background: 'var(--color-primary)', color: 'var(--color-primary-text)' }}>
                                        Save FAQ
                                    </button>
                                    <button type="button" onClick={() => setFaqForm(false)} className="h-9 px-4 rounded-xl font-bold text-[13px] border border-gray-200 text-gray-600 bg-white cursor-pointer">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="divide-y divide-gray-50">
                        {faqs.map(faq => (
                            <div key={faq.id} className="p-5 hover:bg-gray-50 transition-colors">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{faq.category}</span>
                                            {!faq.is_active && <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-red-100 text-red-500">Disabled</span>}
                                        </div>
                                        <p className="font-bold text-[13.5px] text-gray-800 mb-1">Q: {faq.question}</p>
                                        <p className="text-[12.5px] text-gray-500 leading-relaxed">A: {faq.answer.slice(0, 150)}{faq.answer.length > 150 ? '...' : ''}</p>
                                        {faq.keywords && (
                                            <p className="text-[11px] text-gray-400 mt-1">Keywords: {faq.keywords}</p>
                                        )}
                                    </div>
                                    <button onClick={() => router.delete(`/ml-admin/chat/faqs/${faq.id}`)}
                                        className="w-8 h-8 rounded-lg border border-red-100 flex items-center justify-center text-red-400 hover:bg-red-50 cursor-pointer bg-white flex-shrink-0">
                                        <IconTrash size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {faqs.length === 0 && (
                            <div className="p-12 text-center text-gray-400">
                                <IconRobot size={40} className="mx-auto mb-3 opacity-20" />
                                <p className="font-bold">No FAQs yet</p>
                                <p className="text-[12px] mt-1">Add questions and answers for the bot to use</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </AdminLayout>
    )
}
