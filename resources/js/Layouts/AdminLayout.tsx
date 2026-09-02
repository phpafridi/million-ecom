import React, { useState } from 'react'
import { Link, usePage } from '@inertiajs/react'
import {
    IconBell,
    IconCategory,
    IconChartBar,
    IconChevronDown,
    IconChevronLeft,
    IconCreditCard,
    IconExternalLink,
    IconFileText,
    IconHeadset,
    IconLayoutDashboard,
    IconLock,
    IconLogout,
    IconMail,
    IconMenu,
    IconMessageCircle,
    IconPackage,
    IconPalette,
    IconPhoto,
    IconPointFilled,
    IconSearch,
    IconSettings,
    IconShoppingBag,
    IconStar,
    IconTag,
    IconTrendingUp,
    IconUser,
    IconUserCheck,
    IconUsers,
    IconWorld,
    IconX,
} from '@tabler/icons-react'

interface SharedProps {
    auth: { user: any }
    flash: { success?: string; error?: string }
    adminPath?: string
    settings?: Record<string, string>
    adminNotifications?: { total: number; pendingOrders: number; lowStockCount: number; pendingReviews: number }
}

const NAV = [
    {
        group: 'STORE',
        defaultOpen: true,
        items: [
            { label: 'Dashboard',  icon: IconLayoutDashboard, path: '',            perm: 'dashboard' },
            { label: 'Products',   icon: IconPackage,         path: '/products',   perm: 'products' },
            { label: 'Orders',     icon: IconShoppingBag,     path: '/orders',     perm: 'orders' },
            { label: 'Order Lookup', icon: IconSearch,        path: '/orders/lookup', perm: 'orders_lookup', impliedBy: 'orders' },
            { label: 'Customers',  icon: IconUsers,           path: '/customers',  perm: 'customers' },
            { label: 'Categories', icon: IconCategory,        path: '/categories', perm: 'categories' },
        ]
    },
    {
        group: 'MARKETING',
        defaultOpen: false,
        items: [
            { label: 'Coupons',         icon: IconTag,     path: '/coupons',         perm: 'coupons' },
            { label: 'Reviews',         icon: IconStar,    path: '/reviews',         perm: 'reviews' },
            { label: 'Email Campaigns', icon: IconMail,    path: '/email-campaigns', perm: 'email_campaigns' },
            { label: 'Support',         icon: IconHeadset, path: '/support',         perm: 'support_tickets' },
        ]
    },
    {
        group: 'CONTENT',
        defaultOpen: false,
        items: [
            { label: 'Hero Slides', icon: IconPhoto,      path: '/hero-slides', perm: 'hero_slides' },
            { label: 'Banners',     icon: IconTrendingUp, path: '/banners',     perm: 'banners' },
            { label: 'Pages',       icon: IconFileText,   path: '/pages',       perm: 'pages' },
        ]
    },
    {
        group: 'CONFIGURATION',
        defaultOpen: false,
        // adminOnly: true items are never shown to staff at all, regardless
        // of their permissions array — matching AdminMiddleware's
        // $adminOnly list exactly, so the nav never shows a link staff
        // would just get blocked from clicking.
        items: [
            { label: 'Analytics', icon: IconChartBar,      path: '/analytics',    adminOnly: true },
            { label: 'Reports',   icon: IconChartBar,      path: '/reports',      adminOnly: true },
            { label: 'Payments',  icon: IconCreditCard,    path: '/payments',     adminOnly: true },
            { label: 'Returns',   icon: IconChevronLeft,   path: '/returns',      perm: 'returns' },
            { label: 'Live Chat', icon: IconMessageCircle, path: '/chat',         perm: 'chat' },
            { label: 'Staff',     icon: IconUserCheck,     path: '/staff',        adminOnly: true },
            // WhatsApp link removed — settings consolidated into Settings page
            { label: 'Theme',     icon: IconPalette,       path: '/theme',        adminOnly: true },
            { label: 'Branding',  icon: IconPhoto,         path: '/branding',     adminOnly: true },
            { label: 'SEO',       icon: IconWorld,         path: '/seo',          adminOnly: true },
            { label: 'Notifications', icon: IconBell,      path: '/notifications', adminOnly: true },
            { label: 'IP Firewall',  icon: IconLock,     path: '/blocked-ips',    adminOnly: true },
            { label: 'System Logs',  icon: IconLock,   path: '/system-logs',      adminOnly: true },
            { label: 'Backup',       icon: IconPointFilled, path: '/backup',      adminOnly: true },
            { label: 'Settings',     icon: IconSettings,   path: '/settings',     adminOnly: true },
        ]
    },
]

