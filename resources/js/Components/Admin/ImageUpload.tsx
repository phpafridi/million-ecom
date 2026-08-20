import { useState } from 'react'
import { IconUpload, IconInfoCircle, IconCheck, IconX } from '@tabler/icons-react'

export interface ImageSpec { w: number; h: number; label: string; hint: string; required?: boolean }

interface Props {
    spec: ImageSpec
    current?: string | null
    onFile: (f: File) => void
    onRemove?: () => void
}

export default function ImageUpload({ spec, current, onFile, onRemove }: Props) {
    const [preview, setPreview] = useState<string | null>(current ?? null)
    const [err, setErr] = useState<string | null>(null)
    const [ok, setOk] = useState(false)

    function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return
        setErr(null); setOk(false)

        const img = new Image()
        const url = URL.createObjectURL(file)
        img.onload = () => {
            const okW = img.width  >= spec.w * 0.8 && img.width  <= spec.w * 1.3
            const okH = img.height >= spec.h * 0.8 && img.height <= spec.h * 1.3
            if (!okW || !okH) {
                setErr(`Wrong size: ${img.width}×${img.height}px. Required: ~${spec.w}×${spec.h}px`)
                return
            }
            setPreview(url); setOk(true); onFile(file)
        }
        img.src = url
    }

    return (
        <div className="space-y-2">
            {/* Spec badge */}
            <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                <IconInfoCircle size={15} className="text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                    <span className="text-[12.5px] font-bold text-blue-800">{spec.label} — {spec.w}×{spec.h}px</span>
                    <div className="text-[12px] text-blue-600">{spec.hint}</div>
                </div>
            </div>

            {/* Preview */}
            {preview && (
                <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center" style={{ height: 90 }}>
                    <img src={preview} alt="" className="max-h-full max-w-full object-contain" />
                    {onRemove && (
                        <button type="button" onClick={() => { setPreview(null); setOk(false); onRemove() }}
                            className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors border-none cursor-pointer">
                            <IconX size={12} />
                        </button>
                    )}
                </div>
            )}

            {/* Upload label */}
            <label className={`flex items-center gap-3 border-2 border-dashed rounded-xl px-4 py-3 cursor-pointer transition-colors
                ${ok ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:border-[var(--color-primary, #00c8ff)] bg-white'}`}>
                <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
                {ok ? <IconCheck size={17} className="text-green-500 flex-shrink-0" /> : <IconUpload size={17} className="text-[var(--color-primary, #00c8ff)] flex-shrink-0" />}
                <span className="text-[13px] text-gray-500 truncate">
                    {ok ? 'Image ready ✓' : `Upload ${spec.w}×${spec.h}px image`}
                </span>
            </label>

            {err && (
                <p className="text-[12px] text-red-500 flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    <IconInfoCircle size={13} className="flex-shrink-0" /> {err}
                </p>
            )}
        </div>
    )
}
