import { cn } from './cn'
export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn('bg-white rounded-2xl border border-gray-100 shadow-sm', className)} {...props}>{children}</div>
}
export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn('p-6 border-b border-gray-100', className)} {...props}>{children}</div>
}
export function CardBody({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn('p-6', className)} {...props}>{children}</div>
}
