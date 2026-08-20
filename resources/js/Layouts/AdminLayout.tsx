import { useState } from 'react'
import { Link, usePage } from '@inertiajs/react'
import {
    IconLayoutDashboard, IconPackage, IconShoppingBag, IconCategory,
    IconUsers, IconTag, IconStar, IconPhoto, IconTrendingUp,
    IconPlayerPlay, IconFileText, IconCreditCard, IconPalette,
    IconWorld, IconSettings, IconMenu, IconX, IconLogout, IconMail,
    IconUser, IconChevronDown, IconExternalLink, IconBell,
    IconHeadset, IconMessageCircle, IconChartBar, IconArrowBackUp,
    IconUserCheck, IconBrandWhatsapp, IconRefresh
} from '@tabler/icons-react'

interface SharedProps {
    auth: { user: any }
    flash: { success?: string; error?: string }
    adminPath?: string
    settings?: Record<string, string>
}

const NAV_GROUPS = [
    {
        label: 'Store',
        items: [
            { label:'Dashboard',  icon: IconLayoutDashboard, path: '' },
            { label:'Products',   icon: IconPackage,         path: '/products' },
            { label:'Orders',     icon: IconShoppingBag,     path: '/orders' },
            { label:'Customers',  icon: IconUsers,           path: '/customers' },
            { label:'Categories', icon: IconCategory,        path: '/categories' },
        ]
    },
    {
        label: 'Marketing',
        items: [
            { label:'Coupons',    icon: IconTag,         path: '/coupons' },
            { label:'Reviews',    icon: IconStar,        path: '/reviews' },
            { label:'Email Campaigns', icon: IconMail,        path: '/email-campaigns' },
            { label:'Support Tickets', icon: IconHeadset,     path: '/support' },
        ]
    },
    {
        label: 'Content',
        items: [
            { label:'Hero Slides',  icon: IconPhoto,       path: '/hero-slides' },
            { label:'Banners',      icon: IconTrendingUp,  path: '/banners' },
            { label:'Promo Video',  icon: IconPlayerPlay,  path: '/promo-video' },
            { label:'Pages',        icon: IconFileText,    path: '/pages' },
        ]
    },
    {
        label: 'Configuration',
        items: [
            { label:'Live Chat',  icon: IconMessageCircle, path: '/chat' },
            { label:'Reports',    icon: IconChartBar,      path: '/reports' },
            { label:'Returns',    icon: IconArrowBackUp,   path: '/returns' },
            { label:'Staff',      icon: IconUserCheck,     path: '/staff' },
            { label:'Payments',   icon: IconCreditCard,    path: '/payments' },
            { label:'Theme',     icon: IconPalette,     path: '/theme' },
            { label:'SEO',       icon: IconWorld,       path: '/seo' },
            { label:'Settings',  icon: IconSettings,    path: '/settings' },
        ]
    },
]

