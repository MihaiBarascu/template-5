'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useState, useCallback } from 'react'
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/utilities/cn'

interface FilterSection {
  id: string
  label: string
  type: 'checkbox' | 'range' | 'radio'
  options?: { value: string; label: string; count?: number }[]
  min?: number
  max?: number
}

interface ProductFiltersProps {
  filters: FilterSection[]
  className?: string
  onMobileClose?: () => void
  isMobile?: boolean
}

/**
 * ProductFilters Component
 *
 * Sidebar cu filtre pentru produse:
 * - Checkbox-uri pentru categorii, brand-uri, tag-uri
 * - Range pentru preț
 * - Disponibilitate stoc
 *
 * Folosește URL search params pentru state management.
 */
export function ProductFilters({
  filters,
  className,
  onMobileClose,
  isMobile = false,
}: ProductFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(filters.map((f) => f.id))
  )

  const toggleSection = useCallback((id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const updateFilters = useCallback(
    (key: string, value: string | null, isMulti = false) => {
      const params = new URLSearchParams(searchParams.toString())

      if (isMulti) {
        const currentValues = params.get(key)?.split(',').filter(Boolean) || []

        if (value && currentValues.includes(value)) {
          // Remove value
          const newValues = currentValues.filter((v) => v !== value)
          if (newValues.length > 0) {
            params.set(key, newValues.join(','))
          } else {
            params.delete(key)
          }
        } else if (value) {
          // Add value
          currentValues.push(value)
          params.set(key, currentValues.join(','))
        }
      } else {
        if (value) {
          params.set(key, value)
        } else {
          params.delete(key)
        }
      }

      // Reset to first page when filtering
      params.delete('page')

      const queryString = params.toString()
      router.push(`${pathname}${queryString ? `?${queryString}` : ''}`)
    },
    [router, pathname, searchParams]
  )

  const clearAllFilters = useCallback(() => {
    router.push(pathname)
    if (onMobileClose) onMobileClose()
  }, [router, pathname, onMobileClose])

  const hasActiveFilters = Array.from(searchParams.keys()).some(
    (key) => !['sort', 'page'].includes(key)
  )

  const getActiveValues = (key: string): string[] => {
    return searchParams.get(key)?.split(',').filter(Boolean) || []
  }

  return (
    <aside
      className={cn(
        'bg-theme-surface',
        isMobile ? 'fixed inset-0 z-50 p-6 overflow-y-auto' : 'sticky top-4',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-theme-text" />
          <h2 className="font-semibold text-theme-text text-lg">Filtre</h2>
        </div>

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-sm text-theme-text-muted hover:text-theme-primary transition-colors min-h-[44px] px-3"
            >
              Șterge filtrele
            </button>
          )}
          {isMobile && onMobileClose && (
            <button
              type="button"
              onClick={onMobileClose}
              className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Închide filtrele"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Sections */}
      <div className="space-y-4">
        {filters.map((filter) => {
          const isExpanded = expandedSections.has(filter.id)
          const activeValues = getActiveValues(filter.id)

          return (
            <div
              key={filter.id}
              className="border-b border-theme-border pb-4 last:border-b-0"
            >
              {/* Section Header */}
              <button
                type="button"
                onClick={() => toggleSection(filter.id)}
                className="flex items-center justify-between w-full py-2 text-left min-h-[44px]"
              >
                <span className="font-medium text-theme-text">
                  {filter.label}
                  {activeValues.length > 0 && (
                    <span className="ml-2 text-xs bg-theme-primary text-white px-2 py-0.5 rounded-full">
                      {activeValues.length}
                    </span>
                  )}
                </span>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-theme-text-muted" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-theme-text-muted" />
                )}
              </button>

              {/* Section Content */}
              {isExpanded && (
                <div className="mt-2 space-y-2">
                  {filter.type === 'checkbox' && filter.options && (
                    <div className="space-y-1">
                      {filter.options.map((option) => {
                        const isChecked = activeValues.includes(option.value)
                        return (
                          <label
                            key={option.value}
                            className="flex items-center gap-3 cursor-pointer py-1.5 min-h-[44px]"
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() =>
                                updateFilters(filter.id, option.value, true)
                              }
                              className="w-5 h-5 rounded border-theme-border text-theme-primary focus:ring-theme-primary"
                            />
                            <span className="text-sm text-theme-text flex-1">
                              {option.label}
                            </span>
                            {option.count !== undefined && (
                              <span className="text-xs text-theme-text-muted">
                                ({option.count})
                              </span>
                            )}
                          </label>
                        )
                      })}
                    </div>
                  )}

                  {filter.type === 'range' && (
                    <PriceRangeFilter
                      filterId={filter.id}
                      min={filter.min || 0}
                      max={filter.max || 10000}
                      currentMin={Number(searchParams.get(`${filter.id}_min`)) || filter.min || 0}
                      currentMax={Number(searchParams.get(`${filter.id}_max`)) || filter.max || 10000}
                      onRangeChange={(min, max) => {
                        const params = new URLSearchParams(searchParams.toString())

                        if (min > (filter.min || 0)) {
                          params.set(`${filter.id}_min`, min.toString())
                        } else {
                          params.delete(`${filter.id}_min`)
                        }

                        if (max < (filter.max || 10000)) {
                          params.set(`${filter.id}_max`, max.toString())
                        } else {
                          params.delete(`${filter.id}_max`)
                        }

                        params.delete('page')
                        const queryString = params.toString()
                        router.push(`${pathname}${queryString ? `?${queryString}` : ''}`)
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Apply Button (Mobile) */}
      {isMobile && onMobileClose && (
        <div className="mt-6 pt-4 border-t border-theme-border">
          <button
            type="button"
            onClick={onMobileClose}
            className="w-full py-3 bg-theme-primary text-white font-medium rounded-[var(--radius-button)] hover:bg-theme-primary-dark transition-colors min-h-[44px]"
          >
            Aplică filtrele
          </button>
        </div>
      )}
    </aside>
  )
}

/**
 * Price Range Filter Sub-component
 */
interface PriceRangeFilterProps {
  filterId: string
  min: number
  max: number
  currentMin: number
  currentMax: number
  onRangeChange: (min: number, max: number) => void
}

function PriceRangeFilter({
  min,
  max,
  currentMin,
  currentMax,
  onRangeChange,
}: PriceRangeFilterProps) {
  const [localMin, setLocalMin] = useState(currentMin)
  const [localMax, setLocalMax] = useState(currentMax)

  const handleApply = () => {
    onRangeChange(localMin, localMax)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <label className="text-xs text-theme-text-muted mb-1 block">Min</label>
          <input
            type="number"
            min={min}
            max={max}
            value={localMin}
            onChange={(e) => setLocalMin(Number(e.target.value))}
            className="w-full px-3 py-2 text-sm border border-theme-border rounded-[var(--radius-input)] focus:outline-none focus:ring-2 focus:ring-theme-primary"
          />
        </div>
        <span className="text-theme-text-muted pt-4">-</span>
        <div className="flex-1">
          <label className="text-xs text-theme-text-muted mb-1 block">Max</label>
          <input
            type="number"
            min={min}
            max={max}
            value={localMax}
            onChange={(e) => setLocalMax(Number(e.target.value))}
            className="w-full px-3 py-2 text-sm border border-theme-border rounded-[var(--radius-input)] focus:outline-none focus:ring-2 focus:ring-theme-primary"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleApply}
        className="w-full py-2 text-sm border border-theme-primary text-theme-primary rounded-[var(--radius-button)] hover:bg-theme-primary hover:text-white transition-colors min-h-[44px]"
      >
        Aplică
      </button>

      <div className="text-xs text-theme-text-muted text-center">
        {localMin} RON - {localMax} RON
      </div>
    </div>
  )
}

/**
 * Mobile Filter Button Component
 */
interface MobileFilterButtonProps {
  onClick: () => void
  activeCount?: number
  className?: string
}

export function MobileFilterButton({
  onClick,
  activeCount = 0,
  className,
}: MobileFilterButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-4 py-2 border border-theme-border rounded-[var(--radius-button)] text-theme-text hover:bg-theme-light transition-colors min-h-[44px]',
        className
      )}
    >
      <Filter className="w-4 h-4" />
      <span className="text-sm font-medium">Filtre</span>
      {activeCount > 0 && (
        <span className="bg-theme-primary text-white text-xs px-2 py-0.5 rounded-full">
          {activeCount}
        </span>
      )}
    </button>
  )
}
