import { Head, Link, router } from '@inertiajs/react'
import { IconHeart, IconShoppingCart, IconTrash, IconArrowLeft } from '@tabler/icons-react'
import StorefrontLayout from '@/Layouts/StorefrontLayout'
import type { Product, PageProps } from '@/types'

interface Props extends PageProps {
    items: Product[]
    settings: Record<string, string>
}

export default function Wishlist({ items, settings, auth }: Props) {
    const fmt = (n: number) => `Rs ${n.toLocaleString('en-PK')}`

    function removeFromWishlist(productId: number) {
        router.post('/wishlist/toggle', { product_id: productId }, { preserveScroll: true })
    }

    function addToCart(productId: number) {
        router.post('/cart/add', { product_id: productId, quantity: 1 }, { preserveScroll: true })
    }

    return (
        <StorefrontLayout auth={auth} settings={settings}>
            <Head title="My Wishlist"/>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
                <div className="flex items-center gap-3 mb-6">
                    <IconHeart size={24} style={{ color:'var(--color-accent)' }} fill="currentColor"/>
                    <h1 className="font-manrope font-black text-[24px]" style={{ color:'var(--color-dark-bg)' }}>My Wishlist</h1>
                    <span className="text-[13px] text-gray-500 ml-2">({items.length} items)</span>
                </div>

                {items.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
                        <IconHeart size={48} className="text-gray-200 mx-auto mb-4"/>
                        <h2 className="font-manrope font-bold text-[20px] text-gray-700 mb-2">Your wishlist is empty</h2>
                        <p className="text-gray-400 text-[14px] mb-6">Browse products and click the heart icon to save them here.</p>
                        <Link href="/shop" className="inline-flex items-center gap-2 font-black text-[14px] h-12 px-8 rounded-xl no-underline"
                            style={{ background:'var(--color-primary)', color:'var(--color-primary-text)' }}>
                            Browse Products →
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {items.map(product => (
                            <div key={product.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                                <Link href={`/products/${product.slug}`} className="block no-underline">
                                    <div className="aspect-square bg-gray-50 flex items-center justify-center p-6">
                                        <img src={product.images?.[0]?.url ?? '/images/placeholder.jpg'} alt={product.name}
                                            className="max-w-full max-h-full object-contain"/>
                                    </div>
                                </Link>
                                <div className="p-4">
                                    <div className="text-[10.5px] font-bold uppercase tracking-wider mb-1" style={{ color:'var(--color-primary)' }}>
                                        {product.category?.name}
                                    </div>
                                    <Link href={`/products/${product.slug}`} className="font-semibold text-[14px] text-gray-900 no-underline hover:text-[var(--color-primary)] line-clamp-2 block mb-2">
                                        {product.name}
                                    </Link>
                                    <div className="flex items-baseline gap-2 mb-3">
                                        <span className="font-manrope font-black text-[16px]" style={{ color:'var(--color-dark-bg)' }}>{fmt(product.price)}</span>
                                        {product.compare_price > product.price && (
                                            <span className="text-[12px] text-gray-400 line-through">{fmt(product.compare_price)}</span>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => addToCart(product.id)}
                                            className="flex-1 flex items-center justify-center gap-2 h-10 font-bold text-[12.5px] rounded-xl border-none cursor-pointer"
                                            style={{ background:'var(--color-primary)', color:'var(--color-primary-text)' }}>
                                            <IconShoppingCart size={15}/> Add to Cart
                                        </button>
                                        <button onClick={() => removeFromWishlist(product.id)}
                                            className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-red-400 hover:bg-red-50 hover:border-red-300 cursor-pointer bg-white transition-all">
                                            <IconTrash size={15}/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <Link href="/" className="flex items-center gap-2 text-[13px] font-semibold text-gray-500 hover:text-[var(--color-primary)] no-underline mt-6 transition-colors">
                    <IconArrowLeft size={15}/> Continue Shopping
                </Link>
            </div>
        </StorefrontLayout>
    )
}