export default function AdminLayout({ children, title }: { children: React.ReactNode; title?: string }) {
    const { url, props } = usePage<SharedProps>()
    const [mobileOpen, setMobileOpen] = useState(false)

    const ap       = `/${props.adminPath ?? 'tijar-admin'}`
    const siteName = props.settings?.site_name ?? 'Tijar Store'
    const initial  = siteName[0]?.toUpperCase() ?? 'T'
    const userName = props.auth?.user?.name ?? 'Admin'

    function isActive(path: string) {
        const full = ap + path
        if (path === '') return url === ap || url === ap + '/'
        return url.startsWith(full)
    }

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Brand */}
            <div className="flex items-center gap-3 px-5 h-16 border-b border-white/8 flex-shrink-0">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-[14px] flex-shrink-0"
                    style={{ background:'var(--color-primary)', color:'var(--color-primary-text,#0a0e1a)' }}>
                    {initial}
                </div>
                <div className="min-w-0">
                    <div className="font-manrope font-black text-white text-[14px] leading-none truncate">{siteName}</div>
                    <div className="text-[10px] text-white/40 font-semibold uppercase tracking-widest mt-0.5">Admin Panel</div>
                </div>
                <button onClick={() => setMobileOpen(false)} className="ml-auto lg:hidden text-white/40 hover:text-white border-none bg-transparent cursor-pointer">
                    <IconX size={18}/>
                </button>
            </div>

            {/* Nav groups */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5 admin-sidebar-nav">
                {NAV_GROUPS.map(group => (
                    <div key={group.label}>
                        <p className="text-[9px] font-black uppercase tracking-[.18em] text-white/25 px-3 mb-2">{group.label}</p>
                        <div className="space-y-0.5">
                            {group.items.map(item => {
                                const active = isActive(item.path)
                                return (
                                    <Link key={item.path} href={ap + item.path}
                                        preserveScroll
                                        onClick={() => setMobileOpen(false)}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all no-underline
                                            ${active ? 'text-[var(--color-primary-text,#0a0e1a)]' : 'text-white/55 hover:text-white hover:bg-white/6'}`}
                                        style={active ? { background:'var(--color-primary)', color:'var(--color-primary-text,#0a0e1a)' } : {}}>
                                        <item.icon size={17} className="flex-shrink-0"/>
                                        {item.label}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Bottom: view store + profile + logout */}
            <div className="border-t border-white/8 px-3 py-3 space-y-1 flex-shrink-0">
                <a href="/?admin_preview=1" target="_blank"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold text-white/50 hover:text-white hover:bg-white/6 transition-all no-underline">
                    <IconExternalLink size={16}/> View Store
                </a>
                <Link href={`${ap}/profile`}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold text-white/50 hover:text-white hover:bg-white/6 transition-all no-underline">
                    <IconUser size={16}/> My Profile
                </Link>
                <Link href="/logout" method="post" as="button"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold text-red-400/70 hover:text-red-400 hover:bg-red-500/8 transition-all w-full border-none bg-transparent cursor-pointer text-left">
                    <IconLogout size={16}/> Logout
                </Link>
            </div>
        </div>
    )

    return (
        <div className="flex h-screen overflow-hidden" style={{ background:'var(--color-body-bg,#f0f2f5)' }}>

            {/* Desktop sidebar */}
            <aside className="hidden lg:flex w-56 flex-col flex-shrink-0 h-full" style={{ background:'var(--color-dark-bg,#0a0e1a)' }}>
                <SidebarContent/>
            </aside>

            {/* Mobile overlay */}
            {mobileOpen && (
                <>
                    <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setMobileOpen(false)}/>
                    <aside className="fixed top-0 left-0 bottom-0 w-64 z-50 lg:hidden flex flex-col" style={{ background:'var(--color-dark-bg,#0a0e1a)' }}>
                        <SidebarContent/>
                    </aside>
                </>
            )}

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

                {/* Top bar */}
                <header className="bg-white border-b border-gray-200 h-14 flex items-center px-4 sm:px-6 gap-3 flex-shrink-0 shadow-sm">
                    <button onClick={() => setMobileOpen(true)} className="lg:hidden text-gray-500 hover:text-gray-800 border-none bg-transparent cursor-pointer p-1">
                        <IconMenu size={21}/>
                    </button>

                    {/* Breadcrumb / title */}
                    <div className="flex items-center gap-2 min-w-0">
                        <span className="font-manrope font-bold text-[16px] text-gray-900 truncate">{title}</span>
                    </div>

                    {/* Right side */}
                    <div className="ml-auto flex items-center gap-2">
                        {/* Flash message */}
                        {props.flash?.success && (
                            <span className="hidden sm:flex items-center gap-1.5 text-[12px] font-semibold text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">
                                ✓ {props.flash.success}
                            </span>
                        )}
                        {props.flash?.error && (
                            <span className="hidden sm:flex items-center gap-1.5 text-[12px] font-semibold text-red-700 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full">
                                ⚠ {props.flash.error}
                            </span>
                        )}

                        {/* User avatar */}
                        <Link href={`${ap}/profile`}
                            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-100 no-underline transition-colors"
                            title="My Profile">
                            <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-[12px] text-white flex-shrink-0"
                                style={{ background:'var(--color-primary)' }}>
                                {userName[0]?.toUpperCase()}
                            </div>
                            <span className="hidden sm:block text-[13px] font-semibold text-gray-700">{userName}</span>
                        </Link>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                    {props.flash?.error && (
                        <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-xl text-[13px] text-red-700 flex items-center gap-2">
                            ⚠ {props.flash.error}
                        </div>
                    )}
                    {children}
                </main>
            </div>
        </div>
    )
}
