import type { Page, Media } from '@/payload-types'

export interface SocialLinks {
  facebook?: string | null
  instagram?: string | null
  tiktok?: string | null
  youtube?: string | null
  linkedin?: string | null
  twitter?: string | null
}

// Extended hero data type that's compatible with Page['hero'] from Payload
export type HeroData = NonNullable<Page['hero']> & {
  height?: 'small' | 'medium' | 'large' | 'fullscreen' | null
  overlayEnabled?: boolean | null
  overlayOpacity?: string | null
  overlayStyle?: 'gradient' | 'dark' | 'primary' | 'secondary' | 'radial' | null
  videoUrl?: string | null
  videoFile?: Media | string | number | null
  parallax?: boolean | null
  showScrollIndicator?: boolean | null
  showSocialIcons?: boolean | null
  socialIconsPosition?: 'left' | 'right' | null
  badge?: string | null
  // slides is inherited from Page['hero'] - no need to redefine
  statsBadge?: {
    enabled?: boolean | null
    value?: string | null
    label?: string | null
  } | null
}

export type CTAButton = NonNullable<NonNullable<Page['hero']>['ctaButtons']>[number]

export interface RenderHeroProps {
  type: string
  data: HeroData | null
  social?: SocialLinks | null
}
