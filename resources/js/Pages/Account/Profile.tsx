import { Head, useForm, usePage } from '@inertiajs/react'
import StorefrontLayout from '@/Layouts/StorefrontLayout'
import AccountSidebar from './Partials/AccountSidebar'
import { IconUser, IconLock, IconCheck, IconMapPin, IconPlus, IconTrash } from '@tabler/icons-react'
import { useState } from 'react'

interface Address { id: number; label: string; full_name: string; phone: string; address: string; city: string; is_default: boolean }
interface Props {
    user: any; addresses: Address[]
    settings: Record<string, string>; auth: any
}

export default function AccountProfile({ user, addresses, settings, auth }: Props) {
    const { props } = usePage<any>()
    const flash = props.flash

    const [tab, setTab] = useState<'info'|'password'|'address'>('info')

    const profileForm = useForm({
        name: user.name ?? '',
        email: user.email ?? '',
        phone: user.phone ?? '',
        gender: user.gender ?? '',
        city: user.city ?? '',
        address: user.address ?? '',
        date_of_birth: user.date_of_birth ?? '',
        newsletter_subscribed: user.newsletter_subscribed ?? false,
    })

    const passForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    })

    const addrForm = useForm({
        label: 'Home',
        full_name: '',
        phone: '',
        address: '',
        city: '',
        is_default: false,
    })

    const [showAddrForm, setShowAddrForm] = useState(false)

    return (
        <StorefrontLayout auth={auth} settings={settings}>
            <Head title="My Profile" />
            <div className="min-h-screen py-0 lg:py-8 px-0 lg:px-4" style={{ background: 'var(--color-body-bg)' }}>
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
                        <AccountSidebar auth={auth} />

                        <div className="lg:col-span-3 space-y-4 px-4 pt-5 lg:px-0 lg:pt-0">

                            {/* Success Message */}
                            {flash?.success && (
                                <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-[13.5px] font-semibold">
                                    <IconCheck size={16} /> {flash.success}
                                </div>
                            )}

                            {/* Tabs */}
                            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                                <div className="flex border-b border-gray-100">
                                    {[
                                        { key: 'info',     label: 'Personal Info', icon: IconUser },
                                        { key: 'password', label: 'Password',      icon: IconLock },
                                        { key: 'address',  label: 'Addresses',     icon: IconMapPin },
                                    ].map(t => (
                                        <button key={t.key} onClick={() => setTab(t.key as any)}
                                            className="flex items-center gap-2 px-5 py-3.5 text-[13px] font-bold border-none cursor-pointer transition-all border-b-2 -mb-px"
                                            style={tab === t.key
                                                ? { color: 'var(--color-primary)', borderColor: 'var(--color-primary)', background: 'white' }
                                                : { color: '#9CA3AF', borderColor: 'transparent', background: 'white' }}>
                                            <t.icon size={15} /> {t.label}
                                        </button>
                                    ))}
                                </div>

                                <div className="p-6">

                                    {/* Personal Info */}
                                    {tab === 'info' && (
                                        <form onSubmit={e => { e.preventDefault(); profileForm.post('/account/profile') }}>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {[
                                                    { label: 'Full Name',     field: 'name',          type: 'text' },
                                                    { label: 'Email Address', field: 'email',         type: 'email' },
                                                    { label: 'Phone Number',  field: 'phone',         type: 'tel' },
                                                    { label: 'Date of Birth', field: 'date_of_birth', type: 'date' },
                                                    { label: 'City',          field: 'city',          type: 'text' },
                                                ].map(f => (
                                                    <div key={f.field}>
                                                        <label className="block text-[12px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide">{f.label}</label>
                                                        <input type={f.type}
                                                            value={(profileForm.data as any)[f.field]}
                                                            onChange={e => profileForm.setData(f.field as any, e.target.value)}
                                                            className="w-full h-11 px-4 rounded-xl border border-gray-200 text-[13.5px] focus:outline-none focus:border-[var(--color-primary)]" />
                                                        {(profileForm.errors as any)[f.field] && (
                                                            <p className="text-red-500 text-[11.5px] mt-1">{(profileForm.errors as any)[f.field]}</p>
                                                        )}
                                                    </div>
                                                ))}
                                                <div>
                                                    <label className="block text-[12px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Gender</label>
                                                    <select value={profileForm.data.gender}
                                                        onChange={e => profileForm.setData('gender', e.target.value)}
                                                        className="w-full h-11 px-4 rounded-xl border border-gray-200 text-[13.5px] focus:outline-none">
                                                        <option value="">Select</option>
                                                        <option value="male">Male</option>
                                                        <option value="female">Female</option>
                                                        <option value="other">Other</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <label className="block text-[12px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Address</label>
                                                <textarea value={profileForm.data.address}
                                                    onChange={e => profileForm.setData('address', e.target.value)}
                                                    rows={2}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[13.5px] focus:outline-none resize-none" />
                                            </div>
                                            <div className="mt-4 flex items-center gap-3">
                                                <input type="checkbox" id="newsletter"
                                                    checked={profileForm.data.newsletter_subscribed}
                                                    onChange={e => profileForm.setData('newsletter_subscribed', e.target.checked)}
                                                    className="w-4 h-4 rounded" />
                                                <label htmlFor="newsletter" className="text-[13px] text-gray-600 font-medium cursor-pointer">
                                                    Subscribe to newsletter for exclusive offers
                                                </label>
                                            </div>
                                            <button type="submit" disabled={profileForm.processing}
                                                className="mt-5 h-11 px-8 rounded-xl font-bold text-[14px] disabled:opacity-60 cursor-pointer border-none"
                                                style={{ background: 'var(--color-primary)', color: 'var(--color-primary-text)' }}>
                                                {profileForm.processing ? 'Saving...' : 'Save Changes'}
                                            </button>
                                        </form>
                                    )}

                                    {/* Password */}
                                    {tab === 'password' && (
                                        <form onSubmit={e => { e.preventDefault(); passForm.post('/account/profile') }} className="max-w-md space-y-4">
                                            {[
                                                { label: 'Current Password',  field: 'current_password' },
                                                { label: 'New Password',      field: 'password' },
                                                { label: 'Confirm Password',  field: 'password_confirmation' },
                                            ].map(f => (
                                                <div key={f.field}>
                                                    <label className="block text-[12px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide">{f.label}</label>
                                                    <input type="password"
                                                        value={(passForm.data as any)[f.field]}
                                                        onChange={e => passForm.setData(f.field as any, e.target.value)}
                                                        className="w-full h-11 px-4 rounded-xl border border-gray-200 text-[13.5px] focus:outline-none" />
                                                    {(passForm.errors as any)[f.field] && (
                                                        <p className="text-red-500 text-[11.5px] mt-1">{(passForm.errors as any)[f.field]}</p>
                                                    )}
                                                </div>
                                            ))}
                                            <button type="submit" disabled={passForm.processing}
                                                className="h-11 px-8 rounded-xl font-bold text-[14px] disabled:opacity-60 cursor-pointer border-none"
                                                style={{ background: 'var(--color-primary)', color: 'var(--color-primary-text)' }}>
                                                {passForm.processing ? 'Updating...' : 'Update Password'}
                                            </button>
                                        </form>
                                    )}

                                    {/* Addresses */}
                                    {tab === 'address' && (
                                        <div className="space-y-3">
                                            {addresses.map(addr => (
                                                <div key={addr.id} className="flex items-start justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-bold text-[13px]" style={{ color: 'var(--color-dark-bg)' }}>{addr.label}</span>
                                                            {addr.is_default && (
                                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                                                                    style={{ background: 'var(--color-primary)' }}>Default</span>
                                                            )}
                                                        </div>
                                                        <p className="text-[13px] text-gray-600">{addr.full_name} · {addr.phone}</p>
                                                        <p className="text-[12.5px] text-gray-400 mt-0.5">{addr.address}, {addr.city}</p>
                                                    </div>
                                                    <button onClick={() => {
                                                        const f = useForm({});
                                                        (f as any).delete(`/account/addresses/${addr.id}`)
                                                    }}
                                                        className="text-gray-400 hover:text-red-500 border-none bg-transparent cursor-pointer p-1">
                                                        <IconTrash size={15} />
                                                    </button>
                                                </div>
                                            ))}

                                            {!showAddrForm ? (
                                                <button onClick={() => setShowAddrForm(true)}
                                                    className="flex items-center gap-2 h-11 px-5 rounded-xl border-2 border-dashed border-gray-200 text-[13px] font-bold text-gray-400 hover:border-gray-300 w-full justify-center cursor-pointer bg-transparent">
                                                    <IconPlus size={16} /> Add New Address
                                                </button>
                                            ) : (
                                                <div className="border border-gray-200 rounded-xl p-4">
                                                    <p className="font-bold text-[14px] mb-4" style={{ color: 'var(--color-dark-bg)' }}>New Address</p>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {[
                                                            { label: 'Label',     field: 'label',     type: 'text',  placeholder: 'Home / Office' },
                                                            { label: 'Full Name', field: 'full_name', type: 'text',  placeholder: 'Your name' },
                                                            { label: 'Phone',     field: 'phone',     type: 'tel',   placeholder: '03xx-xxxxxxx' },
                                                            { label: 'City',      field: 'city',      type: 'text',  placeholder: 'Lahore' },
                                                        ].map(f => (
                                                            <div key={f.field}>
                                                                <label className="block text-[11px] font-bold text-gray-400 mb-1">{f.label}</label>
                                                                <input type={f.type} placeholder={f.placeholder}
                                                                    value={(addrForm.data as any)[f.field]}
                                                                    onChange={e => addrForm.setData(f.field as any, e.target.value)}
                                                                    className="w-full h-10 px-3 rounded-lg border border-gray-200 text-[13px] focus:outline-none" />
                                                            </div>
                                                        ))}
                                                        <div className="col-span-2">
                                                            <label className="block text-[11px] font-bold text-gray-400 mb-1">Address</label>
                                                            <input type="text" placeholder="Street address"
                                                                value={addrForm.data.address}
                                                                onChange={e => addrForm.setData('address', e.target.value)}
                                                                className="w-full h-10 px-3 rounded-lg border border-gray-200 text-[13px] focus:outline-none" />
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-3 mt-4">
                                                        <button onClick={() => addrForm.post('/account/addresses', { onSuccess: () => { setShowAddrForm(false); addrForm.reset() } })}
                                                            className="h-10 px-5 rounded-xl font-bold text-[13px] border-none cursor-pointer"
                                                            style={{ background: 'var(--color-primary)', color: 'var(--color-primary-text)' }}>
                                                            Save Address
                                                        </button>
                                                        <button onClick={() => setShowAddrForm(false)}
                                                            className="h-10 px-5 rounded-xl font-bold text-[13px] border border-gray-200 bg-white text-gray-600 cursor-pointer">
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </StorefrontLayout>
    )
}
