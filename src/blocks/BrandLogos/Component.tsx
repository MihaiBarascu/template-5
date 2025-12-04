'use client'

import React from 'react'
import Image from 'next/image'
import { cn } from '@/utilities/cn'
import type { Media } from '@/payload-types'

interface Logo {
  image: string | Media
  name?: string | null
  link?: string | null
  id?: string | null
}

interface Section {
  title: string
  logos?: Logo[] | null
  id?: string | null
}

interface BrandLogosBlockProps {
  variant?: string | null
  heading?: string | null
  subheading?: string | null
  source?: string | null
  logos?: Logo[] | null
  sections?: Section[] | null
  grayscale?: boolean | null
  autoplay?: boolean | null
  logoSize?: string | null
  backgroundColor?: string | null
}

// Helper to extract image URL from Payload Media
function getImageUrl(image: string | Media | null | undefined): string | null {
  if (!image) return null
  if (typeof image === 'string') return image
  return image.url || null
}

export function BrandLogosBlock({
  variant = 'row',
  heading,
  subheading,
  source = 'custom',
  logos = [],
  sections = [],
  grayscale = true,
  logoSize = 'medium',
  backgroundColor = 'default',
}: BrandLogosBlockProps) {
  const logoList = source === 'custom' ? logos || [] : []
  const sectionList = source === 'sections' ? sections || [] : []
  const bgColor = backgroundColor || 'default'
  const size = logoSize || 'medium'

  const bgClass =
    {
      default: 'bg-white',
      light: 'bg-gray-50',
      dark: 'bg-gray-900 text-white',
    }[bgColor] || 'bg-white'

  const textMuted = bgColor === 'dark' ? 'text-gray-400' : 'text-gray-600'

  const sizeClass =
    {
      small: 'h-8',
      medium: 'h-12',
      large: 'h-16',
    }[size] || 'h-12'

  const LogoItem = ({ logo }: { logo: Logo }) => {
    const logoUrl = getImageUrl(logo.image)
    const logoAlt = logo.name || (typeof logo.image !== 'string' ? logo.image?.alt : null) || 'Brand logo'
    const content = (
      <div
        className={cn(
          'flex items-center justify-center p-4 transition-all duration-300',
          grayscale && 'grayscale hover:grayscale-0 opacity-60 hover:opacity-100'
        )}
      >
        {logoUrl && (
          <div className={cn('relative w-24', sizeClass)}>
            <Image
              src={logoUrl}
              alt={logoAlt}
              fill
              sizes="96px"
              className="object-contain"
            />
          </div>
        )}
      </div>
    )

    if (logo.link) {
      return (
        <a
          href={logo.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
          title={logo.name || undefined}
        >
          {content}
        </a>
      )
    }

    return content
  }

  if (variant === 'slider') {
    return (
      <section className={cn('py-12 overflow-hidden', bgClass)}>
        <div className="container mx-auto px-4">
          {(heading || subheading) && (
            <div className="text-center mb-8">
              {heading && <h2 className="text-2xl font-bold mb-2">{heading}</h2>}
              {subheading && <p className={cn('text-base', textMuted)}>{subheading}</p>}
            </div>
          )}
        </div>

        <div className="relative">
          <div className="flex animate-scroll gap-12 py-4">
            {[...logoList, ...logoList].map((logo, idx) => (
              <div key={`${logo.id || idx}-${idx}`} className="flex-shrink-0">
                <LogoItem logo={logo} />
              </div>
            ))}
          </div>
        </div>

        <style jsx>{`
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .animate-scroll {
            animation: scroll 30s linear infinite;
          }
          .animate-scroll:hover {
            animation-play-state: paused;
          }
        `}</style>
      </section>
    )
  }

  if (variant === 'grid') {
    return (
      <section className={cn('py-16', bgClass)}>
        <div className="container mx-auto px-4">
          {(heading || subheading) && (
            <div className="text-center mb-12">
              {heading && <h2 className="text-2xl font-bold mb-2">{heading}</h2>}
              {subheading && <p className={cn('text-base', textMuted)}>{subheading}</p>}
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {logoList.map((logo, idx) => (
              <div
                key={logo.id || idx}
                className={cn(
                  'flex items-center justify-center p-4 rounded-lg',
                  backgroundColor === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                )}
              >
                <LogoItem logo={logo} />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'titled') {
    return (
      <section className={cn('py-16', bgClass)}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            {heading && <h2 className="text-2xl font-bold mb-4">{heading}</h2>}
            {subheading && (
              <p className={cn('text-base max-w-2xl mx-auto', textMuted)}>{subheading}</p>
            )}
          </div>

          <div
            className={cn(
              'flex flex-wrap items-center justify-center gap-8 p-8 rounded-xl',
              backgroundColor === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
            )}
          >
            {logoList.map((logo, idx) => (
              <LogoItem key={logo.id || idx} logo={logo} />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'sectioned' && source === 'sections') {
    return (
      <section className={cn('py-16', bgClass)}>
        <div className="container mx-auto px-4">
          {(heading || subheading) && (
            <div className="text-center mb-12">
              {heading && <h2 className="text-2xl font-bold mb-2">{heading}</h2>}
              {subheading && <p className={cn('text-base', textMuted)}>{subheading}</p>}
            </div>
          )}

          <div className="space-y-12">
            {sectionList.map((section, sIdx) => (
              <div key={section.id || sIdx}>
                <h3 className="text-lg font-semibold mb-6 text-center">{section.title}</h3>
                <div className="flex flex-wrap items-center justify-center gap-8">
                  {(section.logos || []).map((logo, lIdx) => (
                    <LogoItem key={logo.id || lIdx} logo={logo} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Default: row
  return (
    <section className={cn('py-12', bgClass)}>
      <div className="container mx-auto px-4">
        {(heading || subheading) && (
          <div className="text-center mb-8">
            {heading && <h2 className="text-xl font-semibold mb-2">{heading}</h2>}
            {subheading && <p className={cn('text-sm', textMuted)}>{subheading}</p>}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {logoList.map((logo, idx) => (
            <LogoItem key={logo.id || idx} logo={logo} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default BrandLogosBlock
