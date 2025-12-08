# Plan Complet Implementare Shop - Model Payload Clean-Ecommerce

**Data:** 2025-12-07
**Versiune:** 2.0
**Status:** READY FOR IMPLEMENTATION

---

## OBIECTIV

Implementarea sistemului de shop exact ca template-ul oficial Payload Clean-Ecommerce, cu:
- Design configurabil din admin (via Global "Pagini Sistem")
- Pagina `/produse` cu filtre sidebar, sortare, cautare
- Eliminarea rutei `/categorii/[slug]` (categoriile devin filtre)
- Componente reutilizabile pentru filtrare

---

## ARHITECTURA TINTA

```
Rute Ecommerce:
├── /produse                    → Shop page (toate produsele + filtre)
├── /produse/[slug]             → Pagina produs individual (exista)
├── /cos                        → Pagina cos (exista, din CMS)
├── /checkout                   → Pagina checkout (exista, din CMS)
└── /cont                       → Zona cont utilizator (viitor)

Admin Panel - Globals:
├── Header
├── Footer
├── Site Theme
├── Logo
├── Business Info
├── Shop Settings (exista)
└── 🆕 System Pages (NOU) ← Configurare pagini hardcodate
```

---

## PARTEA 1: CLEANUP

### 1.1 Sterge ProductListing Block

**Fisiere de sters:**
```
src/blocks/ProductListing/config.ts
src/blocks/ProductListing/Component.tsx
```

**Fisiere de modificat:**

`src/blocks/index.ts` - Sterge:
```typescript
// Sterge linia:
import { ProductListingBlock } from './ProductListing/config'

// Sterge din array blocks:
ProductListingBlock,

// Sterge din export:
ProductListingBlock,
```

`src/blocks/RenderBlocks.tsx` - Sterge:
```typescript
// Sterge importurile:
import { ProductListingBlock } from './ProductListing/Component'
import { getSortParams, type SortOption } from '@/components/ecommerce/sortUtils'

// Sterge din RenderBlocksProps:
searchParams?: { [key: string]: string | string[] | undefined }

// Sterge interfata ProductListingParams (liniile 202-210)

// Sterge functia getProductsForListing (liniile 212-242)

// Sterge functia getCategoryById (liniile 244-258)

// Revenire la signatura originala:
export async function RenderBlocks({ blocks }: RenderBlocksProps) {
// (fara searchParams)
```

---

## PARTEA 2: GLOBAL "SYSTEM PAGES"

### 2.1 Creaza Global

**Fisier NOU:** `src/globals/SystemPages.ts`

