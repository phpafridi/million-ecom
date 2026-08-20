import { Head, useForm, usePage } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import { useState, useEffect } from 'react'
import { IconBrandGoogle, IconCheck, IconExternalLink, IconRefresh, IconEye, IconUsers, IconClock, IconTrendingUp } from '@tabler/icons-react'

interface GAMetric { value: string; label: string; change?: string; up?: boolean }

interface Props {
    settings: Record<string, string>
    ga_data?: {
        active_users: number
        page_views_today: number
        sessions_today: number
        bounce_rate: string
        top_pages: Array<{ path: string; views: number }>
        traffic_sources: Array<{ source: string; sessions: number }>
    }
}

export default function AnalyticsPage({ settings, ga_data }: Props) {
    const { props } = usePage<any>()
    const ap = `/${props.adminPath ?? 'ml-admin'}`
    const flash = (props as any).flash

    const { data, setData, post, processing } = useForm({
        ga_measurement_id:  settings.ga_measurement_id  ?? '',
        ga_enabled:         settings.ga_enabled         ?? '0',
        ga_api_secret:      settings.ga_api_secret      ?? '',
        gtm_id:             settings.gtm_id             ?? '',
        gtm_enabled:        settings.gtm_enabled        ?? '0',
        fb_pixel_id:        settings.fb_pixel_id        ?? '',
        fb_pixel_enabled:   settings.fb_pixel_enabled   ?? '0',
        tiktok_pixel_id:    settings.tiktok_pixel_id    ?? '',
        tiktok_pixel_enabled: settings.tiktok_pixel_enabled ?? '0',
    })

    const isEnabled  = data.ga_enabled === '1'
    const hasMeasId  = data.ga_measurement_id.startsWith('G-')
    const inputCls   = "w-full h-11 px-4 rounded-xl border border-gray-200 text-[13.5px] font-mono focus:outline-none focus:ring-2 focus:border-transparent bg-white"
    const labelCls   = "block text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-1.5"

    function save(e: React.FormEvent) {
        e.preventDefault()
        post(`${ap}/settings`)
    }

    return (
        <AdminLayout title="Analytics & Tracking">
            <Head title="Analytics & Tracking" />

            <form onSubmit={save} className="space-y-5 max-w-4xl">

                {/* ── Live Stats Widget ── */}
                {isEnabled && hasMeasId && (
                    <div className="bg-white rounded-2xl border border-gray-100 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-black text-[16px] text-gray-800">📊 Live Stats — Today</h3>
                            <a href={`https://analytics.google.com/analytics/web/#/p${data.ga_measurement_id.replace('G-','')}/reports/reportinghub`}
                                target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-[12.5px] font-bold no-underline"
                                style={{ color: 'var(--color-primary)' }}>
                                Open GA4 <IconExternalLink size={13} />
                            </a>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                            {[
                                { icon: '👥', label: 'Active Users',    value: ga_data?.active_users      ?? '—', color: '#3B82F6' },
                                { icon: '👁️', label: 'Page Views Today', value: ga_data?.page_views_today ?? '—', color: '#10B981' },
                                { icon: '🔗', label: 'Sessions Today',   value: ga_data?.sessions_today   ?? '—', color: '#F59E0B' },
                                { icon: '↩️', label: 'Bounce Rate',      value: ga_data?.bounce_rate      ?? '—', color: '#EF4444' },
                            ].map(m => (
                                <div key={m.label} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                    <div className="text-2xl mb-2">{m.icon}</div>
                                    <p className="font-black text-[22px]" style={{ color: m.color }}>{m.value}</p>
                                    <p className="text-[11.5px] text-gray-400 mt-0.5">{m.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Top pages */}
                        {ga_data?.top_pages && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <p className="font-black text-[13px] text-gray-700 mb-3">Top Pages</p>
                                    <div className="space-y-2">
                                        {ga_data.top_pages.map((p, i) => (
                                            <div key={i} className="flex items-center justify-between text-[12.5px]">
                                                <span className="text-gray-600 truncate max-w-[180px]">{p.path}</span>
                                                <span className="font-bold text-gray-800 ml-2">{p.views}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="font-black text-[13px] text-gray-700 mb-3">Traffic Sources</p>
                                    <div className="space-y-2">
                                        {ga_data.traffic_sources.map((s, i) => (
                                            <div key={i} className="flex items-center justify-between text-[12.5px]">
                                                <span className="text-gray-600 capitalize">{s.source}</span>
                                                <span className="font-bold text-gray-800">{s.sessions}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {!ga_data && (
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-[13px] text-blue-700">
                                <p className="font-bold mb-1">📡 Connect GA4 Data API for live stats</p>
                                <p>Add your API Secret below to see real-time data here. Otherwise, visit Google Analytics directly.</p>
                                <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 mt-2 font-bold text-blue-600 no-underline">
                                    Open Google Analytics <IconExternalLink size={12} />
                                </a>
                            </div>
                        )}
                    </div>
                )}

                {/* ── Google Analytics 4 ── */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#F59E0B15' }}>
                                <IconBrandGoogle size={20} className="text-amber-500" />
                            </div>
                            <div>
                                <h3 className="font-bold text-[15px] text-gray-800">Google Analytics 4</h3>
                                <p className="text-[12px] text-gray-400">Track visitors, page views, conversions</p>
                            </div>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={data.ga_enabled === '1'}
                                onChange={e => setData('ga_enabled', e.target.checked ? '1' : '0')}
                                className="w-4 h-4 rounded" />
                            <span className="text-[13px] font-semibold text-gray-600">Enable</span>
                        </label>
                    </div>

                    {data.ga_enabled === '1' && (
                        <div className="space-y-4">
                            <div>
                                <label className={labelCls}>Measurement ID *</label>
                                <input className={inputCls} value={data.ga_measurement_id}
                                    onChange={e => setData('ga_measurement_id', e.target.value)}
                                    placeholder="G-XXXXXXXXXX" />
                                {data.ga_measurement_id && !data.ga_measurement_id.startsWith('G-') && (
                                    <p className="text-red-500 text-[11.5px] mt-1">⚠ Measurement ID must start with G-</p>
                                )}
                                {hasMeasId && <p className="text-green-600 text-[11.5px] mt-1">✅ Format looks correct</p>}
                                <p className="text-[11.5px] text-gray-400 mt-1">
                                    Get from: <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-500">analytics.google.com</a> → Admin → Data Streams → Web → Measurement ID
                                </p>
                            </div>
                            <div>
                                <label className={labelCls}>API Secret (optional — for live stats in this panel)</label>
                                <input type="password" className={inputCls} value={data.ga_api_secret}
                                    onChange={e => setData('ga_api_secret', e.target.value)}
                                    placeholder="Leave blank if you don't need live stats here" />
                                <p className="text-[11.5px] text-gray-400 mt-1">
                                    Get from: GA4 → Admin → Data Streams → Measurement Protocol → Create
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-[12px] text-amber-700">
                        <p className="font-bold mb-1">📋 Setup Steps:</p>
                        <ol className="space-y-1 list-decimal list-inside">
                            <li>Go to <a href="https://analytics.google.com" target="_blank" className="underline">analytics.google.com</a> → Create Account → Create Property</li>
                            <li>Select "Web" as platform, enter your domain</li>
                            <li>Copy the Measurement ID (starts with G-)</li>
                            <li>Paste above → Enable → Save Settings</li>
                            <li>Wait 24-48 hours for data to appear</li>
                        </ol>
                    </div>
                </div>

                {/* ── Google Tag Manager ── */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-lg">🏷️</div>
                            <div>
                                <h3 className="font-bold text-[15px] text-gray-800">Google Tag Manager</h3>
                                <p className="text-[12px] text-gray-400">Manage all tracking scripts in one place</p>
                            </div>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={data.gtm_enabled === '1'}
                                onChange={e => setData('gtm_enabled', e.target.checked ? '1' : '0')}
                                className="w-4 h-4 rounded" />
                            <span className="text-[13px] font-semibold text-gray-600">Enable</span>
                        </label>
                    </div>
                    {data.gtm_enabled === '1' && (
                        <div>
                            <label className={labelCls}>GTM Container ID</label>
                            <input className={inputCls} value={data.gtm_id}
                                onChange={e => setData('gtm_id', e.target.value)}
                                placeholder="GTM-XXXXXXX" />
                            <p className="text-[11.5px] text-gray-400 mt-1">Get from tagmanager.google.com → Your Container ID</p>
                        </div>
                    )}
                </div>

                {/* ── Facebook Pixel ── */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: '#1877F215' }}>
                                <span style={{ color: '#1877F2', fontWeight: 900, fontSize: 14 }}>f</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-[15px] text-gray-800">Facebook / Meta Pixel</h3>
                                <p className="text-[12px] text-gray-400">Track Facebook & Instagram ad conversions</p>
                            </div>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={data.fb_pixel_enabled === '1'}
                                onChange={e => setData('fb_pixel_enabled', e.target.checked ? '1' : '0')}
                                className="w-4 h-4 rounded" />
                            <span className="text-[13px] font-semibold text-gray-600">Enable</span>
                        </label>
                    </div>
                    {data.fb_pixel_enabled === '1' && (
                        <div>
                            <label className={labelCls}>Pixel ID</label>
                            <input className={inputCls} value={data.fb_pixel_id}
                                onChange={e => setData('fb_pixel_id', e.target.value)}
                                placeholder="1234567890123456" />
                            <p className="text-[11.5px] text-gray-400 mt-1">Get from: <a href="https://business.facebook.com/events_manager" target="_blank" className="text-blue-500">Meta Events Manager</a> → Pixels → Your Pixel ID</p>
                        </div>
                    )}
                </div>

                {/* ── TikTok Pixel ── */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center text-white text-lg">♪</div>
                            <div>
                                <h3 className="font-bold text-[15px] text-gray-800">TikTok Pixel</h3>
                                <p className="text-[12px] text-gray-400">Track TikTok ad performance and conversions</p>
                            </div>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={data.tiktok_pixel_enabled === '1'}
                                onChange={e => setData('tiktok_pixel_enabled', e.target.checked ? '1' : '0')}
                                className="w-4 h-4 rounded" />
                            <span className="text-[13px] font-semibold text-gray-600">Enable</span>
                        </label>
                    </div>
                    {data.tiktok_pixel_enabled === '1' && (
                        <div>
                            <label className={labelCls}>TikTok Pixel ID</label>
                            <input className={inputCls} value={data.tiktok_pixel_id}
                                onChange={e => setData('tiktok_pixel_id', e.target.value)}
                                placeholder="CXXXXXXXXXXXXXXXXX" />
                            <p className="text-[11.5px] text-gray-400 mt-1">Get from: <a href="https://ads.tiktok.com/i18n/pixel" target="_blank" className="text-blue-500">TikTok Ads Manager</a> → Assets → Events → Web Events</p>
                        </div>
                    )}
                </div>

                {/* Save */}
                <div className="flex items-center gap-3">
                    <button type="submit" disabled={processing}
                        className="flex items-center gap-2 h-11 px-8 rounded-xl font-bold text-[14px] disabled:opacity-60 cursor-pointer border-none"
                        style={{ background: 'var(--color-primary)', color: 'var(--color-primary-text)' }}>
                        <IconCheck size={16} /> {processing ? 'Saving...' : 'Save Tracking Settings'}
                    </button>
                    {flash?.success && (
                        <span className="text-green-600 font-semibold text-[13px] flex items-center gap-1">
                            <IconCheck size={14} /> {flash.success}
                        </span>
                    )}
                </div>
            </form>
        </AdminLayout>
    )
}
