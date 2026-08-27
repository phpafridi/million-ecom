import { usePage, Link, usePage } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import { IconLock, IconArrowLeft } from '@tabler/icons-react'

export default function NoPermission({ message, section }: { message?: string; section?: string }) {
    const { props } = usePage<any>()
    const ap = `/${props.adminPath ?? 'ml-admin'}`

    return (
        <AdminLayout title="Access Restricted">
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
                    style={{ background: 'rgba(201,168,76,0.1)', border: '2px solid var(--color-primary,#C9A84C)' }}>
                    <IconLock size={36} style={{ color: 'var(--color-primary,#C9A84C)' }} />
                </div>
                <h1 className="text-[24px] font-black text-gray-900 mb-2">Access Restricted</h1>
                {section && (
                    <p className="text-[13px] font-semibold text-gray-400 mb-3 uppercase tracking-wider">
                        {section}
                    </p>
                )}
                <p className="text-[15px] text-gray-500 mb-8 max-w-md">
                    {message ?? "You don't have permission to access this section. Contact your administrator."}
                </p>
                <Link href={ap}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-[14px] no-underline transition-all hover:opacity-90"
                    style={{ background: 'var(--color-primary,#C9A84C)', color: 'var(--color-primary-text,#0a0a0a)' }}>
                    <IconArrowLeft size={16} /> Back to Dashboard
                </Link>
            </div>
        </AdminLayout>
    )
}
