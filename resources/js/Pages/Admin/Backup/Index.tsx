import { Head, router } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import ConfirmDeleteModal from '@/Components/Admin/ConfirmDeleteModal'
import { useState } from 'react'
import { IconDatabase, IconDownload, IconTrash, IconPlus, IconRefresh } from '@tabler/icons-react'

interface Backup {
    id: number; filename: string; size: string; status: string
    created_by: string; notes?: string; created_at: string; download_url: string
}

export default function BackupIndex({ backups, disk_free, db_size }: { backups: Backup[]; disk_free: string; db_size: string }) {
    const [creating, setCreating] = useState(false)
    const [notes, setNotes] = useState('')
    // A deleted backup can't be recovered — if it turns out to have been
    // the one you actually needed, that's gone. Worth typing the filename.
    const [pendingDelete, setPendingDelete] = useState<Backup | null>(null)

    function create() {
        setCreating(true)
        router.post(window.location.pathname, { notes }, {
            onFinish: () => setCreating(false),
            preserveScroll: true,
        })
    }

    function deleteBackup(id: number, filename: string) { setPendingDelete({ id, filename } as Backup) }
    function confirmDelete() {
        if (!pendingDelete) return
        router.delete(`${window.location.pathname}/${pendingDelete.id}`, { preserveScroll: true, onFinish: () => setPendingDelete(null) })
    }

    const statusColor = (s: string) => s === 'completed' ? '#059669' : s === 'failed' ? '#DC2626' : '#D97706'
    const statusBg    = (s: string) => s === 'completed' ? '#F0FDF4' : s === 'failed' ? '#FEF2F2' : '#FFFBEB'

    return (
        <AdminLayout title="Database Backup">
            <Head title="Database Backup" />

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl border border-gray-100 p-5 text-center">
                    <div className="text-[22px] font-black text-gray-800">{backups.length}</div>
                    <div className="text-[12px] text-gray-500">Total Backups</div>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-5 text-center">
                    <div className="text-[22px] font-black" style={{ color: 'var(--color-primary,#C9A84C)' }}>{db_size}</div>
                    <div className="text-[12px] text-gray-500">Database Size</div>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-5 text-center">
                    <div className="text-[22px] font-black text-green-600">{disk_free}</div>
                    <div className="text-[12px] text-gray-500">Disk Free</div>
                </div>
            </div>

            {/* Create Backup */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6">
                <h3 className="font-black text-[15px] text-gray-800 mb-3">Create New Backup</h3>
                <div className="flex gap-3">
                    <input
                        className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-[var(--color-primary,#C9A84C)]"
                        placeholder="Optional note (e.g. Before product import)"
                        value={notes} onChange={e => setNotes(e.target.value)} />
                    <button onClick={create} disabled={creating}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[13px] border-none cursor-pointer disabled:opacity-60 transition-all"
                        style={{ background: 'var(--color-primary,#C9A84C)', color: 'var(--color-primary-text,#0a0a0a)' }}>
                        {creating ? <><IconRefresh size={15} className="animate-spin" /> Creating…</> : <><IconPlus size={15}/> Create Backup</>}
                    </button>
                </div>
                <p className="text-[11px] text-gray-400 mt-2">
                    Backup is saved to <code>storage/app/backups/</code> on your server.
                    Download immediately after creation and store offsite.
                </p>
            </div>

            {/* Backups List */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-black text-[15px] text-gray-800">Backup History</h3>
                    <span className="text-[12px] text-gray-400">{backups.length} backup{backups.length !== 1 ? 's' : ''}</span>
                </div>
                {backups.length === 0 ? (
                    <div className="py-16 text-center">
                        <IconDatabase size={40} className="mx-auto mb-3 text-gray-300" />
                        <p className="text-gray-400 text-[14px]">No backups yet. Create your first backup above.</p>
                    </div>
                ) : (
                    <table className="w-full text-[13px]">
                        <thead style={{ background: '#0a0a0a' }}>
                            <tr>
                                {['Filename','Size','Status','Created By','Notes','Date','Actions'].map(h => (
                                    <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider" style={{ color: '#C9A84C' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {backups.map((b: Backup) => (
                                <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 font-mono text-[11px] text-gray-700">{b.filename}</td>
                                    <td className="px-4 py-3 text-gray-600">{b.size}</td>
                                    <td className="px-4 py-3">
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                                            style={{ background: statusBg(b.status), color: statusColor(b.status) }}>
                                            {b.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">{b.created_by}</td>
                                    <td className="px-4 py-3 text-gray-400 max-w-[120px] truncate">{b.notes ?? '—'}</td>
                                    <td className="px-4 py-3 text-[11px] text-gray-400 whitespace-nowrap">{b.created_at}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            {b.status === 'completed' && (
                                                <a href={b.download_url}
                                                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold no-underline"
                                                    style={{ background: '#F0FDF4', color: '#059669' }}>
                                                    <IconDownload size={12} /> Download
                                                </a>
                                            )}
                                            <button onClick={() => deleteBackup(b.id, b.filename)}
                                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold border-none cursor-pointer"
                                                style={{ background: '#FEF2F2', color: '#DC2626' }}>
                                                <IconTrash size={12} /> Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Warning */}
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-[12px] text-amber-700">
                <strong>⚠️ Important:</strong> Backups are stored on your server. For safety, always download and store copies
                on Google Drive, Dropbox, or an external drive. Server backups can be lost if the server crashes.
                Schedule weekly backups minimum, daily before any major changes.
            </div>
            <ConfirmDeleteModal
                open={!!pendingDelete}
                title="Delete this backup? It cannot be recovered."
                itemName={pendingDelete?.filename}
                requireTypedConfirmation={pendingDelete?.filename}
                onConfirm={confirmDelete}
                onCancel={() => setPendingDelete(null)}
            />
        </AdminLayout>
    )
}
