import { useState, useEffect, useRef, useCallback } from 'react'
import { IconX, IconSend, IconRobot, IconHeadset } from '@tabler/icons-react'

interface Message {
    id: number
    sender_type: 'visitor' | 'bot' | 'agent' | 'system'
    message: string
    message_type: string
    options?: string
    created_at: string
}

interface Props {
    settings: Record<string, string>
    auth?: { user?: { name: string; email: string } }
}

export default function ChatWidget({ settings, auth }: Props) {
    const [open, setOpen]             = useState(false)
    const [messages, setMessages]     = useState<Message[]>([])
    const [input, setInput]           = useState('')
    const [sessionId, setSessionId]   = useState<string | null>(null)
    const [status, setStatus]         = useState('bot')
    const [lastId, setLastId]         = useState(0)
    const [agentName, setAgentName]   = useState<string | null>(null)
    const [unread, setUnread]         = useState(0)
    const [showRating, setShowRating] = useState(false)
    const [rating, setRating]         = useState(0)
    const bottomRef                   = useRef<HTMLDivElement>(null)
    const pollRef                     = useRef<ReturnType<typeof setInterval>>()

    const chatColor = settings?.chat_bubble_color || 'var(--color-dark-bg, #0a0a0a)'
    const chatIcon  = settings?.chat_bubble_icon  || '💬'
    const siteName  = settings?.site_name         || 'MILLIONAIRE'
    const wa        = settings?.whatsapp_number   || ''

    const csrf = () => (document.querySelector('meta[name=csrf-token]') as HTMLInputElement)?.content || ''

    async function startChat() {
        try {
            const r = await fetch('/chat/start', { method:'POST', headers:{ 'Content-Type':'application/json', 'X-CSRF-TOKEN':csrf() } })
            const d = await r.json()
            setSessionId(d.session_id)
            setMessages(d.messages || [])
            setStatus(d.status)
            if (d.messages?.length) setLastId(d.messages[d.messages.length - 1].id)
        } catch {}
    }

    const poll = useCallback(async () => {
        if (!sessionId) return
        try {
            const r = await fetch(`/chat/poll?session_id=${sessionId}&since=${lastId}`)
            const d = await r.json()
            if (d.messages?.length) {
                setMessages(m => [...m, ...d.messages])
                setLastId(d.messages[d.messages.length - 1].id)
                if (!open) setUnread(u => u + d.messages.filter((m: Message) => m.sender_type !== 'visitor').length)
            }
            if (d.status) setStatus(d.status)
            if (d.agent) setAgentName(d.agent)
            if (d.status === 'closed') { setShowRating(true); clearInterval(pollRef.current) }
        } catch {}
    }, [sessionId, lastId, open])

    useEffect(() => {
        if (open && !sessionId) startChat()
        if (open) setUnread(0)
    }, [open])

    useEffect(() => {
        if (!sessionId) return
        clearInterval(pollRef.current)
        pollRef.current = setInterval(poll, 3000)
        return () => clearInterval(pollRef.current)
    }, [sessionId, poll])

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }) }, [messages])

    async function send(text?: string) {
        const msg = (text ?? input).trim()
        if (!msg || !sessionId) return
        setInput('')
        setMessages(m => [...m, { id:Date.now(), sender_type:'visitor', message:msg, message_type:'text', created_at:new Date().toISOString() }])
        try {
            await fetch('/chat/send', { method:'POST', headers:{ 'Content-Type':'application/json', 'X-CSRF-TOKEN':csrf() }, body:JSON.stringify({ message:msg, session_id:sessionId }) })
        } catch {}
    }

    async function requestAgent() {
        if (!sessionId) return
        await fetch('/chat/request-agent', { method:'POST', headers:{ 'Content-Type':'application/json', 'X-CSRF-TOKEN':csrf() }, body:JSON.stringify({ session_id:sessionId }) })
        setStatus('waiting')
    }

    async function submitRating() {
        if (!sessionId || !rating) return
        await fetch('/chat/rate', { method:'POST', headers:{ 'Content-Type':'application/json', 'X-CSRF-TOKEN':csrf() }, body:JSON.stringify({ session_id:sessionId, rating }) })
        setShowRating(false)
    }

    return (
        <>
            {/* ── Responsive positioning via CSS ── */}
            <style>{`
                /* BUTTON */
                .ml-chat-btn {
                    position: fixed;
                    bottom: 24px;
                    right: 24px;
                    z-index: 9990;
                    width: 54px;
                    height: 54px;
                    border-radius: 50%;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 6px 24px rgba(0,0,0,0.22);
                    transition: all 0.3s;
                }
                /* WINDOW */
                .ml-chat-win {
                    position: fixed;
                    bottom: 90px;
                    right: 24px;
                    z-index: 9991;
                    width: clamp(310px, 88vw, 380px);
                    height: clamp(440px, 65vh, 560px);
                    background: white;
                    border-radius: 20px;
                    box-shadow: 0 16px 56px rgba(0,0,0,0.18);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    border: 1px solid rgba(0,0,0,0.07);
                }
                /* MOBILE overrides — above bottom nav, left of Login tab */
                @media (max-width: 1023px) {
                    .ml-chat-btn {
                        bottom: calc(56px + env(safe-area-inset-bottom, 0px) + 10px);
                        right: 16px;
                        width: 46px;
                        height: 46px;
                    }
                    .ml-chat-win {
                        /* full-width sheet on mobile */
                        bottom: calc(56px + env(safe-area-inset-bottom, 0px) + 66px);
                        right: 8px;
                        left: 8px;
                        width: auto;
                        height: clamp(360px, 60vh, 520px);
                        border-radius: 16px;
                    }
                }
            `}</style>

            {/* Toggle Button */}
            <button
                className="ml-chat-btn"
                onClick={() => setOpen(o => !o)}
                style={{ background: open ? '#374151' : chatColor, fontSize: open ? 20 : 22 }}
            >
                {open ? <IconX size={20} color="white" /> : <span>{chatIcon}</span>}
                {!open && unread > 0 && (
                    <span style={{ position:'absolute', top:-3, right:-3, background:'#EF4444', color:'white', borderRadius:'50%', width:18, height:18, fontSize:10, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center' }}>
                        {unread}
                    </span>
                )}
            </button>

            {/* Chat Window */}
            {open && (
                <div className="ml-chat-win">
                    {/* Header */}
                    <div style={{ background:chatColor, padding:'13px 16px', display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
                        <div style={{ width:36, height:36, borderRadius:'50%', background:'var(--color-primary)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                            {status === 'active' ? <IconHeadset size={17} color="white"/> : <IconRobot size={17} color="white"/>}
                        </div>
                        <div style={{ flex:1 }}>
                            <p style={{ color:'white', fontWeight:800, fontSize:13.5, margin:0 }}>
                                {status === 'active' ? agentName ?? 'Support Agent' : `${siteName} Support`}
                            </p>
                            <p style={{ color:'rgba(255,255,255,0.55)', fontSize:11, margin:0 }}>
                                {status === 'active' ? '🟢 Live' : status === 'waiting' ? '⏳ Connecting...' : '🤖 AI + Live agents'}
                            </p>
                        </div>
                        {wa && <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" style={{ color:'#25D366', textDecoration:'none', fontSize:11, fontWeight:700 }}>WhatsApp</a>}
                        {/* Close on mobile */}
                        <button onClick={() => setOpen(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.7)', display:'flex', alignItems:'center', justifyContent:'center', padding:4 }}>
                            <IconX size={18} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div style={{ flex:1, overflowY:'auto', padding:'12px 12px 6px' }}>
                        {messages.map((msg, i) => (
                            <div key={msg.id || i} style={{ marginBottom:10 }}>
                                {msg.sender_type === 'system' ? (
                                    <div style={{ textAlign:'center', fontSize:11, color:'#9CA3AF', background:'#F9FAFB', borderRadius:8, padding:'5px 10px', margin:'6px 0' }}>{msg.message}</div>
                                ) : (
                                    <div style={{ display:'flex', flexDirection: msg.sender_type === 'visitor' ? 'row-reverse' : 'row', gap:7, alignItems:'flex-end' }}>
                                        {msg.sender_type !== 'visitor' && (
                                            <div style={{ width:26, height:26, borderRadius:'50%', background: msg.sender_type === 'agent' ? '#7C3AED' : chatColor, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:12 }}>
                                                {msg.sender_type === 'agent' ? <IconHeadset size={12} color="white"/> : <IconRobot size={12} color="white"/>}
                                            </div>
                                        )}
                                        <div>
                                            <div style={{
                                                maxWidth:'72%', background: msg.sender_type === 'visitor' ? chatColor : '#F3F4F6',
                                                color: msg.sender_type === 'visitor' ? 'white' : '#111',
                                                borderRadius: msg.sender_type === 'visitor' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                                                padding:'8px 12px', fontSize:13, lineHeight:1.5, whiteSpace:'pre-line',
                                            }}>{msg.message}</div>
                                            {msg.options && (() => {
                                                try {
                                                    const opts = JSON.parse(msg.options)
                                                    return opts.length > 0 ? (
                                                        <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginTop:7 }}>
                                                            {opts.map((o: string) => (
                                                                <button key={o} onClick={() => send(o)}
                                                                    style={{ padding:'5px 11px', borderRadius:100, border:`1.5px solid ${chatColor}`, background:'white', color:chatColor, fontSize:11.5, fontWeight:700, cursor:'pointer' }}>
                                                                    {o}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    ) : null
                                                } catch { return null }
                                            })()}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        <div ref={bottomRef} />
                    </div>

                    {/* Rating */}
                    {showRating && (
                        <div style={{ padding:'10px 14px', borderTop:'1px solid #F3F4F6', background:'#FAFAFA', flexShrink:0 }}>
                            <p style={{ fontSize:13, fontWeight:700, color:'#374151', marginBottom:6 }}>Rate this chat:</p>
                            <div style={{ display:'flex', gap:4, marginBottom:6 }}>
                                {[1,2,3,4,5].map(n => (
                                    <button key={n} onClick={() => setRating(n)} style={{ background:'none', border:'none', cursor:'pointer', fontSize:22, opacity: n <= rating ? 1 : 0.25 }}>⭐</button>
                                ))}
                            </div>
                            {rating > 0 && <button onClick={submitRating} style={{ background:chatColor, color:'white', border:'none', borderRadius:8, padding:'5px 14px', fontWeight:700, cursor:'pointer', fontSize:12 }}>Submit</button>}
                        </div>
                    )}

                    {/* Input */}
                    {!showRating && (
                        <div style={{ padding:'9px 10px', borderTop:'1px solid #F3F4F6', display:'flex', gap:7, alignItems:'center', flexShrink:0 }}>
                            <input value={input} onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
                                placeholder={status === 'waiting' ? 'Waiting for agent...' : 'Type a message...'}
                                disabled={status === 'waiting'}
                                style={{ flex:1, height:38, padding:'0 12px', borderRadius:10, border:'1.5px solid #E5E7EB', fontSize:13, outline:'none' }}
                            />
                            <button onClick={() => send()} disabled={!input.trim() || status === 'waiting'}
                                style={{ width:38, height:38, borderRadius:10, background:chatColor, border:'none', display:'flex', alignItems:'center', justifyContent:'center', cursor: input.trim() ? 'pointer' : 'not-allowed', opacity: input.trim() ? 1 : 0.4 }}>
                                <IconSend size={16} color="white"/>
                            </button>
                        </div>
                    )}
                </div>
            )}
        </>
    )
}
