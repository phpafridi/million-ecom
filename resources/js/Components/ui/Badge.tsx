import { cn } from './cn'
interface BadgeProps { children: React.ReactNode; variant?: 'orange'|'red'|'green'|'blue'|'gray'|'dark'; className?: string }
export function Badge({ children, variant = 'orange', className }: BadgeProps) {
    const v = {
        orange: 'bg-[var(--color-primary-soft, #f0fbff)] text-[var(--color-primary, #00c8ff)] border border-[rgba(0,200,255,0.25)]',
        red: 'bg-red-50 text-red-500 border border-red-200',
        green: 'bg-green-50 text-green-600 border border-green-200',
        blue: 'bg-blue-50 text-blue-600 border border-blue-200',
        gray: 'bg-gray-100 text-gray-600 border border-gray-200',
        dark: 'bg-ink-900 text-white',
    }
    return <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold', v[variant], className)}>{children}</span>
}