```typescript
import type { GlobalConfig } from 'payload'

export const SystemPages: GlobalConfig = {
  slug: 'system-pages',
  label: 'Pagini Sistem',
  admin: {
    group: 'Setari',
    description: 'Configurare pagini sistem (produse, cos, checkout)',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // TAB 1: PAGINA PRODUSE
        {
          label: 'Produse',
          description: 'Setari pentru pagina /produse',
          fields: [
            {
              name: 'productsPage',
              type: 'group',
              fields: [
                // Header
                {
                  name: 'title',
                  type: 'text',
                  label: 'Titlu pagina',
                  defaultValue: 'Produsele Noastre',
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Descriere',
                  defaultValue: 'Descopera intreaga gama de produse',
                },
                // Display
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'productsPerPage',
                      type: 'number',
                      label: 'Produse per pagina',
                      defaultValue: 24,
                      min: 4,
                      max: 100,
                      admin: { width: '50%' },
                    },
                    {
                      name: 'gridColumns',
                      type: 'select',
                      label: 'Coloane grid (desktop)',
                      defaultValue: '4',
                      options: [
                        { label: '2 coloane', value: '2' },
                        { label: '3 coloane', value: '3' },
                        { label: '4 coloane', value: '4' },
                      ],
                      admin: { width: '50%' },
                    },
                  ],
                },
                // Sorting
                {
                  name: 'defaultSort',
                  type: 'select',
                  label: 'Sortare implicita',
                  defaultValue: 'newest',
                  options: [
                    { label: 'Cele mai noi', value: 'newest' },
                    { label: 'Pret: mic la mare', value: 'price_asc' },
                    { label: 'Pret: mare la mic', value: 'price_desc' },
                    { label: 'Nume: A-Z', value: 'name_asc' },
                    { label: 'Nume: Z-A', value: 'name_desc' },
                  ],
                },
                // Features
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'showFilters',
                      type: 'checkbox',
                      label: 'Afiseaza filtre',
                      defaultValue: true,
                      admin: { width: '33%' },
                    },
                    {
                      name: 'showSearch',
                      type: 'checkbox',
                      label: 'Afiseaza cautare',
                      defaultValue: true,
                      admin: { width: '33%' },
                    },
                    {
                      name: 'showSort',
                      type: 'checkbox',
                      label: 'Afiseaza sortare',
                      defaultValue: true,
                      admin: { width: '33%' },
                    },
                  ],
                },
                // Filter options
                {
                  name: 'filterOptions',
                  type: 'group',
                  label: 'Optiuni filtre',
                  admin: {
                    condition: (data, siblingData) => siblingData?.showFilters,
                  },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'showCategoryFilter',
                          type: 'checkbox',
                          label: 'Filtru categorii',
                          defaultValue: true,
                          admin: { width: '33%' },
                        },
                        {
                          name: 'showPriceFilter',
                          type: 'checkbox',
                          label: 'Filtru pret',
                          defaultValue: true,
                          admin: { width: '33%' },
                        },
                        {
                          name: 'showStockFilter',
                          type: 'checkbox',
                          label: 'Filtru stoc',
                          defaultValue: true,
                          admin: { width: '33%' },
                        },
                      ],
                    },
                  ],
                },
                // SEO
                {
                  name: 'seo',
                  type: 'group',
                  label: 'SEO',
                  fields: [
                    {
                      name: 'metaTitle',
                      type: 'text',
                      label: 'Meta Title',
                      defaultValue: 'Produse | {siteName}',
                      admin: {
                        description: 'Foloseste {siteName} pentru numele site-ului',
                      },
                    },
                    {
                      name: 'metaDescription',
                      type: 'textarea',
                      label: 'Meta Description',
                      defaultValue: 'Descopera toate produsele noastre. Livrare rapida, preturi competitive.',
                    },
                  ],
                },
              ],
            },
          ],
        },
        // TAB 2: LABELS/TEXTE
        {
          label: 'Texte',
          description: 'Texte si etichete pentru interfata',
          fields: [
            {
              name: 'labels',
              type: 'group',
              fields: [
                // Filters
                {
                  name: 'filtersTitle',
                  type: 'text',
                  label: 'Titlu sectiune filtre',
                  defaultValue: 'Filtre',
                },
                {
                  name: 'categoriesTitle',
                  type: 'text',
                  label: 'Titlu filtre categorii',
                  defaultValue: 'Categorii',
                },
                {
                  name: 'priceTitle',
                  type: 'text',
                  label: 'Titlu filtru pret',
                  defaultValue: 'Pret',
                },
                {
                  name: 'stockTitle',
                  type: 'text',
                  label: 'Titlu filtru stoc',
                  defaultValue: 'Disponibilitate',
                },
                {
                  name: 'inStockLabel',
                  type: 'text',
                  label: 'Label "In stoc"',
                  defaultValue: 'Doar produse in stoc',
                },
                // Sort
                {
                  name: 'sortLabel',
                  type: 'text',
                  label: 'Label sortare',
                  defaultValue: 'Sorteaza:',
                },
                // Results
                {
                  name: 'resultsText',
                  type: 'text',
                  label: 'Text rezultate',
                  defaultValue: 'Afisam {count} din {total} produse',
                  admin: {
                    description: 'Placeholders: {count}, {total}',
                  },
                },
                {
                  name: 'noResultsText',
                  type: 'text',
                  label: 'Text fara rezultate',
                  defaultValue: 'Nu am gasit produse care sa corespunda filtrelor.',
                },
                {
                  name: 'clearFiltersText',
                  type: 'text',
                  label: 'Text sterge filtre',
                  defaultValue: 'Sterge toate filtrele',
                },
                // Search
                {
                  name: 'searchPlaceholder',
                  type: 'text',
                  label: 'Placeholder cautare',
                  defaultValue: 'Cauta produse...',
                },
                // Mobile
                {
                  name: 'mobileFiltersButton',
                  type: 'text',
                  label: 'Buton filtre mobile',
                  defaultValue: 'Filtre',
                },
                {
                  name: 'mobileApplyFilters',
                  type: 'text',
                  label: 'Buton aplica filtre mobile',
                  defaultValue: 'Aplica filtre',
                },
              ],
            },
          ],
        },
        // TAB 3: PAGINA COS (pentru viitor)
        {
          label: 'Cos',
          description: 'Setari pentru pagina /cos',
          fields: [
            {
              name: 'cartPage',
              type: 'group',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Titlu pagina',
                  defaultValue: 'Cosul tau',
                },
                {
                  name: 'emptyCartMessage',
                  type: 'text',
                  label: 'Mesaj cos gol',
                  defaultValue: 'Cosul tau este gol.',
                },
                {
                  name: 'continueShoppingText',
                  type: 'text',
                  label: 'Text continua cumparaturile',
                  defaultValue: 'Continua cumparaturile',
                },
                {
                  name: 'continueShoppingLink',
                  type: 'text',
                  label: 'Link continua cumparaturile',
                  defaultValue: '/produse',
                },
              ],
            },
          ],
        },
        // TAB 4: PAGINA CHECKOUT (pentru viitor)
        {
          label: 'Checkout',
          description: 'Setari pentru pagina /checkout',
          fields: [
            {
              name: 'checkoutPage',
              type: 'group',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Titlu pagina',
                  defaultValue: 'Finalizare comanda',
                },
                {
                  name: 'successMessage',
                  type: 'textarea',
                  label: 'Mesaj succes',
                  defaultValue: 'Multumim pentru comanda! Vei primi un email de confirmare.',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
```

