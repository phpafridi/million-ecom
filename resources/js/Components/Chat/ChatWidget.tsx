import { useState, useEffect, useRef } from 'react'
import { useEchoPublic } from '@laravel/echo-react'
import { IconX, IconSend, IconRobot, IconHeadset } from '@tabler/icons-react'
import { getFloatOffset } from '@/utils/floatingButtons'

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
    // The numeric database ID — separate from sessionId (the UUID string
    // used for the HTTP-based /chat/* endpoints). ChatMessageSent actually
    // broadcasts on chat.{numeric id}, matching what the admin panel
    // listens on — subscribing on the UUID instead (as this used to do)
    // meant listening on a channel nothing was ever broadcasting to.
    const [numericId, setNumericId]   = useState<number | null>(null)
    // Mirrors numericId (and open, below) via a ref — the useEchoPublic
    // callback was capturing a stale closure of numericId from an early
    // render (before /chat/start resolved), permanently reading it as null
    // even after the state genuinely updated and the subscription itself
    // correctly moved to the right channel. Refs don't have this problem:
    // .current is mutated in place, so the callback always sees the latest
    // value instead of whatever was in scope when it was first created.
    const numericIdRef = useRef<number | null>(null)
    const openRef       = useRef(false)
    const [status, setStatus]         = useState('bot')
    const [lastId, setLastId]         = useState(0)
    const [agentName, setAgentName]   = useState<string | null>(null)
    const [unread, setUnread]         = useState(0)
    const [showRating, setShowRating] = useState(false)
    const [rating, setRating]         = useState(0)
    const bottomRef                   = useRef<HTMLDivElement>(null)

    const chatColor = settings?.chat_bubble_color || 'var(--color-dark-bg, #0a0a0a)'
    const chatIcon  = settings?.chat_bubble_icon  || '💬'
    const siteName  = settings?.site_name         || 'MILLIONAIRE'
    // Own enable/position/size, auto-stacking with WhatsApp/Cart instead of
    // the old hardcoded bottom:24px/right:24px that put it directly under
    // the WhatsApp button with no coordination between the two.
    const floatCfg = getFloatOffset(settings, 'chat', { chat: true, cart: true, whatsapp: false })

    const csrf = () => (document.querySelector('meta[name=csrf-token]') as HTMLInputElement)?.content || ''

    async function startChat() {
        try {
            const r = await fetch('/chat/start', { method:'POST', headers:{ 'Content-Type':'application/json', 'X-CSRF-TOKEN':csrf() } })
            const d = await r.json()
            setSessionId(d.session_id)
            setNumericId(d.id ?? null)
            setMessages(d.messages || [])
            setStatus(d.status)
            if (d.messages?.length) setLastId(d.messages[d.messages.length - 1].id)
        } catch {}
    }

    useEffect(() => {
        if (open && !sessionId) startChat()
        if (open) setUnread(0)
    }, [open])

    // Real-time via Reverb/Echo. This project uses @laravel/echo-react,
    // which is a hooks-based package (useEchoPublic) — NOT the traditional
    // global `window.Echo` singleton this code was previously written
    // against, which is why it silently fell back to polling regardless of
    // Reverb's actual state before this fix.
    //
    // No backup polling interval anymore — this is pure real-time via the
    // hook. If Reverb genuinely isn't running, chat won't receive live
    // updates until the page is reloaded (which re-subscribes). That
    // trade-off is intentional now: no unnecessary background requests at
    // all once Reverb is confirmed working.
    useEffect(() => { numericIdRef.current = numericId }, [numericId])
    useEffect(() => { openRef.current = open }, [open])

    useEchoPublic(numericId ? `chat.${numericId}` : 'chat.__none__', '.message.sent', (e: any) => {
        // Confirmed via testing: this callback receives the correct event
        // every time, but was reading numericId from a stale closure
        // (always null) even after the real value updated — using the ref
        // instead fixes it, since refs read the current value rather than
        // whatever was captured when this closure was first created.
        if (!numericIdRef.current) return
        if (e.senderType !== 'visitor') {
            setMessages(m => [...m, {
                id: Date.now(),
                message: e.message,
                sender_type: e.senderType,
                message_type: 'text',
                created_at: e.createdAt,
            }])
            if (!openRef.current) setUnread(u => u + 1)
        }
        if (e.status) setStatus(e.status)
        if (e.agentName) setAgentName(e.agentName)
        if (e.status === 'closed') setShowRating(true)
    })

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

    if (!floatCfg.enabled) return null

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
                        /* Sits low, near the Login icon — the cart FAB (when
                           present) is a same-size icon stacked directly above
                           it, so there's no wide bar to avoid anymore. */
                        bottom: calc(56px + env(safe-area-inset-bottom, 0px) + 10px) !important;
                        right: 16px !important;
                        width: 46px !important;
                        height: 46px !important;
                    }
                    .ml-chat-win {
                        /* full-width sheet on mobile */
                        bottom: calc(56px + env(safe-area-inset-bottom, 0px) + 66px) !important;
                        right: 8px !important;
                        left: 8px !important;
                        width: auto !important;
                        height: clamp(360px, 60vh, 520px);
                        border-radius: 16px;
                    }
                }
            `}</style>

            {/* Toggle Button */}
            <button
                className="ml-chat-btn"
                onClick={() => setOpen(o => !o)}
                style={{
                    background: open ? '#374151' : chatColor, fontSize: open ? 20 : 22,
                    bottom: floatCfg.bottom, width: floatCfg.diameter, height: floatCfg.diameter,
                    ...(floatCfg.corner === 'left' ? { left: floatCfg.side, right: 'auto' } : { right: floatCfg.side, left: 'auto' }),
                }}
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
                <div className="ml-chat-win" style={{
                    bottom: floatCfg.bottom + floatCfg.diameter + 12,
                    ...(floatCfg.corner === 'left' ? { left: floatCfg.side, right: 'auto' } : { right: floatCfg.side, left: 'auto' }),
                }}>
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
