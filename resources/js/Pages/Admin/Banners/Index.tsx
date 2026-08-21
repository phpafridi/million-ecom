import { Head, usePage, router, useForm } from '@inertiajs/react'
import { useState } from 'react'
import { IconPencil, IconTrash, IconX, IconPlus } from '@tabler/icons-react'
import AdminLayout from '@/Layouts/AdminLayout'
import ImageUpload from '@/Components/Admin/ImageUpload'
import { IMAGE_SPECS } from '@/constants/imageSpecs'
import type { Banner } from '@/types'

interface Props { banners: Banner[] }

const POSITIONS = [
    { value: 'tall_left',    label: 'Tall Banner (Left) — 600×500px' },
    { value: 'small_top_1',  label: 'Small Banner Top-Right 1 — 600×200px' },
    { value: 'small_top_2',  label: 'Small Banner Top-Right 2 — 600×200px' },
    { value: 'wide_bottom',  label: 'Wide Banner (Bottom-Left) — 900×252px' },
    { value: 'full_hero',    label: 'Full-Width Hero Banner (between Categories & Grid) — 1400×380px' },
    { value: 'full_gaming',  label: 'Full-Width Gaming Banner — 1400×360px' },
    { value: 'full_printers',label: 'Full-Width Printers Banner — 1400×300px' },
    { value: 'promo_1',      label: 'Promo 3-Col Banner 1 — 600×200px' },
    { value: 'promo_2',      label: 'Promo 3-Col Banner 2 — 500×200px' },
    { value: 'promo_3',      label: 'Promo 3-Col Banner 3 — 500×200px' },
]

function getSpec(position: string) {
    if (position === 'tall_left')                        return IMAGE_SPECS.banner_tall
    if (position === 'wide_bottom')                      return IMAGE_SPECS.banner_wide
    if (position.startsWith('full'))                     return IMAGE_SPECS.full_banner
    return IMAGE_SPECS.banner_sm
}