### 2.2 Inregistreaza Global

**Fisier:** `src/globals/index.ts` - Adauga:
```typescript
export { SystemPages } from './SystemPages'
```

**Fisier:** `src/payload.config.ts` - Modifica:
```typescript
import { SystemPages } from './globals/SystemPages'

// In config:
globals: [Header, Footer, SiteTheme, Logo, BusinessInfo, ShopSettings, SystemPages],
```

### 2.3 Regenereaza Tipuri
```bash
pnpm payload generate:types
```

---

## PARTEA 3: COMPONENTE SHOP

### 3.1 Structura Folder

```
src/components/shop/
├── index.ts                    # Barrel exports
├── ShopSearch.tsx              # Search bar
├── ShopFilters.tsx             # Sidebar wrapper
├── CategoryFilter.tsx          # Category checkboxes
├── PriceFilter.tsx             # Price range inputs
├── StockFilter.tsx             # In-stock checkbox
├── ActiveFilters.tsx           # Active filter tags
├── MobileFilters.tsx           # Mobile drawer
└── constants.ts                # Sorting options
```

### 3.2 Fisier: `src/components/shop/constants.ts`

```typescript
export type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc'

export interface SortFilterItem {
  value: SortOption
  label: string
  sort: string // Payload sort field
}

export const sortingOptions: SortFilterItem[] = [
  { value: 'newest', label: 'Cele mai noi', sort: '-createdAt' },
  { value: 'price_asc', label: 'Pret: mic la mare', sort: 'priceInRON' },
  { value: 'price_desc', label: 'Pret: mare la mic', sort: '-priceInRON' },
  { value: 'name_asc', label: 'Nume: A-Z', sort: 'title' },
  { value: 'name_desc', label: 'Nume: Z-A', sort: '-title' },
]

export function getSortField(sortOption: SortOption | null): string {
  const option = sortingOptions.find(o => o.value === sortOption)
  return option?.sort || '-createdAt'
}
```

### 3.3 Fisier: `src/components/shop/ShopSearch.tsx`

```typescript
'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { SearchIcon } from 'lucide-react'
import { cn } from '@/utilities/cn'

interface ShopSearchProps {
  placeholder?: string
  className?: string
}

export function ShopSearch({
  placeholder = 'Cauta produse...',
  className
}: ShopSearchProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const query = formData.get('q') as string

    const params = new URLSearchParams(searchParams.toString())

    if (query) {
      params.set('q', query)
    } else {
      params.delete('q')
    }

    // Reset to first page when searching
    params.delete('page')

    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('relative w-full', className)}
    >
      <input
        type="text"
        name="q"
        defaultValue={searchParams.get('q') || ''}
        placeholder={placeholder}
        className="w-full px-4 py-3 pr-12 rounded-lg border border-theme-border bg-theme-surface text-theme-text placeholder:text-theme-text-muted focus:outline-none focus:ring-2 focus:ring-theme-primary"
        autoComplete="off"
      />
      <button
        type="submit"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-theme-text-muted hover:text-theme-primary transition-colors"
      >
        <SearchIcon className="w-5 h-5" />
      </button>
    </form>
  )
}
```

