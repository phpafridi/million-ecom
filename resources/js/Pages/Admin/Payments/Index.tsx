import { Head, router, useForm, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { IconChevronDown, IconChevronUp, IconExternalLink, IconAlertTriangle, IconCheck } from '@tabler/icons-react'
import AdminLayout from '@/Layouts/AdminLayout'

interface CredField { key: string; label: string; type?: string; placeholder: string }
interface Gateway {
    id: number; code: string; name: string; region: string
    is_enabled: boolean; is_test_mode: boolean
    logo: string | null; instructions: string | null; sort_order: number
    credentials: Record<string, string> | null
    config: { status?: string; docs?: string; note?: string; credential_fields?: CredField[] } | null
}
interface Props { gateways: Gateway[] }

const REGION_ICONS: Record<string, string> = {
    'Pakistan': '🇵🇰', 'International': '🌍', 'India / International': '🇮🇳',
    'Africa / International': '🌍', 'US / International': '🇺🇸',
    'Middle East / Africa': '🌍', 'Any': '✅',
}

const STATUS_INFO: Record<string, { label: string; color: string }> = {
    'sandbox_available': { label: 'Sandbox + Live', color: 'text-green-600 bg-green-50 border-green-200' },
    'live_only':         { label: 'Live Only',       color: 'text-amber-600 bg-amber-50 border-amber-200' },
    'webhook_required':  { label: 'Webhook Needed',  color: 'text-blue-600  bg-blue-50  border-blue-200'  },
    'always_works':      { label: 'No Setup Needed', color: 'text-green-600 bg-green-50 border-green-200' },
}

function GatewayCard({ gw }: { gw: Gateway }) {
    const { props } = usePage<{ adminPath?: string }>()
    const ap = `/${props.adminPath ?? 'tijar-admin'}`
    const credFields: CredField[] = gw.config?.credential_fields ?? []
    const status     = gw.config?.status ?? 'sandbox_available'
    const statusInfo = STATUS_INFO[status] ?? STATUS_INFO['sandbox_available']
    const docs       = gw.config?.docs ?? ''
    const note       = gw.config?.note ?? ''
    const isAlwaysOn = status === 'always_works'
    const [expanded, setExpanded] = useState(isAlwaysOn) // Bank Transfer & COD start expanded

    const { data, setData, put, processing } = useForm({
        is_enabled:    gw.is_enabled,
        is_test_mode:  gw.is_test_mode,
        instructions:  gw.instructions ?? '',
        credentials:   gw.credentials ?? {} as Record<string, string>,
        sort_order:    gw.sort_order,
    })

    function save(e: React.FormEvent) { e.preventDefault(); put(`${ap}/payments/${gw.id}`) }
    function toggle() { router.patch(`${ap}/payments/${gw.id}/toggle`, {}, { preserveScroll: true }) }
    function setCred(key: string, val: string) { setData('credentials', { ...data.credentials, [key]: val }) }

    return (
        <div className={`bg-white rounded-2xl transition-all border-2 ${gw.is_enabled ? 'border-[var(--color-primary)]/30 shadow-sm' : 'border-gray-100'}`}>
            {/* Header */}
            <div className="flex items-center gap-3 p-4 sm:p-5">
                <div className="w-11 h-11 rounded-[12px] flex items-center justify-center text-xl flex-shrink-0 bg-gray-50 border border-gray-100">
                    {REGION_ICONS[gw.region] ?? '💳'}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-manrope font-bold text-[15px] text-gray-900">{gw.name}</span>
                        <span className="text-[10.5px] font-semibold text-gray-400">{gw.region}</span>
                        {gw.is_test_mode && gw.is_enabled && !['cod','bank_transfer'].includes(gw.code) && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">TEST MODE</span>
                        )}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusInfo.color}`}>{statusInfo.label}</span>
                    </div>
                    {gw.is_enabled && gw.instructions && (
                        <p className="text-[11.5px] text-gray-500 mt-0.5 truncate max-w-xs">{gw.instructions}</p>
                    )}
                </div>
                <div className="flex items-center gap-2.5 flex-shrink-0">
                    <button type="button" onClick={toggle}
                        className={`relative w-12 h-6 rounded-full transition-all border-none cursor-pointer ${gw.is_enabled ? 'bg-[var(--color-primary)]' : 'bg-gray-200'}`}>
                        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${gw.is_enabled ? 'left-[26px]' : 'left-0.5'}`} />
                    </button>
                    <button type="button" onClick={() => setExpanded(!expanded)}
                        className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center text-gray-400 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] bg-white cursor-pointer transition-all"
                        title={expanded ? 'Collapse' : 'Configure'}>
                        {expanded ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />}
                    </button>
                </div>
            </div>

            {/* Expanded config */}
            {expanded && !isAlwaysOn && (
                <form onSubmit={save} className="border-t border-gray-100 p-5 space-y-4">
                    {/* Note about installation */}
                    {note && (
                        <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-xl text-[12.5px] text-blue-800">
                            <IconAlertTriangle size={15} className="flex-shrink-0 mt-0.5 text-blue-500" />
                            <span>{note}</span>
                        </div>
                    )}

                    {/* Test/Live mode */}
                    {status === 'sandbox_available' && (
                        <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl">
                            <div>
                                <div className="text-[13px] font-semibold text-gray-800">
                                    {data.is_test_mode ? '🧪 Test / Sandbox Mode' : '✅ Live / Production Mode'}
                                </div>
                                <div className="text-[11.5px] text-gray-500 mt-0.5">
                                    {data.is_test_mode ? 'Using sandbox — no real money charged' : 'Real payments will be processed'}
                                </div>
                            </div>
                            <button type="button" onClick={() => setData('is_test_mode', !data.is_test_mode)}
                                className={`relative w-11 h-6 rounded-full border-none cursor-pointer transition-all ${data.is_test_mode ? 'bg-amber-400' : 'bg-green-500'}`}>
                                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${data.is_test_mode ? 'left-0.5' : 'left-[22px]'}`} />
                            </button>
                        </div>
                    )}
                    {status === 'live_only' && (
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[12.5px] text-amber-800">
                            ⚠️ <strong>{gw.name}</strong> only provides live credentials — no sandbox available. Test carefully.
                        </div>
                    )}

                    {/* Credential fields */}
                    {credFields.length > 0 && (
                        <div>
                            <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-wider mb-3">API Credentials</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {credFields.map(f => (
                                    <div key={f.key}>
                                        <label className="block text-[12.5px] font-semibold text-gray-700 mb-1">{f.label}</label>
                                        <input type={f.type ?? 'text'} value={data.credentials[f.key] ?? ''}
                                            onChange={e => setCred(f.key, e.target.value)}
                                            placeholder={f.placeholder}
                                            className="w-full h-10 px-3 border-2 border-gray-200 rounded-xl text-[12.5px] font-mono outline-none focus:border-[var(--color-primary)] transition-colors" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Customer instructions */}
                    <div>
                        <label className="block text-[12.5px] font-semibold text-gray-700 mb-1">
                            Customer Instructions <span className="text-gray-400 font-normal">(shown at checkout)</span>
                        </label>
                        <textarea value={data.instructions} onChange={e => setData('instructions', e.target.value)} rows={2}
                            placeholder={`e.g. "Pay using ${gw.name} and include your order number."`}
                            className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-[13px] outline-none focus:border-[var(--color-primary)] resize-none" />
                    </div>

                    <div className="flex items-center gap-3">
                        <button type="submit" disabled={processing}
                            className="flex items-center gap-2 h-10 px-5 font-black text-[12.5px] rounded-xl border-none cursor-pointer disabled:opacity-60 transition-all"
                            style={{ background: 'var(--color-primary)', color: 'var(--color-primary-text)' }}>
                            <IconCheck size={15} /> {processing ? 'Saving…' : 'Save'}
                        </button>
                        {docs && (
                            <a href={docs} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-[12.5px] font-semibold no-underline hover:underline"
                                style={{ color: 'var(--color-primary)' }}>
                                <IconExternalLink size={14} /> API Docs
                            </a>
                        )}
                    </div>
                </form>
            )}

            {/* COD / Bank Transfer — show instruction editor only */}
            {isAlwaysOn && expanded && (
                <form onSubmit={save} className="border-t border-gray-100 p-5">
                    <div className="mb-3">
                        <label className="block text-[12.5px] font-semibold text-gray-700 mb-1">Instructions for Customer <span className="text-gray-400 font-normal">(shown at checkout)</span></label>
                        <textarea value={data.instructions} onChange={e => setData('instructions', e.target.value)} rows={2}
                            placeholder="e.g. Transfer the exact amount to our account below, then WhatsApp us the receipt."
                            className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-[13px] outline-none focus:border-[var(--color-primary)] resize-none" />
                    </div>
                    {/* Bank transfer fields */}
                    {gw.code === 'bank_transfer' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                            {(gw.config?.credential_fields ?? []).map((f: CredField) => (
                                <div key={f.key}>
                                    <label className="block text-[12px] font-semibold text-gray-700 mb-1">{f.label}</label>
                                    <input value={data.credentials[f.key] ?? ''} onChange={e => setCred(f.key, e.target.value)}
                                        placeholder={f.placeholder}
                                        className="w-full h-10 px-3 border-2 border-gray-200 rounded-xl text-[12.5px] outline-none focus:border-[var(--color-primary)]" />
                                </div>
                            ))}
                        </div>
                    )}
                    <button type="submit" disabled={processing}
                        className="flex items-center gap-2 h-10 px-5 font-black text-[12.5px] rounded-xl border-none cursor-pointer"
                        style={{ background: 'var(--color-primary)', color: 'var(--color-primary-text)' }}>
                        <IconCheck size={15} /> {processing ? 'Saving…' : 'Save'}
                    </button>
                </form>
            )}
        </div>
    )
}

export default function PaymentsIndex({ gateways }: Props) {
    const enabled = gateways.filter(g => g.is_enabled).length
    const regions = [...new Set(gateways.map(g => g.region))]

    return (
        <AdminLayout title="Payment Gateways">
            <Head title="Payments — Admin" />

            <div className="mb-5 p-4 rounded-2xl border flex items-start gap-3"
                style={{ background: 'var(--color-primary)08', borderColor: 'var(--color-primary)30' }}>
                <span className="text-xl flex-shrink-0">💡</span>
                <div className="text-[13px] text-gray-700">
                    <strong>All gateways disabled by default.</strong> Enable only the ones you have accounts for.
                    COD and Bank Transfer work immediately without any setup.
                    For online gateways, enter your API credentials then test before going live.
                    <span className="ml-2 font-bold" style={{ color: 'var(--color-primary)' }}>
                        {enabled} of {gateways.length} enabled
                    </span>
                </div>
            </div>

            {/* Show integration status legend */}
            <div className="flex gap-2 flex-wrap mb-5">
                {Object.entries(STATUS_INFO).map(([k, v]) => (
                    <span key={k} className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${v.color}`}>{v.label}</span>
                ))}
            </div>

            {/* Group by region */}
            {regions.map(region => (
                <div key={region} className="mb-7">
                    <h3 className="flex items-center gap-2 font-manrope font-bold text-[14px] text-gray-500 uppercase tracking-wider mb-3">
                        <span>{REGION_ICONS[region] ?? '💳'}</span> {region}
                    </h3>
                    <div className="space-y-3">
                        {gateways.filter(g => g.region === region).map(gw => (
                            <GatewayCard key={gw.id} gw={gw} />
                        ))}
                    </div>
                </div>
            ))}

            {/* Integration status notice */}
            <div className="mt-6 p-5 bg-gray-50 border border-gray-200 rounded-2xl">
                <h4 className="font-bold text-[14px] text-gray-700 mb-3">📋 Integration Status</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12.5px] text-gray-600">
                    <div>
                        <strong className="text-green-600">✅ Fully Working (no code needed):</strong>
                        <p className="mt-1">Cash on Delivery, Bank Transfer</p>
                    </div>
                    <div>
                        <strong className="text-blue-600">🔧 Ready for your API keys:</strong>
                        <p className="mt-1">Stripe, PayPal, JazzCash, Easypaisa, Safepay, Razorpay, Paystack, Flutterwave, Square, Paymob, 2Checkout, PayFast PK, NayaPay</p>
                    </div>
                    <div className="sm:col-span-2">
                        <strong className="text-amber-600">⚠️ To activate online payments:</strong>
                        <p className="mt-1">Enter API credentials above → enable the gateway → test with a small order → switch Test Mode off to go live. Each gateway has a link to its official docs.</p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
