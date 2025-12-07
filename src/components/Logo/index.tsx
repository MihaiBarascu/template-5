import React from 'react'
import Image from 'next/image'
import type { Logo as LogoType, Media } from '@/payload-types'

interface LogoProps {
  data: LogoType | null
  businessName?: string
  variant?: 'default' | 'light' | 'dark'
}

// Helper to extract URL from Media field
const getMediaUrl = (media: string | Media | null | undefined): string | undefined => {
  if (!media) return undefined
  if (typeof media === 'string') return undefined
  return media.url ?? undefined
}

export function Logo({ data, businessName, variant = 'default' }: LogoProps) {
  const logoType = data?.type || 'text'
  const logoText = data?.text || businessName || 'Business'
  const height = data?.size?.height || 40

  // Determine which image to use based on variant
  const getImageUrlForVariant = (): string | undefined => {
    if (variant === 'light') {
      const lightUrl = getMediaUrl(data?.imageLight)
      if (lightUrl) return lightUrl
    }
    if (variant === 'dark') {
      const darkUrl = getMediaUrl(data?.imageDark)
      if (darkUrl) return darkUrl
    }
    return getMediaUrl(data?.image)
  }

  const imageUrl = getImageUrlForVariant()

  if (logoType === 'image' && imageUrl) {
    return (
      <Image
        src={imageUrl}
        alt={businessName || 'Logo'}
        width={height * 3}
        height={height}
        style={{ height: `${height}px`, width: 'auto' }}
        className="object-contain"
      />
    )
  }

  if (logoType === 'both' && imageUrl) {
    return (
      <div className="flex items-center gap-3">
        <Image
          src={imageUrl}
          alt={businessName || 'Logo'}
          width={height}
          height={height}
          style={{ height: `${height}px`, width: 'auto' }}
          className="object-contain"
        />
        <span className="font-bold text-lg">{logoText}</span>
      </div>
    )
  }

  // Text only
  return (
    <span className="font-bold text-xl tracking-tight leading-none text-theme-primary">{logoText}</span>
  )
}

export default Logo
