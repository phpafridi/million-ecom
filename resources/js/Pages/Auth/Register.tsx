import { Head, useForm, Link } from '@inertiajs/react'
import { IconMail, IconLock, IconUser } from '@tabler/icons-react'

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    })

    function submit(e: React.FormEvent) {
        e.preventDefault()
        post('/register')
    }

    const Field = ({ label, icon: Icon, type = 'text', field, placeholder }: any) => (
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
            <div className="relative">
                <Icon size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={type} value={(data as any)[field]} onChange={(e: any) => setData(field, e.target.value)}
                    placeholder={placeholder} required
                    className="w-full h-11 pl-10 pr-4 border-2 border-gray-200 rounded-xl text-sm outline-none transition-all focus:border-[var(--color-primary, #00c8ff)] focus:ring-4 focus:ring-[var(--color-primary, #00c8ff)]/10" />
            </div>
            {(errors as any)[field] && <p className="text-red-500 text-xs mt-1">{(errors as any)[field]}</p>}
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Head title="Create Account" />
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-[14px] bg-[#0d0d14] flex items-center justify-center">
                            <span className="font-manrope font-black text-[var(--color-primary, #00c8ff)] text-xl">M</span>
                        </div>
                        <div className="text-left">
                            <div className="font-manrope font-black text-2xl text-[#0d0d14] tracking-wider leading-none">MOIN</div>
                            <div className="text-[9px] text-[var(--color-primary, #00c8ff)] font-bold tracking-[.16em] uppercase">Manage Online IT Needs</div>
                        </div>
                    </div>
                    <p className="text-gray-500 text-sm mt-3">Create your account</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <form onSubmit={submit} className="space-y-4">
                        <Field label="Full Name" icon={IconUser} field="name" placeholder="Ali Khan" />
                        <Field label="Email address" icon={IconMail} type="email" field="email" placeholder="you@example.com" />
                        <Field label="Password" icon={IconLock} type="password" field="password" placeholder="Min. 8 characters" />
                        <Field label="Confirm Password" icon={IconLock} type="password" field="password_confirmation" placeholder="Repeat password" />

                        <button type="submit" disabled={processing}
                            className="w-full h-12 bg-[var(--color-primary, #00c8ff)] hover:bg-[var(--color-primary-dark, #00b0e0)] disabled:opacity-60 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[var(--color-primary, #00c8ff)]/30 mt-2">
                            {processing ? 'Creating account…' : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-6 pt-5 border-t border-gray-100 text-center">
                        <p className="text-sm text-gray-500">
                            Already have an account?{' '}
                            <Link href="/login" className="text-[var(--color-primary, #00c8ff)] font-semibold hover:text-[var(--color-primary-dark, #00b0e0)]">Sign in</Link>
                        </p>
                    </div>
                </div>

                <p className="text-center text-xs text-gray-400 mt-5">
                    <Link href="/" className="hover:text-[var(--color-primary, #00c8ff)] transition-colors">← Back to store</Link>
                </p>
            </div>
        </div>
    )
}
