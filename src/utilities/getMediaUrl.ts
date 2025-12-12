/**
 * Processes media resource URL to ensure proper formatting for Next.js Image component
 * @param url The original URL from the resource
 * @param _cacheTag Optional cache tag (ignored in Next.js 16 - see note below)
 * @returns Properly formatted URL
 *
 * IMPORTANT: Next.js 16 image optimization has strict requirements:
 * 1. Does NOT accept absolute URLs for local images - must use relative paths
 * 2. Does NOT allow query strings in local image URLs without explicit localPatterns config
 *
 * For cache busting, Next.js handles this automatically via the image optimization pipeline.
 * The cacheTag parameter is kept for API compatibility but not used for local images.
 */
export const getMediaUrl = (url: string | null | undefined, _cacheTag?: string | null): string => {
  if (!url) return ''

  // Helper to strip query string from URL path
  const stripQueryString = (path: string): string => {
    const queryIndex = path.indexOf('?')
    return queryIndex > -1 ? path.substring(0, queryIndex) : path
  }

  // If URL starts with protocol, check if it's a local URL that needs to be converted to relative
  if (url.startsWith('http://') || url.startsWith('https://')) {
    try {
      const urlObj = new URL(url)
      // Check if this is a local URL (localhost or same origin)
      // If so, extract just the pathname to use as relative URL
      if (urlObj.hostname === 'localhost' || urlObj.hostname === '127.0.0.1') {
        // Convert to relative path for local images (no query string for Next.js 16 compatibility)
        return urlObj.pathname
      }
      // For external URLs, keep the full URL (can include cache tag)
      return _cacheTag ? `${url}?${_cacheTag}` : url
    } catch {
      // If URL parsing fails, strip query string and return
      return stripQueryString(url)
    }
  }

  // URL is already relative - strip any query string for Next.js 16 compatibility
  return stripQueryString(url)
}
