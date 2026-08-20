import { Head, useForm, router } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import { useState } from 'react'
import { IconPlus, IconEdit, IconTrash, IconCheck, IconX, IconShield, IconUser, IconEye } from '@tabler/icons-react'

interface StaffMember {
    id: number; name: string; email: string; role: string
    staff_role: string; is_staff: boolean; is_active: boolean
    last_login_at: string | null; created_at: string; permissions: string[]
}
interface Role { label: string; description: string; color: string; permissions: string[] }
interface Props { staff: StaffMember[]; roles: Record<string, Role>; totalStaff: number }

export default function StaffIndex({ staff, roles }: Props) {
    const [adding, setAdding] = useState(false)
    const [editing, setEditing] = useState<StaffMember | null>(null)

    const { data, setData, post, processing, reset, errors } = useForm({
        name: '', email: '', password: '', staff_role: 'support',
    })

    const { data: editData, setData: setEditData, put, processing: editProcessing } = useForm({
        name: '', staff_role: 'support', is_active: true, password: '',
    })

    function submit(e: React.FormEvent) {
        e.preventDefault()
        post('/ml-admin/staff', { onSuccess: () => { reset(); setAdding(false) } })
    }

    function startEdit(s: StaffMember) {
        setEditing(s)
        setEditData({ name: s.name, staff_role: s.staff_role || 'support', is_active: s.is_active, password: '' })
    }

    function submitEdit(e: React.FormEvent) {
        e.preventDefault()
        if (!editing) return
        router.put(`/ml-admin/staff/${editing.id}`, editData as any, {
            onSuccess: () => setEditing(null)
        })
    }

    function deleteStaff(s: StaffMember) {
        if (!confirm(`Remove ${s.name} from staff?`)) return
        router.delete(`/ml-admin/staff/${s.id}`)
    }

    const inputCls = "w-full h-11 px-4 border border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)] bg-white"
    const labelCls = "block text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-1.5"

    return (
        <AdminLayout title="Staff Management">
            <Head title="Staff Management" />

            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <p className="text-[13px] text-gray-500">{staff.length} team members · Control who can access the admin panel</p>
                </div>
                <button onClick={() => setAdding(true)}
                    className="flex items-center gap-2 h-10 px-5 rounded-xl font-bold text-[13px] border-none cursor-pointer text-white"
                    style={{ background: 'var(--color-primary)', color: 'var(--color-primary-text)' }}>
                    <IconPlus size={16} /> Add Staff Member
                </button>
            </div>

            {/* Role cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {Object.entries(roles).map(([key, role]) => (
                    <div key={key} className="bg-white rounded-2xl border border-gray-100 p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-3 h-3 rounded-full" style={{ background: role.color }} />
                            <span className="font-black text-[13px] text-gray-800">{role.label}</span>
                        </div>
                        <p className="text-[11.5px] text-gray-400">{role.description}</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                            {role.permissions.slice(0,3).map(p => (
                                <span key={p} className="text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{p}</span>
                            ))}
                            {role.permissions.length > 3 && <span className="text-[9.5px] text-gray-400">+{role.permissions.length - 3}</span>}
                        </div>
                    </div>
                ))}
            </div>

            {/* Staff table */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <table className="w-full text-[13px]">
                    <thead>
                        <tr className="border-b border-gray-100">
                            {['Name','Email','Role','Access','Status','Last Login',''].map(h => (
                                <th key={h} className="text-left px-5 py-3.5 text-[11px] font-black text-gray-400 uppercase tracking-wide">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {staff.map(s => (
                            <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-white text-[13px]"
                                            style={{ background: s.role === 'admin' ? 'var(--color-primary)' : roles[s.staff_role]?.color || '#6B7280' }}>
                                            {s.name[0]?.toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{s.name}</p>
                                            {s.role === 'admin' && <span className="text-[10px] font-bold text-amber-600">Super Admin</span>}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-4 text-gray-500">{s.email}</td>
                                <td className="px-5 py-4">
                                    {s.role === 'admin' ? (
                                        <span className="inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-1 rounded-full text-white" style={{ background: 'var(--color-primary)' }}>
                                            <IconShield size={11} /> Admin
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-1 rounded-full text-white"
                                            style={{ background: roles[s.staff_role]?.color || '#6B7280' }}>
                                            {roles[s.staff_role]?.label || s.staff_role}
                                        </span>
                                    )}
                                </td>
                                <td className="px-5 py-4">
                                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                                        {(s.permissions || []).slice(0,3).map(p => (
                                            <span key={p} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">{p}</span>
                                        ))}
                                        {(s.permissions || []).length > 3 && (
                                            <span className="text-[9px] text-gray-400">+{s.permissions.length - 3} more</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-5 py-4">
                                    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${s.is_active ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                                        {s.is_active ? <IconCheck size={11} /> : <IconX size={11} />}
                                        {s.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-5 py-4 text-gray-400 text-[12px]">
                                    {s.last_login_at ? new Date(s.last_login_at).toLocaleDateString() : 'Never'}
                                </td>
                                <td className="px-5 py-4">
                                    {s.role !== 'admin' && (
                                        <div className="flex gap-2">
                                            <button onClick={() => startEdit(s)}
                                                className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer bg-white">
                                                <IconEdit size={14} />
                                            </button>
                                            <button onClick={() => deleteStaff(s)}
                                                className="w-8 h-8 rounded-lg border border-red-100 flex items-center justify-center text-red-400 hover:bg-red-50 cursor-pointer bg-white">
                                                <IconTrash size={14} />
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Staff Modal */}
            {adding && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                        <h3 className="font-black text-[17px] text-gray-900 mb-5">Add Staff Member</h3>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className={labelCls}>Full Name *</label>
                                <input className={inputCls} value={data.name} onChange={e => setData('name', e.target.value)} placeholder="Ali Khan" required />
                            </div>
                            <div>
                                <label className={labelCls}>Email *</label>
                                <input type="email" className={inputCls} value={data.email} onChange={e => setData('email', e.target.value)} placeholder="ali@millionaire.pk" required />
                            </div>
                            <div>
                                <label className={labelCls}>Password *</label>
                                <input type="password" className={inputCls} value={data.password} onChange={e => setData('password', e.target.value)} placeholder="Min 8 characters" required />
                            </div>
                            <div>
                                <label className={labelCls}>Role *</label>
                                <select className={inputCls} value={data.staff_role} onChange={e => setData('staff_role', e.target.value)}>
                                    {Object.entries(roles).map(([k, r]) => (
                                        <option key={k} value={k}>{r.label} — {r.description}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="submit" disabled={processing}
                                    className="flex-1 h-11 rounded-xl font-bold text-[14px] border-none cursor-pointer text-white"
                                    style={{ background: 'var(--color-primary)', color: 'var(--color-primary-text)' }}>
                                    {processing ? 'Creating...' : 'Create Staff Account'}
                                </button>
                                <button type="button" onClick={() => setAdding(false)}
                                    className="h-11 px-5 rounded-xl font-bold text-[14px] border-2 border-gray-200 text-gray-600 cursor-pointer bg-white">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                        <h3 className="font-black text-[17px] text-gray-900 mb-5">Edit {editing.name}</h3>
                        <form onSubmit={submitEdit} className="space-y-4">
                            <div>
                                <label className={labelCls}>Name</label>
                                <input className={inputCls} value={editData.name} onChange={e => setEditData('name', e.target.value)} />
                            </div>
                            <div>
                                <label className={labelCls}>Role</label>
                                <select className={inputCls} value={editData.staff_role} onChange={e => setEditData('staff_role', e.target.value)}>
                                    {Object.entries(roles).map(([k, r]) => <option key={k} value={k}>{r.label}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={labelCls}>New Password (leave blank to keep)</label>
                                <input type="password" className={inputCls} value={editData.password} onChange={e => setEditData('password', e.target.value)} placeholder="Leave blank to keep current" />
                            </div>
                            <div className="flex items-center gap-3">
                                <input type="checkbox" id="is_active" checked={editData.is_active}
                                    onChange={e => setEditData('is_active', e.target.checked)} className="w-4 h-4" />
                                <label htmlFor="is_active" className="text-[13.5px] font-semibold text-gray-700">Account Active</label>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="submit" disabled={editProcessing}
                                    className="flex-1 h-11 rounded-xl font-bold text-[14px] border-none cursor-pointer text-white"
                                    style={{ background: 'var(--color-primary)', color: 'var(--color-primary-text)' }}>
                                    {editProcessing ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button type="button" onClick={() => setEditing(null)}
                                    className="h-11 px-5 rounded-xl font-bold border-2 border-gray-200 text-gray-600 cursor-pointer bg-white">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    )
}
