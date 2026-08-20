import { usePage } from '@inertiajs/react'

/**
 * Returns the current admin path prefix (e.g. "tijar-admin").
 * All admin pages use this so changing admin_path in Settings
 * automatically updates every link and form action in the admin panel.
 */
export function useAdminPath(): string {
    const { props } = usePage<{ adminPath?: string }>()
    return props.adminPath ?? 'tijar-admin'
}

/**
 * Returns a function that builds admin URLs.
 * Usage: const ap = useAdminUrl(); ap('/products') => '/tijar-admin/products'
 */
export function useAdminUrl(): (path?: string) => string {
    const base = useAdminPath()
    return (path = '') => `/${base}${path}`
}
