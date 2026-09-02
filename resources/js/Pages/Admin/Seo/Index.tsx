import { Head, usePage, useForm } from '@inertiajs/react'
import { useState } from 'react'
import { IconInfoCircle, IconUpload, IconExternalLink, IconWorld, IconRobot } from '@tabler/icons-react'
import AdminLayout from '@/Layouts/AdminLayout'
import { Input } from '@/Components/ui/Input'
import { Button } from '@/Components/ui/Button'

interface Props {
    seo: {
        meta_title: string
        meta_description: string
        meta_keywords: string
        site_url: string
        favicon_url?: string | null
        og_image_url?: string | null
        seo_indexing_enabled: string
        custom_head_scripts: string
        google_site_verification: string
    }
}

function Section({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6">
            <h3 className="font-manrope font-bold text-[15px] sm:text-[16px] text-gray-900 pb-3 sm:pb-4 border-b border-gray-100 mb-4 sm:mb-5 flex items-center gap-2">
                {icon} {title}
            </h3>
            <div className="space-y-4">{children}</div>
        </div>
    )
}

function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: React.ReactNode }) {
    return (
        <div>
            <label className="block text-[12.5px] sm:text-[13px] font-semibold text-gray-700 mb-1">{label}</label>
            {hint && <p className="text-[11.5px] sm:text-[12px] text-gray-400 mb-1.5">{hint}</p>}
            {children}
            {error && <p className="text-[11.5px] text-red-500 mt-1">{error}</p>}
        </div>
    )
}

function ImageUploadField({ label, w, h, hint, current, onFile }: {
    label: string; w: number; h: number; hint: string; current?: string | null; onFile: (f: File) => void
}) {
    const [preview, setPreview] = useState<string | null>(current ?? null)
    const [err, setErr] = useState('')

    function handle(e: React.ChangeEvent<HTMLInputElement>) {
        const f = e.target.files?.[0]; if (!f) return
        setErr('')
        const img = new Image()
        img.onload = () => {
            if (img.width < w * 0.5 || img.height < h * 0.5) {
                setErr(`Too small: ${img.width}×${img.height}px. Recommended ~${w}×${h}px`)
                return
            }
            setPreview(URL.createObjectURL(f))
            onFile(f)
        }
        img.src = URL.createObjectURL(f)
    }

    return (
        <div>
            <div className="flex items-start gap-2 p-2.5 bg-blue-50 border border-blue-100 rounded-lg mb-2">
                <IconInfoCircle size={14} className="text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="text-[11.5px] sm:text-[12px]">
                    <span className="font-bold text-blue-800">{label}: {w}×{h}px</span>
                    <span className="text-blue-600 ml-1">— {hint}</span>
                </div>
            </div>
            {preview && (
                <div className="mb-2 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center" style={{ height: w === h ? 60 : 90 }}>
                    <img src={preview} alt="" className="max-h-full max-w-full object-contain" />
                </div>
            )}
            <label className="flex items-center gap-2.5 border-2 border-dashed border-gray-200 hover:border-[var(--color-primary,#00c8ff)] rounded-xl px-4 py-2.5 cursor-pointer transition-colors">
                <input type="file" accept="image/*" className="hidden" onChange={handle} />
                <IconUpload size={16} className="text-[var(--color-primary,#00c8ff)] flex-shrink-0" />
                <span className="text-[12px] sm:text-[12.5px] text-gray-500">Upload {w}×{h}px image</span>
            </label>
            {err && <p className="text-[11.5px] text-red-500 mt-1">{err}</p>}
        </div>
    )
}

