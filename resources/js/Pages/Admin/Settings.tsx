import { Head, usePage, useForm } from '@inertiajs/react'
import { useState } from 'react'
import { IconUpload, IconInfoCircle, IconCheck } from '@tabler/icons-react'
import AdminLayout from '@/Layouts/AdminLayout'

interface Props { settings: Record<string, string> }

// ─────────────────────────────────────────────────────────────
// ALL helper components defined OUTSIDE the main component.
// If defined inside, they get recreated on every keystroke
// which unmounts/remounts inputs and causes auto-unfocus.
// ─────────────────────────────────────────────────────────────

const inputCls = 'w-full h-11 px-4 border-2 border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary,#00c8ff)] transition-colors bg-white'
const textareaCls = 'w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary,#00c8ff)] resize-none transition-colors'

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

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
export default function Settings({ settings }: Props) {
    const { props: _p } = usePage<{ adminPath?: string }>()
    const ap = `/${_p.adminPath ?? 'tijar-admin'}`

    const { data, setData, post, processing } = useForm<Record<string, any>>({
        site_name:            settings.site_name            ?? 'Tijar',
        site_tagline:         settings.site_tagline         ?? 'Your Online Store',
        phone:                settings.phone                ?? '',
        email:                settings.email                ?? '',
        address:              settings.address              ?? '',
        whatsapp_number:      settings.whatsapp_number      ?? '',
        shipping_fee:         settings.shipping_fee         ?? '0',
        delivery_threshold:   settings.delivery_threshold   ?? '0',
        admin_path:           settings.admin_path           ?? 'tijar-admin',
        topbar_message:       settings.topbar_message       ?? '',
        // Navbar colors
        navbar_bg:            settings.navbar_bg            ?? '#ffffff',
        navbar_text_color:    settings.navbar_text_color    ?? '#111111',
        navbar_border_color:  settings.navbar_border_color  ?? '#e5e7eb',
        subnav_bg:            settings.subnav_bg            ?? '#ffffff',
        logo_box_bg:          settings.logo_box_bg          ?? '#0a0a0a',
        // Cart & Chat
        cart_bubble_color:    settings.cart_bubble_color    ?? '#0a0a0a',
        cart_bubble_icon:     settings.cart_bubble_icon     ?? '🛒',
        chat_bubble_color:    settings.chat_bubble_color    ?? '#0a0a0a',
        chat_bubble_icon:     settings.chat_bubble_icon     ?? '💬',
        // Tracking
        ga_enabled:           settings.ga_enabled           ?? '0',
        ga_measurement_id:    settings.ga_measurement_id    ?? '',
        gtm_enabled:          settings.gtm_enabled          ?? '0',
        gtm_id:               settings.gtm_id               ?? '',
        fb_pixel_enabled:     settings.fb_pixel_enabled     ?? '0',
        fb_pixel_id:          settings.fb_pixel_id          ?? '',
        tiktok_pixel_enabled: settings.tiktok_pixel_enabled ?? '0',
        tiktok_pixel_id:      settings.tiktok_pixel_id      ?? '',
        ticker_items:         settings.ticker_items         ?? '',
        facebook_url:         settings.facebook_url         ?? '',
        instagram_url:        settings.instagram_url        ?? '',
        twitter_url:          settings.twitter_url          ?? '',
        youtube_url:          settings.youtube_url          ?? '',
        messenger_url:        settings.messenger_url        ?? '',
        meta_title:           settings.meta_title           ?? '',
        meta_description:     settings.meta_description     ?? '',
        product_contact_method: settings.product_contact_method ?? 'whatsapp',
        show_whatsapp_button:   settings.show_whatsapp_button   ?? '1',
        show_phone_button:      settings.show_phone_button      ?? '1',
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
        logo: null as File | null,
    })

    function save(e: React.FormEvent) {
        e.preventDefault()
        post(`${ap}/settings`, { forceFormData: true })
    }

    return (
        <AdminLayout title="Settings">
            <Head title="Settings — Admin" />
            <form onSubmit={save} className="grid grid-cols-1 lg:grid-cols-3 gap-5 max-w-5xl">

                {/* LEFT — 2 columns */}
                <div className="lg:col-span-2 space-y-5">

                    {/* Store info */}
                    <Section title="Store Information" icon="🏪">
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Store Name">
                                <input className={inputCls} value={data.site_name}  onChange={e => setData('site_name', e.target.value)} placeholder="Tijar Store" />
                            </Field>
                            <Field label="Tagline">
                                <input className={inputCls} value={data.site_tagline} onChange={e => setData('site_tagline', e.target.value)} placeholder="Your Online Store" />
                            </Field>
                        </div>
                        <Field label="Announcement Bar Message" hint="Shown at the very top of the store">
                            <input className={inputCls} value={data.topbar_message} onChange={e => setData('topbar_message', e.target.value)} placeholder="Free delivery on orders over Rs 5,000!" />
                        </Field>
                    </Section>

                    {/* Shipping */}
                    <Section title="Shipping & Delivery" icon="🚚">
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Shipping Fee (Rs)" hint="Charged per order">
                                <input className={inputCls} type="number" min="0" value={data.shipping_fee} onChange={e => setData('shipping_fee', e.target.value)} placeholder="200" />
                            </Field>
                            <Field label="Free Delivery Above (Rs)" hint="0 = always charge shipping">
                                <input className={inputCls} type="number" min="0" value={data.delivery_threshold} onChange={e => setData('delivery_threshold', e.target.value)} placeholder="5000" />
                            </Field>
                        </div>
                        <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-[12.5px] text-blue-700">
                            💡 <strong>Example:</strong> Fee = Rs 200, Free above = Rs 5,000 → orders under Rs 5,000 pay Rs 200, orders over get free delivery. Set both to 0 for always free.
                        </div>
                    </Section>

                    {/* Contact */}
                    <Section title="Contact Information" icon="📞">
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Phone Number">
                                <input className={inputCls} value={data.phone} onChange={e => setData('phone', e.target.value)} placeholder="+92 300 0000000" />
                            </Field>
                            <Field label="Support Email">
                                <input className={inputCls} type="email" value={data.email} onChange={e => setData('email', e.target.value)} placeholder="support@yourstore.com" />
                            </Field>
                        </div>
                        <Field label="WhatsApp Number" hint="Include country code — no spaces or dashes">
                            <input className={inputCls} value={data.whatsapp_number} onChange={e => setData('whatsapp_number', e.target.value)} placeholder="923001234567" />
                        </Field>
                        <Field label="Store Address">
                            <textarea className={textareaCls} rows={2} value={data.address} onChange={e => setData('address', e.target.value)} placeholder="Shop 12, Main Market, Karachi" />
                        </Field>
                    </Section>

                    {/* Admin URL */}
                    <Section title="Admin Panel URL" icon="🔐">
                        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-[12.5px] text-amber-800">
                            ⚠️ <strong>After saving, your admin URL will change.</strong> You will be logged out and redirected to the new URL.
                        </div>
                        <Field label="Admin Path" hint={`Current: ${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:8000'}/${data.admin_path}`}>
                            <div className="flex items-center">
                                <span className="h-11 px-3 bg-gray-100 border-2 border-r-0 border-gray-200 rounded-l-xl text-[13px] text-gray-500 flex items-center flex-shrink-0 whitespace-nowrap">yourdomain.com/</span>
                                <input className={inputCls + ' rounded-l-none'} value={data.admin_path} onChange={e => setData('admin_path', e.target.value.replace(/[^a-z0-9-]/g,'').toLowerCase())} placeholder="tijar-admin" />
                            </div>
                        </Field>
                    </Section>

                    {/* Social */}
                    <Section title="Social Media" icon="🌐">
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Facebook URL">
                                <input className={inputCls} value={data.facebook_url} onChange={e => setData('facebook_url', e.target.value)} placeholder="https://facebook.com/..." />
                            </Field>
                            <Field label="Instagram URL">
                                <input className={inputCls} value={data.instagram_url} onChange={e => setData('instagram_url', e.target.value)} placeholder="https://instagram.com/..." />
                            </Field>
                            <Field label="Twitter/X URL">
                                <input className={inputCls} value={data.twitter_url} onChange={e => setData('twitter_url', e.target.value)} placeholder="https://x.com/..." />
                            </Field>
                            <Field label="YouTube URL">
                                <input className={inputCls} value={data.youtube_url} onChange={e => setData('youtube_url', e.target.value)} placeholder="https://youtube.com/..." />
                            </Field>
                        </div>
                    </Section>

                    {/* SEO */}
                    <Section title="SEO" icon="🔍">
                        <Field label="Meta Title">
                            <input className={inputCls} value={data.meta_title} onChange={e => setData('meta_title', e.target.value)} placeholder="Tijar Store — Best Online Shop" />
                        </Field>
                        <Field label="Meta Description">
                            <textarea className={textareaCls} rows={3} value={data.meta_description} onChange={e => setData('meta_description', e.target.value)} placeholder="Your online store description for Google search results." />
                        </Field>
                    </Section>

                    {/* Trust Bar */}
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

                    {/* Brands Bar */}
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

                    {/* Contact method */}
                    <Section title="Product Contact Button" icon="💬">
                        <Field label="Primary Contact Method" hint="Button shown on product pages">
                            <select className={inputCls} value={data.product_contact_method} onChange={e => setData('product_contact_method', e.target.value)}>
                                <option value="whatsapp">WhatsApp</option>
                                <option value="phone">Phone Call</option>
                                <option value="email">Email</option>
                                <option value="messenger">Facebook Messenger</option>
                                <option value="none">None (only Add to Cart)</option>
                            </select>
                        </Field>
                        {data.product_contact_method === 'messenger' && (
                            <Field label="Messenger URL">
                                <input className={inputCls} value={data.messenger_url} onChange={e => setData('messenger_url', e.target.value)} placeholder="https://m.me/yourpage" />
                            </Field>
                        )}
                    </Section>

                    {/* Email config info */}
                    <Section title="Email Notifications (SMTP)" icon="📧">
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-[13px] text-amber-800">
                            <p className="font-bold mb-2">⚠️ Email settings must be set in your <code className="bg-white px-1 rounded">.env</code> file:</p>
                            <pre className="bg-white rounded-lg p-3 text-[11.5px] text-gray-700 overflow-x-auto">{`MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=you@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM_ADDRESS=you@gmail.com
MAIL_FROM_NAME="Your Store Name"`}</pre>
                            <p className="mt-2 text-[12px]">For Gmail: Enable 2FA → Google Account → Security → App Passwords → generate one.</p>
                        </div>
                    </Section>

                    {/* Save button — also at bottom of left col for convenience */}
                    <button type="submit" disabled={processing}
                        className="w-full h-14 font-black text-[15px] rounded-xl border-none cursor-pointer disabled:opacity-60 flex items-center justify-center gap-3 transition-all hover:opacity-90"
                        style={{ background:'var(--color-primary)', color:'var(--color-primary-text)' }}>
                        <IconCheck size={20}/>
                        {processing ? 'Saving…' : 'Save All Settings'}
                    </button>
                </div>

                {/* RIGHT — logo upload + image reference */}
                <div className="space-y-5">
                    <Section title="Store Logo" icon="🖼️">
                        <ImageUploadField label="Logo (200×200px, PNG preferred)" current={settings.logo_url} onFile={f => setData('logo', f)} />
                    </Section>

                    <div className="bg-white rounded-2xl border border-gray-100 p-5">
                        <h3 className="font-bold text-[14px] text-gray-800 mb-4">📐 Image Size Reference</h3>
                        <div className="space-y-3 text-[12.5px]">
                            {[
                                { label:'Logo',              size:'200×200px',   hint:'Square, transparent PNG' },
                                { label:'Hero Slide',        size:'1400×460px',  hint:'Full-width slider' },
                                { label:'Full Banner',       size:'1400×380px',  hint:'Homepage wide banner' },
                                { label:'Category Image',    size:'300×300px',   hint:'Square thumbnail' },
                                { label:'Category Banner',   size:'1400×280px',  hint:'Category page header' },
                                { label:'Product Image',     size:'800×800px',   hint:'Square, white background' },
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
                        <p className="text-[11.5px] text-gray-400 mt-4 pt-3 border-t border-gray-100">
                            Upload images for Hero Slides, Banners, Categories and Products in their own admin sections.
                        </p>
                    </div>

                    {/* Sticky save button on right col too */}
                    
                {/* ══ THEME COLORS ══════════════════════════════════════════ */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6">
                    <h3 className="font-black text-[15px] text-gray-800 mb-5 flex items-center gap-2">
                        🎨 Theme Colors & Style
                    </h3>

                    {/* Live mini preview */}
                    <div className="rounded-2xl overflow-hidden border border-gray-200 mb-5" style={{ fontSize: 0 }}>
                        {/* Topbar preview */}
                        <div className="flex items-center justify-between px-4 py-2" style={{ background: data.topbar_bg || '#0a0a0a' }}>
                            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 600 }}>+92 300 0000000</span>
                            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>Free delivery on orders over Rs 5,000</span>
                        </div>
                        {/* Nav preview */}
                        <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100">
                            <div className="font-black text-[14px]" style={{ color: data.theme_dark_bg || '#0a0a0a' }}>MILLIONAIRE</div>
                            <div className="flex-1" />
                            <div className="h-7 px-4 rounded-full text-white text-[11px] font-bold flex items-center" style={{ background: data.theme_primary || '#C9A84C' }}>Shop Now</div>
                        </div>
                        {/* Content preview */}
                        <div className="px-4 py-4" style={{ background: data.theme_body_bg || '#FAFAFA' }}>
                            <div className="flex gap-3">
                                <div className="rounded-xl overflow-hidden flex-shrink-0" style={{ width: 80, background: '#f0f0f0' }}>
                                    <div style={{ aspectRatio: '3/4', background: `linear-gradient(135deg, ${data.theme_primary || '#C9A84C'}22, ${data.theme_dark_bg || '#0a0a0a'}11)` }} />
                                    <div className="p-2" style={{ background: 'white' }}>
                                        <div className="text-[9px] font-bold" style={{ color: data.theme_primary || '#C9A84C' }}>CLOTHES</div>
                                        <div className="text-[10px] font-black" style={{ color: data.theme_dark_bg || '#0a0a0a' }}>Rs 4,500</div>
                                        <div className="mt-1 h-5 rounded flex items-center justify-center text-white text-[8px] font-bold" style={{ background: data.theme_dark_bg || '#0a0a0a' }}>Add to Cart</div>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[11px] font-black mb-2" style={{ color: data.theme_dark_bg || '#0a0a0a' }}>Live Preview</div>
                                    <div className="flex gap-1.5 flex-wrap">
                                        <span className="text-[9px] font-bold px-2 py-1 rounded-full text-white" style={{ background: data.theme_primary || '#C9A84C' }}>Primary</span>
                                        <span className="text-[9px] font-bold px-2 py-1 rounded-full text-white" style={{ background: data.theme_accent || '#C9A84C' }}>Accent</span>
                                        <span className="text-[9px] font-bold px-2 py-1 rounded-full text-white" style={{ background: data.theme_dark_bg || '#0a0a0a' }}>Dark</span>
                                    </div>
                                    <div className="mt-2 text-[9px] font-bold" style={{ color: '#6B7280' }}>Border radius: {data.theme_border_radius || 8}px</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Color pickers grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        {/* Topbar background */}
                        <div>
                            <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-2">Top Bar Background</label>
                            <div className="flex items-center gap-2">
                                <input type="color" value={data.topbar_bg || '#0a0a0a'}
                                    onChange={e => setData('topbar_bg', e.target.value)}
                                    className="h-10 w-14 rounded-xl border border-gray-200 cursor-pointer p-1 flex-shrink-0" />
                                <input className="flex-1 h-10 px-3 border border-gray-200 rounded-xl text-[13px] font-mono outline-none focus:border-[var(--color-primary)]"
                                    value={data.topbar_bg || '#0a0a0a'}
                                    onChange={e => setData('topbar_bg', e.target.value)}
                                    placeholder="#0a0a0a" />
                            </div>
                            <p className="text-[11px] text-gray-400 mt-1">The black announcement bar at very top</p>
                        </div>

                        {/* Primary color */}
                        <div>
                            <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-2">Primary Color (Gold)</label>
                            <div className="flex items-center gap-2">
                                <input type="color" value={data.theme_primary || '#C9A84C'}
                                    onChange={e => { setData('theme_primary', e.target.value) }}
                                    className="h-10 w-14 rounded-xl border border-gray-200 cursor-pointer p-1 flex-shrink-0" />
                                <input className="flex-1 h-10 px-3 border border-gray-200 rounded-xl text-[13px] font-mono outline-none focus:border-[var(--color-primary)]"
                                    value={data.theme_primary || '#C9A84C'}
                                    onChange={e => setData('theme_primary', e.target.value)}
                                    placeholder="#C9A84C" />
                            </div>
                            <p className="text-[11px] text-gray-400 mt-1">Buttons, links, accents, nav highlights</p>
                        </div>

                        {/* Accent color */}
                        <div>
                            <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-2">Accent Color (Sale badges)</label>
                            <div className="flex items-center gap-2">
                                <input type="color" value={data.theme_accent || '#C9A84C'}
                                    onChange={e => setData('theme_accent', e.target.value)}
                                    className="h-10 w-14 rounded-xl border border-gray-200 cursor-pointer p-1 flex-shrink-0" />
                                <input className="flex-1 h-10 px-3 border border-gray-200 rounded-xl text-[13px] font-mono outline-none focus:border-[var(--color-primary)]"
                                    value={data.theme_accent || '#C9A84C'}
                                    onChange={e => setData('theme_accent', e.target.value)}
                                    placeholder="#e91e63" />
                            </div>
                            <p className="text-[11px] text-gray-400 mt-1">Discount badges, sale labels, wishlist</p>
                        </div>

                        {/* Dark background */}
                        <div>
                            <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-2">Dark Background</label>
                            <div className="flex items-center gap-2">
                                <input type="color" value={data.theme_dark_bg || '#0a0a0a'}
                                    onChange={e => setData('theme_dark_bg', e.target.value)}
                                    className="h-10 w-14 rounded-xl border border-gray-200 cursor-pointer p-1 flex-shrink-0" />
                                <input className="flex-1 h-10 px-3 border border-gray-200 rounded-xl text-[13px] font-mono outline-none focus:border-[var(--color-primary)]"
                                    value={data.theme_dark_bg || '#0a0a0a'}
                                    onChange={e => setData('theme_dark_bg', e.target.value)}
                                    placeholder="#0a0a0a" />
                            </div>
                            <p className="text-[11px] text-gray-400 mt-1">Hero slider, Add to Cart button, headings</p>
                        </div>

                        {/* Body background */}
                        <div>
                            <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-2">Page Background</label>
                            <div className="flex items-center gap-2">
                                <input type="color" value={data.theme_body_bg || '#FAFAFA'}
                                    onChange={e => setData('theme_body_bg', e.target.value)}
                                    className="h-10 w-14 rounded-xl border border-gray-200 cursor-pointer p-1 flex-shrink-0" />
                                <input className="flex-1 h-10 px-3 border border-gray-200 rounded-xl text-[13px] font-mono outline-none focus:border-[var(--color-primary)]"
                                    value={data.theme_body_bg || '#FAFAFA'}
                                    onChange={e => setData('theme_body_bg', e.target.value)}
                                    placeholder="#FAFAFA" />
                            </div>
                            <p className="text-[11px] text-gray-400 mt-1">Main page/body background color</p>
                        </div>

                        {/* Border radius */}
                        <div>
                            <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-2">
                                Border Radius — {data.theme_border_radius || 8}px
                            </label>
                            <input type="range" min="0" max="24" value={data.theme_border_radius || '8'}
                                onChange={e => setData('theme_border_radius', e.target.value)}
                                className="w-full h-2 rounded-full accent-[var(--color-primary)] cursor-pointer" />
                            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                                <span>Sharp (0)</span>
                                <span>Rounded (12)</span>
                                <span>Pill (24)</span>
                            </div>
                            <div className="flex gap-2 mt-3">
                                {[0,4,8,12,16,24].map(r => (
                                    <button key={r} type="button"
                                        onClick={() => setData('theme_border_radius', String(r))}
                                        className="flex-1 h-8 text-[11px] font-bold cursor-pointer border transition-all"
                                        style={{
                                            borderRadius: r,
                                            background: Number(data.theme_border_radius) === r ? 'var(--color-primary)' : 'white',
                                            color: Number(data.theme_border_radius) === r ? 'var(--color-primary-text)' : '#6B7280',
                                            borderColor: Number(data.theme_border_radius) === r ? 'var(--color-primary)' : '#E5E7EB',
                                        }}>
                                        {r}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Preset themes */}
                        <div className="sm:col-span-2">
                            <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-3">Quick Presets</label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {[
                                    { name: 'Millionaire Gold', primary: '#C9A84C', dark: '#0a0a0a', body: '#FAFAFA', accent: '#C9A84C' },
                                    { name: 'Royal Black',      primary: '#ffffff', dark: '#000000', body: '#0a0a0a', accent: '#C9A84C' },
                                    { name: 'Deep Blue',        primary: '#3B82F6', dark: '#0f172a', body: '#F8FAFC', accent: '#EF4444' },
                                    { name: 'Forest Green',     primary: '#16A34A', dark: '#052e16', body: '#F0FDF4', accent: '#DC2626' },
                                ].map(preset => (
                                    <button key={preset.name} type="button"
                                        onClick={() => {
                                            setData('theme_primary', preset.primary)
                                            setData('theme_accent', preset.accent)
                                            setData('theme_dark_bg', preset.dark)
                                            setData('theme_body_bg', preset.body)
                                            setData('topbar_bg', preset.dark)
                                        }}
                                        className="p-3 rounded-xl border-2 border-gray-100 hover:border-gray-300 cursor-pointer text-left transition-all bg-white">
                                        <div className="flex gap-1.5 mb-2">
                                            <div className="w-5 h-5 rounded-full" style={{ background: preset.dark }} />
                                            <div className="w-5 h-5 rounded-full" style={{ background: preset.primary }} />
                                            <div className="w-5 h-5 rounded-full" style={{ background: preset.body, border: '1px solid #e5e7eb' }} />
                                        </div>
                                        <span className="text-[11px] font-bold text-gray-600">{preset.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

<div className="sticky top-20">
                        <button type="submit" disabled={processing}
                            className="w-full h-12 font-black text-[14px] rounded-xl border-none cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 transition-all hover:opacity-90"
                            style={{ background:'var(--color-primary)', color:'var(--color-primary-text)' }}>
                            <IconCheck size={18}/>
                            {processing ? 'Saving…' : 'Save Settings'}
                        </button>
                    </div>
                </div>
            </form>
        </AdminLayout>
    )
}
