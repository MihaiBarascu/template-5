'use client'

import React, { useState } from 'react'
import { cn } from '@/utilities/cn'

interface Service {
  id: string
  title: string
  price?: number
  duration?: string
}

interface TeamMember {
  id: string
  name: string
  role?: string
}

interface BookingBlockProps {
  variant?: string
  heading?: string
  subheading?: string
  showServiceSelection?: boolean
  showStaffSelection?: boolean
  showDateSelection?: boolean
  showTimeSlots?: boolean
  submitButtonText?: string
  successMessage?: string
  backgroundColor?: string
  services?: Service[]
  staff?: TeamMember[]
  businessPhone?: string
  whatsapp?: string
}

export function BookingBlock({
  variant = 'form',
  heading = 'Programeaza-te',
  subheading,
  showServiceSelection = true,
  showStaffSelection = false,
  showDateSelection = true,
  showTimeSlots = true,
  submitButtonText = 'Trimite cererea',
  successMessage = 'Cererea de programare a fost trimisa! Te vom contacta pentru confirmare.',
  backgroundColor = 'default',
  services = [],
  staff = [],
  businessPhone,
  whatsapp,
}: BookingBlockProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    staff: '',
    date: '',
    time: '',
    notes: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const bgClass = {
    default: 'bg-white',
    light: 'bg-gray-50',
    dark: 'bg-gray-900 text-white',
    primary: 'bg-theme-primary text-white',
  }[backgroundColor] || 'bg-white'

  const inputClass = cn(
    'w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-theme-primary',
    backgroundColor === 'dark' || backgroundColor === 'primary'
      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
  )

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30',
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Eroare la trimiterea cererii')
      }

      setIsSubmitted(true)
      setFormData({
        name: '',
        phone: '',
        email: '',
        service: '',
        staff: '',
        date: '',
        time: '',
        notes: '',
      })
    } catch (err) {
      setError('A aparut o eroare. Te rugam sa incerci din nou sau suna-ne direct.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0]

  if (variant === 'cta') {
    return (
      <section className={cn('py-16', bgClass)}>
        <div className="container mx-auto px-4 text-center">
          {heading && (
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{heading}</h2>
          )}
          {subheading && (
            <p className={cn('text-lg max-w-2xl mx-auto mb-8', backgroundColor === 'dark' || backgroundColor === 'primary' ? 'text-white/80' : 'text-gray-600')}>
              {subheading}
            </p>
          )}
          <div className="flex flex-wrap justify-center gap-4">
            {businessPhone && (
              <a
                href={`tel:${businessPhone}`}
                className={cn(
                  'inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors',
                  backgroundColor === 'primary'
                    ? 'bg-white text-theme-primary hover:bg-gray-100'
                    : 'bg-theme-primary text-white hover:bg-theme-primary-dark'
                )}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Suna: {businessPhone}
              </a>
            )}
            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors',
                  'bg-green-500 text-white hover:bg-green-600'
                )}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
            )}
          </div>
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
              <p className={cn('text-lg max-w-2xl mx-auto', backgroundColor === 'dark' || backgroundColor === 'primary' ? 'text-white/80' : 'text-gray-600')}>
                {subheading}
              </p>
            )}
          </div>
        )}

        <div className={cn(
          'max-w-2xl mx-auto p-8 rounded-xl',
          backgroundColor === 'dark' || backgroundColor === 'primary' ? 'bg-gray-800' : 'bg-white shadow-lg'
        )}>
          {isSubmitted ? (
            <div className="text-center py-8">
              <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-semibold mb-2">Cerere trimisa!</h3>
              <p className={backgroundColor === 'dark' || backgroundColor === 'primary' ? 'text-gray-300' : 'text-gray-600'}>
                {successMessage}
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="mt-6 text-theme-primary hover:underline"
              >
                Fa o alta programare
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
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
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-1">
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    placeholder="0722 123 456"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="email@exemplu.ro"
                />
              </div>

              {showServiceSelection && services.length > 0 && (
                <div>
                  <label htmlFor="service" className="block text-sm font-medium mb-1">
                    Serviciu dorit *
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  >
                    <option value="">Selecteaza un serviciu</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.title}>
                        {service.title}
                        {service.price && ` - ${service.price} RON`}
                        {service.duration && ` (${service.duration})`}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {showStaffSelection && staff.length > 0 && (
                <div>
                  <label htmlFor="staff" className="block text-sm font-medium mb-1">
                    Specialist preferat
                  </label>
                  <select
                    id="staff"
                    name="staff"
                    value={formData.staff}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="">Fara preferinta</option>
                    {staff.map((member) => (
                      <option key={member.id} value={member.name}>
                        {member.name}
                        {member.role && ` - ${member.role}`}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                {showDateSelection && (
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium mb-1">
                      Data preferata *
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      min={today}
                      className={inputClass}
                    />
                  </div>
                )}

                {showTimeSlots && (
                  <div>
                    <label htmlFor="time" className="block text-sm font-medium mb-1">
                      Ora preferata *
                    </label>
                    <select
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    >
                      <option value="">Selecteaza ora</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium mb-1">
                  Mentiuni suplimentare
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className={inputClass}
                  placeholder="Alte detalii despre programare..."
                />
              </div>

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

              {(businessPhone || whatsapp) && (
                <div className="text-center pt-4 border-t border-gray-200">
                  <p className={cn('text-sm mb-3', backgroundColor === 'dark' || backgroundColor === 'primary' ? 'text-gray-400' : 'text-gray-500')}>
                    Sau contacteaza-ne direct:
                  </p>
                  <div className="flex justify-center gap-4">
                    {businessPhone && (
                      <a href={`tel:${businessPhone}`} className="text-theme-primary hover:underline text-sm">
                        {businessPhone}
                      </a>
                    )}
                    {whatsapp && (
                      <a
                        href={`https://wa.me/${whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:underline text-sm"
                      >
                        WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

export default BookingBlock
