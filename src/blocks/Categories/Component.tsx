'use client'

import React from 'react'
import Link from 'next/link'
import { cn } from '@/utilities/cn'

interface Category {
  id: string
  title: string
  slug: string
  description?: string
  productCount?: number
}

interface CategoriesBlockProps {
  variant?: 'grid' | 'list' | 'cards'
  heading?: string
  subheading?: string
  showDescription?: boolean
  showProductCount?: boolean
  columns?: 2 | 3 | 4
  backgroundColor?: 'default' | 'light' | 'dark'
  categories: Category[]
}

export function CategoriesBlock({
  variant: _variant = 'grid',
  heading,
  subheading,
  showDescription = true,
  showProductCount = true,
  columns = 4,
  backgroundColor = 'default',
  categories,
}: CategoriesBlockProps) {
  const bgClasses = {
    default: 'bg-white',
    light: 'bg-gray-50',
    dark: 'bg-gray-900 text-white',
  }

  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  }

  if (!categories || categories.length === 0) {
    return null
  }

  return (
    <section className={cn('py-16', bgClasses[backgroundColor])}>
      <div className="container mx-auto px-4">
        {/* Header */}
        {(heading || subheading) && (
          <div className="text-center mb-12">
            {heading && (
              <h2 className={cn('text-3xl md:text-4xl font-bold mb-4', backgroundColor === 'dark' ? 'text-white' : 'text-gray-900')}>
                {heading}
              </h2>
            )}
            {subheading && (
              <p className={cn('text-lg max-w-2xl mx-auto', backgroundColor === 'dark' ? 'text-gray-300' : 'text-gray-600')}>
                {subheading}
              </p>
            )}
          </div>
        )}

        {/* Categories Grid */}
        <div className={cn('grid gap-6', gridCols[columns])}>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categorii/${category.slug}`}
              className={cn(
                'group block p-6 rounded-xl transition-all',
                backgroundColor === 'dark'
                  ? 'bg-gray-800 hover:bg-gray-700'
                  : 'bg-white border border-gray-200 hover:border-theme-primary hover:shadow-lg'
              )}
            >
              <h3 className={cn(
                'text-xl font-semibold mb-2 group-hover:text-theme-primary transition-colors',
                backgroundColor === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                {category.title}
              </h3>

              {showDescription && category.description && (
                <p className={cn(
                  'text-sm mb-3 line-clamp-2',
                  backgroundColor === 'dark' ? 'text-gray-400' : 'text-gray-600'
                )}>
                  {category.description}
                </p>
              )}

              {showProductCount && category.productCount !== undefined && (
                <span className={cn(
                  'text-sm font-medium',
                  backgroundColor === 'dark' ? 'text-gray-400' : 'text-gray-500'
                )}>
                  {category.productCount} {category.productCount === 1 ? 'produs' : 'produse'}
                </span>
              )}

              <div className={cn(
                'mt-4 flex items-center text-sm font-medium group-hover:text-theme-primary transition-colors',
                backgroundColor === 'dark' ? 'text-gray-300' : 'text-gray-700'
              )}>
                Vezi produsele
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategoriesBlock
