import { cn } from './cn'

interface SkeletonProps { className?: string; style?: React.CSSProperties }

export function Skeleton({ className, style }: SkeletonProps) {
    return (
        <div className={cn('skeleton-shimmer rounded-xl', className)} style={style} />
    )
}

export function ProductCardSkeleton() {
    return (
        <div className="bg-white rounded-[13px] border border-gray-100 overflow-hidden">
            <Skeleton className="w-full aspect-square rounded-none" />
            <div className="p-3.5 space-y-2.5">
                <Skeleton className="h-3 w-20 rounded-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-5 w-24 mt-1" />
                <Skeleton className="h-9 w-full mt-2 rounded-lg" />
            </div>
        </div>
    )
}

export function CategorySkeleton() {
    return (
        <div className="bg-white rounded-[13px] border border-gray-100 overflow-hidden">
            <Skeleton className="w-full aspect-square rounded-none" />
            <Skeleton className="h-4 w-16 mx-auto my-2.5 rounded-full" />
        </div>
    )
}

export function BannerSkeleton({ height = 280 }: { height?: number }) {
    return <Skeleton className="w-full rounded-none" style={{ height }} />
}

export function TextSkeleton({ lines = 3, className }: { lines?: number; className?: string }) {
    return (
        <div className={cn('space-y-2', className)}>
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton key={i} className={i === lines - 1 ? 'h-3.5 w-2/3' : 'h-3.5 w-full'} />
            ))}
        </div>
    )
}
