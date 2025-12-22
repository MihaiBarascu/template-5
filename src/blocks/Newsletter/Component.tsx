'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { CheckIcon } from 'lucide-react'
import { cn } from '@/utilities/cn'
import { Media } from '@/components/Media'
import { SectionPattern } from '@/components/SectionPattern'
import { getPatternProps, type PatternConfig } from '@/fields/patternField'
import type { Media as MediaType } from '@/payload-types'

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
  backgroundImage?: MediaType | string | null
  privacyText?: string | null
  showPrivacyLink?: boolean | null
  requireConsent?: boolean | null
  consentText?: string | null
  benefits?: Benefit[] | null
  pattern?: PatternConfig | null
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
  requireConsent = false,
  consentText = 'Da, ma abonez la newsletter',
  benefits = [],
  pattern,
}: NewsletterBlockProps) {
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
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

    if (requireConsent && !consent) {
      setError('Te rugam sa confirmi ca esti de acord cu abonarea.')
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

  const hasBgImage = backgroundImage && typeof backgroundImage === 'object' && 'url' in backgroundImage

  const isDark = variant === 'dark' || variant === 'with-image'
  const isPrimary = variant === 'with-pattern' // with-pattern uses bg-theme-primary

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

  // Get pattern props for SectionPattern component
  const patternProps = getPatternProps(pattern)

  if (variant === 'inline') {
    return (
      <section className={getContainerStyles()}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              {heading && (
                <h3 className="heading-h3 font-bold text-theme-text">{heading}</h3>
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
                  className="px-6 py-2.5 bg-theme-primary text-theme-text-on-primary rounded-lg font-medium hover:opacity-90 transition-all disabled:opacity-50"
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
      {variant === 'with-image' && hasBgImage && (
        <div className="absolute inset-0">
          <Media
            resource={backgroundImage as MediaType}
            fill
            size="100vw"
            imgClassName="object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
      )}

      {/* Pattern overlay - now configurable */}
      {variant === 'with-pattern' && patternProps && (
        <SectionPattern {...patternProps} />
      )}
      {/* Fallback diagonal lines if no pattern configured */}
      {variant === 'with-pattern' && !patternProps && (
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full pattern-diagonal-flowing text-white" />
        </div>
      )}

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icon */}
          <div
            className={cn(
              'w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center',
              isDark ? 'bg-white/10' : isPrimary ? 'bg-theme-text-on-primary/10' : 'bg-theme-primary/10'
            )}
          >
            <svg
              className={cn(
                'w-8 h-8',
                isDark ? 'text-theme-text-on-dark' : isPrimary ? 'text-theme-text-on-primary' : 'text-theme-primary'
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
                'heading-h2 font-bold mb-4',
                isDark ? 'text-theme-text-on-dark' : isPrimary ? 'text-theme-text-on-primary' : 'text-theme-text'
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
                isDark ? 'text-theme-text-on-dark/70' : isPrimary ? 'text-theme-text-on-primary/70' : 'text-theme-text-light'
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
                      isDark ? 'text-theme-text-on-dark/70' : isPrimary ? 'text-theme-text-on-primary/70' : 'text-theme-text-light'
                    )}
                  >
                    <svg
                      className={cn(
                        'w-5 h-5',
                        isDark || isPrimary ? 'text-green-400' : 'text-green-500'
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
                isDark || isPrimary ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-700'
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
                    isDark || isPrimary
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
                    isDark ? 'bg-white text-theme-text hover:bg-theme-light'
                      : isPrimary ? 'bg-theme-dark text-theme-text-on-dark hover:bg-theme-secondary'
                      : 'bg-theme-primary text-theme-text-on-primary hover:opacity-90'
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

              {/* Consent checkbox (GDPR) - Using Radix UI for full accessibility */}
              {requireConsent && (
                <div className="flex items-center gap-3 max-w-md mx-auto">
                  <CheckboxPrimitive.Root
                    id="newsletter-consent"
                    checked={consent}
                    onCheckedChange={(checked) => setConsent(checked === true)}
                    className={cn(
                      'size-4 shrink-0 rounded-sm border transition-colors cursor-pointer',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                      isPrimary
                        ? 'border-theme-dark/40 bg-white/10 focus-visible:ring-theme-dark data-[state=checked]:bg-theme-dark data-[state=checked]:border-theme-dark'
                        : isDark
                          ? 'border-white/40 bg-white/10 focus-visible:ring-white data-[state=checked]:bg-white data-[state=checked]:border-white'
                          : 'border-theme-border bg-white focus-visible:ring-theme-primary data-[state=checked]:bg-theme-primary data-[state=checked]:border-theme-primary'
                    )}
                  >
                    <CheckboxPrimitive.Indicator className="flex items-center justify-center">
                      <CheckIcon className={cn(
                        'size-3',
                        isPrimary ? 'text-white' : isDark ? 'text-theme-dark' : 'text-white'
                      )} />
                    </CheckboxPrimitive.Indicator>
                  </CheckboxPrimitive.Root>
                  <label
                    htmlFor="newsletter-consent"
                    className={cn(
                      'text-sm cursor-pointer select-none',
                      isDark ? 'text-theme-text-on-dark/80' : isPrimary ? 'text-theme-text-on-primary/80' : 'text-theme-text-light'
                    )}
                  >
                    {consentText}<span className="text-red-400">*</span>
                  </label>
                </div>
              )}

              {/* Error message */}
              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}

              {/* Privacy text */}
              {privacyText && (
                <p
                  className={cn(
                    'text-sm',
                    isDark ? 'text-theme-text-on-dark/60' : isPrimary ? 'text-theme-text-on-primary/60' : 'text-theme-text-muted'
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
                          isDark ? 'text-theme-text-on-dark/70' : isPrimary ? 'text-theme-text-on-primary/70' : 'text-theme-primary'
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
