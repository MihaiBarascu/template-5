'use client'

import React from 'react'
import { cn } from '@/utilities/cn'
import { Media } from '@/components/Media'
import type { Media as MediaType } from '@/payload-types'

interface TimelineEvent {
  year: string
  title: string
  description?: string | null
  image?: string | MediaType | null
  icon?: string | null
  id?: string | null
}

interface Conclusion {
  enabled?: boolean | null
  quote?: string | null
  author?: string | null
  role?: string | null
}

interface TimelineBlockProps {
  variant?: string | null
  heading?: string | null
  subheading?: string | null
  events?: TimelineEvent[] | null
  showConnector?: boolean | null
  backgroundColor?: string | null
  conclusion?: Conclusion | null
}

// Helper to check if image is valid Media object
function isValidMedia(image: unknown): image is MediaType {
  return typeof image === 'object' && image !== null && 'url' in image
}

export function TimelineBlock({
  variant = 'vertical',
  heading,
  subheading,
  events = [],
  showConnector = true,
  backgroundColor = 'default',
  conclusion,
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

  // Conclusion/Quote section component
  const ConclusionSection = () => {
    if (!conclusion?.enabled || !conclusion?.quote) return null

    return (
      <div className="mt-16 max-w-3xl mx-auto text-center">
        <div className={cn(
          'relative p-8 rounded-2xl',
          bgColor === 'dark' ? 'bg-white/5' : 'bg-theme-light'
        )}>
          {/* Quote icon */}
          <div className={cn(
            'absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center',
            'bg-theme-primary text-theme-text-on-primary'
          )}>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
            </svg>
          </div>

          {/* Quote text */}
          <blockquote className={cn(
            'text-xl md:text-2xl font-medium italic leading-relaxed mt-4',
            bgColor === 'dark' ? 'text-white' : 'text-theme-text'
          )}>
            "{conclusion.quote}"
          </blockquote>

          {/* Author */}
          {(conclusion.author || conclusion.role) && (
            <div className="mt-6">
              {conclusion.author && (
                <p className={cn(
                  'font-semibold',
                  bgColor === 'dark' ? 'text-white' : 'text-theme-text'
                )}>
                  {conclusion.author}
                </p>
              )}
              {conclusion.role && (
                <p className={cn('text-sm', textMuted)}>
                  {conclusion.role}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  if (variant === 'horizontal') {
    return (
      <section className={cn('py-16 overflow-x-auto', bgClass)}>
        <div className="container mx-auto px-4">
          {(heading || subheading) && (
            <div className="text-center mb-12">
              {heading && <h2 className="heading-h2 font-bold mb-4">{heading}</h2>}
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
                      'bg-theme-primary text-theme-text-on-primary font-bold text-sm'
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

          <ConclusionSection />
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
              {heading && <h2 className="heading-h2 font-bold mb-4">{heading}</h2>}
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
                      <h3 className="heading-h3 font-semibold mt-1 mb-2">{event.title}</h3>
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
                      {isValidMedia(event.image) && (
                        <div className={cn('relative h-48 rounded-lg overflow-hidden', isLeft ? 'ml-12' : 'mr-12')}>
                          <Media
                            resource={event.image as MediaType}
                            fill
                            size="(max-width: 1024px) 50vw, 33vw"
                            imgClassName="object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <ConclusionSection />
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
              {heading && <h2 className="heading-h2 font-bold mb-4">{heading}</h2>}
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

          <ConclusionSection />
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
            {heading && <h2 className="heading-h2 font-bold mb-4">{heading}</h2>}
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
                    'bg-theme-primary text-theme-text-on-primary font-bold'
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
                  <h3 className="heading-h3 font-semibold mb-2">{event.title}</h3>
                  {event.description && (
                    <p className={cn('text-sm', textMuted)}>{event.description}</p>
                  )}
                  {isValidMedia(event.image) && (
                    <div className="relative mt-4 h-48 rounded-lg overflow-hidden">
                      <Media
                        resource={event.image as MediaType}
                        fill
                        size="(max-width: 768px) 100vw, 50vw"
                        imgClassName="object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <ConclusionSection />
      </div>
    </section>
  )
}

export default TimelineBlock
