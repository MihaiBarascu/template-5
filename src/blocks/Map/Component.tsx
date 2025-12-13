'use client'

import React from 'react'
import { cn } from '@/utilities/cn'

interface MapBlockProps {
  variant?: 'full-width' | 'contained' | 'with-info' | string
  heading?: string | null
  source?: 'businessInfo' | 'custom' | string
  customEmbed?: string | null
  height?: 'small' | 'medium' | 'large' | string
  showDirectionsButton?: boolean | null
  businessInfo?: {
    googleMapsEmbed?: string | null
    address?: {
      street?: string | null
      city?: string | null
      county?: string | null
      postalCode?: string | null
    } | null
  } | null
}

const heightClasses: Record<string, string> = {
  small: 'h-[300px]',
  medium: 'h-[400px]',
  large: 'h-[500px]',
}

export function MapBlock({
  variant = 'full-width',
  heading,
  source = 'businessInfo',
  customEmbed,
  height = 'medium',
  showDirectionsButton = true,
  businessInfo,
}: MapBlockProps) {
  // Get the embed code
  const embedCode = source === 'custom' ? customEmbed : businessInfo?.googleMapsEmbed

  // Build Google Maps directions URL from address
  const getDirectionsUrl = () => {
    if (!businessInfo?.address) return null
    const { street, city, county, postalCode } = businessInfo.address
    const addressParts = [street, city, county, postalCode].filter(Boolean)
    if (addressParts.length === 0) return null
    const addressString = addressParts.join(', ')
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addressString)}`
  }

  const directionsUrl = getDirectionsUrl()

  // If no embed code available, show placeholder or nothing
  if (!embedCode) {
    return null
  }

  // Extract src from iframe if full embed code provided
  const extractSrc = (embed: string): string => {
    const srcMatch = embed.match(/src=["']([^"']+)["']/)
    if (srcMatch) return srcMatch[1]
    // If it's already a URL, return as is
    if (embed.startsWith('http')) return embed
    return embed
  }

  const mapSrc = extractSrc(embedCode)
  const heightClass = heightClasses[height] || heightClasses.medium

  // Full width variant (no container)
  if (variant === 'full-width') {
    return (
      <section className="w-full">
        {heading && (
          <div className="container mx-auto px-4 py-6">
            <h2 className="heading-h2 font-bold text-center">{heading}</h2>
          </div>
        )}
        <div className={cn('w-full relative', heightClass)}>
          <iframe
            src={mapSrc}
            className="absolute inset-0 w-full h-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Maps"
          />
        </div>
        {showDirectionsButton && directionsUrl && (
          <div className="container mx-auto px-4 py-4 text-center">
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-theme-primary text-white rounded-lg hover:bg-theme-primary-dark transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Obtine directii
            </a>
          </div>
        )}
      </section>
    )
  }

  // Contained variant
  if (variant === 'contained') {
    return (
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          {heading && (
            <h2 className="heading-h2 font-bold text-center mb-6">{heading}</h2>
          )}
          <div className={cn('relative rounded-lg overflow-hidden shadow-lg', heightClass)}>
            <iframe
              src={mapSrc}
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps"
            />
          </div>
          {showDirectionsButton && directionsUrl && (
            <div className="mt-4 text-center">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-theme-primary text-white rounded-lg hover:bg-theme-primary-dark transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Obtine directii
              </a>
            </div>
          )}
        </div>
      </section>
    )
  }

  // With-info variant - map with contact info overlay/side
  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        {heading && (
          <h2 className="heading-h2 font-bold text-center mb-6">{heading}</h2>
        )}
        <div className={cn('relative rounded-lg overflow-hidden shadow-lg', heightClass)}>
          <iframe
            src={mapSrc}
            className="absolute inset-0 w-full h-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Maps"
          />
          {/* Info overlay */}
          {businessInfo?.address && (
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-xs">
              <p className="text-sm font-medium text-theme-text">
                {businessInfo.address.street}
              </p>
              <p className="text-sm text-theme-text-light">
                {businessInfo.address.city}
                {businessInfo.address.county && `, ${businessInfo.address.county}`}
                {businessInfo.address.postalCode && ` ${businessInfo.address.postalCode}`}
              </p>
              {directionsUrl && (
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-sm text-theme-primary hover:underline"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  Obtine directii
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default MapBlock
