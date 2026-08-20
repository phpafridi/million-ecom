import { Head } from '@inertiajs/react'
import { useState } from 'react'
import { IconMapPin, IconPhone, IconMail, IconBrandWhatsapp, IconSend, IconCheck } from '@tabler/icons-react'
import StorefrontLayout from '@/Layouts/StorefrontLayout'
import type { PageProps } from '@/types'

interface Props extends PageProps { settings: Record<string, string> }

export default function Contact({ settings, auth }: Props) {
    const [sent, setSent] = useState(false)
    const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
    const whatsapp = settings?.whatsapp_number ?? '923001234567'

    function submit(e: React.FormEvent) {
        e.preventDefault()
        setSent(true)
    }

    return (
        <StorefrontLayout auth={auth} settings={settings}>
            <Head title="Contact Us" />

            {/* Hero */}
            <div className="relative h-[180px] sm:h-[220px] lg:h-[260px] overflow-hidden bg-[var(--color-dark-bg2, #070b14)]">
                <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,200,255,0.012)_2px,rgba(0,200,255,0.012)_4px)]" />
                <div className="relative h-full flex items-center px-4 sm:px-6 lg:px-16">
                    <div>
                        <div className="flex items-center gap-2 sm:gap-2.5 mb-2.5 sm:mb-3">
                            <div className="w-6 sm:w-7 h-[2px] bg-[var(--color-primary, #00c8ff)]" style={{ boxShadow: '0 0 8px #00c8ff' }} />
                            <span className="text-[10px] sm:text-[11px] font-bold text-[var(--color-primary, #00c8ff)] uppercase tracking-[.18em]">Get in Touch</span>
                        </div>
                        <h1 className="font-manrope font-black text-white leading-none tracking-tight" style={{ fontSize: 'clamp(28px, 6vw, 48px)' }}>
                            Contact <span className="text-[var(--color-primary, #00c8ff)]">Us</span>
                        </h1>
                    </div>
                </div>
            </div>

            <div className="px-4 sm:px-6 lg:px-16 py-8 sm:py-12 max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">

                    {/* Contact info cards */}
                    <div className="space-y-3 sm:space-y-4 order-2 lg:order-1">
                        {[
                            { icon: IconPhone, title: 'Phone', lines: [settings?.phone ?? '', 'Mon–Sat, 9am–8pm'], color: 'text-[var(--color-primary, #00c8ff)]', bg: 'bg-[rgba(0,200,255,0.06)]', border: 'border-[rgba(0,200,255,0.2)]' },
                            { icon: IconBrandWhatsapp, title: 'WhatsApp', lines: [`+${whatsapp}`, 'Available 24/7'], color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-200' },
                            { icon: IconMail, title: 'Email', lines: [settings?.email ?? 'support@moin.pk', 'Reply within 2 hours'], color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-200' },
                            { icon: IconMapPin, title: 'Address', lines: [settings?.address ?? '17 Princess Road, Karachi', 'Pakistan'], color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200' },
                        ].map(c => (
                            <div key={c.title} className={`bg-white rounded-2xl border p-4 sm:p-5 flex items-start gap-3 sm:gap-4 hover:shadow-md transition-shadow ${c.border}`}>
                                <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-[11px] sm:rounded-[12px] ${c.bg} flex items-center justify-center flex-shrink-0`}>
                                    <c.icon size={20} className={c.color} />
                                </div>
                                <div>
                                    <div className="font-bold text-[13px] sm:text-[14px] text-gray-900 mb-0.5 sm:mb-1">{c.title}</div>
                                    {c.lines.map((l, i) => <div key={i} className={`text-[12px] sm:text-[13px] ${i === 0 ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>{l}</div>)}
                                </div>
                            </div>
                        ))}

                        <a href={`https://wa.me/${whatsapp}?text=Hello, I need help with a product enquiry.`} target="_blank" rel="noopener noreferrer"
                            className="flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1da853] text-white font-bold text-[13px] sm:text-[14px] h-[48px] sm:h-[52px] rounded-[13px] sm:rounded-[14px] transition-all no-underline w-full">
                            <IconBrandWhatsapp size={20} /> Chat on WhatsApp
                        </a>
                    </div>

                    {/* Contact form */}
                    <div className="lg:col-span-2 order-1 lg:order-2">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-8">
                            {sent ? (
                                <div className="text-center py-10 sm:py-12">
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <IconCheck size={28} className="text-green-500" />
                                    </div>
                                    <h3 className="font-manrope font-black text-[19px] sm:text-[22px] text-gray-900 mb-2">Message Sent!</h3>
                                    <p className="text-gray-500 text-[13px] sm:text-[14px]">We'll get back to you within 2 hours. Or WhatsApp us for a faster response.</p>
                                </div>
                            ) : (
                                <>
                                    <h2 className="font-manrope font-bold text-[19px] sm:text-[22px] text-gray-900 mb-5 sm:mb-6">Send us a message</h2>
                                    <form onSubmit={submit} className="space-y-3.5 sm:space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                                            <div>
                                                <label className="block text-[12.5px] sm:text-[13px] font-semibold text-gray-700 mb-1.5">Full Name *</label>
                                                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="Ali Khan"
                                                    className="w-full h-11 px-4 border-2 border-gray-200 rounded-xl text-[13px] sm:text-[13.5px] outline-none focus:border-[var(--color-primary, #00c8ff)] focus:ring-4 focus:ring-[rgba(0,200,255,0.1)] transition-all" />
                                            </div>
                                            <div>
                                                <label className="block text-[12.5px] sm:text-[13px] font-semibold text-gray-700 mb-1.5">Email Address *</label>
                                                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required placeholder="ali@example.com"
                                                    className="w-full h-11 px-4 border-2 border-gray-200 rounded-xl text-[13px] sm:text-[13.5px] outline-none focus:border-[var(--color-primary, #00c8ff)] focus:ring-4 focus:ring-[rgba(0,200,255,0.1)] transition-all" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                                            <div>
                                                <label className="block text-[12.5px] sm:text-[13px] font-semibold text-gray-700 mb-1.5">Phone Number</label>
                                                <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="0300 1234567"
                                                    className="w-full h-11 px-4 border-2 border-gray-200 rounded-xl text-[13px] sm:text-[13.5px] outline-none focus:border-[var(--color-primary, #00c8ff)] focus:ring-4 focus:ring-[rgba(0,200,255,0.1)] transition-all" />
                                            </div>
                                            <div>
                                                <label className="block text-[12.5px] sm:text-[13px] font-semibold text-gray-700 mb-1.5">Subject</label>
                                                <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                                                    className="w-full h-11 px-4 border-2 border-gray-200 rounded-xl text-[13px] sm:text-[13.5px] outline-none focus:border-[var(--color-primary, #00c8ff)] transition-all bg-white">
                                                    <option value="">Select subject…</option>
                                                    <option>Product Enquiry</option>
                                                    <option>Order Status</option>
                                                    <option>Return / Exchange</option>
                                                    <option>Technical Support</option>
                                                    <option>Other</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[12.5px] sm:text-[13px] font-semibold text-gray-700 mb-1.5">Message *</label>
                                            <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required rows={5}
                                                placeholder="Tell us how we can help…"
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-[13px] sm:text-[13.5px] outline-none focus:border-[var(--color-primary, #00c8ff)] focus:ring-4 focus:ring-[rgba(0,200,255,0.1)] resize-none transition-all" />
                                        </div>
                                        <button type="submit"
                                            className="flex items-center justify-center gap-2 bg-[var(--color-primary, #00c8ff)] hover:bg-[var(--color-primary-dark, #00b0e0)] text-[var(--color-dark-bg, #0a0e1a)] font-black text-[13px] sm:text-[14px] h-[48px] sm:h-[52px] w-full rounded-[12px] sm:rounded-[13px] transition-all border-none cursor-pointer">
                                            <IconSend size={17} /> Send Message
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </StorefrontLayout>
    )
}
