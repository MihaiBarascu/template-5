import React from 'react'
import Image from 'next/image'

interface LogoProps {
  data: any
  businessName?: string
  variant?: 'default' | 'light' | 'dark'
}

export function Logo({ data, businessName, variant = 'default' }: LogoProps) {
  const logoType = data?.type || 'text'
  const logoText = data?.text || businessName || 'Business'
  const logoImage = data?.image
  const logoImageLight = data?.imageLight
  const logoImageDark = data?.imageDark
  const height = data?.size?.height || 40

  // Determine which image to use based on variant
  const getImageUrl = () => {
    if (variant === 'light' && logoImageLight?.url) {
      return logoImageLight.url
    }
    if (variant === 'dark' && logoImageDark?.url) {
      return logoImageDark.url
    }
    return logoImage?.url
  }

  const imageUrl = getImageUrl()

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
    <span className="font-bold text-xl tracking-tight">{logoText}</span>
  )
}

export default Logo
