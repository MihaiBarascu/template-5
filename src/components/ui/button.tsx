'use client'

/**
 * Button Component - Based on official Payload template
 * Adapted for theme system
 */

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utilities/cn'

const buttonVariants = cva(
  "relative inline-flex items-center justify-center cursor-pointer gap-2 whitespace-nowrap rounded-[var(--radius-button)] text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-theme-primary/50",
  {
    variants: {
      variant: {
        default: 'bg-theme-primary text-white shadow-sm hover:bg-theme-primary-dark',
        gradient: 'btn-gradient shadow-sm hover:shadow-md', // Premium gradient: primary → primary-dark
        destructive: 'bg-red-600 text-white shadow-sm hover:bg-red-700',
        outline: 'border border-theme-border bg-theme-surface shadow-sm hover:bg-theme-surface-secondary hover:border-theme-primary',
        secondary: 'bg-theme-surface-secondary text-theme-text shadow-sm hover:bg-theme-border',
        ghost: 'text-theme-text-muted hover:text-theme-text hover:bg-theme-surface-secondary',
        link: 'text-theme-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-md gap-1.5 px-3 text-xs',
        lg: 'h-12 rounded-md px-6 text-base',
        icon: 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
