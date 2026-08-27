import { Head, router, useForm, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { IconPlus, IconPencil, IconTrash, IconX, IconUpload, IconChevronRight, IconChevronDown, IconGripVertical } from '@tabler/icons-react'
import AdminLayout from '@/Layouts/AdminLayout'

interface Category {
    id: number; name: string; slug: string; description?: string
    parent_id?: number | null; sort_order: number; nav_order: number
    is_active: boolean; show_in_nav: boolean
    image?: string | null; banner_image?: string | null
    icon?: string; color?: string
    products_count?: number
    children?: Category[]
}
interface Props {
    categories: Category[]
    allCategories: { id: number; name: string; slug: string; parent_id: number | null }[]
}

function ImageUpload({ label, w, h, hint, current, onFile }: {
    label: string; w: number; h: number; hint: string
    current?: string | null; onFile: (f: File) => void
}) {
    const [preview, setPreview] = useState<string | null>(current ?? null)
    const [drag, setDrag] = useState(false)

    function pick(file: File) {
        setPreview(URL.createObjectURL(file))
        onFile(file)
    }

    return (
        <div>
            <label className="block text-[13px] font-semibold text-gray-700 mb-1">{label}</label>
            <p className="text-[11.5px] text-gray-400 mb-2">{w}×{h}px — {hint}</p>
            {preview && (
                <div className="relative mb-2">
                    <img src={preview} className="h-16 rounded-xl object-cover border border-gray-200 w-full" alt="" />
                    <button type="button" onClick={() => setPreview(null)}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center border-none cursor-pointer text-[10px]">✕</button>
                </div>
            )}
            <label className={`flex items-center gap-2.5 border-2 border-dashed rounded-xl px-4 py-3 cursor-pointer transition-colors
                ${drag ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5' : 'border-gray-200 hover:border-[var(--color-primary)]'}`}
                onDragOver={e => { e.preventDefault(); setDrag(true) }}
                onDragLeave={() => setDrag(false)}
                onDrop={e => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if(f) pick(f) }}>
                <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if(f) pick(f) }} />
                <IconUpload size={15} style={{ color:'var(--color-primary)' }} />
                <span className="text-[12px] text-gray-500">{preview ? 'Replace image' : 'Click or drag image here'}</span>
            </label>
        </div>
    )
}

