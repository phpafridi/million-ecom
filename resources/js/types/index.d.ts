export interface MediaItem {
    id: number
    url: string
    thumb: string
}

export interface VariantValue {
    id: number
    value: string
    color_hex: string | null
}

export interface VariantAttribute {
    id: number
    name: string
    values: VariantValue[]
}

export interface ProductVariant {
    id: number
    sku: string | null
    price: number | null
    compare_price: number | null
    stock: number
    image: string | null
    is_active: boolean
    label: string
    variant_values: { id: number; value: string; variant_attribute_id: number }[]
}

export interface Review {
    id: number
    name: string
    rating: number
    title: string | null
    body: string | null
    created_at: string
}

export interface Product {
    id: number
    name: string
    slug: string
    description: string
    price: number
    compare_price: number
    discount_pct: number
    category_id: number
    category?: Category
    stock: number
    stock_sold?: number
    is_featured: boolean
    is_active: boolean
    sort_order: number
    images: MediaItem[]
    avg_rating?: number
    review_count?: number
    variant_attributes?: VariantAttribute[]
    variants?: ProductVariant[]
    approved_reviews?: Review[]
}

export interface Category {
    id: number
    name: string
    slug: string
    description?: string
    image?: string
    banner_image?: string
    icon?: string
    color?: string
    parent_id?: number | null
    sort_order: number
    nav_order?: number
    is_active: boolean
    show_in_nav?: boolean
    products_count?: number
    children?: Category[]
}

export interface HeroSlide {
    id: number
    title: string
    subtitle: string
    description: string
    cta_text: string
    cta_url: string
    discount_pct: number
    price: string
    compare_price: string
    image: string | null
    image_path: string | null
    sort_order: number
    is_active: boolean
}

export interface Banner {
    id: number
    title: string
    subtitle: string | null
    cta_text: string | null
    link: string | null
    position: string
    image: string | null
    is_active: boolean
}

export interface PageProps {
    auth: {
        user: {
            id: number
            name: string
            email: string
            role: string
        } | null
    }
    flash: {
        success?: string
        error?: string
    }
    settings?: Record<string, string>
    cartCount?: number
    wishlistCount?: number
    wishlistIds?: number[]
    adminPath?: string
    navCategories?: { label: string; href: string; children?: { label: string; href: string }[] }[]
}
