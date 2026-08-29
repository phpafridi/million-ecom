import { Head, usePage, router, useForm } from '@inertiajs/react'
import { useState } from 'react'
import { IconPlus, IconPencil, IconTrash, IconX, IconUpload, IconInfoCircle } from '@tabler/icons-react'
import AdminLayout from '@/Layouts/AdminLayout'
import type { HeroSlide } from '@/types'

interface Props { slides: HeroSlide[] }

function SlideForm({ slide, onClose }: { slide?: HeroSlide; onClose: () => void }) {
    const { props: _sp } = usePage<any>()
    const ap = `/${_sp?.adminPath ?? 'ml-admin'}`
    const { data, setData, post, processing, errors } = useForm<any>({
        _method: slide ? 'PUT' : 'POST',
        title: slide?.title ?? '',
        subtitle: slide?.subtitle ?? '',
        description: slide?.description ?? '',
        cta_text: slide?.cta_text ?? 'View Details',
        cta_url: slide?.cta_url ?? '/shop',
        discount_pct: slide?.discount_pct ?? 0,
        price: slide?.price ?? '',
        compare_price: slide?.compare_price ?? '',
        is_active: slide?.is_active ?? true,
        image: null as File | null,
    })

    const [preview, setPreview] = useState<string | null>(slide?.image ?? null)
    const [imgErr, setImgErr] = useState('')

    function handleImg(e: React.ChangeEvent<HTMLInputElement>) {
        const f = e.target.files?.[0]; if (!f) return
        setImgErr('')
        const img = new Image()
        img.onload = () => {
            if (img.width < 1600) { setImgErr(`Too small: ${img.width}×${img.height}px. Need at least 1920×1080px for a sharp banner`); return }
            setPreview(URL.createObjectURL(f))
            setData('image', f)
        }
        img.src = URL.createObjectURL(f)
    }

    function submit(e: React.FormEvent) {
        e.preventDefault()
        const opts = { onSuccess: onClose }
        const url = slide ? `${ap}/hero-slides/${slide.id}` : `${ap}/hero-slides`
        post(url, { ...opts, forceFormData: true })
    }

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl my-4">
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                    <h3 className="font-manrope font-bold text-[17px]">{slide ? 'Edit Slide' : 'Add Hero Slide'}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700 border-none bg-transparent cursor-pointer"><IconX size={20} /></button>
                </div>
                <form onSubmit={submit} className="p-5 space-y-4">
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-[12px] text-blue-700 flex items-start gap-2">
                        <IconInfoCircle size={14} className="flex-shrink-0 mt-0.5 text-blue-500" />
                        Image: <strong>1920×1080px</strong> — wide landscape banner image (subject centered — the site auto-crops edges to fit each screen size)
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { key: 'title', label: 'Tag (eyebrow)', placeholder: "This Week's Deal" },
                            { key: 'subtitle', label: 'Headline', placeholder: 'THE NEW' },
                        ].map(f => (
                            <div key={f.key}>
                                <label className="block text-[13px] font-semibold text-gray-700 mb-1">{f.label}</label>
                                <input value={data[f.key]} onChange={e => setData(f.key, e.target.value)} placeholder={f.placeholder}
                                    className="w-full h-10 px-3 border-2 border-gray-200 rounded-xl text-[13px] outline-none focus:border-[var(--color-primary,#00c8ff)]" />
                            </div>
                        ))}
                    </div>
                    <div>
                        <label className="block text-[13px] font-semibold text-gray-700 mb-1">Sub-headline (cyan)</label>
                        <input value={data.description} onChange={e => setData('description', e.target.value)} placeholder="STANDARD"
                            className="w-full h-10 px-3 border-2 border-gray-200 rounded-xl text-[13px] outline-none focus:border-[var(--color-primary,#00c8ff)]" />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { key: 'price', label: 'Price', placeholder: 'Rs 74,999' },
                            { key: 'compare_price', label: 'Compare Price', placeholder: 'Rs 94,999' },
                            { key: 'discount_pct', label: 'Discount %', placeholder: '21', type: 'number' },
                        ].map(f => (
                            <div key={f.key}>
                                <label className="block text-[13px] font-semibold text-gray-700 mb-1">{f.label}</label>
                                <input type={f.type ?? 'text'} value={data[f.key]} onChange={e => setData(f.key, f.type === 'number' ? +e.target.value : e.target.value)}
                                    placeholder={f.placeholder} min={f.type === 'number' ? 0 : undefined} max={f.type === 'number' ? 99 : undefined}
                                    className="w-full h-10 px-3 border-2 border-gray-200 rounded-xl text-[13px] outline-none focus:border-[var(--color-primary,#00c8ff)]" />
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[13px] font-semibold text-gray-700 mb-1">CTA Button Text</label>
                            <input value={data.cta_text} onChange={e => setData('cta_text', e.target.value)}
                                className="w-full h-10 px-3 border-2 border-gray-200 rounded-xl text-[13px] outline-none focus:border-[var(--color-primary,#00c8ff)]" />
                        </div>
                        <div>
                            <label className="block text-[13px] font-semibold text-gray-700 mb-1">CTA Link</label>
                            <input value={data.cta_url} onChange={e => setData('cta_url', e.target.value)} placeholder="/products/slug"
                                className="w-full h-10 px-3 border-2 border-gray-200 rounded-xl text-[13px] outline-none focus:border-[var(--color-primary,#00c8ff)]" />
                        </div>
                    </div>

                    {/* Image upload */}
                    {preview && <img src={preview} className="w-full h-28 object-cover rounded-xl border border-gray-200" alt="preview" />}
                    <label className="flex items-center gap-3 border-2 border-dashed border-gray-200 hover:border-[var(--color-primary,#00c8ff)] rounded-xl px-4 py-3 cursor-pointer transition-colors">
                        <input type="file" accept="image/*" className="hidden" onChange={handleImg} />
                        <IconUpload size={17} className="text-[var(--color-primary,#00c8ff)]" />
                        <span className="text-[13px] text-gray-500">Upload slide image (1920×1080px)</span>
                    </label>
                    {imgErr && <p className="text-[12px] text-red-500">{imgErr}</p>}

                    <label className="flex items-center gap-3 cursor-pointer">
                        <button type="button" onClick={() => setData('is_active', !data.is_active)}
                            className={`w-10 h-5 rounded-full transition-all relative border-none cursor-pointer ${data.is_active ? 'bg-[var(--color-primary,#00c8ff)]' : 'bg-gray-200'}`}>
                            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${data.is_active ? 'left-5' : 'left-0.5'}`} />
                        </button>
                        <span className="text-[13px] font-semibold text-gray-700">Active</span>
                    </label>

                    <div className="flex gap-3 pt-2">
                        <button type="submit" disabled={processing}
                            className="flex-1 h-11 bg-[var(--color-primary,#00c8ff)] hover:bg-[var(--color-primary-dark,#00b0e0)] text-[var(--color-dark-bg,#0a0e1a)] font-black text-[13px] rounded-xl border-none cursor-pointer disabled:opacity-60">
                            {processing ? 'Saving…' : slide ? 'Update Slide' : 'Create Slide'}
                        </button>
                        <button type="button" onClick={onClose}
                            className="flex-1 h-11 border-2 border-gray-200 text-gray-700 font-semibold text-[13px] rounded-xl bg-white cursor-pointer">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default function HeroSlidesIndex({ slides }: Props) {
    const { props: _p } = usePage<{ adminPath?: string }>()
    const ap = `/${_p.adminPath ?? 'ml-admin'}`
    const [editing, setEditing] = useState<HeroSlide | 'new' | null>(null)

    return (
        <AdminLayout title="Hero Slides">
            <Head title="Hero Slides — Admin" />
            <div className="flex items-center justify-between mb-5">
                <p className="text-[13px] text-gray-500">{slides.length} slides</p>
                <button onClick={() => setEditing('new')}
                    className="flex items-center gap-2 bg-[var(--color-primary,#00c8ff)] hover:bg-[var(--color-primary-dark,#00b0e0)] text-[var(--color-dark-bg,#0a0e1a)] font-black text-[13px] px-5 h-10 rounded-xl border-none cursor-pointer">
                    <IconPlus size={17} /> Add Slide
                </button>
            </div>
            <div className="space-y-3">
                {slides.map(s => (
                    <div key={s.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex items-stretch group hover:border-[var(--color-primary,#00c8ff)]/30 transition-colors">
                        <div className="w-40 flex-shrink-0 bg-gray-50 overflow-hidden">
                            {s.image ? <img src={s.image} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full flex items-center justify-center text-[12px] text-gray-400">No image</div>}
                        </div>
                        <div className="flex-1 px-5 py-4 min-w-0 flex items-center justify-between gap-4">
                            <div>
                                <div className="text-[10.5px] text-[var(--color-primary,#00c8ff)] font-bold uppercase tracking-wider mb-0.5">{s.title}</div>
                                <div className="font-manrope font-bold text-[15px] text-gray-900">{s.subtitle} <span className="text-[var(--color-primary,#00c8ff)]">{s.description}</span></div>
                                <div className="text-[12px] text-gray-400 mt-0.5">{s.price} · {s.discount_pct}% off · → {s.cta_url}</div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${s.is_active ? 'bg-green-50 text-green-600 border-green-200' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>
                                    {s.is_active ? 'Active' : 'Hidden'}
                                </span>
                                <button onClick={() => setEditing(s)} className="w-8 h-8 rounded-lg border border-gray-200 hover:border-[var(--color-primary,#00c8ff)] hover:text-[var(--color-primary,#00c8ff)] flex items-center justify-center text-gray-400 bg-white cursor-pointer transition-all">
                                    <IconPencil size={14} />
                                </button>
                                <button onClick={() => confirm('Delete this slide?') && router.delete(`${ap}/hero-slides/${s.id}`)}
                                    className="w-8 h-8 rounded-lg border border-gray-200 hover:border-red-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center text-gray-400 bg-white cursor-pointer transition-all">
                                    <IconTrash size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {editing && <SlideForm slide={editing === 'new' ? undefined : editing} onClose={() => setEditing(null)} />}
        </AdminLayout>
    )
}