function CatForm({ cat, allCategories, onClose }: {
    cat?: Category; allCategories: Props['allCategories']; onClose: () => void
}) {
    const { props: pageProps } = usePage<{ adminPath?: string }>()
    const ap = `/${pageProps.adminPath ?? 'ml-admin'}`

    const { data, setData, post, processing, errors } = useForm<any>({
        _method:      cat ? 'PUT' : 'POST',
        name:         cat?.name        ?? '',
        slug:         cat?.slug        ?? '',
        description:  cat?.description ?? '',
        parent_id:    cat?.parent_id   ?? '',
        // Position = sort_order internally, but shown as simple "Position" to admin
        sort_order:   cat?.sort_order  ?? 0,
        nav_order:    cat?.nav_order   ?? 0,
        is_active:    cat?.is_active   ?? true,
        show_in_nav:  cat?.show_in_nav ?? true,
        color:        cat?.color       ?? '',
        icon:         cat?.icon        ?? '',
        image:        null as File | null,
        banner_image: null as File | null,
    })

    function slugify(s: string) {
        return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    }

    function submit(e: React.FormEvent) {
        e.preventDefault()
        const url = cat ? `${ap}/categories/${cat.id}` : `${ap}/categories`
        post(url, { onSuccess: onClose, forceFormData: true })
    }

    const topLevel  = allCategories.filter(c => !c.parent_id && c.id !== cat?.id)
    const inputCls  = "w-full h-11 px-4 border-2 border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)] transition-colors bg-white"

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl my-8">

                {/* Sticky header */}
                <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-6 py-4 border-b border-gray-100 rounded-t-2xl">
                    <div>
                        <h3 className="font-manrope font-bold text-[17px]">{cat ? `Edit: ${cat.name}` : 'Add New Category'}</h3>
                        <p className="text-[12px] text-gray-400 mt-0.5">Fill in the details below</p>
                    </div>
                    <button onClick={onClose} className="border-none bg-transparent cursor-pointer text-gray-400 hover:text-gray-700">
                        <IconX size={22} />
                    </button>
                </div>

                <form onSubmit={submit} className="p-6 space-y-5">

                    {/* Name + Slug - FIRST and most visible */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[13px] font-semibold text-gray-700 mb-1">Category Name *</label>
                            <input value={data.name} required placeholder="e.g. Men, Women, Electronics…"
                                onChange={e => { setData('name', e.target.value); if(!cat) setData('slug', slugify(e.target.value)) }}
                                className={inputCls} />
                            {errors.name && <p className="text-[12px] text-red-500 mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-[13px] font-semibold text-gray-700 mb-1">URL Slug *</label>
                            <input value={data.slug} required placeholder="men, women, electronics"
                                onChange={e => setData('slug', e.target.value)}
                                className={`${inputCls} font-mono text-[12.5px]`} />
                            {errors.slug && <p className="text-[12px] text-red-500 mt-1">{errors.slug}</p>}
                        </div>
                    </div>

                    {/* Parent — highlighted box */}
                    <div className="p-4 rounded-xl border-2 border-blue-200 bg-blue-50">
                        <label className="block text-[13px] font-bold text-blue-800 mb-1">Parent Category</label>
                        <p className="text-[12px] text-blue-600 mb-3">
                            Keep as <strong>Top Level</strong> for main menu items (Men, Women…).
                            Pick a parent to make this a <strong>dropdown sub-item</strong> (e.g. "Shirts" under "Men").
                        </p>
                        <select value={data.parent_id} onChange={e => setData('parent_id', e.target.value || '')}
                            className="w-full h-11 px-4 border-2 border-blue-300 rounded-xl text-[13.5px] outline-none focus:border-blue-500 bg-white font-semibold">
                            <option value="">⬛ Top Level — appears in main navigation</option>
                            {topLevel.map(c => (
                                <option key={c.id} value={c.id}>↳ Under "{c.name}" (sub-category)</option>
                            ))}
                        </select>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-[13px] font-semibold text-gray-700 mb-1">Description <span className="text-gray-400 font-normal">(optional)</span></label>
                        <textarea value={data.description} onChange={e => setData('description', e.target.value)} rows={2}
                            placeholder="Short description shown on the category banner"
                            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)] resize-none transition-colors" />
                    </div>

                    {/* Icon + Color */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[13px] font-semibold text-gray-700 mb-1">Icon Emoji</label>
                            <input value={data.icon} onChange={e => setData('icon', e.target.value)}
                                placeholder="👗  👔  📱  🏠  🧒"
                                className={inputCls + " text-xl"} />
                        </div>
                        <div>
                            <label className="block text-[13px] font-semibold text-gray-700 mb-1">Badge Color</label>
                            <div className="flex items-center gap-2">
                                <input type="color" value={data.color || '#00c8ff'} onChange={e => setData('color', e.target.value)}
                                    className="w-11 h-11 rounded-xl border-2 border-gray-200 cursor-pointer p-1 bg-white" />
                                <input value={data.color} onChange={e => setData('color', e.target.value)} placeholder="#00c8ff"
                                    className={`${inputCls} font-mono`} />
                            </div>
                        </div>
                    </div>

                    {/* Position - simplified */}
                    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
                        <div>
                            <label className="block text-[13px] font-semibold text-gray-700 mb-1">Position in Menu</label>
                            <p className="text-[11.5px] text-gray-400 mb-2">1 = first, 2 = second, 3 = third…</p>
                            <input type="number" value={data.nav_order} min="1"
                                onChange={e => { setData('nav_order', +e.target.value); setData('sort_order', +e.target.value) }}
                                className={inputCls} placeholder="1" />
                        </div>
                        <div className="space-y-3 pt-6">
                            {[
                                { key:'is_active',   label:'Active',      hint:'Visible in shop' },
                                { key:'show_in_nav', label:'Show in Menu', hint:'Appears in navigation' },
                            ].map(t => (
                                <label key={t.key} className="flex items-center gap-3 cursor-pointer">
                                    <button type="button" onClick={() => setData(t.key, !data[t.key])}
                                        className={`relative w-11 h-6 rounded-full border-none cursor-pointer transition-all flex-shrink-0 ${data[t.key] ? 'bg-[var(--color-primary)]' : 'bg-gray-300'}`}>
                                        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${data[t.key] ? 'left-5' : 'left-0.5'}`} />
                                    </button>
                                    <div>
                                        <div className="text-[13px] font-semibold text-gray-800">{t.label}</div>
                                        <div className="text-[11px] text-gray-400">{t.hint}</div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Images */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <ImageUpload label="Category Image" w={300} h={300} hint="Square icon shown in category grid"
                            current={cat?.image} onFile={f => setData('image', f)} />
                        <ImageUpload label="Category Banner" w={1400} h={280} hint="Wide banner shown between product sections on homepage"
                            current={cat?.banner_image} onFile={f => setData('banner_image', f)} />
                    </div>

                    <div className="flex gap-3 pt-2 border-t border-gray-100">
                        <button type="submit" disabled={processing}
                            className="flex-1 h-12 font-black text-[14px] rounded-xl border-none cursor-pointer disabled:opacity-60 transition-all hover:opacity-90"
                            style={{ background:'var(--color-primary)', color:'var(--color-primary-text)' }}>
                            {processing ? 'Saving…' : cat ? '✓ Update Category' : '+ Create Category'}
                        </button>
                        <button type="button" onClick={onClose}
                            className="flex-1 h-12 border-2 border-gray-200 text-gray-700 font-semibold text-[13px] rounded-xl bg-white cursor-pointer hover:border-gray-300 transition-colors">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

function CatRow({ cat, depth, allCategories, onEdit, onDelete }: {
    cat: Category; depth: number
    allCategories: Props['allCategories']
    onEdit: (c: Category) => void
    onDelete: (c: Category) => void
}) {
    const [open, setOpen] = useState(true)
    const hasChildren = (cat.children?.length ?? 0) > 0

    return (
        <>
            <tr className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors group ${depth > 0 ? 'bg-blue-50/20' : ''}`}>
                <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5" style={{ paddingLeft: depth * 28 }}>
                        {hasChildren
                            ? <button onClick={() => setOpen(!open)} className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-[var(--color-primary)] border-none bg-transparent cursor-pointer">
                                {open ? <IconChevronDown size={13}/> : <IconChevronRight size={13}/>}
                              </button>
                            : depth > 0
                                ? <span className="w-5 text-gray-300 text-[11px]">└</span>
                                : <span className="w-5" />
                        }
                        {cat.image
                            ? <img src={cat.image} className="w-9 h-9 rounded-lg object-cover flex-shrink-0 border border-gray-100" alt=""/>
                            : <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0 border border-gray-100"
                                style={{ background:(cat.color??'var(--color-primary)')+'22' }}>
                                {cat.icon || cat.name[0]}
                              </div>
                        }
                        <div>
                            <div className="font-semibold text-[13.5px] text-gray-900">{cat.name}</div>
                            <div className="text-[11px] text-gray-400 font-mono">{cat.slug}</div>
                        </div>
                    </div>
                </td>
                <td className="px-5 py-3">
                    {depth === 0
                        ? <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-200">Main Menu</span>
                        : <span className="text-[11px] text-gray-400 pl-1">└ Dropdown item</span>
                    }
                </td>
                <td className="px-5 py-3 text-[12.5px] text-gray-500">{cat.products_count ?? 0}</td>
                <td className="px-5 py-3 text-[12.5px] text-gray-500">#{cat.nav_order || cat.sort_order}</td>
                <td className="px-5 py-3">
                    <div className="flex gap-1.5">
                        <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded-full border ${cat.is_active ? 'bg-green-50 text-green-600 border-green-200' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>
                            {cat.is_active ? 'Active' : 'Hidden'}
                        </span>
                        {cat.show_in_nav && <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 border border-purple-200">In Menu</span>}
                    </div>
                </td>
                <td className="px-5 py-3">
                    <div className="flex gap-1.5 ">
                        <button onClick={() => onEdit(cat)} className="w-8 h-8 rounded-lg border border-gray-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] flex items-center justify-center text-gray-400 bg-white cursor-pointer transition-all" title="Edit">
                            <IconPencil size={14}/>
                        </button>
                        <button onClick={() => onDelete(cat)} className="w-8 h-8 rounded-lg border border-gray-200 hover:border-red-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center text-gray-400 bg-white cursor-pointer transition-all" title="Delete">
                            <IconTrash size={14}/>
                        </button>
                    </div>
                </td>
            </tr>
            {open && hasChildren && cat.children!.map(child => (
                <CatRow key={child.id} cat={child} depth={depth+1} allCategories={allCategories} onEdit={onEdit} onDelete={onDelete}/>
            ))}
        </>
    )
}

export default function CategoriesIndex({ categories, allCategories }: Props) {
    const { props: pageProps } = usePage<{ adminPath?: string }>()
    const ap = `/${pageProps.adminPath ?? 'ml-admin'}`
    const [editing, setEditing] = useState<Category | 'new' | null>(null)

    function del(cat: Category) {
        if (!confirm(`Delete "${cat.name}"?${(cat.children?.length??0)>0 ? '\n\nSub-items will be moved to top level.' : ''}`)) return
        router.delete(`${ap}/categories/${cat.id}`, { preserveScroll: true })
    }

    const total = (cats: Category[]): number => cats.reduce((n,c) => n + 1 + total(c.children??[]), 0)

    return (
        <AdminLayout title="Categories & Menu">
            <Head title="Categories — Admin"/>

            <div className="mb-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-[13px] text-blue-800">
                    <div className="font-bold mb-1">📋 Main Menu Items</div>
                    <div className="text-[12px]">Top Level categories appear in the navigation bar at the top of your store.</div>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl text-[13px] text-purple-800">
                    <div className="font-bold mb-1">↳ Dropdown Sub-items</div>
                    <div className="text-[12px]">Sub-categories appear as dropdowns when hovering a main menu item.</div>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-[13px] text-green-800">
                    <div className="font-bold mb-1">🖼️ Category Banner</div>
                    <div className="text-[12px]">Upload a banner image to each category — it shows between product sections on the homepage.</div>
                </div>
            </div>

            <div className="flex items-center justify-between mb-4">
                <p className="text-[13px] text-gray-500">{total(categories)} categories</p>
                <button onClick={() => setEditing('new')}
                    className="flex items-center gap-2 font-black text-[13px] px-5 h-10 rounded-xl border-none cursor-pointer"
                    style={{ background:'var(--color-primary)', color:'var(--color-primary-text)' }}>
                    <IconPlus size={17}/> Add Category
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px]">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                {['Category Name','Menu Level','Products','Position','Status','Actions'].map(h => (
                                    <th key={h} className="text-left text-[11px] font-black text-gray-400 uppercase tracking-wider px-5 py-3.5">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {categories.length === 0
                                ? <tr><td colSpan={6} className="px-5 py-16 text-center text-gray-400 text-[13px]">No categories yet. Click "Add Category" to create your first.</td></tr>
                                : categories.map(cat => (
                                    <CatRow key={cat.id} cat={cat} depth={0} allCategories={allCategories} onEdit={setEditing} onDelete={del}/>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>

            {editing && (
                <CatForm cat={editing === 'new' ? undefined : editing} allCategories={allCategories} onClose={() => setEditing(null)}/>
            )}
        </AdminLayout>
    )
}
