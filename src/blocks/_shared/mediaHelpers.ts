/**
 * Shared media helpers for all block components
 * Handles image validation, media URLs, and date formatting
 */

import type { Media, Category, User } from '@/payload-types'

/**
 * Type guard to check if media object is valid and has a URL
 */
export function isValidMedia(media: unknown): media is Media & { url: string } {
  return (
    typeof media === 'object' &&
    media !== null &&
    'url' in media &&
    typeof (media as Media).url === 'string'
  )
}

/**
 * Get media URL safely
 */
export function getMediaUrl(media: string | Media | null | undefined): string | null {
  if (!media) return null
  if (typeof media === 'string') return media
  if (isValidMedia(media)) return media.url
  return null
}

/**
 * Get media alt text safely
 */
export function getMediaAlt(media: string | Media | null | undefined, fallback: string = ''): string {
  if (!media) return fallback
  if (typeof media === 'string') return fallback
  if (typeof media === 'object' && 'alt' in media && media.alt) {
    return media.alt
  }
  return fallback
}

/**
 * Get media dimensions if available
 */
export function getMediaDimensions(media: Media | null | undefined): { width?: number; height?: number } {
  if (!media || typeof media !== 'object') return {}
  return {
    width: media.width ?? undefined,
    height: media.height ?? undefined,
  }
}

/**
 * Type guard to check if category is populated (not just ID)
 */
export function isPopulatedCategory(category: string | number | Category | null | undefined): category is Category {
  return (
    typeof category === 'object' &&
    category !== null &&
    'title' in category
  )
}

/**
 * Get category data safely
 */
export function getCategoryData(category: string | number | Category | null | undefined): { title: string; slug?: string } | null {
  if (!category) return null
  if (isPopulatedCategory(category)) {
    return {
      title: category.title,
      slug: category.slug,
    }
  }
  return null
}

/**
 * Type guard to check if author/user is populated
 */
export function isPopulatedUser(user: string | number | User | null | undefined): user is User {
  return (
    typeof user === 'object' &&
    user !== null &&
    'email' in user
  )
}

/**
 * Get author data safely
 */
export function getAuthorData(author: string | number | User | null | undefined): { name: string; email?: string } | null {
  if (!author) return null
  if (isPopulatedUser(author)) {
    return {
      name: author.name || author.email,
      email: author.email,
    }
  }
  return null
}

/**
 * Format date for display
 * Uses Romanian locale by default (can be extended for i18n)
 */
export function formatDate(
  date: string | Date | null | undefined,
  options?: Intl.DateTimeFormatOptions
): string {
  if (!date) return ''

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  }

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleDateString('ro-RO', defaultOptions)
  } catch {
    return ''
  }
}

/**
 * Format date as relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(date: string | Date | null | undefined): string {
  if (!date) return ''

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const now = new Date()
    const diffMs = now.getTime() - dateObj.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Astăzi'
    if (diffDays === 1) return 'Ieri'
    if (diffDays < 7) return `Acum ${diffDays} zile`
    if (diffDays < 30) return `Acum ${Math.floor(diffDays / 7)} săptămâni`
    if (diffDays < 365) return `Acum ${Math.floor(diffDays / 30)} luni`
    return `Acum ${Math.floor(diffDays / 365)} ani`
  } catch {
    return ''
  }
}

/**
 * Format price for display
 */
export function formatPrice(
  price: number | null | undefined,
  options?: { currency?: string; locale?: string; showDecimals?: boolean }
): string {
  if (price === null || price === undefined) return ''

  const { currency = 'RON', locale = 'ro-RO', showDecimals = false } = options || {}

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(price)
}

/**
 * Format duration (minutes) for display
 */
export function formatDuration(minutes: number | null | undefined): string {
  if (!minutes) return ''

  if (minutes < 60) {
    return `${minutes} min`
  }

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (remainingMinutes === 0) {
    return `${hours}h`
  }

  return `${hours}h ${remainingMinutes}min`
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string | null | undefined, maxLength: number = 150): string {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

/**
 * Generate placeholder image URL
 */
export function getPlaceholderImage(width: number = 400, height: number = 300, text?: string): string {
  const encodedText = text ? encodeURIComponent(text) : ''
  return `https://placehold.co/${width}x${height}/f3f4f6/9ca3af${encodedText ? `?text=${encodedText}` : ''}`
}

/**
 * Check if string is valid URL
 */
export function isValidUrl(url: string | null | undefined): boolean {
  if (!url) return false
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Get YouTube video ID from URL
 */
export function getYouTubeId(url: string | null | undefined): string | null {
  if (!url) return null

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match?.[1]) return match[1]
  }

  return null
}

/**
 * Get YouTube thumbnail URL
 */
export function getYouTubeThumbnail(
  videoIdOrUrl: string | null | undefined,
  quality: 'default' | 'medium' | 'high' | 'max' = 'high'
): string | null {
  const videoId = videoIdOrUrl?.includes('youtube') || videoIdOrUrl?.includes('youtu.be')
    ? getYouTubeId(videoIdOrUrl)
    : videoIdOrUrl

  if (!videoId) return null

  const qualityMap = {
    default: 'default',
    medium: 'mqdefault',
    high: 'hqdefault',
    max: 'maxresdefault',
  }

  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`
}
