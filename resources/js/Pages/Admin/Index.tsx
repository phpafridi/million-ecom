import { Head, useForm, usePage } from '@inertiajs/react'
import { useState, useEffect } from 'react'
import AdminLayout from '@/Layouts/AdminLayout'

interface Field { key: string; label: string; type: 'text' | 'textarea' }
interface Page  { title: string; icon: string; fields: Field[] }
interface Props  { pages: Record<string, Page>; settings: Record<string, string>; togglePages?: Record<string, string> }

export default function PagesIndex({ pages, settings, togglePages = {} }: Props) {
    const { props } = usePage<{ adminPath?: string; flash?: { success?: string } }>()
    const ap = `/${props.adminPath ?? 'ml-admin'}`
    const [active, setActive] = useState(Object.keys(pages)[0])
    const page = pages[active]
    const toggleKey = togglePages[active]

    // Build one big form with ALL keys from all pages, plus a "visible" flag when this page supports show/hide
    const allFields = Object.values(pages).flatMap(p => p.fields)
    const initialData = Object.fromEntries(allFields.map(f => [f.key, settings[f.key] ?? '']))
    const { data, setData, put, processing, recentlySuccessful } = useForm<Record<string, string>>({
        ...initialData,
        visible: toggleKey ? (settings[toggleKey] ?? '1') : '1',
    })

    // Re-sync the "visible" toggle whenever the active tab changes — each page
    // has its own enabled/disabled setting, so the toggle must not carry the
    // previous tab's value over.
    useEffect(() => {
        setData('visible', toggleKey ? (settings[toggleKey] ?? '1') : '1')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active])

    function save(e: React.FormEvent) {
        e.preventDefault()
        put(`${ap}/pages/${active}`)
    }

    const inputCls = 'w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13.5px] outline-none focus:border-[var(--color-primary)] transition-colors bg-white'
    const textareaCls = inputCls + ' resize-y min-h-[120px] leading-relaxed'

    return (
        <AdminLayout auth={(usePage() as any).props.auth} settings={settings}>
            <Head title="Pages" />
            <div className="p-4 sm:p-6 max-w-5xl mx-auto">
                <div className="mb-6">
                    <h1 className="font-black text-[22px] text-gray-900">Pages & Policies</h1>
                    <p className="text-[13px] text-gray-500 mt-1">Edit all public pages and policy content. All changes are live immediately after saving.</p>
                </div>

                {recentlySuccessful && (
                    <div className="mb-5 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-[13px] text-green-700 font-semibold">
                        ✅ {page.title} saved successfully.
                    </div>
                )}

                <div className="flex gap-5 flex-col lg:flex-row">
                    {/* Sidebar tabs */}
                    <div className="lg:w-56 flex-shrink-0">
                        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                            {Object.entries(pages).map(([key, pg]) => (
                                <button key={key} onClick={() => setActive(key)}
                                    className="w-full flex items-center gap-3 px-4 py-3.5 text-left border-none cursor-pointer transition-all text-[13px] font-semibold border-b border-gray-50 last:border-0"
                                    style={{ background: active === key ? 'var(--color-primary)' : 'white', color: active === key ? 'var(--color-primary-text, #0a0a0a)' : '#374151' }}>
                                    <span className="text-lg">{pg.icon}</span>
                                    <span className="leading-tight">{pg.title}</span>
                                </button>
                            ))}
                        </div>

                        {/* Preview links */}
                        <div className="mt-4 bg-white rounded-2xl border border-gray-100 p-3">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Preview</p>
                            {[
                                ['About', '/about'],
                                ['Contact', '/contact'],
                                ['Return Policy', '/pages/return-policy'],
                                ['Privacy Policy', '/pages/privacy-policy'],
                                ['Terms', '/pages/terms'],
                                ['Shipping', '/pages/shipping-policy'],
                                ['Payment', '/pages/payment-policy'],
                            ].map(([l, h]) => (
                                <a key={l} href={h} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center justify-between px-2.5 py-2 text-[12px] font-semibold text-gray-500 no-underline rounded-lg hover:bg-gray-50 transition-colors">
                                    {l} <span className="text-gray-300">↗</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Editor */}
                    <div className="flex-1 min-w-0">
                        <form onSubmit={save}>
                            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                                {/* Header */}
                                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{page.icon}</span>
                                        <div>
                                            <h2 className="font-black text-[15px] text-gray-900">{page.title}</h2>
                                            <p className="text-[11px] text-gray-400">{page.fields.length} editable field{page.fields.length !== 1 ? 's' : ''}</p>
                                        </div>
                                    </div>
                                    <button type="submit" disabled={processing}
                                        className="flex items-center gap-2 border-none rounded-xl cursor-pointer font-black text-[13px] px-5 py-2.5 transition-opacity"
                                        style={{ background: 'var(--color-primary)', color: 'var(--color-primary-text, #0a0a0a)', opacity: processing ? 0.7 : 1 }}>
                                        {processing ? 'Saving...' : '💾 Save Changes'}
                                    </button>
                                </div>

                                {/* Show/hide toggle — only for pages that support it (policy pages) */}
                                {toggleKey && (
                                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50">
                                        <div>
                                            <p className="font-black text-[13px] text-gray-900">Show this page on the site</p>
                                            <p className="text-[11.5px] text-gray-500 mt-0.5">
                                                {data.visible === '0'
                                                    ? 'Hidden — visiting this page returns a 404, and it will disappear from the footer. Content stays saved.'
                                                    : 'Visible — this page is live and linked from the footer.'}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setData('visible', data.visible === '0' ? '1' : '0')}
                                            className="relative inline-flex items-center rounded-full transition-colors flex-shrink-0"
                                            style={{ width: 46, height: 26, background: data.visible === '0' ? '#D1D5DB' : 'var(--color-primary)' }}
                                            aria-pressed={data.visible !== '0'}
                                        >
                                            <span
                                                className="inline-block rounded-full bg-white transition-transform"
                                                style={{ width: 20, height: 20, transform: data.visible === '0' ? 'translateX(4px)' : 'translateX(23px)' }}
                                            />
                                        </button>
                                    </div>
                                )}

                                {/* Fields */}
                                <div className="p-5 space-y-5">
                                    {page.fields.length === 0 ? (
                                        <div className="text-center py-12 text-gray-400">
                                            <p className="text-4xl mb-3">📄</p>
                                            <p className="font-semibold text-[14px]">This page has no editable text fields.</p>
                                            <p className="text-[12px] mt-1">Content is managed via Settings or other sections.</p>
                                        </div>
                                    ) : page.fields.map((field, idx) => {
                                        const isSectionTitle = field.key.includes('_title') && !field.key.endsWith('_title') === false && field.label.includes('Section')
                                        const sectionNum = field.key.match(/_s(\d+)_/)?.[1]
                                        const isFirstInSection = field.key.endsWith('_title') && field.label.includes('Section')

                                        return (
                                            <div key={field.key}>
                                                {/* Section divider */}
                                                {isFirstInSection && (
                                                    <div className="flex items-center gap-3 mb-4 mt-2">
                                                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black flex-shrink-0"
                                                            style={{ background: 'var(--color-primary)', color: 'var(--color-primary-text, #0a0a0a)' }}>
                                                            {sectionNum}
                                                        </div>
                                                        <div className="flex-1 h-px bg-gray-100" />
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Section {sectionNum}</span>
                                                        <div className="flex-1 h-px bg-gray-100" />
                                                    </div>
                                                )}
                                                <div className={isFirstInSection ? '' : ''}>
                                                    <label className="block text-[11.5px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                                                        {field.label}
                                                    </label>
                                                    {field.type === 'textarea' ? (
                                                        <textarea
                                                            className={textareaCls}
                                                            value={data[field.key] ?? ''}
                                                            onChange={e => setData(field.key, e.target.value)}
                                                            placeholder={`Enter ${field.label.toLowerCase()}...`}
                                                            rows={field.label.includes('Content') ? 8 : 4}
                                                        />
                                                    ) : (
                                                        <input
                                                            type="text"
                                                            className={inputCls}
                                                            value={data[field.key] ?? ''}
                                                            onChange={e => setData(field.key, e.target.value)}
                                                            placeholder={`Enter ${field.label.toLowerCase()}...`}
                                                        />
                                                    )}
                                                    {field.label.includes('Content') && (
                                                        <p className="text-[11px] text-gray-400 mt-1.5">
                                                            💡 Use bullet points starting with • for lists. Press Enter for new lines.
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                                {page.fields.length > 0 && (
                                    <div className="px-5 pb-5">
                                        <button type="submit" disabled={processing}
                                            className="w-full flex items-center justify-center gap-2 border-none rounded-xl cursor-pointer font-black text-[14px] py-3.5 transition-opacity"
                                            style={{ background: 'var(--color-primary)', color: 'var(--color-primary-text, #0a0a0a)', opacity: processing ? 0.7 : 1 }}>
                                            {processing ? 'Saving...' : '💾 Save Changes'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
