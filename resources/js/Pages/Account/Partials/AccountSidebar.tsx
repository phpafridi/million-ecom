import { Link, usePage } from '@inertiajs/react'
import { IconLayoutDashboard, IconPackage, IconHeart, IconStar, IconUser, IconTruck, IconLogout } from '@tabler/icons-react'

const NAV = [
    { href: '/account',          label: 'Dashboard',      icon: IconLayoutDashboard },
    { href: '/account/orders',   label: 'My Orders',      icon: IconPackage },
    { href: '/account/wishlist', label: 'Wishlist',       icon: IconHeart },
    { href: '/account/loyalty',  label: 'Loyalty Points', icon: IconStar },
    { href: '/account/profile',  label: 'Profile',        icon: IconUser },
    { href: '/track-order',      label: 'Track Order',    icon: IconTruck },
]

interface Props { auth: any }

export default function AccountSidebar({ auth }: Props) {
    const { url } = usePage()
    const user = auth?.user

    function isActive(href: string) {
        if (href === '/account') return url === '/account'
        return url.startsWith(href)
    }

    return (
        <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
                <div className="flex flex-col items-center text-center mb-5 pb-5 border-b border-gray-100">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-black mb-3"
                        style={{ background: 'var(--color-primary)' }}>
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <p className="font-bold text-[14px]" style={{ color: 'var(--color-dark-bg)' }}>{user?.name}</p>
                    <p className="text-gray-400 text-[11.5px] mt-0.5 truncate w-full">{user?.email}</p>
                </div>
                <nav className="space-y-0.5">
                    {NAV.map(item => {
                        const active = isActive(item.href)
                        return (
                            <Link key={item.href} href={item.href}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold no-underline transition-all"
                                style={active ? { background: 'var(--color-primary)', color: 'var(--color-primary-text)' } : { color: '#6B7280' }}>
                                <item.icon size={16} />
                                {item.label}
                            </Link>
                        )
                    })}
                    <Link href="/logout" method="post" as="button"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold text-red-500 hover:bg-red-50 w-full border-none bg-transparent cursor-pointer mt-2">
                        <IconLogout size={16} /> Logout
                    </Link>
                </nav>
            </div>
        </div>
    )
}
