'use client'

import React, { useState } from 'react'
import { cn } from '@/utilities/cn'

interface ContactBlockProps {
  variant?: string
  heading?: string
  subheading?: string
  showForm?: boolean
  formFields?: {
    showName?: boolean | null
    showEmail?: boolean | null
    showPhone?: boolean | null
    showSubject?: boolean | null
    showService?: boolean | null
    showMessage?: boolean | null
  } | null
  submitButtonText?: string
  successMessage?: string
  showContactInfo?: boolean
  contactInfoItems?: {
    showAddress?: boolean | null
    showPhone?: boolean | null
    showEmail?: boolean | null
    showWorkingHours?: boolean | null
    showSocial?: boolean | null
  } | null
  showMap?: boolean
  mapPosition?: string
  backgroundColor?: string
  businessInfo?: {
    phone?: string | null
    email?: string | null
    address?: {
      street?: string | null
      city?: string | null
      county?: string | null
      postalCode?: string | null
    } | null
    workingHours?: Array<{ days?: string | null; hours?: string | null; id?: string | null }> | null
    social?: {
      facebook?: string | null
      instagram?: string | null
      tiktok?: string | null
      linkedin?: string | null
    } | null
    googleMapsEmbed?: string | null
  } | null
  services?: Array<{ id: string; title: string }> | null
}