### 3.4 Fisier: `src/components/shop/CategoryFilter.tsx`

```typescript
'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { cn } from '@/utilities/cn'

interface Category {
  id: string
  title: string
  slug: string
}

interface CategoryFilterProps {
  categories: Category[]
  title?: string
  className?: string
}

export function CategoryFilter({
  categories,
  title = 'Categorii',
  className
}: CategoryFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const activeCategory = searchParams.get('categorie')

  function handleCategoryClick(categorySlug: string) {
    const params = new URLSearchParams(searchParams.toString())

    if (activeCategory === categorySlug) {
      // Deselect
      params.delete('categorie')
    } else {
      params.set('categorie', categorySlug)
    }

    // Reset pagination
    params.delete('page')

    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className={className}>
      <h3 className="text-sm font-medium text-theme-text mb-3">{title}</h3>
      <ul className="space-y-2">
        {categories.map((category) => {
          const isActive = activeCategory === category.slug
          return (
            <li key={category.id}>
              <button
                onClick={() => handleCategoryClick(category.slug)}
                className={cn(
                  'text-sm transition-colors hover:text-theme-primary',
                  isActive
                    ? 'text-theme-primary font-medium underline underline-offset-4'
                    : 'text-theme-text-light'
                )}
              >
                {category.title}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
```

### 3.5 Fisier: `src/components/shop/PriceFilter.tsx`

```typescript
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
  currency = 'RON',
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
        className="mt-2 w-full py-2 text-sm bg-theme-primary text-white rounded hover:bg-theme-primary/90 transition-colors"
      >
        Aplica
      </button>
    </div>
  )
}
```

### 3.6 Fisier: `src/components/shop/StockFilter.tsx`

```typescript
'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'

interface StockFilterProps {
  label?: string
  className?: string
}

export function StockFilter({
  label = 'Doar produse in stoc',
  className
}: StockFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const inStock = searchParams.get('in_stoc') === 'true'

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const params = new URLSearchParams(searchParams.toString())

    if (e.target.checked) {
      params.set('in_stoc', 'true')
    } else {
      params.delete('in_stoc')
    }

    params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className={className}>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={inStock}
          onChange={handleChange}
          className="w-4 h-4 rounded border-theme-border text-theme-primary focus:ring-theme-primary"
        />
        <span className="text-sm text-theme-text">{label}</span>
      </label>
    </div>
  )
}
```

### 3.7 Fisier: `src/components/shop/ActiveFilters.tsx`

```typescript
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
            className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-theme-light rounded-full text-theme-text hover:bg-theme-primary hover:text-white transition-colors"
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
```

### 3.8 Fisier: `src/components/shop/ShopFilters.tsx`

```typescript
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
```

### 3.9 Fisier: `src/components/shop/MobileFilters.tsx`

```typescript
'use client'

import { useState } from 'react'
import { Filter, X } from 'lucide-react'
import { ShopFilters } from './ShopFilters'

interface Category {
  id: string
  title: string
  slug: string
}

interface MobileFiltersProps {
  categories: Category[]
  labels?: any
  filterOptions?: any
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
```

### 3.10 Fisier: `src/components/shop/index.ts`

```typescript
export { ShopSearch } from './ShopSearch'
export { ShopFilters } from './ShopFilters'
export { CategoryFilter } from './CategoryFilter'
export { PriceFilter } from './PriceFilter'
export { StockFilter } from './StockFilter'
export { ActiveFilters } from './ActiveFilters'
export { MobileFilters } from './MobileFilters'
export { sortingOptions, getSortField, type SortOption } from './constants'
```

---

## PARTEA 4: PAGINA /PRODUSE

### 4.1 Fisier: `src/app/(frontend)/produse/page.tsx`

