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
    const ap = `/${_p.adminPath ?? 'ml-admin'}`

    const { data, setData, post, processing } = useForm<Record<string, any>>({
        site_name:            settings.site_name            ?? 'Tijar',
        site_tagline:         settings.site_tagline         ?? 'Your Online Store',
        phone:                settings.phone                ?? '',
        email:                settings.email                ?? '',
        admin_email:              settings.admin_email              ?? '',
        mail_host:                settings.mail_host                ?? '',
        mail_port:                settings.mail_port                ?? '587',
        mail_username:            settings.mail_username            ?? '',
        mail_password:            settings.mail_password            ?? '',
        mail_encryption:          settings.mail_encryption          ?? 'tls',
        mail_from_address:        settings.mail_from_address        ?? '',
        mail_from_name:           settings.mail_from_name           ?? '',
        email_notify_customer:    settings.email_notify_customer    ?? '1',
        email_notify_admin:       settings.email_notify_admin       ?? '1',
        email_notify_on:          settings.email_notify_on          ?? 'processing,shipped,delivered,cancelled',
        whatsapp_enabled:         settings.whatsapp_enabled         ?? '0',
        whatsapp_api_key:         settings.whatsapp_api_key         ?? '',
        whatsapp_phone_id:        settings.whatsapp_phone_id        ?? '',
        whatsapp_admin_phone:     settings.whatsapp_admin_phone     ?? '',
        whatsapp_notify_customer: settings.whatsapp_notify_customer ?? '1',
        whatsapp_notify_admin:    settings.whatsapp_notify_admin    ?? '1',
        whatsapp_notify_on:       settings.whatsapp_notify_on       ?? 'processing,shipped,delivered,cancelled',
        whatsapp_order_template:  settings.whatsapp_order_template  ?? '',
        whatsapp_ship_template:   settings.whatsapp_ship_template   ?? '',
        whatsapp_deliver_template:settings.whatsapp_deliver_template?? '',
        whatsapp_cancel_template: settings.whatsapp_cancel_template ?? '',
        sms_enabled:              settings.sms_enabled              ?? '0',
        sms_provider:             settings.sms_provider             ?? '',
        sms_api_key:              settings.sms_api_key              ?? '',
        sms_api_secret:           settings.sms_api_secret           ?? '',
        sms_api_url:              settings.sms_api_url              ?? '',
        sms_sender_id:            settings.sms_sender_id            ?? '',
        sms_notify_on:            settings.sms_notify_on            ?? '',
        address:              settings.address              ?? '',
        whatsapp_number:      settings.whatsapp_number      ?? '',
        shipping_fee:         settings.shipping_fee         ?? '0',
        delivery_threshold:      settings.delivery_threshold      ?? '0',
        low_stock_threshold:     settings.low_stock_threshold     ?? '5',
        new_arrival_days:        settings.new_arrival_days        ?? '30',
        loyalty_enabled:         settings.loyalty_enabled         ?? '1',
        loyalty_points_rate:     settings.loyalty_points_rate     ?? '10',
        loyalty_redeem_enabled:  settings.loyalty_redeem_enabled  ?? '1',
        loyalty_min_redeem:      settings.loyalty_min_redeem      ?? '100',
        login_max_attempts:      settings.login_max_attempts      ?? '5',
        login_lockout_minutes:   settings.login_lockout_minutes   ?? '15',
        admin_max_attempts:      settings.admin_max_attempts      ?? '3',
        admin_lockout_minutes:   settings.admin_lockout_minutes   ?? '30',
        admin_path:           settings.admin_path           ?? 'ml-admin',
        topbar_message:       settings.topbar_message       ?? '',
        sale_enabled:         settings.sale_enabled         ?? '0',
        sale_label:           settings.sale_label           ?? 'FLASH SALE',
        sale_badge:           settings.sale_badge           ?? 'UP TO 60% OFF',
        sale_ends_at:         settings.sale_ends_at         ?? '',
        sale_bg:              settings.sale_bg              ?? '#991B1B',
        sale_text_color:      settings.sale_text_color      ?? '#ffffff',
        sale_discount:        settings.sale_discount        ?? '',
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
                            <Field label="Low Stock Alert" hint="Warn admin when product stock falls to or below this number">
                                <input className={inputCls} type="number" min="0" value={data.low_stock_threshold} onChange={e => setData('low_stock_threshold', e.target.value)} placeholder="5" />
                            </Field>
                            <Field label="New Arrivals Window (days)" hint="Products added within N days show in New Arrivals">
                                <input className={inputCls} type="number" min="1" value={data.new_arrival_days} onChange={e => setData('new_arrival_days', e.target.value)} placeholder="30" />
                            </Field>
                            <div className="col-span-2 pt-3 pb-1 border-t border-gray-100">
                                <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider">🪙 Loyalty Points</p>
                            </div>
                            <Field label="Enable Loyalty Program">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" checked={data.loyalty_enabled === '1'} onChange={e => setData('loyalty_enabled', e.target.checked ? '1' : '0')} className="w-4 h-4 cursor-pointer" style={{ accentColor:'var(--color-primary)' }} />
                                    <span className="text-[13px] font-semibold">{data.loyalty_enabled === '1' ? '✅ Enabled' : '❌ Disabled'}</span>
                                </label>
                            </Field>
                            <Field label="Points Earning Rate" hint="1 point per Rs X spent. 100 pts = Rs 10 discount">
                                <div className="flex items-center gap-2">
                                    <span className="text-[13px] text-gray-500 whitespace-nowrap">1 pt per Rs</span>
                                    <input className={inputCls} type="number" min="1" value={data.loyalty_points_rate} onChange={e => setData('loyalty_points_rate', e.target.value)} placeholder="10" />
                                    <span className="text-[13px] text-gray-500 whitespace-nowrap">spent</span>
                                </div>
                            </Field>
                            <Field label="Allow Points Redemption at Checkout">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" checked={data.loyalty_redeem_enabled === '1'} onChange={e => setData('loyalty_redeem_enabled', e.target.checked ? '1' : '0')} className="w-4 h-4 cursor-pointer" style={{ accentColor:'var(--color-primary)' }} />
                                    <span className="text-[13px] font-semibold">{data.loyalty_redeem_enabled === '1' ? '✅ Allowed' : '❌ Disabled'}</span>
                                </label>
                            </Field>
                            <Field label="Minimum Points to Redeem">
                                <input className={inputCls} type="number" min="1" value={data.loyalty_min_redeem} onChange={e => setData('loyalty_min_redeem', e.target.value)} placeholder="100" />
                            </Field>
                            <div className="col-span-2 pt-3 pb-1 border-t border-gray-100">
                                <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider">🔒 Security</p>
                            </div>
                            <Field label="Customer Max Login Attempts">
                                <input className={inputCls} type="number" min="3" max="20" value={data.login_max_attempts} onChange={e => setData('login_max_attempts', e.target.value)} placeholder="5" />
                            </Field>
                            <Field label="Customer Lockout (minutes)">
                                <input className={inputCls} type="number" min="5" value={data.login_lockout_minutes} onChange={e => setData('login_lockout_minutes', e.target.value)} placeholder="15" />
                            </Field>
                            <Field label="Admin Max Login Attempts" hint="Recommended: 3">
                                <input className={inputCls} type="number" min="1" max="10" value={data.admin_max_attempts} onChange={e => setData('admin_max_attempts', e.target.value)} placeholder="3" />
                            </Field>
                            <Field label="Admin Lockout (minutes)" hint="Recommended: 30">
                                <input className={inputCls} type="number" min="5" value={data.admin_lockout_minutes} onChange={e => setData('admin_lockout_minutes', e.target.value)} placeholder="30" />
                            </Field>

                            {/* Security Settings */}
                            <div className="col-span-2 mt-2 mb-1">
                                <div className="text-[11px] font-black text-gray-400 uppercase tracking-wider">🔒 Security — Login Attempts</div>
                            </div>
                            <Field label="Customer Max Login Attempts" hint="Lock account after this many failed attempts (per 15 min window)">
                                <input className={inputCls} type="number" min="3" max="20" value={data.login_max_attempts} onChange={e => setData('login_max_attempts', e.target.value)} placeholder="5" />
                            </Field>
                            <Field label="Customer Lockout (minutes)" hint="How long to lock after max attempts">
                                <input className={inputCls} type="number" min="5" max="1440" value={data.login_lockout_minutes} onChange={e => setData('login_lockout_minutes', e.target.value)} placeholder="15" />
                            </Field>
                            <Field label="Admin Max Login Attempts" hint="Stricter limit for admin login (recommended: 3)">
                                <input className={inputCls} type="number" min="1" max="10" value={data.admin_max_attempts} onChange={e => setData('admin_max_attempts', e.target.value)} placeholder="3" />
                            </Field>
                            <Field label="Admin Lockout (minutes)" hint="How long to lock admin after max attempts (recommended: 30)">
                                <input className={inputCls} type="number" min="5" max="1440" value={data.admin_lockout_minutes} onChange={e => setData('admin_lockout_minutes', e.target.value)} placeholder="30" />
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
                        <Field label="Admin Path" hint={`Current: ${typeof window !== 'undefined' ? window.location.origin : ''}/${data.admin_path}`}>
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
                    <Section title="Email / SMTP Settings" icon="📧">
                        <div className="col-span-2 p-3 bg-blue-50 border border-blue-100 rounded-xl text-[12px] text-blue-700 mb-1">
                            Configure SMTP here — overrides .env. Leave blank to use .env settings.
                            Mailtrap: sandbox.smtp.mailtrap.io / port 2525 / TLS.
                            Gmail: enable 2FA → Google Account → App Passwords.
                        </div>
                        <Field label="SMTP Host">
                            <input className={inputCls} type="text" value={data.mail_host} onChange={e => setData('mail_host', e.target.value)} placeholder="sandbox.smtp.mailtrap.io" />
                        </Field>
                        <Field label="SMTP Port">
                            <input className={inputCls} type="number" value={data.mail_port} onChange={e => setData('mail_port', e.target.value)} placeholder="587" />
                        </Field>
                        <Field label="SMTP Username">
                            <input className={inputCls} type="text" value={data.mail_username} onChange={e => setData('mail_username', e.target.value)} placeholder="you@gmail.com" />
                        </Field>
                        <Field label="SMTP Password">
                            <input className={inputCls} type="password" value={data.mail_password} onChange={e => setData('mail_password', e.target.value)} placeholder="••••••••" />
                        </Field>
                        <Field label="Encryption">
                            <select className={inputCls} value={data.mail_encryption} onChange={e => setData('mail_encryption', e.target.value)}>
                                <option value="tls">TLS (recommended)</option>
                                <option value="ssl">SSL</option>
                                <option value="">None</option>
                            </select>
                        </Field>
                        <Field label="From Email">
                            <input className={inputCls} type="email" value={data.mail_from_address} onChange={e => setData('mail_from_address', e.target.value)} placeholder="noreply@millionaire.pk" />
                        </Field>
                        <Field label="From Name">
                            <input className={inputCls} type="text" value={data.mail_from_name} onChange={e => setData('mail_from_name', e.target.value)} placeholder="MILLIONAIRE" />
                        </Field>
                        <Field label="Admin Email" hint="Receives new order alerts">
                            <input className={inputCls} type="email" value={data.admin_email} onChange={e => setData('admin_email', e.target.value)} placeholder="admin@millionaire.pk" />
                        </Field>
                    </Section>

                    <Section title="Email Notification Rules" icon="✉️">
                        <Field label="Notify Customer">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={data.email_notify_customer === '1'} onChange={e => setData('email_notify_customer', e.target.checked ? '1' : '0')} className="w-4 h-4" style={{ accentColor:'var(--color-primary)' }} />
                                <span className="text-[13px]">Send email to customer on status change</span>
                            </label>
                        </Field>
                        <Field label="Notify Admin">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={data.email_notify_admin === '1'} onChange={e => setData('email_notify_admin', e.target.checked ? '1' : '0')} className="w-4 h-4" style={{ accentColor:'var(--color-primary)' }} />
                                <span className="text-[13px]">Send new order alert to admin</span>
                            </label>
                        </Field>
                        <Field label="Send Email On" hint="Comma separated statuses">
                            <input className={inputCls} type="text" value={data.email_notify_on} onChange={e => setData('email_notify_on', e.target.value)} placeholder="processing,shipped,delivered,cancelled" />
                        </Field>
                    </Section>

                    <Section title="WhatsApp Business API" icon="💬">
                        <div className="col-span-2 p-3 bg-green-50 border border-green-100 rounded-xl text-[12px] text-green-700 mb-1">
                            Get API Key &amp; Phone ID from developers.facebook.com → WhatsApp → API Setup. Free: 1,000 msgs/month.
                        </div>
                        <Field label="Enable WhatsApp">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={data.whatsapp_enabled === '1'} onChange={e => setData('whatsapp_enabled', e.target.checked ? '1' : '0')} className="w-4 h-4" style={{ accentColor:'var(--color-primary)' }} />
                                <span className="text-[13px]">{data.whatsapp_enabled === '1' ? '✅ Enabled' : '❌ Disabled'}</span>
                            </label>
                        </Field>
                        <Field label="Send WA On" hint="Comma separated statuses">
                            <input className={inputCls} type="text" value={data.whatsapp_notify_on} onChange={e => setData('whatsapp_notify_on', e.target.value)} placeholder="processing,shipped,delivered,cancelled" />
                        </Field>
                        <Field label="API Key (Access Token)">
                            <input className={inputCls} type="password" value={data.whatsapp_api_key} onChange={e => setData('whatsapp_api_key', e.target.value)} placeholder="EAAxxxxxxxxxxxxxxx" />
                        </Field>
                        <Field label="Phone Number ID">
                            <input className={inputCls} type="text" value={data.whatsapp_phone_id} onChange={e => setData('whatsapp_phone_id', e.target.value)} placeholder="1234567890123456" />
                        </Field>
                        <Field label="Admin WhatsApp Number" hint="With country code, no + (e.g. 923001234567)">
                            <input className={inputCls} type="text" value={data.whatsapp_admin_phone} onChange={e => setData('whatsapp_admin_phone', e.target.value)} placeholder="923001234567" />
                        </Field>
                        <Field label="Notify Customer">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={data.whatsapp_notify_customer === '1'} onChange={e => setData('whatsapp_notify_customer', e.target.checked ? '1' : '0')} className="w-4 h-4" style={{ accentColor:'var(--color-primary)' }} />
                                <span className="text-[13px]">WA message to customer on status change</span>
                            </label>
                        </Field>
                        <div className="col-span-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-1">
                            Message Templates — use: name, order_number, total, tracking_url in curly braces
                        </div>
                        <Field label="Order Placed Template">
                            <textarea className={inputCls} rows={2} value={data.whatsapp_order_template} onChange={e => setData('whatsapp_order_template', e.target.value)} placeholder="Hi {name}! Order {order_number} confirmed. Total: {total}. Track: {tracking_url}" />
                        </Field>
                        <Field label="Shipped Template">
                            <textarea className={inputCls} rows={2} value={data.whatsapp_ship_template} onChange={e => setData('whatsapp_ship_template', e.target.value)} placeholder="Hi {name}! Order {order_number} shipped! Track: {tracking_url}" />
                        </Field>
                        <Field label="Delivered Template">
                            <textarea className={inputCls} rows={2} value={data.whatsapp_deliver_template} onChange={e => setData('whatsapp_deliver_template', e.target.value)} placeholder="Hi {name}! Order {order_number} delivered. Thank you!" />
                        </Field>
                        <Field label="Cancelled Template">
                            <textarea className={inputCls} rows={2} value={data.whatsapp_cancel_template} onChange={e => setData('whatsapp_cancel_template', e.target.value)} placeholder="Hi {name}, order {order_number} was cancelled." />
                        </Field>
                    </Section>

                    <Section title="SMS API (Optional — Future Use)" icon="📱">
                        <div className="col-span-2 p-3 bg-gray-50 border border-gray-200 rounded-xl text-[12px] text-gray-500 mb-1">
                            Supports Twilio, eOcean Pakistan, Zong, Ufone or custom API. Leave blank to disable SMS.
                        </div>
                        <Field label="Enable SMS">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={data.sms_enabled === '1'} onChange={e => setData('sms_enabled', e.target.checked ? '1' : '0')} className="w-4 h-4" style={{ accentColor:'var(--color-primary)' }} />
                                <span className="text-[13px]">{data.sms_enabled === '1' ? '✅ Enabled' : '❌ Disabled'}</span>
                            </label>
                        </Field>
                        <Field label="Provider">
                            <select className={inputCls} value={data.sms_provider} onChange={e => setData('sms_provider', e.target.value)}>
                                <option value="">— Select Provider —</option>
                                <option value="twilio">Twilio (International)</option>
                                <option value="eocean">eOcean Pakistan</option>
                                <option value="zong">Zong (CMPAK)</option>
                                <option value="ufone">Ufone (PTML)</option>
                                <option value="custom">Custom API URL</option>
                            </select>
                        </Field>
                        <Field label="API Key">
                            <input className={inputCls} type="password" value={data.sms_api_key} onChange={e => setData('sms_api_key', e.target.value)} placeholder="API Key / Account SID" />
                        </Field>
                        <Field label="API Secret" hint="Twilio Auth Token">
                            <input className={inputCls} type="password" value={data.sms_api_secret} onChange={e => setData('sms_api_secret', e.target.value)} placeholder="Auth Token" />
                        </Field>
                        <Field label="Sender ID">
                            <input className={inputCls} type="text" value={data.sms_sender_id} onChange={e => setData('sms_sender_id', e.target.value)} placeholder="MILLIONAIRE" />
                        </Field>
                        <Field label="Send SMS On">
                            <input className={inputCls} type="text" value={data.sms_notify_on} onChange={e => setData('sms_notify_on', e.target.value)} placeholder="shipped,delivered" />
                        </Field>
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

                    <Section title="Flash Sale / Countdown Timer" icon="⚡">
                        <div className="col-span-2 p-3 bg-amber-50 border border-amber-100 rounded-xl text-[12px] text-amber-700 mb-1">
                            Show a countdown timer in the storefront header. Set end time and enable to activate.
                        </div>
                        <Field label="Enable Flash Sale Bar">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={data.sale_enabled === '1'} onChange={e => setData('sale_enabled', e.target.checked ? '1' : '0')} className="w-4 h-4" style={{ accentColor:'var(--color-primary)' }} />
                                <span className="text-[13px]">{data.sale_enabled === '1' ? '✅ Active' : '❌ Hidden'}</span>
                            </label>
                        </Field>
                        <Field label="Sale Label" hint="e.g. AZADI SALE, EID SPECIAL">
                            <input className={inputCls} type="text" value={data.sale_label} onChange={e => setData('sale_label', e.target.value)} placeholder="FLASH SALE" />
                        </Field>
                        <Field label="Badge Text" hint="e.g. UP TO 60% OFF">
                            <input className={inputCls} type="text" value={data.sale_badge} onChange={e => setData('sale_badge', e.target.value)} placeholder="UP TO 60% OFF" />
                        </Field>
                        <Field label="Sale Ends At">
                            <input className={inputCls} type="datetime-local" value={data.sale_ends_at} onChange={e => setData('sale_ends_at', e.target.value)} />
                        </Field>
                        <Field label="Sale Discount %" hint="e.g. 60 means all products show 60% OFF and prices are reduced by 60%">
                            <input className={inputCls} type="number" min="0" max="99" value={data.sale_discount} onChange={e => setData('sale_discount', e.target.value)} placeholder="e.g. 60" />
                        </Field>
                        <Field label="Bar Color">
                            <input type="color" value={data.sale_bg} onChange={e => setData('sale_bg', e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer border border-gray-200" />
                        </Field>
                        <Field label="Text Color">
                            <input type="color" value={data.sale_text_color} onChange={e => setData('sale_text_color', e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer border border-gray-200" />
                        </Field>
                    </Section>

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
