import React from 'react'

// Helper to get image URL - uses ORIGINAL image for Hero (best quality)
// Next.js Image component will handle optimization
export function getImageData(image: unknown): { url: string; alt: string } | null {
  if (!image || typeof image === 'string') return null
  const imgData = image as {
    url?: string
    alt?: string
    sizes?: {
      large?: { url?: string | null }
      xlarge?: { url?: string | null }
      medium?: { url?: string | null }
    }
  }
  if (!imgData.url) return null

  // Use ORIGINAL image for Hero - let Next.js handle optimization once
  // This avoids double compression (Payload resize + Next.js AVIF) which degrades quality
  return { url: imgData.url, alt: imgData.alt || '' }
}

// Helper to generate overlay styles based on settings
export function getOverlayStyles(
  enabled: boolean | null | undefined,
  opacity: string | null | undefined,
  style: string | null | undefined
): { className: string; style: React.CSSProperties } | null {
  if (enabled === false) return null

  const opacityValue = parseInt(opacity || '60') / 100
  const overlayStyle = style || 'gradient'

  // Generate CSS class and inline styles based on overlay style
  switch (overlayStyle) {
    case 'dark':
      return {
        className: 'absolute inset-0 bg-black',
        style: { opacity: opacityValue }
      }
    case 'primary':
      return {
        className: 'absolute inset-0 bg-theme-primary',
        style: { opacity: opacityValue }
      }
    case 'secondary':
      return {
        className: 'absolute inset-0 bg-theme-secondary',
        style: { opacity: opacityValue }
      }
    case 'radial':
      return {
        className: 'absolute inset-0',
        style: {
          background: `radial-gradient(circle at center, transparent 0%, rgba(0,0,0,${opacityValue}) 100%)`
        }
      }
    case 'gradient':
    default:
      return {
        className: 'absolute inset-0',
        style: {
          background: `linear-gradient(to top, rgba(0,0,0,${opacityValue * 1.2}) 0%, rgba(0,0,0,${opacityValue * 0.6}) 50%, rgba(0,0,0,${opacityValue * 0.3}) 100%)`
        }
      }
  }
}

// Height classes mapping
export function getHeightClass(height: string | null | undefined): string {
  const heightClasses = {
    small: 'min-h-[400px] md:min-h-[500px]',
    medium: 'min-h-[500px] md:min-h-[600px]',
    large: 'min-h-[600px] md:min-h-[750px]',
    fullscreen: 'min-h-screen',
  }

  return heightClasses[height as keyof typeof heightClasses] || heightClasses.large
}
