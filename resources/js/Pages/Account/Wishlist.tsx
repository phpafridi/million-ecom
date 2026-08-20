import { Head, Link, useForm } from '@inertiajs/react'
import StorefrontLayout from '@/Layouts/StorefrontLayout'
import AccountSidebar from './Partials/AccountSidebar'
import { IconHeart, IconShoppingCart, IconTrash } from '@tabler/icons-react'

interface WishlistItem {
    id: number
    product: {
        id: number; name: string; slug: string; price: number
        compare_price?: number; discount_pct: number; first_image: string
        stock: number; category?: string
    }
}
interface Props { items: WishlistItem[]; settings: Record<string, string>; auth: any }

export default function AccountWishlist({ items, settings, auth }: Props) {
    const fmt = (n: number) => `Rs ${Number(n).toLocaleString('en-PK')}`
    const addForm = useForm({ product_id: 0, quantity: 1 })
    const removeForm = useForm({})

    return (
        <StorefrontLayout auth={auth} settings={settings}>
            <Head title="My Wishlist" />
            <div className="min-h-screen py-8 px-4" style={{ background: 'var(--color-body-bg)' }}>
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
                        <AccountSidebar auth={auth} active="wishlist" />

                        <div className="lg:col-span-3">
                            <div className="bg-white rounded-2xl border border-gray-100 p-5">
                                <div className="flex items-center justify-between mb-5">
                                    <h2 className="font-black text-[18px]" style={{ color: 'var(--color-dark-bg)' }}>
                                        My Wishlist <span className="text-gray-400 font-normal text-[14px] ml-1">({items.length})</span>
                                    </h2>
                                    {items.length > 0 && (
                                        <Link href="/shop" className="text-[12.5px] font-bold no-underline" style={{ color: 'var(--color-primary)' }}>
                                            Continue Shopping →
                                        </Link>
                                    )}
                                </div>

                                {items.length === 0 ? (
                                    <div className="text-center py-16">
                                        <IconHeart size={44} className="text-gray-200 mx-auto mb-4" />
                                        <p className="text-gray-400 text-[14px] mb-4">Your wishlist is empty.</p>
                                        <Link href="/shop" className="inline-flex items-center gap-2 font-bold text-[13px] h-10 px-5 rounded-xl no-underline"
                                            style={{ background: 'var(--color-primary)', color: 'var(--color-primary-text)' }}>
                                            Browse Products →
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {items.map(({ id, product }) => (
                                            <div key={id} className="border border-gray-100 rounded-2xl overflow-hidden hover:shadow-sm transition-all group">
                                                <Link href={`/products/${product.slug}`} className="block relative">
                                                    <img src={product.first_image} alt={product.name}
                                                        className="w-full h-44 object-cover bg-gray-50" />
                                                    {product.discount_pct > 0 && (
                                                        <span className="absolute top-3 left-3 text-white text-[11px] font-black px-2 py-1 rounded-lg"
                                                            style={{ background: 'var(--color-accent)' }}>
                                                            -{product.discount_pct}%
                                                        </span>
                                                    )}
                                                </Link>
                                                <div className="p-4">
                                                    {product.category && (
                                                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1">{product.category}</p>
                                                    )}
                                                    <Link href={`/products/${product.slug}`}
                                                        className="font-bold text-[13.5px] no-underline line-clamp-2 leading-snug mb-3 block"
                                                        style={{ color: 'var(--color-dark-bg)' }}>
                                                        {product.name}
                                                    </Link>
                                                    <div className="flex items-center gap-2 mb-4">
                                                        <span className="font-black text-[16px]" style={{ color: 'var(--color-primary)' }}>
                                                            {fmt(product.price)}
                                                        </span>
                                                        {product.compare_price && product.compare_price > product.price && (
                                                            <span className="text-gray-400 text-[12px] line-through">{fmt(product.compare_price)}</span>
                                                        )}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => {
                                                                addForm.setData('product_id', product.id)
                                                                addForm.post('/cart/add')
                                                            }}
                                                            disabled={product.stock === 0}
                                                            className="flex-1 h-9 rounded-xl font-bold text-[12.5px] disabled:opacity-50 flex items-center justify-center gap-1.5"
                                                            style={{ background: 'var(--color-primary)', color: 'var(--color-primary-text)' }}>
                                                            <IconShoppingCart size={14} />
                                                            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                                        </button>
                                                        <button
                                                            onClick={() => removeForm.post(`/wishlist/toggle`, { data: { product_id: product.id } })}
                                                            className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors">
                                                            <IconTrash size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </StorefrontLayout>
    )
}
