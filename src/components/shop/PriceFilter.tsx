'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

interface PriceFilterProps {
  title?: string
  currency?: string
  className?: string
}

export function PriceFilter({
  title = 'Pret',
  className
}: PriceFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [minPrice, setMinPrice] = useState(searchParams.get('pret_min') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('pret_max') || '')

  // Sync state with URL
  useEffect(() => {
    setMinPrice(searchParams.get('pret_min') || '')
    setMaxPrice(searchParams.get('pret_max') || '')
  }, [searchParams])

  function applyPriceFilter() {
    const params = new URLSearchParams(searchParams.toString())

    if (minPrice) {
      params.set('pret_min', minPrice)
    } else {
      params.delete('pret_min')
    }

    if (maxPrice) {
      params.set('pret_max', maxPrice)
    } else {
      params.delete('pret_max')
    }

    params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className={className}>
      <h3 className="text-sm font-medium text-theme-text mb-3">{title}</h3>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          placeholder="Min"
          className="w-full px-3 py-2 text-sm border border-theme-border rounded bg-theme-surface"
          min="0"
        />
        <span className="text-theme-text-muted">-</span>
        <input
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          placeholder="Max"
          className="w-full px-3 py-2 text-sm border border-theme-border rounded bg-theme-surface"
          min="0"
        />
      </div>
      <button
        onClick={applyPriceFilter}
        className="mt-2 w-full py-2 text-sm bg-theme-primary text-theme-text-on-primary rounded hover:bg-theme-primary/90 transition-colors"
      >
        Aplica
      </button>
    </div>
  )
}
