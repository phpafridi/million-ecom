import { useState } from 'react'
import { useForm } from '@inertiajs/react'
import { IconCheck } from '@tabler/icons-react'

interface Props { variant?: 'banner' | 'footer' | 'inline' }

export default function NewsletterSignup({ variant = 'banner' }: Props) {
    const [done, setDone] = useState(false)
    const { data, setData, post, processing } = useForm({ email: '', name: '' })

    function submit(e: React.FormEvent) {
        e.preventDefault()
        post('/newsletter/subscribe', { onSuccess: () => setDone(true) })
    }

    if (done) return (
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, padding:'16px 24px', background:'rgba(255,255,255,0.08)', borderRadius:100, color:'white', fontWeight:700, fontSize:14 }}>
            <IconCheck size={18} color="var(--color-primary)"/> You're subscribed! Thank you.
        </div>
    )

    return (
        <section style={{ background:'var(--color-dark-bg,#0a0a0a)', padding:'clamp(48px,7vw,72px) clamp(20px,5vw,48px)' }}>
            <div style={{ maxWidth:1400, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', gap:32, flexWrap:'wrap' }}>
                <div>
                    <p style={{ fontSize:11, fontWeight:800, color:'var(--color-primary)', textTransform:'uppercase', letterSpacing:'0.15em', margin:'0 0 8px' }}>EXCLUSIVE OFFERS</p>
                    <h2 style={{ fontFamily:'Manrope,sans-serif', fontWeight:900, fontSize:'clamp(24px,3.5vw,36px)', color:'white', margin:'0 0 8px', lineHeight:1.1 }}>Stay in the Loop</h2>
                    <p style={{ fontSize:14, color:'rgba(255,255,255,0.45)', margin:0 }}>New arrivals, exclusive deals & style tips. No spam, ever.</p>
                </div>
                <form onSubmit={submit} style={{ display:'flex', gap:0, borderRadius:100, overflow:'hidden', border:'1.5px solid rgba(255,255,255,0.15)', maxWidth:460, width:'100%', flexShrink:0 }}>
                    <input
                        type="email" required
                        value={data.email}
                        onChange={e => setData('email', e.target.value)}
                        placeholder="Enter your email address"
                        style={{ flex:1, background:'rgba(255,255,255,0.06)', border:'none', padding:'14px 20px', color:'white', fontSize:14, outline:'none', minWidth:0 }}
                    />
                    <button type="submit" disabled={processing}
                        style={{ background:'var(--color-primary)', color:'var(--color-primary-text,#0a0a0a)', border:'none', padding:'14px 24px', fontWeight:800, fontSize:13, cursor:'pointer', whiteSpace:'nowrap', flexShrink:0, opacity: processing ? 0.7 : 1 }}>
                        {processing ? '...' : 'Subscribe →'}
                    </button>
                </form>
            </div>
        </section>
    )
}
