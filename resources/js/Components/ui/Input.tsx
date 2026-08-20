import { cn } from './cn'
import { InputHTMLAttributes, forwardRef } from 'react'
export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
    ({ className, ...props }, ref) => (
        <input ref={ref} className={cn('w-full h-11 px-4 border-2 border-gray-200 rounded-xl text-sm font-medium outline-none transition-all placeholder:text-gray-400 focus:border-[var(--color-primary, #00c8ff)] focus:ring-4 focus:ring-[var(--color-primary, #00c8ff)]/10 bg-white', className)} {...props} />
    )
)
Input.displayName = 'Input'
