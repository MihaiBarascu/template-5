'use client'

import React from 'react'
import Link from 'next/link'
import {
  Award,
  Calendar,
  ChevronRight,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  Target,
  Twitter,
} from 'lucide-react'
import type { Team as TeamMember, Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { getBgClasses } from '@/blocks/_shared/themeHelpers'

interface LabelsConfig {
  breadcrumbHome?: string
  breadcrumbTeam?: string
  experienceTitle?: string
  specializationsTitle?: string
  scheduleTitle?: string
  contactTitle?: string
  ctaTitle?: string
  ctaDescription?: string
  ctaButtonText?: string
  ctaSecondaryButtonText?: string
  viewAllTeamText?: string
  notFoundMessage?: string
}

interface LinksConfig {
  teamBasePath?: string
  contactPath?: string
  classesPath?: string
  bookingPath?: string
}

interface TeamMemberDetailBlockProps {
  variant?: 'full' | 'compact' | 'hero'
  showBreadcrumb?: boolean
  showExperience?: boolean
  showSpecializations?: boolean
  showContact?: boolean
  showSocialMedia?: boolean
  showSchedule?: boolean
  showCTA?: boolean
  showRelatedMembers?: boolean
  relatedMembersCount?: number
  relatedMembersTitle?: string
  backgroundColor?: 'default' | 'light' | 'dark'
  memberData: TeamMember | null
  relatedMembers?: TeamMember[]
  labels?: LabelsConfig
  links?: LinksConfig
}

export function TeamMemberDetailBlock({
  variant: _variant = 'full',
  showBreadcrumb = true,
  showExperience = true,
  showSpecializations = true,
  showContact = true,
  showSocialMedia = true,
  showSchedule = false,
  showCTA = true,
  showRelatedMembers = true,
  relatedMembersTitle = 'Alti membri ai echipei',
  backgroundColor = 'default',
  memberData,
  relatedMembers = [],
  labels = {},
  links = {},
}: TeamMemberDetailBlockProps) {
  // Merge labels with defaults
  const l = {
    breadcrumbHome: labels.breadcrumbHome || 'Acasa',
    breadcrumbTeam: labels.breadcrumbTeam || 'Echipa',
    experienceTitle: labels.experienceTitle || 'Ani experienta',
    specializationsTitle: labels.specializationsTitle || 'Specializari',
    scheduleTitle: labels.scheduleTitle || 'Program',
    contactTitle: labels.contactTitle || 'Contact',
    ctaTitle: labels.ctaTitle || 'Vrei sa lucrezi cu {name}?',
    ctaDescription: labels.ctaDescription || 'Contacteaza-ne pentru a programa o sesiune de antrenament sau pentru mai multe informatii.',
    ctaButtonText: labels.ctaButtonText || 'Contacteaza-ne',
    ctaSecondaryButtonText: labels.ctaSecondaryButtonText || 'Vezi clasele disponibile',
    viewAllTeamText: labels.viewAllTeamText || 'Vezi toti membrii echipei',
    notFoundMessage: labels.notFoundMessage || 'Membrul echipei nu a fost gasit',
  }

  // Merge links with defaults
  const paths = {
    teamBasePath: links.teamBasePath || '/antrenori',
    contactPath: links.contactPath || '/contact',
    classesPath: links.classesPath || '/clase',
    bookingPath: links.bookingPath || '/clase/inscriere',
  }

  if (!memberData) {
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

  const bgClass = getBgClasses(backgroundColor) || 'bg-theme-surface'

  const image = memberData.image as MediaType | null
  const firstName = memberData.name?.split(' ')[0] || ''
  const ctaTitleFormatted = l.ctaTitle.replace('{name}', firstName)

  // Parse experience number from string like "10+ ani" or "8"
  const experienceYears = memberData.experience?.match(/\d+/)?.[0] || memberData.experience

  // Full variant (default) - matching template-2's design
  return (
    <section className={`min-h-screen ${bgClass}`}>
      <article className="container mx-auto py-8 px-4">
        {/* Breadcrumb */}
        {showBreadcrumb && (
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-theme-text-muted">
              <li>
                <Link href="/" className="hover:text-theme-primary transition-colors">
                  {l.breadcrumbHome}
                </Link>
              </li>
              <li>
                <ChevronRight className="w-4 h-4" />
              </li>
              <li>
                <Link
                  href={paths.teamBasePath}
                  className="hover:text-theme-primary transition-colors"
                >
                  {l.breadcrumbTeam}
                </Link>
              </li>
              <li>
                <ChevronRight className="w-4 h-4" />
              </li>
              <li className="text-theme-dark font-medium">{memberData.name}</li>
            </ol>
          </nav>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Image & Quick Info */}
          <div className="lg:col-span-1">
            <div className="bg-theme-surface border border-theme-border rounded-xl shadow-sm overflow-hidden sticky top-8">
              {image?.url ? (
                <div className="relative h-96 lg:h-[450px]">
                  <Media
                    resource={image}
                    fill
                    size="(max-width: 1024px) 100vw, 33vw"
                    imgClassName="object-cover"
                    priority
                  />
                </div>
              ) : (
                <div className="h-96 lg:h-[450px] bg-gradient-to-br from-theme-primary/20 to-theme-dark/20 flex items-center justify-center">
                  <div className="text-6xl font-bold text-theme-primary/30">
                    {memberData.name?.charAt(0).toUpperCase()}
                  </div>
                </div>
              )}

              <div className="p-6 space-y-4">
                <div className="text-center">
                  <h2 className="heading-h2 font-bold text-theme-dark">{memberData.name}</h2>
                  {memberData.role && (
                    <p className="text-lg text-theme-primary font-medium mt-1">
                      {memberData.role}
                    </p>
                  )}
                </div>

                {/* Short Bio */}
                {memberData.bio && (
                  <p className="text-sm text-theme-text-light text-center leading-relaxed">
                    {memberData.bio}
                  </p>
                )}

                {/* Experience Badge */}
                {showExperience && experienceYears && (
                  <div className="flex items-center justify-center gap-3 py-4 border-y border-theme-border">
                    <Award className="w-8 h-8 text-theme-primary" />
                    <div>
                      <p className="heading-h2 font-bold text-theme-dark">
                        {experienceYears}+
                      </p>
                      <p className="text-sm text-theme-text-light">{l.experienceTitle}</p>
                    </div>
                  </div>
                )}

                {/* Contact Info */}
                {showContact && memberData.contact && (
                  <div className="space-y-3">
                    {memberData.contact.email && (
                      <a
                        href={`mailto:${memberData.contact.email}`}
                        className="flex items-center gap-3 text-theme-text-light hover:text-theme-primary transition-colors"
                      >
                        <Mail className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm break-all">{memberData.contact.email}</span>
                      </a>
                    )}
                    {memberData.contact.phone && (
                      <a
                        href={`tel:${memberData.contact.phone}`}
                        className="flex items-center gap-3 text-theme-text-light hover:text-theme-primary transition-colors"
                      >
                        <Phone className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm">{memberData.contact.phone}</span>
                      </a>
                    )}
                  </div>
                )}

                {/* Social Media */}
                {showSocialMedia && memberData.social && (
                  <div className="pt-4">
                    <div className="flex justify-center gap-3">
                      {memberData.social.facebook && (
                        <a
                          href={memberData.social.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 flex items-center justify-center rounded-full bg-theme-primary/10 hover:bg-theme-primary hover:text-theme-text-on-primary transition-all"
                          aria-label="Facebook"
                        >
                          <Facebook className="w-5 h-5" />
                        </a>
                      )}
                      {memberData.social.instagram && (
                        <a
                          href={memberData.social.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 flex items-center justify-center rounded-full bg-theme-primary/10 hover:bg-theme-primary hover:text-theme-text-on-primary transition-all"
                          aria-label="Instagram"
                        >
                          <Instagram className="w-5 h-5" />
                        </a>
                      )}
                      {memberData.social.linkedin && (
                        <a
                          href={memberData.social.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 flex items-center justify-center rounded-full bg-theme-primary/10 hover:bg-theme-primary hover:text-theme-text-on-primary transition-all"
                          aria-label="LinkedIn"
                        >
                          <Linkedin className="w-5 h-5" />
                        </a>
                      )}
                      {memberData.social.twitter && (
                        <a
                          href={memberData.social.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 flex items-center justify-center rounded-full bg-theme-primary/10 hover:bg-theme-primary hover:text-theme-text-on-primary transition-all"
                          aria-label="Twitter/X"
                        >
                          <Twitter className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Bio & Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Main Description Section */}
            {memberData.description && (
              <div className="bg-theme-surface border border-theme-border rounded-xl shadow-sm p-8">
                <div className="prose prose-lg max-w-none prose-headings:text-theme-text prose-headings:font-bold prose-p:text-theme-text-light prose-p:leading-relaxed prose-strong:text-theme-text prose-a:text-theme-primary hover:prose-a:text-theme-primary/80">
                  <RichText data={memberData.description} />
                </div>
              </div>
            )}

            {/* Specializations Card */}
            {showSpecializations && memberData.specializations && memberData.specializations.length > 0 && (
              <div className="bg-theme-surface border border-theme-border rounded-xl shadow-sm p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-theme-primary/10">
                    <Target className="w-5 h-5 text-theme-primary" />
                  </div>
                  <h2 className="text-xl font-semibold text-theme-text">{l.specializationsTitle}</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {memberData.specializations.map((spec, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-theme-primary/10 text-theme-primary border border-theme-primary/20 hover:bg-theme-primary/20 transition-colors"
                    >
                      {spec.specialization}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Schedule Card */}
            {showSchedule && memberData.schedule && memberData.schedule.length > 0 && (
              <div className="bg-theme-surface border border-theme-border rounded-xl shadow-sm p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-theme-primary/10">
                    <Calendar className="w-5 h-5 text-theme-primary" />
                  </div>
                  <h2 className="text-xl font-semibold text-theme-text">{l.scheduleTitle}</h2>
                </div>
                <div className="space-y-3">
                  {memberData.schedule.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-3 border-b border-theme-border last:border-0"
                    >
                      <span className="font-medium text-theme-text capitalize">
                        {item.day}
                      </span>
                      <span className="text-theme-primary font-semibold">{item.hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Section */}
            {showCTA && memberData.showCTAOnDetailPage !== false && (
              <div className="bg-theme-surface border border-theme-border rounded-xl shadow-sm p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-theme-text">
                      {ctaTitleFormatted}
                    </h3>
                    <p className="text-theme-text-light">
                      {l.ctaDescription}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                    <Link
                      href={`${paths.bookingPath}?antrenor=${encodeURIComponent(memberData.name || '')}`}
                      className="btn-primary inline-flex items-center justify-center px-6 py-3 text-sm font-semibold"
                    >
                      {l.ctaButtonText}
                    </Link>
                    <Link
                      href={paths.classesPath}
                      className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-theme-text border border-theme-border rounded-lg hover:bg-theme-light transition-colors"
                    >
                      {l.ctaSecondaryButtonText}
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Members Section */}
        {showRelatedMembers && relatedMembers.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-theme-text mb-8">{relatedMembersTitle}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedMembers.map((member) => {
                const memberImage = member.image as MediaType | null

                return (
                  <div
                    key={member.id}
                    className="bg-theme-surface border border-theme-border rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
                  >
                    <Link href={`${paths.teamBasePath}/${member.slug}`}>
                      <div className="relative h-64">
                        {memberImage?.url ? (
                          <Media
                            resource={memberImage}
                            fill
                            size="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            imgClassName="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="h-full bg-gradient-to-br from-theme-primary/20 to-theme-dark/20 flex items-center justify-center">
                            <div className="text-4xl font-bold text-theme-primary/30">
                              {member.name?.charAt(0).toUpperCase()}
                            </div>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 p-6 text-white">
                          <h3 className="font-bold text-xl mb-1">{member.name}</h3>
                          {member.role && <p className="text-sm text-white/90">{member.role}</p>}
                        </div>
                      </div>
                      {member.specializations && member.specializations.length > 0 && (
                        <div className="p-4">
                          <div className="flex flex-wrap gap-2">
                            {member.specializations.slice(0, 2).map((spec, idx) => (
                              <span
                                key={idx}
                                className="text-xs px-3 py-1 bg-theme-primary/10 text-theme-primary rounded-full border border-theme-primary/20"
                              >
                                {spec.specialization}
                              </span>
                            ))}
                            {member.specializations.length > 2 && (
                              <span className="text-xs px-3 py-1 bg-theme-light text-theme-text-muted rounded-full">
                                +{member.specializations.length - 2}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </Link>
                  </div>
                )
              })}
            </div>

            {/* View All Team Button */}
            <div className="text-center mt-8">
              <Link
                href={paths.teamBasePath}
                className="inline-flex items-center gap-2 px-6 py-3 bg-theme-primary text-theme-text-on-primary font-bold rounded-lg hover:bg-theme-primary/90 transition-colors"
              >
                {l.viewAllTeamText}
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        )}
      </article>
    </section>
  )
}

export default TeamMemberDetailBlock
