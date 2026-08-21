import { useState, useEffect } from 'react'
import { Head, router } from '@inertiajs/react'
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

export default function ShopIndex({ products, categories, filters: rawFilters, settings, auth }: Props) {
    const filters = rawFilters ?? {}
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [sort, setSort] = useState(filters.sort ?? 'default')
    const [loading, setLoading] = useState(false)
    const whatsapp = settings?.whatsapp_number ?? '923001234567'

    // Show skeletons while a filter/sort/page change is in flight (preserveState requests still
    // round-trip the server, so there's a real gap worth covering with a loading state)
    useEffect(() => {
        const removeStart  = router.on('start',  () => setLoading(true))
        const removeFinish = router.on('finish', () => setLoading(false))
        return () => { removeStart(); removeFinish() }
    }, [])

    function apply(params: Record<string, any>) {
        router.get('/shop', { ...(filters ?? {}), ...params }, { preserveState: true, preserveScroll: true })
    }

    const title = filters.q
        ? `"${filters.q}"`
        : filters.category
            ? categories.find(c => c.slug === filters.category)?.name ?? filters.category
            : 'All Products'

    return (
        <StorefrontLayout auth={auth} settings={settings}>
            <Head title={title} />

            {/* Page header */}
            <div className="bg-[var(--color-dark-bg, #0a0e1a)] border-b border-[var(--color-dark-bg, #0a0e1a)] px-4 sm:px-6 lg:px-10 py-4 sm:py-5">
                <div className="text-[10px] sm:text-[11px] font-bold text-[var(--color-primary, #00c8ff)] uppercase tracking-[.1em] mb-1">
                    {filters.q ? 'Search Results' : 'Shop'}
                </div>
                <h1 className="font-manrope font-black text-[22px] sm:text-[26px] text-white tracking-tight">{title}</h1>
            </div>

            <div className="flex min-h-0 items-start">
                {/* SIDEBAR — drawer on mobile, sticky on desktop */}
                <>
                    {/* Mobile overlay */}
                    {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

                    <aside className={`
                        bg-white border-r border-gray-100 flex-shrink-0 overflow-y-auto transition-all duration-300
                        fixed top-0 left-0 bottom-0 z-40 w-72 shadow-2xl lg:shadow-none
                        lg:static lg:w-56 lg:block lg:sticky lg:top-[116px] lg:z-0 lg:max-h-[calc(100vh-116px)]
                        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    `}>
                        {/* Mobile close */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-100 lg:hidden">
                            <span className="font-bold text-[15px]">Filters</span>
                            <button onClick={() => setSidebarOpen(false)} className="border-none bg-transparent cursor-pointer text-gray-500"><IconX size={20} /></button>
                        </div>

                        <div className="p-4 space-y-5">
                            {/* Categories */}
                            <div>
                                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-wider mb-3">Categories</h3>
                                <div className="space-y-0.5">
                                    <label className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer group">
                                        <div className="flex items-center gap-2.5">
                                            <input type="radio" name="cat" value="" checked={!filters.category}
                                                onChange={() => apply({ category: undefined })} className="accent-[var(--color-primary, #00c8ff)] w-4 h-4 cursor-pointer" />
                                            <span className="text-[13px] font-semibold text-gray-700 group-hover:text-[var(--color-primary, #00c8ff)]">All</span>
                                        </div>
                                        <span className="text-[11px] text-gray-400">{products.total}</span>
                                    </label>
                                    {categories.map(cat => (
                                        <div key={cat.id}>
                                            <label className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer group">
                                                <div className="flex items-center gap-2.5">
                                                    <input type="radio" name="cat" value={cat.slug} checked={filters.category === cat.slug}
                                                        onChange={() => { apply({ category: cat.slug }); setSidebarOpen(false) }}
                                                        className="w-4 h-4 cursor-pointer" style={{accentColor:'var(--color-primary)'}} />
                                                    <span className="text-[13px] font-semibold text-gray-700 group-hover:text-[var(--color-primary)]">{cat.name}</span>
                                                </div>
                                            </label>
                                            {(cat as any).children?.map((sub: any) => (
                                                <label key={sub.id} className="flex items-center justify-between pl-8 pr-3 py-2 rounded-xl hover:bg-gray-50 cursor-pointer group">
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
                                        <label key={i} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer group">
                                            <input type="radio" name="price" className="accent-[var(--color-primary, #00c8ff)] w-4 h-4 cursor-pointer"
                                                checked={filters.max_price === r.max}
                                                onChange={() => { apply({ max_price: r.max }); setSidebarOpen(false) }} />
                                            <span className="text-[13px] font-semibold text-gray-700 group-hover:text-[var(--color-primary, #00c8ff)]">{r.label}</span>
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
                            className="lg:hidden flex items-center gap-2 text-[13px] font-semibold text-gray-600 hover:text-[var(--color-primary, #00c8ff)] border border-gray-200 rounded-xl px-3 py-2 bg-white cursor-pointer transition-colors flex-shrink-0">
                            <IconAdjustmentsHorizontal size={16} /> Filter
                        </button>
                        <span className="text-[12.5px] sm:text-[13px] text-gray-500 flex-shrink-0">
                            <strong className="text-gray-900">{products.total}</strong> products
                        </span>
                        <div className="flex gap-1.5 ml-auto flex-wrap">
                            {SORTS.map(s => (
                                <button key={s.value} onClick={() => { setSort(s.value); apply({ sort: s.value }) }}
                                    className={`px-2.5 sm:px-3 py-1.5 rounded-[10px] text-[11px] sm:text-[12px] font-semibold transition-all border-none cursor-pointer whitespace-nowrap
                                        ${sort === s.value ? 'bg-[var(--color-primary, #00c8ff)] text-[var(--color-dark-bg, #0a0e1a)]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                                    {s.label}
                                </button>
                            ))}
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

                    {/* Pagination */}
                    {products.last_page > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-6">
                            {products.current_page > 1 && (
                                <button onClick={() => apply({ page: products.current_page - 1 })}
                                    className="h-9 sm:h-10 px-4 sm:px-5 text-[12.5px] sm:text-[13px] font-semibold border border-gray-200 rounded-xl hover:border-[var(--color-primary, #00c8ff)] hover:text-[var(--color-primary, #00c8ff)] bg-white cursor-pointer transition-all">
                                    ← Prev
                                </button>
                            )}
                            <span className="text-[12.5px] sm:text-[13px] text-gray-500 px-3 sm:px-4">
                                {products.current_page} / {products.last_page}
                            </span>
                            {products.current_page < products.last_page && (
                                <button onClick={() => apply({ page: products.current_page + 1 })}
                                    className="h-9 sm:h-10 px-4 sm:px-5 text-[12.5px] sm:text-[13px] font-semibold border border-gray-200 rounded-xl hover:border-[var(--color-primary, #00c8ff)] hover:text-[var(--color-primary, #00c8ff)] bg-white cursor-pointer transition-all">
                                    Next →
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </StorefrontLayout>
    )
}
