'use client'

import React from 'react'
import Image from 'next/image'
import { cn } from '@/utilities/cn'

interface TeamMember {
  id: string
  name: string
  role?: string
  bio?: string
  experience?: string
  image?: {
    url: string
    alt?: string
  }
  specializations?: Array<{ specialization: string }>
  featured?: boolean
}

interface TeamBlockProps {
  variant?: string
  heading?: string
  subheading?: string
  source?: string
  limit?: number
  onlyFeatured?: boolean
  showRole?: boolean
  showBio?: boolean
  showSocial?: boolean
  showContact?: boolean
  columns?: string
  backgroundColor?: string
  members?: TeamMember[]
}

export function TeamBlock({
  variant = 'grid',
  heading,
  subheading,
  showRole = true,
  showBio = false,
  columns = '4',
  backgroundColor = 'default',
  members = [],
}: TeamBlockProps) {
  const bgClass = {
    default: 'bg-white',
    light: 'bg-gray-50',
    dark: 'bg-gray-900 text-white',
  }[backgroundColor] || 'bg-white'

  const getGridCols = () => {
    switch (columns) {
      case '2':
        return 'md:grid-cols-2'
      case '3':
        return 'md:grid-cols-2 lg:grid-cols-3'
      default:
        return 'md:grid-cols-2 lg:grid-cols-4'
    }
  }

  if (members.length === 0) {
    return (
      <section className={cn('py-16', bgClass)}>
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-500">Nu sunt membri in echipa.</p>
        </div>
      </section>
    )
  }

  return (
    <section className={cn('py-16', bgClass)}>
      <div className="container mx-auto px-4">
        {(heading || subheading) && (
          <div className="text-center mb-12">
            {heading && (
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{heading}</h2>
            )}
            {subheading && (
              <p className={cn('text-lg max-w-2xl mx-auto', backgroundColor === 'dark' ? 'text-gray-300' : 'text-gray-600')}>
                {subheading}
              </p>
            )}
          </div>
        )}

        {variant === 'list' ? (
          <div className="space-y-6 max-w-4xl mx-auto">
            {members.map((member) => (
              <div
                key={member.id}
                className={cn(
                  'flex items-center gap-6 p-6 rounded-lg border',
                  backgroundColor === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
                )}
              >
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                  {member.image?.url ? (
                    <Image
                      src={member.image.url}
                      alt={member.image.alt || member.name}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-theme-primary text-white text-2xl font-bold">
                      {member.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{member.name}</h3>
                  {showRole && member.role && (
                    <p className={cn('text-sm', backgroundColor === 'dark' ? 'text-gray-400' : 'text-theme-primary')}>
                      {member.role}
                    </p>
                  )}
                  {member.experience && (
                    <p className={cn('text-sm mt-1', backgroundColor === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
                      {member.experience}
                    </p>
                  )}
                  {showBio && member.bio && (
                    <p className={cn('mt-2 text-sm', backgroundColor === 'dark' ? 'text-gray-300' : 'text-gray-600')}>
                      {member.bio}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={cn('grid gap-8', getGridCols())}>
            {members.map((member) => (
              <div
                key={member.id}
                className={cn(
                  'text-center group',
                  variant === 'grid-centered' && 'flex flex-col items-center'
                )}
              >
                <div className={cn(
                  'relative w-48 h-48 mx-auto mb-4 rounded-lg overflow-hidden',
                  variant === 'grid-centered' && 'rounded-full'
                )}>
                  {member.image?.url ? (
                    <Image
                      src={member.image.url}
                      alt={member.image.alt || member.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-theme-primary to-theme-secondary text-white text-4xl font-bold">
                      {member.name.charAt(0)}
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-semibold">{member.name}</h3>
                {showRole && member.role && (
                  <p className={cn('text-sm', backgroundColor === 'dark' ? 'text-gray-400' : 'text-theme-primary')}>
                    {member.role}
                  </p>
                )}
                {member.experience && (
                  <p className={cn('text-xs mt-1', backgroundColor === 'dark' ? 'text-gray-500' : 'text-gray-500')}>
                    {member.experience}
                  </p>
                )}
                {member.specializations && member.specializations.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-1 mt-2">
                    {member.specializations.slice(0, 3).map((spec, index) => (
                      <span
                        key={index}
                        className={cn(
                          'text-xs px-2 py-0.5 rounded-full',
                          backgroundColor === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                        )}
                      >
                        {spec.specialization}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default TeamBlock
