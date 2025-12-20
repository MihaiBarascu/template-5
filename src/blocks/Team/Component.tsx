'use client'

import React from 'react'
import Link from 'next/link'
import { cn } from '@/utilities/cn'
import { Media } from '@/components/Media'
import type { Media as MediaType } from '@/payload-types'

// Shared utilities
import { getBgClasses, isDarkBackground, getGridCols } from '../_shared/themeHelpers'
import { isValidMedia } from '../_shared/mediaHelpers'
import { SocialIcons, SocialLink, EmptyStateIcon, StarRating } from '../_shared/iconComponents'
import type { SocialPlatform } from '../_shared/iconComponents'

interface RichText {
  root: {
    type: string
    children: unknown[]
    direction: string | null
    format: string
    indent: number
    version: number
  }
}

interface SocialLinks {
  facebook?: string | null
  instagram?: string | null
  linkedin?: string | null
  twitter?: string | null
}

interface TeamMember {
  id: string
  name: string
  slug?: string | null
  role?: string | null
  bio?: RichText | string | null
  experience?: string | null
  image?: {
    url?: string | null
    alt?: string | null
  } | string | null
  specializations?: Array<{ specialization?: string | null; id?: string | null }> | null
  featured?: boolean | null
  social?: SocialLinks | null
  bookingLink?: string | null
}

interface TeamBlockProps {
  variant?: string
  heading?: string
  subheading?: string
  source?: string
  limit?: number
  onlyFeatured?: boolean
  showRole?: boolean
  showBio?: boolean
  showSocial?: boolean
  showContact?: boolean
  showBookButton?: boolean
  bookButtonText?: string
  columns?: string
  backgroundColor?: string
  members?: TeamMember[]
  detailBasePath?: string | null
}


// Helper function to render bio as string
function getBioText(bio: TeamMember['bio']): string | null {
  if (!bio) return null
  if (typeof bio === 'string') return bio
  const extractText = (children: unknown[]): string => {
    return children.map((child) => {
      if (typeof child === 'object' && child !== null) {
        const node = child as { text?: string; children?: unknown[] }
        if (node.text) return node.text
        if (node.children) return extractText(node.children)
      }
      return ''
    }).join('')
  }
  return extractText(bio.root.children)
}

