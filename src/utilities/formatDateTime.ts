/**
 * Formats a date string or Date object to a localized string.
 * Follows the Payload website template pattern.
 */
export const formatDateTime = (timestamp: string | Date, locale: string = 'ro-RO'): string => {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp

  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }

  return date.toLocaleDateString(locale, options)
}

/**
 * Formats a date with time.
 */
export const formatDateTimeWithTime = (timestamp: string | Date, locale: string = 'ro-RO'): string => {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp

  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }

  return date.toLocaleDateString(locale, options)
}

/**
 * Returns relative time (e.g., "2 days ago").
 */
export const formatRelativeTime = (timestamp: string | Date, locale: string = 'ro-RO'): string => {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })

  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, 'second')
  } else if (diffInSeconds < 3600) {
    return rtf.format(-Math.floor(diffInSeconds / 60), 'minute')
  } else if (diffInSeconds < 86400) {
    return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour')
  } else if (diffInSeconds < 2592000) {
    return rtf.format(-Math.floor(diffInSeconds / 86400), 'day')
  } else if (diffInSeconds < 31536000) {
    return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month')
  } else {
    return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year')
  }
}
