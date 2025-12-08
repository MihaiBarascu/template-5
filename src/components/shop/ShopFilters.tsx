import { Suspense } from 'react'
import { CategoryFilter } from './CategoryFilter'
import { PriceFilter } from './PriceFilter'
import { StockFilter } from './StockFilter'

interface Category {
  id: string
  title: string
  slug: string
}

interface Labels {
  categoriesTitle?: string | null
  priceTitle?: string | null
  inStockLabel?: string | null
}

interface FilterOptions {
  showCategoryFilter?: boolean | null
  showPriceFilter?: boolean | null
  showStockFilter?: boolean | null
}

interface ShopFiltersProps {
  categories: Category[]
  labels?: Labels | null
  filterOptions?: FilterOptions | null
  className?: string
}

export function ShopFilters({
  categories,
  labels,
  filterOptions,
  className
}: ShopFiltersProps) {
  const showCategories = filterOptions?.showCategoryFilter !== false
  const showPrice = filterOptions?.showPriceFilter !== false
  const showStock = filterOptions?.showStockFilter !== false

  return (
    <aside className={className}>
      <div className="space-y-6">
        {showCategories && categories.length > 0 && (
          <Suspense fallback={<div className="animate-pulse h-32 bg-theme-light rounded" />}>
            <CategoryFilter
              categories={categories}
              title={labels?.categoriesTitle || 'Categorii'}
            />
          </Suspense>
        )}

        {showPrice && (
          <Suspense fallback={<div className="animate-pulse h-24 bg-theme-light rounded" />}>
            <PriceFilter title={labels?.priceTitle || 'Pret'} />
          </Suspense>
        )}

        {showStock && (
          <Suspense fallback={<div className="animate-pulse h-8 bg-theme-light rounded" />}>
            <StockFilter label={labels?.inStockLabel || 'Doar produse in stoc'} />
          </Suspense>
        )}
      </div>
    </aside>
  )
}
