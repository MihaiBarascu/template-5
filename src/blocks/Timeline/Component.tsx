'use client'

import React from 'react'
import Image from 'next/image'
import { cn } from '@/utilities/cn'
import type { Media } from '@/payload-types'

interface TimelineEvent {
  year: string
  title: string
  description?: string | null
  image?: string | Media | null
  icon?: string | null
  id?: string | null
}

interface TimelineBlockProps {
  variant?: string | null
  heading?: string | null
  subheading?: string | null
  events?: TimelineEvent[] | null
  showConnector?: boolean | null
  backgroundColor?: string | null
}

// Helper to extract image URL from Payload Media
function getImageUrl(image: string | Media | null | undefined): string | null {
  if (!image) return null
  if (typeof image === 'string') return image
  return image.url || null
}

export function TimelineBlock({
  variant = 'vertical',
  heading,
  subheading,
  events = [],
  showConnector = true,
  backgroundColor = 'default',
}: TimelineBlockProps) {
  const eventList = events || []
  const bgColor = backgroundColor || 'default'

  const bgClass =
    {
      default: 'bg-white',
      light: 'bg-theme-light',
      dark: 'bg-theme-dark text-white',
    }[bgColor] || 'bg-white'

  const textMuted = bgColor === 'dark' ? 'text-white/60' : 'text-theme-text-light'
  const borderColor = bgColor === 'dark' ? 'border-white/10' : 'border-theme-border'
  const connectorColor = bgColor === 'dark' ? 'bg-white/10' : 'bg-theme-border'

  if (variant === 'horizontal') {
    return (
      <section className={cn('py-16 overflow-x-auto', bgClass)}>
        <div className="container mx-auto px-4">
          {(heading || subheading) && (
            <div className="text-center mb-12">
              {heading && <h2 className="text-3xl font-bold mb-4">{heading}</h2>}
              {subheading && <p className={cn('text-lg', textMuted)}>{subheading}</p>}
            </div>
          )}

          <div className="relative min-w-max">
            {showConnector && (
              <div
                className={cn(
                  'absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2',
                  connectorColor
                )}
              />
            )}

            <div className="flex gap-8 justify-center">
              {eventList.map((event, idx) => (
                <div key={event.id || idx} className="relative flex flex-col items-center w-64">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-full flex items-center justify-center z-10',
                      'bg-theme-primary text-white font-bold text-sm'
                    )}
                  >
                    {event.year}
                  </div>
                  <div className="mt-4 text-center">
                    <h3 className="font-semibold mb-2">{event.title}</h3>
                    {event.description && (
                      <p className={cn('text-sm', textMuted)}>{event.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'vertical-alternating') {
    return (
      <section className={cn('py-16', bgClass)}>
        <div className="container mx-auto px-4">
          {(heading || subheading) && (
            <div className="text-center mb-12">
              {heading && <h2 className="text-3xl font-bold mb-4">{heading}</h2>}
              {subheading && <p className={cn('text-lg', textMuted)}>{subheading}</p>}
            </div>
          )}

          <div className="relative max-w-4xl mx-auto">
            {showConnector && (
              <div
                className={cn(
                  'absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2',
                  connectorColor
                )}
              />
            )}

            <div className="space-y-12">
              {eventList.map((event, idx) => {
                const isLeft = idx % 2 === 0

                return (
                  <div
                    key={event.id || idx}
                    className={cn('relative flex items-center', isLeft ? 'flex-row' : 'flex-row-reverse')}
                  >
                    <div className={cn('w-1/2', isLeft ? 'pr-12 text-right' : 'pl-12 text-left')}>
                      <span className="text-theme-primary font-bold text-lg">{event.year}</span>
                      <h3 className="text-xl font-semibold mt-1 mb-2">{event.title}</h3>
                      {event.description && (
                        <p className={cn('text-sm', textMuted)}>{event.description}</p>
                      )}
                    </div>

                    <div
                      className={cn(
                        'absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full z-10',
                        'bg-theme-primary border-4',
                        bgColor === 'dark' ? 'border-theme-dark' : 'border-white'
                      )}
                    />

                    <div className="w-1/2">
                      {(() => {
                        const eventImageUrl = getImageUrl(event.image)
                        return eventImageUrl && (
                        <div className={cn('relative h-48 rounded-lg overflow-hidden', isLeft ? 'ml-12' : 'mr-12')}>
                          <Image
                            src={eventImageUrl}
                            alt={event.title}
                            fill
                            sizes="(max-width: 1024px) 50vw, 33vw"
                            className="object-cover"
                          />
                        </div>
                      )})()}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'compact') {
    return (
      <section className={cn('py-16', bgClass)}>
        <div className="container mx-auto px-4">
          {(heading || subheading) && (
            <div className="text-center mb-12">
              {heading && <h2 className="text-3xl font-bold mb-4">{heading}</h2>}
              {subheading && <p className={cn('text-lg', textMuted)}>{subheading}</p>}
            </div>
          )}

          <div className="max-w-2xl mx-auto">
            {eventList.map((event, idx) => (
              <div
                key={event.id || idx}
                className={cn('flex gap-4 py-4', idx !== eventList.length - 1 && `border-b ${borderColor}`)}
              >
                <div className="flex-shrink-0 w-20 text-theme-primary font-bold">{event.year}</div>
                <div>
                  <h3 className="font-semibold">{event.title}</h3>
                  {event.description && (
                    <p className={cn('text-sm mt-1', textMuted)}>{event.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Default: vertical
  return (
    <section className={cn('py-16', bgClass)}>
      <div className="container mx-auto px-4">
        {(heading || subheading) && (
          <div className="text-center mb-12">
            {heading && <h2 className="text-3xl font-bold mb-4">{heading}</h2>}
            {subheading && <p className={cn('text-lg', textMuted)}>{subheading}</p>}
          </div>
        )}

        <div className="relative max-w-3xl mx-auto">
          {showConnector && (
            <div className={cn('absolute left-8 top-0 bottom-0 w-0.5', connectorColor)} />
          )}

          <div className="space-y-8">
            {eventList.map((event, idx) => (
              <div key={event.id || idx} className="relative flex gap-6">
                <div
                  className={cn(
                    'flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center z-10',
                    'bg-theme-primary text-white font-bold'
                  )}
                >
                  {event.year}
                </div>

                <div
                  className={cn(
                    'flex-1 p-6 rounded-xl',
                    bgColor === 'dark' ? 'bg-white/5' : 'bg-theme-light'
                  )}
                >
                  <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                  {event.description && (
                    <p className={cn('text-sm', textMuted)}>{event.description}</p>
                  )}
                  {(() => {
                    const eventImageUrl = getImageUrl(event.image)
                    return eventImageUrl && (
                    <div className="relative mt-4 h-48 rounded-lg overflow-hidden">
                      <Image
                        src={eventImageUrl}
                        alt={event.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                  )})()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default TimelineBlock