```typescript
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Suspense } from 'react'
import type { Metadata } from 'next'

import { Breadcrumbs } from '@/components/ecommerce/Breadcrumbs'
import { ProductCard } from '@/components/ecommerce/ProductCard'
import { ProductSort } from '@/components/ecommerce/ProductSort'
import { ShopSearch, ShopFilters, ActiveFilters, MobileFilters, getSortField } from '@/components/shop'
import type { SortOption } from '@/components/shop'

export const revalidate = 60

interface SearchParams {
  q?: string
  categorie?: string
  sort?: SortOption
  pret_min?: string
  pret_max?: string
  in_stoc?: string
  page?: string
}

interface PageProps {
  searchParams: Promise<SearchParams>
}

export default async function ShopPage({ searchParams }: PageProps) {
  const params = await searchParams
  const payload = await getPayload({ config: configPromise })

  // Fetch system pages config
  const systemPages = await payload.findGlobal({ slug: 'system-pages' }).catch(() => null)
  const config = systemPages?.productsPage || {}
  const labels = systemPages?.labels || {}

  // Fetch categories for filter
  const categoriesResult = await payload.find({
    collection: 'product-categories',
    sort: 'title',
    limit: 100,
  })
  const categories = categoriesResult.docs.map(cat => ({
    id: cat.id,
    title: cat.title,
    slug: cat.slug,
  }))

  // Build product query
  const whereConditions: any[] = []

  // Search query
  if (params.q) {
    whereConditions.push({
      or: [
        { title: { like: params.q } },
        { 'description': { like: params.q } },
      ],
    })
  }

  // Category filter
  if (params.categorie) {
    const category = categories.find(c => c.slug === params.categorie)
    if (category) {
      whereConditions.push({ category: { equals: category.id } })
    }
  }

  // Price filter
  if (params.pret_min) {
    whereConditions.push({ priceInRON: { greater_than_equal: Number(params.pret_min) } })
  }
  if (params.pret_max) {
    whereConditions.push({ priceInRON: { less_than_equal: Number(params.pret_max) } })
  }

  // Stock filter
  if (params.in_stoc === 'true') {
    whereConditions.push({ inventory: { greater_than: 0 } })
  }

  // Sorting
  const sortField = getSortField(params.sort || (config.defaultSort as SortOption) || 'newest')

  // Fetch products
  const products = await payload.find({
    collection: 'products',
    where: whereConditions.length > 0 ? { and: whereConditions } : {},
    sort: sortField,
    limit: config.productsPerPage || 24,
    depth: 2,
  })

  // Prepare product data
  const productCards = products.docs.map((product) => {
    const firstImage = product.images?.[0]?.image
    const imageUrl = firstImage && typeof firstImage !== 'string' ? firstImage.url : null
    const secondImage = product.images?.[1]?.image
    const secondaryImageUrl = secondImage && typeof secondImage !== 'string' ? secondImage.url : null

    const tags = Array.isArray(product.tags)
      ? product.tags
          .filter((tag): tag is { id: string; name: string; color?: string | null } =>
            typeof tag === 'object' && tag !== null
          )
          .map((tag) => ({
            id: tag.id,
            name: tag.name,
            color: tag.color,
          }))
      : []

    return {
      id: product.id,
      slug: product.slug,
      title: product.title,
      priceInRON: product.priceInRON ?? 0,
      imageUrl,
      secondaryImageUrl,
      badge: product.badge ?? null,
      tags,
      stock: product.inventory ?? 0,
      brand: (product as any).brand ?? null,
    }
  })

  // Grid columns class
  const gridCols = config.gridColumns || '4'
  const gridClass = {
    '2': 'grid-cols-1 sm:grid-cols-2',
    '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  }[gridCols] || 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'

  // Results text
  const resultsText = (labels.resultsText || 'Afisam {count} din {total} produse')
    .replace('{count}', String(products.docs.length))
    .replace('{total}', String(products.totalDocs))

  return (
    <main className="min-h-screen bg-theme-surface">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-4">
        <Breadcrumbs items={[{ label: config.title || 'Produse' }]} />
      </div>

      {/* Header */}
      <div className="bg-theme-light py-12 mb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-theme-text mb-2">
            {config.title || 'Produsele Noastre'}
          </h1>
          {config.description && (
            <p className="text-lg text-theme-text-light max-w-2xl">
              {config.description}
            </p>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16">
        {/* Search */}
        {config.showSearch !== false && (
          <div className="mb-8">
            <ShopSearch placeholder={labels.searchPlaceholder || 'Cauta produse...'} />
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          {config.showFilters !== false && (
            <div className="hidden lg:block w-64 flex-shrink-0">
              <ShopFilters
                categories={categories}
                labels={labels}
                filterOptions={config.filterOptions}
              />
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            {/* Active Filters */}
            <ActiveFilters
              categories={categories}
              clearAllText={labels.clearFiltersText}
              className="mb-4"
            />

            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-theme-border">
              <div className="flex items-center gap-4">
                {/* Mobile Filters Button */}
                {config.showFilters !== false && (
                  <MobileFilters
                    categories={categories}
                    labels={labels}
                    filterOptions={config.filterOptions}
                    buttonText={labels.mobileFiltersButton}
                    applyText={labels.mobileApplyFilters}
                  />
                )}
                <p className="text-sm text-theme-text-light">{resultsText}</p>
              </div>

              {config.showSort !== false && (
                <Suspense fallback={<div className="h-11 w-48 bg-theme-light rounded animate-pulse" />}>
                  <ProductSort />
                </Suspense>
              )}
            </div>

            {/* Products Grid */}
            {productCards.length > 0 ? (
              <div className={`grid gap-4 md:gap-6 ${gridClass}`}>
                {productCards.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    showQuickView={false}
                    showWishlist={false}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 bg-theme-light rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-theme-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <p className="text-theme-text mb-2">{labels.noResultsText || 'Nu am gasit produse.'}</p>
                <p className="text-sm text-theme-text-muted">
                  Incercati sa modificati filtrele sau cautarea.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayload({ config: configPromise })
  const systemPages = await payload.findGlobal({ slug: 'system-pages' }).catch(() => null)
  const businessInfo = await payload.findGlobal({ slug: 'business-info' }).catch(() => null)

  const config = systemPages?.productsPage || {}
  const siteName = businessInfo?.name || 'Magazin'

  const metaTitle = (config.seo?.metaTitle || 'Produse | {siteName}')
    .replace('{siteName}', siteName)

  return {
    title: metaTitle,
    description: config.seo?.metaDescription || config.description || `Produse disponibile la ${siteName}`,
  }
}
```

