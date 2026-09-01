import { Head, usePage, useForm } from '@inertiajs/react'
import { IconCheck } from '@tabler/icons-react'
import AdminLayout from '@/Layouts/AdminLayout'

interface Props { settings: Record<string, string> }

// Same local-helper pattern as Settings.tsx (and every other admin settings
// page) — defined outside the component so they don't get recreated on
// every keystroke, which would unmount/remount inputs and cause them to
// lose focus while typing.
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

export default function Notifications({ settings }: Props) {
    const { props: _p } = usePage<{ adminPath?: string }>()
    const ap = `/${_p.adminPath ?? 'ml-admin'}`

    // Extracted verbatim from Settings.tsx — same field names, same
    // defaults, same backend endpoint. Splitting this into its own page
    // doesn't change what's actually saved, just where it's edited from.
    const { data, setData, post, processing } = useForm<Record<string, any>>({
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
        sms_sender_id:            settings.sms_sender_id            ?? '',
        sms_notify_on:            settings.sms_notify_on            ?? '',
    })

    function save(e: React.FormEvent) {
        e.preventDefault()
        post(`${ap}/settings`)
    }

    return (
        <AdminLayout title="Notifications">
            <Head title="Notifications — Admin" />
            <form onSubmit={save} className="space-y-5 max-w-3xl">

                <Section title="Email / SMTP Settings" icon="📧">
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-[12px] text-blue-700 mb-1">
                        Configure SMTP here — overrides .env. Leave blank to use .env settings.
                        Mailtrap: sandbox.smtp.mailtrap.io / port 2525 / TLS.
                        Gmail: enable 2FA → Google Account → App Passwords.
                    </div>
                    <div className="grid grid-cols-2 gap-4">
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
                    </div>
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
                    <div className="p-3 bg-green-50 border border-green-100 rounded-xl text-[12px] text-green-700 mb-1">
                        Get API Key &amp; Phone ID from developers.facebook.com → WhatsApp → API Setup. Free: 1,000 msgs/month.
                    </div>
                    <div className="grid grid-cols-2 gap-4">
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
                    </div>
                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-1">
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

                <Section title="SMS API (Optional)" icon="📱">
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-[12px] text-gray-500 mb-1">
                        Supports Twilio, eOcean Pakistan, Zong, Ufone or custom API. Leave blank to disable SMS.
                    </div>
                    <div className="grid grid-cols-2 gap-4">
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
                    </div>
                </Section>

                <button type="submit" disabled={processing}
                    className="w-full h-14 font-black text-[15px] rounded-xl border-none cursor-pointer disabled:opacity-60 flex items-center justify-center gap-3 transition-all hover:opacity-90"
                    style={{ background:'var(--color-primary)', color:'var(--color-primary-text)' }}>
                    <IconCheck size={20}/>
                    {processing ? 'Saving…' : 'Save Notification Settings'}
                </button>
            </form>
        </AdminLayout>
    )
}
