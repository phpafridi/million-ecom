import { Head, useForm, usePage, router } from '@inertiajs/react'
import { useState } from 'react'
import { IconMail, IconSend, IconUsers, IconBell, IconCheck, IconPlus, IconTrash, IconUpload, IconX } from '@tabler/icons-react'
import AdminLayout from '@/Layouts/AdminLayout'

interface Subscriber { id: number; email: string; name: string | null; source: string; subscribed_at: string }
interface Props {
    subscribers: Subscriber[]
    subscriberCount: number
    orderedCount: number
    registeredCount: number
    totalCount: number
}

const inputCls = 'w-full h-11 px-4 border-2 border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)] bg-white transition-colors'
const textareaCls = 'w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)] bg-white resize-none transition-colors'

const TEMPLATES = [
    { label:'Sale',         subject:'🔥 Big Sale — Up to 50% Off!',       body:'Hi {name},\n\nGreat news! We\'re running a huge sale.\n\n🏷️ Up to 50% off selected items\n🚚 Free delivery on orders over Rs 5,000\n⏰ Limited time only!\n\nShop now: {store_url}\n\n{store_name} Team' },
    { label:'New Arrivals', subject:'✨ New Products Just Arrived!',        body:'Hi {name},\n\nWe\'ve just added exciting new products you\'ll love!\n\n🆕 Fresh arrivals across all categories\n⭐ Handpicked by our team\n\nShop now before they sell out: {store_url}\n\n{store_name} Team' },
    { label:'Follow-up',    subject:'How was your experience? 😊',         body:'Hi {name},\n\nWe hope you\'re enjoying your recent purchase!\n\nWe\'d love to hear your feedback. A quick review helps other shoppers and means a lot to us.\n\nLeave a review: {store_url}\n\nThank you!\n{store_name} Team' },
    { label:'Custom',       subject:'',                                      body:'' },
]

