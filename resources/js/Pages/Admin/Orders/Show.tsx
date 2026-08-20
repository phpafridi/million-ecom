import { Head, Link, router, useForm, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { IconArrowLeft, IconPhone, IconMail, IconMapPin, IconCreditCard, IconCheck, IconRefresh } from '@tabler/icons-react'
import AdminLayout from '@/Layouts/AdminLayout'

interface OrderItem { id: number; product_id: number; product_name: string; quantity: number; price: number; subtotal: number }
interface OrderReturn { id: number; quantity: number; reason: string; status: string; refund_amount: number; refund_method: string; created_at: string }
interface Order {
    id: number; customer_name: string; customer_phone: string; customer_email: string | null
    customer_address: string; payment_method: string; payment_status: string; status: string
    return_status: string | null; notes: string | null; payment_proof: string | null
    subtotal: number; shipping: number; total: number; created_at: string
    items: OrderItem[]; returns: OrderReturn[]
}
interface Props { order: Order }

const STATUS = ['pending','processing','shipped','delivered','cancelled']
const PAY_STATUS = ['pending','paid','failed','refunded']
const STATUS_COLORS: Record<string, string> = {
    pending:'bg-amber-50 text-amber-700 border-amber-200',
    processing:'bg-blue-50 text-blue-700 border-blue-200',
    shipped:'bg-purple-50 text-purple-700 border-purple-200',
    delivered:'bg-green-50 text-green-700 border-green-200',
    cancelled:'bg-red-50 text-red-600 border-red-200',
}

export default function OrderShow({ order }: Props) {
    const { props: pageProps } = usePage<{ adminPath?: string }>()
    const ap = `/${pageProps.adminPath ?? 'tijar-admin'}`
    const [showReturn, setShowReturn] = useState(false)
    const fmt = (n: number) => `Rs ${Number(n).toLocaleString('en-PK')}`

    const { data: retData, setData: setRetData, post: postReturn, processing: retProcessing } = useForm({
        order_item_id: order.items[0]?.id ?? '',
        quantity:      1,
        reason:        '',
        notes:         '',
        refund_method: 'original',
        refund_amount: 0,
        restock:       true,
    })

    function updateStatus(field: string, value: string) {
        router.patch(`${ap}/orders/${order.id}`, { [field]: value }, { preserveScroll: true })
    }

    function submitReturn(e: React.FormEvent) {
        e.preventDefault()
        postReturn(`${ap}/orders/${order.id}/return`, { onSuccess: () => setShowReturn(false) })
    }

    // Auto-calculate refund amount when item changes
    function onItemChange(itemId: string) {
        setRetData('order_item_id', itemId)
        const item = order.items.find(i => i.id === +itemId)
        if (item) setRetData('refund_amount', item.price * retData.quantity)
    }

    return (
        <AdminLayout title={`Order #${order.id}`}>
            <Head title={`Order #${order.id}`}/>

            <div className="flex items-center gap-3 mb-5">
                <Link href={`${ap}/orders`} className="flex items-center gap-2 text-[13px] font-semibold text-gray-500 hover:text-[var(--color-primary)] no-underline">
                    <IconArrowLeft size={15}/> All Orders
                </Link>
                <a href={`${ap}/orders/${order.id}/invoice`} target="_blank"
                    className="ml-auto flex items-center gap-2 h-9 px-4 border border-gray-200 rounded-xl text-[12.5px] font-bold text-gray-600 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] no-underline bg-white transition-colors">
                    🖨️ Invoice / Print
                </a>
                <span className={`ml-auto text-[12px] font-bold px-3 py-1.5 rounded-full border capitalize ${STATUS_COLORS[order.status]}`}>{order.status}</span>
                {order.return_status && <span className="text-[12px] font-bold px-3 py-1.5 rounded-full border bg-orange-50 text-orange-600 border-orange-200">{order.return_status}</span>}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2 space-y-5">

                    {/* Items */}
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-manrope font-bold text-[15px]">Order Items</h3>
                            <span className="text-[12px] text-gray-400">{order.items.length} item(s)</span>
                        </div>
                        <table className="w-full">
                            <thead><tr className="bg-gray-50 border-b border-gray-100">
                                {['Product','Qty','Unit Price','Subtotal'].map(h => (
                                    <th key={h} className="text-left text-[11px] font-black text-gray-400 uppercase px-5 py-3">{h}</th>
                                ))}
                            </tr></thead>
                            <tbody>
                                {order.items.map(item => (
                                    <tr key={item.id} className="border-b border-gray-50 last:border-0">
                                        <td className="px-5 py-3.5 font-medium text-[13px] text-gray-900">{item.product_name}</td>
                                        <td className="px-5 py-3.5 text-[13px] text-gray-600">{item.quantity}</td>
                                        <td className="px-5 py-3.5 text-[13px] text-gray-600">{fmt(item.price)}</td>
                                        <td className="px-5 py-3.5 font-semibold text-[13px]" style={{ color:'var(--color-dark-bg)' }}>{fmt(item.subtotal)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="px-5 py-4 border-t border-gray-100 space-y-2">
                            <div className="flex justify-between text-[13px] text-gray-600"><span>Subtotal</span><span>{fmt(order.subtotal)}</span></div>
                            <div className="flex justify-between text-[13px] text-gray-600"><span>Shipping</span><span>{order.shipping > 0 ? fmt(order.shipping) : 'Free'}</span></div>
                            <div className="flex justify-between text-[15px] font-black pt-2 border-t border-gray-100">
                                <span>Total</span><span style={{ color:'var(--color-primary)' }}>{fmt(order.total)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Update status */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-5">
                        <h3 className="font-manrope font-bold text-[15px] mb-4">Update Status</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Order Status</p>
                                <div className="flex flex-wrap gap-2">
                                    {STATUS.map(s => (
                                        <button key={s} onClick={() => updateStatus('status', s)}
                                            className={`px-4 py-2 rounded-xl text-[12.5px] font-semibold border transition-all cursor-pointer capitalize
                                                ${order.status === s ? 'text-white border-transparent' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}
                                            style={order.status === s ? { background:'var(--color-primary)' } : {}}>
                                            {order.status === s && '✓ '}{s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Payment Status</p>
                                <div className="flex flex-wrap gap-2">
                                    {PAY_STATUS.map(s => (
                                        <button key={s} onClick={() => updateStatus('payment_status', s)}
                                            className={`px-4 py-2 rounded-xl text-[12.5px] font-semibold border transition-all cursor-pointer capitalize
                                                ${order.payment_status === s ? 'text-white border-transparent' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}
                                            style={order.payment_status === s ? { background:'var(--color-primary)' } : {}}>
                                            {order.payment_status === s && '✓ '}{s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Returns */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-manrope font-bold text-[15px] flex items-center gap-2">
                                <IconRefresh size={17} style={{ color:'var(--color-primary)' }}/> Returns & Refunds
                            </h3>
                            {order.status === 'delivered' && (
                                <button onClick={() => setShowReturn(!showReturn)}
                                    className="h-9 px-4 text-[12.5px] font-bold rounded-xl border-2 cursor-pointer transition-all bg-white"
                                    style={{ borderColor:'var(--color-primary)', color:'var(--color-primary)' }}>
                                    {showReturn ? 'Cancel' : '+ Process Return'}
                                </button>
                            )}
                        </div>

                        {showReturn && (
                            <form onSubmit={submitReturn} className="mb-5 p-4 bg-orange-50 border border-orange-200 rounded-xl space-y-3">
                                <h4 className="font-bold text-[14px] text-orange-800">Process Return</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[12px] font-semibold text-gray-700 mb-1">Item to Return</label>
                                        <select value={retData.order_item_id} onChange={e => onItemChange(e.target.value)}
                                            className="w-full h-10 px-3 border border-gray-200 rounded-xl text-[13px] outline-none bg-white">
                                            {order.items.map(i => <option key={i.id} value={i.id}>{i.product_name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[12px] font-semibold text-gray-700 mb-1">Quantity</label>
                                        <input type="number" value={retData.quantity} min="1"
                                            onChange={e => { setRetData('quantity', +e.target.value); const item = order.items.find(i => i.id === +retData.order_item_id); if (item) setRetData('refund_amount', item.price * +e.target.value) }}
                                            className="w-full h-10 px-3 border border-gray-200 rounded-xl text-[13px] outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-[12px] font-semibold text-gray-700 mb-1">Reason</label>
                                        <input value={retData.reason} onChange={e => setRetData('reason', e.target.value)} required
                                            placeholder="Damaged, wrong item, size issue…"
                                            className="w-full h-10 px-3 border border-gray-200 rounded-xl text-[13px] outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-[12px] font-semibold text-gray-700 mb-1">Refund Method</label>
                                        <select value={retData.refund_method} onChange={e => setRetData('refund_method', e.target.value)}
                                            className="w-full h-10 px-3 border border-gray-200 rounded-xl text-[13px] outline-none bg-white">
                                            <option value="original">Original Payment Method</option>
                                            <option value="cash">Cash Refund</option>
                                            <option value="store_credit">Store Credit</option>
                                            <option value="none">No Refund</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[12px] font-semibold text-gray-700 mb-1">Refund Amount (Rs)</label>
                                        <input type="number" value={retData.refund_amount} min="0"
                                            onChange={e => setRetData('refund_amount', +e.target.value)}
                                            className="w-full h-10 px-3 border border-gray-200 rounded-xl text-[13px] outline-none" />
                                    </div>
                                    <div className="flex items-center gap-3 pt-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" checked={retData.restock} onChange={e => setRetData('restock', e.target.checked)} className="w-4 h-4"/>
                                            <span className="text-[13px] font-semibold text-gray-700">Return to inventory</span>
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[12px] font-semibold text-gray-700 mb-1">Internal Notes</label>
                                    <textarea value={retData.notes} onChange={e => setRetData('notes', e.target.value)} rows={2}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-[13px] outline-none resize-none"/>
                                </div>
                                <button type="submit" disabled={retProcessing}
                                    className="h-10 px-6 font-black text-[13px] rounded-xl border-none cursor-pointer disabled:opacity-60 text-white"
                                    style={{ background:'#f97316' }}>
                                    {retProcessing ? 'Processing…' : 'Confirm Return & Refund'}
                                </button>
                            </form>
                        )}

                        {order.returns.length > 0 ? (
                            <div className="space-y-2">
                                {order.returns.map(r => (
                                    <div key={r.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl text-[12.5px]">
                                        <span className="px-2 py-0.5 rounded-full font-bold bg-orange-100 text-orange-700">{r.status}</span>
                                        <span className="text-gray-700">{r.reason}</span>
                                        <span className="text-gray-500">{r.quantity} unit(s)</span>
                                        <span className="font-bold ml-auto" style={{ color:'var(--color-primary)' }}>Rs {r.refund_amount.toLocaleString()} refund</span>
                                        <span className="text-gray-400">{new Date(r.created_at).toLocaleDateString()}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-[13px] text-gray-400">No returns for this order.{order.status !== 'delivered' ? ' Returns can be processed once order is delivered.' : ''}</p>
                        )}
                    </div>

                    {order.notes && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                            <div className="text-[12px] font-black text-amber-700 uppercase tracking-wider mb-1">Notes</div>
                            <p className="text-[13px] text-amber-800">{order.notes}</p>
                        </div>
                    )}
                </div>

                {/* Right: customer + payment */}
                <div className="space-y-4">
                    <div className="bg-white rounded-2xl border border-gray-100 p-5">
                        <h3 className="font-manrope font-bold text-[15px] mb-4">Customer</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-[14px] text-white"
                                    style={{ background:'var(--color-primary)' }}>{order.customer_name[0]?.toUpperCase()}</div>
                                <div>
                                    <div className="font-semibold text-[13.5px]">{order.customer_name}</div>
                                </div>
                            </div>
                            <a href={`tel:${order.customer_phone}`} className="flex items-center gap-2.5 text-[13px] text-gray-600 hover:text-[var(--color-primary)] no-underline">
                                <IconPhone size={15} className="text-gray-400"/> {order.customer_phone}
                            </a>
                            {order.customer_email && (
                                <a href={`mailto:${order.customer_email}`} className="flex items-center gap-2.5 text-[13px] text-gray-600 no-underline">
                                    <IconMail size={15} className="text-gray-400"/> {order.customer_email}
                                </a>
                            )}
                            <div className="flex items-start gap-2.5 text-[13px] text-gray-600">
                                <IconMapPin size={15} className="text-gray-400 mt-0.5 flex-shrink-0"/> {order.customer_address}
                            </div>
                            <a href={`https://wa.me/${order.customer_phone}`} target="_blank" rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full h-9 rounded-xl bg-[#25D366] text-white font-bold text-[13px] no-underline hover:bg-[#1da853] transition-colors">
                                💬 WhatsApp Customer
                            </a>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 p-5">
                        <h3 className="font-manrope font-bold text-[15px] mb-3">Payment</h3>
                        <div className="flex items-center gap-2.5 mb-3">
                            <IconCreditCard size={18} className="text-gray-400"/>
                            <div>
                                <div className="text-[13px] font-semibold capitalize">{order.payment_method.replace(/_/g,' ')}</div>
                                <div className={`text-[11.5px] font-bold capitalize ${order.payment_status === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>{order.payment_status}</div>
                            </div>
                        </div>
                        {order.payment_proof && (
                            <div>
                                <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider mb-2">Payment Receipt</p>
                                <a href={order.payment_proof} target="_blank" rel="noopener noreferrer" className="block no-underline">
                                    <img src={order.payment_proof} alt="Payment proof"
                                        className="w-full max-h-48 object-contain rounded-xl border border-gray-200 bg-gray-50 hover:opacity-90 transition-opacity cursor-zoom-in"/>
                                    <p className="text-[11.5px] text-[var(--color-primary)] mt-1 text-center">Click to view full size</p>
                                </a>
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 p-4">
                        <div className="text-[11px] font-black text-gray-400 uppercase mb-1">Placed</div>
                        <div className="text-[13px] text-gray-700">{new Date(order.created_at).toLocaleString('en-PK', { day:'numeric', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit' })}</div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