function BannerForm({ banner, onClose }: { banner?: Banner; onClose: () => void }) {
    const { data, setData, post, processing } = useForm<any>({
        _method: banner ? 'PUT' : 'POST',
        title:     banner?.title    ?? '',
        subtitle:  banner?.subtitle ?? '',
        cta_text:  banner?.cta_text ?? 'Shop now',
        link:      banner?.link     ?? '/shop',
        position:  banner?.position ?? 'tall_left',
        is_active:  banner?.is_active  ?? true,
        image:      null as File | null,
        video_url:  (banner as any)?.video_url  ?? '',
        media_type: (banner as any)?.video_url ? 'video' : 'image',
    })

    function submit(e: React.FormEvent) {
        e.preventDefault()
        const opts = { onSuccess: onClose }
        const url = banner ? `${ap}/banners/${banner.id}` : `${ap}/banners`
        post(url, { ...opts, forceFormData: true })
    }

    const spec = getSpec(data.position)

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h3 className="font-manrope font-bold text-[17px] text-gray-900">{banner ? 'Edit Banner' : 'Add Banner'}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors border-none bg-transparent cursor-pointer"><IconX size={20} /></button>
                </div>
                <form onSubmit={submit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Position / Slot *</label>
                        <select value={data.position} onChange={e => setData('position', e.target.value)}
                            className="w-full h-11 px-4 border-2 border-gray-200 rounded-xl text-[13px] outline-none focus:border-[var(--color-primary, #00c8ff)] transition-all bg-white">
                            {POSITIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Title *</label>
                        <input value={data.title} onChange={e => setData('title', e.target.value)} required
                            className="w-full h-11 px-4 border-2 border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary, #00c8ff)] transition-all" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Subtitle / Tag</label>
                            <input value={data.subtitle} onChange={e => setData('subtitle', e.target.value)}
                                className="w-full h-11 px-4 border-2 border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary, #00c8ff)] transition-all" />
                        </div>
                        <div>
                            <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">CTA Button Text</label>
                            <input value={data.cta_text} onChange={e => setData('cta_text', e.target.value)}
                                className="w-full h-11 px-4 border-2 border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary, #00c8ff)] transition-all" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Link URL</label>
                        <input value={data.link} onChange={e => setData('link', e.target.value)} placeholder="/shop?category=laptops"
                            className="w-full h-11 px-4 border-2 border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary, #00c8ff)] transition-all" />
                    </div>

                    {/* ── Media: Image OR Video ── */}
                    <div>
                        <label className="block text-[13px] font-semibold text-gray-700 mb-2">Banner Media *</label>

                        {/* Tabs */}
                        <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-4">
                            {[{key:'image',label:'🖼️ Upload Image'},{key:'video_file',label:'📁 Upload Video'},{key:'video',label:'🔗 Video URL'}].map(t => (
                                <button key={t.key} type="button"
                                    onClick={() => setData('media_type', t.key)}
                                    className="flex-1 py-2 rounded-lg text-[13px] font-bold cursor-pointer border-none transition-all"
                                    style={data.media_type === t.key
                                        ? { background: 'white', color: 'var(--color-dark-bg)', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }
                                        : { background: 'transparent', color: '#9CA3AF' }}>
                                    {t.label}
                                </button>
                            ))}
                        </div>

                        {data.media_type === 'image' ? (
                            <div>
                                <ImageUpload spec={spec} current={banner?.image} onFile={f => setData('image', f)} />
                                {banner?.image && (
                                    <div className="mt-2">
                                        <img src={banner.image} alt="Current" className="h-20 rounded-xl object-cover border border-gray-200" />
                                        <p className="text-[11px] text-gray-400 mt-1">Current image (upload new to replace)</p>
                                    </div>
                                )}
                            </div>
                        ) : data.media_type === 'video_file' ? (
                            <div>
                                <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[var(--color-primary)] transition-colors bg-gray-50">
                                    <span className="text-2xl mb-1">🎬</span>
                                    <span className="text-[13px] font-bold text-gray-600">Click to upload video from PC</span>
                                    <span className="text-[11px] text-gray-400">MP4, WebM, MOV — max 100MB</span>
                                    <input type="file" accept="video/mp4,video/webm,video/mov" className="hidden"
                                        onChange={e => { const f = e.target.files?.[0]; if(f) setData('video' as any, f) }} />
                                </label>
                                {(data as any).video && (
                                    <div className="mt-2 flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-xl">
                                        <span className="text-green-600 text-[12px] font-bold">✅ Video selected: {(data as any).video.name}</span>
                                    </div>
                                )}
                                {(banner as any)?.video_url && !(data as any).video && (
                                    <video src={(banner as any).video_url} autoPlay muted loop playsInline className="mt-2 h-24 w-full rounded-xl object-cover border border-gray-200"/>
                                )}
                                <p className="text-[11px] text-gray-400 mt-2">Video will autoplay, muted, looping on the storefront.</p>
                            </div>
                        ) : (
                            <div>
                                <input
                                    type="url"
                                    value={data.video_url}
                                    onChange={e => setData('video_url', e.target.value)}
                                    placeholder="https://example.com/video.mp4"
                                    className="w-full h-11 px-4 border-2 border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary,#00c8ff)] transition-all"
                                />
                                <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                                    <p className="text-[12px] font-semibold text-amber-700 mb-1">💡 Video Tips:</p>
                                    <ul className="text-[11.5px] text-amber-600 space-y-0.5 list-none m-0 p-0">
                                        <li>• Use direct MP4 URL (not YouTube/Vimeo)</li>
                                        <li>• Recommended: 3-5 seconds loop, no audio</li>
                                        <li>• Upload to S3/Cloudflare R2 for best performance</li>
                                        <li>• Keep file under 5MB for fast loading</li>
                                    </ul>
                                </div>
                                {data.video_url && (
                                    <video src={data.video_url} autoPlay muted loop playsInline
                                        className="mt-2 h-28 w-full rounded-xl object-cover border border-gray-200"
                                        onError={e => (e.currentTarget.style.display = 'none')} />
                                )}
                            </div>
                        )}
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer">
                        <button type="button" onClick={() => setData('is_active', !data.is_active)}
                            className={`w-10 h-5 rounded-full transition-all relative flex-shrink-0 border-none cursor-pointer ${data.is_active ? 'bg-[var(--color-primary, #00c8ff)]' : 'bg-gray-200'}`}>
                            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${data.is_active ? 'left-5' : 'left-0.5'}`} />
                        </button>
                        <span className="text-[13.5px] font-semibold text-gray-700">Active</span>
                    </label>

                    <div className="flex gap-3 pt-2">
                        <button type="submit" disabled={processing}
                            className="flex-1 h-11 bg-[var(--color-primary, #00c8ff)] hover:bg-[var(--color-primary-dark, #00b0e0)] text-[var(--color-dark-bg, #0a0e1a)] font-black text-[13px] rounded-xl transition-all disabled:opacity-60 border-none cursor-pointer">
                            {processing ? 'Saving…' : banner ? 'Update Banner' : 'Create Banner'}
                        </button>
                        <button type="button" onClick={onClose}
                            className="flex-1 h-11 border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold text-[13px] rounded-xl transition-all bg-white cursor-pointer">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default function BannersIndex({ banners }: Props) {
    const { props: _p } = usePage<{ adminPath?: string }>()
    const ap = `/${_p.adminPath ?? 'tijar-admin'}`
    const [editing, setEditing] = useState<Banner | 'new' | null>(null)

    return (
        <AdminLayout title="Banners">
            <Head title="Banners — Admin" />
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl text-[13px] text-blue-800">
                <strong>📐 Banner Positions & Image Sizes:</strong> Each banner slot has a fixed position on the homepage. Upload images at the correct dimensions to avoid layout distortion. ±20% tolerance is accepted.
            </div>
            <div className="flex items-center justify-between mb-5">
                <p className="text-sm text-gray-500">{banners.length} banners configured</p>
                <button onClick={() => setEditing('new')}
                    className="flex items-center gap-2 bg-[var(--color-primary, #00c8ff)] hover:bg-[var(--color-primary-dark, #00b0e0)] text-[var(--color-dark-bg, #0a0e1a)] font-black text-[13px] px-5 h-10 rounded-xl transition-colors border-none cursor-pointer">
                    <IconPlus size={17} /> Add Banner
                </button>
            </div>

            <div className="space-y-3">
                {banners.map(b => (
                    <div key={b.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex items-stretch group hover:border-[var(--color-primary, #00c8ff)]/30 transition-colors">
                        <div className="w-36 flex-shrink-0 bg-gray-50 overflow-hidden">
                            {b.image ? <img src={b.image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[12px] text-gray-400">No image</div>}
                        </div>
                        <div className="flex-1 px-5 py-4 min-w-0">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <div className="text-[11px] text-[var(--color-primary, #00c8ff)] font-bold uppercase tracking-wider mb-0.5">{b.position}</div>
                                    <div className="font-semibold text-gray-900 text-[15px]">{b.title}</div>
                                    {b.subtitle && <div className="text-[12.5px] text-gray-500 mt-0.5">{b.subtitle}</div>}
                                    <div className="text-[12px] text-gray-400 mt-1">→ {b.link}</div>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${b.is_active ? 'bg-green-50 text-green-600 border-green-200' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>
                                        {b.is_active ? 'Active' : 'Hidden'}
                                    </span>
                                    <button onClick={() => setEditing(b)} className="w-8 h-8 rounded-lg border border-gray-200 hover:border-[var(--color-primary, #00c8ff)] hover:bg-[rgba(0,200,255,0.05)] hover:text-[var(--color-primary, #00c8ff)] flex items-center justify-center text-gray-400 transition-all border-none cursor-pointer">
                                        <IconPencil size={14} />
                                    </button>
                                    <button onClick={() => confirm('Delete?') && router.delete(`${ap}/banners/${b.id}`)}
                                        className="w-8 h-8 rounded-lg border border-gray-200 hover:border-red-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center text-gray-400 transition-all border-none cursor-pointer">
                                        <IconTrash size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {editing && <BannerForm banner={editing === 'new' ? undefined : editing} onClose={() => setEditing(null)} />}
        </AdminLayout>
    )
}
