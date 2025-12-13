'use client'

import React from 'react'
import { cn } from '@/utilities/cn'
import type { Form as PayloadFormType } from '@/payload-types'

/**
 * ContactBlock Component
 *
 * Displays business contact information in various layouts.
 * The 'full' variant includes info + form + map all in one.
 * For separate blocks, use Map block and Form block.
 */

interface ContactLabels {
  addressLabel?: string | null
  phoneLabel?: string | null
  emailLabel?: string | null
  scheduleLabel?: string | null
  socialLabel?: string | null
}

interface ContactBlockProps {
  variant?: 'standard' | 'cards' | 'compact' | 'minimal' | 'full' | string
  heading?: string | null
  subheading?: string | null
  contactInfoItems?: {
    showAddress?: boolean | null
    showPhone?: boolean | null
    showEmail?: boolean | null
    showWorkingHours?: boolean | null
    showSocial?: boolean | null
  } | null
  backgroundColor?: 'transparent' | 'default' | 'light' | 'dark' | string
  labels?: ContactLabels | null
  // For 'full' variant - form and map settings
  form?: PayloadFormType | null
  mapSettings?: {
    showMap?: boolean | null
    mapHeight?: 'small' | 'medium' | 'large' | null
    mapHeading?: string | null
  } | null
  formSettings?: {
    formHeading?: string | null
    formSubheading?: string | null
  } | null
  businessInfo?: {
    phone?: string | null
    email?: string | null
    address?: {
      street?: string | null
      city?: string | null
      county?: string | null
      postalCode?: string | null
    } | null
    workingHours?: Array<{ days?: string | null; hours?: string | null; id?: string | null }> | null
    social?: {
      facebook?: string | null
      instagram?: string | null
      tiktok?: string | null
      linkedin?: string | null
      youtube?: string | null
    } | null
    mapEmbed?: string | null
  } | null
}

// Icon components
const LocationIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const PhoneIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
)

const EmailIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

