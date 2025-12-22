/**
 * Shared theme helpers for all block components
 * Centralizes background colors, dark mode detection, grid columns, and sizing utilities
 */

export type BackgroundColor = 'transparent' | 'default' | 'light' | 'dark' | 'primary' | string

/**
 * Get background CSS classes based on backgroundColor setting
 * Uses theme tokens for consistent styling across all blocks
 */
export function getBgClasses(backgroundColor?: BackgroundColor): string {
  const bgMap: Record<string, string> = {
    transparent: '',
    default: 'bg-theme-surface',
    light: 'bg-theme-light',
    dark: 'bg-theme-dark text-theme-text-on-dark',
    primary: 'bg-theme-primary text-theme-text-on-primary',
  }
  return bgMap[backgroundColor || 'transparent'] || ''
}

/**
 * Determine if background is dark (requires light text)
 */
export function isDarkBackground(backgroundColor?: BackgroundColor): boolean {
  return backgroundColor === 'dark' || backgroundColor === 'primary'
}

/**
 * Get text color class based on dark mode
 */
export function getTextColor(isDark: boolean, variant: 'primary' | 'muted' | 'heading' = 'primary'): string {
  const colorMap = {
    primary: isDark ? 'text-theme-text-on-dark' : 'text-theme-text',
    muted: isDark ? 'text-theme-text-on-dark/70' : 'text-theme-text-muted',
    heading: isDark ? 'text-theme-text-on-dark' : 'text-theme-text',
  }
  return colorMap[variant]
}

/**
 * Get card styling based on dark mode
 * Uses theme tokens and CSS variables
 */
export function getCardClasses(isDark: boolean, options?: { hover?: boolean; border?: boolean }): string {
  const { hover = true, border = true } = options || {}

  const baseClasses = 'rounded-[var(--radius-card)] transition-all'

  if (isDark) {
    return `${baseClasses} bg-white/5 ${hover ? 'hover:bg-white/10' : ''} ${border ? 'border border-white/10' : ''}`
  }

  return `${baseClasses} bg-white ${hover ? 'shadow-lg hover:shadow-xl' : 'shadow-md'} ${border ? 'border border-theme-border/50' : ''}`
}

/**
 * Get icon container styling based on dark mode
 */
export function getIconContainerClasses(isDark: boolean, size: 'sm' | 'md' | 'lg' = 'md'): string {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  }

  const bgClass = isDark ? 'bg-white/10' : 'bg-theme-primary/10'
  return `${sizeMap[size]} rounded-full flex items-center justify-center flex-shrink-0 ${bgClass}`
}

/**
 * Get icon color based on dark mode
 */
export function getIconColor(isDark: boolean): string {
  return isDark ? 'text-white' : 'text-theme-primary'
}

/**
 * Grid column utilities for responsive layouts
 */
export type GridColumns = '1' | '2' | '3' | '4' | '5' | '6' | string

export function getGridCols(columns?: GridColumns, options?: { gap?: 'sm' | 'md' | 'lg' }): string {
  const { gap = 'md' } = options || {}

  const gapMap = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
  }

  const colMap: Record<string, string> = {
    '1': 'grid-cols-1',
    '2': 'grid-cols-1 md:grid-cols-2',
    '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    '5': 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
    '6': 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
  }

  return `grid ${colMap[columns || '3'] || colMap['3']} ${gapMap[gap]}`
}

/**
 * Icon size utilities
 */
export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export function getIconSize(size: IconSize = 'md'): string {
  const sizeMap: Record<IconSize, string> = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
  }
  return sizeMap[size]
}

/**
 * Padding utilities based on size
 */
export type PaddingSize = 'none' | 'sm' | 'md' | 'lg' | 'xl'

export function getPaddingClasses(size: PaddingSize = 'lg'): string {
  const paddingMap: Record<PaddingSize, string> = {
    none: '',
    sm: 'py-4',
    md: 'py-8 md:py-12',
    lg: 'py-12 md:py-16',
    xl: 'py-16 md:py-24',
  }
  return paddingMap[size]
}

/**
 * Empty state styling (for admin/preview when no content)
 */
export function getEmptyStateClasses(isDark: boolean): string {
  const textColor = isDark ? 'text-white/40' : 'text-theme-text-muted/60'
  const borderColor = isDark ? 'border-white/20' : 'border-theme-border'
  return `border-2 border-dashed ${borderColor} rounded-xl p-12 text-center ${textColor}`
}

/**
 * Link/button hover effect classes
 */
export function getLinkHoverClasses(isDark: boolean): string {
  return isDark
    ? 'hover:text-white transition-colors'
    : 'hover:text-theme-primary transition-colors'
}

/**
 * Overlay classes for images/cards
 */
