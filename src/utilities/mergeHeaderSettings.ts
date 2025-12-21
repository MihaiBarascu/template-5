import type { Header as HeaderType, Page } from '@/payload-types'

type PageHeaderSettings = Page['headerSettings']

/**
 * Merge global header settings with page-specific overrides.
 * Page settings with 'inherit' value will use global settings.
 */
export function mergeHeaderSettings(
  globalHeader: HeaderType | null,
  pageSettings?: PageHeaderSettings,
): HeaderType | null {
  if (!globalHeader) return null
  if (!pageSettings) return globalHeader

  // Create a merged header object
  const merged: HeaderType = {
    ...globalHeader,
  }

  // Override variant if not 'inherit'
  if (pageSettings.headerVariant && pageSettings.headerVariant !== 'inherit') {
    merged.variant = pageSettings.headerVariant as HeaderType['variant']
  }

  // Override transparency
  if (pageSettings.headerTransparency === 'transparent') {
    merged.isTransparent = true
  } else if (pageSettings.headerTransparency === 'solid') {
    merged.isTransparent = false
  }
  // 'inherit' keeps globalHeader.isTransparent

  // Override text color when transparent (only if transparency is overridden to transparent)
  if (
    pageSettings.headerTransparency === 'transparent' &&
    pageSettings.headerTextColor &&
    pageSettings.headerTextColor !== 'inherit'
  ) {
    merged.transparentTextColor = pageSettings.headerTextColor as HeaderType['transparentTextColor']
  }

  // Override TopBar visibility
  if (pageSettings.headerTopBar === 'show') {
    merged.showTopBar = true
  } else if (pageSettings.headerTopBar === 'hide') {
    merged.showTopBar = false
  }
  // 'inherit' keeps globalHeader.showTopBar

  return merged
}
