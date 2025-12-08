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
