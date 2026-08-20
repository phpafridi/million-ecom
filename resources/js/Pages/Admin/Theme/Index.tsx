import { Head, useForm, usePage } from '@inertiajs/react'
import { IconCheck, IconRefresh, IconSun, IconMoon, IconDeviceDesktop } from '@tabler/icons-react'
import AdminLayout from '@/Layouts/AdminLayout'

interface Theme {
    preset: string; primary: string; primary_dark: string; primary_text: string
    accent: string; dark_bg: string; dark_bg2: string; body_bg: string
    font_heading: string; font_body: string; border_radius: string; dark_mode: string
}
interface Props { theme: Theme }

const PRESETS = [
    { key:'cyan',   label:'Cyan',   colors:['#00c8ff','#0a0e1a','#e91e63'], desc:'Tech & Electronics' },
    { key:'purple', label:'Purple', colors:['#7c3aed','#1e1b4b','#f59e0b'], desc:'Fashion & Beauty' },
    { key:'green',  label:'Green',  colors:['#10b981','#064e3b','#f97316'], desc:'Health & Nature' },
    { key:'red',    label:'Red',    colors:['#ef4444','#1f0a0a','#3b82f6'], desc:'Food & Retail' },
    { key:'orange', label:'Orange', colors:['#f97316','#1c0a00','#8b5cf6'], desc:'Lifestyle & Sports' },
    { key:'custom', label:'Custom', colors:[],                               desc:'Your own colors' },
]

const PRESET_VALUES: Record<string, Partial<Theme>> = {
    cyan:   { primary:'#00c8ff', primary_dark:'#00b0e0', primary_text:'#0a0e1a', accent:'#e91e63', dark_bg:'#0a0e1a', dark_bg2:'#070b14', body_bg:'#f0f2f5' },
    purple: { primary:'#7c3aed', primary_dark:'#6d28d9', primary_text:'#ffffff', accent:'#f59e0b', dark_bg:'#1e1b4b', dark_bg2:'#0f0e29', body_bg:'#f5f3ff' },
    green:  { primary:'#10b981', primary_dark:'#059669', primary_text:'#ffffff', accent:'#f97316', dark_bg:'#064e3b', dark_bg2:'#022c22', body_bg:'#f0fdf4' },
    red:    { primary:'#ef4444', primary_dark:'#dc2626', primary_text:'#ffffff', accent:'#3b82f6', dark_bg:'#1f0a0a', dark_bg2:'#0f0505', body_bg:'#fff5f5' },
    orange: { primary:'#f97316', primary_dark:'#ea580c', primary_text:'#ffffff', accent:'#8b5cf6', dark_bg:'#1c0a00', dark_bg2:'#0f0500', body_bg:'#fff7ed' },
}

const FONTS = ['Inter','Manrope','Poppins','Nunito','Raleway','Roboto','Open Sans','Lato']