export function ContactBlock({
  variant = 'split',
  heading = 'Contacteaza-ne',
  subheading,
  showForm = true,
  formFields: formFieldsProp,
  submitButtonText = 'Trimite mesajul',
  successMessage = 'Multumim! Mesajul tau a fost trimis cu succes.',
  showContactInfo = true,
  contactInfoItems: contactInfoItemsProp,
  showMap = false,
  mapPosition = 'bottom',
  backgroundColor = 'light',
  businessInfo,
  services,
}: ContactBlockProps) {
  // Handle null values with defaults
  const formFields = formFieldsProp ?? {
    showName: true,
    showEmail: true,
    showPhone: true,
    showSubject: false,
    showService: false,
    showMessage: true,
  }
  const contactInfoItems = contactInfoItemsProp ?? {
    showAddress: true,
    showPhone: true,
    showEmail: true,
    showWorkingHours: true,
    showSocial: false,
  }
  const servicesList = services ?? []
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    service: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const bgClass = {
    default: 'bg-white',
    light: 'bg-gray-50',
    dark: 'bg-gray-900 text-white',
  }[backgroundColor] || 'bg-gray-50'

  const inputClass = cn(
    'w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-theme-primary',
    backgroundColor === 'dark'
      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Eroare la trimiterea mesajului')
      }

      setIsSubmitted(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        service: '',
        message: '',
      })
    } catch (_err) {
      setError('A aparut o eroare. Te rugam sa incerci din nou.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const ContactForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isSubmitted ? (
        <div className="p-6 bg-green-50 text-green-800 rounded-lg text-center">
          <svg className="w-12 h-12 mx-auto mb-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="font-medium">{successMessage}</p>
        </div>
      ) : (
        <>
          {formFields.showName && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Nume complet *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="Ion Popescu"
              />
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {formFields.showEmail && (
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  placeholder="email@exemplu.ro"
                />
              </div>
            )}

            {formFields.showPhone && (
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-1">
                  Telefon
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="0722 123 456"
                />
              </div>
            )}
          </div>

          {formFields.showSubject && (
            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-1">
                Subiect
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className={inputClass}
                placeholder="Subiectul mesajului"
              />
            </div>
          )}

          {formFields.showService && servicesList.length > 0 && (
            <div>
              <label htmlFor="service" className="block text-sm font-medium mb-1">
                Serviciu de interes
              </label>
              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Selecteaza un serviciu</option>
                {servicesList.map((service) => (
                  <option key={service.id} value={service.title}>
                    {service.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {formFields.showMessage && (
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1">
                Mesaj *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className={inputClass}
                placeholder="Scrie mesajul tau aici..."
              />
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              'w-full py-3 px-6 rounded-lg font-medium transition-all',
              'bg-theme-primary text-white hover:bg-theme-primary-dark',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Se trimite...
              </span>
            ) : (
              submitButtonText
            )}
          </button>
        </>
      )}
    </form>
  )

  const ContactInfo = () => (
    <div className="space-y-6">
      {contactInfoItems.showAddress && businessInfo?.address && (
        <div className="flex gap-4">
          <div className={cn('w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0', backgroundColor === 'dark' ? 'bg-gray-700' : 'bg-theme-primary/10')}>
            <svg className={cn('w-5 h-5', backgroundColor === 'dark' ? 'text-white' : 'text-theme-primary')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Adresa</h4>
            <p className={cn('text-sm', backgroundColor === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
              {businessInfo.address.street}<br />
              {businessInfo.address.city}, {businessInfo.address.county}
              {businessInfo.address.postalCode && `, ${businessInfo.address.postalCode}`}
            </p>
          </div>
        </div>
      )}

      {contactInfoItems.showPhone && businessInfo?.phone && (
        <div className="flex gap-4">
          <div className={cn('w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0', backgroundColor === 'dark' ? 'bg-gray-700' : 'bg-theme-primary/10')}>
            <svg className={cn('w-5 h-5', backgroundColor === 'dark' ? 'text-white' : 'text-theme-primary')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Telefon</h4>
            <a href={`tel:${businessInfo.phone}`} className={cn('text-sm hover:underline', backgroundColor === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
              {businessInfo.phone}
            </a>
          </div>
        </div>
      )}

      {contactInfoItems.showEmail && businessInfo?.email && (
        <div className="flex gap-4">
          <div className={cn('w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0', backgroundColor === 'dark' ? 'bg-gray-700' : 'bg-theme-primary/10')}>
            <svg className={cn('w-5 h-5', backgroundColor === 'dark' ? 'text-white' : 'text-theme-primary')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Email</h4>
            <a href={`mailto:${businessInfo.email}`} className={cn('text-sm hover:underline', backgroundColor === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
              {businessInfo.email}
            </a>
          </div>
        </div>
      )}

      {contactInfoItems.showWorkingHours && businessInfo?.workingHours && businessInfo.workingHours.length > 0 && (
        <div className="flex gap-4">
          <div className={cn('w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0', backgroundColor === 'dark' ? 'bg-gray-700' : 'bg-theme-primary/10')}>
            <svg className={cn('w-5 h-5', backgroundColor === 'dark' ? 'text-white' : 'text-theme-primary')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Program</h4>
            <div className={cn('text-sm space-y-1', backgroundColor === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
              {businessInfo.workingHours
                .filter((schedule) => schedule.days && schedule.hours)
                .map((schedule, index) => (
                  <div key={schedule.id || index} className="flex justify-between gap-4">
                    <span>{schedule.days}</span>
                    <span className="font-medium">{schedule.hours}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {contactInfoItems.showSocial && businessInfo?.social && (
        <div className="flex gap-4">
          <div className={cn('w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0', backgroundColor === 'dark' ? 'bg-gray-700' : 'bg-theme-primary/10')}>
            <svg className={cn('w-5 h-5', backgroundColor === 'dark' ? 'text-white' : 'text-theme-primary')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Social Media</h4>
            <div className="flex gap-3">
              {businessInfo.social.facebook && (
                <a href={businessInfo.social.facebook} target="_blank" rel="noopener noreferrer" className={cn('hover:text-theme-primary', backgroundColor === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/></svg>
                </a>
              )}
              {businessInfo.social.instagram && (
                <a href={businessInfo.social.instagram} target="_blank" rel="noopener noreferrer" className={cn('hover:text-theme-primary', backgroundColor === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const MapEmbed = () => {
    if (!showMap || !businessInfo?.googleMapsEmbed) return null

    return (
      <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden">
        <iframe
          src={businessInfo.googleMapsEmbed}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
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

        {mapPosition === 'top' && <div className="mb-12"><MapEmbed /></div>}

        {variant === 'split' ? (
          <div className="grid lg:grid-cols-2 gap-12">
            {showContactInfo && (
              <div>
                <h3 className="text-xl font-semibold mb-6">Informatii de contact</h3>
                <ContactInfo />
              </div>
            )}
            {showForm && (
              <div className={cn('p-6 rounded-lg', backgroundColor === 'dark' ? 'bg-gray-800' : 'bg-white shadow-lg')}>
                <h3 className="text-xl font-semibold mb-6">Trimite-ne un mesaj</h3>
                <ContactForm />
              </div>
            )}
          </div>
        ) : variant === 'centered' ? (
          <div className="max-w-2xl mx-auto">
            {showForm && (
              <div className={cn('p-8 rounded-lg', backgroundColor === 'dark' ? 'bg-gray-800' : 'bg-white shadow-lg')}>
                <ContactForm />
              </div>
            )}
            {showContactInfo && (
              <div className="mt-12 text-center">
                <div className="flex flex-wrap justify-center gap-8">
                  {contactInfoItems.showPhone && businessInfo?.phone && (
                    <a href={`tel:${businessInfo.phone}`} className="flex items-center gap-2 hover:text-theme-primary">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {businessInfo.phone}
                    </a>
                  )}
                  {contactInfoItems.showEmail && businessInfo?.email && (
                    <a href={`mailto:${businessInfo.email}`} className="flex items-center gap-2 hover:text-theme-primary">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {businessInfo.email}
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : variant === 'cards' ? (
          <div>
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {contactInfoItems.showPhone && businessInfo?.phone && (
                <a href={`tel:${businessInfo.phone}`} className={cn('p-6 rounded-lg text-center hover:shadow-lg transition-shadow', backgroundColor === 'dark' ? 'bg-gray-800' : 'bg-white shadow')}>
                  <div className={cn('w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4', backgroundColor === 'dark' ? 'bg-gray-700' : 'bg-theme-primary/10')}>
                    <svg className="w-6 h-6 text-theme-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold mb-1">Telefon</h4>
                  <p className={backgroundColor === 'dark' ? 'text-gray-400' : 'text-gray-600'}>{businessInfo.phone}</p>
                </a>
              )}
              {contactInfoItems.showEmail && businessInfo?.email && (
                <a href={`mailto:${businessInfo.email}`} className={cn('p-6 rounded-lg text-center hover:shadow-lg transition-shadow', backgroundColor === 'dark' ? 'bg-gray-800' : 'bg-white shadow')}>
                  <div className={cn('w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4', backgroundColor === 'dark' ? 'bg-gray-700' : 'bg-theme-primary/10')}>
                    <svg className="w-6 h-6 text-theme-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold mb-1">Email</h4>
                  <p className={backgroundColor === 'dark' ? 'text-gray-400' : 'text-gray-600'}>{businessInfo.email}</p>
                </a>
              )}
              {contactInfoItems.showAddress && businessInfo?.address && (
                <div className={cn('p-6 rounded-lg text-center', backgroundColor === 'dark' ? 'bg-gray-800' : 'bg-white shadow')}>
                  <div className={cn('w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4', backgroundColor === 'dark' ? 'bg-gray-700' : 'bg-theme-primary/10')}>
                    <svg className="w-6 h-6 text-theme-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold mb-1">Adresa</h4>
                  <p className={backgroundColor === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    {businessInfo.address.street}, {businessInfo.address.city}
                  </p>
                </div>
              )}
            </div>
            {showForm && (
              <div className={cn('max-w-2xl mx-auto p-8 rounded-lg', backgroundColor === 'dark' ? 'bg-gray-800' : 'bg-white shadow-lg')}>
                <ContactForm />
              </div>
            )}
          </div>
        ) : (
          // default: with-map or minimal
          <div className="grid lg:grid-cols-2 gap-12">
            {showContactInfo && (
              <div>
                <ContactInfo />
              </div>
            )}
            {showForm && (
              <div>
                <ContactForm />
              </div>
            )}
          </div>
        )}

        {mapPosition === 'bottom' && <div className="mt-12"><MapEmbed /></div>}
      </div>
    </section>
  )
}

export default ContactBlock
