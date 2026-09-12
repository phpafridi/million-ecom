import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { router } from '@inertiajs/react'
import { IconX, IconMinus, IconPlus } from '@tabler/icons-react'
import type { Product } from '@/types'

interface Props {
    product: Product
    onClose: () => void
}

// Replicates the same variant-matching logic as the full product page
// (Shop/Show.tsx) — track selected values per attribute, find the
// variant whose value-set matches every selection, submit that
// variant's id.
export default function QuickViewModal({ product, onClose }: Props) {
    const [selectedValues, setSelectedValues] = useState<Record<number, number>>({})
    const [qty, setQty] = useState(1)
    const [adding, setAdding] = useState(false)
    const [shakeAttr, setShakeAttr] = useState<number | null>(null)
    // JS-based check instead of relying on Tailwind's sm: breakpoint —
    // guarantees this actually applies rather than guessing at whether
    // a utility class compiled/applied correctly.
    const [isDesktop, setIsDesktop] = useState(false)
    useEffect(() => {
        const check = () => setIsDesktop(window.innerWidth >= 640)
        check()
        window.addEventListener('resize', check)
        return () => window.removeEventListener('resize', check)
    }, [])

    const attrs = product.variant_attributes ?? []
    const img = product.images?.[0]?.url ?? '/images/placeholder.jpg'

    function selectValue(attrId: number, valueId: number) {
        setSelectedValues(prev => ({ ...prev, [attrId]: valueId }))
        setShakeAttr(null)
    }

    function findMatchingVariant() {
        const allAttrIds = attrs.map(a => a.id)
        if (!allAttrIds.every(id => selectedValues[id] !== undefined)) return null
        return (product.variants ?? []).find((v: any) =>
            v.is_active !== false &&
            allAttrIds.every(id => v.variant_values?.some((vv: any) => vv.variant_attribute_id === id && vv.id === selectedValues[id]))
        ) ?? null
    }

    function handleAddToCart() {
        const missing = attrs.find(a => selectedValues[a.id] === undefined)
        if (missing) {
            setShakeAttr(missing.id)
            return
        }
        const variant = findMatchingVariant()
        setAdding(true)
        router.post('/cart/add', {
            product_id: product.id,
            quantity: qty,
            variant_id: variant?.id ?? null,
        }, {
            preserveScroll: true,
            onFinish: () => { setAdding(false); onClose() },
        })
    }

    const allRequiredSelected = attrs.every(a => selectedValues[a.id] !== undefined)
    const price = product.price
    const compare = product.compare_price
    const disc = compare && compare > price ? Math.round(((compare - price) / compare) * 100) : 0

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center sm:p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/50" />

            {/* Fixed, compact height on mobile (not "however tall the
                content is") — image + info scroll internally, while
                quantity + Add to Cart stay pinned at the bottom, always
                visible without needing to scroll to find them. */}
            <div className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl overflow-hidden flex flex-col"
                style={{ height: 'min(600px, 88vh)' }}
                onClick={e => e.stopPropagation()}>

                <button onClick={onClose} aria-label="Close"
                    className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center border-none cursor-pointer">
                    <IconX size={18} />
                </button>

                {/* Scrollable area: image, name, price, attributes */}
                <div className="flex-1 min-h-0 overflow-y-auto flex" style={{ flexDirection: isDesktop ? 'row' : 'column' }}>
                    <div style={{ width: isDesktop ? '50%' : '100%', flexShrink: 0, height: isDesktop ? '100%' : 160, overflow: 'hidden' }}>
                        <img src={img} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>

                    <div style={{ width: isDesktop ? '50%' : '100%', padding: isDesktop ? 24 : 16 }}>
                        <h2 className="font-bold text-[16px] sm:text-[17px] mb-2 pr-8">{product.name}</h2>
                        <div className="flex items-center flex-wrap gap-2 mb-1">
                            {compare && compare > price && (
                                <span className="text-gray-400 line-through text-[13px] sm:text-[14px]">Rs. {compare.toLocaleString()}</span>
                            )}
                            <span className="font-bold text-[17px] sm:text-[18px]">Rs. {price.toLocaleString()}</span>
                            {disc > 0 && <span className="text-[10px] sm:text-[11px] font-bold text-red-600">FREE DELIVERY</span>}
                        </div>

                        {attrs.map(attr => (
                            <div key={attr.id} id={`qv-attr-${attr.id}`} className="mt-4" style={{ padding: shakeAttr === attr.id ? 8 : 0, borderRadius: 8, border: shakeAttr === attr.id ? '1px solid #DC2626' : 'none' }}>
                                <p className="text-[11px] font-bold uppercase tracking-wide mb-2" style={{ color: shakeAttr === attr.id ? '#DC2626' : '#6B7280' }}>
                                    {attr.name}
                                    {shakeAttr === attr.id && <span className="ml-2 normal-case font-semibold">— please select a {attr.name.toLowerCase()}</span>}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {attr.values.map(val => {
                                        const isSelected = selectedValues[attr.id] === val.id
                                        return (
                                            <button key={val.id} onClick={() => selectValue(attr.id, val.id)}
                                                className="px-3.5 py-2 rounded-lg text-[13px] font-semibold border cursor-pointer transition-colors"
                                                style={{
                                                    background: isSelected ? '#0a0a0a' : '#fff',
                                                    color: isSelected ? '#fff' : '#111',
                                                    borderColor: isSelected ? '#0a0a0a' : '#d1d5db',
                                                }}>
                                                {val.value}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pinned footer — quantity + Add to Cart, always visible
                    regardless of how much scrolls above it. */}
                <div className="flex-shrink-0 border-t border-gray-100 p-4 flex items-center gap-3 bg-white">
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <button onClick={() => setQty(q => Math.max(1, q - 1))}
                            className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center bg-white cursor-pointer">
                            <IconMinus size={14} />
                        </button>
                        <span className="w-8 text-center font-semibold">{qty}</span>
                        <button onClick={() => setQty(q => q + 1)}
                            className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center bg-white cursor-pointer">
                            <IconPlus size={14} />
                        </button>
                    </div>

                    <button onClick={handleAddToCart} disabled={adding}
                        className="flex-1 py-3 rounded-xl font-bold text-[13px] sm:text-[14px] text-white border-none cursor-pointer"
                        style={{
                            background: allRequiredSelected ? '#0a0a0a' : '#9CA3AF',
                            opacity: adding ? 0.6 : 1,
                        }}>
                        {adding ? 'Adding...' : allRequiredSelected ? 'Add to Cart' : `Select ${attrs.find(a => selectedValues[a.id] === undefined)?.name ?? 'Options'}`}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    )
}
