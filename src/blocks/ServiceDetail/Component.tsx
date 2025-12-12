'use client'

import React from 'react'
import Link from 'next/link'
import {
  Award,
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  DollarSign,
  Target,
  Users,
} from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import type { Service, Team as TeamMember, Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

// Default labels (used as fallbacks when not configured)
const defaultDifficultyLabels: Record<string, string> = {
  beginner: 'Incepator',
  intermediate: 'Intermediar',
  advanced: 'Avansat',
  'all-levels': 'Toate nivelurile',
}

const defaultServiceTypeLabels: Record<string, string> = {
  standard: 'Standard',
  class: 'Clasa',
  individual: 'Sesiune individuala',
  consultation: 'Consultatie',
  treatment: 'Tratament',
}

const defaultDayLabels: Record<string, string> = {
  monday: 'Luni',
  tuesday: 'Marti',
  wednesday: 'Miercuri',
  thursday: 'Joi',
  friday: 'Vineri',
  saturday: 'Sambata',
  sunday: 'Duminica',
}

interface LabelsConfig {
  breadcrumbHome?: string
  breadcrumbServices?: string
  benefitsTitle?: string
  featuresTitle?: string
  scheduleTitle?: string
  pricingTitle?: string
  teamMemberTitle?: string
  requirementsTitle?: string
  viewAllServicesText?: string
  minutesLabel?: string
  spotsLabel?: string
  priceFromLabel?: string
  dropInLabel?: string
  monthlyLabel?: string
  packageLabel?: string
  currencySymbol?: string
  dayLabels?: Record<string, string>
  difficultyLabels?: Record<string, string>
  serviceTypeLabels?: Record<string, string>
  notFoundMessage?: string
}

interface LinksConfig {
  servicesBasePath?: string
  teamBasePath?: string
  bookingPath?: string
}

interface ServiceDetailBlockProps {
  variant?: 'full' | 'compact' | 'hero'
  showBreadcrumb?: boolean
  showSchedule?: boolean
  showPricing?: boolean
  showTeamMember?: boolean
  showBenefits?: boolean
  showFeatures?: boolean
  showRequirements?: boolean
  showRelatedServices?: boolean
  relatedServicesCount?: number
  relatedServicesTitle?: string
  ctaButtonText?: string
  ctaButtonLink?: string
  backgroundColor?: 'default' | 'light' | 'dark'
  serviceData: Service | null
  relatedServices?: Service[]
  labels?: LabelsConfig
  links?: LinksConfig
}

function getDifficultyColor(difficulty: string) {
  const colors: Record<string, string> = {
    beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-yellow-100 text-yellow-700',
    advanced: 'bg-red-100 text-red-700',
    'all-levels': 'bg-blue-100 text-blue-700',
  }
  return colors[difficulty] || colors['all-levels']
}

function _getServiceTypeColor(serviceType: string) {
  const colors: Record<string, string> = {
    standard: 'bg-theme-light text-theme-text-light',
    class: 'bg-purple-100 text-purple-700',
    individual: 'bg-blue-100 text-blue-700',
    consultation: 'bg-teal-100 text-teal-700',
    treatment: 'bg-pink-100 text-pink-700',
  }
  return colors[serviceType] || colors['standard']
}

// Dynamic icon component
function DynamicIcon({ iconName, className }: { iconName?: string; className?: string }) {
  if (!iconName) return null

  const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[iconName]
  if (!IconComponent) return null

  return <IconComponent className={className} />
}

export function ServiceDetailBlock({
  variant = 'full',
  showBreadcrumb = true,
  showSchedule = true,
  showPricing = true,
  showTeamMember = true,
  showBenefits = true,
  showFeatures = true,
  showRequirements: _showRequirements = true,
  showRelatedServices = true,
  relatedServicesTitle = 'Servicii similare',
  ctaButtonText = 'Rezerva acum',
  ctaButtonLink,
  backgroundColor = 'default',
  serviceData,
  relatedServices = [],
  labels = {},
  links = {},
}: ServiceDetailBlockProps) {
  // Merge labels with defaults
  const l = {
    breadcrumbHome: labels.breadcrumbHome || 'Acasa',
    breadcrumbServices: labels.breadcrumbServices || 'Servicii',
    benefitsTitle: labels.benefitsTitle || 'Beneficii',
    featuresTitle: labels.featuresTitle || 'Ce include',
    scheduleTitle: labels.scheduleTitle || 'Program',
    pricingTitle: labels.pricingTitle || 'Preturi',
    teamMemberTitle: labels.teamMemberTitle || 'Responsabil',
    requirementsTitle: labels.requirementsTitle || 'Cerinte / Echipament necesar',
    viewAllServicesText: labels.viewAllServicesText || 'Vezi toate serviciile',
    minutesLabel: labels.minutesLabel || 'minute',
    spotsLabel: labels.spotsLabel || 'locuri',
    priceFromLabel: labels.priceFromLabel || 'de la',
    dropInLabel: labels.dropInLabel || 'Pret per sedinta',
    monthlyLabel: labels.monthlyLabel || 'Abonament lunar',
    packageLabel: labels.packageLabel || 'Pachet {sessions} sedinte',
    currencySymbol: labels.currencySymbol || 'RON',
    notFoundMessage: labels.notFoundMessage || 'Serviciul nu a fost gasit',
  }

  // Merge JSON labels with defaults
  const dayLabels = { ...defaultDayLabels, ...(labels.dayLabels || {}) }
  const difficultyLabels = { ...defaultDifficultyLabels, ...(labels.difficultyLabels || {}) }
  const _serviceTypeLabels = { ...defaultServiceTypeLabels, ...(labels.serviceTypeLabels || {}) }

  // Merge links with defaults
  const paths = {
    servicesBasePath: links.servicesBasePath || '/servicii',
    teamBasePath: links.teamBasePath || '/echipa',
    bookingPath: links.bookingPath || '/rezervare',
  }

  if (!serviceData) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center py-8 bg-theme-light rounded-lg">
            <p className="text-theme-text-muted">{l.notFoundMessage}</p>
          </div>
        </div>
      </section>
    )
  }

  const bgClasses = {
    default: 'bg-theme-surface',
    light: 'bg-theme-light',
    dark: 'bg-theme-dark text-white',
  }

  const image = serviceData.image as MediaType | null
  const assignedTeamMember = serviceData.assignedTeamMember as TeamMember | null
  const teamMemberImage = assignedTeamMember?.image as MediaType | null

  // Get attributes for display
  const attributes = serviceData.attributes || []

  // Check if has attributes to show
  const hasAttributes = attributes.length > 0

  const bookingLink =
    ctaButtonLink || `${paths.bookingPath}?serviciu=${encodeURIComponent(serviceData.title)}`

  // Helper to format package label (kept for future use)
  const _formatPackageLabel = (sessions: number) => {
    return l.packageLabel.replace('{sessions}', sessions.toString())
  }

  // Format price display (kept for future use)
  const _formatPrice = (price: number | null | undefined, isFromPrice?: boolean) => {
    if (!price) return null
    return (
      <span>
        {isFromPrice && <span className="text-sm">{l.priceFromLabel} </span>}
        {price} {l.currencySymbol}
      </span>
    )
  }

  if (variant === 'compact') {
    return (
      <section className={`py-12 ${bgClasses[backgroundColor]}`}>
        <div className="container mx-auto px-4">
          {showBreadcrumb && (
            <Breadcrumb
              serviceName={serviceData.title}
              homeLabel={l.breadcrumbHome}
              servicesLabel={l.breadcrumbServices}
              servicesPath={paths.servicesBasePath}
            />
          )}

          <div className="max-w-4xl mx-auto">
            {/* Hero Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {image?.url && (
                <div className="relative h-64 md:h-96">
                  <Media
                    resource={image}
                    fill
                    size="(max-width: 768px) 100vw, 896px"
                    imgClassName="object-cover"
                  />
                </div>
              )}

              <div className="p-8">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  {serviceData.displayStyle && (
                    <span
                      className="px-3 py-1 rounded-full text-sm font-medium bg-theme-primary/10 text-theme-primary"
                    >
                      {serviceData.displayStyle}
                    </span>
                  )}
                  {serviceData.difficulty && (
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(serviceData.difficulty)}`}
                    >
                      {difficultyLabels[serviceData.difficulty]}
                    </span>
                  )}
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-theme-dark mb-4">
                  {serviceData.title}
                </h1>

                {serviceData.shortDescription && (
                  <p className="text-lg text-theme-text-light mb-6">{serviceData.shortDescription}</p>
                )}

                <div className="flex flex-wrap items-center gap-6 mb-6">
                  {serviceData.durationMinutes && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-theme-primary" />
                      <span className="font-medium">
                        {serviceData.durationMinutes} {l.minutesLabel}
                      </span>
                    </div>
                  )}
                  {serviceData.capacity && (
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-theme-primary" />
                      <span className="font-medium">
                        {serviceData.capacity} {l.spotsLabel}
                      </span>
                    </div>
                  )}
                  {attributes[0] && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-theme-primary" />
                      <span className="font-medium">
                        {attributes[0].value}
                      </span>
                    </div>
                  )}
                </div>

                {serviceData.description && (
                  <div className="prose prose-lg max-w-none mb-6">
                    <RichText data={serviceData.description} />
                  </div>
                )}

                <Link href={bookingLink} className="btn-primary inline-flex items-center gap-2">
                  {ctaButtonText}
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Full variant (default)
  return (
    <section className={`min-h-screen ${bgClasses[backgroundColor]}`}>
      <div className="container mx-auto py-8 px-4">
        {/* Breadcrumb */}
        {showBreadcrumb && (
          <Breadcrumb
            serviceName={serviceData.title}
            homeLabel={l.breadcrumbHome}
            servicesLabel={l.breadcrumbServices}
            servicesPath={paths.servicesBasePath}
          />
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Image Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {image?.url ? (
                <div className="relative h-72 md:h-96 lg:h-[450px]">
                  <Media
                    resource={image}
                    fill
                    size="(max-width: 768px) 100vw, (max-width: 1024px) 66vw, 800px"
                    imgClassName="object-cover"
                    priority
                  />
                </div>
              ) : serviceData.icon ? (
                <div className="h-72 md:h-96 lg:h-[450px] bg-gradient-to-br from-theme-primary/20 to-theme-dark/20 flex items-center justify-center">
                  <DynamicIcon iconName={serviceData.icon} className="w-32 h-32 text-theme-primary/50" />
                </div>
              ) : (
                <div className="h-72 md:h-96 lg:h-[450px] bg-gradient-to-br from-theme-primary/20 to-theme-dark/20 flex items-center justify-center">
                  <div className="text-8xl">🔧</div>
                </div>
              )}

              <div className="p-6 md:p-8">
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  {serviceData.difficulty && (
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-medium ${getDifficultyColor(serviceData.difficulty)}`}
                    >
                      {difficultyLabels[serviceData.difficulty]}
                    </span>
                  )}
                  {serviceData.featured && (
                    <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                      ⭐ Popular
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-theme-dark mb-4">
                  {serviceData.title}
                </h1>

                {/* Description */}
                {serviceData.shortDescription && (
                  <p className="text-lg text-theme-text-light leading-relaxed mb-6">
                    {serviceData.shortDescription}
                  </p>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-6 border-b border-theme-border">
                  {serviceData.durationMinutes && (
                    <div className="text-center">
                      <Clock className="w-8 h-8 text-theme-primary mx-auto mb-2" />
                      <p className="text-2xl font-bold text-theme-dark">{serviceData.durationMinutes}</p>
                      <p className="text-sm text-theme-text-light">{l.minutesLabel}</p>
                    </div>
                  )}
                  {serviceData.capacity && (
                    <div className="text-center">
                      <Users className="w-8 h-8 text-theme-primary mx-auto mb-2" />
                      <p className="text-2xl font-bold text-theme-dark">{serviceData.capacity}</p>
                      <p className="text-sm text-theme-text-light">{l.spotsLabel}</p>
                    </div>
                  )}
                  {assignedTeamMember && (
                    <div className="text-center col-span-2 md:col-span-1">
                      <Award className="w-8 h-8 text-theme-primary mx-auto mb-2" />
                      <p className="text-lg font-bold text-theme-dark">{assignedTeamMember.name}</p>
                      <p className="text-sm text-theme-text-light">{assignedTeamMember.role || l.teamMemberTitle}</p>
                    </div>
                  )}
                </div>

                {/* Rich Text Content */}
                {serviceData.description && (
                  <div className="mt-8 prose prose-lg max-w-none prose-headings:text-theme-dark prose-headings:font-bold prose-p:text-theme-text-light prose-p:leading-relaxed">
                    <RichText data={serviceData.description} />
                  </div>
                )}
              </div>
            </div>

            {/* Features Section (Ce include) */}
            {showFeatures && serviceData.features && serviceData.features.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle className="w-6 h-6 text-theme-primary" />
                  <h2 className="text-2xl font-bold text-theme-dark">{l.featuresTitle}</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {serviceData.features.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-theme-primary flex-shrink-0 mt-0.5" />
                      <span className="text-theme-text-light">{item.feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features Section (previously Benefits) */}
            {showBenefits && serviceData.features && serviceData.features.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Target className="w-6 h-6 text-theme-primary" />
                  <h2 className="text-2xl font-bold text-theme-dark">{l.benefitsTitle}</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {serviceData.features.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-theme-text-light">{item.feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-8 lg:self-start">
            {/* Schedule Card */}
            {showSchedule && serviceData.schedule && serviceData.schedule.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Calendar className="w-6 h-6 text-theme-primary" />
                  <h3 className="text-xl font-bold text-theme-dark">{l.scheduleTitle}</h3>
                </div>
                <div className="space-y-3">
                  {serviceData.schedule.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-3 border-b border-theme-border last:border-0"
                    >
                      <div>
                        <span className="font-medium text-theme-dark">
                          {dayLabels[item.day] || item.day}
                        </span>
                        {item.room && (
                          <span className="block text-sm text-theme-text-light">{item.room}</span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-theme-primary font-bold">{item.startTime}</span>
                        {item.endTime && (
                          <span className="text-theme-text-light"> - {item.endTime}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pricing Card */}
            {showPricing && hasAttributes && (
              <div className="bg-gradient-to-br from-theme-primary to-theme-primary/90 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center gap-3 mb-6">
                  <DollarSign className="w-6 h-6" />
                  <h3 className="text-xl font-bold">{l.pricingTitle}</h3>
                </div>
                <div className="space-y-4">
                  {/* Basic price */}
                  {/* Display attributes (price, duration, etc.) */}
                  {attributes.map((attr, index) => (
                    <div key={index} className={index < attributes.length - 1 ? 'pb-4 border-b border-white/20 mb-4' : ''}>
                      <p className="text-sm text-white/80 mb-1">{attr.label}</p>
                      <p className="text-2xl font-bold">{attr.value}</p>
                    </div>
                  ))}
                </div>
                <Link
                  href={bookingLink}
                  className="mt-6 w-full block text-center bg-white text-theme-primary font-bold py-3 rounded-lg hover:bg-theme-light transition-colors"
                >
                  {ctaButtonText}
                </Link>
              </div>
            )}

            {/* Team Member Card */}
            {showTeamMember && assignedTeamMember && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-theme-dark mb-4">{l.teamMemberTitle}</h3>
                <Link href={`${paths.teamBasePath}/${assignedTeamMember.slug || ''}`} className="block group">
                  <div className="flex items-center gap-4">
                    {teamMemberImage?.url ? (
                      <div className="relative w-16 h-16 rounded-full overflow-hidden">
                        <Media
                          resource={teamMemberImage}
                          fill
                          size="64px"
                          imgClassName="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-theme-primary/20 flex items-center justify-center">
                        <span className="text-2xl font-bold text-theme-primary">
                          {assignedTeamMember.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-theme-dark group-hover:text-theme-primary transition-colors">
                        {assignedTeamMember.name}
                      </p>
                      {assignedTeamMember.role && (
                        <p className="text-sm text-theme-text-light">{assignedTeamMember.role}</p>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Related Services Section */}
        {showRelatedServices && relatedServices.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-theme-dark mb-8">{relatedServicesTitle}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedServices.map((relatedService) => {
                const relatedImage = relatedService.image as MediaType | null

                return (
                  <div
                    key={relatedService.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
                  >
                    <Link href={`${paths.servicesBasePath}/${relatedService.slug}`}>
                      <div className="relative h-48">
                        {relatedImage?.url ? (
                          <Media
                            resource={relatedImage}
                            fill
                            size="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            imgClassName="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : relatedService.icon ? (
                          <div className="h-full bg-gradient-to-br from-theme-primary/20 to-theme-dark/20 flex items-center justify-center">
                            <DynamicIcon iconName={relatedService.icon} className="w-16 h-16 text-theme-primary/50" />
                          </div>
                        ) : (
                          <div className="h-full bg-gradient-to-br from-theme-primary/20 to-theme-dark/20 flex items-center justify-center">
                            <div className="text-4xl">🔧</div>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 p-6 text-white">
                          <h3 className="font-bold text-xl mb-1">{relatedService.title}</h3>
                          <div className="flex items-center gap-3 text-sm">
                            {relatedService.durationMinutes && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {relatedService.durationMinutes} {l.minutesLabel}
                              </span>
                            )}
                            {relatedService.attributes?.[0] && (
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                {relatedService.attributes[0].value}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                )
              })}
            </div>

            {/* View All Services Button */}
            <div className="text-center mt-8">
              <Link
                href={paths.servicesBasePath}
                className="btn-primary inline-flex items-center gap-2"
              >
                {l.viewAllServicesText}
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

// Breadcrumb component - now fully configurable
interface BreadcrumbProps {
  serviceName: string
  homeLabel: string
  servicesLabel: string
  servicesPath: string
}

function Breadcrumb({ serviceName, homeLabel, servicesLabel, servicesPath }: BreadcrumbProps) {
  return (
    <nav className="mb-8">
      <ol className="flex items-center space-x-2 text-sm text-theme-text-light">
        <li>
          <Link href="/" className="hover:text-theme-primary transition-colors">
            {homeLabel}
          </Link>
        </li>
        <li>
          <ChevronRight className="w-4 h-4" />
        </li>
        <li>
          <Link href={servicesPath} className="hover:text-theme-primary transition-colors">
            {servicesLabel}
          </Link>
        </li>
        <li>
          <ChevronRight className="w-4 h-4" />
        </li>
        <li className="text-theme-dark font-medium">{serviceName}</li>
      </ol>
    </nav>
  )
}

export default ServiceDetailBlock
