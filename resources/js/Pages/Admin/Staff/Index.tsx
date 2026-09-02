import { Head, router, usePage } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import ConfirmDeleteModal from '@/Components/Admin/ConfirmDeleteModal'
import { useState } from 'react'
import { IconPlus, IconEdit, IconTrash, IconCheck, IconX, IconShield } from '@tabler/icons-react'

interface Staff { id:number; name:string; email:string; role:string; staff_role:string; is_staff:boolean; is_active:boolean; last_login_at:string|null; created_at:string; permissions:string[] }
interface Role { label:string; description:string; color:string; permissions:string[] }
interface Props { staff:Staff[]; roles:Record<string,Role> }

// Every page a staff account could conceivably access — matches
// AdminMiddleware's permission map exactly, so a checked box here always
// corresponds to something the backend will actually allow.
const PERMISSION_OPTIONS: { key: string; label: string }[] = [
    { key: 'dashboard',        label: 'Dashboard' },
    { key: 'orders',           label: 'Orders (full — edit status, delete)' },
    { key: 'orders_lookup',    label: 'Order Lookup (search & view only)' },
    { key: 'products',         label: 'Products' },
    { key: 'customers',        label: 'Customers' },
    { key: 'categories',       label: 'Categories' },
    { key: 'coupons',          label: 'Coupons' },
    { key: 'reviews',          label: 'Reviews' },
    { key: 'email_campaigns',  label: 'Email Campaigns' },
    { key: 'support_tickets',  label: 'Support Tickets' },
    { key: 'hero_slides',      label: 'Hero Slides' },
    { key: 'banners',          label: 'Banners' },
    { key: 'pages',            label: 'Pages' },
    { key: 'returns',          label: 'Returns' },
    { key: 'chat',             label: 'Live Chat' },
]

