'use client'

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/utilities/cn'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

/**
 * Breadcrumbs Component
 *
 * Afișează navigare ierarhică pentru paginile de ecommerce.
 * Respectă sistemul de culori al temei (nu folosește culori hardcodate).
 */
export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center gap-1 text-sm', className)}
    >
      <Link
        href="/"
        className="flex items-center gap-1 text-theme-text-muted hover:text-theme-primary transition-colors min-h-[44px] px-1"
        aria-label="Acasă"
      >
        <Home className="w-4 h-4" />
        <span className="sr-only">Acasă</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1

        return (
          <div key={index} className="flex items-center gap-1">
            <ChevronRight className="w-4 h-4 text-theme-text-muted flex-shrink-0" aria-hidden="true" />

            {isLast || !item.href ? (
              <span
                className="text-theme-text font-medium"
                aria-current={isLast ? 'page' : undefined}
              >
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-theme-text-muted hover:text-theme-primary transition-colors min-h-[44px] flex items-center px-1"
              >
                {item.label}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}