export default function EmailCampaigns({ subscribers, subscriberCount, orderedCount, registeredCount, totalCount }: Props) {
    const { props } = usePage<{ adminPath?: string; flash?: any }>()
    const ap = `/${props.adminPath ?? 'ml-admin'}`
    const [tab, setTab] = useState<'compose'|'subscribers'>('compose')
    const [tpl, setTpl] = useState(0)
    const [showImport, setShowImport] = useState(false)

    // Compose form
    const { data, setData, post, processing } = useForm({
        subject:    TEMPLATES[0].subject,
        body:       TEMPLATES[0].body,
        audiences:  ['subscribers'] as string[],
        test_email: '',
    })

    // Add subscriber form
    const addForm = useForm({ email:'', name:'' })
    const importForm = useForm({ emails:'' })

    function applyTemplate(i: number) {
        setTpl(i)
        setData('subject', TEMPLATES[i].subject)
        setData('body', TEMPLATES[i].body)
    }

    function toggleAudience(val: string) {
        setData('audiences', data.audiences.includes(val)
            ? data.audiences.filter(a => a !== val)
            : [...data.audiences, val])
    }

    const totalSelected =
        (data.audiences.includes('subscribers') ? subscriberCount : 0) +
        (data.audiences.includes('ordered')     ? orderedCount     : 0) +
        (data.audiences.includes('registered')  ? registeredCount  : 0)

    function sendTest(e: React.FormEvent) {
        e.preventDefault(); post(`${ap}/email-campaigns/test`) }
    function sendCampaign(e: React.FormEvent) {
        e.preventDefault()
        if (!confirm(`Send to ${totalSelected} recipients?`)) return
        post(`${ap}/email-campaigns/send`)
    }
    function addSub(e: React.FormEvent) {
        e.preventDefault()
        addForm.post(`${ap}/email-campaigns/subscribers`, { onSuccess: () => addForm.reset() })
    }
    function importSubs(e: React.FormEvent) {
        e.preventDefault()
        importForm.post(`${ap}/email-campaigns/subscribers/import`, { onSuccess: () => { importForm.reset(); setShowImport(false) }})
    }
    function removeSub(id: number) {
        if (!confirm('Remove this subscriber?')) return
        router.delete(`${ap}/email-campaigns/subscribers/${id}`, { preserveScroll: true })
    }

    return (
        <AdminLayout title="Email Campaigns">
            <Head title="Email Campaigns"/>

            {props.flash?.success && (
                <div className="mb-5 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                    <IconCheck size={18} className="text-green-600 flex-shrink-0"/>
                    <span className="text-[13.5px] font-semibold text-green-800">{props.flash.success}</span>
                </div>
            )}
            {props.flash?.error && (
                <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-[13.5px] font-semibold text-red-700">
                    ⚠ {props.flash.error}
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                {[
                    { label:'Total Reach',        count: totalCount,       color:'var(--color-primary)' },
                    { label:'Subscribers',         count: subscriberCount,  color:'#8b5cf6' },
                    { label:'Past Customers',      count: orderedCount,     color:'#10b981' },
                    { label:'Registered Accounts', count: registeredCount,  color:'#f59e0b' },
                ].map(s => (
                    <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4">
                        <div className="font-manrope font-black text-[22px]" style={{ color: s.color }}>{s.count}</div>
                        <div className="text-[11.5px] text-gray-500 font-semibold">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-5 bg-gray-100 p-1 rounded-xl w-fit">
                {[['compose','✉ Compose Campaign'],['subscribers','👥 Manage Subscribers']].map(([t,l]) => (
                    <button key={t} onClick={() => setTab(t as any)}
                        className={`px-4 py-2 rounded-lg text-[13px] font-bold cursor-pointer border-none transition-all ${tab === t ? 'bg-white shadow-sm text-gray-900' : 'bg-transparent text-gray-500 hover:text-gray-700'}`}>
                        {l}
                    </button>
                ))}
            </div>

            {/* COMPOSE TAB */}
            {tab === 'compose' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 max-w-5xl">
                    <div className="lg:col-span-2 space-y-5">
                        {/* Templates */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-6">
                            <h3 className="font-manrope font-bold text-[15px] mb-4">Quick Templates</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {TEMPLATES.map((t, i) => (
                                    <button key={i} type="button" onClick={() => applyTemplate(i)}
                                        className={`p-3 rounded-xl text-left border-2 cursor-pointer transition-all bg-white text-[13px] font-semibold
                                            ${tpl === i ? 'border-[var(--color-primary)] text-[var(--color-primary)]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Compose */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                            <h3 className="font-manrope font-bold text-[15px]">Compose Email</h3>
                            <div>
                                <label className="block text-[13px] font-semibold text-gray-700 mb-1">Subject Line *</label>
                                <input className={inputCls} value={data.subject} onChange={e => setData('subject', e.target.value)} placeholder="Enter subject…"/>
                            </div>
                            <div>
                                <label className="block text-[13px] font-semibold text-gray-700 mb-1">Message *</label>
                                <p className="text-[11.5px] text-gray-400 mb-2">
                                    Placeholders: <code className="bg-gray-100 px-1 rounded">{'{name}'}</code> <code className="bg-gray-100 px-1 rounded">{'{store_name}'}</code> <code className="bg-gray-100 px-1 rounded">{'{store_url}'}</code>
                                </p>
                                <textarea className={textareaCls} rows={10} value={data.body} onChange={e => setData('body', e.target.value)} placeholder="Write your message…"/>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Audience */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-5">
                            <h3 className="font-manrope font-bold text-[14px] mb-4 flex items-center gap-2">
                                <IconUsers size={16} style={{ color:'var(--color-primary)' }}/> Audience
                                <span className="ml-auto text-[12px] font-bold" style={{ color:'var(--color-primary)' }}>{totalSelected} selected</span>
                            </h3>
                            {[
                                { val:'subscribers', label:'Subscribers',       count:subscriberCount,  hint:'Manually added email list' },
                                { val:'ordered',     label:'Past Customers',    count:orderedCount,     hint:'Placed an order' },
                                { val:'registered',  label:'Registered Users',  count:registeredCount,  hint:'Have an account' },
                            ].map(a => (
                                <label key={a.val} className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer mb-2 transition-all
                                    ${data.audiences.includes(a.val) ? 'border-[var(--color-primary)]' : 'border-gray-200 hover:border-gray-300'}`}
                                    style={data.audiences.includes(a.val) ? { background:'var(--color-primary)08' } : {}}>
                                    <input type="checkbox" checked={data.audiences.includes(a.val)}
                                        onChange={() => toggleAudience(a.val)} className="mt-1" style={{ accentColor:'var(--color-primary)' }}/>
                                    <div className="flex-1">
                                        <div className="font-semibold text-[13px] text-gray-900">{a.label}</div>
                                        <div className="text-[11.5px] text-gray-400">{a.hint}</div>
                                        <div className="text-[12px] font-bold mt-0.5" style={{ color:'var(--color-primary)' }}>{a.count} people</div>
                                    </div>
                                </label>
                            ))}
                        </div>

                        {/* Test */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-5">
                            <h3 className="font-manrope font-bold text-[14px] mb-2 flex items-center gap-2">
                                <IconBell size={16} style={{ color:'var(--color-primary)' }}/> Test First
                            </h3>
                            <p className="text-[11.5px] text-gray-400 mb-3">Always send a test before the real campaign.</p>
                            <input className={inputCls} type="email" value={data.test_email}
                                onChange={e => setData('test_email', e.target.value)} placeholder="your@email.com"/>
                            <button onClick={sendTest} disabled={!data.test_email || processing}
                                className="w-full mt-2 h-10 font-bold text-[13px] rounded-xl border-2 border-gray-200 bg-white cursor-pointer disabled:opacity-50 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all">
                                Send Test Email
                            </button>
                        </div>

                        {/* Send */}
                        <button onClick={sendCampaign} disabled={!data.subject || !data.body || totalSelected === 0 || processing}
                            className="w-full h-12 font-black text-[14px] rounded-xl border-none cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
                            style={{ background:'var(--color-primary)', color:'var(--color-primary-text)' }}>
                            <IconSend size={17}/>
                            {processing ? 'Sending…' : `Send to ${totalSelected} People`}
                        </button>

                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[12px] text-amber-800">
                            ⚠️ Configure SMTP in <code>.env</code> before sending. Test first!
                        </div>
                    </div>
                </div>
            )}

            {/* SUBSCRIBERS TAB */}
            {tab === 'subscribers' && (
                <div className="max-w-3xl space-y-5">
                    {/* Add single */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <h3 className="font-manrope font-bold text-[15px] mb-4">Add Subscriber</h3>
                        <form onSubmit={addSub} className="flex gap-3">
                            <input value={addForm.data.name} onChange={e => addForm.setData('name', e.target.value)}
                                placeholder="Name (optional)" className="flex-1 h-11 px-4 border-2 border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)] bg-white"/>
                            <input type="email" required value={addForm.data.email} onChange={e => addForm.setData('email', e.target.value)}
                                placeholder="email@example.com" className="flex-1 h-11 px-4 border-2 border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)] bg-white"/>
                            <button type="submit" disabled={addForm.processing}
                                className="h-11 px-5 rounded-xl font-bold text-[13px] border-none cursor-pointer flex items-center gap-2 disabled:opacity-60"
                                style={{ background:'var(--color-primary)', color:'var(--color-primary-text)' }}>
                                <IconPlus size={16}/> Add
                            </button>
                        </form>
                        {addForm.errors.email && <p className="text-red-500 text-[12px] mt-2">{addForm.errors.email}</p>}
                    </div>

                    {/* Bulk import */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-manrope font-bold text-[15px]">Bulk Import</h3>
                            <button onClick={() => setShowImport(!showImport)}
                                className="text-[12.5px] font-bold border border-gray-200 px-3 py-1.5 rounded-lg bg-white cursor-pointer hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors">
                                {showImport ? 'Hide' : 'Import Emails'}
                            </button>
                        </div>
                        {showImport && (
                            <form onSubmit={importSubs} className="space-y-3">
                                <div>
                                    <p className="text-[12.5px] text-gray-500 mb-2">
                                        Paste emails — one per line, comma separated, or in any of these formats:
                                    </p>
                                    <div className="text-[11.5px] text-gray-400 bg-gray-50 rounded-lg p-3 mb-3 space-y-0.5 font-mono">
                                        <div>ali@email.com</div>
                                        <div>sara@email.com, Sara Khan</div>
                                        <div>Ahmed Ali &lt;ahmed@email.com&gt;</div>
                                    </div>
                                    <textarea value={importForm.data.emails} onChange={e => importForm.setData('emails', e.target.value)}
                                        rows={8} placeholder="Paste emails here…" className={textareaCls}/>
                                </div>
                                <button type="submit" disabled={!importForm.data.emails || importForm.processing}
                                    className="flex items-center gap-2 h-10 px-5 rounded-xl font-bold text-[13px] border-none cursor-pointer disabled:opacity-50"
                                    style={{ background:'var(--color-primary)', color:'var(--color-primary-text)' }}>
                                    <IconUpload size={15}/> {importForm.processing ? 'Importing…' : 'Import'}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Subscriber list */}
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-manrope font-bold text-[15px]">Subscribers ({subscriberCount})</h3>
                        </div>
                        {subscribers.length === 0 ? (
                            <div className="px-5 py-12 text-center text-gray-400">
                                <IconUsers size={36} className="mx-auto mb-3 text-gray-200"/>
                                <p className="text-[13px]">No subscribers yet. Add emails above.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {subscribers.map(s => (
                                    <div key={s.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/50">
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-[13px] flex-shrink-0"
                                            style={{ background:'var(--color-primary)' }}>
                                            {(s.name ?? s.email)[0].toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            {s.name && <div className="text-[13px] font-semibold text-gray-900">{s.name}</div>}
                                            <div className="text-[12.5px] text-gray-500">{s.email}</div>
                                        </div>
                                        <span className="text-[10.5px] font-bold text-gray-400 uppercase tracking-wider">{s.source}</span>
                                        <button onClick={() => removeSub(s.id)}
                                            className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-red-400 hover:bg-red-50 hover:border-red-300 bg-white cursor-pointer transition-all">
                                            <IconTrash size={13}/>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </AdminLayout>
    )
}
