import { Head, useForm, usePage } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import { IconBrandWhatsapp, IconCheck, IconExternalLink, IconPhone, IconMessage, IconSettings, IconBell } from '@tabler/icons-react'

interface Props {
    settings: Record<string, string>
    stats: { orders_today: number; messages_sent: number }
}

export default function WhatsAppSettings({ settings, stats }: Props) {
    const { props } = usePage<any>()
    const ap = `/${props.adminPath ?? 'ml-admin'}`

    const { data, setData, post, processing } = useForm({
        // Basic
        whatsapp_number:          settings.whatsapp_number          ?? '',
        whatsapp_business_name:   settings.whatsapp_business_name   ?? '',
        show_whatsapp_button:     settings.show_whatsapp_button      ?? '1',
        whatsapp_button_position: settings.whatsapp_button_position  ?? 'bottom_right',

        // Chat Widget
        whatsapp_greeting:        settings.whatsapp_greeting         ?? 'Hi! Welcome to MILLIONAIRE. How can we help you?',
        whatsapp_away_message:    settings.whatsapp_away_message     ?? 'We are currently away. We will reply within 24 hours.',
        whatsapp_response_time:   settings.whatsapp_response_time    ?? 'Typically replies within 1 hour',

        // Business Hours
        whatsapp_hours_enabled:   settings.whatsapp_hours_enabled    ?? '0',
        whatsapp_hours_open:      settings.whatsapp_hours_open       ?? '09:00',
        whatsapp_hours_close:     settings.whatsapp_hours_close      ?? '22:00',
        whatsapp_hours_days:      settings.whatsapp_hours_days       ?? 'Mon-Sat',

        // Order Notifications
        whatsapp_order_notify:    settings.whatsapp_order_notify     ?? '0',
        whatsapp_order_template:  settings.whatsapp_order_template   ?? 'Hi {name}, your order #{order_id} has been placed successfully! Total: Rs {total}. We will process it shortly. - MILLIONAIRE',
        whatsapp_ship_template:   settings.whatsapp_ship_template    ?? 'Hi {name}, great news! Your order #{order_id} has been shipped. Track it here: {tracking_url} - MILLIONAIRE',
        whatsapp_deliver_template:settings.whatsapp_deliver_template ?? 'Hi {name}, your order #{order_id} has been delivered! We hope you love your MILLIONAIRE purchase. - MILLIONAIRE',

        // Product Page
        product_contact_method:   settings.product_contact_method    ?? 'whatsapp',
        whatsapp_product_msg:     settings.whatsapp_product_msg      ?? 'Hi! I am interested in: {product_name} (Rs {price}). Can you provide more details?',

        // API (optional — for automated messages)
        whatsapp_api_key:         settings.whatsapp_api_key          ?? '',
        whatsapp_phone_id:        settings.whatsapp_phone_id         ?? '',
    })

    function save(e: React.FormEvent) {
        e.preventDefault()
        post(`${ap}/settings`)
    }

    const inputCls = "w-full h-10 px-3.5 rounded-xl border border-gray-200 text-[13.5px] focus:outline-none focus:ring-2 focus:border-transparent bg-white"
    const textareaCls = "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-[13.5px] focus:outline-none focus:ring-2 focus:border-transparent bg-white resize-none"
    const labelCls = "block text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-1.5"

    const waLink = data.whatsapp_number
        ? `https://wa.me/${data.whatsapp_number.replace(/\D/g, '')}?text=${encodeURIComponent(data.whatsapp_greeting)}`
        : '#'

    return (
        <AdminLayout title="WhatsApp Integration">
            <Head title="WhatsApp Integration" />

            <form onSubmit={save}>
                <div className="space-y-5 max-w-3xl">

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { label: 'WhatsApp Number', value: data.whatsapp_number || 'Not set', icon: '📱' },
                            { label: 'Orders Today',    value: stats.orders_today,                icon: '🛍️' },
                            { label: 'Button Status',   value: data.show_whatsapp_button === '1' ? '✅ Active' : '❌ Hidden', icon: '💬' },
                        ].map(s => (
                            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4">
                                <div className="text-2xl mb-2">{s.icon}</div>
                                <p className="font-black text-[16px] text-gray-800">{s.value}</p>
                                <p className="text-[11.5px] text-gray-400 mt-0.5">{s.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Basic Setup */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-5">
                        <div className="flex items-center gap-2 mb-5">
                            <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center">
                                <IconPhone size={18} className="text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-[15px] text-gray-800">Basic Setup</h3>
                                <p className="text-[12px] text-gray-400">Your WhatsApp business number and display settings</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelCls}>WhatsApp Number *</label>
                                <input className={inputCls} value={data.whatsapp_number}
                                    onChange={e => setData('whatsapp_number', e.target.value)}
                                    placeholder="923001234567 (with country code, no +)" />
                                <p className="text-[11px] text-gray-400 mt-1">Include country code. No spaces, dashes or +</p>
                            </div>
                            <div>
                                <label className={labelCls}>Business Name</label>
                                <input className={inputCls} value={data.whatsapp_business_name}
                                    onChange={e => setData('whatsapp_business_name', e.target.value)}
                                    placeholder="MILLIONAIRE" />
                            </div>
                            <div>
                                <label className={labelCls}>Button Position</label>
                                <select className={inputCls} value={data.whatsapp_button_position}
                                    onChange={e => setData('whatsapp_button_position', e.target.value)}>
                                    <option value="bottom_right">Bottom Right</option>
                                    <option value="bottom_left">Bottom Left</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelCls}>Show WhatsApp Button</label>
                                <select className={inputCls} value={data.show_whatsapp_button}
                                    onChange={e => setData('show_whatsapp_button', e.target.value)}>
                                    <option value="1">✅ Show on all pages</option>
                                    <option value="0">❌ Hide</option>
                                </select>
                            </div>
                        </div>

                        {data.whatsapp_number && (
                            <a href={waLink} target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 mt-4 text-[12.5px] font-bold text-white bg-[#25D366] px-4 py-2 rounded-xl no-underline hover:opacity-90 transition-opacity">
                                <IconBrandWhatsapp size={15} /> Test This Number
                                <IconExternalLink size={12} />
                            </a>
                        )}
                    </div>

                    {/* Chat Widget Messages */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-5">
                        <div className="flex items-center gap-2 mb-5">
                            <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
                                <IconMessage size={18} className="text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-[15px] text-gray-800">Chat Messages</h3>
                                <p className="text-[12px] text-gray-400">What customers see when they click WhatsApp</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className={labelCls}>Greeting Message</label>
                                <textarea className={textareaCls} rows={2} value={data.whatsapp_greeting}
                                    onChange={e => setData('whatsapp_greeting', e.target.value)}
                                    placeholder="Hi! Welcome to MILLIONAIRE. How can we help?" />
                                <p className="text-[11px] text-gray-400 mt-1">This pre-fills the WhatsApp message box</p>
                            </div>
                            <div>
                                <label className={labelCls}>Response Time Label</label>
                                <input className={inputCls} value={data.whatsapp_response_time}
                                    onChange={e => setData('whatsapp_response_time', e.target.value)}
                                    placeholder="Typically replies within 1 hour" />
                            </div>
                        </div>
                    </div>

                    {/* Business Hours */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
                                    <IconSettings size={18} className="text-amber-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[15px] text-gray-800">Business Hours</h3>
                                    <p className="text-[12px] text-gray-400">Show away message outside working hours</p>
                                </div>
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={data.whatsapp_hours_enabled === '1'}
                                    onChange={e => setData('whatsapp_hours_enabled', e.target.checked ? '1' : '0')}
                                    className="w-4 h-4 rounded" />
                                <span className="text-[13px] font-semibold text-gray-600">Enable</span>
                            </label>
                        </div>

                        {data.whatsapp_hours_enabled === '1' && (
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className={labelCls}>Working Days</label>
                                    <input className={inputCls} value={data.whatsapp_hours_days}
                                        onChange={e => setData('whatsapp_hours_days', e.target.value)}
                                        placeholder="Mon-Sat" />
                                </div>
                                <div>
                                    <label className={labelCls}>Open Time</label>
                                    <input type="time" className={inputCls} value={data.whatsapp_hours_open}
                                        onChange={e => setData('whatsapp_hours_open', e.target.value)} />
                                </div>
                                <div>
                                    <label className={labelCls}>Close Time</label>
                                    <input type="time" className={inputCls} value={data.whatsapp_hours_close}
                                        onChange={e => setData('whatsapp_hours_close', e.target.value)} />
                                </div>
                                <div className="col-span-3">
                                    <label className={labelCls}>Away Message</label>
                                    <textarea className={textareaCls} rows={2} value={data.whatsapp_away_message}
                                        onChange={e => setData('whatsapp_away_message', e.target.value)} />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Order Notifications Templates */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center">
                                    <IconBell size={18} className="text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[15px] text-gray-800">Order Notification Templates</h3>
                                    <p className="text-[12px] text-gray-400">Messages sent to customers for order updates</p>
                                </div>
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={data.whatsapp_order_notify === '1'}
                                    onChange={e => setData('whatsapp_order_notify', e.target.checked ? '1' : '0')}
                                    className="w-4 h-4 rounded" />
                                <span className="text-[13px] font-semibold text-gray-600">Enable</span>
                            </label>
                        </div>

                        {/* Variables reference */}
                        <div className="bg-gray-50 rounded-xl p-3 mb-4">
                            <p className="text-[11.5px] font-bold text-gray-500 mb-2">Available Variables:</p>
                            <div className="flex flex-wrap gap-2">
                                {['{name}','{order_id}','{total}','{tracking_url}','{status}','{items}'].map(v => (
                                    <code key={v} className="text-[11px] bg-white border border-gray-200 px-2 py-0.5 rounded-lg font-mono text-gray-600">{v}</code>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className={labelCls}>📦 Order Placed Template</label>
                                <textarea className={textareaCls} rows={3} value={data.whatsapp_order_template}
                                    onChange={e => setData('whatsapp_order_template', e.target.value)} />
                            </div>
                            <div>
                                <label className={labelCls}>🚚 Order Shipped Template</label>
                                <textarea className={textareaCls} rows={3} value={data.whatsapp_ship_template}
                                    onChange={e => setData('whatsapp_ship_template', e.target.value)} />
                            </div>
                            <div>
                                <label className={labelCls}>✅ Order Delivered Template</label>
                                <textarea className={textareaCls} rows={3} value={data.whatsapp_deliver_template}
                                    onChange={e => setData('whatsapp_deliver_template', e.target.value)} />
                            </div>
                        </div>
                    </div>

                    {/* Product Page Message */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center">
                                <IconBrandWhatsapp size={18} className="text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-[15px] text-gray-800">Product Page Message</h3>
                                <p className="text-[12px] text-gray-400">Pre-filled message when customer clicks WhatsApp on product page</p>
                            </div>
                        </div>
                        <div>
                            <label className={labelCls}>Product Inquiry Template</label>
                            <textarea className={textareaCls} rows={3} value={data.whatsapp_product_msg}
                                onChange={e => setData('whatsapp_product_msg', e.target.value)} />
                            <p className="text-[11px] text-gray-400 mt-1">Use {'{product_name}'} and {'{price}'} as variables</p>
                        </div>
                    </div>

                    {/* WhatsApp Business API (Advanced) */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
                                <IconSettings size={18} className="text-gray-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-[15px] text-gray-800">WhatsApp Business API <span className="text-[11px] font-normal text-gray-400 ml-2">(Optional — for automated messages)</span></h3>
                                <p className="text-[12px] text-gray-400">Required only for sending automated order notifications</p>
                            </div>
                        </div>

                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
                            <p className="text-[12px] font-semibold text-amber-700">
                                💡 Without API keys — customers click WhatsApp button and manually send message. With API keys — automated order notifications are sent automatically.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelCls}>API Key (from Meta Developer Portal)</label>
                                <input type="password" className={inputCls} value={data.whatsapp_api_key}
                                    onChange={e => setData('whatsapp_api_key', e.target.value)}
                                    placeholder="EAAxxxxxx..." />
                            </div>
                            <div>
                                <label className={labelCls}>Phone Number ID</label>
                                <input className={inputCls} value={data.whatsapp_phone_id}
                                    onChange={e => setData('whatsapp_phone_id', e.target.value)}
                                    placeholder="1234567890" />
                            </div>
                        </div>

                        <a href="https://developers.facebook.com/apps" target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 mt-3 text-[12px] font-semibold text-blue-600 no-underline hover:underline">
                            <IconExternalLink size={13} /> Get API keys from Meta Business Suite →
                        </a>
                    </div>

                    {/* Save Button */}
                    <div className="flex items-center gap-3">
                        <button type="submit" disabled={processing}
                            className="flex items-center gap-2 h-11 px-8 rounded-xl font-bold text-[14px] disabled:opacity-60 cursor-pointer border-none transition-all hover:opacity-90"
                            style={{ background: 'var(--color-primary)', color: 'var(--color-primary-text)' }}>
                            {processing ? 'Saving...' : <><IconCheck size={16} /> Save WhatsApp Settings</>}
                        </button>
                        {props.flash?.success && (
                            <span className="flex items-center gap-1.5 text-[13px] font-semibold text-green-600">
                                <IconCheck size={15} /> {props.flash.success}
                            </span>
                        )}
                    </div>

                </div>
            </form>
        </AdminLayout>
    )
}