export function getOverlayClasses(opacity: number = 50, gradient?: 'top' | 'bottom' | 'radial'): string {
  const opacityClass = `bg-black/${opacity}`

  if (!gradient) return opacityClass

  const gradientMap = {
    top: `bg-gradient-to-t from-black/${opacity} to-transparent`,
    bottom: `bg-gradient-to-b from-transparent to-black/${opacity}`,
    radial: `bg-radial-gradient from-transparent to-black/${opacity}`,
  }

  return gradientMap[gradient]
}

/**
 * Badge/tag styling
 */
export function getBadgeClasses(variant: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' = 'primary', isDark: boolean = false): string {
  const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'

  const variantMap = {
    primary: isDark ? 'bg-white/20 text-white' : 'bg-theme-primary/10 text-theme-primary',
    secondary: isDark ? 'bg-white/10 text-white/80' : 'bg-theme-surface text-theme-text-muted',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-amber-100 text-amber-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  }

  return `${base} ${variantMap[variant]}`
}

/**
 * Semantic color utilities
 * Centralized Tailwind classes for consistent error, success, warning, info states
 * These use standard Tailwind colors as they are semantic (error=red, success=green)
 */
export const semanticColors = {
  // Error/danger states (for validation errors, required fields, sale badges)
  error: {
    text: 'text-red-500',
    textDark: 'text-red-400',  // For dark backgrounds
    bg: 'bg-red-500',
    bgLight: 'bg-red-50',
    textOnLight: 'text-red-700',
    border: 'border-red-300',
  },
  // Success states (for confirmations, checkmarks, availability)
  success: {
    text: 'text-green-500',
    textDark: 'text-green-400',  // For dark backgrounds
    bg: 'bg-green-500',
    bgLight: 'bg-green-50',
    textOnLight: 'text-green-700',
    border: 'border-green-300',
  },
  // Warning states (for stock alerts, important notices)
  warning: {
    text: 'text-amber-500',
    textDark: 'text-amber-400',  // For dark backgrounds
    bg: 'bg-amber-500',
    bgLight: 'bg-amber-50',
    textOnLight: 'text-amber-700',
    border: 'border-amber-300',
  },
  // Info states (for informational messages)
  info: {
    text: 'text-blue-500',
    textDark: 'text-blue-400',  // For dark backgrounds
    bg: 'bg-blue-500',
    bgLight: 'bg-blue-50',
    textOnLight: 'text-blue-700',
    border: 'border-blue-300',
  },
} as const

/**
 * Get status indicator classes (for open/closed, available/unavailable)
 */
export function getStatusClasses(isPositive: boolean): { container: string; dot: string; text: string } {
  return {
    container: isPositive ? 'bg-green-100' : 'bg-red-100',
    dot: isPositive ? 'bg-green-500' : 'bg-red-500',
    text: isPositive ? 'text-green-800' : 'text-red-800',
  }
}

/**
 * Alert/Banner styling with semantic colors
 */
export function getAlertClasses(variant: 'info' | 'success' | 'warning' | 'error' = 'info'): string {
  const variantMap = {
    info: 'border-blue-300 bg-blue-50 text-blue-900',
    success: 'border-green-300 bg-green-50 text-green-900',
    warning: 'border-amber-300 bg-amber-50 text-amber-900',
    error: 'border-red-300 bg-red-50 text-red-900',
  }
  return `border rounded-lg p-4 ${variantMap[variant]}`
}

/**
 * Category/Label color utilities
 * For ScheduleTable event types, service levels, etc.
 * These provide consistent color coding across the site
 */
export type CategoryColorName = 'orange' | 'blue' | 'green' | 'purple' | 'pink' | 'teal' | 'yellow' | 'red'

export function getCategoryColors(color: CategoryColorName): { bg: string; border: string; text: string } {
  const colorMap: Record<CategoryColorName, { bg: string; border: string; text: string }> = {
    orange: { bg: 'bg-orange-100', border: 'border-orange-500', text: 'text-orange-700' },
    blue: { bg: 'bg-blue-100', border: 'border-blue-500', text: 'text-blue-700' },
    green: { bg: 'bg-green-100', border: 'border-green-500', text: 'text-green-700' },
    purple: { bg: 'bg-purple-100', border: 'border-purple-500', text: 'text-purple-700' },
    pink: { bg: 'bg-pink-100', border: 'border-pink-500', text: 'text-pink-700' },
    teal: { bg: 'bg-teal-100', border: 'border-teal-500', text: 'text-teal-700' },
    yellow: { bg: 'bg-yellow-100', border: 'border-yellow-500', text: 'text-yellow-700' },
    red: { bg: 'bg-red-100', border: 'border-red-500', text: 'text-red-700' },
  }
  return colorMap[color] || colorMap.blue
}

/**
 * Star rating color - uses theme accent for consistency
 */
export const starRatingClasses = {
  filled: 'text-theme-accent fill-theme-accent',
  empty: 'text-theme-border fill-theme-light',
}