### 4.2 Fisier: `src/app/(frontend)/produse/loading.tsx`

```typescript
export default function Loading() {
  return (
    <div className="min-h-screen bg-theme-surface">
      <div className="container mx-auto px-4 py-4">
        <div className="h-6 w-24 bg-theme-light rounded animate-pulse" />
      </div>

      <div className="bg-theme-light py-12 mb-8">
        <div className="container mx-auto px-4">
          <div className="h-10 w-64 bg-white/50 rounded animate-pulse mb-2" />
          <div className="h-6 w-96 bg-white/50 rounded animate-pulse" />
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/5] bg-theme-light rounded-lg mb-3" />
              <div className="h-4 w-3/4 bg-theme-light rounded mb-2" />
              <div className="h-5 w-1/2 bg-theme-light rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

---

## PARTEA 5: CLEANUP & UPDATE

### 5.1 Sterge Ruta Categorii

**Sterge folder:** `src/app/(frontend)/categorii/[slug]/`

**Pastreaza (optional):** `src/app/(frontend)/categorii/page.tsx` - poate ramane ca pagina index cu toate categoriile

### 5.2 Update Seeder

**Fisier:** `src/seed/businesses/magazin.ts`

**Sterge crearea paginii /produse din CMS (liniile ~479-502):**
```typescript
// STERGE ACEST BLOC:
// Products page
await payload.create({
  collection: 'pages',
  data: {
    title: 'Produse',
    slug: 'produse',
    // ...
  },
})
```

**Update navigatia (daca e cazul):**
- Link-urile la `/categorii/X` devin `/produse?categorie=X`

### 5.3 Update Footer Links

**Fisier:** `src/seed/businesses/magazin.ts` - sectiunea footer columns

```typescript
// DE LA:
links: [
  { label: 'Cosmetice Naturale', type: 'custom', url: '/categorii/cosmetice-naturale' },
  // ...
]

