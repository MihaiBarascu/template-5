'use client'

/**
 * Open Cart Button - Based on official Payload ecommerce template
 * Styling adapted to use theme system
 */

import { cn } from '@/utilities/cn'
import React from 'react'

export function OpenCartButton({
  className,
  quantity,
  ...rest
}: {
  className?: string
  quantity?: number
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        'relative flex items-center gap-2 px-3 py-2 text-theme-text hover:text-theme-primary transition-colors',
        className
      )}
      {...rest}
    >
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      <span className="hidden sm:inline">Cos</span>
      {quantity ? (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-theme-primary text-xs text-white font-medium">
          {quantity}
        </span>
      ) : null}
    </button>
  )
}
