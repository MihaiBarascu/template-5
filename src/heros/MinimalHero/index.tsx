import React from 'react'
import type { HeroData } from '../types'

interface MinimalHeroProps {
  data: HeroData
}

export function MinimalHero({ data }: MinimalHeroProps) {
  const { headline, subheadline } = data

  return (
    <section className="relative bg-gradient-to-r from-theme-primary to-theme-primary-dark py-12 md:py-16 overflow-hidden">
      {/* Subtle decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-black/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        {headline && (
          <h1 className="heading-h1 font-bold text-white mb-2 animate-fade-in-up">
            {headline}
          </h1>
        )}

        {subheadline && (
          <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto animate-fade-in-up animation-delay-100">
            {subheadline}
          </p>
        )}
      </div>
    </section>
  )
}

export default MinimalHero