export function TeamBlock({
  variant = 'grid',
  heading,
  subheading,
  showRole = true,
  showBio = false,
  showSocial = true,
  showBookButton = false,
  bookButtonText = 'Programeaza',
  columns = '4',
  backgroundColor = 'default',
  members = [],
  detailBasePath,
}: TeamBlockProps) {
  // Helper to get member detail URL
  const getMemberHref = (member: TeamMember): string | null => {
    if (!detailBasePath || !member.slug) return null
    const basePath = detailBasePath.startsWith('/') ? detailBasePath : `/${detailBasePath}`
    return `${basePath}/${member.slug}`
  }

  // Use shared theme helpers
  const bgClass = getBgClasses(backgroundColor)
  const isDark = isDarkBackground(backgroundColor)

  const getGridColsClass = () => {
    switch (columns) {
      case '2': return 'md:grid-cols-2'
      case '3': return 'md:grid-cols-2 lg:grid-cols-3'
      default: return 'md:grid-cols-2 lg:grid-cols-4'
    }
  }

  if (members.length === 0) {
    return (
      <section className={cn('py-section', bgClass)}>
        <div className="container mx-auto px-4">
          <div className={cn(
            'text-center py-16 border-2 border-dashed rounded-xl',
            isDark ? 'border-white/20' : 'border-theme-border'
          )}>
            <svg className={cn('w-16 h-16 mx-auto mb-4', isDark ? 'text-white/40' : 'text-theme-text-muted')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className={isDark ? 'text-white/60' : 'text-theme-text-muted'}>Nu sunt membri în echipă.</p>
          </div>
        </div>
      </section>
    )
  }

  // List Variant
  if (variant === 'list') {
    return (
      <section className={cn('py-section', bgClass)}>
        <div className="container mx-auto px-4">
          {/* Header */}
          {(heading || subheading) && (
            <div className="text-center mb-12">
              {heading && (
                <h2 className={cn(
                  'heading-h2 font-bold mb-4',
                  isDark ? 'text-white' : 'text-theme-text'
                )}>
                  {heading}
                </h2>
              )}
              {subheading && (
                <p className={cn('text-lg max-w-2xl mx-auto', isDark ? 'text-white/70' : 'text-theme-text-light')}>
                  {subheading}
                </p>
              )}
            </div>
          )}

          <div className="space-y-6 max-w-4xl mx-auto">
            {members.map((member, index) => (
              <div
                key={member.id}
                className={cn(
                  'group flex flex-col md:flex-row items-center gap-6 p-6 rounded-[var(--radius-card)]',
                  'animate-fade-in-up card-hover',
                  isDark
                    ? 'bg-white/5 hover:bg-white/10 border border-white/10'
                    : 'bg-white hover:shadow-xl border border-theme-border',
                  index < 8 && `animation-delay-${(index % 4) * 100 + 100}`
                )}
              >
                {/* Image */}
                <div className={cn(
                  'relative w-28 h-28 md:w-32 md:h-32 flex-shrink-0 rounded-2xl overflow-hidden',
                  'ring-4 transition-all duration-300',
                  isDark ? 'ring-white/10 group-hover:ring-theme-accent/50' : 'ring-theme-primary/10 group-hover:ring-theme-primary/30'
                )}>
                  {isValidMedia(member.image) ? (
                    <Media
                      resource={member.image as MediaType}
                      fill
                      size="128px"
                      imgClassName="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-theme-primary to-theme-secondary text-white heading-h2 font-bold">
                      {member.name.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-grow text-center md:text-left">
                  <h3 className={cn('heading-h3 font-bold mb-1', isDark ? 'text-white' : 'text-theme-text')}>
                    {member.name}
                    {member.featured && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 text-xs font-medium bg-theme-accent text-white rounded-full">
                        Top
                      </span>
                    )}
                  </h3>
                  {showRole && member.role && (
                    <p className={cn('text-sm font-medium mb-2', isDark ? 'text-theme-accent' : 'text-theme-primary')}>
                      {member.role}
                    </p>
                  )}
                  {member.experience && (
                    <p className={cn('text-sm mb-2', isDark ? 'text-white/50' : 'text-theme-text-muted')}>
                      {member.experience}
                    </p>
                  )}
                  {showBio && getBioText(member.bio) && (
                    <p className={cn('text-sm line-clamp-2', isDark ? 'text-white/70' : 'text-theme-text-light')}>
                      {getBioText(member.bio)}
                    </p>
                  )}

                  {/* Specializations */}
                  {member.specializations && member.specializations.length > 0 && (
                    <div className="flex flex-wrap justify-center md:justify-start gap-1.5 mt-3">
                      {member.specializations.filter(s => s.specialization).slice(0, 4).map((spec, idx) => (
                        <span
                          key={spec.id || idx}
                          className={cn(
                            'text-xs px-2.5 py-1 rounded-full font-medium',
                            isDark ? 'bg-white/10 text-white/80' : 'bg-theme-primary/10 text-theme-primary'
                          )}
                        >
                          {spec.specialization}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col items-center gap-3">
                  {/* Social Links */}
                  {showSocial && member.social && (
                    <div className="flex gap-2">
                      {Object.entries(member.social).map(([platform, url]) => {
                        if (!url) return null
                        return (
                          <a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                              'w-9 h-9 rounded-full flex items-center justify-center',
                              'transition-all duration-300 hover:scale-110',
                              isDark
                                ? 'bg-white/10 text-white hover:bg-theme-accent hover:text-white'
                                : 'bg-theme-light text-theme-text-light hover:bg-theme-primary hover:text-white'
                            )}
                          >
                            {SocialIcons[platform as keyof typeof SocialIcons]}
                          </a>
                        )
                      })}
                    </div>
                  )}

                  {/* Book Button */}
                  {showBookButton && member.bookingLink && (
                    <Link
                      href={member.bookingLink}
                      className={cn(
                        'inline-flex items-center gap-2 px-5 py-2',
                        'text-sm font-semibold rounded-full',
                        'transition-all duration-300 hover:scale-105',
                        isDark
                          ? 'bg-theme-accent text-white hover:bg-white hover:text-theme-dark'
                          : 'bg-theme-primary text-white hover:bg-theme-secondary'
                      )}
                    >
                      {bookButtonText}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Grid Variants (default)
  return (
    <section className={cn('py-section', bgClass)}>
      <div className="container mx-auto px-4">
        {/* Header */}
        {(heading || subheading) && (
          <div className="text-center mb-12">
            {heading && (
              <h2 className={cn(
                'heading-h2 font-bold mb-4',
                isDark ? 'text-white' : 'text-theme-text'
              )}>
                {heading}
              </h2>
            )}
            {subheading && (
              <p className={cn('text-lg max-w-2xl mx-auto', isDark ? 'text-white/70' : 'text-theme-text-light')}>
                {subheading}
              </p>
            )}
          </div>
        )}

        {/* Grid */}
        <div className={cn('grid gap-cards', getGridColsClass())}>
          {members.map((member, index) => (
            <div
              key={member.id}
              className={cn(
                'group relative text-center',
                'animate-fade-in-up',
                index < 8 && `animation-delay-${(index % 4) * 100 + 100}`
              )}
            >
              {/* Card */}
              <div className={cn(
                'relative p-6 rounded-[var(--radius-card)] overflow-hidden',
                'transition-all duration-300',
                isDark
                  ? 'bg-white/5 hover:bg-white/10 border border-white/10'
                  : 'bg-white hover:shadow-xl border border-theme-border'
              )}>
                {/* Featured Badge */}
                {member.featured && (
                  <div className="absolute top-3 right-3 z-10">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-theme-accent text-white rounded-full">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Top
                    </span>
                  </div>
                )}

                {/* Image */}
                <div className={cn(
                  'relative w-32 h-32 mx-auto mb-5 overflow-hidden',
                  'transition-all duration-500 group-hover:scale-105',
                  variant === 'grid-centered' || variant === 'grid-round' ? 'rounded-full' : 'rounded-2xl'
                )}>
                  {/* Ring decoration */}
                  <div className={cn(
                    'absolute -inset-1 rounded-inherit transition-all duration-300',
                    variant === 'grid-centered' || variant === 'grid-round' ? 'rounded-full' : 'rounded-2xl',
                    isDark
                      ? 'bg-gradient-to-br from-theme-accent/50 to-transparent opacity-0 group-hover:opacity-100'
                      : 'bg-gradient-to-br from-theme-primary/30 to-theme-accent/30 opacity-0 group-hover:opacity-100'
                  )} />

                  <div className={cn(
                    'relative w-full h-full overflow-hidden',
                    variant === 'grid-centered' || variant === 'grid-round' ? 'rounded-full' : 'rounded-2xl'
                  )}>
                    {isValidMedia(member.image) ? (
                      <Media
                        resource={member.image as MediaType}
                        fill
                        size="128px"
                        imgClassName="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-theme-primary to-theme-secondary text-white text-4xl font-bold">
                        {member.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Hover overlay with social */}
                  {showSocial && member.social && (
                    <div className={cn(
                      'absolute inset-0 flex items-center justify-center gap-2',
                      'bg-black/60 opacity-0 group-hover:opacity-100',
                      'transition-all duration-300',
                      variant === 'grid-centered' || variant === 'grid-round' ? 'rounded-full' : 'rounded-2xl'
                    )}>
                      {Object.entries(member.social).map(([platform, url]) => {
                        if (!url) return null
                        return (
                          <a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                              'w-8 h-8 rounded-full flex items-center justify-center',
                              'bg-white/20 text-white hover:bg-white hover:text-theme-dark',
                              'transition-all duration-200 hover:scale-110',
                              'transform translate-y-4 group-hover:translate-y-0'
                            )}
                            style={{ transitionDelay: `${Object.keys(member.social!).indexOf(platform) * 50}ms` }}
                          >
                            {SocialIcons[platform as keyof typeof SocialIcons]}
                          </a>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Info */}
                <h3 className={cn(
                  'heading-h3 font-bold mb-1 transition-colors',
                  isDark ? 'text-white group-hover:text-theme-accent' : 'text-theme-text group-hover:text-theme-primary'
                )}>
                  {getMemberHref(member) ? (
                    <Link href={getMemberHref(member)!} className="hover:underline">
                      {member.name}
                    </Link>
                  ) : (
                    member.name
                  )}
                </h3>

                {showRole && member.role && (
                  <p className={cn(
                    'text-sm font-medium mb-2',
                    isDark ? 'text-theme-accent' : 'text-theme-primary'
                  )}>
                    {member.role}
                  </p>
                )}

                {member.experience && (
                  <p className={cn('text-xs mb-3', isDark ? 'text-white/50' : 'text-theme-text-muted')}>
                    {member.experience}
                  </p>
                )}

                {/* Specializations */}
                {member.specializations && member.specializations.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-1 mb-4">
                    {member.specializations.filter(s => s.specialization).slice(0, 3).map((spec, idx) => (
                      <span
                        key={spec.id || idx}
                        className={cn(
                          'text-xs px-2 py-0.5 rounded-full',
                          isDark ? 'bg-white/10 text-white/70' : 'bg-theme-light text-theme-text-light'
                        )}
                      >
                        {spec.specialization}
                      </span>
                    ))}
                  </div>
                )}

                {/* Book Button */}
                {showBookButton && member.bookingLink && (
                  <Link
                    href={member.bookingLink}
                    className={cn(
                      'inline-flex items-center justify-center gap-2 w-full px-4 py-2.5',
                      'text-sm font-semibold rounded-[var(--radius-button)]',
                      'transition-all duration-300',
                      isDark
                        ? 'bg-theme-accent text-white hover:bg-white hover:text-theme-dark'
                        : 'bg-theme-primary text-white hover:bg-theme-secondary'
                    )}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {bookButtonText}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TeamBlock
