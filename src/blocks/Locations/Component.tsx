'use client'

import React from 'react'
import { cn } from '@/utilities/cn'
import { Media } from '@/components/Media'
import type { Media as MediaType } from '@/payload-types'

interface Schedule {
  days?: string | null
  hours?: string | null
  id?: string | null
}

interface Location {
  name: string
  address: string
  city?: string | null
  phone?: string | null
  email?: string | null
  image?: string | MediaType | null
  schedule?: Schedule[] | null
  googleMapsEmbed?: string | null
  googleMapsLink?: string | null
  rating?: number | null
  ctaButton?: {
    label?: string | null
    link?: string | null
  } | null
  id?: string | null
}

interface LocationsBlockProps {
  variant?: string | null
  heading?: string | null
  subheading?: string | null
  locations?: Location[] | null
  showMap?: boolean | null
  generalMapEmbed?: string | null
  showRating?: boolean | null
  showSchedule?: boolean | null
  backgroundColor?: string | null
}

// Helper to check if image is valid Media object
function isValidMedia(image: unknown): image is MediaType {
  return typeof image === 'object' && image !== null && 'url' in image
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={cn('w-4 h-4', star <= rating ? 'text-yellow-400' : 'text-white/70')}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1 text-sm text-theme-text-light">({rating.toFixed(1)})</span>
    </div>
  )
}

