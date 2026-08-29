import { Head, usePage, router, useForm } from '@inertiajs/react'
import { useState } from 'react'
import { IconPencil, IconTrash, IconX, IconPlus, IconDeviceDesktop, IconDeviceMobile, IconCheck } from '@tabler/icons-react'
import AdminLayout from '@/Layouts/AdminLayout'
import ImageUpload, { DualImageUpload } from '@/Components/Admin/ImageUpload'
import { IMAGE_SPECS } from '@/constants/imageSpecs'
import type { Banner } from '@/types'

interface Props { banners: Banner[] }

const POSITIONS = [
    { value: 'full_hero',    label: '① Full-Width Hero',     desk: '1920×520px landscape', mob: '900×900px square'  },
    { value: 'promo',        label: '② Promo Left Card',     desk: '1080×1080px square',   mob: '900×900px square'  },
    { value: 'small_top_1', label: '③ Small Top Right 1',   desk: '900×540px landscape',  mob: '900×900px square'  },
    { value: 'small_top_2', label: '④ Small Top Right 2',   desk: '900×540px landscape',  mob: '900×900px square'  },
    { value: 'wide_bottom',  label: '⑤ Wide Bottom',         desk: '1600×450px landscape', mob: 'N/A (desktop only)'},
]

function getSpec(position: string) {
    if (position === 'promo')               return IMAGE_SPECS.banner_tall
    if (position === 'wide_bottom')         return IMAGE_SPECS.banner_wide
    if (position.startsWith('full'))        return IMAGE_SPECS.full_banner
    return IMAGE_SPECS.banner_sm
}

const MOBILE_SPEC = { w: 900, h: 900, label: 'Mobile Image', hint: 'Square — fills portrait card on phones. Falls back to desktop image if not uploaded.' }

