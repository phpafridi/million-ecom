import { Head, useForm, Link, usePage } from '@inertiajs/react'
import StorefrontLayout from '@/Layouts/StorefrontLayout'
import { IconSend, IconTicket, IconPhone, IconBrandWhatsapp, IconMail, IconCheck } from '@tabler/icons-react'

interface Props {
    settings: Record<string, string>
    orders: Array<{ id: number; status: string; created_at: string }>
    auth: any
}

export default function Support({ settings, orders, auth }: Props) {
    const { props } = usePage<any>()
    const flash = props.flash

    const { data, setData, post, processing, errors, reset } = useForm({
        name: auth?.user?.name ?? '',
        email: auth?.user?.email ?? '',
        phone: '',
        order_id: '',
        subject: '',
        message: '',
        priority: 'normal',
    })

    function submit(e: React.FormEvent) {
        e.preventDefault()
        post('/support', { onSuccess: () => reset('subject', 'message', 'phone') })
    }

    const wa  = settings.whatsapp_number ?? ''
    const ph  = settings.phone ?? ''

    return (
        <StorefrontLayout auth={auth} settings={settings}>
            <Head title="Support — MILLIONAIRE" />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="font-black text-[32px] sm:text-[40px]"
                        style={{ fontFamily: 'Manrope,sans-serif', color: 'var(--color-body-text)' }}>
                        How Can We Help?
                    </h1>
                    <p className="text-gray-500 text-[16px] mt-2">We reply within 24 hours — usually much faster</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Contact options */}
                    <div className="space-y-4">
                        {wa && (
                            <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-all no-underline group">
                                <div className="w-12 h-12 rounded-2xl bg-[#25D366] flex items-center justify-center flex-shrink-0">
                                    <IconBrandWhatsapp size={22} color="white" />
                                </div>
                                <div>
                                    <p className="font-black text-[14px] text-gray-800">WhatsApp</p>
                                    <p className="text-[12.5px] text-gray-400">Quick response · Usually instant</p>
                                </div>
                            </a>
                        )}
                        {ph && (
                            <a href={`tel:${ph}`}
                                className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-all no-underline">
                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                                    style={{ background: 'var(--color-primary)' }}>
                                    <IconPhone size={22} style={{ color: 'var(--color-primary-text)' }} />
                                </div>
                                <div>
                                    <p className="font-black text-[14px] text-gray-800">{ph}</p>
                                    <p className="text-[12.5px] text-gray-400">Call us directly</p>
                                </div>
                            </a>
                        )}
                        {settings.email && (
                            <a href={`mailto:${settings.email}`}
                                className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-all no-underline">
                                <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center flex-shrink-0">
                                    <IconMail size={22} color="white" />
                                </div>
                                <div>
                                    <p className="font-black text-[14px] text-gray-800">{settings.email}</p>
                                    <p className="text-[12.5px] text-gray-400">Email support</p>
                                </div>
                            </a>
                        )}

                        {/* My tickets */}
                        {auth?.user && (
                            <Link href="/support/my-tickets"
                                className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-md transition-all no-underline">
                                <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                                    <IconTicket size={22} className="text-purple-600" />
                                </div>
                                <div>
                                    <p className="font-black text-[14px] text-gray-800">My Tickets</p>
                                    <p className="text-[12.5px] text-gray-400">View your support history</p>
                                </div>
                            </Link>
                        )}

                        {/* FAQ */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-5">
                            <h3 className="font-black text-[14px] text-gray-800 mb-3">Common Questions</h3>
                            {[
                                ['How do I track my order?', '/track-order'],
                                ['What is your return policy?', '/pages/returns'],
                                ['How long does delivery take?', '/pages/shipping'],
                                ['Can I change my order?', '/contact'],
                            ].map(([q, link]) => (
                                <Link key={q} href={link}
                                    className="block text-[12.5px] font-semibold no-underline py-2 border-b border-gray-50 last:border-0"
                                    style={{ color: 'var(--color-primary)' }}>
                                    {q} →
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Ticket form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl border border-gray-100 p-6">
                            <h2 className="font-black text-[18px] text-gray-800 mb-5 flex items-center gap-2">
                                <IconTicket size={20} style={{ color: 'var(--color-primary)' }} />
                                Submit a Support Ticket
                            </h2>

                            {flash?.success && (
                                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-5 flex items-start gap-3">
                                    <IconCheck size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                                    <p className="text-green-700 font-semibold text-[13.5px]">{flash.success}</p>
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">Name *</label>
                                        <input className="w-full h-11 px-4 border border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)]"
                                            value={data.name} onChange={e => setData('name', e.target.value)} required placeholder="Your full name" />
                                    </div>
                                    <div>
                                        <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">Email *</label>
                                        <input type="email" className="w-full h-11 px-4 border border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)]"
                                            value={data.email} onChange={e => setData('email', e.target.value)} required placeholder="your@email.com" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">Phone</label>
                                        <input className="w-full h-11 px-4 border border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)]"
                                            value={data.phone} onChange={e => setData('phone', e.target.value)} placeholder="+92 300 0000000" />
                                    </div>
                                    {orders.length > 0 && (
                                        <div>
                                            <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">Related Order</label>
                                            <select className="w-full h-11 px-4 border border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)] bg-white"
                                                value={data.order_id} onChange={e => setData('order_id', e.target.value)}>
                                                <option value="">None</option>
                                                {orders.map(o => (
                                                    <option key={o.id} value={o.id}>Order #{o.id} — {o.status}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">Subject *</label>
                                    <input className="w-full h-11 px-4 border border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)]"
                                        value={data.subject} onChange={e => setData('subject', e.target.value)} required
                                        placeholder="Brief description of your issue" />
                                </div>

                                <div>
                                    <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">Priority</label>
                                    <div className="flex gap-2">
                                        {[['low','Low','#6B7280'],['normal','Normal','#3B82F6'],['high','High','#F59E0B']].map(([v,l,c]) => (
                                            <button key={v} type="button" onClick={() => setData('priority', v)}
                                                className="flex-1 h-10 rounded-xl text-[12.5px] font-bold border-2 cursor-pointer transition-all"
                                                style={{
                                                    borderColor: data.priority === v ? c : '#E5E7EB',
                                                    background: data.priority === v ? c + '15' : 'white',
                                                    color: data.priority === v ? c : '#9CA3AF',
                                                }}>
                                                {l}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">Message *</label>
                                    <textarea className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)] resize-none"
                                        rows={5} value={data.message} onChange={e => setData('message', e.target.value)} required
                                        placeholder="Describe your issue in detail. Include order numbers, product names, or any relevant information." />
                                </div>

                                <button type="submit" disabled={processing}
                                    className="w-full h-12 rounded-xl font-black text-[14px] border-none cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                                    style={{ background: 'var(--color-dark-bg)', color: 'white' }}>
                                    <IconSend size={17} />
                                    {processing ? 'Sending...' : 'Submit Ticket — We\'ll Reply Within 24hrs'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </StorefrontLayout>
    )
}
