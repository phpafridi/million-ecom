import { Head, router, useForm, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { IconPlus, IconTrash, IconPencil, IconX, IconCheck, IconTag } from '@tabler/icons-react'
import AdminLayout from '@/Layouts/AdminLayout'

interface Coupon {
    id: number; code: string; type: string; value: number
    min_order: number; max_discount: number | null; usage_limit: number | null
    used_count: number; is_active: boolean; expires_at: string | null; description: string | null
}
interface Props { coupons: Coupon[] }

function CouponForm({ coupon, onClose }: { coupon?: Coupon; onClose: () => void }) {
    const { props: pageProps } = usePage<{ adminPath?: string }>()
    const ap = `/${pageProps.adminPath ?? 'tijar-admin'}`
    const { data, setData, post, put, processing, errors } = useForm({
        code: coupon?.code ?? '',
        type: coupon?.type ?? 'percentage',
        value: coupon?.value ?? '',
        min_order: coupon?.min_order ?? '',
        max_discount: coupon?.max_discount ?? '',
        usage_limit: coupon?.usage_limit ?? '',
        is_active: coupon?.is_active ?? true,
        expires_at: coupon?.expires_at ? coupon.expires_at.substring(0,10) : '',
        description: coupon?.description ?? '',
    })
    const inputCls = "w-full h-11 px-4 border-2 border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)] transition-colors bg-white"
    function submit(e: React.FormEvent) {
        e.preventDefault()
        const opts = { onSuccess: onClose }
        coupon ? put(`${ap}/coupons/${coupon.id}`, opts) : post(`${ap}/coupons`, opts)
    }
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h3 className="font-manrope font-bold text-[17px]">{coupon ? 'Edit Coupon' : 'Create Coupon'}</h3>
                    <button onClick={onClose} className="border-none bg-transparent cursor-pointer text-gray-400"><IconX size={20}/></button>
                </div>
                <form onSubmit={submit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[13px] font-semibold text-gray-700 mb-1">Coupon Code *</label>
                            <input value={data.code} onChange={e => setData('code', e.target.value.toUpperCase())} required placeholder="SAVE20" className={inputCls + " font-mono"} />
                            {errors.code && <p className="text-[12px] text-red-500 mt-1">{errors.code}</p>}
                        </div>
                        <div>
                            <label className="block text-[13px] font-semibold text-gray-700 mb-1">Type *</label>
                            <select value={data.type} onChange={e => setData('type', e.target.value)} className={inputCls}>
                                <option value="percentage">Percentage (%) off</option>
                                <option value="fixed">Fixed (Rs) off</option>
                                <option value="free_shipping">Free Shipping</option>
                            </select>
                        </div>
                        {data.type !== 'free_shipping' && (
                            <div>
                                <label className="block text-[13px] font-semibold text-gray-700 mb-1">{data.type === 'percentage' ? 'Discount %' : 'Discount Rs'} *</label>
                                <input type="number" value={data.value} onChange={e => setData('value', e.target.value)} required min="0" placeholder={data.type === 'percentage' ? '20' : '500'} className={inputCls} />
                            </div>
                        )}
                        <div>
                            <label className="block text-[13px] font-semibold text-gray-700 mb-1">Min Order (Rs)</label>
                            <input type="number" value={data.min_order} onChange={e => setData('min_order', e.target.value)} min="0" placeholder="0" className={inputCls} />
                        </div>
                        {data.type === 'percentage' && (
                            <div>
                                <label className="block text-[13px] font-semibold text-gray-700 mb-1">Max Discount (Rs)</label>
                                <input type="number" value={data.max_discount} onChange={e => setData('max_discount', e.target.value)} min="0" placeholder="No limit" className={inputCls} />
                            </div>
                        )}
                        <div>
                            <label className="block text-[13px] font-semibold text-gray-700 mb-1">Usage Limit</label>
                            <input type="number" value={data.usage_limit} onChange={e => setData('usage_limit', e.target.value)} min="1" placeholder="Unlimited" className={inputCls} />
                        </div>
                        <div>
                            <label className="block text-[13px] font-semibold text-gray-700 mb-1">Expires On</label>
                            <input type="date" value={data.expires_at} onChange={e => setData('expires_at', e.target.value)} className={inputCls} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[13px] font-semibold text-gray-700 mb-1">Description (optional)</label>
                        <input value={data.description} onChange={e => setData('description', e.target.value)} placeholder="Summer sale discount" className={inputCls} />
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <button type="button" onClick={() => setData('is_active', !data.is_active)}
                            className={`relative w-11 h-6 rounded-full border-none cursor-pointer transition-all ${data.is_active ? 'bg-[var(--color-primary)]' : 'bg-gray-300'}`}>
                            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${data.is_active ? 'left-5' : 'left-0.5'}`}/>
                        </button>
                        <span className="text-[13px] font-semibold text-gray-700">Active (customers can use this coupon)</span>
                    </label>
                    <div className="flex gap-3 pt-2 border-t border-gray-100">
                        <button type="submit" disabled={processing}
                            className="flex-1 h-12 font-black text-[14px] rounded-xl border-none cursor-pointer disabled:opacity-60"
                            style={{ background:'var(--color-primary)', color:'var(--color-primary-text)' }}>
                            {processing ? 'Saving…' : coupon ? 'Update Coupon' : 'Create Coupon'}
                        </button>
                        <button type="button" onClick={onClose} className="flex-1 h-12 border-2 border-gray-200 text-gray-700 font-semibold text-[13px] rounded-xl bg-white cursor-pointer">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default function CouponsIndex({ coupons }: Props) {
    const { props: pageProps } = usePage<{ adminPath?: string }>()
    const ap = `/${pageProps.adminPath ?? 'tijar-admin'}`
    const [editing, setEditing] = useState<Coupon | 'new' | null>(null)

    function del(c: Coupon) {
        if (!confirm(`Delete coupon "${c.code}"?`)) return
        router.delete(`${ap}/coupons/${c.id}`, { preserveScroll: true })
    }

    const typeLabel = (t: string) => ({ percentage:'% off', fixed:'Rs off', free_shipping:'Free Shipping' }[t] ?? t)

    return (
        <AdminLayout title="Discount Coupons">
            <Head title="Coupons"/>
            <div className="flex items-center justify-between mb-5">
                <p className="text-[13px] text-gray-500">{coupons.length} coupons</p>
                <button onClick={() => setEditing('new')}
                    className="flex items-center gap-2 font-black text-[13px] px-5 h-10 rounded-xl border-none cursor-pointer"
                    style={{ background:'var(--color-primary)', color:'var(--color-primary-text)' }}>
                    <IconPlus size={17}/> Create Coupon
                </button>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px]">
                        <thead><tr className="bg-gray-50 border-b border-gray-100">
                            {['Code','Type','Value','Min Order','Used','Expires','Status','Actions'].map(h => (
                                <th key={h} className="text-left text-[11px] font-black text-gray-400 uppercase tracking-wider px-5 py-3.5">{h}</th>
                            ))}
                        </tr></thead>
                        <tbody>
                            {coupons.map(c => (
                                <tr key={c.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 group">
                                    <td className="px-5 py-3.5">
                                        <span className="font-mono font-black text-[13px]" style={{ color:'var(--color-primary)' }}>{c.code}</span>
                                        {c.description && <div className="text-[11.5px] text-gray-400 mt-0.5">{c.description}</div>}
                                    </td>
                                    <td className="px-5 py-3.5 text-[12.5px] text-gray-600 capitalize">{typeLabel(c.type)}</td>
                                    <td className="px-5 py-3.5 font-bold text-[13px]">{c.type === 'percentage' ? `${c.value}%` : c.type === 'fixed' ? `Rs ${c.value}` : '—'}</td>
                                    <td className="px-5 py-3.5 text-[12.5px] text-gray-600">{c.min_order > 0 ? `Rs ${c.min_order}` : 'Any'}</td>
                                    <td className="px-5 py-3.5 text-[12.5px] text-gray-600">{c.used_count}{c.usage_limit ? `/${c.usage_limit}` : ''}</td>
                                    <td className="px-5 py-3.5 text-[12.5px] text-gray-600">{c.expires_at ? new Date(c.expires_at).toLocaleDateString() : 'Never'}</td>
                                    <td className="px-5 py-3.5">
                                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${c.is_active ? 'bg-green-50 text-green-600 border-green-200' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>
                                            {c.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex gap-1.5 ">
                                            <button onClick={() => setEditing(c)} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 bg-white cursor-pointer hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all"><IconPencil size={14}/></button>
                                            <button onClick={() => del(c)} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 bg-white cursor-pointer hover:border-red-400 hover:bg-red-50 hover:text-red-500 transition-all"><IconTrash size={14}/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {coupons.length === 0 && (
                                <tr><td colSpan={8} className="px-5 py-16 text-center">
                                    <IconTag size={36} className="text-gray-300 mx-auto mb-3"/>
                                    <div className="text-gray-400 text-[13px]">No coupons yet. Create your first discount code.</div>
                                </td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {editing && <CouponForm coupon={editing === 'new' ? undefined : editing} onClose={() => setEditing(null)}/>}
        </AdminLayout>
    )
}