function NavGroup({ group, items, defaultOpen, ap, url, onNav }: any) {
    const hasActive = items.some((i: any) => {
        const full = ap + i.path
        return i.path === '' ? url === ap || url === ap + '/' : url.startsWith(full)
    })
    const [open, setOpen] = useState(defaultOpen || hasActive)

    return (
        <div>
            <button onClick={() => setOpen((o: boolean) => !o)}
                className="flex items-center justify-between w-full px-3 py-1.5 mb-0.5 border-none bg-transparent cursor-pointer group">
                <span className="text-[9px] font-black uppercase tracking-[.16em] text-white/30 group-hover:text-white/50 transition-colors">
                    {group}
                </span>
                <IconChevronDown size={11}
                    className="text-white/20 group-hover:text-white/40 transition-all flex-shrink-0"
                    style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
            </button>
            {open && (
                <div className="space-y-0.5 mb-1">
                    {items.map((item: any) => {
                        const full = ap + item.path
                        const active = item.path === ''
                            ? url === ap || url === ap + '/'
                            : url.startsWith(full)
                        return (
                            <Link key={item.label + item.path} href={full}
                                onClick={onNav}
                                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all no-underline ${
                                    active ? '' : 'text-white/55 hover:text-white hover:bg-white/6'
                                }`}
                                style={active ? { background: 'var(--color-primary)', color: 'var(--color-primary-text,#0a0a0a)' } : {}}>
                                <item.icon size={16} className="flex-shrink-0" />
                                {item.label}
                            </Link>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default function AdminLayout({ children, title }: { children: React.ReactNode; title?: string }) {
    const { url, props } = usePage<SharedProps>()
    const [mobileOpen, setMobileOpen] = useState(false)
    const [bellOpen, setBellOpen] = useState(false)
    // "Clear" dismisses the badge until the total genuinely changes again
    // (a new pending order comes in, more stock runs low, etc.) — not a
    // deletable list, since these are live counts of real unprocessed
    // work, not a notification log. Persisted in localStorage so it stays
    // dismissed across page loads, not just this one render.
    const [dismissedAt, setDismissedAt] = useState<number | null>(() => {
        if (typeof window === 'undefined') return null
        const v = window.localStorage.getItem('ml_admin_notifs_dismissed_total')
        return v ? Number(v) : null
    })
    function dismissNotifs() {
        const total = notifs?.total ?? 0
        window.localStorage.setItem('ml_admin_notifs_dismissed_total', String(total))
        setDismissedAt(total)
        setBellOpen(false)
    }

    const ap       = `/${props.adminPath ?? 'ml-admin'}`
    const siteName = props.settings?.site_name ?? 'MILLIONAIRE'
    const initial  = siteName[0]?.toUpperCase() ?? 'M'
    const userName = props.auth?.user?.name ?? 'Admin'
    const notifs   = props.adminNotifications

    // Staff members only see nav items they're actually permitted to
    // access — previously every staff account saw the full nav regardless
    // of role, and only found out they lacked access after clicking
    // through to a 403 page. Full admins (permissions === null) see
    // everything, unfiltered.
    const userPerms = props.auth?.user?.permissions
    const isRestrictedStaff = props.auth?.user?.role === 'staff' && Array.isArray(userPerms)
    const visibleNav = isRestrictedStaff
        ? NAV.map(g => ({
              ...g,
              items: g.items.filter((i: any) => !i.adminOnly && (i.perm === null || userPerms.includes(i.perm) || (i.impliedBy && userPerms.includes(i.impliedBy)))),
          })).filter(g => g.items.length > 0)
        : NAV

    const Sidebar = () => (
        <div className="flex flex-col h-full">
            {/* Brand */}
            <div className="flex items-center gap-2.5 px-4 h-16 border-b border-white/8 flex-shrink-0">
                {props.settings?.logo_url ? (
                    <div className="h-9 flex-1 min-w-0 flex items-center gap-2 overflow-hidden">
                        <img src={props.settings.logo_url} alt={siteName} className="h-full w-auto object-contain flex-shrink-0" style={{ maxHeight: 36, maxWidth: 60 }} />
                        <div className="min-w-0 flex-1">
                            <div className="font-manrope font-black text-white text-[12.5px] leading-none truncate">{siteName}</div>
                            <div className="text-[8.5px] text-white/35 font-semibold uppercase tracking-widest mt-0.5 truncate">Admin Panel</div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-[14px] flex-shrink-0"
                            style={{ background: 'var(--color-primary)', color: 'var(--color-primary-text,#0a0a0a)' }}>
                            {initial}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="font-manrope font-black text-white text-[13px] leading-none truncate">{siteName}</div>
                            <div className="text-[9px] text-white/35 font-semibold uppercase tracking-widest mt-0.5">Admin Panel</div>
                        </div>
                    </>
                )}
                <button onClick={() => setMobileOpen(false)}
                    className="lg:hidden text-white/40 hover:text-white border-none bg-transparent cursor-pointer p-1">
                    <IconX size={17} />
                </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-2">
                {visibleNav.map(g => (
                    <NavGroup key={g.group} {...g} ap={ap} url={url}
                        onNav={() => setMobileOpen(false)} />
                ))}
            </nav>

            {/* Footer */}
            <div className="border-t border-white/8 px-2 py-2 space-y-0.5 flex-shrink-0">
                <a href="/" target="_blank"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-semibold text-white/45 hover:text-white hover:bg-white/6 transition-all no-underline">
                    <IconExternalLink size={15} /> View Store
                </a>
                <Link href={`${ap}/profile`}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-semibold text-white/45 hover:text-white hover:bg-white/6 transition-all no-underline">
                    <IconUser size={15} /> My Profile
                </Link>
                <Link href="/logout" method="post" as="button"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-semibold text-red-400/70 hover:text-red-400 hover:bg-red-500/8 transition-all w-full border-none bg-transparent cursor-pointer text-left">
                    <IconLogout size={15} /> Logout
                </Link>
            </div>
        </div>
    )

    return (
        <div className="flex h-screen overflow-hidden" style={{ background: 'var(--color-body-bg,#f0f2f5)' }}>

            {/* Desktop sidebar */}
            <aside className="hidden lg:flex w-56 flex-col flex-shrink-0 h-full"
                style={{ background: 'var(--color-dark-bg,#0a0a0a)' }}>
                <Sidebar />
            </aside>

            {/* Mobile overlay */}
            {mobileOpen && (
                <>
                    <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
                    <aside className="fixed top-0 left-0 bottom-0 w-60 z-50 lg:hidden flex flex-col"
                        style={{ background: 'var(--color-dark-bg,#0a0a0a)' }}>
                        <Sidebar />
                    </aside>
                </>
            )}

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

                {/* Topbar */}
                <header className="bg-white border-b border-gray-100 h-14 flex items-center px-4 sm:px-6 gap-3 flex-shrink-0 shadow-sm">
                    <button onClick={() => setMobileOpen(true)}
                        className="lg:hidden text-gray-500 hover:text-gray-800 border-none bg-transparent cursor-pointer p-1">
                        <IconMenu size={20} />
                    </button>

                    <span className="font-manrope font-bold text-[16px] text-gray-900 truncate">{title}</span>

                    <div className="ml-auto flex items-center gap-2">

                        {/* Flash messages */}
                        {props.flash?.success && (
                            <span className="hidden sm:flex items-center gap-1.5 text-[12px] font-semibold text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">
                                ✓ {props.flash.success}
                            </span>
                        )}

                        {/* Bell */}
                        {(notifs?.total ?? 0) > 0 && (
                            <div className="relative">
                                <button onClick={() => setBellOpen(o => !o)}
                                    className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 border-none cursor-pointer bg-transparent text-gray-600 transition-colors">
                                    <IconBell size={19} />
                                    {notifs!.total > (dismissedAt ?? -1) && (
                                        <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] rounded-full text-[9px] font-black flex items-center justify-center px-1 border-2 border-white"
                                            style={{ background: 'var(--color-primary)', color: 'var(--color-primary-text,#0a0a0a)' }}>
                                            {notifs!.total}
                                        </span>
                                    )}
                                </button>
                                {bellOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setBellOpen(false)} />
                                        <div className="absolute right-0 top-11 z-50 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                                            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                                                <span className="font-black text-[14px] text-gray-800">Notifications</span>
                                                <button onClick={dismissNotifs}
                                                    className="text-[11px] font-bold text-gray-400 hover:text-gray-600 border-none bg-transparent cursor-pointer px-1">
                                                    Clear
                                                </button>
                                            </div>
                                            <div className="divide-y divide-gray-50">
                                                {notifs!.pendingOrders > 0 && (
                                                    <Link href={`${ap}/orders?status=pending`} onClick={() => setBellOpen(false)}
                                                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 no-underline">
                                                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: '#FEF3C7' }}>🛍</div>
                                                        <div>
                                                            <p className="text-[13px] font-bold text-gray-800">{notifs!.pendingOrders} Pending Order{notifs!.pendingOrders !== 1 ? 's' : ''}</p>
                                                            <p className="text-[11px] text-gray-400">Waiting to be processed</p>
                                                        </div>
                                                    </Link>
                                                )}
                                                {notifs!.lowStockCount > 0 && (
                                                    <Link href={`${ap}/products`} onClick={() => setBellOpen(false)}
                                                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 no-underline">
                                                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: '#FEE2E2' }}>📦</div>
                                                        <div>
                                                            <p className="text-[13px] font-bold text-gray-800">{notifs!.lowStockCount} Low Stock</p>
                                                            <p className="text-[11px] text-gray-400">Products running low</p>
                                                        </div>
                                                    </Link>
                                                )}
                                                {notifs!.pendingReviews > 0 && (
                                                    <Link href={`${ap}/reviews`} onClick={() => setBellOpen(false)}
                                                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 no-underline">
                                                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: '#EDE9FE' }}>⭐</div>
                                                        <div>
                                                            <p className="text-[13px] font-bold text-gray-800">{notifs!.pendingReviews} Review{notifs!.pendingReviews !== 1 ? 's' : ''} to Approve</p>
                                                            <p className="text-[11px] text-gray-400">Awaiting moderation</p>
                                                        </div>
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {/* User */}
                        <Link href={`${ap}/profile`}
                            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-100 no-underline transition-colors">
                            <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-[12px] text-white flex-shrink-0"
                                style={{ background: 'var(--color-primary)' }}>
                                {userName[0]?.toUpperCase()}
                            </div>
                            <span className="hidden sm:block text-[13px] font-semibold text-gray-700">{userName}</span>
                        </Link>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                    {props.flash?.error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-[13px] text-red-700">
                            ⚠ {props.flash.error}
                        </div>
                    )}
                    {children}
                </main>
            </div>
        </div>
    )
}
