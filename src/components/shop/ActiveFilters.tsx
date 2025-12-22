'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { X } from 'lucide-react'

interface Category {
  id: string
  title: string
  slug: string
}

interface ActiveFiltersProps {
  categories: Category[]
  clearAllText?: string
  className?: string
}

export function ActiveFilters({
  categories,
  clearAllText = 'Sterge toate filtrele',
  className
}: ActiveFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const activeCategory = searchParams.get('categorie')
  const priceMin = searchParams.get('pret_min')
  const priceMax = searchParams.get('pret_max')
  const inStock = searchParams.get('in_stoc') === 'true'
  const searchQuery = searchParams.get('q')

  const categoryName = categories.find(c => c.slug === activeCategory)?.title

  const activeFilters: { key: string; label: string }[] = []

  if (activeCategory && categoryName) {
    activeFilters.push({ key: 'categorie', label: categoryName })
  }
  if (priceMin || priceMax) {
    const priceLabel = priceMin && priceMax
      ? `${priceMin} - ${priceMax} RON`
      : priceMin
        ? `Min: ${priceMin} RON`
        : `Max: ${priceMax} RON`
    activeFilters.push({ key: 'price', label: priceLabel })
  }
  if (inStock) {
    activeFilters.push({ key: 'in_stoc', label: 'In stoc' })
  }
  if (searchQuery) {
    activeFilters.push({ key: 'q', label: `"${searchQuery}"` })
  }

  if (activeFilters.length === 0) return null

  function removeFilter(key: string) {
    const params = new URLSearchParams(searchParams.toString())

    if (key === 'price') {
      params.delete('pret_min')
      params.delete('pret_max')
    } else {
      params.delete(key)
    }

    router.push(`${pathname}?${params.toString()}`)
  }

  function clearAll() {
    router.push(pathname)
  }

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-2">
        {activeFilters.map((filter) => (
          <button
            key={filter.key}
            onClick={() => removeFilter(filter.key)}
            className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-theme-light rounded-full text-theme-text hover:bg-theme-primary hover:text-theme-text-on-primary transition-colors"
          >
            {filter.label}
            <X className="w-3 h-3" />
          </button>
        ))}
        <button
          onClick={clearAll}
          className="text-sm text-theme-text-muted hover:text-theme-primary transition-colors underline"
        >
          {clearAllText}
        </button>
      </div>
    </div>
  )
}
