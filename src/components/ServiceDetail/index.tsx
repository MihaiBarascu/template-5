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
  relatedServices?: Service[]
  relatedServicesTitle?: string
}

export function ServiceDetail({
  service,
  backLink = '/servicii',
  backLabel = 'Înapoi la servicii',
  ctaLabel,
  ctaLink = '/contact',
  relatedServices = [],
  relatedServicesTitle = 'Terapii recomandate',
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
      {/* Split Hero Section */}
      <section className="bg-theme-surface">
        <div className="container mx-auto px-4 py-8">
          {/* Back Link */}
          <Link
            href={backLink}
            className="inline-flex items-center gap-2 text-theme-text-light hover:text-theme-primary mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {backLabel}
          </Link>

          {/* Split Layout: Image left, Content right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left: Image at natural aspect ratio */}
            <div className="relative">
              {image?.url ? (
                <div className="relative rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src={image.url}
                    alt={image.alt || service.title}
                    width={image.width || 600}
                    height={image.height || 500}
                    className="w-full h-auto object-cover"
                    priority
                  />
                </div>
              ) : (
                <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-theme-primary to-theme-primary/80 flex items-center justify-center">
                  {getIcon(service.icon, 'w-24 h-24 text-white/50')}
                </div>
              )}
            </div>

            {/* Right: Content */}
            <div className="space-y-6">
              {/* Badges */}
              <div className="flex flex-wrap gap-3">
                {service.featured && (
                  <span className="px-3 py-1 text-sm font-medium rounded-full bg-theme-accent text-theme-text-on-accent">
                    Popular
                  </span>
                )}
                {service.difficulty && (
                  <span className={cn(
                    'px-3 py-1 text-sm font-medium rounded-full',
                    difficultyColors[service.difficulty] || 'bg-theme-light text-theme-text'
                  )}>
                    {difficultyTranslations[service.difficulty] || service.difficulty}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-theme-text">
                {service.title}
              </h1>

              {/* Short Description */}
              {service.shortDescription && (
                <p className="text-lg text-theme-text-light leading-relaxed">
                  {service.shortDescription}
                </p>
              )}

              {/* Quick Stats */}
              <div className="flex flex-wrap items-center gap-6 py-4 border-y border-theme-border">
                {service.duration && (
                  <span className="flex items-center gap-2 text-theme-text">
                    <Clock className="w-5 h-5 text-theme-primary" />
                    {service.duration}
                  </span>
                )}
                {service.capacity && (
                  <span className="flex items-center gap-2 text-theme-text">
                    <Users className="w-5 h-5 text-theme-primary" />
                    Max {service.capacity} persoane
                  </span>
                )}
                {service.price && (
                  <span className="text-xl font-bold text-theme-primary">
                    {service.price}
                  </span>
                )}
              </div>

              {/* Features - all displayed with theme color */}
              {service.features && service.features.length > 0 && (
                <div className="space-y-3">
                  {service.features.map((item, index) => (
                    <div key={item.id || index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-theme-accent flex-shrink-0 mt-0.5" />
                      <span className="text-theme-text">{item.feature}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* CTA Button */}
              <div className="pt-4">
                <Link
                  href={ctaLink}
                  className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4"
                >
                  {buttonLabel}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section - Full width, no sidebar */}
      {(service.description || (service.attributes && service.attributes.length > 0) || hasSchedule || instructor) && (
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Full Description */}
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

              {/* Instructor */}
              {instructor && (
                <div className="bg-theme-surface border border-theme-border rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-theme-text mb-4">Terapeut</h3>
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
                    <p className="mt-4 text-sm text-theme-text-muted line-clamp-3">
                      {instructor.bio}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <section className="py-12 md:py-16 bg-theme-light">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-theme-text text-center mb-8">
              {relatedServicesTitle}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {relatedServices.map((related) => {
                const relatedImage = typeof related.image === 'object' ? (related.image as Media) : null
                return (
                  <Link
                    key={related.id}
                    href={`${backLink}/${related.slug}`}
                    className="group bg-white rounded-xl overflow-hidden shadow-sm border border-theme-border hover:shadow-lg transition-all duration-300"
                  >
                    {relatedImage?.url ? (
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={relatedImage.url}
                          alt={relatedImage.alt || related.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="h-48 bg-gradient-to-br from-theme-primary/20 to-theme-primary/5 flex items-center justify-center">
                        {getIcon(related.icon, 'w-16 h-16 text-theme-primary/30')}
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="font-semibold text-theme-text group-hover:text-theme-primary transition-colors text-lg mb-2">
                        {related.title}
                      </h3>
                      {related.shortDescription && (
                        <p className="text-sm text-theme-text-light line-clamp-2 mb-3">
                          {related.shortDescription}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        {related.price && (
                          <span className="text-theme-primary font-bold">{related.price}</span>
                        )}
                        {related.duration && (
                          <span className="text-sm text-theme-text-muted flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {related.duration}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}

export default ServiceDetail
