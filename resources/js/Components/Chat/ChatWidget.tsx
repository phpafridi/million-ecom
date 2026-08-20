import { useState, useEffect, useRef, useCallback } from 'react'
import { IconMessageCircle, IconX, IconSend, IconUser, IconRobot, IconHeadset, IconStar, IconCheck } from '@tabler/icons-react'

interface Message {
    id: number
    sender_type: 'visitor' | 'bot' | 'agent' | 'system'
    message: string
    message_type: string
    options?: string[]
    created_at: string
}

interface Props {
    settings: Record<string, string>
    auth?: { user?: { name: string; email: string } }
}

export default function ChatWidget({ settings, auth }: Props) {
    const [open, setOpen]           = useState(false)
    const [messages, setMessages]   = useState<Message[]>([])
    const [input, setInput]         = useState('')
    const [sessionId, setSessionId] = useState<string | null>(null)
    const [status, setStatus]       = useState('bot')
    const [loading, setLoading]     = useState(false)
    const [lastId, setLastId]       = useState(0)
    const [agentName, setAgentName] = useState<string | null>(null)
    const [showRating, setShowRating] = useState(false)
    const [rating, setRating]       = useState(0)
    const [unread, setUnread]       = useState(0)
    const bottomRef                 = useRef<HTMLDivElement>(null)
    const pollRef                   = useRef<ReturnType<typeof setInterval>>()

    // Start chat session
    async function startChat() {
        setLoading(true)
        try {
            const res  = await fetch('/chat/start', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': (document.querySelector('meta[name=csrf-token]') as HTMLInputElement)?.content || '' } })
            const data = await res.json()
            setSessionId(data.session_id)
            setMessages(data.messages || [])
            setStatus(data.status)
            if (data.messages?.length) setLastId(data.messages[data.messages.length - 1].id)
        } catch (e) {}
        setLoading(false)
    }

    // Poll for new messages
    const poll = useCallback(async () => {
        if (!sessionId) return
        try {
            const res  = await fetch(`/chat/poll?session_id=${sessionId}&since=${lastId}`)
            const data = await res.json()
            if (data.messages?.length) {
                setMessages(m => [...m, ...data.messages])
                setLastId(data.messages[data.messages.length - 1].id)
                if (!open) setUnread(u => u + data.messages.filter((m: Message) => m.sender_type !== 'visitor').length)
            }
            if (data.status) setStatus(data.status)
            if (data.agent)  setAgentName(data.agent)
            if (data.status === 'closed' && !showRating) setShowRating(true)
        } catch (e) {}
    }, [sessionId, lastId, open, showRating])

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

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    async function send(text?: string) {
        const msg = text ?? input.trim()
        if (!msg || !sessionId) return
        setInput('')
        setMessages(m => [...m, { id: Date.now(), sender_type: 'visitor', message: msg, message_type: 'text', created_at: new Date().toISOString() }])

        try {
            await fetch('/chat/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': (document.querySelector('meta[name=csrf-token]') as HTMLInputElement)?.content || '' },
                body: JSON.stringify({ message: msg, session_id: sessionId }),
            })
        } catch (e) {}
    }

    async function requestAgent() {
        if (!sessionId) return
        await fetch('/chat/request-agent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': (document.querySelector('meta[name=csrf-token]') as HTMLInputElement)?.content || '' },
            body: JSON.stringify({ session_id: sessionId }),
        })
        setStatus('waiting')
    }

    async function submitRating() {
        if (!sessionId || !rating) return
        await fetch('/chat/rate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': (document.querySelector('meta[name=csrf-token]') as HTMLInputElement)?.content || '' },
            body: JSON.stringify({ session_id: sessionId, rating }),
        })
        setShowRating(false)
    }

    const wa = settings?.whatsapp_number

    return (
        <>
            {/* ── Toggle button ── */}
            <button
                onClick={() => setOpen(o => !o)}
                style={{
                    position: 'fixed', bottom: 24, right: 24, zIndex: 9990,
                    width: 58, height: 58, borderRadius: '50%',
                    background: open ? '#374151' : 'var(--color-dark-bg, #0a0a0a)',
                    border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
                    transition: 'all 0.3s',
                }}>
                {open ? <IconX size={24} color="white" /> : <IconMessageCircle size={26} color="white" />}
                {!open && unread > 0 && (
                    <span style={{ position: 'absolute', top: -2, right: -2, background: '#EF4444', color: 'white', borderRadius: '50%', width: 20, height: 20, fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {unread}
                    </span>
                )}
            </button>

            {/* ── Chat window ── */}
            {open && (
                <div style={{
                    position: 'fixed', bottom: 92, right: 24, zIndex: 9991,
                    width: 'clamp(320px, 90vw, 390px)',
                    height: 'clamp(460px, 70vh, 580px)',
                    background: 'white', borderRadius: 20,
                    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                    display: 'flex', flexDirection: 'column', overflow: 'hidden',
                    border: '1px solid rgba(0,0,0,0.08)',
                }}>
                    {/* Header */}
                    <div style={{ background: 'var(--color-dark-bg, #0a0a0a)', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {status === 'active' ? <IconHeadset size={18} color="white" /> : <IconRobot size={18} color="white" />}
                        </div>
                        <div style={{ flex: 1 }}>
                            <p style={{ color: 'white', fontWeight: 800, fontSize: 14, margin: 0 }}>
                                {status === 'active' ? (agentName ?? 'Support Agent') : status === 'waiting' ? 'Connecting...' : `${settings?.site_name ?? 'MILLIONAIRE'} Support`}
                            </p>
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, margin: 0 }}>
                                {status === 'active' ? '🟢 Agent connected' : status === 'waiting' ? '⏳ Waiting for agent...' : '🤖 AI Assistant · Usually replies instantly'}
                            </p>
                        </div>
                        {wa && (
                            <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" style={{ color: '#25D366', textDecoration: 'none', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                                WhatsApp
                            </a>
                        )}
                    </div>

                    {/* Messages */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '14px 14px 6px' }}>
                        {loading && (
                            <div style={{ textAlign: 'center', padding: '20px', color: '#9CA3AF', fontSize: 13 }}>Starting chat...</div>
                        )}
                        {messages.map((msg, i) => (
                            <div key={msg.id || i} style={{ marginBottom: 12 }}>
                                {msg.sender_type === 'system' ? (
                                    <div style={{ textAlign: 'center', fontSize: 11, color: '#9CA3AF', background: '#F9FAFB', borderRadius: 8, padding: '6px 12px', margin: '8px 0' }}>
                                        {msg.message}
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: msg.sender_type === 'visitor' ? 'row-reverse' : 'row', gap: 8, alignItems: 'flex-end' }}>
                                        {msg.sender_type !== 'visitor' && (
                                            <div style={{ width: 28, height: 28, borderRadius: '50%', background: msg.sender_type === 'agent' ? '#7C3AED' : 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                {msg.sender_type === 'agent' ? <IconHeadset size={13} color="white" /> : <IconRobot size={13} color="white" />}
                                            </div>
                                        )}
                                        <div style={{ maxWidth: '75%' }}>
                                            <div style={{
                                                background: msg.sender_type === 'visitor' ? 'var(--color-dark-bg, #0a0a0a)' : '#F3F4F6',
                                                color: msg.sender_type === 'visitor' ? 'white' : '#111',
                                                borderRadius: msg.sender_type === 'visitor' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                                padding: '9px 13px', fontSize: 13, lineHeight: 1.55,
                                                whiteSpace: 'pre-line',
                                            }}>
                                                {msg.message}
                                            </div>
                                            {/* Quick reply options */}
                                            {msg.options && JSON.parse(msg.options as any || '[]').length > 0 && (
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                                                    {JSON.parse(msg.options as any || '[]').map((opt: string) => (
                                                        <button key={opt} onClick={() => send(opt)}
                                                            style={{ padding: '6px 12px', borderRadius: 100, border: '1.5px solid var(--color-primary)', background: 'white', color: 'var(--color-primary)', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                                                            {opt}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        <div ref={bottomRef} />
                    </div>

                    {/* Rating */}
                    {showRating && (
                        <div style={{ padding: '12px 16px', borderTop: '1px solid #F3F4F6', background: '#FAFAFA' }}>
                            <p style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8 }}>Rate this conversation:</p>
                            <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                                {[1,2,3,4,5].map(n => (
                                    <button key={n} onClick={() => setRating(n)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, opacity: n <= rating ? 1 : 0.3 }}>⭐</button>
                                ))}
                            </div>
                            {rating > 0 && (
                                <button onClick={submitRating} style={{ background: 'var(--color-primary)', color: 'var(--color-primary-text)', border: 'none', borderRadius: 8, padding: '6px 16px', fontWeight: 700, cursor: 'pointer', fontSize: 12 }}>
                                    Submit Rating
                                </button>
                            )}
                        </div>
                    )}

                    {/* Input */}
                    {status !== 'closed' && !showRating && (
                        <div style={{ padding: '10px 12px', borderTop: '1px solid #F3F4F6', display: 'flex', gap: 8, alignItems: 'center' }}>
                            <input
                                value={input} onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
                                placeholder={status === 'waiting' ? 'Waiting for agent...' : 'Type your message...'}
                                disabled={status === 'waiting'}
                                style={{ flex: 1, height: 40, padding: '0 14px', borderRadius: 12, border: '1.5px solid #E5E7EB', fontSize: 13.5, outline: 'none', background: status === 'waiting' ? '#F9FAFB' : 'white' }}
                            />
                            <button onClick={() => send()}
                                disabled={!input.trim() || status === 'waiting'}
                                style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--color-dark-bg, #0a0a0a)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() ? 'pointer' : 'not-allowed', opacity: input.trim() ? 1 : 0.4 }}>
                                <IconSend size={17} color="white" />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </>
    )
}
