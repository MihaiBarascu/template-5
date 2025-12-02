'use client'

import React from 'react'
import Link from 'next/link'
import { cn } from '@/utilities/cn'

interface PricePackage {
  id: string
  title: string
  subtitle?: string | null
  description?: string | null
  price: number
  oldPrice?: number | null
  period?: string | null
  features?: Array<{ feature?: string | null; included?: boolean | null; id?: string | null }> | null
  highlighted?: boolean | null
  highlightLabel?: string | null
  cta?: {
    label?: string | null
    link?: string | null
  } | null
}

interface PricingBlockProps {
  variant?: string
  heading?: string
  subheading?: string
  source?: string
  columns?: string
  showBadge?: boolean
  backgroundColor?: string
  packages?: PricePackage[]
}

export function PricingBlock({
  variant = 'cards',
  heading,
  subheading,
  columns = '3',
  showBadge = true,
  backgroundColor = 'default',
  packages = [],
}: PricingBlockProps) {
  const bgClass = {
    default: 'bg-white',
    light: 'bg-gray-50',
    dark: 'bg-gray-900 text-white',
  }[backgroundColor] || 'bg-white'

  const getColumns = () => {
    switch (columns) {
      case '2':
        return 'md:grid-cols-2'
      case '4':
        return 'md:grid-cols-2 lg:grid-cols-4'
      default:
        return 'md:grid-cols-2 lg:grid-cols-3'
    }
  }

  if (packages.length === 0) {
    return (
      <section className={cn('py-16', bgClass)}>
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-500">Nu sunt pachete de preturi disponibile.</p>
        </div>
      </section>
    )
  }

  return (
    <section className={cn('py-16', bgClass)}>
      <div className="container mx-auto px-4">
        {(heading || subheading) && (
          <div className="text-center mb-12">
            {heading && (
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{heading}</h2>
            )}
            {subheading && (
              <p className={cn('text-lg max-w-2xl mx-auto', backgroundColor === 'dark' ? 'text-gray-300' : 'text-gray-600')}>
                {subheading}
              </p>
            )}
          </div>
        )}

        {variant === 'table' ? (
          <div className="overflow-x-auto">
            <table className={cn('w-full max-w-4xl mx-auto', backgroundColor === 'dark' ? 'text-white' : '')}>
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-4 px-6 text-left font-semibold">Pachet</th>
                  <th className="py-4 px-6 text-right font-semibold">Pret</th>
                </tr>
              </thead>
              <tbody>
                {packages.map((pkg, index) => (
                  <tr
                    key={pkg.id || index}
                    className={cn(
                      'border-b border-gray-100',
                      pkg.highlighted && 'bg-theme-primary/5'
                    )}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{pkg.title}</span>
                        {showBadge && pkg.highlighted && pkg.highlightLabel && (
                          <span className="text-xs bg-theme-primary text-white px-2 py-0.5 rounded-full">
                            {pkg.highlightLabel}
                          </span>
                        )}
                      </div>
                      {pkg.description && (
                        <p className={cn('text-sm mt-1', backgroundColor === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
                          {pkg.description}
                        </p>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      {pkg.oldPrice && (
                        <span className={cn('text-sm line-through mr-2', backgroundColor === 'dark' ? 'text-gray-500' : 'text-gray-400')}>
                          {pkg.oldPrice} RON
                        </span>
                      )}
                      <span className="text-xl font-bold">{pkg.price} RON</span>
                      {pkg.period && (
                        <span className={cn('text-sm', backgroundColor === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
                          /{pkg.period}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : variant === 'compact' ? (
          <div className="max-w-3xl mx-auto space-y-4">
            {packages.map((pkg, index) => (
              <div
                key={pkg.id || index}
                className={cn(
                  'flex items-center justify-between p-4 rounded-lg border',
                  pkg.highlighted
                    ? 'border-theme-primary bg-theme-primary/5'
                    : backgroundColor === 'dark'
                    ? 'border-gray-700 bg-gray-800'
                    : 'border-gray-200 bg-white'
                )}
              >
                <div className="flex items-center gap-3">
                  {showBadge && pkg.highlighted && pkg.highlightLabel && (
                    <span className="text-xs bg-theme-primary text-white px-2 py-0.5 rounded-full">
                      {pkg.highlightLabel}
                    </span>
                  )}
                  <div>
                    <h3 className="font-semibold">{pkg.title}</h3>
                    {pkg.subtitle && (
                      <p className={cn('text-xs', backgroundColor === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
                        {pkg.subtitle}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  {pkg.oldPrice && (
                    <span className={cn('text-sm line-through mr-2', backgroundColor === 'dark' ? 'text-gray-500' : 'text-gray-400')}>
                      {pkg.oldPrice}
                    </span>
                  )}
                  <span className="text-2xl font-bold">{pkg.price}</span>
                  <span className="text-lg"> RON</span>
                  {pkg.period && (
                    <span className={cn('text-sm block', backgroundColor === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
                      /{pkg.period}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Default: cards
          <div className={cn('grid gap-8', getColumns())}>
            {packages.map((pkg, index) => (
              <div
                key={pkg.id || index}
                className={cn(
                  'relative rounded-2xl p-6 transition-all',
                  pkg.highlighted
                    ? 'border-2 border-theme-primary shadow-xl scale-105 z-10'
                    : backgroundColor === 'dark'
                    ? 'border border-gray-700 bg-gray-800'
                    : 'border border-gray-200 bg-white shadow-md hover:shadow-lg'
                )}
              >
                {showBadge && pkg.highlighted && pkg.highlightLabel && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-theme-primary text-white text-sm font-medium px-4 py-1 rounded-full">
                      {pkg.highlightLabel}
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-1">{pkg.title}</h3>
                  {pkg.subtitle && (
                    <p className={cn('text-xs mb-2', backgroundColor === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
                      {pkg.subtitle}
                    </p>
                  )}
                  {pkg.description && (
                    <p className={cn('text-sm', backgroundColor === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                      {pkg.description}
                    </p>
                  )}
                </div>

                <div className="text-center mb-6">
                  {pkg.oldPrice && (
                    <span className={cn('text-lg line-through mr-2', backgroundColor === 'dark' ? 'text-gray-500' : 'text-gray-400')}>
                      {pkg.oldPrice} RON
                    </span>
                  )}
                  <span className="text-4xl font-bold">{pkg.price}</span>
                  <span className="text-xl"> RON</span>
                  {pkg.period && (
                    <span className={cn('block text-sm', backgroundColor === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
                      /{pkg.period}
                    </span>
                  )}
                </div>

                {pkg.features && pkg.features.length > 0 && (
                  <ul className="space-y-3 mb-6">
                    {pkg.features
                      .filter((feature) => feature.feature)
                      .map((feature, featureIndex) => (
                        <li key={feature.id || featureIndex} className="flex items-start gap-2">
                          {feature.included !== false ? (
                            <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                          <span className={cn(
                            'text-sm',
                            feature.included === false && 'text-gray-400 line-through'
                          )}>
                            {feature.feature}
                          </span>
                        </li>
                      ))}
                  </ul>
                )}

                {pkg.cta?.link && (
                  <Link
                    href={pkg.cta.link}
                    className={cn(
                      'block w-full py-3 px-6 rounded-lg font-medium text-center transition-colors',
                      pkg.highlighted
                        ? 'bg-theme-primary text-white hover:bg-theme-primary-dark'
                        : backgroundColor === 'dark'
                        ? 'bg-gray-700 text-white hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    )}
                  >
                    {pkg.cta.label || 'Alege pachetul'}
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default PricingBlock