export function ContactBlock({
  variant = 'standard',
  heading,
  subheading,
  contactInfoItems: contactInfoItemsProp,
  backgroundColor = 'transparent',
  labels: labelsProp,
  form: _form,
  mapSettings: _mapSettings,
  formSettings: _formSettings,
  businessInfo,
}: ContactBlockProps) {
  const contactInfoItems = contactInfoItemsProp ?? {
    showAddress: true,
    showPhone: true,
    showEmail: true,
    showWorkingHours: true,
    showSocial: false,
  }
  const labels = labelsProp ?? {}

  const bgClass = {
    transparent: '',
    default: 'bg-theme-surface',
    light: 'bg-theme-light',
    dark: 'bg-theme-dark text-white',
  }[backgroundColor] || ''

  const isDark = backgroundColor === 'dark'

  // Build address string
  const getAddressString = () => {
    if (!businessInfo?.address) return null
    const { street, city, county, postalCode } = businessInfo.address
    const parts = [street, city, county, postalCode].filter(Boolean)
    return parts.join(', ')
  }

  // Check if we have any content to display
  const hasAddress = contactInfoItems.showAddress && getAddressString()
  const hasPhone = contactInfoItems.showPhone && businessInfo?.phone
  const hasEmail = contactInfoItems.showEmail && businessInfo?.email
  const hasHours = contactInfoItems.showWorkingHours && businessInfo?.workingHours?.length
  const hasSocial = contactInfoItems.showSocial && businessInfo?.social

  if (!hasAddress && !hasPhone && !hasEmail && !hasHours && !hasSocial) {
    return null
  }

  // Compact variant - single line with icons
  if (variant === 'compact') {
    return (
      <div className={cn(bgClass, bgClass && 'py-4')}>
        {(heading || subheading) && (
          <div className="mb-4">
            {heading && <h3 className="heading-h3 font-semibold">{heading}</h3>}
            {subheading && <p className={cn('text-sm', isDark ? 'text-white/70' : 'text-theme-text-muted')}>{subheading}</p>}
          </div>
        )}
        <div className="flex flex-wrap items-center gap-6">
          {hasPhone && (
            <a href={`tel:${businessInfo?.phone}`} className="flex items-center gap-2 hover:text-theme-primary transition-colors">
              <PhoneIcon className="w-4 h-4" />
              <span className="text-sm">{businessInfo?.phone}</span>
            </a>
          )}
          {hasEmail && (
            <a href={`mailto:${businessInfo?.email}`} className="flex items-center gap-2 hover:text-theme-primary transition-colors">
              <EmailIcon className="w-4 h-4" />
              <span className="text-sm">{businessInfo?.email}</span>
            </a>
          )}
          {hasAddress && (
            <div className="flex items-center gap-2">
              <LocationIcon className="w-4 h-4" />
              <span className="text-sm">{getAddressString()}</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Minimal variant - just text, no icons
  if (variant === 'minimal') {
    return (
      <div className={cn(bgClass, bgClass && 'py-4')}>
        {(heading || subheading) && (
          <div className="mb-4">
            {heading && <h3 className="heading-h3 font-semibold">{heading}</h3>}
            {subheading && <p className={cn('text-sm', isDark ? 'text-white/70' : 'text-theme-text-muted')}>{subheading}</p>}
          </div>
        )}
        <div className="space-y-2">
          {hasPhone && (
            <a href={`tel:${businessInfo?.phone}`} className="block text-sm hover:text-theme-primary transition-colors">
              {businessInfo?.phone}
            </a>
          )}
          {hasEmail && (
            <a href={`mailto:${businessInfo?.email}`} className="block text-sm hover:text-theme-primary transition-colors">
              {businessInfo?.email}
            </a>
          )}
          {hasAddress && (
            <p className="text-sm">{getAddressString()}</p>
          )}
        </div>
      </div>
    )
  }

  // Cards variant
  if (variant === 'cards') {
    return (
      <div className={cn(bgClass, bgClass && 'py-8')}>
        {(heading || subheading) && (
          <div className="text-center mb-8">
            {heading && <h2 className="heading-h2 font-bold mb-2">{heading}</h2>}
            {subheading && <p className={cn('text-lg', isDark ? 'text-white/70' : 'text-theme-text-muted')}>{subheading}</p>}
          </div>
        )}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {hasPhone && (
            <a
              href={`tel:${businessInfo?.phone}`}
              className={cn(
                'p-6 rounded-[var(--radius-card)] text-center transition-all hover:shadow-lg',
                isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-white border border-theme-border hover:border-theme-primary'
              )}
            >
              <div className={cn('w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4', isDark ? 'bg-white/10' : 'bg-theme-primary/10')}>
                <PhoneIcon className={cn('w-6 h-6', isDark ? 'text-white' : 'text-theme-primary')} />
              </div>
              <span className="block font-semibold mb-1">{labels.phoneLabel || 'Telefon'}</span>
              <p className={isDark ? 'text-white/60' : 'text-theme-text-muted'}>{businessInfo?.phone}</p>
            </a>
          )}
          {hasEmail && (
            <a
              href={`mailto:${businessInfo?.email}`}
              className={cn(
                'p-6 rounded-[var(--radius-card)] text-center transition-all hover:shadow-lg',
                isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-white border border-theme-border hover:border-theme-primary'
              )}
            >
              <div className={cn('w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4', isDark ? 'bg-white/10' : 'bg-theme-primary/10')}>
                <EmailIcon className={cn('w-6 h-6', isDark ? 'text-white' : 'text-theme-primary')} />
              </div>
              <span className="block font-semibold mb-1">{labels.emailLabel || 'Email'}</span>
              <p className={isDark ? 'text-white/60' : 'text-theme-text-muted'}>{businessInfo?.email}</p>
            </a>
          )}
          {hasAddress && (
            <div
              className={cn(
                'p-6 rounded-[var(--radius-card)] text-center',
                isDark ? 'bg-white/5' : 'bg-white border border-theme-border'
              )}
            >
              <div className={cn('w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4', isDark ? 'bg-white/10' : 'bg-theme-primary/10')}>
                <LocationIcon className={cn('w-6 h-6', isDark ? 'text-white' : 'text-theme-primary')} />
              </div>
              <span className="block font-semibold mb-1">{labels.addressLabel || 'Adresa'}</span>
              <p className={isDark ? 'text-white/60' : 'text-theme-text-muted'}>{getAddressString()}</p>
            </div>
          )}
          {hasHours && (
            <div
              className={cn(
                'p-6 rounded-[var(--radius-card)] text-center',
                isDark ? 'bg-white/5' : 'bg-white border border-theme-border'
              )}
            >
              <div className={cn('w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4', isDark ? 'bg-white/10' : 'bg-theme-primary/10')}>
                <ClockIcon className={cn('w-6 h-6', isDark ? 'text-white' : 'text-theme-primary')} />
              </div>
              <span className="block font-semibold mb-2">{labels.scheduleLabel || 'Program'}</span>
              <div className={cn('text-sm space-y-1', isDark ? 'text-white/60' : 'text-theme-text-muted')}>
                {businessInfo?.workingHours?.filter(s => s.days && s.hours).map((schedule, index) => (
                  <div key={schedule.id || index}>
                    <span className="font-medium">{schedule.days}:</span> {schedule.hours}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Standard variant (default) - vertical list with icons
  return (
    <div className={cn(bgClass, bgClass && 'py-8')}>
      {(heading || subheading) && (
        <div className="mb-6">
          {heading && <h2 className="text-xl font-bold mb-2">{heading}</h2>}
          {subheading && <p className={cn('text-base', isDark ? 'text-white/70' : 'text-theme-text-muted')}>{subheading}</p>}
        </div>
      )}
      <div className="space-y-5">
        {hasAddress && (
          <div className="flex gap-4">
            <div className={cn('w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0', isDark ? 'bg-white/10' : 'bg-theme-primary/10')}>
              <LocationIcon className={cn('w-5 h-5', isDark ? 'text-white' : 'text-theme-primary')} />
            </div>
            <div>
              <span className="block font-semibold mb-1">{labels.addressLabel || 'Adresa'}</span>
              <p className={cn('text-sm', isDark ? 'text-white/60' : 'text-theme-text-muted')}>
                {businessInfo?.address?.street && <>{businessInfo.address.street}<br /></>}
                {businessInfo?.address?.city}{businessInfo?.address?.county && `, ${businessInfo.address.county}`}
                {businessInfo?.address?.postalCode && `, ${businessInfo.address.postalCode}`}
              </p>
            </div>
          </div>
        )}

        {hasPhone && (
          <div className="flex gap-4">
            <div className={cn('w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0', isDark ? 'bg-white/10' : 'bg-theme-primary/10')}>
              <PhoneIcon className={cn('w-5 h-5', isDark ? 'text-white' : 'text-theme-primary')} />
            </div>
            <div>
              <span className="block font-semibold mb-1">{labels.phoneLabel || 'Telefon'}</span>
              <a href={`tel:${businessInfo?.phone}`} className={cn('text-sm hover:underline', isDark ? 'text-white/60' : 'text-theme-text-muted')}>
                {businessInfo?.phone}
              </a>
            </div>
          </div>
        )}

        {hasEmail && (
          <div className="flex gap-4">
            <div className={cn('w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0', isDark ? 'bg-white/10' : 'bg-theme-primary/10')}>
              <EmailIcon className={cn('w-5 h-5', isDark ? 'text-white' : 'text-theme-primary')} />
            </div>
            <div>
              <span className="block font-semibold mb-1">{labels.emailLabel || 'Email'}</span>
              <a href={`mailto:${businessInfo?.email}`} className={cn('text-sm hover:underline', isDark ? 'text-white/60' : 'text-theme-text-muted')}>
                {businessInfo?.email}
              </a>
            </div>
          </div>
        )}

        {hasHours && (
          <div className="flex gap-4">
            <div className={cn('w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0', isDark ? 'bg-white/10' : 'bg-theme-primary/10')}>
              <ClockIcon className={cn('w-5 h-5', isDark ? 'text-white' : 'text-theme-primary')} />
            </div>
            <div>
              <span className="block font-semibold mb-1">{labels.scheduleLabel || 'Program'}</span>
              <div className={cn('text-sm space-y-1', isDark ? 'text-white/60' : 'text-theme-text-muted')}>
                {businessInfo?.workingHours?.filter(s => s.days && s.hours).map((schedule, index) => (
                  <div key={schedule.id || index} className="flex justify-between gap-4">
                    <span>{schedule.days}</span>
                    <span className="font-medium">{schedule.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {hasSocial && businessInfo?.social && (
          <div className="flex gap-4">
            <div className={cn('w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0', isDark ? 'bg-white/10' : 'bg-theme-primary/10')}>
              <svg className={cn('w-5 h-5', isDark ? 'text-white' : 'text-theme-primary')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <div>
              <span className="block font-semibold mb-2">{labels.socialLabel || 'Social Media'}</span>
              <div className="flex gap-3">
                {businessInfo.social.facebook && (
                  <a href={businessInfo.social.facebook} target="_blank" rel="noopener noreferrer" className={cn('hover:text-theme-primary transition-colors', isDark ? 'text-white/60' : 'text-theme-text-muted')}>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/></svg>
                  </a>
                )}
                {businessInfo.social.instagram && (
                  <a href={businessInfo.social.instagram} target="_blank" rel="noopener noreferrer" className={cn('hover:text-theme-primary transition-colors', isDark ? 'text-white/60' : 'text-theme-text-muted')}>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </a>
                )}
                {businessInfo.social.tiktok && (
                  <a href={businessInfo.social.tiktok} target="_blank" rel="noopener noreferrer" className={cn('hover:text-theme-primary transition-colors', isDark ? 'text-white/60' : 'text-theme-text-muted')}>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/></svg>
                  </a>
                )}
                {businessInfo.social.linkedin && (
                  <a href={businessInfo.social.linkedin} target="_blank" rel="noopener noreferrer" className={cn('hover:text-theme-primary transition-colors', isDark ? 'text-white/60' : 'text-theme-text-muted')}>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </a>
                )}
                {businessInfo.social.youtube && (
                  <a href={businessInfo.social.youtube} target="_blank" rel="noopener noreferrer" className={cn('hover:text-theme-primary transition-colors', isDark ? 'text-white/60' : 'text-theme-text-muted')}>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ContactBlock
