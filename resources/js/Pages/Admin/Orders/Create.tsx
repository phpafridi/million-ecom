import { Head, Link, useForm, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { IconArrowLeft, IconPlus, IconTrash, IconCheck, IconSearch } from '@tabler/icons-react'
import AdminLayout from '@/Layouts/AdminLayout'

interface Product { id: number; name: string; price: number; stock: number; product_images: {url:string}[] }
interface Gateway { id: number; code: string; name: string }
interface Props { products: Product[]; gateways: Gateway[]; settings: Record<string,string> }

interface LineItem { product_id: number; product_name: string; price: number; quantity: number }

export default function OrderCreate({ products, gateways, settings }: Props) {
    const { props: pageProps } = usePage<{ adminPath?: string }>()
    const ap = `/${pageProps.adminPath ?? 'tijar-admin'}`

    const [items, setItems]         = useState<LineItem[]>([])
    const [productSearch, setPSearch] = useState('')
    const [showProducts, setShowP]  = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const { data, setData, post, processing, errors } = useForm({
        customer_name:    '',
        customer_phone:   '',
        customer_email:   '',
        customer_address: '',
        payment_method:   'cod',
        payment_status:   'pending',
        status:           'pending',
        notes:            '',
        items:            [] as LineItem[],
    })

    const fmt = (n: number) => `Rs ${Number(n).toLocaleString('en-PK')}`
    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(productSearch.toLowerCase())
    ).slice(0, 8)

    function addProduct(p: Product) {
        const exists = items.find(i => i.product_id === p.id)
        if (exists) {
            setItems(items.map(i => i.product_id === p.id ? { ...i, quantity: i.quantity + 1 } : i))
        } else {
            setItems([...items, { product_id: p.id, product_name: p.name, price: p.price, quantity: 1 }])
        }
        setShowP(false)
        setPSearch('')
    }

    function removeItem(idx: number) { setItems(items.filter((_, i) => i !== idx)) }
    function setQty(idx: number, qty: number) { setItems(items.map((item, i) => i === idx ? { ...item, quantity: Math.max(1, qty) } : item)) }
    function setPrice(idx: number, price: number) { setItems(items.map((item, i) => i === idx ? { ...item, price } : item)) }

    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
    const shipping = parseFloat(settings?.shipping_fee ?? '0')
    const total = subtotal + shipping

    function submit(e: React.FormEvent) {
        e.preventDefault()
        if (items.length === 0) { alert('Add at least one product'); return }
        post(`${ap}/orders/manual`, { data: { ...data, items } } as any)
    }

    const inputCls = "w-full h-11 px-4 border-2 border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)] transition-colors bg-white"

    return (
        <AdminLayout title="Create Manual Order">
            <Head title="New Order" />

            <div className="flex items-center gap-3 mb-6">
                <Link href={`${ap}/orders`} className="flex items-center gap-2 text-[13px] font-semibold text-gray-500 hover:text-[var(--color-primary)] no-underline">
                    <IconArrowLeft size={15}/> Back to Orders
                </Link>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-[13px] text-blue-800 mb-5 flex items-start gap-2.5">
                <span className="text-xl">📱</span>
                <div><strong>Manual Order</strong> — use this to enter orders received via WhatsApp, phone calls, or in-person. Stock will be reduced automatically.</div>
            </div>

            <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-5 max-w-5xl">
                <div className="lg:col-span-2 space-y-5">

                    {/* Customer info */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                        <h3 className="font-manrope font-bold text-[15px]">Customer Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[12.5px] font-semibold text-gray-700 mb-1">Full Name *</label>
                                <input value={data.customer_name} onChange={e => setData('customer_name', e.target.value)} required placeholder="Ali Khan" className={inputCls} />
                            </div>
                            <div>
                                <label className="block text-[12.5px] font-semibold text-gray-700 mb-1">Phone *</label>
                                <input value={data.customer_phone} onChange={e => setData('customer_phone', e.target.value)} required placeholder="03001234567" className={inputCls} />
                            </div>
                            <div>
                                <label className="block text-[12.5px] font-semibold text-gray-700 mb-1">Email (optional)</label>
                                <input type="email" value={data.customer_email} onChange={e => setData('customer_email', e.target.value)} placeholder="ali@email.com" className={inputCls} />
                            </div>
                            <div>
                                <label className="block text-[12.5px] font-semibold text-gray-700 mb-1">City / Address *</label>
                                <input value={data.customer_address} onChange={e => setData('customer_address', e.target.value)} required placeholder="House 12, Block 5, Karachi" className={inputCls} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[12.5px] font-semibold text-gray-700 mb-1">Notes (optional)</label>
                            <textarea value={data.notes} onChange={e => setData('notes', e.target.value)} rows={2}
                                placeholder="Colour preference, delivery instructions, WhatsApp message details…"
                                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)] resize-none" />
                        </div>
                    </div>

                    {/* Products */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-manrope font-bold text-[15px]">Order Items</h3>
                            <button type="button" onClick={() => setShowP(!showProducts)}
                                className="flex items-center gap-2 h-9 px-4 font-bold text-[12.5px] rounded-xl border-none cursor-pointer"
                                style={{ background:'var(--color-primary)', color:'var(--color-primary-text)' }}>
                                <IconPlus size={15}/> Add Product
                            </button>
                        </div>

                        {/* Product search dropdown */}
                        {showProducts && (
                            <div className="mb-4 border-2 border-gray-200 rounded-xl overflow-hidden">
                                <div className="flex items-center px-3 border-b border-gray-200">
                                    <IconSearch size={16} className="text-gray-400 flex-shrink-0"/>
                                    <input value={productSearch} onChange={e => setPSearch(e.target.value)}
                                        placeholder="Search products…" autoFocus
                                        className="flex-1 h-11 px-3 outline-none border-none text-[13.5px]" />
                                </div>
                                {filteredProducts.map(p => (
                                    <button key={p.id} type="button" onClick={() => addProduct(p)}
                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 cursor-pointer border-none bg-white text-left">
                                        {p.product_images?.[0]?.url && <img src={p.product_images[0].url} className="w-9 h-9 rounded-lg object-cover flex-shrink-0"/>}
                                        <div className="flex-1 min-w-0">
                                            <div className="text-[13px] font-semibold truncate">{p.name}</div>
                                            <div className="text-[11.5px] text-gray-400">{fmt(p.price)} · {p.stock} in stock</div>
                                        </div>
                                        <span className="text-[11.5px] font-bold text-[var(--color-primary)]">+ Add</span>
                                    </button>
                                ))}
                                {filteredProducts.length === 0 && <div className="px-4 py-6 text-[13px] text-gray-400 text-center">No products found</div>}
                            </div>
                        )}

                        {items.length === 0 ? (
                            <div className="py-10 text-center text-gray-400 text-[13px] border-2 border-dashed border-gray-200 rounded-xl">
                                No items added yet. Click "Add Product" to search and add products.
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {items.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                        <div className="flex-1 min-w-0">
                                            <div className="text-[13px] font-semibold text-gray-900 truncate">{item.product_name}</div>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <label className="text-[11.5px] text-gray-500">Qty:</label>
                                            <input type="number" value={item.quantity} min="1"
                                                onChange={e => setQty(idx, +e.target.value)}
                                                className="w-16 h-8 px-2 border border-gray-200 rounded-lg text-[12.5px] text-center outline-none focus:border-[var(--color-primary)]" />
                                            <label className="text-[11.5px] text-gray-500">Price:</label>
                                            <input type="number" value={item.price} min="0"
                                                onChange={e => setPrice(idx, +e.target.value)}
                                                className="w-24 h-8 px-2 border border-gray-200 rounded-lg text-[12.5px] outline-none focus:border-[var(--color-primary)]" />
                                            <div className="text-[13px] font-bold w-24 text-right" style={{ color:'var(--color-dark-bg)' }}>{fmt(item.price * item.quantity)}</div>
                                            <button type="button" onClick={() => removeItem(idx)} className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-red-400 hover:bg-red-50 bg-white cursor-pointer border-none">
                                                <IconTrash size={13}/>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <div className="flex justify-end pt-2 text-[14px] font-black" style={{ color:'var(--color-dark-bg)' }}>
                                    Total: <span className="ml-2" style={{ color:'var(--color-primary)' }}>{fmt(total)}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: payment + status */}
                <div className="space-y-4">
                    <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
                        <h3 className="font-manrope font-bold text-[15px]">Order Settings</h3>
                        <div>
                            <label className="block text-[12.5px] font-semibold text-gray-700 mb-1.5">Payment Method</label>
                            <select value={data.payment_method} onChange={e => setData('payment_method', e.target.value)}
                                className="w-full h-11 px-4 border-2 border-gray-200 rounded-xl text-[13px] outline-none focus:border-[var(--color-primary)] bg-white">
                                {gateways.map(g => <option key={g.id} value={g.code}>{g.name}</option>)}
                                <option value="whatsapp">WhatsApp Order</option>
                                <option value="phone_order">Phone Order</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[12.5px] font-semibold text-gray-700 mb-1.5">Payment Status</label>
                            <select value={data.payment_status} onChange={e => setData('payment_status', e.target.value)}
                                className="w-full h-11 px-4 border-2 border-gray-200 rounded-xl text-[13px] outline-none focus:border-[var(--color-primary)] bg-white">
                                <option value="pending">Pending (not paid yet)</option>
                                <option value="paid">Paid ✓</option>
                                <option value="failed">Failed</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[12.5px] font-semibold text-gray-700 mb-1.5">Order Status</label>
                            <select value={data.status} onChange={e => setData('status', e.target.value)}
                                className="w-full h-11 px-4 border-2 border-gray-200 rounded-xl text-[13px] outline-none focus:border-[var(--color-primary)] bg-white">
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 p-5">
                        <h3 className="font-manrope font-bold text-[14px] mb-3">Order Summary</h3>
                        <div className="space-y-2 text-[13px]">
                            <div className="flex justify-between text-gray-600"><span>{items.length} item(s)</span><span>{fmt(subtotal)}</span></div>
                            <div className="flex justify-between text-gray-600"><span>Shipping</span><span>{shipping > 0 ? fmt(shipping) : 'Free'}</span></div>
                            <div className="flex justify-between font-black text-[15px] pt-2 border-t border-gray-100">
                                <span>Total</span><span style={{ color:'var(--color-primary)' }}>{fmt(total)}</span>
                            </div>
                        </div>
                    </div>

                    <button type="submit" disabled={processing || items.length === 0}
                        className="w-full h-12 font-black text-[14px] rounded-xl border-none cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
                        style={{ background:'var(--color-primary)', color:'var(--color-primary-text)' }}>
                        <IconCheck size={18}/> {processing ? 'Creating…' : 'Create Order'}
                    </button>
                </div>
            </form>
        </AdminLayout>
    )
}
