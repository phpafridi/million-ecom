import { cn } from './cn'
import { cva, type VariantProps } from 'class-variance-authority'
import { ButtonHTMLAttributes, forwardRef } from 'react'

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary,#00c8ff)]',
    {
        variants: {
            variant: {
                default: 'bg-[var(--color-primary,#00c8ff)] text-[var(--color-primary-text,#0a0a0a)] hover:bg-[var(--color-primary-dark,#00b0e0)] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[var(--color-primary,#00c8ff)]/30',
                dark: 'bg-ink-900 text-white hover:bg-[var(--color-primary,#00c8ff)]',
                outline: 'bg-white text-ink-900 border-2 border-gray-200 hover:border-[var(--color-primary,#00c8ff)] hover:text-[var(--color-primary,#00c8ff)]',
                ghost: 'bg-white/8 border border-white/15 text-white hover:bg-white/14 hover:border-white/30',
                danger: 'bg-red-500 text-white hover:bg-red-600',
                success: 'bg-green-500 text-white hover:bg-green-600',
            },
            size: {
                sm: 'h-9 px-4 text-xs',
                md: 'h-11 px-6 text-sm',
                lg: 'h-13 px-8 text-[15px]',
                xl: 'h-14 px-10 text-base',
                icon: 'h-10 w-10',
            },
        },
        defaultVariants: { variant: 'default', size: 'md' },
    }
)

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, ...props }, ref) => (
        <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
    )
)
Button.displayName = 'Button'
