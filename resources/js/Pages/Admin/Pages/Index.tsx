import { Head, usePage, useForm } from '@inertiajs/react'
import { useState } from 'react'
import AdminLayout from '@/Layouts/AdminLayout'
import { Input } from '@/Components/ui/Input'
import { Button } from '@/Components/ui/Button'

interface Props { pages: Record<string, { title: string; fields: string[] }>; settings: Record<string, string> }

export default function PagesIndex({ pages, settings }: Props) {
    const { props: _p } = usePage<{ adminPath?: string }>()
    const ap = `/${_p.adminPath ?? 'tijar-admin'}`
    const [active, setActive] = useState('about')
    const page = pages[active]

    const { data, setData, put, processing } = useForm<Record<string, string>>(
        Object.fromEntries(
            Object.values(pages).flatMap(p => p.fields).map(k => [k, settings[k] ?? ''])
        )
    )

    function save(e: React.FormEvent) {
        e.preventDefault()
        put(`${ap}/pages/${active}`)
    }

    return (
        <AdminLayout title="Page Content">
            <Head title="Pages — Admin" />
            <div className="flex gap-4 mb-6">
                {Object.entries(pages).map(([key, p]) => (
                    <button key={key} onClick={() => setActive(key)}
                        className={`px-5 h-10 rounded-xl text-[13px] font-semibold transition-all border-none cursor-pointer
                            ${active === key ? 'bg-[var(--color-primary, #00c8ff)] text-[var(--color-dark-bg, #0a0e1a)]' : 'bg-white border border-gray-200 text-gray-600 hover:border-[var(--color-primary, #00c8ff)] hover:text-[var(--color-primary, #00c8ff)]'}`}>
                        {p.title}
                    </button>
                ))}
            </div>

            <form onSubmit={save} className="bg-white rounded-2xl border border-gray-100 p-6 max-w-2xl space-y-4">
                <h3 className="font-manrope font-bold text-[16px] text-gray-900 pb-3 border-b border-gray-100">Edit: {page.title}</h3>
                {page.fields.length === 0 && (
                    <p className="text-[13px] text-gray-500">This page has no editable content fields yet. Content is managed through Settings.</p>
                )}
                {page.fields.map(field => (
                    <div key={field}>
                        <label className="block text-[13px] font-semibold text-gray-700 mb-1.5 capitalize">{field.replace(/_/g, ' ')}</label>
                        <textarea value={data[field] ?? ''} onChange={e => setData(field, e.target.value)} rows={4}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary, #00c8ff)] resize-none transition-all" />
                    </div>
                ))}
                {page.fields.length > 0 && (
                    <Button type="submit" disabled={processing}>
                        {processing ? 'Saving…' : 'Save Page Content'}
                    </Button>
                )}
            </form>
        </AdminLayout>
    )
}