export default function SeoIndex({ seo }: Props) {
    const { props: _p } = usePage<{ adminPath?: string; auth?: { user?: { role?: string } } }>()
    const authRole = _p.auth?.user?.role ?? ''
    const ap = `/${_p.adminPath ?? 'ml-admin'}`
    const { data, setData, post, processing, errors } = useForm<any>({
        meta_title: seo.meta_title,
        meta_description: seo.meta_description,
        meta_keywords: seo.meta_keywords,
        site_url: seo.site_url,
        seo_indexing_enabled: seo.seo_indexing_enabled,
        custom_head_scripts: seo.custom_head_scripts,
        favicon: null as File | null,
        og_image: null as File | null,
        google_site_verification: seo.google_site_verification,
    })

    function submit(e: React.FormEvent) {
        e.preventDefault()
        post(`${ap}/seo`)
    }

    return (
        <AdminLayout title="SEO Settings">
            <Head title="SEO — Admin" />

            <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-5 max-w-5xl">
                <div className="lg:col-span-2 space-y-5">

                    <Section title="Search Engine Meta Tags" icon="🔍">
                        <Field label="Meta Title" hint="Shown in browser tabs and Google search results (max 70 chars)" error={errors.meta_title}>
                            <Input value={data.meta_title} onChange={(e: any) => setData('meta_title', e.target.value)}
                                placeholder="Millionaire Online Store" maxLength={70} />
                            <div className="text-[11px] text-gray-400 mt-1">{data.meta_title.length}/70</div>
                        </Field>
                        <Field label="Meta Description" hint="Shown under your title in search results (max 160 chars)" error={errors.meta_description}>
                            <textarea value={data.meta_description} onChange={e => setData('meta_description', e.target.value)} rows={3} maxLength={160}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-[13px] sm:text-[13.5px] outline-none focus:border-[var(--color-primary,#00c8ff)] resize-none transition-all" />
                            <div className="text-[11px] text-gray-400 mt-1">{data.meta_description.length}/160</div>
                        </Field>
                        <Field label="Meta Keywords" hint="Comma-separated keywords (less important for modern SEO, still supported)">
                            <Input value={data.meta_keywords} onChange={(e: any) => setData('meta_keywords', e.target.value)}
                                placeholder="laptops, smartphones, gaming pc, pakistan electronics" />
                        </Field>
                        <Field label="Canonical Site URL" hint="Your live domain — used for sitemap and canonical tags" error={errors.site_url}>
                            <Input value={data.site_url} onChange={(e: any) => setData('site_url', e.target.value)} placeholder="https://millionairepk.com" />
                        </Field>
                    </Section>

                    <Section title="Indexing & Crawling" icon={<IconRobot size={18} className="text-[var(--color-primary,#00c8ff)]" />}>
                        <label className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl cursor-pointer">
                            <div>
                                <div className="text-[13px] font-semibold text-gray-800">Allow search engines to index this site</div>
                                <div className="text-[11.5px] text-gray-400 mt-0.5">Turn off only if the site is in maintenance or staging mode</div>
                            </div>
                            <button type="button" onClick={() => setData('seo_indexing_enabled', data.seo_indexing_enabled === '1' ? '0' : '1')}
                                className={`w-11 h-6 rounded-full transition-all relative flex-shrink-0 border-none cursor-pointer ${data.seo_indexing_enabled === '1' ? 'bg-[var(--color-primary,#00c8ff)]' : 'bg-gray-300'}`}>
                                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${data.seo_indexing_enabled === '1' ? 'left-5.5' : 'left-0.5'}`} style={{ left: data.seo_indexing_enabled === '1' ? 22 : 2 }} />
                            </button>
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer"
                                className="flex items-center justify-between p-3.5 border border-gray-200 rounded-xl hover:border-[var(--color-primary,#00c8ff)] transition-all no-underline group">
                                <div>
                                    <div className="text-[13px] font-semibold text-gray-800">View Sitemap</div>
                                    <div className="text-[11.5px] text-gray-400">/sitemap.xml — auto-generated</div>
                                </div>
                                <IconExternalLink size={16} className="text-gray-400 group-hover:text-[var(--color-primary,#00c8ff)]" />
                            </a>
                            <a href="/robots.txt" target="_blank" rel="noopener noreferrer"
                                className="flex items-center justify-between p-3.5 border border-gray-200 rounded-xl hover:border-[var(--color-primary,#00c8ff)] transition-all no-underline group">
                                <div>
                                    <div className="text-[13px] font-semibold text-gray-800">View robots.txt</div>
                                    <div className="text-[11.5px] text-gray-400">/robots.txt — auto-generated</div>
                                </div>
                                <IconExternalLink size={16} className="text-gray-400 group-hover:text-[var(--color-primary,#00c8ff)]" />
                            </a>
                        </div>
                    </Section>

                    <Section title="Search Console Verification" icon="✅">
                        <Field label="Google Search Console Verification Code" hint="From Search Console → Settings → Ownership verification → HTML tag method. Paste just the content value, not the full tag.">
                            <Input value={data.google_site_verification} onChange={(e: any) => setData('google_site_verification', e.target.value)}
                                placeholder="abcXYZ123..." />
                        </Field>
                    </Section>

                    <a href={`${ap}/analytics`} className="block bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 text-white no-underline hover:opacity-90 transition-opacity">
                        <div className="text-[13px] font-bold flex items-center gap-2">📊 Looking for Google Analytics, GTM, or Pixel IDs?</div>
                        <div className="text-[12px] text-gray-300 mt-1">Those live on the dedicated Analytics page →</div>
                    </a>

                    <Section title="Advanced — Custom Head Scripts" icon="⚙️">
                        <div className="mb-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-[12.5px] text-amber-800 leading-relaxed">
                            ⚠️ <strong>This runs on every single customer page load, unrestricted.</strong> Only
                            paste code from sources you fully trust — this is not sandboxed. For Google Analytics,
                            Meta Pixel, GTM, or TikTok Pixel specifically, use the Analytics page instead
                            (safer — they don't accept arbitrary script). Restricted to full Admin accounts only.
                        </div>
                        <Field label="Custom HTML / Analytics Scripts" hint={authRole === 'admin' ? "Paste tracking scripts not covered by the dedicated fields above." : "Only full Admin accounts can edit this field."}>
                            <textarea value={data.custom_head_scripts} onChange={e => setData('custom_head_scripts', e.target.value)} rows={5}
                                disabled={authRole !== 'admin'}
                                placeholder="<script>...</script>"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-[12.5px] font-mono outline-none focus:border-[var(--color-primary,#00c8ff)] resize-none transition-all disabled:bg-gray-50 disabled:text-gray-400" />
                        </Field>
                    </Section>
                </div>

                {/* Right col — images */}
                <div className="space-y-5">
                    <Section title="Favicon & Social Image" icon={<IconWorld size={18} className="text-[var(--color-primary,#00c8ff)]" />}>
                        <ImageUploadField label="Favicon" w={64} h={64} hint="Square icon shown in browser tabs"
                            current={seo.favicon_url} onFile={f => setData('favicon', f)} />
                        <ImageUploadField label="Social Share Image (OG)" w={1200} h={630} hint="Shown when your link is shared on Facebook, Twitter, WhatsApp"
                            current={seo.og_image_url} onFile={f => setData('og_image', f)} />
                    </Section>

                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-[12.5px] text-amber-800">
                        <strong>💡 Tip:</strong> After saving, share your homepage link on WhatsApp or Facebook to preview how your social image and title appear.
                    </div>

                    <Button type="submit" size="lg" disabled={processing} className="w-full justify-center">
                        {processing ? 'Saving…' : 'Save SEO Settings'}
                    </Button>
                </div>
            </form>
        </AdminLayout>
    )
}
