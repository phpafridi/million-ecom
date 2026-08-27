import { Head, useForm, usePage } from '@inertiajs/react'
import { IconUser, IconLock, IconCheck } from '@tabler/icons-react'
import AdminLayout from '@/Layouts/AdminLayout'

interface Props { user: { id: number; name: string; email: string } }

function ProfileField({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <label className="block text-[13px] font-semibold text-gray-700 mb-1">{label}</label>
            {children}
        </div>
    )
}

export default function Profile({ user }: Props) {
    const { props } = usePage<{ adminPath?: string }>()
    const ap = `/${props.adminPath ?? 'ml-admin'}`

    const { data, setData, post, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        current_password: '',
        password: '',
        password_confirmation: '',
    })

    function submit(e: React.FormEvent) {
        e.preventDefault()
        post(`${ap}/profile`)
    }

    const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
        <div>
            <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">{label}</label>
            {children}
        </div>
    )

    return (
        <AdminLayout title="My Profile">
            <Head title="Profile — Admin" />
            <div className="max-w-2xl">
                <form onSubmit={submit} className="space-y-5">

                    {/* Account info */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <h3 className="font-manrope font-bold text-[15px] mb-5 flex items-center gap-2">
                            <IconUser size={18} style={{ color: 'var(--color-primary)' }} /> Account Information
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <ProfileField label="Full Name">
                                <input value={data.name} onChange={e => setData('name', e.target.value)} required
                                    className="w-full h-11 px-4 border-2 border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)] transition-colors" />
                                {errors.name && <p className="text-[12px] text-red-500 mt-1">{errors.name}</p>}
                            </ProfileField>
                            <ProfileField label="Email Address">
                                <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} required
                                    className="w-full h-11 px-4 border-2 border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)] transition-colors" />
                                {errors.email && <p className="text-[12px] text-red-500 mt-1">{errors.email}</p>}
                            </ProfileField>
                        </div>
                    </div>

                    {/* Change password */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <h3 className="font-manrope font-bold text-[15px] mb-2 flex items-center gap-2">
                            <IconLock size={18} style={{ color: 'var(--color-primary)' }} /> Change Password
                        </h3>
                        <p className="text-[12.5px] text-gray-400 mb-5">Leave blank to keep your current password.</p>
                        <div className="space-y-4">
                            <ProfileField label="Current Password">
                                <input type="password" value={data.current_password} onChange={e => setData('current_password', e.target.value)}
                                    placeholder="Enter current password"
                                    className="w-full h-11 px-4 border-2 border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)] transition-colors" />
                                {errors.current_password && <p className="text-[12px] text-red-500 mt-1">{errors.current_password}</p>}
                            </ProfileField>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <ProfileField label="New Password">
                                    <input type="password" value={data.password} onChange={e => setData('password', e.target.value)}
                                        placeholder="Min 8 characters"
                                        className="w-full h-11 px-4 border-2 border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)] transition-colors" />
                                    {errors.password && <p className="text-[12px] text-red-500 mt-1">{errors.password}</p>}
                                </ProfileField>
                                <ProfileField label="Confirm New Password">
                                    <input type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)}
                                        placeholder="Repeat new password"
                                        className="w-full h-11 px-4 border-2 border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)] transition-colors" />
                                </ProfileField>
                            </div>
                        </div>
                    </div>

                    <button type="submit" disabled={processing}
                        className="flex items-center justify-center gap-2 h-11 px-8 font-black text-[13px] rounded-xl border-none cursor-pointer disabled:opacity-60 transition-all"
                        style={{ background: 'var(--color-primary)', color: 'var(--color-primary-text)' }}>
                        <IconCheck size={16} /> {processing ? 'Saving…' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </AdminLayout>
    )
}
