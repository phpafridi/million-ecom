import { useState } from 'react'
import { IconAlertTriangle, IconTrash, IconX } from '@tabler/icons-react'

interface Props {
    open: boolean
    title: string
    itemName?: string
    // When set, the confirm button stays disabled until the admin types
    // this exact text — for the most destructive actions (orders,
    // products) where a single misclick is expensive to undo.
    requireTypedConfirmation?: string
    onConfirm: () => void
    onCancel: () => void
    danger?: boolean
}

// A native browser confirm() is trivially easy to click through out of
// habit — most people's muscle memory is to hit "OK" on any dialog without
// reading it. This requires a deliberate click on a styled button (and
// optionally typing the item's name) instead, so an accidental delete
// takes genuine, conscious effort rather than one reflexive keystroke.
export default function ConfirmDeleteModal({ open, title, itemName, requireTypedConfirmation, onConfirm, onCancel, danger = true }: Props) {
    const [typed, setTyped] = useState('')
    if (!open) return null

    const canConfirm = !requireTypedConfirmation || typed.trim() === requireTypedConfirmation

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.55)' }}
            onClick={onCancel}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
                <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: danger ? '#FEE2E2' : '#FEF3C7' }}>
                        <IconAlertTriangle size={20} color={danger ? '#DC2626' : '#D97706'} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-black text-[16px] text-gray-900">{title}</h3>
                        {itemName && <p className="text-[13px] text-gray-500 mt-0.5 break-words">"{itemName}"</p>}
                    </div>
                    <button onClick={onCancel} className="text-gray-300 hover:text-gray-500 border-none bg-transparent cursor-pointer flex-shrink-0">
                        <IconX size={18} />
                    </button>
                </div>

                <p className="text-[13px] text-gray-500 mb-4">This action cannot be undone.</p>

                {requireTypedConfirmation && (
                    <div className="mb-4">
                        <label className="block text-[11.5px] font-semibold text-gray-500 mb-1.5">
                            Type <span className="font-mono font-bold text-gray-800">{requireTypedConfirmation}</span> to confirm
                        </label>
                        <input value={typed} onChange={e => setTyped(e.target.value)} autoFocus
                            className="w-full h-10 px-3 border-2 border-gray-200 rounded-lg text-[13.5px] outline-none focus:border-red-400"
                            placeholder={requireTypedConfirmation} />
                    </div>
                )}

                <div className="flex gap-2.5">
                    <button onClick={onCancel}
                        className="flex-1 h-10 rounded-xl border-2 border-gray-200 text-gray-600 font-bold text-[13px] cursor-pointer bg-white">
                        Cancel
                    </button>
                    <button onClick={onConfirm} disabled={!canConfirm}
                        className="flex-1 h-10 rounded-xl border-none text-white font-bold text-[13px] cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ background: danger ? '#DC2626' : '#D97706' }}>
                        <IconTrash size={14} /> Delete
                    </button>
                </div>
            </div>
        </div>
    )
}
