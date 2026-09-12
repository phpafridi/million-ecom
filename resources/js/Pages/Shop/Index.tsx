import { useState, useEffect, useRef } from 'react'
import { Head, router, Link } from '@inertiajs/react'
import { IconAdjustmentsHorizontal, IconX, IconChevronDown, IconChevronUp } from '@tabler/icons-react'
import StorefrontLayout from '@/Layouts/StorefrontLayout'
import ProductCard from '@/Components/Storefront/ProductCard'
import { ProductCardSkeleton } from '@/Components/ui/Skeleton'
import { motion } from 'framer-motion'
import type { Product, Category, PageProps } from '@/types'

interface Props extends PageProps {
    products: { data: Product[]; total: number; last_page: number; current_page: number }
    categories: Category[]
    filters: { q?: string; category?: string; max_price?: number; sort?: string }
    settings: Record<string, string>
    activeCategory?: { name: string; slug: string; banner_image?: string; children?: { name: string; slug: string; image?: string; mobile_image?: string }[] } | null
}

const SORTS = [
    { value: 'default',   label: 'Default' },
    { value: 'price_asc', label: 'Price ↑' },
    { value: 'price_desc',label: 'Price ↓' },
    { value: 'newest',    label: 'Newest' },
    { value: 'discount',  label: 'Best Deals' },
]

const PRICES = [
    { label: 'All Prices',       max: undefined },
    { label: 'Under Rs 25,000',  max: 25000 },
    { label: 'Under Rs 75,000',  max: 75000 },
    { label: 'Under Rs 200,000', max: 200000 },
    { label: 'Rs 200,000+',      max: 9999999 },
]

