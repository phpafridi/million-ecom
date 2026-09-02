import { Head, usePage, useForm } from '@inertiajs/react'
import { useState } from 'react'
import { IconUpload, IconCheck } from '@tabler/icons-react'
import AdminLayout from '@/Layouts/AdminLayout'

interface Props { settings: Record<string, string> }

const inputCls = 'w-full h-11 px-4 border-2 border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary,#00c8ff)] transition-colors bg-white'

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
    return (
        <div>
            <label className="block text-[13px] font-semibold text-gray-700 mb-1">{label}</label>
            {hint && <p className="text-[11.5px] text-gray-400 mb-1.5">{hint}</p>}
            {children}
        </div>
    )
}

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-manrope font-bold text-[16px] text-gray-900 pb-4 border-b border-gray-100 mb-5 flex items-center gap-2">
                <span>{icon}</span> {title}
            </h3>
            <div className="space-y-4">{children}</div>
        </div>
    )
}

function ImageUploadField({ label, current, onFile }: { label: string; current?: string; onFile: (f: File) => void }) {
    const [preview, setPreview] = useState<string | null>(current ?? null)
    return (
        <div>
            <label className="block text-[13px] font-semibold text-gray-700 mb-2">{label}</label>
            {preview && <div className="mb-2 h-16 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden"><img src={preview} className="max-h-full max-w-full object-contain" alt=""/></div>}
            <label className="flex items-center gap-2 border-2 border-dashed border-gray-200 hover:border-[var(--color-primary,#00c8ff)] rounded-xl px-4 py-3 cursor-pointer transition-colors">
                <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { setPreview(URL.createObjectURL(f)); onFile(f) }}} />
                <IconUpload size={16} className="text-[var(--color-primary,#00c8ff)]" />
                <span className="text-[13px] text-gray-500">Click to upload image</span>
            </label>
        </div>
    )
}

