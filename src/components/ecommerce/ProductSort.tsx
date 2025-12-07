'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { ArrowUpDown } from 'lucide-react'
import { cn } from '@/utilities/cn'
import type { SortOption } from './sortUtils'

export type { SortOption }

interface ProductSortProps {
  className?: string
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Cele mai noi' },
  { value: 'price_asc', label: 'Preț: mic → mare' },
  { value: 'price_desc', label: 'Preț: mare → mic' },
  { value: 'name_asc', label: 'Nume: A - Z' },
  { value: 'name_desc', label: 'Nume: Z - A' },
]

/**
 * ProductSort Component
 *
 * Dropdown pentru sortarea produselor.
 * Folosește URL search params pentru a permite bookmarking și share.
 */
export function ProductSort({ className }: ProductSortProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentSort = (searchParams.get('sort') as SortOption) || 'newest'

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value === 'newest') {
      params.delete('sort')
    } else {
      params.set('sort', value)
    }

    // Reset to first page when sorting
    params.delete('page')

    const queryString = params.toString()
    router.push(`${pathname}${queryString ? `?${queryString}` : ''}`)
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <ArrowUpDown className="w-4 h-4 text-theme-text-muted" aria-hidden="true" />
      <label htmlFor="sort-select" className="text-sm text-theme-text-light hidden sm:inline">
        Sortează:
      </label>
      <select
        id="sort-select"
        value={currentSort}
        onChange={(e) => handleSortChange(e.target.value)}
        className="min-h-[44px] px-3 py-2 text-sm bg-theme-surface border border-theme-border rounded-[var(--radius-input)] text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-primary focus:border-transparent cursor-pointer"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
