import { Head, useForm, Link, usePage } from '@inertiajs/react'
import { IconMail, IconLock, IconLogin } from '@tabler/icons-react'

interface Props { settings?: Record<string, string> }

export default function Login({ settings }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        email: '', password: '', remember: false,
    })
    const siteName = settings?.site_name ?? 'Tijar Store'
    const tagline  = settings?.site_tagline ?? 'Admin Panel'
    const initial  = siteName[0]?.toUpperCase() ?? 'T'

    function submit(e: React.FormEvent) { e.preventDefault(); post('/login') }

    return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ background:'var(--color-body-bg, #f0f2f5)' }}>
            <Head title={`Sign In — ${siteName}`} />
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-[14px] flex items-center justify-center shadow-lg"
                            style={{ background:'var(--color-dark-bg, #0a0e1a)' }}>
                            <span className="font-manrope font-black text-xl" style={{ color:'var(--color-primary, #00c8ff)' }}>{initial}</span>
                        </div>
                        <div className="text-left">
                            <div className="font-manrope font-black text-2xl tracking-wider leading-none" style={{ color:'var(--color-dark-bg, #0a0e1a)' }}>{siteName.toUpperCase()}</div>
                            <div className="text-[10px] font-bold tracking-[.16em] uppercase mt-0.5" style={{ color:'var(--color-primary, #00c8ff)' }}>{tagline}</div>
                        </div>
                    </div>
                    <p className="text-gray-500 text-sm mt-3">Sign in to your admin account</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email address</label>
                            <div className="relative">
                                <IconMail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input type="email" value={data.email} onChange={e => setData('email', e.target.value)}
                                    placeholder="admin@yourstore.com" required autoFocus
                                    className="w-full h-11 pl-10 pr-4 border-2 border-gray-200 rounded-xl text-sm outline-none transition-all focus:border-[var(--color-primary,#00c8ff)]"/>
                            </div>
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                            <div className="relative">
                                <IconLock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input type="password" value={data.password} onChange={e => setData('password', e.target.value)}
                                    placeholder="••••••••" required
                                    className="w-full h-11 pl-10 pr-4 border-2 border-gray-200 rounded-xl text-sm outline-none transition-all focus:border-[var(--color-primary,#00c8ff)]"/>
                            </div>
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                        </div>
                        <label className="flex items-center gap-2.5 cursor-pointer">
                            <input type="checkbox" checked={data.remember} onChange={e => setData('remember', e.target.checked)}
                                className="w-4 h-4 rounded cursor-pointer" style={{ accentColor:'var(--color-primary,#00c8ff)' }}/>
                            <span className="text-sm text-gray-600">Remember me</span>
                        </label>
                        <button type="submit" disabled={processing}
                            className="w-full h-12 disabled:opacity-60 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 border-none cursor-pointer"
                            style={{ background:'var(--color-primary,#00c8ff)', color:'var(--color-primary-text,#0a0e1a)' }}>
                            <IconLogin size={18}/>
                            {processing ? 'Signing in…' : 'Sign In'}
                        </button>
                    </form>
                    <div className="mt-6 pt-5 border-t border-gray-100 text-center">
                        <p className="text-sm text-gray-500">
                            Don't have an account?{' '}
                            <Link href="/register" className="font-semibold no-underline" style={{ color:'var(--color-primary,#00c8ff)' }}>Create one</Link>
                        </p>
                    </div>
                </div>
                <p className="text-center text-xs text-gray-400 mt-5">
                    <Link href="/" className="hover:underline no-underline text-gray-400">← Back to store</Link>
                </p>
            </div>
        </div>
    )
}
