import { Head, Link } from '@inertiajs/react'
import StorefrontLayout from '@/Layouts/StorefrontLayout'
import HeroSlider from '@/Components/Storefront/HeroSlider'
import ProductScroller from '@/Components/Storefront/ProductScroller'
import type { PageProps } from '@/types'

interface CategoryLite {
    id: number; name: string; slug: string
    image?: string; mobile_image?: string
    children?: CategoryLite[]
}
interface HeroSlideT { id: number; title: string; subtitle?: string; image?: string; cta_text?: string; cta_url?: string }
interface ProductT { id: number; name: string; slug: string; price: number; compare_price?: number; first_image?: string; category?: { name: string } }

interface Props extends PageProps {
    heroSlides: HeroSlideT[]
    topCategories: CategoryLite[]
    newProducts: ProductT[]
    onSaleProducts: ProductT[]
    settings: Record<string, string>
}

// Every section below is now admin-controlled — visibility and title for
// each come from Settings (Admin → Branding → Homepage Sections), read
// with sensible defaults so nothing breaks if a setting is unset.
export default function Home({ heroSlides, topCategories, newProducts, onSaleProducts, settings, auth }: Props) {
    const whatsapp = settings?.whatsapp_number ?? ''

    const showCategories  = settings?.home_show_categories !== '0'
    const categoriesTitle = settings?.home_categories_title || 'Shop by Category'
    const showAccessories = settings?.home_show_accessories !== '0'
    const accessoriesTitle = settings?.home_accessories_title || 'Accessories'
    const showNewIn  = settings?.home_show_new_in !== '0'
    const newInTitle = settings?.home_new_in_title || 'New In'
    const showSale  = settings?.home_show_sale !== '0'
    const saleTitle = settings?.home_sale_title || 'Sale'

    // Which category feeds the Accessories carousel — admin can set an
    // exact slug (home_accessories_category); if left blank, falls back
    // to searching for any subcategory with "accessories" in its name,
    // same as before.
    function findAllAccessoryItems(): CategoryLite[] {
        const configuredSlug = settings?.home_accessories_category?.trim()
        if (configuredSlug) {
            for (const top of topCategories) {
                const match = top.children?.find(c => c.slug === configuredSlug)
                if (match?.children) return match.children
            }
        }
        // Combines items from EVERY "accessories" category found (Men's,
        // Women's, Kids' — whichever exist), instead of stopping at the
        // first match. Was only ever showing Men's specifically before.
        const combined: CategoryLite[] = []
        for (const top of topCategories) {
            const match = top.children?.find(c => c.name.toLowerCase().includes('accessories'))
            if (match?.children) combined.push(...match.children)
        }
        return combined
    }
    const accessoryItems = showAccessories ? findAllAccessoryItems() : []

    return (
        <StorefrontLayout auth={auth} settings={settings}>
            <Head title="Home" />

            <HeroSlider slides={heroSlides} settings={settings} />

            {/* Shop by Category */}
            {showCategories && topCategories.length > 0 && (
                <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-10">
                    <h2 className="text-center font-manrope font-black text-[22px] sm:text-[28px] tracking-tight text-gray-900 mb-6 sm:mb-8">
                        {categoriesTitle}
                    </h2>
                    <div className={`grid gap-2 sm:gap-3 max-w-4xl mx-auto ${topCategories.length === 1 ? 'grid-cols-1 max-w-md' : topCategories.length === 2 ? 'grid-cols-2 max-w-2xl' : 'grid-cols-2 lg:grid-cols-3'}`}>
                        {topCategories.slice(0, 8).map(cat => (
                            <Link key={cat.id} href={`/shop?category=${cat.slug}`} className="block no-underline group">
                                <div className="relative overflow-hidden" style={{ aspectRatio: '3/4' }}>
                                    <img src={cat.image ?? cat.mobile_image ?? '/images/placeholder.jpg'} alt={cat.name}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                                </div>
                                <div className="text-center pt-3">
                                    <span className="font-bold text-[13px] sm:text-[14px] uppercase tracking-wide text-gray-900">{cat.name}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Accessories carousel */}
            {showAccessories && accessoryItems && accessoryItems.length > 0 && (
                <div className="flex flex-col lg:flex-row lg:items-center px-4 sm:px-6 lg:px-10 py-8 border-t border-gray-100 bg-gray-50">
                    <div className="lg:w-[180px] lg:flex-shrink-0 mb-4 lg:mb-0 lg:pr-6">
                        <h2 className="font-manrope font-black text-[20px] lg:text-[24px] uppercase">{accessoriesTitle}</h2>
                    </div>
                    <div className="flex-1 min-w-0 flex gap-6 sm:gap-8 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                        {accessoryItems.map(item => (
                            <Link key={item.id} href={`/shop?category=${item.slug}`}
                                className="flex flex-col items-center gap-2.5 no-underline flex-shrink-0 group">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shadow-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg">
                                    <img src={item.image ?? item.mobile_image ?? '/images/placeholder.jpg'} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <span className="text-[10.5px] sm:text-[11.5px] font-bold uppercase tracking-wide text-gray-700 whitespace-nowrap">{item.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {showNewIn && newProducts.length > 0 && (
                <div className="flex flex-col lg:flex-row lg:items-stretch px-4 sm:px-6 lg:px-10 py-4">
                    <div className="lg:w-[180px] lg:flex-shrink-0 mb-4 lg:mb-0 lg:pr-6 lg:flex lg:flex-col lg:justify-center">
                        <p className="text-[11px] font-extrabold uppercase tracking-wider mb-1" style={{ color: 'var(--color-primary)' }}>Just Landed</p>
                        <h2 className="font-manrope font-black text-[22px] lg:text-[28px] underline decoration-2 underline-offset-4">{newInTitle}</h2>
                    </div>
                    <div className="flex-1 min-w-0">
                        <ProductScroller eyebrow="Just Landed" title={newInTitle} viewAllHref="/shop?sort=newest" products={newProducts} whatsapp={whatsapp} hideTitle noPad />
                    </div>
                </div>
            )}

            {showSale && onSaleProducts.length > 0 && (
                <div className="flex flex-col lg:flex-row lg:items-stretch px-4 sm:px-6 lg:px-10 py-4">
                    <div className="lg:w-[180px] lg:flex-shrink-0 mb-4 lg:mb-0 lg:pr-6 lg:flex lg:flex-col lg:justify-center">
                        <p className="text-[11px] font-extrabold uppercase tracking-wider mb-1" style={{ color: 'var(--color-primary)' }}>Limited Time</p>
                        <h2 className="font-manrope font-black text-[22px] lg:text-[28px] underline decoration-2 underline-offset-4">{saleTitle}</h2>
                    </div>
                    <div className="flex-1 min-w-0">
                        <ProductScroller eyebrow="Limited Time" title={saleTitle} viewAllHref="/shop?sort=discount" products={onSaleProducts} whatsapp={whatsapp} hideTitle noPad />
                    </div>
                </div>
            )}
        </StorefrontLayout>
    )
}
