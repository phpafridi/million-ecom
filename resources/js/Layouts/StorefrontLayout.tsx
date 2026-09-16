import { useState, useEffect, useRef } from 'react'
import React from 'react'
import { Link, router, usePage } from '@inertiajs/react'
import FloatingCart from '@/Components/ui/FloatingCart'
import { getFloatOffset } from '@/utils/floatingButtons'
import {
    IconSearch, IconBrandWhatsapp, IconBrandFacebook, IconBrandInstagram, IconUser,
    IconMenu, IconX, IconChevronDown, IconPhone,
    IconInfoCircle, IconMessageCircle, IconShoppingCart, IconSun, IconMoon, IconHeart,
    IconTruck, IconMapPin
} from '@tabler/icons-react'

interface NavItem { label: string; href: string; image?: string; children?: NavItem[]; items?: NavItem[] }
interface Props { children: React.ReactNode; auth?: any; settings?: Record<string, string>; hideFloatingCart?: boolean; hideHeader?: boolean; hideFooter?: boolean }


function SaleCountdownBar({ label, badge, endsAt, bg, color }: {
    label: string; badge: string; endsAt: string; bg: string; color: string
}) {
    const [time, setTime] = React.useState({ d:0, h:0, m:0, s:0, done:false })
    React.useEffect(() => {
        function tick() {
            const diff = Math.max(0, new Date(endsAt).getTime() - Date.now())
            if (diff === 0) { setTime(t => ({...t, done:true})); return }
            setTime({ d:Math.floor(diff/86400000), h:Math.floor((diff%86400000)/3600000), m:Math.floor((diff%3600000)/60000), s:Math.floor((diff%60000)/1000), done:false })
        }
        tick(); const id = setInterval(tick, 1000); return () => clearInterval(id)
    }, [endsAt])
    if (time.done) return null
    const pad = (n:number) => String(n).padStart(2,'0')
    const box = (val:string, lbl:string) => (
        <div className="flex flex-col items-center">
            <div className="font-black text-[15px] leading-none px-2 py-1 rounded-md" style={{background:'rgba(255,255,255,0.15)',minWidth:32,textAlign:'center'}}>{val}</div>
            <div className="text-[9px] font-bold uppercase tracking-wider opacity-70 mt-0.5">{lbl}</div>
        </div>
    )
    return (
        <div className="w-full flex items-center justify-center gap-4 px-4 py-2 text-[13px] font-bold" style={{background:bg,color}}>
            <span className="font-black text-[13px] uppercase tracking-wide">{label}</span>
            <div className="flex items-center gap-1.5">
                {time.d > 0 && <>{box(pad(time.d),'DAYS')}<span className="font-black text-[16px] opacity-70">:</span></>}
                {box(pad(time.h),'HRS')}
                <span className="font-black text-[16px] opacity-70">:</span>
                {box(pad(time.m),'MIN')}
                <span className="font-black text-[16px] opacity-70">:</span>
                {box(pad(time.s),'SEC')}
            </div>
            <span className="hidden sm:inline font-black text-[12px] px-3 py-1 rounded-full" style={{background:'rgba(255,255,255,0.2)',border:'1px solid rgba(255,255,255,0.3)'}}>{badge}</span>
        </div>
    )
}