// ── Swatch is a module-level component — no auto-unfocus ──
function Swatch({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
    return (
        <div>
            <p className="text-[11.5px] font-semibold text-gray-500 mb-1.5">{label}</p>
            <div className="flex items-center gap-2">
                <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 cursor-pointer shadow-sm">
                    <input type="color" value={value} onChange={e => onChange(e.target.value)}
                        className="absolute inset-0 w-[200%] h-[200%] -top-2 -left-2 cursor-pointer border-none bg-transparent" />
                </div>
                <input value={value} onChange={e => onChange(e.target.value)}
                    className="flex-1 h-9 px-3 border border-gray-200 rounded-lg text-[12px] font-mono outline-none uppercase focus:border-[var(--color-primary)] transition-colors" />
            </div>
        </div>
    )
}

export default function ThemeIndex({ theme }: Props) {
    const { props: pageProps } = usePage<{ adminPath?: string }>()
    const ap = `/${pageProps.adminPath ?? 'tijar-admin'}`
    const { data, setData, post, processing } = useForm<Theme>({ ...theme })

    function applyPreset(key: string) {
        const vals = PRESET_VALUES[key]
        if (!vals) { setData('preset', 'custom'); return }
        const cssMap: Record<string, string> = {
            primary:'--color-primary', primary_dark:'--color-primary-dark',
            primary_text:'--color-primary-text', accent:'--color-accent',
            dark_bg:'--color-dark-bg', dark_bg2:'--color-dark-bg2', body_bg:'--color-body-bg',
        }
        Object.entries(vals).forEach(([k, v]) => {
            setData(k as keyof Theme, v as string)
            if (cssMap[k]) document.documentElement.style.setProperty(cssMap[k], v as string)
        })
        setData('preset', key)
    }

    function setColor(field: keyof Theme, val: string) {
        setData(field, val)
        const cssMap: Record<string, string> = {
            primary:'--color-primary', primary_dark:'--color-primary-dark',
            primary_text:'--color-primary-text', accent:'--color-accent',
            dark_bg:'--color-dark-bg', dark_bg2:'--color-dark-bg2', body_bg:'--color-body-bg',
        }
        if (cssMap[field]) document.documentElement.style.setProperty(cssMap[field], val)
        setData('preset', 'custom')
    }

    function submit(e: React.FormEvent) { e.preventDefault(); post(`${ap}/theme`) }

    return (
        <AdminLayout title="Theme & Branding">
            <Head title="Theme" />
            <form onSubmit={submit} className="max-w-5xl space-y-5">

                {/* Presets */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <h3 className="font-manrope font-bold text-[16px] mb-5">Color Preset</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                        {PRESETS.map(p => (
                            <button key={p.key} type="button" onClick={() => applyPreset(p.key)}
                                className={`flex flex-col items-center gap-2 p-3.5 rounded-xl border-2 cursor-pointer transition-all bg-white hover:shadow-md
                                    ${data.preset === p.key ? 'shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
                                style={data.preset === p.key ? { borderColor:'var(--color-primary)' } : {}}>
                                <div className="flex gap-1">
                                    {p.colors.length > 0
                                        ? p.colors.map((c, i) => <span key={i} className="w-4 h-4 rounded-full shadow-sm" style={{ background:c }} />)
                                        : <span className="text-lg">🎨</span>
                                    }
                                </div>
                                <span className="text-[12px] font-bold text-gray-800">{p.label}</span>
                                <span className="text-[10px] text-gray-400 text-center">{p.desc}</span>
                                {data.preset === p.key && <span className="text-[10px] font-black" style={{ color:'var(--color-primary)' }}>✓ Active</span>}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    <div className="lg:col-span-2 space-y-5">

                        {/* Custom colors */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-6">
                            <h3 className="font-manrope font-bold text-[15px] mb-5">Custom Colors</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                <Swatch label="Primary Color"   value={data.primary}      onChange={v => setColor('primary', v)} />
                                <Swatch label="Primary Hover"   value={data.primary_dark} onChange={v => setColor('primary_dark', v)} />
                                <Swatch label="Text on Primary" value={data.primary_text} onChange={v => setColor('primary_text', v)} />
                                <Swatch label="Accent / Badge"  value={data.accent}       onChange={v => setColor('accent', v)} />
                                <Swatch label="Dark Background" value={data.dark_bg}      onChange={v => setColor('dark_bg', v)} />
                                <Swatch label="Page Background" value={data.body_bg}      onChange={v => setColor('body_bg', v)} />
                            </div>
                        </div>

                        {/* Dark mode */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-6">
                            <h3 className="font-manrope font-bold text-[15px] mb-4">Color Scheme</h3>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { val:'light', icon:IconSun,           label:'Light',  desc:'Always light' },
                                    { val:'dark',  icon:IconMoon,          label:'Dark',   desc:'Always dark' },
                                    { val:'auto',  icon:IconDeviceDesktop, label:'Auto',   desc:'Follows system' },
                                ].map(m => (
                                    <button key={m.val} type="button" onClick={() => setData('dark_mode', m.val)}
                                        className={`flex flex-col items-center gap-2.5 p-4 rounded-xl border-2 cursor-pointer transition-all bg-white
                                            ${data.dark_mode === m.val ? 'shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
                                        style={data.dark_mode === m.val ? { borderColor:'var(--color-primary)' } : {}}>
                                        <m.icon size={22} style={{ color: data.dark_mode === m.val ? 'var(--color-primary)' : '#9ca3af' }} />
                                        <div>
                                            <div className={`text-[12.5px] font-bold ${data.dark_mode === m.val ? '' : 'text-gray-600'}`}
                                                style={data.dark_mode === m.val ? { color:'var(--color-primary)' } : {}}>
                                                {m.label}
                                            </div>
                                            <div className="text-[11px] text-gray-400">{m.desc}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Typography */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-6">
                            <h3 className="font-manrope font-bold text-[15px] mb-5">Typography & Shape</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                <div>
                                    <label className="block text-[12px] font-semibold text-gray-500 mb-2">Heading Font</label>
                                    <select value={data.font_heading} onChange={e => setData('font_heading', e.target.value)}
                                        className="w-full h-10 px-3 border border-gray-200 rounded-xl text-[13px] outline-none bg-white focus:border-[var(--color-primary)]">
                                        {FONTS.map(f => <option key={f}>{f}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[12px] font-semibold text-gray-500 mb-2">Body Font</label>
                                    <select value={data.font_body} onChange={e => setData('font_body', e.target.value)}
                                        className="w-full h-10 px-3 border border-gray-200 rounded-xl text-[13px] outline-none bg-white focus:border-[var(--color-primary)]">
                                        {FONTS.map(f => <option key={f}>{f}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[12px] font-semibold text-gray-500 mb-2">
                                        Border Radius <span className="font-normal text-gray-400">({data.border_radius}px)</span>
                                    </label>
                                    <input type="range" min="0" max="24" value={data.border_radius}
                                        onChange={e => {
                                            setData('border_radius', e.target.value)
                                            document.documentElement.style.setProperty('--radius', e.target.value + 'px')
                                        }}
                                        className="w-full" style={{ accentColor:'var(--color-primary)' }} />
                                    <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
                                        <span>Sharp</span><span>Rounded</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: preview + save */}
                    <div className="space-y-4">
                        {/* Mini preview */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-4">
                            <h3 className="font-bold text-[14px] text-gray-800 mb-3">Live Preview</h3>
                            <div className="rounded-xl overflow-hidden border border-gray-200 text-[10px]">
                                <div className="h-7 flex items-center px-3 gap-2" style={{ background:data.dark_bg }}>
                                    <div className="w-4 h-4 rounded-md flex items-center justify-center font-black text-[8px]"
                                        style={{ background:data.primary, color:data.primary_text }}>T</div>
                                    {['Home','Shop'].map((l,i) => (
                                        <span key={l} style={{ color: i===0 ? data.primary : 'rgba(255,255,255,0.5)', fontSize:8 }}>{l}</span>
                                    ))}
                                </div>
                                <div className="p-3" style={{ background:data.body_bg }}>
                                    <div className="h-1.5 w-16 rounded-full mb-2" style={{ background:data.primary }} />
                                    <div className="grid grid-cols-2 gap-1.5">
                                        {[1,2].map(i => (
                                            <div key={i} className="bg-white rounded-lg p-2 border border-gray-100">
                                                <div className="h-8 rounded-md bg-gray-100 mb-1.5" />
                                                <div className="h-1 w-full bg-gray-200 rounded mb-2" />
                                                <div className="h-4 rounded-md flex items-center justify-center"
                                                    style={{ background:data.primary, color:data.primary_text, fontSize:7, fontWeight:700 }}>
                                                    Add to Cart
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="h-6 flex items-center justify-center" style={{ background:data.dark_bg2 }}>
                                    <span style={{ color:data.primary, fontSize:7, fontWeight:700 }}>Your Store</span>
                                </div>
                            </div>
                            <p className="text-[11px] text-gray-400 mt-2 text-center">Updates live as you pick colors</p>
                        </div>

                        <button type="submit" disabled={processing}
                            className="w-full h-12 font-black text-[14px] rounded-xl border-none cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                            style={{ background:'var(--color-primary)', color:'var(--color-primary-text)' }}>
                            <IconCheck size={18} /> {processing ? 'Saving…' : 'Save Theme'}
                        </button>

                        <button type="button" onClick={() => applyPreset('cyan')}
                            className="w-full h-10 font-semibold text-[13px] rounded-xl border border-gray-200 bg-white text-gray-600 hover:border-gray-300 cursor-pointer flex items-center justify-center gap-2">
                            <IconRefresh size={15} /> Reset to Default
                        </button>

                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-[12px] text-blue-700">
                            💡 Changes are previewed live. Click <strong>Save Theme</strong> to apply to all visitors.
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    )
}