export default function ShopIndex({ products: initialProducts, categories, filters: rawFilters, settings, auth, activeCategory }: Props) {
    const filters = rawFilters ?? {}
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [sort, setSort] = useState(filters.sort ?? 'default')
    const [loading, setLoading] = useState(false)
    const whatsapp = settings?.whatsapp_number ?? '923001234567'

    // Infinite scroll — accumulates pages client-side instead of the old
    // click Prev/Next pagination. Starts with whatever the server sent
    // for page 1, appends more as the user scrolls near the bottom.
    const [items, setItems] = useState(initialProducts.data)
    const [page, setPage] = useState(initialProducts.current_page)
    const [hasMore, setHasMore] = useState(initialProducts.current_page < initialProducts.last_page)
    const [loadingMore, setLoadingMore] = useState(false)
    const sentinelRef = useRef<HTMLDivElement | null>(null)

    // Any filter/sort change resets back to a fresh page-1 list — without
    // this, switching category would just keep appending to the old list.
    useEffect(() => {
        setItems(initialProducts.data)
        setPage(initialProducts.current_page)
        setHasMore(initialProducts.current_page < initialProducts.last_page)
    }, [initialProducts])

    useEffect(() => {
        if (!hasMore) return
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !loadingMore) loadMore()
        }, { rootMargin: '400px' }) // starts fetching before the sentinel is actually on screen, so it feels instant
        if (sentinelRef.current) observer.observe(sentinelRef.current)
        return () => observer.disconnect()
    }, [hasMore, loadingMore, page, filters])

    function loadMore() {
        setLoadingMore(true)
        const params: Record<string, any> = { ...filters, page: page + 1 }
        Object.keys(params).forEach(k => { if (params[k] == null || params[k] === '') delete params[k] })
        const qs = new URLSearchParams(params as any).toString()
        fetch(`/shop?${qs}`, { headers: { 'X-Inertia': 'true', 'X-Requested-With': 'XMLHttpRequest', 'Accept': 'text/html, application/xhtml+xml' } })
            .then(res => res.json())
            .then(data => {
                const fresh = data.props?.products
                if (!fresh) { setHasMore(false); return }
                setItems(prev => [...prev, ...fresh.data])
                setPage(fresh.current_page)
                setHasMore(fresh.current_page < fresh.last_page)
            })
            .catch(() => setHasMore(false))
            .finally(() => setLoadingMore(false))
    }

    const products = { ...initialProducts, data: items }

    // Show skeletons while a filter/sort/page change is in flight (preserveState requests still
    // round-trip the server, so there's a real gap worth covering with a loading state)
    useEffect(() => {
        const removeStart  = router.on('start',  () => setLoading(true))
        const removeFinish = router.on('finish', () => setLoading(false))
        return () => { removeStart(); removeFinish() }
    }, [])

    function apply(params: Record<string, any>) {
        const base: Record<string,any> = {}
        if (filters && typeof filters === 'object' && !Array.isArray(filters)) Object.assign(base, filters)
        Object.assign(base, params)
        Object.keys(base).forEach(k => { if (base[k] == null || base[k] === '') delete base[k] })
        router.get('/shop', base, { preserveState: true, preserveScroll: true })
    }

    const title = filters.q
        ? `"${filters.q}"`
        : filters.category
            ? activeCategory?.name ?? filters.category
            : 'All Products'

    return (
        <StorefrontLayout auth={auth} settings={settings}>
            <Head title={title} />

            {/* Page header — matches the reference exactly: plain banner
                photo on top (no text overlay), then the category title
                centered on a plain white background below it. Falls back
                to the dark title bar only when there's no category image
                (browsing "All Products" or a search). */}
            {activeCategory?.banner_image ? (
                <>
                    <div style={{ height: 'clamp(180px, 26vw, 340px)', position: 'relative', overflow: 'hidden' }}>
                        <img src={activeCategory.banner_image} alt={activeCategory.name} className="w-full h-full object-cover" style={{ display: 'block' }} />
                    </div>
                    <div className="bg-white text-center py-6 px-4 border-b border-gray-100" style={{ position: 'relative', zIndex: 1, overflow: 'hidden' }}>
                        <div className="text-[11.5px] text-gray-400 mb-2">
                            <Link href="/" className="no-underline text-gray-400">Home</Link>
                            <span className="mx-1.5">›</span>
                            <span className="text-gray-600 font-semibold">{activeCategory.name}</span>
                        </div>
                        <h1 className="font-manrope font-black text-[22px] sm:text-[32px] tracking-tight text-gray-900" style={{ margin: 0 }}>{title}</h1>
                    </div>
                </>
            ) : (
                <div className="px-4 sm:px-6 lg:px-10 py-4 sm:py-5"
                    style={{ background: 'var(--color-dark-bg,#0a0a0a)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[.1em] mb-1"
                        style={{ color: 'var(--color-primary,#C9A84C)' }}>
                        {filters.q ? 'Search Results' : 'Shop'}
                    </div>
                    <h1 className="font-manrope font-black text-[22px] sm:text-[26px] tracking-tight"
                        style={{ color: '#ffffff' }}>{title}</h1>
                </div>
            )}

            {/* Circular subcategory shortcuts — works at ANY category
                depth now (was only working for top-level categories
                before, since it searched the top-level `categories` array;
                activeCategory is resolved server-side by slug directly,
                so it correctly finds children for 2nd-level categories
                like "Men's Clothing" too, enabling the 3rd-level carousel). */}
            {(() => {
                const kids = activeCategory?.children
                if (!kids || kids.length === 0) return null
                return (
                    <div className="bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-10 py-6" style={{ position: 'relative', zIndex: 1 }}>
                        <div className="flex gap-6 sm:gap-8 overflow-x-auto justify-center flex-wrap" style={{ scrollbarWidth: 'none', rowGap: 20 }}>
                            {kids.map((sub: any) => (
                                <button key={sub.slug} onClick={() => apply({ category: sub.slug })}
                                    className="flex flex-col items-center gap-2.5 flex-shrink-0 border-none bg-transparent cursor-pointer p-0 group">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-gray-100 border-2 transition-all"
                                        style={{ borderColor: filters.category === sub.slug ? 'var(--color-primary)' : 'transparent' }}>
                                        {sub.image && <img src={sub.image} alt={sub.name ?? sub.label} className="w-full h-full object-cover" />}
                                    </div>
                                    <span className="text-[10.5px] sm:text-[11.5px] font-bold uppercase tracking-wide text-gray-700 group-hover:opacity-70 whitespace-nowrap">
                                        {sub.name ?? sub.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )
            })()}

            <div className="flex min-h-0 items-start">
                {/* SIDEBAR — click-to-open overlay panel on ALL screen
                    sizes now, matching the reference exactly. Was
                    previously always-visible on desktop (a permanent
                    static column) — now hidden by default everywhere,
                    only appearing when "Filter" is clicked. */}
                <>
                    {/* Overlay backdrop — now shows on desktop too */}
                    {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-30" onClick={() => setSidebarOpen(false)} />}

                    <aside className={`
                        bg-white border-r border-gray-100 flex-shrink-0 overflow-y-auto transition-all duration-300
                        fixed top-0 left-0 bottom-0 z-40 w-72 shadow-2xl
                        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    `}>
                        {/* Close button — now shows on all screen sizes */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-100">
                            <span className="font-bold text-[15px]">Filters</span>
                            <button onClick={() => setSidebarOpen(false)} className="border-none bg-transparent cursor-pointer text-gray-500"><IconX size={20} /></button>
                        </div>

                        <div className="p-4 space-y-5">
                            {/* Categories */}
                            <div>
                                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-wider mb-3">Categories</h3>
                                <div className="space-y-0.5">
                                    <label className="flex items-center justify-between px-0 py-2.5 border-b border-gray-50 cursor-pointer group">
                                        <div className="flex items-center gap-2.5">
                                            <input type="radio" name="cat" value="" checked={!filters.category}
                                                onChange={() => apply({ category: undefined })} className="accent-[var(--color-primary,#00c8ff)] w-4 h-4 cursor-pointer" />
                                            <span className="text-[13px] font-semibold text-gray-700 group-hover:text-[var(--color-primary,#00c8ff)]">All</span>
                                        </div>
                                        <span className="text-[11px] text-gray-400">{products.total}</span>
                                    </label>
                                    {categories.map(cat => (
                                        <div key={cat.id}>
                                            <label className="flex items-center justify-between px-0 py-2.5 border-b border-gray-50 cursor-pointer group">
                                                <div className="flex items-center gap-2.5">
                                                    <input type="radio" name="cat" value={cat.slug} checked={filters.category === cat.slug}
                                                        onChange={() => { apply({ category: cat.slug }); setSidebarOpen(false) }}
                                                        className="w-4 h-4 cursor-pointer" style={{accentColor:'var(--color-primary)'}} />
                                                    <span className="text-[13px] font-semibold text-gray-700 group-hover:text-[var(--color-primary)]">{cat.name}</span>
                                                </div>
                                            </label>
                                            {(cat as any).children?.map((sub: any) => (
                                                <label key={sub.id} className="flex items-center justify-between pl-5 pr-0 py-2 cursor-pointer group">
                                                    <div className="flex items-center gap-2.5">
                                                        <input type="radio" name="cat" value={sub.slug} checked={filters.category === sub.slug}
                                                            onChange={() => { apply({ category: sub.slug }); setSidebarOpen(false) }}
                                                            className="w-3.5 h-3.5 cursor-pointer" style={{accentColor:'var(--color-primary)'}} />
                                                        <span className="text-[12px] text-gray-500 group-hover:text-[var(--color-primary)]">└ {sub.name}</span>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Price */}
                            <div>
                                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-wider mb-3">Price Range</h3>
                                <div className="space-y-0.5">
                                    {PRICES.map((r, i) => (
                                        <label key={i} className="flex items-center gap-2.5 px-0 py-2.5 border-b border-gray-50 cursor-pointer group">
                                            <input type="radio" name="price" className="accent-[var(--color-primary,#00c8ff)] w-4 h-4 cursor-pointer"
                                                checked={filters.max_price === r.max}
                                                onChange={() => { apply({ max_price: r.max }); setSidebarOpen(false) }} />
                                            <span className="text-[13px] font-semibold text-gray-700 group-hover:text-[var(--color-primary,#00c8ff)]">{r.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Clear filters */}
                            {(filters.q || filters.category || filters.max_price) && (
                                <button onClick={() => router.get('/shop')}
                                    className="flex items-center gap-1.5 text-[12.5px] text-red-500 hover:text-red-600 font-semibold border-none bg-transparent cursor-pointer px-3">
                                    <IconX size={14} /> Clear all filters
                                </button>
                            )}
                        </div>
                    </aside>
                </>

                {/* MAIN */}
                <div className="flex-1 min-w-0 p-3 sm:p-4 lg:p-5">
                    {/* Sort + filter bar */}
                    <div className="bg-white border border-gray-100 rounded-2xl flex items-center flex-wrap px-3 sm:px-4 py-2.5 mb-4 gap-2 sm:gap-3">
                        <button onClick={() => setSidebarOpen(true)}
                            className="flex items-center gap-2 text-[13px] font-semibold text-gray-600 hover:text-[var(--color-primary,#00c8ff)] border border-gray-200 rounded-xl px-3 py-2 bg-white cursor-pointer transition-colors flex-shrink-0">
                            <IconAdjustmentsHorizontal size={16} /> Filter
                        </button>
                        <span className="text-[12.5px] sm:text-[13px] text-gray-500 flex-shrink-0">
                            <strong style={{ color: 'var(--color-body-text)' }}>{products.total}</strong> products
                        </span>
                        {/* Real dropdown, not button pills — matches
                            "SORT BY: [Date, New to Old ▾]" from the
                            reference exactly, rather than a row of chips. */}
                        <div className="ml-auto flex items-center gap-2 flex-shrink-0">
                            <span className="text-[11.5px] sm:text-[12.5px] font-semibold text-gray-500 whitespace-nowrap hidden sm:inline">SORT BY:</span>
                            <select value={sort} onChange={(e) => { setSort(e.target.value); apply({ sort: e.target.value }) }}
                                className="text-[12px] sm:text-[13px] font-semibold text-gray-700 border border-gray-200 rounded-lg px-3 py-2 bg-white cursor-pointer outline-none focus:border-[var(--color-primary)]">
                                {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3">
                            {Array(8).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)}
                        </div>
                    ) : products.data.length === 0 ? (
                        <div className="text-center py-16 sm:py-24">
                            <div className="text-6xl mb-5">🛍️</div>
                            <div className="font-manrope font-black text-[20px] text-gray-800 mb-2">
                                {filters.q || filters.category ? 'No products found' : 'No products yet'}
                            </div>
                            <div className="text-[14px] text-gray-400 mb-6">
                                {filters.q || filters.category
                                    ? 'Try a different search or category'
                                    : 'Products will appear here once added from the admin panel'}
                            </div>
                            {(filters.q || filters.category) ? (
                                <button onClick={() => router.get('/shop', {})}
                                    className="inline-flex items-center gap-2 h-11 px-7 font-black text-[13px] rounded-xl border-none cursor-pointer"
                                    style={{ background: 'var(--color-primary)', color: 'var(--color-primary-text)' }}>
                                    Clear Filters
                                </button>
                            ) : (
                                <a href="/" className="inline-flex items-center gap-2 h-11 px-7 font-black text-[13px] rounded-xl no-underline"
                                    style={{ background: 'var(--color-primary)', color: 'var(--color-primary-text)' }}>
                                    ← Go Home
                                </a>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3">
                            {products.data.map((p, i) => (
                                <motion.div key={p.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.4), ease: [0.22, 1, 0.36, 1] }}>
                                    <ProductCard product={p} whatsapp={whatsapp} />
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Infinite scroll sentinel — invisible marker that
                        triggers loading the next page once it nears the
                        viewport (see rootMargin above), replacing the old
                        click Prev/Next pagination entirely. */}
                    {hasMore && (
                        <div ref={sentinelRef} className="flex items-center justify-center py-8">
                            {loadingMore && (
                                <div className="flex items-center gap-2 text-[13px] text-gray-400">
                                    <div className="w-4 h-4 border-2 border-gray-300 border-t-[var(--color-primary)] rounded-full animate-spin" />
                                    Loading more...
                                </div>
                            )}
                        </div>
                    )}
                    {!hasMore && products.data.length > 0 && (
                        <div className="text-center py-8 text-[12.5px] text-gray-400">
                            You've seen all {products.total} products
                        </div>
                    )}
                </div>
            </div>
        </StorefrontLayout>
    )
}
