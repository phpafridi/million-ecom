import { useState, useRef } from 'react'
import { IconUpload, IconX, IconCheck, IconDeviceDesktop, IconDeviceMobile, IconInfoCircle } from '@tabler/icons-react'

export interface ImageSpec { w: number; h: number; label: string; hint: string; required?: boolean }

interface Props {
    spec: ImageSpec
    current?: string | null
    onFile: (f: File) => void
    onRemove?: () => void
}

export default function ImageUpload({ spec, current, onFile, onRemove }: Props) {
    const [preview, setPreview] = useState<string | null>(current ?? null)
    const [err, setErr]         = useState<string | null>(null)
    const [ok, setOk]           = useState(false)
    const [drag, setDrag]       = useState(false)
    const inputRef              = useRef<HTMLInputElement>(null)

    function processFile(file: File) {
        setErr(null); setOk(false)
        const img = new Image()
        const url = URL.createObjectURL(file)
        img.onload = () => {
            // Warn but don't block — wrong size shows a warning, not a hard error
            const okW = img.width  >= spec.w * 0.7
            const okH = img.height >= spec.h * 0.7
            if (!okW || !okH) {
                setErr(`Image is ${img.width}×${img.height}px — recommended ~${spec.w}×${spec.h}px. It may look stretched or cropped.`)
            }
            setPreview(url); setOk(true); onFile(file)
        }
        img.src = url
    }

    function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
        const f = e.target.files?.[0]; if (f) processFile(f)
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault(); setDrag(false)
        const f = e.dataTransfer.files?.[0]; if (f && f.type.startsWith('image/')) processFile(f)
    }

    // Visual aspect ratio for the preview box
    const ratio = spec.w / spec.h
    const previewH = Math.min(140, Math.max(80, 140 / ratio))

    return (
        <div className="space-y-2">
            {/* Spec info */}
            <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-100 rounded-xl">
                <IconInfoCircle size={13} className="text-blue-400 flex-shrink-0" />
                <span className="text-[11.5px] text-blue-700 font-semibold">{spec.w}×{spec.h}px — {spec.hint}</span>
            </div>

            {/* Preview */}
            {preview && (
                <div className="relative rounded-xl overflow-hidden border-2 border-gray-100 bg-gray-50"
                    style={{ height: previewH, background: 'repeating-conic-gradient(#f0f0f0 0% 25%, white 0% 50%) 0 0 / 16px 16px' }}>
                    <img src={preview} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    {onRemove && (
                        <button type="button"
                            onClick={() => { setPreview(null); setOk(false); onRemove() }}
                            className="absolute top-2 right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center border-none cursor-pointer shadow-lg transition-colors">
                            <IconX size={13} />
                        </button>
                    )}
                    <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/50 text-white text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-sm">
                        <IconCheck size={10} /> Ready
                    </div>
                    <button type="button" onClick={() => inputRef.current?.click()}
                        className="absolute bottom-2 right-2 flex items-center gap-1.5 bg-white/90 hover:bg-white text-gray-700 text-[10px] font-bold px-2 py-1 rounded-full border-none cursor-pointer shadow transition-colors">
                        <IconUpload size={10} /> Replace
                    </button>
                </div>
            )}

            {/* Drop zone */}
            {!preview && (
                <div
                    onClick={() => inputRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); setDrag(true) }}
                    onDragLeave={() => setDrag(false)}
                    onDrop={handleDrop}
                    className="flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl cursor-pointer transition-all py-6"
                    style={{
                        borderColor: drag ? 'var(--color-primary)' : '#E5E7EB',
                        background: drag ? 'rgba(var(--color-primary-rgb, 201,168,76),0.04)' : '#FAFAFA',
                    }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: 'var(--color-primary,#C9A84C)20' }}>
                        <IconUpload size={20} style={{ color: 'var(--color-primary,#C9A84C)' }} />
                    </div>
                    <div className="text-center">
                        <p className="text-[13px] font-bold text-gray-700">Click or drag image here</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">PNG, JPG, WebP — max 10MB</p>
                    </div>
                </div>
            )}

            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

            {/* Warning (not blocking) */}
            {err && (
                <div className="flex items-start gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl">
                    <IconInfoCircle size={13} className="text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-[11.5px] text-amber-700">{err}</p>
                </div>
            )}
        </div>
    )
}

// ── Dual upload: Desktop + Mobile in one component ─────────────────────────────
interface DualProps {
    label: string
    desktopSpec: ImageSpec
    mobileSpec: ImageSpec
    currentDesktop?: string | null
    currentMobile?: string | null
    onDesktopFile: (f: File) => void
    onMobileFile: (f: File) => void
}

export function DualImageUpload({ label, desktopSpec, mobileSpec, currentDesktop, currentMobile, onDesktopFile, onMobileFile }: DualProps) {
    const [tab, setTab] = useState<'desktop' | 'mobile'>('desktop')
    const hasDesktop = !!currentDesktop
    const hasMobile  = !!currentMobile

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-gray-800">{label}</span>
                <div className="flex bg-gray-100 rounded-lg p-0.5 gap-0.5">
                    <button type="button" onClick={() => setTab('desktop')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-bold border-none cursor-pointer transition-all"
                        style={tab === 'desktop'
                            ? { background: 'white', color: 'var(--color-dark-bg,#0a0a0a)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }
                            : { background: 'transparent', color: '#9CA3AF' }}>
                        <IconDeviceDesktop size={13} />
                        Desktop {hasDesktop && <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />}
                    </button>
                    <button type="button" onClick={() => setTab('mobile')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-bold border-none cursor-pointer transition-all"
                        style={tab === 'mobile'
                            ? { background: 'white', color: 'var(--color-dark-bg,#0a0a0a)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }
                            : { background: 'transparent', color: '#9CA3AF' }}>
                        <IconDeviceMobile size={13} />
                        Mobile {hasMobile && <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />}
                        {!hasMobile && <span className="text-[9px] text-gray-400">(optional)</span>}
                    </button>
                </div>
            </div>

            {tab === 'desktop' ? (
                <ImageUpload spec={desktopSpec} current={currentDesktop} onFile={onDesktopFile} />
            ) : (
                <div className="space-y-2">
                    <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 border border-purple-100 rounded-xl">
                        <IconDeviceMobile size={13} className="text-purple-400 flex-shrink-0" />
                        <span className="text-[11.5px] text-purple-700 font-medium">
                            If not set, the desktop image is used on mobile as a fallback. Upload a portrait/square image for best mobile results.
                        </span>
                    </div>
                    <ImageUpload spec={mobileSpec} current={currentMobile} onFile={onMobileFile} />
                </div>
            )}
        </div>
    )
}
