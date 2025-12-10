import type { Page } from '@/payload-types'

export interface SocialLinks {
  facebook?: string | null
  instagram?: string | null
  tiktok?: string | null
  youtube?: string | null
  linkedin?: string | null
  twitter?: string | null
}

export type HeroData = NonNullable<Page['hero']> & {
  height?: 'small' | 'medium' | 'large' | 'fullscreen' | null
  overlayEnabled?: boolean | null
  overlayOpacity?: string | null
  overlayStyle?: 'gradient' | 'dark' | 'primary' | 'secondary' | 'radial' | null
  videoUrl?: string | null
  parallax?: boolean | null
  showScrollIndicator?: boolean | null
  showSocialIcons?: boolean | null
  socialIconsPosition?: 'left' | 'right' | null
  badge?: string | null
  slides?: Array<{
    image?: { url?: string; alt?: string } | string | null
    headline?: string
    subheadline?: string
  }> | null
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
