import { Head, useForm, Link } from '@inertiajs/react'
import { IconMail, IconLock, IconUser, IconPhone, IconMapPin } from '@tabler/icons-react'

// Field defined OUTSIDE to prevent remount + focus loss
interface FP {
    label: string; icon: any; type?: string
    placeholder: string; value: string
    onChange: (v: string) => void; error?: string; required?: boolean
}
function Field({ label, icon: Icon, type = 'text', placeholder, value, onChange, error, required = false }: FP) {
    return (
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {label}{required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            <div className="relative">
                <Icon size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input type={type} value={value} onChange={e => onChange(e.target.value)}
                    placeholder={placeholder} required={required}
                    className="w-full h-11 pl-10 pr-4 border-2 border-gray-200 rounded-xl text-sm outline-none transition-all focus:border-[var(--color-primary,#C9A84C)]" />
            </div>
            {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
        </div>
    )
}

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '', email: '', phone: '', address: '', city: '',
        password: '', password_confirmation: '',
    })
    function submit(e: React.FormEvent) { e.preventDefault(); post('/register') }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Head title="Create Account" />
            <div className="w-full max-w-lg">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-3 mb-3 no-underline">
                        <div className="w-12 h-12 rounded-[14px] flex items-center justify-center"
                            style={{ background: 'var(--color-dark-bg,#0a0a0a)' }}>
                            <span className="font-manrope font-black text-xl"
                                style={{ color: 'var(--color-primary,#C9A84C)' }}>M</span>
                        </div>
                        <div className="text-left">
                            <div className="font-manrope font-black text-2xl tracking-wider leading-none"
                                style={{ color: 'var(--color-dark-bg,#0a0a0a)' }}>MILLIONAIRE</div>
                            <div className="text-[9px] font-bold tracking-[.16em] uppercase"
                                style={{ color: 'var(--color-primary,#C9A84C)' }}>Wear Your Status</div>
                        </div>
                    </Link>
                    <p className="text-gray-500 text-sm mt-2">Create your account to start shopping</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <form onSubmit={submit} className="space-y-4">

                        {/* Required fields */}
                        <Field required label="Full Name"     icon={IconUser} placeholder="Ali Khan"       value={data.name}     onChange={v => setData('name', v)}     error={errors.name} />
                        <Field required label="Email"         icon={IconMail} type="email" placeholder="you@example.com" value={data.email} onChange={v => setData('email', v)} error={errors.email} />
                        <Field required label="Password"      icon={IconLock} type="password" placeholder="Min. 8 characters" value={data.password} onChange={v => setData('password', v)} error={errors.password} />
                        <Field required label="Confirm Password" icon={IconLock} type="password" placeholder="Repeat password" value={data.password_confirmation} onChange={v => setData('password_confirmation', v)} error={errors.password_confirmation} />

                        {/* Optional but pre-fills checkout */}
                        <div className="pt-2 border-t border-gray-100">
                            <p className="text-[11.5px] font-semibold text-gray-400 mb-3 uppercase tracking-wide">
                                Delivery Info (optional — auto-fills checkout)
                            </p>
                            <div className="space-y-4">
                                <Field label="Phone Number" icon={IconPhone} type="tel" placeholder="03XX XXXXXXX" value={data.phone} onChange={v => setData('phone', v)} error={errors.phone} />
                                <Field label="Default Address" icon={IconMapPin} placeholder="House #, Street, Area" value={data.address} onChange={v => setData('address', v)} error={errors.address} />
                                <Field label="City" icon={IconMapPin} placeholder="Karachi, Lahore, Peshawar…" value={data.city} onChange={v => setData('city', v)} error={errors.city} />
                            </div>
                        </div>

                        <button type="submit" disabled={processing}
                            style={{ background: 'var(--color-primary,#C9A84C)', color: 'var(--color-primary-text,#0a0a0a)' }}
                            className="w-full h-12 font-black text-[14px] rounded-xl flex items-center justify-center gap-2 hover:opacity-90 mt-2 disabled:opacity-60 border-none cursor-pointer transition-all">
                            {processing ? 'Creating account…' : 'Create Account →'}
                        </button>
                    </form>

                    <div className="mt-6 pt-5 border-t border-gray-100 text-center">
                        <p className="text-sm text-gray-500">Already have an account?{' '}
                            <Link href="/login" className="font-semibold no-underline"
                                style={{ color: 'var(--color-primary,#C9A84C)' }}>Sign in →</Link>
                        </p>
                    </div>
                </div>

                <p className="text-center text-xs text-gray-400 mt-5">
                    <Link href="/" className="no-underline hover:opacity-70"
                        style={{ color: 'var(--color-primary,#C9A84C)' }}>← Back to store</Link>
                </p>
            </div>
        </div>
    )
}
