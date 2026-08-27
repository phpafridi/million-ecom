import { Head, Link, router, usePage } from '@inertiajs/react'
import { IconCheck, IconTrash, IconStar } from '@tabler/icons-react'
import AdminLayout from '@/Layouts/AdminLayout'

interface Review {
    id: number; name: string; email: string | null; rating: number
    title: string | null; body: string | null; is_approved: boolean; created_at: string
    product: { id: number; name: string; slug: string }
}
interface Props {
    reviews: { data: Review[]; total: number }
    stats: { total: number; pending: number; approved: number; avg: number }
}

function Stars({ n }: { n: number }) {
    const { props: _sub } = usePage<any>()
    const ap = `/${_sub?.adminPath ?? 'ml-admin'}`
    return (
        <div className="flex gap-0.5">
            {[1,2,3,4,5].map(i => (
                <IconStar key={i} size={13} className={i <= n ? 'text-amber-400' : 'text-gray-200'} fill={i <= n ? 'currentColor' : 'none'}/>
            ))}
        </div>
    )
}

export default function ReviewsIndex({ reviews, stats }: Props) {
    const { props: pageProps } = usePage<{ adminPath?: string }>()
    const ap = `/${pageProps.adminPath ?? 'ml-admin'}`

    function approve(id: number) {
        router.patch(`${ap}/reviews/${id}/approve`, {}, { preserveScroll: true })
    }
    function del(id: number) {
        if (!confirm('Delete this review?')) return
        router.delete(`${ap}/reviews/${id}`, { preserveScroll: true })
    }

    return (
        <AdminLayout title="Product Reviews">
            <Head title="Reviews"/>
            {/* How reviews work */}
            <div className="mb-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-[12.5px] text-blue-800">
                    <div className="font-bold mb-1">⭐ How Reviews Work</div>
                    <div>Customers submit reviews from product pages. Reviews are hidden until you approve them.</div>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-[12.5px] text-green-800">
                    <div className="font-bold mb-1">✓ To Approve</div>
                    <div>Click the green ✓ checkmark on any pending review. It will appear on the product page immediately.</div>
                </div>
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-[12.5px] text-red-800">
                    <div className="font-bold mb-1">🗑 To Delete</div>
                    <div>Click the trash icon to permanently delete a review. This updates the product's star rating.</div>
                </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {[
                    { label:'Total Reviews', value: stats.total },
                    { label:'Pending Approval', value: stats.pending, highlight: stats.pending > 0 },
                    { label:'Approved', value: stats.approved },
                    { label:'Avg Rating', value: stats.avg ? `${stats.avg} ★` : 'N/A' },
                ].map(s => (
                    <div key={s.label} className={`bg-white rounded-2xl border p-4 ${s.highlight ? 'border-amber-300' : 'border-gray-100'}`}>
                        <div className="text-[11.5px] text-gray-500 font-semibold">{s.label}</div>
                        <div className={`font-manrope font-black text-[22px] mt-1 ${s.highlight ? 'text-amber-600' : ''}`} style={!s.highlight ? { color:'var(--color-dark-bg)' } : {}}>{s.value}</div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <table className="w-full min-w-[700px]">
                    <thead><tr className="bg-gray-50 border-b border-gray-100">
                        {['Product','Customer','Rating','Review','Status','Actions'].map(h => (
                            <th key={h} className="text-left text-[11px] font-black text-gray-400 uppercase tracking-wider px-5 py-3.5">{h}</th>
                        ))}
                    </tr></thead>
                    <tbody>
                        {reviews.data.map(r => (
                            <tr key={r.id} className={`border-b border-gray-50 last:border-0 hover:bg-gray-50/50 group ${!r.is_approved ? 'bg-amber-50/30' : ''}`}>
                                <td className="px-5 py-3.5">
                                    <div className="font-semibold text-[12.5px] text-gray-900 max-w-[150px] truncate">{r.product?.name}</div>
                                </td>
                                <td className="px-5 py-3.5">
                                    <div className="font-semibold text-[13px] text-gray-900">{r.name}</div>
                                    {r.email && <div className="text-[11px] text-gray-400">{r.email}</div>}
                                </td>
                                <td className="px-5 py-3.5"><Stars n={r.rating}/></td>
                                <td className="px-5 py-3.5 max-w-[200px]">
                                    {r.title && <div className="font-semibold text-[12.5px] text-gray-900">{r.title}</div>}
                                    {r.body && <div className="text-[12px] text-gray-500 truncate">{r.body}</div>}
                                </td>
                                <td className="px-5 py-3.5">
                                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${r.is_approved ? 'bg-green-50 text-green-600 border-green-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                                        {r.is_approved ? 'Approved' : 'Pending'}
                                    </span>
                                </td>
                                <td className="px-5 py-3.5">
                                    <div className="flex gap-1.5 ">
                                        {!r.is_approved && (
                                            <button onClick={() => approve(r.id)} title="Approve" className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-green-500 bg-white cursor-pointer hover:bg-green-50 hover:border-green-300 transition-all">
                                                <IconCheck size={14}/>
                                            </button>
                                        )}
                                        <button onClick={() => del(r.id)} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 bg-white cursor-pointer hover:border-red-400 hover:bg-red-50 hover:text-red-500 transition-all">
                                            <IconTrash size={14}/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {reviews.data.length === 0 && (
                            <tr><td colSpan={6} className="px-5 py-16 text-center text-gray-400 text-[13px]">No reviews yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    )
}
