import React from 'react'
import type { RenderHeroProps } from './types'
import { FullscreenHero } from './FullscreenHero'
import { SplitHero } from './SplitHero'
import { MinimalHero } from './MinimalHero'
import { DefaultHero } from './DefaultHero'
import { HeroCarousel } from './HeroCarousel'

export function RenderHero({ type, data, social }: RenderHeroProps) {
  if (!data) return null

  // CAROUSEL HERO - Client Component (needs state for slide management)
  if (type === 'carousel' && data.slides && data.slides.length > 0) {
    return <HeroCarousel data={data} />
  }

  // FULLSCREEN / WITH IMAGE HERO - Server Component
  if (type === 'fullscreen' || type === 'withImage') {
    return <FullscreenHero data={data} social={social} />
  }

  // SPLIT HERO - Server Component
  if (type === 'split') {
    return <SplitHero data={data} />
  }

  // MINIMAL HERO - Server Component
  if (type === 'minimal') {
    return <MinimalHero data={data} />
  }

  // DEFAULT CENTERED HERO - Server Component
  return <DefaultHero data={data} social={social} />
}

export default RenderHero
