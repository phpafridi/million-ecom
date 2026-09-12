import { Head, usePage, useForm } from '@inertiajs/react'
import { IconCheck } from '@tabler/icons-react'
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
// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
export default function Settings({ settings }: Props) {
    const { props: _p } = usePage<{ adminPath?: string }>()
    const ap = `/${_p.adminPath ?? 'ml-admin'}`

    const { data, setData, post, processing } = useForm<Record<string, any>>({
        site_name:            settings.site_name            ?? 'Millionaire',
        site_tagline:         settings.site_tagline         ?? 'Your Online Store',
        phone:                settings.phone                ?? '',
        email:                settings.email                ?? '',
        address:              settings.address              ?? '',
        whatsapp_number:      settings.whatsapp_number      ?? '',
        // Was only configurable from a separate, now-removed page and
        // never actually saved (missing from the backend whitelist) —
        // consolidated here since this is the one field from that page
        // that's genuinely read elsewhere (the product page's "Ask on
        // WhatsApp" message).
        whatsapp_product_msg: settings.whatsapp_product_msg ?? 'Hi! I am interested in: {product_name} (Rs {price}). Can you provide more details?',
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
        facebook_url:         settings.facebook_url         ?? '',
        instagram_url:        settings.instagram_url        ?? '',
        twitter_url:          settings.twitter_url          ?? '',
        youtube_url:          settings.youtube_url          ?? '',
        messenger_url:        settings.messenger_url        ?? '',
        // meta_title/meta_description removed — now exclusively managed on
        // the dedicated SEO page. Leaving these in this form's data object
        // would submit empty values on every Settings save and silently
        // overwrite whatever was set via the SEO page, since both forms
        // post to the same backend endpoint.
        product_contact_method: settings.product_contact_method ?? 'whatsapp',
        show_whatsapp_button:   settings.show_whatsapp_button   ?? '1',
        show_phone_button:      settings.show_phone_button      ?? '1',
    })

    function save(e: React.FormEvent) {
        e.preventDefault()
        post(`${ap}/settings`)
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
                                <input className={inputCls} value={data.site_name}  onChange={e => setData('site_name', e.target.value)} placeholder="Our Store" />
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
                        <Field label="Product Inquiry Message" hint="Pre-filled message when a customer asks about a specific product on WhatsApp. Use {product_name} and {price} as placeholders.">
                            <textarea className={textareaCls} rows={2} value={data.whatsapp_product_msg} onChange={e => setData('whatsapp_product_msg', e.target.value)} placeholder="Hi! I am interested in: {product_name} (Rs {price}). Can you provide more details?" />
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
                                <input className={inputCls + ' rounded-l-none'} value={data.admin_path} onChange={e => setData('admin_path', e.target.value.replace(/[^a-z0-9-]/g,'').toLowerCase())} placeholder="million-admin" />
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

                    {/* SEO section removed — was a bare-bones duplicate
                        (just title + description, no character counters, no
                        favicon/OG image, no indexing toggle, no keywords)
                        competing with the dedicated SEO page, which is
                        genuinely more complete. Use Admin → SEO instead. */}

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