export default function StaffIndex({ staff, roles }:Props) {
    const { props: __p } = usePage<{ adminPath?: string }>()
    const ap = `/${__p?.adminPath ?? 'ml-admin'}`
    const [adding, setAdding]   = useState(false)
    const [editing, setEditing] = useState<Staff|null>(null)
    const [form, setForm]       = useState({ name:'', email:'', password:'', staff_role:'support', permissions: roles['support']?.permissions ?? [] })
    const [eform, setEform]     = useState({ name:'', staff_role:'support', is_active:true, password:'', permissions: [] as string[] })
    // Deleting a staff account is high-stakes and hard to undo (they lose
    // access immediately) — a native confirm() is too easy to click
    // through from habit, so this requires typing their name instead.
    const [pendingDelete, setPendingDelete] = useState<Staff | null>(null)
    const inp = "w-full h-11 px-4 border border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)] bg-white"

    function add(e:React.FormEvent){
        e.preventDefault(); router.post(`${ap}/staff`, form, { onSuccess:()=>{ setForm({name:'',email:'',password:'',staff_role:'support',permissions:roles['support']?.permissions ?? []}); setAdding(false) } }) }
    function edit(e:React.FormEvent){
        e.preventDefault(); if(!editing) return; router.put(`${ap}/staff/${editing.id}`, eform as any, { onSuccess:()=>setEditing(null) }) }
    function del(s:Staff){ setPendingDelete(s) }
    function confirmDelete(){
        if (!pendingDelete) return
        router.delete(`${ap}/staff/${pendingDelete.id}`, { onFinish: () => setPendingDelete(null) })
    }
    function startEdit(s:Staff){ setEditing(s); setEform({ name:s.name, staff_role:s.staff_role||'support', is_active:s.is_active, password:'', permissions: s.permissions ?? [] }) }

    return (
        <AdminLayout title="Staff & Roles">
            <Head title="Staff" />
            <div className="flex items-center justify-between mb-5">
                <p className="text-[13px] text-gray-500">{staff.length} team members</p>
                <button onClick={()=>setAdding(true)} className="flex items-center gap-2 h-10 px-5 rounded-xl font-bold text-[13px] border-none cursor-pointer" style={{background:'var(--color-primary)',color:'var(--color-primary-text)'}}>
                    <IconPlus size={15}/> Add Staff
                </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                {Object.entries(roles).map(([k,r])=>(
                    <div key={k} className="bg-white rounded-2xl border border-gray-100 p-4">
                        <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 rounded-full" style={{background:r.color}}/><span className="font-black text-[13px]">{r.label}</span></div>
                        <p className="text-[11.5px] text-gray-400">{r.description}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <table className="w-full text-[13px]">
                    <thead><tr className="border-b border-gray-100">{['Name','Email','Role','Status','Last Login',''].map(h=><th key={h} className="text-left px-5 py-3.5 text-[11px] font-black text-gray-400 uppercase tracking-wide">{h}</th>)}</tr></thead>
                    <tbody className="divide-y divide-gray-50">
                        {staff.map(s=>(
                            <tr key={s.id} className="hover:bg-gray-50">
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-white text-[13px]" style={{background:s.role==='admin'?'var(--color-primary)':roles[s.staff_role]?.color||'#6B7280'}}>{s.name[0]?.toUpperCase()}</div>
                                        <div><p className="font-bold text-gray-900">{s.name}</p>{s.role==='admin'&&<span className="text-[10px] font-bold text-amber-600">Super Admin</span>}</div>
                                    </div>
                                </td>
                                <td className="px-5 py-4 text-gray-500">{s.email}</td>
                                <td className="px-5 py-4">
                                    {s.role==='admin'?<span className="flex items-center gap-1 text-[11px] font-black px-2.5 py-1 rounded-full text-white w-fit" style={{background:'var(--color-primary)'}}><IconShield size={11}/> Admin</span>
                                    :<span className="text-[11px] font-black px-2.5 py-1 rounded-full text-white w-fit block" style={{background:roles[s.staff_role]?.color||'#6B7280'}}>{roles[s.staff_role]?.label||s.staff_role}</span>}
                                </td>
                                <td className="px-5 py-4"><span className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full w-fit ${s.is_active?'bg-green-50 text-green-600':'bg-red-50 text-red-500'}`}>{s.is_active?<IconCheck size={11}/>:<IconX size={11}/>}{s.is_active?'Active':'Inactive'}</span></td>
                                <td className="px-5 py-4 text-gray-400 text-[12px]">{s.last_login_at?new Date(s.last_login_at).toLocaleDateString():'Never'}</td>
                                <td className="px-5 py-4">{s.role!=='admin'&&<div className="flex gap-2">
                                    <button onClick={()=>startEdit(s)} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer bg-white"><IconEdit size={14}/></button>
                                    <button onClick={()=>del(s)} className="w-8 h-8 rounded-lg border border-red-100 flex items-center justify-center text-red-400 hover:bg-red-50 cursor-pointer bg-white"><IconTrash size={14}/></button>
                                </div>}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {adding&&<div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:'rgba(0,0,0,0.5)'}}>
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                    <h3 className="font-black text-[17px] mb-5">Add Staff Member</h3>
                    <form onSubmit={add} className="space-y-4">
                        <div><label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">Name *</label><input className={inp} value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} required/></div>
                        <div><label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">Email *</label><input type="email" className={inp} value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} required/></div>
                        <div><label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">Password *</label><input type="password" className={inp} value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} required/></div>
                        <div><label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">Role *</label>
                            <select className={inp} value={form.staff_role} onChange={e=>{
                                const role = e.target.value
                                setForm(f=>({...f, staff_role:role, permissions: roles[role]?.permissions ?? []}))
                            }}>
                                {Object.entries(roles).map(([k,r])=><option key={k} value={k}>{r.label} — {r.description}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">Page Access</label>
                            <p className="text-[11px] text-gray-400 mb-2">Role sets sensible defaults above — adjust individual pages here if needed.</p>
                            <div className="grid grid-cols-2 gap-1.5 p-3 bg-gray-50 rounded-xl max-h-[180px] overflow-y-auto">
                                {PERMISSION_OPTIONS.map(p => (
                                    <label key={p.key} className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="w-3.5 h-3.5" checked={form.permissions.includes(p.key)}
                                            onChange={e => setForm(f => ({...f, permissions: e.target.checked ? [...f.permissions, p.key] : f.permissions.filter(x=>x!==p.key)}))} />
                                        <span className="text-[12px] text-gray-700">{p.label}</span>
                                    </label>
                                ))}
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer mt-2 p-2.5 bg-red-50 border border-red-100 rounded-xl">
                                <input type="checkbox" className="w-3.5 h-3.5 accent-red-600" checked={form.permissions.includes('can_delete')}
                                    onChange={e => setForm(f => ({...f, permissions: e.target.checked ? [...f.permissions, 'can_delete'] : f.permissions.filter(x=>x!=='can_delete')}))} />
                                <span className="text-[12px] font-semibold text-red-700">Allow deleting items (applies across every page above)</span>
                            </label>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button type="submit" className="flex-1 h-11 rounded-xl font-bold text-[14px] border-none cursor-pointer" style={{background:'var(--color-primary)',color:'var(--color-primary-text)'}}>Create</button>
                            <button type="button" onClick={()=>setAdding(false)} className="h-11 px-5 rounded-xl font-bold border-2 border-gray-200 text-gray-600 cursor-pointer bg-white">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>}

            {editing&&<div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:'rgba(0,0,0,0.5)'}}>
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                    <h3 className="font-black text-[17px] mb-5">Edit {editing.name}</h3>
                    <form onSubmit={edit} className="space-y-4">
                        <div><label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">Name</label><input className={inp} value={eform.name} onChange={e=>setEform(f=>({...f,name:e.target.value}))}/></div>
                        <div><label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">Role</label>
                            <select className={inp} value={eform.staff_role} onChange={e=>{
                                const role = e.target.value
                                setEform(f=>({...f, staff_role:role, permissions: roles[role]?.permissions ?? []}))
                            }}>
                                {Object.entries(roles).map(([k,r])=><option key={k} value={k}>{r.label}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">Page Access</label>
                            <div className="grid grid-cols-2 gap-1.5 p-3 bg-gray-50 rounded-xl max-h-[180px] overflow-y-auto">
                                {PERMISSION_OPTIONS.map(p => (
                                    <label key={p.key} className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="w-3.5 h-3.5" checked={eform.permissions.includes(p.key)}
                                            onChange={e => setEform(f => ({...f, permissions: e.target.checked ? [...f.permissions, p.key] : f.permissions.filter(x=>x!==p.key)}))} />
                                        <span className="text-[12px] text-gray-700">{p.label}</span>
                                    </label>
                                ))}
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer mt-2 p-2.5 bg-red-50 border border-red-100 rounded-xl">
                                <input type="checkbox" className="w-3.5 h-3.5 accent-red-600" checked={eform.permissions.includes('can_delete')}
                                    onChange={e => setEform(f => ({...f, permissions: e.target.checked ? [...f.permissions, 'can_delete'] : f.permissions.filter(x=>x!=='can_delete')}))} />
                                <span className="text-[12px] font-semibold text-red-700">Allow deleting items (applies across every page above)</span>
                            </label>
                        </div>
                        <div><label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">New Password</label><input type="password" className={inp} value={eform.password} onChange={e=>setEform(f=>({...f,password:e.target.value}))} placeholder="Leave blank to keep"/></div>
                        <div className="flex items-center gap-3"><input type="checkbox" id="ia" checked={eform.is_active} onChange={e=>setEform(f=>({...f,is_active:e.target.checked}))} className="w-4 h-4"/><label htmlFor="ia" className="text-[13.5px] font-semibold text-gray-700">Account Active</label></div>
                        <div className="flex gap-3 pt-2">
                            <button type="submit" className="flex-1 h-11 rounded-xl font-bold border-none cursor-pointer" style={{background:'var(--color-primary)',color:'var(--color-primary-text)'}}>Save</button>
                            <button type="button" onClick={()=>setEditing(null)} className="h-11 px-5 rounded-xl font-bold border-2 border-gray-200 text-gray-600 cursor-pointer bg-white">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>}

            <ConfirmDeleteModal
                open={!!pendingDelete}
                title="Remove this staff member?"
                itemName={pendingDelete?.name}
                requireTypedConfirmation={pendingDelete?.name}
                onConfirm={confirmDelete}
                onCancel={() => setPendingDelete(null)}
            />
        </AdminLayout>
    )
}
