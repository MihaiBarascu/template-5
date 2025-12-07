'use client'

/**
 * Close Cart Button - Based on official Payload ecommerce template
 * Styling adapted to use theme system
 */

import { cn } from '@/utilities/cn'
import React from 'react'

export function CloseCart({ className }: { className?: string }) {
  return (
    <div className="relative flex h-11 w-11 items-center justify-center rounded-md border border-theme-border text-theme-text transition-colors hover:border-theme-primary hover:text-theme-primary">
      <svg className={cn('h-6 transition-all ease-in-out hover:scale-110', className)} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>
  )
}
