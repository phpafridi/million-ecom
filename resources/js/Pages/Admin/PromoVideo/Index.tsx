import { Head, usePage, useForm } from '@inertiajs/react'
import { IconUpload, IconInfoCircle, IconPlayerPlay } from '@tabler/icons-react'
import AdminLayout from '@/Layouts/AdminLayout'
import { Input } from '@/Components/ui/Input'
import { Button } from '@/Components/ui/Button'

interface Props { current_video?: string; video_title: string; video_tag: string; video_cta: string }

export default function PromoVideoIndex({ current_video, video_title, video_tag, video_cta }: Props) {
    const { props: _p } = usePage<{ adminPath?: string }>()
    const ap = `/${_p.adminPath ?? 'ml-admin'}`
    const { data, setData, post, processing } = useForm<any>({
        video: null as File | null,
        video_title, video_tag, video_cta,
    })

    return (
        <AdminLayout title="Promo Video Card">
            <Head title="Promo Video — Admin" />
            <div className="max-w-2xl space-y-5">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-[13px] text-amber-800">
                    <strong>📹 Video Card</strong> — This video appears in the promo banner grid on the homepage (bottom-right card). Upload a short vertical/portrait promo video (9:16 ratio, max 50MB, MP4 recommended).
                </div>

                <form onSubmit={e => { e.preventDefault(); post(`${ap}/promo-video`) }} className="space-y-5">
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                        <h3 className="font-manrope font-bold text-[16px] text-gray-900 pb-3 border-b border-gray-100">Video Text Overlay</h3>
                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Tag / Badge</label>
                                <Input value={data.video_tag} onChange={(e: any) => setData('video_tag', e.target.value)} placeholder="🔥 Hot Deal" />
                            </div>
                            <div>
                                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Title</label>
                                <Input value={data.video_title} onChange={(e: any) => setData('video_title', e.target.value)} placeholder="ASUS ROG Gaming PCs" />
                            </div>
                            <div>
                                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Button Text</label>
                                <Input value={data.video_cta} onChange={(e: any) => setData('video_cta', e.target.value)} placeholder="Enquire Now" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                        <h3 className="font-manrope font-bold text-[16px] text-gray-900 pb-3 border-b border-gray-100">Video File</h3>
                        <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                            <IconInfoCircle size={15} className="text-blue-500 flex-shrink-0 mt-0.5" />
                            <div className="text-[12px] text-blue-700">
                                <strong>Recommended:</strong> Portrait/vertical video (9:16), 1080×1920px, 15–30 seconds, MP4 format, max 50MB. The video autoplays muted and loops.
                            </div>
                        </div>

                        {current_video && (
                            <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50" style={{ maxHeight: 200 }}>
                                <video src={current_video} className="h-[200px] mx-auto block object-contain" muted controls />
                            </div>
                        )}

                        <label className="flex items-center gap-3 border-2 border-dashed border-gray-200 hover:border-[var(--color-primary,#00c8ff)] rounded-xl px-4 py-4 cursor-pointer transition-colors">
                            <input type="file" accept="video/mp4,video/webm" className="hidden"
                                onChange={e => setData('video', e.target.files?.[0] ?? null)} />
                            <IconUpload size={20} className="text-[var(--color-primary,#00c8ff)] flex-shrink-0" />
                            <div>
                                <div className="text-[13.5px] font-semibold text-gray-700">{data.video ? data.video.name : 'Click to upload video'}</div>
                                <div className="text-[12px] text-gray-400">MP4 or WebM, max 50MB, portrait orientation</div>
                            </div>
                        </label>
                    </div>

                    <Button type="submit" disabled={processing} size="lg" className="w-full justify-center">
                        {processing ? 'Uploading…' : 'Save Promo Video'}
                    </Button>
                </form>
            </div>
        </AdminLayout>
    )
}