export function LocationsBlock({
  variant = 'cards',
  heading,
  subheading,
  locations = [],
  showMap = false,
  generalMapEmbed,
  showRating = true,
  showSchedule = true,
  backgroundColor = 'default',
}: LocationsBlockProps) {
  const locationList = locations || []
  const bgColor = backgroundColor || 'default'

  const bgClass =
    {
      default: 'bg-white',
      light: 'bg-theme-light',
      dark: 'bg-theme-dark text-white',
    }[bgColor] || 'bg-white'

  const cardBg = backgroundColor === 'dark' ? 'bg-white/5' : 'bg-white'
  const textMuted = backgroundColor === 'dark' ? 'text-white/60' : 'text-theme-text-light'

  const LocationCard = ({ location }: { location: Location }) => {
    const hasImage = isValidMedia(location.image)
    return (
    <div className={cn('rounded-(--radius-card) overflow-hidden shadow-lg', cardBg)}>
      {hasImage && (
        <div className="relative h-48 overflow-hidden">
          <Media
            resource={location.image as MediaType}
            fill
            size="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            imgClassName="object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="heading-h3 font-semibold mb-2">{location.name}</h3>
        {location.city && (
          <p className={cn('text-sm mb-2', textMuted)}>{location.city}</p>
        )}

        {showRating && location.rating && <StarRating rating={location.rating} />}

        <div className="mt-4 space-y-2">
          <div className="flex items-start gap-2">
            <svg
              className="w-5 h-5 text-theme-primary flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className={cn('text-sm', textMuted)}>{location.address}</span>
          </div>

          {location.phone && (
            <a
              href={`tel:${location.phone}`}
              className="flex items-center gap-2 hover:text-theme-primary"
            >
              <svg
                className="w-5 h-5 text-theme-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span className="text-sm">{location.phone}</span>
            </a>
          )}
        </div>

        {showSchedule && location.schedule && location.schedule.length > 0 && (
          <div className="mt-4 pt-4 border-t border-theme-border">
            <h4 className="text-sm font-medium mb-2">Program:</h4>
            <div className="space-y-1">
              {location.schedule.map((s, idx) => (
                <div key={s.id || idx} className={cn('flex justify-between text-xs', textMuted)}>
                  <span>{s.days}</span>
                  <span>{s.hours}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 flex gap-2">
          {location.ctaButton?.link && (
            <a
              href={location.ctaButton.link}
              className="flex-1 py-2 px-4 bg-theme-primary text-theme-text-on-primary text-center text-sm rounded-lg hover:bg-theme-primary-dark transition-colors"
            >
              {location.ctaButton.label || 'Programeaza-te'}
            </a>
          )}
          {location.googleMapsLink && (
            <a
              href={location.googleMapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'py-2 px-4 text-sm rounded-lg border transition-colors',
                backgroundColor === 'dark'
                  ? 'border-white/10 hover:bg-white/10'
                  : 'border-theme-border hover:bg-theme-light'
              )}
            >
              Directii
            </a>
          )}
        </div>
      </div>
    </div>
  )}

  if (variant === 'list-map') {
    return (
      <section className={cn('py-16', bgClass)}>
        <div className="container mx-auto px-4">
          {(heading || subheading) && (
            <div className="text-center mb-12">
              {heading && <h2 className="heading-h2 font-bold mb-4">{heading}</h2>}
              {subheading && <p className={cn('text-lg', textMuted)}>{subheading}</p>}
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {locationList.map((location, idx) => (
                <div
                  key={location.id || idx}
                  className={cn('p-4 rounded-lg border', cardBg, 'border-theme-border')}
                >
                  <h3 className="font-semibold mb-1">{location.name}</h3>
                  <p className={cn('text-sm mb-2', textMuted)}>{location.address}</p>
                  {location.phone && (
                    <a href={`tel:${location.phone}`} className="text-sm text-theme-primary">
                      {location.phone}
                    </a>
                  )}
                  {showRating && location.rating && (
                    <div className="mt-2">
                      <StarRating rating={location.rating} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {showMap && generalMapEmbed && (
              <div className="h-[600px] rounded-(--radius-card) overflow-hidden">
                <iframe
                  src={generalMapEmbed}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            )}
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'grid-images') {
    return (
      <section className={cn('py-16', bgClass)}>
        <div className="container mx-auto px-4">
          {(heading || subheading) && (
            <div className="text-center mb-12">
              {heading && <h2 className="heading-h2 font-bold mb-4">{heading}</h2>}
              {subheading && <p className={cn('text-lg', textMuted)}>{subheading}</p>}
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {locationList.map((location, idx) => {
              const hasImage = isValidMedia(location.image)
              return (
              <div
                key={location.id || idx}
                className={cn(
                  'group relative h-64 rounded-(--radius-card) overflow-hidden',
                  !hasImage && 'bg-linear-to-br from-theme-primary via-theme-primary to-theme-accent'
                )}
              >
                {hasImage && (
                  <>
                    <Media
                      resource={location.image as MediaType}
                      fill
                      size="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      imgClassName="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />
                  </>
                )}
                <div className={cn(
                  'absolute bottom-0 left-0 right-0 p-6 text-white',
                  !hasImage && 'flex flex-col justify-end h-full'
                )}>
                  <h3 className="heading-h4 font-semibold mb-1">{location.name}</h3>
                  <p className="text-sm text-white/70">{location.address}</p>
                  {location.ctaButton?.link && (
                    <a
                      href={location.ctaButton.link}
                      className="inline-block mt-3 text-sm text-white hover:underline"
                    >
                      {location.ctaButton.label || 'Programeaza-te'} →
                    </a>
                  )}
                </div>
              </div>
            )})}
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'minimal') {
    return (
      <section className={cn('py-16', bgClass)}>
        <div className="container mx-auto px-4">
          {(heading || subheading) && (
            <div className="text-center mb-12">
              {heading && <h2 className="heading-h2 font-bold mb-4">{heading}</h2>}
              {subheading && <p className={cn('text-lg', textMuted)}>{subheading}</p>}
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-8">
            {locationList.map((location, idx) => (
              <div key={location.id || idx} className="text-center">
                <h3 className="font-semibold mb-1">{location.name}</h3>
                <p className={cn('text-sm', textMuted)}>{location.address}</p>
                {location.phone && (
                  <a href={`tel:${location.phone}`} className="block text-sm text-theme-primary mt-1">
                    {location.phone}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Default: cards
  return (
    <section className={cn('py-16', bgClass)}>
      <div className="container mx-auto px-4">
        {(heading || subheading) && (
          <div className="text-center mb-12">
            {heading && <h2 className="heading-h2 font-bold mb-4">{heading}</h2>}
            {subheading && <p className={cn('text-lg', textMuted)}>{subheading}</p>}
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {locationList.map((location, idx) => (
            <LocationCard key={location.id || idx} location={location} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default LocationsBlock