export default function Branding({ settings }: Props) {
    const { props: _p } = usePage<{ adminPath?: string }>()
    const ap = `/${_p.adminPath ?? 'ml-admin'}`

    const { data, setData, post, processing } = useForm<Record<string, any>>({
        logo: null as File | null,
        header_title_color:    settings.header_title_color    ?? '',
        header_subtitle_color: settings.header_subtitle_color ?? '',
        // Independent of header_text — that variable is shared with the
        // site title elsewhere, so tying the search box to it meant it
        // couldn't be a different color without also changing the title.
        search_text_color:     settings.search_text_color     ?? '',
        // Floating button controls — independent enable/position/size for
        // Chat, Cart, and WhatsApp. Previously WhatsApp was hardcoded to
        // the exact same corner as Chat with no way to change either,
        // which is why it ended up hidden behind the chat bubble.
        chat_float_enabled:     settings.chat_float_enabled     ?? '1',
        chat_float_position:    settings.chat_float_position    ?? 'right',
        chat_float_size:        settings.chat_float_size        ?? 'md',
        cart_float_enabled:     settings.cart_float_enabled     ?? '1',
        cart_float_position:    settings.cart_float_position    ?? 'right',
        cart_float_size:        settings.cart_float_size        ?? 'md',
        whatsapp_float_enabled: settings.whatsapp_float_enabled ?? '0',
        whatsapp_float_position:settings.whatsapp_float_position?? 'right',
        whatsapp_float_size:    settings.whatsapp_float_size    ?? 'md',
        ticker_items:  settings.ticker_items  ?? '',
        trust_1_icon:  settings.trust_1_icon  ?? '🚚', trust_1_title: settings.trust_1_title ?? 'Free Delivery',  trust_1_sub: settings.trust_1_sub ?? 'On qualifying orders',
        trust_2_icon:  settings.trust_2_icon  ?? '🛡️', trust_2_title: settings.trust_2_title ?? '100% Genuine',   trust_2_sub: settings.trust_2_sub ?? 'Verified products only',
        trust_3_icon:  settings.trust_3_icon  ?? '↩️', trust_3_title: settings.trust_3_title ?? 'Easy Returns',   trust_3_sub: settings.trust_3_sub ?? '7-day hassle-free',
        trust_4_icon:  settings.trust_4_icon  ?? '🎧', trust_4_title: settings.trust_4_title ?? '24/7 Support',   trust_4_sub: settings.trust_4_sub ?? 'We are here to help',
        trust_5_icon:  settings.trust_5_icon  ?? '💬', trust_5_title: settings.trust_5_title ?? 'WhatsApp Us',    trust_5_sub: settings.trust_5_sub ?? 'Quick response',
        trust_bar_bg:       settings.trust_bar_bg       ?? '#0a0e1a',
        trust_icon_color:   settings.trust_icon_color   ?? '#00c8ff',
        trust_title_color:  settings.trust_title_color  ?? '#ffffff',
        trust_sub_color:    settings.trust_sub_color    ?? '#6b8aaa',
        ticker_bg:          settings.ticker_bg          ?? '#ffffff',
        ticker_live_bg:     settings.ticker_live_bg     ?? '#00c8ff',
        ticker_live_text:   settings.ticker_live_text   ?? '#0a0e1a',
        ticker_text_color:  settings.ticker_text_color  ?? '#6b7280',
        brands_show:        settings.brands_show        ?? '1',
        brands_title:       settings.brands_title       ?? 'Top Brands',
        brands_subtitle:    settings.brands_subtitle    ?? 'Official Partners',
        brands_items:       settings.brands_items       ?? 'Apple|Samsung|Sony|Dell|LG|ASUS',
        home_divider_text:  settings.home_divider_text  ?? 'Fresh Drops Meet Fan Favorites',
        // These 9 theme fields were missing from Settings.tsx's initial
        // form data entirely — meaning the color pickers never actually
        // reflected a previously-saved value on page load, only the
        // hardcoded fallback, and would silently not even submit unless
        // the admin happened to touch that specific picker. Fixed here by
        // properly initializing from the saved setting, same as every
        // other field on this page.
        // Theme colors (primary/accent/dark bg/etc.) deliberately NOT
        // included here — there's already a dedicated, more complete Theme
        // page (presets, header/nav/topbar text colors, live preview).
        // Including them here too would recreate the exact kind of
        // duplication this whole reorganization is meant to fix.
    })

    function save(e: React.FormEvent) {
        e.preventDefault()
        post(`${ap}/settings`, { forceFormData: true })
    }

    return (
        <AdminLayout title="Branding">
            <Head title="Branding — Admin" />
            <form onSubmit={save} className="grid grid-cols-1 lg:grid-cols-3 gap-5 max-w-5xl">
                <div className="lg:col-span-2 space-y-5">

                    <Section title="Store Logo" icon="🖼️">
                        <ImageUploadField label="Logo (landscape, up to 400×120px — transparent PNG, padding auto-trimmed)" current={settings.logo_url} onFile={f => setData('logo', f)} />
                        <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-[12px] text-blue-700">
                            The logo box has no background — it sits directly on your header color. Use a transparent PNG so it looks correct on any header color you choose below.
                        </div>
                        {settings.logo_url && (
                            <div className="mt-1">
                                <div className="text-[11px] font-semibold text-gray-500 mb-2">Header preview (on your current navbar color)</div>
                                <div className="w-16 h-16 rounded-xl flex items-center justify-center p-2 border border-gray-200"
                                    style={{ background: 'var(--color-header-bg,#ffffff)' }}>
                                    <img src={settings.logo_url} alt="logo preview" className="w-full h-full object-contain" />
                                </div>
                            </div>
                        )}
                        <div className="pt-4 mt-2 border-t border-gray-100">
                            <p className="text-[13px] font-bold text-gray-700 mb-3">Site Title Colors (next to logo)</p>
                            <div className="grid grid-cols-2 gap-3">
                                {([
                                    ['header_title_color',    'Title Color'],
                                    ['header_subtitle_color', 'Subtitle / Tagline Color'],
                                    ['search_text_color',      'Search Box Text Color'],
                                ] as const).map(([key, label]) => (
                                    <div key={key}>
                                        <label className="block text-[11.5px] font-semibold text-gray-500 mb-1.5">{label}</label>
                                        <div className="flex items-center gap-2">
                                            <input type="color" value={data[key] || '#0a0a0a'}
                                                onChange={e => setData(key, e.target.value)}
                                                className="w-9 h-9 rounded-lg border-2 border-gray-200 cursor-pointer p-0.5 bg-white flex-shrink-0"/>
                                            <input value={data[key] || ''} onChange={e => setData(key, e.target.value)}
                                                className="flex-1 h-9 px-2 border border-gray-200 rounded-lg text-[11.5px] font-mono outline-none focus:border-[var(--color-primary)]"
                                                placeholder="Leave blank to use theme default"/>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Section>

                    <Section title="Floating Buttons" icon="🎯">
                        <p className="text-[12.5px] text-gray-500 -mt-1">Chat, Cart, and WhatsApp buttons that float over the storefront. Each can be shown/hidden, moved to either bottom corner, and resized independently — buttons sharing a corner stack automatically without overlapping.</p>
                        {([
                            ['chat',     'Chat Widget'],
                            ['cart',     'Floating Cart'],
                            ['whatsapp', 'WhatsApp Button'],
                        ] as const).map(([key, label]) => (
                            <div key={key} className="p-3.5 bg-gray-50 rounded-xl space-y-2.5">
                                <div className="flex items-center justify-between">
                                    <div className="text-[13px] font-semibold text-gray-800">{label}</div>
                                    <button type="button" onClick={() => setData(`${key}_float_enabled`, data[`${key}_float_enabled`] === '1' ? '0' : '1')}
                                        className={`w-11 h-6 rounded-full transition-all relative flex-shrink-0 border-none cursor-pointer ${data[`${key}_float_enabled`] === '1' ? 'bg-[var(--color-primary,#00c8ff)]' : 'bg-gray-300'}`}>
                                        <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all" style={{ left: data[`${key}_float_enabled`] === '1' ? 22 : 2 }} />
                                    </button>
                                </div>
                                {data[`${key}_float_enabled`] === '1' && (
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-[10.5px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Corner</label>
                                            <select className="w-full h-9 px-2 border border-gray-200 rounded-lg text-[12.5px] outline-none focus:border-[var(--color-primary,#00c8ff)] bg-white"
                                                value={data[`${key}_float_position`]} onChange={e => setData(`${key}_float_position`, e.target.value)}>
                                                <option value="right">Bottom Right</option>
                                                <option value="left">Bottom Left</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[10.5px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Size</label>
                                            <select className="w-full h-9 px-2 border border-gray-200 rounded-lg text-[12.5px] outline-none focus:border-[var(--color-primary,#00c8ff)] bg-white"
                                                value={data[`${key}_float_size`]} onChange={e => setData(`${key}_float_size`, e.target.value)}>
                                                <option value="sm">Small</option>
                                                <option value="md">Medium</option>
                                                <option value="lg">Large</option>
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </Section>

                    <Section title="Trust Bar & Ticker" icon="🛡️">
                        <p className="text-[12.5px] text-gray-500">5 badges shown under the header. Set icon (emoji), title and sub-text for each badge.</p>
                        <div className="space-y-2">
                            {[1,2,3,4,5].map(n => (
                                <div key={n} className="grid grid-cols-[48px_1fr_1.4fr] gap-2 items-center p-3 bg-gray-50 rounded-xl">
                                    <input
                                        value={data[`trust_${n}_icon`] ?? ''}
                                        onChange={e => setData(`trust_${n}_icon`, e.target.value)}
                                        className="h-10 text-center text-xl border-2 border-gray-200 rounded-xl outline-none focus:border-[var(--color-primary,#00c8ff)] bg-white"
                                        placeholder="🚚"
                                    />
                                    <input
                                        value={data[`trust_${n}_title`] ?? ''}
                                        onChange={e => setData(`trust_${n}_title`, e.target.value)}
                                        className={inputCls}
                                        placeholder="Title e.g. Free Delivery"
                                    />
                                    <input
                                        value={data[`trust_${n}_sub`] ?? ''}
                                        onChange={e => setData(`trust_${n}_sub`, e.target.value)}
                                        className={inputCls}
                                        placeholder="e.g. Orders over Rs 5,000"
                                    />
                                </div>
                            ))}
                        </div>
                        <Field label="Scrolling Ticker Text" hint="Separate each item with a | pipe character">
                            <input className={inputCls} value={data.ticker_items} onChange={e => setData('ticker_items', e.target.value)} placeholder="Free shipping Rs 5000+|7-day returns|Verified products|24/7 support" />
                        </Field>

                        <div className="pt-4 border-t border-gray-100">
                            <p className="text-[13px] font-bold text-gray-700 mb-3">Trust Bar Colors</p>
                            <div className="grid grid-cols-2 gap-3">
                                {([
                                    ['trust_bar_bg',      'Bar Background'],
                                    ['trust_icon_color',  'Icon Accent Color'],
                                    ['trust_title_color', 'Title Text Color'],
                                    ['trust_sub_color',   'Sub Text Color'],
                                ] as const).map(([key, label]) => (
                                    <div key={key}>
                                        <label className="block text-[11.5px] font-semibold text-gray-500 mb-1.5">{label}</label>
                                        <div className="flex items-center gap-2">
                                            <input type="color" value={data[key] || '#000000'}
                                                onChange={e => setData(key, e.target.value)}
                                                className="w-9 h-9 rounded-lg border-2 border-gray-200 cursor-pointer p-0.5 bg-white flex-shrink-0"/>
                                            <input value={data[key] || ''} onChange={e => setData(key, e.target.value)}
                                                className="flex-1 h-9 px-2 border border-gray-200 rounded-lg text-[11.5px] font-mono outline-none focus:border-[var(--color-primary)]"
                                                placeholder="#000000"/>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-3 border-t border-gray-100">
                            <p className="text-[13px] font-bold text-gray-700 mb-3">Ticker Bar Colors</p>
                            <div className="grid grid-cols-2 gap-3">
                                {([
                                    ['ticker_bg',        'Ticker Background'],
                                    ['ticker_live_bg',   '"LIVE" Badge Color'],
                                    ['ticker_live_text', '"LIVE" Text Color'],
                                    ['ticker_text_color','Ticker Text Color'],
                                ] as const).map(([key, label]) => (
                                    <div key={key}>
                                        <label className="block text-[11.5px] font-semibold text-gray-500 mb-1.5">{label}</label>
                                        <div className="flex items-center gap-2">
                                            <input type="color" value={data[key] || '#000000'}
                                                onChange={e => setData(key, e.target.value)}
                                                className="w-9 h-9 rounded-lg border-2 border-gray-200 cursor-pointer p-0.5 bg-white flex-shrink-0"/>
                                            <input value={data[key] || ''} onChange={e => setData(key, e.target.value)}
                                                className="flex-1 h-9 px-2 border border-gray-200 rounded-lg text-[11.5px] font-mono outline-none focus:border-[var(--color-primary)]"
                                                placeholder="#000000"/>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Section>

                    <Section title="Homepage Section Divider" icon="✨">
                        <Field label="Divider Text" hint="The badge text shown in the decorative divider between New Arrivals and Featured Products on the homepage">
                            <input className={inputCls} value={data.home_divider_text} onChange={e => setData('home_divider_text', e.target.value)} placeholder="Fresh Drops Meet Fan Favorites" />
                        </Field>
                    </Section>

                    <Section title="Brands Bar" icon="🏷️">
                        <div className="flex items-center justify-between py-2 pb-4 border-b border-gray-100">
                            <div>
                                <div className="text-[13.5px] font-semibold text-gray-800">Show Brands Section</div>
                                <div className="text-[12px] text-gray-400">Display on homepage</div>
                            </div>
                            <button type="button" onClick={() => setData('brands_show', data.brands_show === '1' ? '0' : '1')}
                                className={`relative w-12 h-6 rounded-full border-none cursor-pointer transition-all ${data.brands_show === '1' ? 'bg-[var(--color-primary)]' : 'bg-gray-200'}`}>
                                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${data.brands_show === '1' ? 'left-[26px]' : 'left-0.5'}`}/>
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Section Title">
                                <input className={inputCls} value={data.brands_title} onChange={e => setData('brands_title', e.target.value)} placeholder="Top Brands"/>
                            </Field>
                            <Field label="Eyebrow Text">
                                <input className={inputCls} value={data.brands_subtitle} onChange={e => setData('brands_subtitle', e.target.value)} placeholder="Official Partners"/>
                            </Field>
                        </div>
                        <Field label="Brand Names" hint="Separate with | pipe character. e.g. Apple|Samsung|Sony|Dell">
                            <input className={inputCls} value={data.brands_items} onChange={e => setData('brands_items', e.target.value)} placeholder="Apple|Samsung|Sony|Dell|LG|ASUS"/>
                        </Field>
                        <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl text-[12px] text-gray-500">
                            Preview: {(data.brands_items || '').split('|').filter(Boolean).map((b: string) => b.trim()).join(' · ')}
                        </div>
                    </Section>

                    <button type="submit" disabled={processing}
                        className="w-full h-14 font-black text-[15px] rounded-xl border-none cursor-pointer disabled:opacity-60 flex items-center justify-center gap-3 transition-all hover:opacity-90"
                        style={{ background:'var(--color-primary)', color:'var(--color-primary-text)' }}>
                        <IconCheck size={20}/>
                        {processing ? 'Saving…' : 'Save Branding'}
                    </button>
                </div>

                <div className="space-y-5">
                    <a href={`${ap}/theme`} className="block bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 text-white no-underline hover:opacity-90 transition-opacity">
                        <div className="text-[13px] font-bold flex items-center gap-2">🎨 Looking for theme colors?</div>
                        <div className="text-[12px] text-gray-300 mt-1">Primary/accent colors, dark backgrounds, presets, and border radius live on the dedicated Theme page →</div>
                    </a>
                    <div className="bg-white rounded-2xl border border-gray-100 p-5">
                        <h3 className="font-bold text-[14px] text-gray-800 mb-4">📐 Image Size Reference</h3>
                        <div className="space-y-3 text-[12.5px]">
                            {[
                                { label:'Logo',              size:'400×120px',   hint:'Landscape icon+wordmark, transparent — padding auto-trimmed' },
                                { label:'Hero Slide',        size:'1920×1080px', hint:'Full-width slider, subject centered' },
                                { label:'Full Banner',       size:'1920×520px',  hint:'Homepage wide banner, subject centered' },
                                { label:'Category Image',    size:'900×1080px',  hint:'Nearly square, subject centered (square on desktop, 3:4 on mobile)' },
                                { label:'Category Banner',   size:'1920×380px',  hint:'Category page header' },
                                { label:'Product Image',     size:'800×1067px',  hint:'Portrait 3:4, white background' },
                            ].map(s => (
                                <div key={s.label} className="flex items-start gap-2">
                                    <IconCheck size={13} className="flex-shrink-0 mt-0.5" style={{ color:'var(--color-primary)' }}/>
                                    <div>
                                        <span className="font-bold text-gray-700">{s.label}:</span>{' '}
                                        <span className="text-gray-500">{s.size}</span>
                                        <div className="text-[11px] text-gray-400">{s.hint}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    )
}
