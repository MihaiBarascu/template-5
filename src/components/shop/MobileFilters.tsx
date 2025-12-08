'use client'

import { useState } from 'react'
import { Filter, X } from 'lucide-react'
import { ShopFilters } from './ShopFilters'

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

interface MobileFiltersProps {
  categories: Category[]
  labels?: Labels | null
  filterOptions?: FilterOptions | null
  buttonText?: string
  applyText?: string
}

export function MobileFilters({
  categories,
  labels,
  filterOptions,
  buttonText = 'Filtre',
  applyText = 'Aplica filtre'
}: MobileFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden flex items-center gap-2 px-4 py-2 border border-theme-border rounded-lg text-sm"
      >
        <Filter className="w-4 h-4" />
        {buttonText}
      </button>

      {/* Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="absolute right-0 top-0 h-full w-80 max-w-full bg-theme-surface shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-theme-border">
              <h2 className="font-medium">{buttonText}</h2>
              <button onClick={() => setIsOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto h-[calc(100%-120px)]">
              <ShopFilters
                categories={categories}
                labels={labels}
                filterOptions={filterOptions}
              />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-theme-border bg-theme-surface">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-3 bg-theme-primary text-white rounded-lg font-medium"
              >
                {applyText}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