export default function StorefrontLayout({ children, auth, settings, hideFloatingCart, hideHeader, hideFooter }: Props) {
    const [search, setSearch]           = useState('')
    const [mobileOpen, setMobileOpen]   = useState(false)
    const [searchOpen, setSearchOpen]   = useState(false)
    const [scrolled, setScrolled]       = useState(false)
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const siteName = settings?.site_name ?? 'Millionaire'
    const phone    = settings?.phone     ?? ''
    // Only treat it as a real number if it actually looks like one — the
    // stored value was found to literally contain "Pakistan" (a country
    // name typed in by mistake), producing a broken wa.me link where
    // WhatsApp's own redirect tried to interpret it as a username instead
    // of a phone number. Backend validation now prevents saving something
    // like that again, but this guards against whatever's already stored.
    const rawWhatsapp = settings?.whatsapp_number ?? ''
    const whatsapp = /^\+?[0-9]{7,15}$/.test(rawWhatsapp) ? rawWhatsapp : ''
    const logoUrl  = settings?.logo_url  ?? null
    const tagline  = settings?.site_tagline ?? ''

    // Contact method settings — admin controls which contact buttons show
    const showWhatsapp  = settings?.show_whatsapp_button  !== '0'
    const showFacebook  = settings?.show_facebook_button  === '1'
    const showInstagram = settings?.show_instagram_button === '1'
    const showPhone     = settings?.show_phone_button     !== '0'
    const contactMethod = settings?.contact_method ?? 'whatsapp' // whatsapp|phone|both|none
    const fbUrl         = settings?.facebook_url  ?? ''
    const igUrl         = settings?.instagram_url ?? ''

    // Nav from Inertia shared props
    const page          = usePage<{ navCategories?: NavItem[]; cartCount?: number; wishlistCount?: number }>()
    const cartCount     = page.props.cartCount ?? 0
    const wishlistCount = page.props.wishlistCount ?? 0
    const navItems: NavItem[] = [{ label: 'Home', href: '/' }, ...(page.props.navCategories ?? [])]
    const currentUrl = page.url

    // Dark mode — client-side toggle
    const [darkMode, setDarkMode] = useState<'light'|'dark'>(() =>
        typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    )
    function toggleDark() {
        const next = darkMode === 'dark' ? 'light' : 'dark'
        setDarkMode(next)
        document.documentElement.classList.toggle('dark', next === 'dark')
    }

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 10)
        window.addEventListener('scroll', fn, { passive: true })
        return () => window.removeEventListener('scroll', fn)
    }, [])

    useEffect(() => {
        const fn = () => { if (window.innerWidth >= 1024) setMobileOpen(false) }
        window.addEventListener('resize', fn)
        return () => window.removeEventListener('resize', fn)
    }, [])

    useEffect(() => {
        const fn = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
                setActiveDropdown(null)
        }
        document.addEventListener('mousedown', fn)
        return () => document.removeEventListener('mousedown', fn)
    }, [])

    function doSearch(e: React.FormEvent) {
        e.preventDefault()
        if (search.trim()) { router.get('/shop', { q: search }); setMobileOpen(false); setSearchOpen(false) }
    }

    function isActive(link: NavItem) {
        if (link.href === '/') return currentUrl === '/'
        const cat = link.href.split('category=')[1]
        if (!cat) return currentUrl.startsWith(link.href)
        // Was using .includes(cat), which matched "men" inside "women"
        // too — extract the actual category value from the current URL
        // and compare exactly instead of a loose substring check.
        const currentCat = new URLSearchParams(currentUrl.split('?')[1] ?? '').get('category')
        return currentCat === cat
    }

    function MobileNavItem({ item, depth = 0 }: { item: NavItem; depth?: number }) {
        const [open, setOpen] = useState(false)
        const hasKids = (item.children?.length ?? 0) > 0
        return (
            <div>
                <div className="flex items-center border-b border-gray-50" style={{ paddingLeft: depth * 16 }}>
                    <Link href={item.href} onClick={() => setMobileOpen(false)}
                        className={`flex-1 px-5 py-3.5 text-[14px] font-semibold no-underline transition-colors
                            ${isActive(item) ? 'text-[var(--color-primary)]' : 'text-gray-700 hover:text-[var(--color-primary)]'}`}>
                        {item.label}
                    </Link>
                    {hasKids && (
                        <button onClick={() => setOpen(!open)} className="px-4 py-3.5 text-gray-400 border-none bg-transparent cursor-pointer">
                            <IconChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
                        </button>
                    )}
                </div>
                {open && hasKids && item.children!.map(c => <MobileNavItem key={c.href} item={c} depth={depth + 1} />)}
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-body-bg)', overflowX: 'hidden', maxWidth: '100vw', width: '100%' }}>

            {/* ── Admin Mode Banner ── */}
            {auth?.user?.role === 'admin' && (
                <div style={{ background: '#7C3AED', color: 'white', padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, zIndex: 100 }}>
                    <span>🔐 Admin Preview Mode — customers see this page normally</span>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                        <span style={{ opacity: 0.6 }}>Logged in as: {auth.user.name}</span>
                        <a href={`/${(page.props as any)?.adminPath ?? 'ml-admin'}`} style={{ color: 'white', textDecoration: 'none', opacity: 0.9 }}>← Back to Admin</a>
                    </div>
                </div>
            )}

            {settings?.sale_enabled === '1' && settings?.sale_ends_at && (
                <SaleCountdownBar
                    label={settings.sale_label ?? 'FLASH SALE'}
                    badge={settings.sale_badge ?? 'UP TO 60% OFF'}
                    endsAt={settings.sale_ends_at}
                    bg={settings.sale_bg ?? '#1a472a'}
                    color={settings.sale_text_color ?? '#ffffff'}
                />
            )}

            {/* ── TOPBAR — removed per direct request ── */}
            {!hideHeader && (
            <>

            {/* ── HEADER ── */}
            <header className={`sticky top-0 z-50 transition-shadow duration-200 overflow-hidden ${scrolled ? 'shadow-[0_2px_20px_rgba(0,0,0,0.08)]' : 'border-b'}`}
                style={{ background: 'var(--color-header-bg, #0a0a0a)', borderColor: 'var(--color-header-border, rgba(255,255,255,0.1))', color: 'var(--color-header-text, #ffffff)' }}>
                <style>{`
                    @media (max-width: 1023px) {
                        .ml-header-row {
                            display: grid !important;
                            /* 4 explicit columns now: hamburger, logo
                               (flexible/centered), search toggle, dark
                               mode toggle. This was hardcoded to exactly
                               3 columns — adding the dark mode button
                               without updating this pushed it onto an
                               invisible second grid row (CSS Grid's
                               default auto-flow for anything beyond the
                               explicit columns), which a fixed-height
                               overflow-hidden container then clipped
                               entirely — also compressing the first row's
                               effective height, which is what shifted the
                               logo up. */
                            grid-template-columns: 40px 1fr 40px 40px;
                            align-items: center;
                        }
                        .ml-header-logo {
                            justify-self: center !important;
                        }
                    }
                `}</style>
                <div className="ml-header-row px-3 sm:px-6 lg:px-10 h-[58px] sm:h-[72px] flex items-center gap-2 sm:gap-3 overflow-hidden lg:relative">

                    {/* Mobile menu toggle */}
                    <button className="lg:hidden flex-shrink-0 w-8 h-8 flex items-center justify-center border-none bg-transparent cursor-pointer text-[var(--color-header-text,#ffffff)]"
                        onClick={() => { setMobileOpen(!mobileOpen); setSearchOpen(false) }}>
                        {mobileOpen ? <IconX size={22} /> : <IconMenu size={22} />}
                    </button>

                    {/* Logo — fixed height, natural width so it never gets squeezed into a square.
                        Centered on mobile via the grid above. Desktop also centered now (absolute
                        positioning, independent of the search bar's flex sizing) — matches the
                        reference exactly, where the logo sits dead-center regardless of screen width. */}
                    <Link href="/" className="ml-header-logo flex items-center gap-1.5 sm:gap-2 flex-shrink-0 no-underline min-w-0">
                        <div className="h-[38px] sm:h-[50px] flex-shrink-0 flex items-center justify-center overflow-hidden" style={{ height: 38, maxHeight: 38 }}>
                            {logoUrl
                                ? <img src={logoUrl} alt={siteName} className="h-full w-auto max-w-[130px] sm:max-w-[200px] object-contain"
                                    style={{ height: '100%', maxHeight: 38, width: 'auto', maxWidth: 130, objectFit: 'contain', display: 'block' }} />
                                : <span className="font-manrope font-black text-xl sm:text-2xl" style={{ color: 'var(--color-primary)' }}>{siteName[0]}</span>
                            }
                        </div>
                        <div className="min-w-0">
                            <div className="font-manrope font-black text-[15px] sm:text-[19px] tracking-[1px] sm:tracking-[2px] leading-none truncate" style={{ color: settings?.header_title_color || 'var(--color-header-text, var(--color-dark-bg))' }}>{siteName}</div>
                            {tagline && <div className="text-[8px] sm:text-[8px] tracking-[.15em] font-bold uppercase mt-0.5 truncate" style={{ color: settings?.header_subtitle_color || 'var(--color-primary)' }}>{tagline}</div>}
                        </div>
                    </Link>

                    {/* Desktop search */}
                    <form onSubmit={doSearch} className="hidden lg:flex flex-1 max-w-[500px] h-[44px] border-2 rounded-[12px] overflow-hidden transition-shadow"
                        style={{ borderColor: 'var(--color-primary)' }}>
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products, brands…"
                            className="flex-1 border-none outline-none px-4 text-[13.5px] placeholder:text-gray-400"
                            style={{ color: settings?.search_text_color || 'var(--color-header-text, #ffffff)', background: 'var(--color-header-bg, #0a0a0a)' }} />
                        <button type="submit" className="px-5 font-black text-[13px] flex items-center gap-2 flex-shrink-0 border-none cursor-pointer"
                            style={{ background: 'var(--color-primary)', color: 'var(--color-primary-text)' }}>
                            <IconSearch size={16} /> Search
                        </button>
                    </form>

                    {/* Mobile search toggle */}
                    <button className="lg:hidden w-8 h-8 flex items-center justify-center border-none bg-transparent cursor-pointer flex-shrink-0 text-[var(--color-header-text,#ffffff)]"
                        onClick={() => { setSearchOpen(!searchOpen); setMobileOpen(false) }}>
                        <IconSearch size={20} />
                    </button>

                    {/* Dark mode toggle — mobile quick-access. Previously
                        only reachable buried inside the hamburger dropdown
                        menu; this puts it directly in the header row like
                        the desktop version already has. */}
                    <button onClick={toggleDark} className="lg:hidden w-8 h-8 flex items-center justify-center border-none bg-transparent cursor-pointer flex-shrink-0 text-[var(--color-header-text,#ffffff)]"
                        title={darkMode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
                        {darkMode === 'dark' ? <IconSun size={19} /> : <IconMoon size={19} />}
                    </button>

                    {/* Wishlist — mobile already has this in the bottom nav bar */}
                    <Link href="/wishlist" className="relative flex-shrink-0 w-10 h-10 hidden lg:flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors no-underline text-[var(--color-header-text,#ffffff)]"
                        title="My Wishlist">
                        <IconHeart size={21}/>
                        {wishlistCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full text-[9px] font-black flex items-center justify-center text-white px-1"
                                style={{ background: 'var(--color-accent, #e91e63)' }}>
                                {wishlistCount > 9 ? '9+' : wishlistCount}
                            </span>
                        )}
                    </Link>

                    {/* Cart — mobile already has this in the bottom nav bar */}
                    <Link href="/cart" className="relative flex-shrink-0 w-10 h-10 hidden lg:flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors no-underline text-[var(--color-header-text,#ffffff)]">
                        <IconShoppingCart size={21} />
                        {cartCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full text-[9px] font-black flex items-center justify-center text-white px-1"
                                style={{ background: 'var(--color-primary)' }}>
                                {cartCount > 9 ? '9+' : cartCount}
                            </span>
                        )}
                    </Link>

                    {/* Dark mode toggle — desktop only, keeps mobile header compact */}
                    <button onClick={toggleDark} className="flex-shrink-0 w-10 h-10 hidden lg:flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors border-none bg-transparent cursor-pointer text-[var(--color-header-text,#ffffff)]"
                        title={darkMode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
                        {darkMode === 'dark' ? <IconSun size={19} /> : <IconMoon size={19} />}
                    </button>

                    {/* Desktop right links */}
                    <div className="hidden lg:flex items-center gap-1 ml-1">
                        <Link href="/about"   className="flex items-center gap-1.5 h-[38px] px-3 rounded-[10px] text-[13px] font-semibold text-[var(--color-header-text,#ffffff)] hover:bg-gray-50 transition-all no-underline"><IconInfoCircle size={16} /> About</Link>
                        <Link href="/contact" className="flex items-center gap-1.5 h-[38px] px-3 rounded-[10px] text-[13px] font-semibold text-[var(--color-header-text,#ffffff)] hover:bg-gray-50 transition-all no-underline"><IconMessageCircle size={16} /> Contact</Link>
                        {auth?.user ? (
                            <Link href="/account"
                                className="flex items-center gap-2 h-[38px] pl-2 pr-3 rounded-[10px] text-[13px] font-semibold hover:bg-gray-50 transition-all no-underline"
                                style={{ color: 'var(--color-primary)' }}>
                                <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] flex-shrink-0"
                                    style={{ background: 'var(--color-primary)', color: 'var(--color-primary-text,#0a0a0a)' }}>
                                    {auth.user.name?.[0]?.toUpperCase() ?? 'A'}
                                </div>
                                <span>{auth.user.name?.split(' ')[0]}</span>
                            </Link>
                        ) : (
                            <Link href="/login"
                                className="flex items-center gap-1.5 h-[38px] px-3 rounded-[10px] text-[13px] font-semibold text-[var(--color-header-text,#ffffff)] hover:bg-gray-50 transition-all no-underline">
                                <IconUser size={16} /> Login
                            </Link>
                        )}
                    </div>
                </div>

                {/* Mobile search dropdown */}
                {searchOpen && (
                    <div className="lg:hidden px-4 pb-3 border-t border-gray-100 pt-2">
                        <form onSubmit={doSearch} className="flex border-2 rounded-xl overflow-hidden h-10" style={{ borderColor: 'var(--color-primary)' }}>
                            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…" autoFocus
                                className="flex-1 px-4 text-[13.5px] outline-none border-none"
                                style={{ color: settings?.search_text_color || 'var(--color-header-text, #ffffff)', background: 'var(--color-header-bg, #0a0a0a)' }} />
                            <button type="submit" className="px-4 border-none cursor-pointer" style={{ background: 'var(--color-primary)', color: 'var(--color-primary-text)' }}>
                                <IconSearch size={17} />
                            </button>
                        </form>
                    </div>
                )}
            </header>
            </>
            )}

            {/* ── DESKTOP NAV ── */}
            <nav className="hidden lg:block bg-white border-b-2 border-gray-200 sticky top-[72px] z-40" ref={dropdownRef}>
                <div className="px-6 lg:px-10 grid grid-cols-[1fr_auto_1fr] items-stretch h-[46px]">
                    <div className="flex items-center">
                        {/* Hamburger — left side, matches the reference
                            exactly. Opens the same drawer as mobile. */}
                        <button onClick={() => setMobileOpen(true)} aria-label="Menu"
                            className="flex items-center justify-center w-[32px] h-[32px] border-none bg-transparent cursor-pointer text-gray-700 hover:opacity-70 transition-opacity">
                            <IconMenu size={22} />
                        </button>
                    </div>
                    <div className="flex items-stretch">
                    {navItems.map(link => {
                        // Dropdown/mega-menu removed per direct request —
                        // nav is just plain Men/Women/Kids links now, no
                        // hover subcategory panel at all.
                        const hasChildren = false
                        const active = isActive(link)
                        return (
                            <div key={link.href} className="relative"
                                onMouseEnter={() => hasChildren && setActiveDropdown(link.href)}
                                onMouseLeave={() => setActiveDropdown(null)}>
                                <Link href={link.href}
                                    className={`flex items-center gap-1.5 px-4 h-[46px] text-[12.5px] font-semibold whitespace-nowrap transition-all flex-shrink-0 border-b-2 mb-[-2px] no-underline
                                        ${active ? '' : 'border-b-transparent hover:border-b-[var(--color-primary)] text-gray-600'}`}
                                    style={{ color: active ? 'var(--color-primary)' : undefined, borderBottomColor: active ? 'var(--color-primary)' : undefined }}>
                                    {link.label}
                                    {hasChildren && <IconChevronDown size={11} className={`transition-transform ${activeDropdown === link.href ? 'rotate-180' : ''}`} />}
                                </Link>
                                {hasChildren && activeDropdown === link.href && (
                                    <div className="fixed left-0 right-0 bg-white border-t shadow-xl py-9 z-50"
                                        style={{ borderColor: 'var(--color-primary)', top: 'var(--header-height, 96px)' }}>
                                        {/* Multi-column mega-menu — each of this
                                            category's subcategories (Clothing,
                                            Optical, etc.) becomes its own column
                                            header, with its 3rd-level items listed
                                            below. Falls back to just the column
                                            headers (no sub-list) for any column
                                            whose items haven't been added yet. */}
                                        <div className="max-w-[1400px] mx-auto px-10 grid gap-8" style={{ gridTemplateColumns: `repeat(${Math.min(link.children!.length, 6)}, 1fr)` }}>
                                            {link.children!.map(col => (
                                                <div key={col.href}>
                                                    <Link href={col.href} onClick={() => setActiveDropdown(null)}
                                                        className="block text-[12px] font-bold uppercase tracking-wider text-gray-900 no-underline pb-2 mb-3 border-b-2"
                                                        style={{ borderColor: 'var(--color-primary)' }}>
                                                        {col.label}
                                                    </Link>
                                                    <div className="flex flex-col gap-2.5">
                                                        {(col.items ?? []).map(item => (
                                                            <Link key={item.href} href={item.href} onClick={() => setActiveDropdown(null)}
                                                                className="text-[13px] text-gray-600 no-underline hover:text-[var(--color-primary)] transition-colors"
                                                                style={{ color: isActive(item) ? 'var(--color-primary)' : undefined, fontWeight: isActive(item) ? 700 : 400 }}>
                                                                {item.label}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                    </div>
                    <div className="flex items-center justify-end gap-3 py-1.5">
                        <Link href="/contact" className="flex items-center gap-2 h-[32px] px-4 border rounded-lg text-[12.5px] font-black hover:opacity-80 transition-all no-underline"
                            style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>
                            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--color-primary)' }} /> Expert Help
                        </Link>
                    </div>
                </div>
            </nav>

            {/* ── MOBILE DRAWER ── */}
            {mobileOpen && (
                <>
                    <div className="fixed inset-0 bg-black/40 z-[60]" onClick={() => setMobileOpen(false)} />
                    <div className="fixed top-0 left-0 bottom-0 w-[280px] bg-white z-[70] overflow-y-auto shadow-2xl">
                        <div className="flex items-center justify-between px-5 h-[60px] border-b border-gray-100">
                            <div className="font-manrope font-black text-[18px] tracking-[2px]" style={{ color: 'var(--color-body-text)' }}>{siteName}</div>
                            <button onClick={() => setMobileOpen(false)} className="text-gray-500 border-none bg-transparent cursor-pointer"><IconX size={22} /></button>
                        </div>
                        <div className="py-1">
                            {navItems.map(item => <MobileNavItem key={item.href} item={item} />)}
                        </div>

                        {/* Subscribe — matches the reference position exactly,
                            right after categories, before the account links. */}
                        <div className="px-5 py-4 border-t border-gray-100">
                            <p className="text-[13px] font-bold text-gray-800 mb-2">Subscribe for updates</p>
                            <form onSubmit={(e)=>{e.preventDefault(); const inp=e.currentTarget.querySelector('input') as HTMLInputElement; if(inp?.value){ fetch('/newsletter/subscribe',{method:'POST',headers:{'Content-Type':'application/json','X-CSRF-TOKEN':(document.querySelector('meta[name=csrf-token]') as HTMLInputElement)?.content||''},body:JSON.stringify({email:inp.value})}); inp.value=''; alert('Subscribed! Thank you.'); }}}
                                className="flex gap-0 rounded-full overflow-hidden border border-gray-200">
                                <input type="email" placeholder="Enter your email" required
                                    className="flex-1 min-w-0 px-3.5 py-2.5 text-[12.5px] border-none outline-none" />
                                <button type="submit" className="px-4 text-[11px] font-bold text-white border-none cursor-pointer"
                                    style={{ background: 'var(--color-primary)' }}>Subscribe</button>
                            </form>
                        </div>

                        <div className="border-t border-gray-100 py-2">
                            <Link href={auth?.user ? '/account' : '/login'} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-5 py-3.5 text-[14px] font-semibold text-gray-700 no-underline"><IconUser size={18} /> {auth?.user ? 'My Account' : 'Login / Create Account'}</Link>
                            <Link href="/track-order" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-5 py-3.5 text-[14px] font-semibold text-gray-700 no-underline"><IconTruck size={18} /> Track Your Order</Link>
                            <Link href="/contact" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-5 py-3.5 text-[14px] font-semibold text-gray-700 no-underline"><IconMessageCircle size={18} /> Contact Us</Link>
                            <Link href="/contact" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-5 py-3.5 text-[14px] font-semibold text-gray-700 no-underline"><IconMapPin size={18} /> Store Locator</Link>
                            <Link href="/about"   onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-5 py-3.5 text-[14px] font-semibold text-gray-700 no-underline"><IconInfoCircle size={18} /> About Us</Link>
                            <Link href="/wishlist" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-5 py-3.5 text-[14px] font-semibold text-gray-700 no-underline">
                                <IconHeart size={18}/> Wishlist {wishlistCount > 0 && <span className="ml-auto text-[11px] font-black px-2 py-0.5 rounded-full text-white" style={{ background:'var(--color-accent,#e91e63)' }}>{wishlistCount}</span>}
                            </Link>
                            <Link href="/cart"    onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-5 py-3.5 text-[14px] font-semibold text-gray-700 no-underline">
                                <IconShoppingCart size={18} /> Cart {cartCount > 0 && <span className="ml-auto text-[11px] font-black px-2 py-0.5 rounded-full text-white" style={{ background: 'var(--color-primary)' }}>{cartCount}</span>}
                            </Link>
                            <button onClick={() => { toggleDark(); setMobileOpen(false) }} className="w-full flex items-center gap-3 px-5 py-3.5 text-[14px] font-semibold text-gray-700 border-none bg-transparent cursor-pointer text-left">
                                {darkMode === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />} {darkMode === 'dark' ? 'Light Mode' : 'Dark Mode'}
                            </button>
                        </div>
            {showWhatsapp && whatsapp && (
                            <div className="px-5 py-4">
                                <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold text-[14px] h-12 rounded-[13px] no-underline">
                                    <IconBrandWhatsapp size={20} /> Chat on WhatsApp
                                </a>
                            </div>
                        )}
                    </div>
                </>
            )}

            <main className="flex-1 min-h-screen pb-14 lg:pb-0">{children}</main>

            {/* ── FOOTER ── */}
            {!hideFooter && (
            <footer style={{ background: 'var(--color-dark-bg, #0a0a0a)', color: 'white' }}>
                {/* Newsletter */}
                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', padding: 'clamp(40px,6vw,64px) clamp(20px,5vw,48px)' }}>
                    <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div>
                            <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 8px' }}>EXCLUSIVE OFFERS</p>
                            <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 900, fontSize: 'clamp(22px,3vw,32px)', color: 'white', margin: '0 0 8px', lineHeight: 1.1 }}>Stay in the Loop</h2>
                            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', margin: 0 }}>New arrivals, exclusive deals & style tips. No spam, ever.</p>
                        </div>
                        <form onSubmit={(e)=>{e.preventDefault(); const inp=e.currentTarget.querySelector('input') as HTMLInputElement; if(inp?.value){ fetch('/newsletter/subscribe',{method:'POST',headers:{'Content-Type':'application/json','X-CSRF-TOKEN':(document.querySelector('meta[name=csrf-token]') as HTMLInputElement)?.content||''},body:JSON.stringify({email:inp.value})}); inp.value=''; alert('Subscribed! Thank you.'); }}}
                            style={{ display: 'flex', gap: 0, borderRadius: 100, overflow: 'hidden', border: '1.5px solid rgba(255,255,255,0.15)', maxWidth: 440, width: '100%' }}>
                            <input type="email" placeholder="Enter your email address" required
                                style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: 'none', padding: '14px 20px', color: 'white', fontSize: 14, outline: 'none', minWidth: 0 }}/>
                            <button type="submit"
                                style={{ background: 'var(--color-primary)', color: 'var(--color-primary-text, #0a0a0a)', border: 'none', padding: '14px 24px', fontWeight: 800, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
                                Subscribe →
                            </button>
                        </form>
                    </div>
                </div>

                {/* Main footer */}
                <div style={{ padding: 'clamp(40px,5vw,56px) clamp(20px,5vw,48px) 32px', maxWidth: 1400, margin: '0 auto' }}>
                    <div className="grid grid-cols-2 lg:grid-cols-4" style={{ gap: 'clamp(24px,4vw,48px)', marginBottom: 40 }}>

                        {/* Brand */}
                        <div>
                            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, textDecoration: 'none' }}>
                                {logoUrl ? (
                                    <img src={logoUrl} alt={siteName} style={{ height: 40, width: 'auto', maxWidth: 120, objectFit: 'contain' }} />
                                ) : (
                                    <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 18, color: 'var(--color-primary-text, #0a0a0a)', fontFamily: 'Manrope, sans-serif' }}>{siteName[0]}</div>
                                )}
                                <div>
                                    <p style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 900, fontSize: 16, letterSpacing: '0.08em', margin: 0, color: 'white' }}>{siteName}.</p>
                                    {tagline && <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', margin: 0, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{tagline}</p>}
                                </div>
                            </Link>
                            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, marginBottom: 16 }}>Premium fashion and lifestyle products for those who know their worth.</p>
                            {phone && <a href={`tel:${phone}`} style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>📞 {phone}</a>}
                        </div>

                        {/* Quick Links */}
                        <div>
                            <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 16 }}>QUICK LINKS</p>
                            {[['Home','/'],['Shop','/shop'],['New Arrivals','/new-arrivals'],['About','/about'],['Contact','/contact'],['Track Order','/track-order']].map(([l,h])=>(
                                <Link key={l} href={h} style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', marginBottom: 8, transition: 'color 0.2s' }}
                                    onMouseEnter={e=>(e.currentTarget.style.color='white')} onMouseLeave={e=>(e.currentTarget.style.color='rgba(255,255,255,0.5)')}>{l}</Link>
                            ))}
                        </div>

                        {/* Support */}
                        <div>
                            <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 16 }}>SUPPORT</p>
                            {[['Support Center','/support'],['Returns & Exchange','/pages/return-policy'],['Track Your Order','/track-order'],['Shipping Info','/pages/shipping-policy'],['FAQ','/support'],['Contact Us','/contact']].map(([l,h])=>(
                                <Link key={l} href={h} style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', marginBottom: 8, transition: 'color 0.2s' }}
                                    onMouseEnter={e=>(e.currentTarget.style.color='white')} onMouseLeave={e=>(e.currentTarget.style.color='rgba(255,255,255,0.5)')}>{l}</Link>
                            ))}
                        </div>

                        {/* Legal */}
                        <div>
                            <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 16 }}>LEGAL</p>
                            {[['Privacy Policy','/pages/privacy-policy'],['Terms of Service','/pages/terms'],['Return Policy','/pages/return-policy'],['Shipping Policy','/pages/shipping-policy'],['Payment Policy','/pages/payment-policy']].map(([l,h])=>(
                                <Link key={l} href={h} style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', marginBottom: 8, transition: 'color 0.2s' }}
                                    onMouseEnter={e=>(e.currentTarget.style.color='white')} onMouseLeave={e=>(e.currentTarget.style.color='rgba(255,255,255,0.5)')}>{l}</Link>
                            ))}
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', margin: 0 }}>© {new Date().getFullYear()} <strong style={{ color: 'rgba(255,255,255,0.5)' }}>{siteName}</strong> — All Rights Reserved.</p>

                        {/* Secure payment badges */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginRight: 4 }}>🔒 Secure Payments:</span>
                            {['JazzCash','Easypaisa','Visa','Mastercard','PayFast','COD'].map(b=>(
                                <span key={b} style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>{b}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
            )}

            {/* ── Mobile Bottom Navigation ── */}
            <nav className="lg:hidden" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9970, background: 'white', borderTop: '1.5px solid #E5E7EB', paddingBottom: 'env(safe-area-inset-bottom, 0px)', boxShadow: '0 -2px 16px rgba(0,0,0,0.07)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', height: 56 }}>
                    {([
                        { href: '/',         label: 'Home',   d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
                        { href: '/shop?category=men',   label: 'Men',   d: 'M12 12c2.7 0 8 1.34 8 4v2H4v-2c0-2.66 5.3-4 8-4zm0-2a4 4 0 110-8 4 4 0 010 8z' },
                        { href: '/shop?category=women', label: 'Women', d: 'M12 10a4 4 0 110-8 4 4 0 010 8zm-3.5 2h7l-2 10h-3l-2-10z' },
                        { href: '/shop?category=kids',   label: 'Kids',  d: 'M12 12a2 2 0 100-4 2 2 0 000 4zM3 5l7 5-7 5V5zm18 0v10l-7-5 7-5z' },
                        { href: auth?.user ? '/account' : '/login', label: auth?.user ? 'Profile' : 'Login', d: 'M12 2a10 10 0 100 20 10 10 0 000-20zm0 4a3 3 0 110 6 3 3 0 010-6zm0 12.2a6.2 6.2 0 01-5-2.53c.03-1.66 3.33-2.57 5-2.57s4.97.91 5 2.57A6.2 6.2 0 0112 18.2z' },
                    ] as Array<{href:string;label:string;d:string;badge?:number}>).map(item => {
                        const isActive = typeof window !== 'undefined' && (window.location.pathname === item.href || (item.href !== '/' && window.location.pathname.startsWith(item.href)))
                        return (
                            <Link key={item.href} href={item.href} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, textDecoration: 'none', position: 'relative', color: isActive ? 'var(--color-primary)' : '#9CA3AF' }}>
                                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d={item.d}/>
                                </svg>
                                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.02em', lineHeight: 1 }}>{item.label}</span>
                                {isActive && <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 20, height: 2, background: 'var(--color-primary)', borderRadius: '2px 2px 0 0' }} />}
                                {item.badge && item.badge > 0 ? <span style={{ position: 'absolute', top: 5, right: 'calc(50% - 16px)', background: 'var(--color-primary)', color: 'var(--color-primary-text, #0a0a0a)', borderRadius: '50%', width: 14, height: 14, fontSize: 7.5, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid white' }}>{item.badge > 9 ? '9+' : item.badge}</span> : null}
                            </Link>
                        )
                    })}
                </div>
            </nav>
            <div className="lg:hidden" style={{ height: 56 }} />


            {/* ── FLOATING WHATSAPP — own enable/position/size settings,
                separate from the header WhatsApp links (show_whatsapp_button),
                and now auto-stacks with Chat/Cart instead of overlapping them ── */}
            {(() => {
                const wa = getFloatOffset(settings, 'whatsapp', { chat: true, cart: true, whatsapp: false })
                if (!wa.enabled || !whatsapp) return null
                const sidePx = wa.side
                const posStyle = wa.corner === 'left' ? { left: sidePx } : { right: sidePx }
                return (
                    <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer"
                        className="fixed z-[9960] flex items-center justify-center bg-[#25D366] text-white rounded-full no-underline hover:scale-110 transition-transform"
                        style={{ bottom: wa.bottom, ...posStyle, width: wa.diameter, height: wa.diameter, animation: 'wapulse 2.5s infinite', boxShadow: '0 4px 20px rgba(37,211,102,0.45)' }}>
                        <IconBrandWhatsapp size={Math.round(wa.diameter * 0.48)} />
                    </a>
                )
            })()}
            {/* ── Floating UI — above bottom nav ── */}
            {!hideFloatingCart && <FloatingCart settings={settings ?? {}} />}
        </div>
    )
}