function BannerForm({ banner, onClose }: { banner?: Banner; onClose: () => void }) {
    const { props } = usePage<any>()
    const ap = `/${props?.adminPath ?? 'ml-admin'}`
    const { data, setData, post, processing } = useForm<any>({
        _method:      banner ? 'PUT' : 'POST',
        title:        banner?.title    ?? '',
        subtitle:     banner?.subtitle ?? '',
        cta_text:     banner?.cta_text ?? 'Shop now',
        link:         banner?.link     ?? '/shop',
        position:     banner?.position ?? 'small_top_1',
        is_active:    banner?.is_active ?? true,
        image:        null as File | null,
        mobile_image: null as File | null,
        video_url:    (banner as any)?.video_url ?? '',
        media_type:   (banner as any)?.video_url ? 'video' : 'image',
    })

    const spec     = getSpec(data.position)
    const posInfo  = POSITIONS.find(p => p.value === data.position)

    function submit(e: React.FormEvent) {
        e.preventDefault()
        post(banner ? `${ap}/banners/${banner.id}` : `${ap}/banners`, { onSuccess: onClose, forceFormData: true })
    }

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl my-4">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div>
                        <h3 className="font-manrope font-black text-[17px] text-gray-900">{banner ? 'Edit Banner' : 'Add Banner'}</h3>
                        <p className="text-[12px] text-gray-400 mt-0.5">Configure image, link, and text for this slot</p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 border-none bg-transparent cursor-pointer rounded-lg hover:bg-gray-100 transition-colors">
                        <IconX size={18} />
                    </button>
                </div>

                <form onSubmit={submit} className="p-6 space-y-5">

                    {/* Position */}
                    <div>
                        <label className="block text-[12.5px] font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Slot Position *</label>
                        <select value={data.position} onChange={e => setData('position', e.target.value)}
                            className="w-full h-11 px-4 border-2 border-gray-200 rounded-xl text-[13px] outline-none focus:border-[var(--color-primary)] bg-white transition-all">
                            {POSITIONS.map(p => <option key={p.value} value={p.value}>{p.label} — {p.desk}</option>)}
                        </select>
                        {posInfo && (
                            <div className="mt-2 grid grid-cols-2 gap-2">
                                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-gray-100">
                                    <IconDeviceDesktop size={14} className="text-gray-400" />
                                    <div><p className="text-[10px] text-gray-400 font-bold uppercase">Desktop</p><p className="text-[11.5px] font-bold text-gray-700">{posInfo.desk}</p></div>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-gray-100">
                                    <IconDeviceMobile size={14} className="text-gray-400" />
                                    <div><p className="text-[10px] text-gray-400 font-bold uppercase">Mobile</p><p className="text-[11.5px] font-bold text-gray-700">{posInfo.mob}</p></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Text fields */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[12.5px] font-bold text-gray-700 mb-1.5">Title</label>
                            <input value={data.title} onChange={e => setData('title', e.target.value)}
                                placeholder="e.g. Summer Sale" required
                                className="w-full h-11 px-4 border-2 border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)] transition-all" />
                        </div>
                        <div>
                            <label className="block text-[12.5px] font-bold text-gray-700 mb-1.5">Tag / Subtitle</label>
                            <input value={data.subtitle} onChange={e => setData('subtitle', e.target.value)}
                                placeholder="e.g. Limited time"
                                className="w-full h-11 px-4 border-2 border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)] transition-all" />
                        </div>
                        <div>
                            <label className="block text-[12.5px] font-bold text-gray-700 mb-1.5">Button Text</label>
                            <input value={data.cta_text} onChange={e => setData('cta_text', e.target.value)}
                                placeholder="Shop now"
                                className="w-full h-11 px-4 border-2 border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)] transition-all" />
                        </div>
                        <div>
                            <label className="block text-[12.5px] font-bold text-gray-700 mb-1.5">Link URL</label>
                            <input value={data.link} onChange={e => setData('link', e.target.value)}
                                placeholder="/shop"
                                className="w-full h-11 px-4 border-2 border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)] transition-all" />
                        </div>
                    </div>

                    {/* Media type tabs */}
                    <div>
                        <label className="block text-[12.5px] font-bold text-gray-700 mb-2 uppercase tracking-wide">Banner Media</label>
                        <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-4">
                            {[{ key:'image', label:'🖼️ Image' }, { key:'video_file', label:'📁 Video File' }, { key:'video', label:'🔗 Video URL' }].map(t => (
                                <button key={t.key} type="button" onClick={() => setData('media_type', t.key)}
                                    className="flex-1 py-2 rounded-lg text-[12px] font-bold cursor-pointer border-none transition-all"
                                    style={data.media_type === t.key
                                        ? { background: 'white', color: 'var(--color-dark-bg)', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }
                                        : { background: 'transparent', color: '#9CA3AF' }}>
                                    {t.label}
                                </button>
                            ))}
                        </div>

                        {data.media_type === 'image' ? (
                            <DualImageUpload
                                label="Banner Image"
                                desktopSpec={spec}
                                mobileSpec={MOBILE_SPEC}
                                currentDesktop={banner?.image}
                                currentMobile={(banner as any)?.mobile_image}
                                onDesktopFile={f => setData('image', f)}
                                onMobileFile={f => setData('mobile_image', f)}
                            />
                        ) : data.media_type === 'video_file' ? (
                            <div>
                                <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[var(--color-primary)] transition-colors bg-gray-50">
                                    <span className="text-2xl mb-1">🎬</span>
                                    <span className="text-[13px] font-bold text-gray-600">Click to upload video</span>
                                    <span className="text-[11px] text-gray-400">MP4, WebM, MOV — max 100MB</span>
                                    <input type="file" accept="video/mp4,video/webm,video/mov" className="hidden"
                                        onChange={e => { const f = e.target.files?.[0]; if (f) setData('video', f) }} />
                                </label>
                                {data.video && <p className="text-[12px] text-green-600 font-bold mt-2 flex items-center gap-1"><IconCheck size={13}/> {data.video.name}</p>}
                            </div>
                        ) : (
                            <input type="url" value={data.video_url} onChange={e => setData('video_url', e.target.value)}
                                placeholder="https://example.com/video.mp4"
                                className="w-full h-11 px-4 border-2 border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)] transition-all" />
                        )}
                    </div>

                    {/* Active toggle */}
                    <label className="flex items-center gap-3 cursor-pointer py-2">
                        <button type="button" onClick={() => setData('is_active', !data.is_active)}
                            className={`w-11 h-6 rounded-full transition-all relative flex-shrink-0 border-none cursor-pointer ${data.is_active ? 'bg-[var(--color-primary)]' : 'bg-gray-200'}`}>
                            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${data.is_active ? 'left-5' : 'left-0.5'}`} />
                        </button>
                        <div>
                            <p className="text-[13.5px] font-semibold text-gray-700">Active</p>
                            <p className="text-[11.5px] text-gray-400">{data.is_active ? 'Visible on storefront' : 'Hidden from storefront'}</p>
                        </div>
                    </label>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2 border-t border-gray-100">
                        <button type="submit" disabled={processing}
                            className="flex-1 h-12 font-black text-[14px] rounded-xl border-none cursor-pointer disabled:opacity-60 transition-all"
                            style={{ background: 'var(--color-primary)', color: 'var(--color-primary-text,#0a0a0a)' }}>
                            {processing ? 'Saving…' : banner ? '✓ Update Banner' : '✓ Create Banner'}
                        </button>
                        <button type="button" onClick={onClose}
                            className="h-12 px-6 border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold text-[13px] rounded-xl bg-white cursor-pointer transition-all">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default function BannersIndex({ banners }: Props) {
    const { props } = usePage<{ adminPath?: string }>()
    const ap = `/${props.adminPath ?? 'ml-admin'}`
    const [editing, setEditing] = useState<Banner | 'new' | null>(null)

    const posMap: Record<string, string> = {
        full_hero: '① Full-Width Hero', promo: '② Promo Left',
        small_top_1: '③ Small Top 1', small_top_2: '④ Small Top 2', wide_bottom: '⑤ Wide Bottom',
    }

    return (
        <AdminLayout title="Banners">
            <Head title="Banners — Admin" />

            {/* Guide */}
            <div className="mb-5 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl">
                <p className="font-bold text-[13.5px] text-blue-900 mb-2">📐 Image Guide — Desktop + Mobile</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {POSITIONS.map(p => (
                        <div key={p.value} className="bg-white rounded-xl p-3 border border-blue-100">
                            <p className="font-bold text-[12px] text-gray-800 mb-1">{p.label}</p>
                            <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mb-0.5">
                                <IconDeviceDesktop size={11} /> {p.desk}
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                                <IconDeviceMobile size={11} /> {p.mob}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-between mb-5">
                <p className="text-[13px] text-gray-500">{banners.length} banner{banners.length !== 1 ? 's' : ''} configured</p>
                <button onClick={() => setEditing('new')}
                    className="flex items-center gap-2 font-black text-[13px] px-5 h-10 rounded-xl border-none cursor-pointer transition-colors"
                    style={{ background: 'var(--color-primary)', color: 'var(--color-primary-text,#0a0a0a)' }}>
                    <IconPlus size={16} /> Add Banner
                </button>
            </div>

            <div className="space-y-3">
                {banners.map(b => (
                    <div key={b.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex items-stretch group hover:shadow-md transition-shadow">
                        {/* Thumbnail — shows both desktop and mobile preview */}
                        <div className="w-40 flex-shrink-0 bg-gray-50 overflow-hidden grid grid-cols-2">
                            <div className="relative overflow-hidden border-r border-gray-100">
                                {b.image
                                    ? <img src={b.image} alt="" className="w-full h-full object-cover" />
                                    : <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-gray-300"><IconDeviceDesktop size={18}/><span className="text-[9px]">No desktop</span></div>
                                }
                                <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-[8px] font-bold text-center py-0.5">DESKTOP</div>
                            </div>
                            <div className="relative overflow-hidden">
                                {(b as any).mobile_image
                                    ? <img src={(b as any).mobile_image} alt="" className="w-full h-full object-cover" />
                                    : <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-gray-300"><IconDeviceMobile size={18}/><span className="text-[9px]">Fallback</span></div>
                                }
                                <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-[8px] font-bold text-center py-0.5">MOBILE</div>
                            </div>
                        </div>

                        <div className="flex-1 px-5 py-4 min-w-0">
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <div className="text-[10.5px] font-black uppercase tracking-wider mb-0.5" style={{ color: 'var(--color-primary)' }}>
                                        {posMap[b.position] ?? b.position}
                                    </div>
                                    <div className="font-black text-gray-900 text-[15px] truncate">{b.title || <span className="text-gray-300 italic">No title</span>}</div>
                                    {b.subtitle && <div className="text-[12px] text-gray-400 mt-0.5 truncate">{b.subtitle}</div>}
                                    <div className="text-[11.5px] text-gray-400 mt-1.5 flex items-center gap-1">→ <span className="truncate">{b.link}</span></div>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${b.is_active ? 'bg-green-50 text-green-600 border-green-200' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>
                                        {b.is_active ? 'Active' : 'Hidden'}
                                    </span>
                                    <button onClick={() => setEditing(b)}
                                        className="w-8 h-8 rounded-lg border border-gray-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] flex items-center justify-center text-gray-400 bg-white cursor-pointer transition-all border-solid">
                                        <IconPencil size={14} />
                                    </button>
                                    <button onClick={() => confirm('Delete this banner?') && router.delete(`${ap}/banners/${b.id}`)}
                                        className="w-8 h-8 rounded-lg border border-gray-200 hover:border-red-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center text-gray-400 cursor-pointer transition-all border-solid">
                                        <IconTrash size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {banners.length === 0 && (
                    <div className="text-center py-16 text-gray-400">
                        <p className="text-[40px] mb-3">🖼️</p>
                        <p className="font-bold text-[15px] text-gray-600">No banners yet</p>
                        <p className="text-[13px] mt-1">Add your first banner to display on the homepage</p>
                    </div>
                )}
            </div>

            {editing && <BannerForm banner={editing === 'new' ? undefined : editing} onClose={() => setEditing(null)} />}
        </AdminLayout>
    )
}
