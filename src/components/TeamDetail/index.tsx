'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Mail, Phone, Calendar } from 'lucide-react'
import RichText from '@/components/RichText'
import type { Team, Media, Service } from '@/payload-types'
import { cn } from '@/utilities/cn'

// Day translation map
const dayTranslations: Record<string, string> = {
  luni: 'Luni',
  marti: 'Marți',
  miercuri: 'Miercuri',
  joi: 'Joi',
  vineri: 'Vineri',
  sambata: 'Sâmbătă',
  duminica: 'Duminică',
}

// Social Media Icons
const SocialIcons: Record<string, React.ReactNode> = {
  facebook: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  instagram: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
    </svg>
  ),
  linkedin: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  twitter: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
}

interface TeamDetailProps {
  member: Team
  backLink?: string
  backLabel?: string
  services?: Service[]
}

export function TeamDetail({
  member,
  backLink = '/echipa',
  backLabel = 'Înapoi la echipă',
  services = []
}: TeamDetailProps) {
  // Safely extract related data
  const image = typeof member.image === 'object' ? (member.image as Media) : null

  // Filter services assigned to this team member
  const assignedServices = services.filter(service => {
    const assignedMember = service.assignedTeamMember
    if (!assignedMember) return false
    if (typeof assignedMember === 'string') return assignedMember === member.id
    return assignedMember.id === member.id
  })

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-primary/5 py-16 md:py-24">
        <div className="container mx-auto px-4">
          {/* Back Link */}
          <Link
            href={backLink}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {backLabel}
          </Link>

          <div className="grid lg:grid-cols-3 gap-12 items-start">
            {/* Image Column */}
            <div className="lg:col-span-1">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
                {image?.url ? (
                  <Image
                    src={image.url}
                    alt={image.alt || member.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                    <span className="text-8xl font-bold text-white/30">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                )}
                {/* Featured Badge */}
                {member.featured && (
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold bg-amber-500 text-white rounded-full shadow-lg">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Top Specialist
                    </span>
                  </div>
                )}
              </div>

              {/* Social Links */}
              {member.social && Object.values(member.social).some(v => v) && (
                <div className="flex justify-center gap-3 mt-6">
                  {Object.entries(member.social).map(([platform, url]) => {
                    if (!url) return null
                    return (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-11 h-11 rounded-full bg-white shadow-md flex items-center justify-center text-muted-foreground hover:text-primary hover:shadow-lg transition-all"
                      >
                        {SocialIcons[platform]}
                      </a>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Info Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Name & Role */}
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                  {member.name}
                </h1>
                {member.role && (
                  <p className="text-xl text-primary font-medium">
                    {member.role}
                  </p>
                )}
                {member.experience && (
                  <p className="text-muted-foreground mt-2">
                    {member.experience}
                  </p>
                )}
              </div>

              {/* Specializations */}
              {member.specializations && member.specializations.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {member.specializations.filter(s => s.specialization).map((spec, idx) => (
                    <span
                      key={spec.id || idx}
                      className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium"
                    >
                      {spec.specialization}
                    </span>
                  ))}
                </div>
              )}

              {/* Bio */}
              {member.bio && (
                <div className="prose prose-lg max-w-none">
                  <RichText data={member.bio} enableGutter={false} />
                </div>
              )}

              {/* Contact Info */}
              {member.contact && (member.contact.email || member.contact.phone) && (
                <div className="flex flex-wrap gap-4 pt-4">
                  {member.contact.email && (
                    <a
                      href={`mailto:${member.contact.email}`}
                      className="inline-flex items-center gap-2 px-5 py-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow text-foreground"
                    >
                      <Mail className="w-5 h-5 text-primary" />
                      {member.contact.email}
                    </a>
                  )}
                  {member.contact.phone && (
                    <a
                      href={`tel:${member.contact.phone}`}
                      className="inline-flex items-center gap-2 px-5 py-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow text-foreground"
                    >
                      <Phone className="w-5 h-5 text-primary" />
                      {member.contact.phone}
                    </a>
                  )}
                </div>
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
              {/* Services/Specialties */}
              {assignedServices.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    Servicii oferite
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {assignedServices.map((service) => {
                      const serviceImage = typeof service.image === 'object' ? (service.image as Media) : null
                      return (
                        <Link
                          key={service.id}
                          href={`/servicii/${service.slug}`}
                          className="group flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:shadow-lg hover:border-primary/30 transition-all"
                        >
                          {serviceImage?.url && (
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={serviceImage.url}
                                alt={serviceImage.alt || service.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div>
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {service.title}
                            </h3>
                            {service.shortDescription && (
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {service.shortDescription}
                              </p>
                            )}
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Schedule Card */}
              {member.schedule && member.schedule.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Program
                  </h3>
                  <div className="space-y-3">
                    {member.schedule.map((slot, index) => (
                      <div
                        key={slot.id || index}
                        className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                      >
                        <span className="font-medium text-foreground">
                          {slot.day ? dayTranslations[slot.day] || slot.day : ''}
                        </span>
                        <span className={cn(
                          'text-sm',
                          slot.hours?.toLowerCase() === 'inchis'
                            ? 'text-red-500'
                            : 'text-muted-foreground'
                        )}>
                          {slot.hours || '-'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Card */}
              <div className="bg-primary text-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold mb-2">
                  Programează o consultație
                </h3>
                <p className="text-white/80 text-sm mb-4">
                  Ia legătura cu {member.name.split(' ')[0]} pentru o programare.
                </p>
                <Link
                  href="/contact"
                  className="w-full inline-flex items-center justify-center px-6 py-3 bg-white text-primary font-semibold rounded-xl hover:bg-white/90 transition-colors"
                >
                  Programează-te acum
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default TeamDetail