// LA:
links: [
  { label: 'Cosmetice Naturale', type: 'custom', url: '/produse?categorie=cosmetice-naturale' },
  // ...
]
```

### 5.4 Adauga Seed pentru SystemPages

**Fisier:** `src/seed/helpers.ts` - Adauga functie noua:

```typescript
export async function seedSystemPages(payload: Payload) {
  console.log('   Setting up system pages config...')

  await payload.updateGlobal({
    slug: 'system-pages',
    data: {
      productsPage: {
        title: 'Produsele Noastre',
        description: 'Descopera intreaga gama de produse naturale si eco-friendly',
        productsPerPage: 24,
        gridColumns: '4',
        defaultSort: 'newest',
        showFilters: true,
        showSearch: true,
        showSort: true,
        filterOptions: {
          showCategoryFilter: true,
          showPriceFilter: true,
          showStockFilter: true,
        },
        seo: {
          metaTitle: 'Produse | {siteName}',
          metaDescription: 'Descopera toate produsele naturale si eco-friendly. Livrare rapida in toata tara.',
        },
      },
      labels: {
        filtersTitle: 'Filtre',
        categoriesTitle: 'Categorii',
        priceTitle: 'Pret',
        stockTitle: 'Disponibilitate',
        inStockLabel: 'Doar produse in stoc',
        sortLabel: 'Sorteaza:',
        resultsText: 'Afisam {count} din {total} produse',
        noResultsText: 'Nu am gasit produse care sa corespunda cautarii.',
        clearFiltersText: 'Sterge filtrele',
        searchPlaceholder: 'Cauta produse...',
        mobileFiltersButton: 'Filtre',
        mobileApplyFilters: 'Aplica filtre',
      },
      cartPage: {
        title: 'Cosul tau',
        emptyCartMessage: 'Cosul tau este gol.',
        continueShoppingText: 'Continua cumparaturile',
        continueShoppingLink: '/produse',
      },
      checkoutPage: {
        title: 'Finalizare comanda',
        successMessage: 'Multumim pentru comanda! Vei primi un email de confirmare.',
      },
    },
  })
}
```

**Fisier:** `src/seed/businesses/magazin.ts` - Apeleaza functia:

```typescript
import { seedSystemPages } from '../helpers'

// In seedMagazin(), dupa seedShopSettings:
await seedSystemPages(payload)
```

---

## PARTEA 6: CHECKLIST FINAL

### Pre-implementare:
- [ ] Backup proiect (git commit)
- [ ] Verifica ca dev server e oprit

### Implementare:
- [ ] 1. Cleanup ProductListing block
- [ ] 2. Creaza `SystemPages` global
- [ ] 3. Inregistreaza in payload.config.ts
- [ ] 4. Regenereaza tipuri (`pnpm payload generate:types`)
- [ ] 5. Creaza componente shop (`src/components/shop/`)
- [ ] 6. Creaza `src/app/(frontend)/produse/page.tsx`
- [ ] 7. Creaza `src/app/(frontend)/produse/loading.tsx`
- [ ] 8. Sterge `src/app/(frontend)/categorii/[slug]/`
- [ ] 9. Update seeder (`magazin.ts`, `helpers.ts`)
- [ ] 10. Reseed database (`pnpm seed`)

### Testare:
- [ ] Pagina /produse se incarca
- [ ] Filtrare pe categorii functioneaza
- [ ] Filtrare pe pret functioneaza
- [ ] Filtrare in stoc functioneaza
- [ ] Cautare functioneaza
- [ ] Sortare functioneaza
- [ ] URL params sunt corecte (bookmarkable)
- [ ] Mobile filters drawer functioneaza
- [ ] Admin poate edita setarile in SystemPages
- [ ] SEO meta tags sunt corecte

---

## ESTIMARE TIMP

| Pas | Timp estimat |
|-----|-------------|
| Cleanup | 10 min |
| SystemPages Global | 20 min |
| Componente Shop | 40 min |
| Pagina /produse | 30 min |
| Update seeder | 15 min |
| Testare | 20 min |
| **TOTAL** | **~2.5 ore** |

---

## NOTE PENTRU CLAUDE

1. **Citeste acest document complet** inainte de a incepe
2. **Urmeaza ordinea** din CHECKLIST FINAL
3. **Nu sari pasi** - fiecare pas depinde de cel anterior
4. **Testeaza dupa fiecare parte majora**
5. **Regenereaza tipuri** dupa modificari la globals/collections
6. **Reseed** la final pentru a popula SystemPages cu valori default
