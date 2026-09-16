import { Head } from '@inertiajs/react'
import { useState } from 'react'
import { IconPhone, IconMail, IconBrandWhatsapp, IconSend, IconCheck, IconMapPin, IconClock, IconMessageCircle } from '@tabler/icons-react'
import StorefrontLayout from '@/Layouts/StorefrontLayout'
import { router } from '@inertiajs/react'

interface Props { settings: Record<string, string>; content?: Record<string, string>; auth?: any }

export default function Contact({ settings, content = {}, auth }: Props) {
    const [sent, setSent]   = useState(false)
    const [loading, setLoading] = useState(false)
    const [form, setForm]   = useState({ name: '', email: '', phone: '', subject: '', message: '' })
    const wa      = settings?.whatsapp_number ?? ''
    const phone   = settings?.phone ?? ''
    const email   = settings?.email ?? ''
    const address = settings?.address ?? 'Pakistan'
    const siteName = settings?.site_name ?? 'MILLIONAIRE'
    const c = content

    function submit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        router.post('/support', { ...form, name: form.name, email: form.email, subject: form.subject, message: form.message }, {
            onSuccess: () => { setSent(true); setLoading(false) },
            onError:   () => { setLoading(false) },
            preserveScroll: true,
        })
    }

    const contacts = [
        { icon: <IconPhone size={22}/>, label: 'Phone', value: phone || '+92 300 0000000', href: `tel:${phone}`, color: '#3B82F6' },
        { icon: <IconBrandWhatsapp size={22}/>, label: 'WhatsApp', value: wa ? `+${wa}` : 'Available 24/7', href: wa ? `https://wa.me/${wa}` : '#', color: '#25D366' },
        { icon: <IconMail size={22}/>, label: 'Email', value: email || `support@millionaire.pk`, href: `mailto:${email}`, color: '#8B5CF6' },
        { icon: <IconMapPin size={22}/>, label: 'Location', value: address, href: '#', color: '#EF4444' },
    ]

    const hours: [string, string][] = [
        [c.contact_hours1_day ?? 'Monday – Saturday',    c.contact_hours1_time ?? '10:00 AM – 8:00 PM'],
        [c.contact_hours2_day ?? 'Sunday',                c.contact_hours2_time ?? '12:00 PM – 6:00 PM'],
        [c.contact_hours3_day ?? 'WhatsApp / Live Chat',  c.contact_hours3_time ?? '24 / 7'],
    ]

    return (
        <StorefrontLayout auth={auth} settings={settings}>
            <Head title={`Contact Us — ${siteName}`} />

            {/* ── HERO ── */}
            <div style={{ background: 'var(--color-dark-bg, #0a0a0a)', padding: 'clamp(56px,9vw,100px) clamp(20px,6vw,64px)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(ellipse at 30% 50%, rgba(201,168,76,0.1) 0%, transparent 60%)', pointerEvents: 'none' }} />
                <div style={{ maxWidth: 700, position: 'relative' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: 100, padding: '5px 14px', marginBottom: 20 }}>
                        <IconMessageCircle size={13} color="var(--color-primary)" />
                        <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{c.contact_hero_eyebrow ?? 'Get in Touch'}</span>
                    </div>
                    <h1 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 900, fontSize: 'clamp(28px,5.5vw,52px)', color: 'white', margin: '0 0 14px', lineHeight: 1.05 }}>
                        {c.contact_hero_title1 ?? "We're here to help"}<br /><span style={{ color: 'var(--color-primary)' }}>{c.contact_hero_title2 ?? 'anytime.'}</span>
                    </h1>
                    <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, margin: 0 }}>
                        {c.contact_hero_subtitle ?? 'Questions about your order, products, or anything else? Our team responds within 1 hour during business hours.'}
                    </p>
                </div>
            </div>

            <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(40px,6vw,64px) clamp(20px,5vw,48px)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40 }}>

                    {/* ── CONTACT CARDS + INFO ── */}
                    <div>
                        <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 900, fontSize: 22, color: '#111', margin: '0 0 20px' }}>Contact Information</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
                            {contacts.map(cn => (
                                <a key={cn.label} href={cn.href} target={cn.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                                    style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#F9FAFB', borderRadius: 16, padding: '16px 18px', textDecoration: 'none', border: '1px solid #F3F4F6', transition: 'border-color 0.2s' }}>
                                    <div style={{ width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: cn.color + '15', color: cn.color }}>
                                        {cn.icon}
                                    </div>
                                    <div>
                                        <p style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 2px' }}>{cn.label}</p>
                                        <p style={{ fontSize: 14, fontWeight: 700, color: '#111', margin: 0 }}>{cn.value}</p>
                                    </div>
                                </a>
                            ))}
                        </div>

                        {/* Hours */}
                        <div style={{ background: 'var(--color-dark-bg, #0a0a0a)', borderRadius: 20, padding: '24px 22px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                                <IconClock size={18} color="var(--color-primary)" />
                                <p style={{ fontWeight: 800, fontSize: 14, color: 'white', margin: 0 }}>Business Hours</p>
                            </div>
                            {hours.map(([d, t]) => (
                                <div key={d} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{d}</span>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-primary)' }}>{t}</span>
                                </div>
                            ))}
                        </div>

                        {/* WhatsApp CTA */}
                        {wa && (
                            <a href={`https://wa.me/${wa}?text=Hi! I need help with my order.`} target="_blank" rel="noopener noreferrer"
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: '#25D366', color: 'white', fontWeight: 800, fontSize: 15, padding: '16px', borderRadius: 16, textDecoration: 'none', marginTop: 16 }}>
                                <IconBrandWhatsapp size={22} /> Chat on WhatsApp
                            </a>
                        )}
                    </div>

                    {/* ── CONTACT FORM ── */}
                    <div>
                        <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 900, fontSize: 22, color: '#111', margin: '0 0 20px' }}>Send a Message</h2>
                        {sent ? (
                            <div style={{ background: '#F0FDF4', border: '2px solid #86EFAC', borderRadius: 20, padding: '40px 32px', textAlign: 'center' }}>
                                <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                                    <IconCheck size={30} color="white" />
                                </div>
                                <h3 style={{ fontWeight: 800, fontSize: 20, color: '#065F46', margin: '0 0 8px' }}>Message Sent!</h3>
                                <p style={{ fontSize: 14, color: '#059669', margin: '0 0 20px', lineHeight: 1.6 }}>Thank you for reaching out. Our team will respond within 1 hour.</p>
                                <button onClick={() => { setSent(false); setForm({ name:'',email:'',phone:'',subject:'',message:'' }) }}
                                    style={{ background: '#10B981', color: 'white', border: 'none', borderRadius: 12, padding: '10px 24px', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                {[
                                    { key: 'name',    label: 'Your Name *',    placeholder: 'e.g. Ahmed Khan',          type: 'text'  },
                                    { key: 'email',   label: 'Email Address *', placeholder: 'ahmed@example.com',         type: 'email' },
                                    { key: 'phone',   label: 'Phone Number',   placeholder: '+92 300 0000000',           type: 'tel'   },
                                    { key: 'subject', label: 'Subject *',      placeholder: 'How can we help you?',      type: 'text'  },
                                ].map(f => (
                                    <div key={f.key}>
                                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{f.label}</label>
                                        <input type={f.type} required={f.label.includes('*')} placeholder={f.placeholder}
                                            value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                                            style={{ width: '100%', height: 46, padding: '0 16px', border: '2px solid #E5E7EB', borderRadius: 12, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
                                    </div>
                                ))}
                                <div>
                                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Message *</label>
                                    <textarea required rows={5} placeholder="Tell us more about your question or issue..."
                                        value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                                        style={{ width: '100%', padding: '12px 16px', border: '2px solid #E5E7EB', borderRadius: 12, fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }} />
                                </div>
                                <button type="submit" disabled={loading}
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'var(--color-dark-bg, #0a0a0a)', color: 'white', border: 'none', borderRadius: 14, padding: '15px 24px', fontWeight: 800, fontSize: 14, cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.7 : 1 }}>
                                    <IconSend size={17} /> {loading ? 'Sending...' : 'Send Message'}
                                </button>
                                <p style={{ fontSize: 12, color: '#9CA3AF', textAlign: 'center', margin: 0 }}>{c.contact_response_note ?? 'We respond within 1 hour · Mon–Sat 10AM–8PM'}</p>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </StorefrontLayout>
    )
}
