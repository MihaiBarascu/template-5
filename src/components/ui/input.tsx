'use client'

/**
 * Input Component - Based on official Payload template
 * Adapted for theme system
 */

import * as React from 'react'
import { cn } from '@/utilities/cn'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'flex h-10 w-full rounded-[var(--radius-input)] border border-theme-border bg-theme-surface px-3 py-2 text-sm text-theme-text placeholder:text-theme-text-muted transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-theme-primary/50 focus:border-theme-primary',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'file:border-0 file:bg-transparent file:text-sm file:font-medium',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
