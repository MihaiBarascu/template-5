'use client'

import Image from 'next/image'
import Link from 'next/link'
import * as LucideIcons from 'lucide-react'
import { ArrowLeft, Clock, Users, Calendar, MapPin, Check, Sparkles } from 'lucide-react'
import RichText from '@/components/RichText'
import type { Service, Media, Team } from '@/payload-types'
import { cn } from '@/utilities/cn'

// Day translation map
const dayTranslations: Record<string, string> = {
  monday: 'Luni',
  tuesday: 'Marți',
  wednesday: 'Miercuri',
  thursday: 'Joi',
  friday: 'Vineri',
  saturday: 'Sâmbătă',
  sunday: 'Duminică',
}

// Difficulty translation map
const difficultyTranslations: Record<string, string> = {
  beginner: 'Începător',
  intermediate: 'Intermediar',
  advanced: 'Avansat',
  'all-levels': 'Toate nivelurile',
}

// Difficulty color map
const difficultyColors: Record<string, string> = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800',
  'all-levels': 'bg-blue-100 text-blue-800',
}

// Get Lucide icon by name
function getIcon(iconName: string | null | undefined, className: string = 'w-6 h-6') {
  if (!iconName) return <Sparkles className={className} />

  const normalizedName = iconName
    .split(/[-_\s]/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (LucideIcons as any)[normalizedName]

  if (IconComponent) {
    return <IconComponent className={className} />
  }

  return <Sparkles className={className} />
}

interface ServiceDetailProps {
  service: Service
  backLink?: string
  backLabel?: string
  ctaLabel?: string
  ctaLink?: string
}

export function ServiceDetail({
  service,
  backLink = '/servicii',
  backLabel = 'Înapoi la servicii',
  ctaLabel,
  ctaLink = '/contact',
}: ServiceDetailProps) {
  // Safely extract related data
  const image = typeof service.image === 'object' ? (service.image as Media) : null
  const instructor = typeof service.assignedTeamMember === 'object' ? (service.assignedTeamMember as Team) : null
  const instructorImage = instructor && typeof instructor.image === 'object' ? (instructor.image as Media) : null

  // Check if schedule exists (for advanced services like classes)
  const hasSchedule = service.schedule && service.schedule.length > 0

  // Get CTA label
  const buttonLabel = ctaLabel || service.ctaLabel || 'Contactează-ne'

  return (
    <main className="min-h-screen bg-theme-surface">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px]">
        {image?.url ? (
          <Image
            src={image.url}
            alt={image.alt || service.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-theme-primary to-theme-primary/80" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-12">
            {/* Back Link */}
            <Link
              href={backLink}
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {backLabel}
            </Link>

            {/* Difficulty Badge */}
            {service.difficulty && (
              <div className="flex flex-wrap gap-3 mb-4">
                <span className={cn(
                  'px-3 py-1 text-sm font-medium rounded-full',
                  difficultyColors[service.difficulty] || 'bg-theme-light text-theme-text'
                )}>
                  {difficultyTranslations[service.difficulty] || service.difficulty}
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              {service.title}
            </h1>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-6 text-white/90">
              {service.duration && (
                <span className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  {service.duration}
                </span>
              )}
              {service.capacity && (
                <span className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Max {service.capacity} persoane
                </span>
              )}
              {service.price && (
                <span className="text-2xl font-bold text-white">
                  {service.price}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              {service.shortDescription && (
                <p className="text-xl text-theme-text-light leading-relaxed">
                  {service.shortDescription}
                </p>
              )}

              {service.description && (
                <div className="prose prose-lg max-w-none">
                  <RichText data={service.description} enableGutter={false} />
                </div>
              )}

              {/* Attributes */}
              {service.attributes && service.attributes.length > 0 && (
                <div className="bg-theme-light rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-theme-text mb-6">
                    Detalii serviciu
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {service.attributes.map((attr, index) => (
                      <div key={attr.id || index} className="flex items-center gap-3 p-3 bg-white rounded-lg">
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-theme-primary/10 flex items-center justify-center text-theme-primary">
                          {getIcon(attr.icon, 'w-5 h-5')}
                        </div>
                        <div>
                          <div className="text-sm text-theme-text-muted">{attr.label}</div>
                          <div className="font-semibold text-theme-text">{attr.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Features */}
              {service.features && service.features.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-theme-text mb-6">Ce include</h2>
                  <ul className="grid md:grid-cols-2 gap-4">
                    {service.features.map((item, index) => (
                      <li key={item.id || index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-theme-primary flex-shrink-0 mt-0.5" />
                        <span className="text-theme-text">{item.feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Schedule */}
              {hasSchedule && service.schedule && (
                <div>
                  <h2 className="text-2xl font-bold text-theme-text mb-6 flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-theme-primary" />
                    Program săptămânal
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {service.schedule.map((session, index) => (
                      <div
                        key={session.id || index}
                        className="bg-theme-surface border border-theme-border rounded-xl p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="font-semibold text-theme-text mb-2">
                          {dayTranslations[session.day] || session.day}
                        </div>
                        <div className="text-theme-primary font-medium">
                          {session.startTime}
                          {session.endTime && ` - ${session.endTime}`}
                        </div>
                        {session.room && (
                          <div className="flex items-center gap-2 text-theme-text-muted text-sm mt-2">
                            <MapPin className="w-4 h-4" />
                            {session.room}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Pricing Card */}
              <div className="bg-theme-surface border border-theme-border rounded-2xl p-6 shadow-sm sticky top-24">
                {/* Main Price */}
                {service.price && (
                  <div className="mb-6">
                    <div className="text-3xl font-bold text-theme-primary">
                      {service.price}
                    </div>
                    {service.duration && (
                      <div className="text-theme-text-muted flex items-center gap-1 mt-1">
                        <Clock className="w-4 h-4" />
                        {service.duration}
                      </div>
                    )}
                  </div>
                )}

                {/* CTA Button */}
                <Link
                  href={service.ctaLink || ctaLink}
                  className="w-full inline-flex items-center justify-center px-6 py-3 bg-theme-primary text-white font-semibold rounded-xl hover:bg-theme-secondary transition-colors"
                >
                  {buttonLabel}
                </Link>
              </div>

              {/* Instructor Card */}
              {instructor && (
                <div className="bg-theme-surface border border-theme-border rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-theme-text mb-4">Instructor</h3>
                  <div className="flex items-center gap-4">
                    {instructorImage?.url ? (
                      <Image
                        src={instructorImage.url}
                        alt={instructorImage.alt || instructor.name}
                        width={64}
                        height={64}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-theme-primary/10 flex items-center justify-center">
                        <Users className="w-8 h-8 text-theme-primary" />
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-theme-text">{instructor.name}</div>
                      {instructor.role && (
                        <div className="text-sm text-theme-text-muted">{instructor.role}</div>
                      )}
                    </div>
                  </div>
                  {instructor.bio && (
                    <div className="mt-4 text-sm text-theme-text-muted line-clamp-3">
                      <RichText data={instructor.bio} enableGutter={false} enableProse={false} />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default ServiceDetail
