'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/utilities/cn'
import type { Media } from '@/payload-types'

interface Benefit {
  id?: string | null
  text?: string | null
}

interface NewsletterBlockProps {
  variant?: 'simple' | 'with-image' | 'dark' | 'with-pattern' | 'inline' | null
  heading?: string | null
  subheading?: string | null
  placeholder?: string | null
  buttonText?: string | null
  successMessage?: string | null
  backgroundImage?: Media | string | null
  privacyText?: string | null
  showPrivacyLink?: boolean | null
  benefits?: Benefit[] | null
}

export function NewsletterBlock({
  variant = 'simple',
  heading = 'Aboneaza-te la Newsletter',
  subheading = 'Primeste noutati, oferte speciale si sfaturi direct in inbox.',
  placeholder = 'Adresa ta de email',
  buttonText = 'Aboneaza-te',
  successMessage = 'Te-ai abonat cu succes! Multumim.',
  backgroundImage,
  privacyText = 'Datele tale sunt in siguranta. Nu facem spam.',
  showPrivacyLink = true,
  benefits = [],
}: NewsletterBlockProps) {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email || !email.includes('@')) {
      setError('Te rugam introdu o adresa de email valida.')
      return
    }

    setIsLoading(true)

    try {
      // Call the newsletter API endpoint
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          source: 'page', // Newsletter block is typically on a page
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'A aparut o eroare')
      }

      setIsSubmitted(true)
      setEmail('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'A aparut o eroare. Te rugam incearca din nou.')
    } finally {
      setIsLoading(false)
    }
  }

  const bgImageUrl =
    backgroundImage && typeof backgroundImage !== 'string'
      ? backgroundImage.url
      : null

  const isDark = variant === 'dark' || variant === 'with-image'

  // Variant-specific styles
  const getContainerStyles = () => {
    switch (variant) {
      case 'with-image':
        return 'relative py-20 md:py-28'
      case 'dark':
        return 'bg-theme-dark py-16 md:py-20'
      case 'with-pattern':
        return 'bg-theme-primary py-16 md:py-20 relative overflow-hidden'
      case 'inline':
        return 'bg-theme-light py-8'
      default:
        return 'bg-theme-light py-16 md:py-20'
    }
  }

  // Pattern overlay for with-pattern variant
  const PatternOverlay = () => (
    <div className="absolute inset-0 opacity-10">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="diagonal-lines"
            patternUnits="userSpaceOnUse"
            width="40"
            height="40"
          >
            <path
              d="M-10,10 l20,-20 M0,40 l40,-40 M30,50 l20,-20"
              stroke="white"
              strokeWidth="2"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#diagonal-lines)" />
      </svg>
    </div>
  )

  if (variant === 'inline') {
    return (
      <section className={getContainerStyles()}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              {heading && (
                <h3 className="text-xl font-bold text-theme-text">{heading}</h3>
              )}
              {subheading && (
                <p className="text-theme-text-light text-sm mt-1">{subheading}</p>
              )}
            </div>

            {isSubmitted ? (
              <div className="flex items-center gap-2 text-green-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">{successMessage}</span>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 flex-1 max-w-md"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={placeholder || ''}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-theme-border focus:ring-2 focus:ring-theme-primary focus:border-transparent outline-none"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2.5 bg-theme-primary text-white rounded-lg font-medium hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {isLoading ? '...' : buttonText}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={getContainerStyles()}>
      {/* Background image */}
      {variant === 'with-image' && bgImageUrl && (
        <div className="absolute inset-0">
          <Image
            src={bgImageUrl}
            alt=""
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
      )}

      {/* Pattern overlay */}
      {variant === 'with-pattern' && <PatternOverlay />}

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icon */}
          <div
            className={cn(
              'w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center',
              isDark || variant === 'with-pattern'
                ? 'bg-white/10'
                : 'bg-theme-primary/10'
            )}
          >
            <svg
              className={cn(
                'w-8 h-8',
                isDark || variant === 'with-pattern'
                  ? 'text-white'
                  : 'text-theme-primary'
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          {/* Heading */}
          {heading && (
            <h2
              className={cn(
                'text-3xl md:text-4xl font-bold mb-4',
                isDark || variant === 'with-pattern' ? 'text-white' : 'text-theme-text'
              )}
            >
              {heading}
            </h2>
          )}

          {/* Subheading */}
          {subheading && (
            <p
              className={cn(
                'text-lg mb-8',
                isDark || variant === 'with-pattern'
                  ? 'text-white/70'
                  : 'text-theme-text-light'
              )}
            >
              {subheading}
            </p>
          )}

          {/* Benefits */}
          {benefits && benefits.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {benefits
                .filter((b) => b.text)
                .map((benefit, index) => (
                  <div
                    key={benefit.id || index}
                    className={cn(
                      'flex items-center gap-2 text-sm',
                      isDark || variant === 'with-pattern'
                        ? 'text-white/70'
                        : 'text-theme-text-light'
                    )}
                  >
                    <svg
                      className={cn(
                        'w-5 h-5',
                        isDark || variant === 'with-pattern'
                          ? 'text-green-400'
                          : 'text-green-500'
                      )}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {benefit.text}
                  </div>
                ))}
            </div>
          )}

          {/* Form */}
          {isSubmitted ? (
            <div
              className={cn(
                'flex items-center justify-center gap-3 py-4 px-6 rounded-xl',
                isDark || variant === 'with-pattern'
                  ? 'bg-green-500/20 text-green-300'
                  : 'bg-green-100 text-green-700'
              )}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">{successMessage}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={placeholder || ''}
                  className={cn(
                    'flex-1 px-5 py-3.5 rounded-xl text-theme-text outline-none transition-all',
                    'focus:ring-4',
                    isDark || variant === 'with-pattern'
                      ? 'bg-white focus:ring-white/20'
                      : 'bg-white border border-theme-border focus:ring-theme-primary/20 focus:border-theme-primary'
                  )}
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    'px-8 py-3.5 rounded-xl font-semibold transition-all',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'hover:scale-105 active:scale-95',
                    isDark || variant === 'with-pattern'
                      ? 'bg-white text-theme-text hover:bg-theme-light'
                      : 'bg-theme-primary text-white hover:opacity-90'
                  )}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Se trimite...
                    </span>
                  ) : (
                    buttonText
                  )}
                </button>
              </div>

              {/* Error message */}
              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}

              {/* Privacy text */}
              {privacyText && (
                <p
                  className={cn(
                    'text-sm',
                    isDark || variant === 'with-pattern'
                      ? 'text-white/60'
                      : 'text-theme-text-muted'
                  )}
                >
                  {privacyText}
                  {showPrivacyLink && (
                    <>
                      {' '}
                      <Link
                        href="/politica-confidentialitate"
                        className={cn(
                          'underline hover:no-underline',
                          isDark || variant === 'with-pattern'
                            ? 'text-white/70'
                            : 'text-theme-primary'
                        )}
                      >
                        Politica de confidentialitate
                      </Link>
                    </>
                  )}
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

export default NewsletterBlock
