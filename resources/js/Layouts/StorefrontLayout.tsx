import { useState, useEffect, useRef } from 'react'
import { Link, router, usePage } from '@inertiajs/react'
import ChatWidget from '@/Components/Chat/ChatWidget'
import {
    IconSearch, IconBrandWhatsapp, IconBrandFacebook, IconBrandInstagram,
    IconMenu, IconX, IconChevronDown, IconPhone,
    IconInfoCircle, IconMessageCircle, IconShoppingCart, IconSun, IconMoon, IconHeart
} from '@tabler/icons-react'

interface NavItem { label: string; href: string; children?: NavItem[] }
interface Props { children: React.ReactNode; auth?: any; settings?: Record<string, string> }

export default function StorefrontLayout({ children, auth, settings }: Props) {
    const [search, setSearch]           = useState('')
    const [mobileOpen, setMobileOpen]   = useState(false)
    const [searchOpen, setSearchOpen]   = useState(false)
    const [scrolled, setScrolled]       = useState(false)
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const siteName = settings?.site_name ?? 'Tijar'
    const phone    = settings?.phone     ?? ''
    const whatsapp = settings?.whatsapp_number ?? ''
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
        return cat ? currentUrl.includes(cat) : currentUrl.startsWith(link.href)
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
        <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-body-bg)' }}>

            {/* ── Admin Mode Banner ── */}
            {auth?.user?.role === 'admin' && (
                <div style={{ background: '#7C3AED', color: 'white', padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, zIndex: 100 }}>
                    <span>🔐 Admin Preview Mode — customers see this page normally</span>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                        <span style={{ opacity: 0.6 }}>Logged in as: {auth.user.name}</span>
                        <a href="/ml-admin" style={{ color: 'white', textDecoration: 'none', opacity: 0.9 }}>← Back to Admin</a>
                    </div>
                </div>
            )}

            {/* ── TOPBAR — uses CSS vars so it changes with theme ── */}
            <div className="hidden md:flex h-9 items-center justify-between px-6 lg:px-10 border-b"
                style={{ background: 'var(--color-topbar-bg, var(--color-dark-bg, #0a0a0a))', borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-5">
                    {phone && showPhone && (
                        <a href={`tel:${phone}`} className="flex items-center gap-1.5 text-[11.5px] no-underline transition-colors hover:opacity-80"
                            style={{ color: 'rgba(255,255,255,0.65)' }}>
                            <IconPhone size={12} /> {phone}
                        </a>
                    )}
                    {showWhatsapp && whatsapp && (
                        <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-[11.5px] no-underline hover:opacity-80"
                            style={{ color: '#25D366' }}>
                            <IconBrandWhatsapp size={12} /> WhatsApp
                        </a>
                    )}
                </div>
                <div className="text-[11.5px] font-semibold hidden lg:block" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    {settings?.topbar_message ?? ''}
                </div>
                <div className="flex items-center gap-4">
                    {showFacebook && fbUrl && (
                        <a href={fbUrl} target="_blank" rel="noopener noreferrer" className="no-underline hover:opacity-80" style={{ color: 'rgba(255,255,255,0.6)' }}>
                            <IconBrandFacebook size={15} />
                        </a>
                    )}
                    {showInstagram && igUrl && (
                        <a href={igUrl} target="_blank" rel="noopener noreferrer" className="no-underline hover:opacity-80" style={{ color: 'rgba(255,255,255,0.6)' }}>
                            <IconBrandInstagram size={15} />
                        </a>
                    )}
                    <Link href="/about"   className="text-[11.5px] no-underline transition-colors hover:opacity-80" style={{ color: 'rgba(255,255,255,0.6)' }}>About</Link>
                    <Link href="/contact" className="text-[11.5px] no-underline transition-colors hover:opacity-80" style={{ color: 'rgba(255,255,255,0.6)' }}>Contact</Link>
                </div>
            </div>

            {/* ── HEADER ── */}
            <header className={`bg-white sticky top-0 z-50 transition-shadow duration-200 ${scrolled ? 'shadow-[0_2px_20px_rgba(0,0,0,0.08)]' : 'border-b border-gray-200'}`}>
                <div className="px-4 sm:px-6 lg:px-10 h-[60px] sm:h-[70px] flex items-center gap-3">

                    {/* Mobile menu toggle */}
                    <button className="lg:hidden flex-shrink-0 w-9 h-9 flex items-center justify-center border-none bg-transparent cursor-pointer text-gray-600"
                        onClick={() => { setMobileOpen(!mobileOpen); setSearchOpen(false) }}>
                        {mobileOpen ? <IconX size={22} /> : <IconMenu size={22} />}
                    </button>

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0 no-underline">
                        <div className="w-[40px] h-[40px] sm:w-[46px] sm:h-[46px] rounded-[calc(var(--radius,12px))] overflow-hidden flex-shrink-0 flex items-center justify-center border border-gray-100"
                            style={{ background: 'var(--color-dark-bg)' }}>
                            {logoUrl
                                ? <img src={logoUrl} alt={siteName} className="w-full h-full object-contain" />
                                : <span className="font-manrope font-black text-lg sm:text-xl" style={{ color: 'var(--color-primary)' }}>{siteName[0]}</span>
                            }
                        </div>
                        <div className="hidden sm:block">
                            <div className="font-manrope font-black text-[17px] sm:text-[19px] tracking-[2px] leading-none" style={{ color: 'var(--color-dark-bg)' }}>{siteName}</div>
                            {tagline && <div className="text-[7px] sm:text-[8px] tracking-[.15em] font-bold uppercase mt-0.5" style={{ color: 'var(--color-primary)' }}>{tagline}</div>}
                        </div>
                    </Link>

                    {/* Desktop search */}
                    <form onSubmit={doSearch} className="hidden lg:flex flex-1 max-w-[500px] h-[44px] border-2 rounded-[12px] overflow-hidden transition-shadow"
                        style={{ borderColor: 'var(--color-primary)' }}>
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products, brands…"
                            className="flex-1 border-none outline-none px-4 text-[13.5px] text-gray-800 placeholder:text-gray-400" />
                        <button type="submit" className="px-5 font-black text-[13px] flex items-center gap-2 flex-shrink-0 border-none cursor-pointer"
                            style={{ background: 'var(--color-primary)', color: 'var(--color-primary-text)' }}>
                            <IconSearch size={16} /> Search
                        </button>
                    </form>

                    {/* Mobile search toggle */}
                    <button className="lg:hidden w-9 h-9 flex items-center justify-center border-none bg-transparent cursor-pointer flex-shrink-0 text-gray-600"
                        onClick={() => { setSearchOpen(!searchOpen); setMobileOpen(false) }}>
                        <IconSearch size={20} />
                    </button>

                    {/* Wishlist */}
                    <Link href="/wishlist" className="relative flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors no-underline text-gray-600"
                        title="My Wishlist">
                        <IconHeart size={21}/>
                        {wishlistCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full text-[9px] font-black flex items-center justify-center text-white px-1"
                                style={{ background: 'var(--color-accent, #e91e63)' }}>
                                {wishlistCount > 9 ? '9+' : wishlistCount}
                            </span>
                        )}
                    </Link>

                    {/* Cart */}
                    <Link href="/cart" className="relative flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors no-underline text-gray-600">
                        <IconShoppingCart size={21} />
                        {cartCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full text-[9px] font-black flex items-center justify-center text-white px-1"
                                style={{ background: 'var(--color-primary)' }}>
                                {cartCount > 9 ? '9+' : cartCount}
                            </span>
                        )}
                    </Link>

                    {/* Dark mode toggle */}
                    <button onClick={toggleDark} className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors border-none bg-transparent cursor-pointer text-gray-600"
                        title={darkMode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
                        {darkMode === 'dark' ? <IconSun size={19} /> : <IconMoon size={19} />}
                    </button>

                    {/* Desktop right links */}
                    <div className="hidden lg:flex items-center gap-1 ml-1">
                        <Link href="/about"   className="flex items-center gap-1.5 h-[38px] px-3 rounded-[10px] text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition-all no-underline"><IconInfoCircle size={16} /> About</Link>
                        <Link href="/contact" className="flex items-center gap-1.5 h-[38px] px-3 rounded-[10px] text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition-all no-underline"><IconMessageCircle size={16} /> Contact</Link>
                    </div>
                </div>

                {/* Mobile search dropdown */}
                {searchOpen && (
                    <div className="lg:hidden px-4 pb-3 border-t border-gray-100 pt-2">
                        <form onSubmit={doSearch} className="flex border-2 rounded-xl overflow-hidden h-10" style={{ borderColor: 'var(--color-primary)' }}>
                            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…" autoFocus className="flex-1 px-4 text-[13.5px] outline-none border-none" />
                            <button type="submit" className="px-4 border-none cursor-pointer" style={{ background: 'var(--color-primary)', color: 'var(--color-primary-text)' }}>
                                <IconSearch size={17} />
                            </button>
                        </form>
                    </div>
                )}
            </header>

            {/* ── DESKTOP NAV ── */}
            <nav className="hidden lg:block bg-white border-b-2 border-gray-200 sticky top-[70px] z-40" ref={dropdownRef}>
                <div className="px-6 lg:px-10 flex items-stretch h-[46px]">
                    {navItems.map(link => {
                        const hasChildren = (link.children?.length ?? 0) > 0
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
                                    <div className="absolute top-full left-0 bg-white border border-gray-200 rounded-xl shadow-xl py-1.5 min-w-[180px] z-50">
                                        {link.children!.map(child => (
                                            <Link key={child.href} href={child.href} onClick={() => setActiveDropdown(null)}
                                                className="flex items-center gap-2 px-4 py-2.5 text-[12.5px] font-semibold text-gray-700 hover:bg-gray-50 no-underline transition-colors"
                                                style={{ color: isActive(child) ? 'var(--color-primary)' : undefined }}>
                                                {child.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                    <div className="ml-auto flex items-center py-1.5 flex-shrink-0">
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
                    <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
                    <div className="fixed top-0 left-0 bottom-0 w-[280px] bg-white z-50 lg:hidden overflow-y-auto shadow-2xl">
                        <div className="flex items-center justify-between px-5 h-[60px] border-b border-gray-100">
                            <div className="font-manrope font-black text-[18px] tracking-[2px]" style={{ color: 'var(--color-dark-bg)' }}>{siteName}</div>
                            <button onClick={() => setMobileOpen(false)} className="text-gray-500 border-none bg-transparent cursor-pointer"><IconX size={22} /></button>
                        </div>
                        <div className="py-1">
                            {navItems.map(item => <MobileNavItem key={item.href} item={item} />)}
                        </div>
                        <div className="border-t border-gray-100 py-2">
                            <Link href="/about"   onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-5 py-3.5 text-[14px] font-semibold text-gray-700 no-underline"><IconInfoCircle size={18} /> About Us</Link>
                            <Link href="/contact" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-5 py-3.5 text-[14px] font-semibold text-gray-700 no-underline"><IconMessageCircle size={18} /> Contact Us</Link>
                            <Link href="/wishlist" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-5 py-3.5 text-[14px] font-semibold text-gray-700 no-underline">
                                <IconHeart size={18}/> Wishlist {wishlistCount > 0 && <span className="ml-auto text-[11px] font-black px-2 py-0.5 rounded-full text-white" style={{ background:'var(--color-accent,#e91e63)' }}>{wishlistCount}</span>}
                            </Link>
                            <Link href="/cart"    onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-5 py-3.5 text-[14px] font-semibold text-gray-700 no-underline">
                                <IconShoppingCart size={18} /> Cart {cartCount > 0 && <span className="ml-auto text-[11px] font-black px-2 py-0.5 rounded-full text-white" style={{ background: 'var(--color-primary)' }}>{cartCount}</span>}
                            </Link>
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

            <main className="flex-1 min-h-screen">{children}</main>

            {/* ── FOOTER ── */}
            <footer className="border-t" style={{ background: 'var(--color-dark-bg2)', borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className="px-4 sm:px-6 lg:px-10 pt-8 sm:pt-10">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pb-8 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                        <div className="col-span-2 lg:col-span-1">
                            <div className="w-12 h-12 rounded-xl overflow-hidden mb-3 flex items-center justify-center border"
                                style={{ background: 'var(--color-dark-bg)', borderColor: 'rgba(255,255,255,0.1)' }}>
                                {logoUrl ? <img src={logoUrl} alt={siteName} className="w-full h-full object-contain" />
                                    : <span className="font-manrope font-black text-xl" style={{ color: 'var(--color-primary)' }}>{siteName[0]}</span>}
                            </div>
                            <div className="font-manrope font-black text-[18px] text-white tracking-[2px] mb-2">{siteName}<span style={{ color: 'var(--color-primary)' }}>.</span></div>
                            {tagline && <p className="text-[12px] mb-3 leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{tagline}</p>}
                            {phone && <div className="font-bold text-[13px] text-white mb-2">{phone}</div>}
                            {/* Social icons */}
                            <div className="flex gap-2 mt-2">
                                {showWhatsapp && whatsapp && (
                                    <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer"
                                        className="w-8 h-8 rounded-lg flex items-center justify-center no-underline transition-all hover:opacity-80"
                                        style={{ background: '#25D366', color: '#fff' }}>
                                        <IconBrandWhatsapp size={16} />
                                    </a>
                                )}
                                {showFacebook && fbUrl && (
                                    <a href={fbUrl} target="_blank" rel="noopener noreferrer"
                                        className="w-8 h-8 rounded-lg flex items-center justify-center no-underline hover:opacity-80"
                                        style={{ background: '#1877F2', color: '#fff' }}>
                                        <IconBrandFacebook size={16} />
                                    </a>
                                )}
                                {showInstagram && igUrl && (
                                    <a href={igUrl} target="_blank" rel="noopener noreferrer"
                                        className="w-8 h-8 rounded-lg flex items-center justify-center no-underline hover:opacity-80"
                                        style={{ background: '#E1306C', color: '#fff' }}>
                                        <IconBrandInstagram size={16} />
                                    </a>
                                )}
                            </div>
                        </div>
                        {[
                            { title: 'Quick Links', links: [['Home','/'],['Shop','/shop'],['About','/about'],['Contact','/contact'],['Cart','/cart']] },
                            { title: 'Support',     links: [['FAQ','/about'],['Returns','/about'],['Track Order','/contact']] },
                        ].map(col => (
                            <div key={col.title}>
                                <h4 className="text-[11px] font-black text-white uppercase tracking-[.08em] mb-4 pb-2 border-b-2"
                                    style={{ borderColor: 'var(--color-primary)' }}>{col.title}</h4>
                                {col.links.map(([label, href]) => (
                                    <Link key={label} href={href} className="block text-[12.5px] mb-2 no-underline hover:opacity-80 transition-all"
                                        style={{ color: 'rgba(255,255,255,0.5)' }}>{label}</Link>
                                ))}
                            </div>
                        ))}
                        <div>
                            <h4 className="text-[11px] font-black text-white uppercase tracking-[.08em] mb-4 pb-2 border-b-2" style={{ borderColor: 'var(--color-primary)' }}>Contact</h4>
                            {phone && <a href={`tel:${phone}`} className="block text-[12.5px] mb-2 no-underline hover:opacity-80" style={{ color: 'rgba(255,255,255,0.5)' }}>{phone}</a>}
                            {showWhatsapp && whatsapp && <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="block text-[12.5px] mb-2 no-underline hover:opacity-80" style={{ color: 'rgba(255,255,255,0.5)' }}>WhatsApp</a>}
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 gap-3">
                        <span className="text-[12px]" style={{ color: 'rgba(255,255,255,0.3)' }}>© {new Date().getFullYear()} <strong className="text-white/50">{siteName}</strong> — All Rights Reserved.</span>
                        <div className="flex gap-1.5 flex-wrap">
                            {['JazzCash','Easypaisa','Visa','Mastercard','COD'].map(p => (
                                <span key={p} className="px-2 py-1 text-[10px] font-bold rounded"
                                    style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}>{p}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>

            {/* ── FLOATING WHATSAPP — only if enabled in settings ── */}
            {showWhatsapp && whatsapp && (
                <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer"
                    className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex items-center justify-center bg-[#25D366] text-white rounded-full no-underline hover:scale-110 transition-transform"
                    style={{ width: 54, height: 54, animation: 'wapulse 2.5s infinite', boxShadow: '0 4px 20px rgba(37,211,102,0.45)' }}>
                    <IconBrandWhatsapp size={26} />
                </a>
            )}
        </div>
    )
}
