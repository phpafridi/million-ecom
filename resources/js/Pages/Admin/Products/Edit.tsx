import { Head, useForm, Link, usePage, router } from '@inertiajs/react'
import { useState } from 'react'
import { IconArrowLeft, IconUpload, IconCheck } from '@tabler/icons-react'
import AdminLayout from '@/Layouts/AdminLayout'
import type { Product, Category } from '@/types'

interface Props { product?: Product; categories: Category[]; isCreate?: boolean }

const inputCls = 'w-full h-11 px-4 border-2 border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)] transition-colors bg-white'

// ── All helper components OUTSIDE the main function to prevent auto-unfocus ──

function Field({ label, hint, error, children }: {
    label: string; hint?: string; error?: string; children: React.ReactNode
}) {
    return (
        <div>
            <label className="block text-[13px] font-semibold text-gray-700 mb-1">{label}</label>
            {hint && <p className="text-[11.5px] text-gray-400 mb-1.5">{hint}</p>}
            {children}
            {error && <p className="text-[12px] text-red-500 mt-1">⚠ {error}</p>}
        </div>
    )
}

function VariantBuilder({ productId }: { productId?: number }) {
    const [attributes, setAttributes] = useState([{ name: '', values: [''] }])
    const [saving, setSaving] = useState(false)
    const { props: pp } = usePage<{ adminPath?: string }>()
    const ap = `/${pp.adminPath ?? 'tijar-admin'}`

    function addAttr() { setAttributes(a => [...a, { name: '', values: [''] }]) }
    function removeAttr(i: number) { setAttributes(a => a.filter((_, idx) => idx !== i)) }
    function setAttrName(i: number, name: string) { setAttributes(a => a.map((x, idx) => idx === i ? { ...x, name } : x)) }
    function addValue(i: number) { setAttributes(a => a.map((x, idx) => idx === i ? { ...x, values: [...x.values, ''] } : x)) }
    function setValue(i: number, j: number, val: string) {
        setAttributes(a => a.map((x, idx) => idx === i ? { ...x, values: x.values.map((v, jdx) => jdx === j ? val : v) } : x))
    }
    function removeValue(i: number, j: number) {
        setAttributes(a => a.map((x, idx) => idx === i ? { ...x, values: x.values.filter((_, jdx) => jdx !== j) } : x))
    }
    function save() {
        if (!productId) return
        setSaving(true)
        router.post(`${ap}/products/${productId}/variants`, { attributes }, { onFinish: () => setSaving(false) })
    }

    return (
        <div className="space-y-4">
            {attributes.map((attr, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                        <input value={attr.name} onChange={e => setAttrName(i, e.target.value)}
                            placeholder="Option name (e.g. Size, Color)"
                            className="flex-1 h-9 px-3 border border-gray-200 rounded-lg text-[13px] outline-none focus:border-[var(--color-primary)] bg-white"/>
                        {attributes.length > 1 && (
                            <button type="button" onClick={() => removeAttr(i)}
                                className="w-9 h-9 rounded-lg border border-gray-200 text-red-400 hover:bg-red-50 bg-white cursor-pointer flex items-center justify-center text-lg">×</button>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {attr.values.map((val, j) => (
                            <div key={j} className="flex items-center gap-1">
                                <input value={val} onChange={e => setValue(i, j, e.target.value)}
                                    placeholder={attr.name === 'Color' ? 'Red' : attr.name === 'Size' ? 'M' : 'Value'}
                                    className="h-8 w-24 px-2 border border-gray-200 rounded-lg text-[12.5px] outline-none focus:border-[var(--color-primary)] bg-white"/>
                                {attr.values.length > 1 && (
                                    <button type="button" onClick={() => removeValue(i, j)} className="text-gray-400 hover:text-red-500 border-none bg-transparent cursor-pointer text-lg">×</button>
                                )}
                            </div>
                        ))}
                        <button type="button" onClick={() => addValue(i)}
                            className="h-8 px-3 border border-dashed border-gray-300 rounded-lg text-[12px] text-gray-500 hover:border-[var(--color-primary)] cursor-pointer bg-white">
                            + Add Value
                        </button>
                    </div>
                </div>
            ))}
            <div className="flex gap-2">
                <button type="button" onClick={addAttr}
                    className="h-9 px-4 border-2 border-dashed border-gray-300 rounded-xl text-[12.5px] font-semibold text-gray-600 hover:border-[var(--color-primary)] cursor-pointer bg-white">
                    + Add Option (Size / Color etc.)
                </button>
                {productId && (
                    <button type="button" onClick={save} disabled={saving}
                        className="h-9 px-5 rounded-xl text-[12.5px] font-bold border-none cursor-pointer disabled:opacity-60"
                        style={{ background:'var(--color-primary)', color:'var(--color-primary-text)' }}>
                        {saving ? 'Saving…' : 'Save Variants'}
                    </button>
                )}
            </div>
            {!productId && <p className="text-[12px] text-amber-600 mt-1">💡 Save the product first, then add variants.</p>}
        </div>
    )
}

// ── MAIN COMPONENT ──
export default function ProductEdit({ product, categories, isCreate = false }: Props) {
    const { props: pageProps } = usePage<{ adminPath?: string }>()
    const ap = `/${pageProps.adminPath ?? 'tijar-admin'}`

    const { data, setData, post, processing, errors } = useForm({
        _method:       isCreate ? 'POST' : 'PUT',
        name:          product?.name          ?? '',
        slug:          product?.slug          ?? '',
        description:   product?.description   ?? '',
        price:         product?.price         ?? '',
        compare_price: (product?.compare_price ?? '') as string | number,
        stock:         product?.stock         ?? 0,
        category_id:   product?.category_id   ?? '',
        is_featured:   product?.is_featured   ?? false,
        is_active:     product?.is_active      ?? true,
        sort_order:    product?.sort_order     ?? 0,
        images:        [] as File[],
    })

    const [imagePreviews, setImagePreviews] = useState<string[]>([])

    function slugify(name: string) {
        return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    }

    function pickImages(files: FileList | null) {
        if (!files) return
        const arr = Array.from(files)
        setData('images', arr)
        setImagePreviews(arr.map(f => URL.createObjectURL(f)))
    }

    function submit(e: React.FormEvent) {
        e.preventDefault()
        post(isCreate ? `${ap}/products` : `${ap}/products/${product!.id}`, { forceFormData: true })
    }

    return (
        <AdminLayout title={isCreate ? 'Add Product' : 'Edit Product'}>
            <Head title={isCreate ? 'Add Product' : `Edit: ${product?.name}`} />

            <div className="flex items-center gap-3 mb-6">
                <Link href={`${ap}/products`} className="flex items-center gap-2 text-[13px] font-semibold text-gray-500 hover:text-[var(--color-primary)] no-underline transition-colors">
                    <IconArrowLeft size={16}/> Back to Products
                </Link>
                <span className="text-gray-300">/</span>
                <span className="text-[13px] font-semibold text-gray-800">{isCreate ? 'New Product' : product?.name}</span>
            </div>

            <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-5 max-w-5xl">

                {/* LEFT */}
                <div className="lg:col-span-2 space-y-5">

                    {/* Basic info */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                        <h3 className="font-manrope font-bold text-[15px] pb-3 border-b border-gray-100">Product Information</h3>
                        <Field label="Product Name *" error={errors.name}>
                            <input value={data.name} required className={inputCls}
                                placeholder="e.g. Classic Oxford Shirt"
                                onChange={e => { setData('name', e.target.value); if (isCreate) setData('slug', slugify(e.target.value)) }} />
                        </Field>
                        <Field label="URL Slug" hint="Auto-generated — change only if needed" error={errors.slug}>
                            <input value={data.slug} className={`${inputCls} font-mono text-[12.5px]`}
                                placeholder="classic-oxford-shirt"
                                onChange={e => setData('slug', e.target.value)} />
                        </Field>
                        <Field label="Description" hint="One spec per line: Brand: X, Color: Y, Size: S/M/L">
                            <textarea value={data.description} rows={6} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)] resize-none transition-colors"
                                placeholder={"Brand: Your Brand\nMaterial: 100% Cotton\nColor: Navy Blue\nSizes: S, M, L, XL\nWarranty: 1 Year"}
                                onChange={e => setData('description', e.target.value)} />
                        </Field>
                    </div>

                    {/* Pricing */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                        <h3 className="font-manrope font-bold text-[15px] pb-3 border-b border-gray-100">Pricing & Inventory</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Selling Price (Rs) *" hint="Price customers pay" error={errors.price}>
                                <input type="number" min="0" required value={data.price as string} className={inputCls}
                                    placeholder="2499" onChange={e => setData('price', e.target.value)} />
                            </Field>
                            <Field label="Original Price (Rs)" hint="Shows strikethrough — leave blank if no sale">
                                <input type="number" min="0" value={data.compare_price as string} className={inputCls}
                                    placeholder="3499" onChange={e => setData('compare_price', e.target.value)} />
                                {Number(data.compare_price) > Number(data.price) && Number(data.price) > 0 && (
                                    <p className="text-[11.5px] text-green-600 mt-1 font-semibold">
                                        ✓ {Math.round((1 - Number(data.price)/Number(data.compare_price)) * 100)}% discount badge will show
                                    </p>
                                )}
                            </Field>
                        </div>
                        <Field label="Stock Quantity *" hint="Units available" error={errors.stock}>
                            <input type="number" min="0" required value={data.stock} className={`${inputCls} max-w-[180px]`}
                                placeholder="50" onChange={e => setData('stock', +e.target.value)} />
                            {Number(data.stock) === 0 && <p className="text-[11.5px] text-red-500 mt-1">⚠ Shows as Out of Stock</p>}
                            {Number(data.stock) > 0 && Number(data.stock) <= 5 && <p className="text-[11.5px] text-amber-600 mt-1">⚠ Low stock</p>}
                        </Field>
                    </div>

                    {/* Images */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <h3 className="font-manrope font-bold text-[15px] pb-3 border-b border-gray-100 mb-4">Product Images</h3>
                        {product?.images && product.images.length > 0 && (
                            <div className="mb-4">
                                <p className="text-[12.5px] text-gray-500 mb-2.5">Current images:</p>
                                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
                                    {product.images.map((img, i) => (
                                        <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                                            <img src={img.thumb} alt="" className="w-full h-full object-cover"/>
                                            {i === 0 && <span className="absolute top-1 left-1 text-[9px] font-black text-white px-1.5 py-0.5 rounded-full" style={{ background:'var(--color-primary)' }}>Main</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {imagePreviews.length > 0 && (
                            <div className="mb-4">
                                <p className="text-[12.5px] text-green-600 font-semibold mb-2.5">✓ {imagePreviews.length} new image(s) ready to upload</p>
                                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
                                    {imagePreviews.map((src, i) => (
                                        <div key={i} className="aspect-square rounded-xl overflow-hidden border-2 border-green-300 bg-gray-50">
                                            <img src={src} alt="" className="w-full h-full object-cover"/>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 hover:border-[var(--color-primary)] rounded-xl p-8 cursor-pointer transition-colors group">
                            <input type="file" multiple accept="image/*" className="hidden" onChange={e => pickImages(e.target.files)}/>
                            <div className="w-14 h-14 rounded-2xl bg-gray-50 group-hover:bg-[var(--color-primary)]/10 flex items-center justify-center mb-3 transition-colors">
                                <IconUpload size={24} className="text-gray-400 group-hover:text-[var(--color-primary)] transition-colors"/>
                            </div>
                            <div className="text-[14px] font-semibold text-gray-700 mb-1">Click to upload product images</div>
                            <div className="text-[12.5px] text-gray-400">PNG, JPG, WebP — up to 5MB each — multiple allowed</div>
                        </label>
                    </div>

                    {/* Variants */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <h3 className="font-manrope font-bold text-[15px] mb-1">Product Variants</h3>
                        <p className="text-[12px] text-gray-400 mb-4">Add Size, Color or other options. Leave empty for simple products.</p>
                        <VariantBuilder productId={product?.id}/>
                    </div>
                </div>

                {/* RIGHT */}
                <div className="space-y-5">
                    {/* Category */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-5">
                        <h3 className="font-manrope font-bold text-[15px] mb-3">Category *</h3>
                        <select value={data.category_id} required className={`${inputCls} ${!data.category_id ? 'border-amber-300' : ''}`}
                            onChange={e => setData('category_id', +e.target.value)}>
                            <option value="">Select a category…</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        {!data.category_id && <p className="text-[11.5px] text-amber-600 mt-1.5">Required</p>}
                    </div>

                    {/* Visibility toggles — inline, no Toggle component needed */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-5">
                        <h3 className="font-manrope font-bold text-[15px] mb-3">Visibility</h3>
                        {[
                            { field: 'is_active'  as const, label: 'Published',  hint: 'Visible to customers' },
                            { field: 'is_featured' as const, label: 'Featured',   hint: 'Show on homepage' },
                        ].map(t => (
                            <div key={t.field} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                                <div>
                                    <div className="text-[13.5px] font-semibold text-gray-800">{t.label}</div>
                                    <div className="text-[12px] text-gray-400">{t.hint}</div>
                                </div>
                                <button type="button" onClick={() => setData(t.field, !data[t.field])}
                                    className={`relative w-12 h-6 rounded-full border-none cursor-pointer transition-all flex-shrink-0 ${data[t.field] ? 'bg-[var(--color-primary)]' : 'bg-gray-200'}`}>
                                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${data[t.field] ? 'left-[26px]' : 'left-0.5'}`}/>
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Save */}
                    <button type="submit" disabled={processing}
                        className="w-full py-3.5 font-black text-[15px] rounded-xl border-none cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2.5 transition-all hover:opacity-90"
                        style={{ background:'var(--color-primary)', color:'var(--color-primary-text)' }}>
                        <IconCheck size={20}/>
                        {processing ? 'Saving…' : isCreate ? 'Create Product' : 'Save Changes'}
                    </button>

                    {!isCreate && (
                        <Link href={`${ap}/products`} className="block text-center text-[13px] font-semibold text-gray-400 hover:text-gray-600 no-underline">
                            Cancel
                        </Link>
                    )}

                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-[12px] text-blue-700 space-y-1">
                        <div><strong>💡 Tips:</strong></div>
                        <div>• Set Original Price higher than Selling Price to show a discount badge</div>
                        <div>• First uploaded image becomes the main product photo</div>
                        <div>• Description: one spec per line (Brand: X, Color: Y)</div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    )
}
