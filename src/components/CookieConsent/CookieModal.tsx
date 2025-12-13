'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/utilities/cn'
import { useCookieConsent, CookieCategory } from '@/stores/cookieConsentStore'
import { X } from 'lucide-react'

interface CookieCategoryConfig {
  id: CookieCategory
  title: string
  description: string
  required?: boolean
}

interface CookieModalProps {
  isOpen: boolean
  onClose: () => void
  privacyPolicyUrl?: string
  saveButtonText?: string
  // Category texts
  necessaryTitle?: string
  necessaryDescription?: string
  analyticsTitle?: string
  analyticsDescription?: string
  marketingTitle?: string
  marketingDescription?: string
  preferencesTitle?: string
  preferencesDescription?: string
}

export function CookieModal({
  isOpen,
  onClose,
  privacyPolicyUrl = '/politica-cookies',
  saveButtonText = 'Salvează preferințele',
  necessaryTitle = 'Cookie-uri necesare',
  necessaryDescription = 'Aceste cookie-uri sunt esențiale pentru funcționarea site-ului și nu pot fi dezactivate. Ele includ funcționalități de bază precum navigarea și autentificarea.',
  analyticsTitle = 'Cookie-uri de analiză',
  analyticsDescription = 'Ne ajută să înțelegem cum folosești site-ul, ce pagini vizitezi și cum îmbunătățim experiența ta. Datele sunt anonimizate.',
  marketingTitle = 'Cookie-uri de marketing',
  marketingDescription = 'Folosite pentru a-ți afișa reclame relevante și pentru a măsura eficiența campaniilor noastre publicitare.',
  preferencesTitle = 'Cookie-uri de preferințe',
  preferencesDescription = 'Stochează preferințele tale (limba, tema, setări personalizate) pentru o experiență personalizată.',
}: CookieModalProps) {
  const necessary = useCookieConsent((state) => state.necessary)
  const analytics = useCookieConsent((state) => state.analytics)
  const marketing = useCookieConsent((state) => state.marketing)
  const preferences = useCookieConsent((state) => state.preferences)
  const updateCategory = useCookieConsent((state) => state.updateCategory)

  // Local state for toggles
  const [localPreferences, setLocalPreferences] = useState({
    necessary,
    analytics,
    marketing,
    preferences,
  })

  // Sync with store when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalPreferences({
        necessary,
        analytics,
        marketing,
        preferences,
      })
    }
  }, [isOpen, necessary, analytics, marketing, preferences])

  if (!isOpen) return null

  const categories: CookieCategoryConfig[] = [
    {
      id: 'necessary',
      title: necessaryTitle,
      description: necessaryDescription,
      required: true,
    },
    {
      id: 'analytics',
      title: analyticsTitle,
      description: analyticsDescription,
    },
    {
      id: 'marketing',
      title: marketingTitle,
      description: marketingDescription,
    },
    {
      id: 'preferences',
      title: preferencesTitle,
      description: preferencesDescription,
    },
  ]

  const handleToggle = (categoryId: CookieCategory) => {
    if (categoryId === 'necessary') return // Cannot toggle necessary cookies

    setLocalPreferences((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }))
  }

  const handleSave = () => {
    // Update each category in the store
    updateCategory('analytics', localPreferences.analytics)
    updateCategory('marketing', localPreferences.marketing)
    updateCategory('preferences', localPreferences.preferences)
    onClose()
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-modal-title"
    >
      <div
        className={cn(
          'bg-white rounded-[var(--radius-card)] shadow-2xl',
          'w-full max-w-2xl max-h-[85vh]',
          'flex flex-col',
          'animate-fade-in-up'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-theme-border">
          <h2
            id="cookie-modal-title"
            className="text-xl md:text-2xl font-bold text-theme-text"
          >
            Setări Cookie-uri
          </h2>
          <button
            onClick={onClose}
            className={cn(
              'p-2 rounded-full',
              'text-theme-text-light hover:text-theme-text',
              'hover:bg-theme-surface-secondary',
              'transition-colors duration-200',
              'active:scale-95'
            )}
            aria-label="Închide modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <p className="text-sm md:text-base text-theme-text-light mb-6">
            Gestionează-ți preferințele de cookie-uri. Poți activa sau dezactiva diferite
            categorii de cookie-uri în funcție de nevoile tale.{' '}
            <Link
              href={privacyPolicyUrl}
              className="text-theme-primary underline hover:no-underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              Află mai multe
            </Link>
          </p>

          {/* Categories */}
          <div className="space-y-4">
            {categories.map((category) => {
              const isEnabled = localPreferences[category.id]
              const isDisabled = category.required

              return (
                <div
                  key={category.id}
                  className={cn(
                    'p-4 rounded-[var(--radius-md)] border-2',
                    isDisabled
                      ? 'border-theme-border bg-theme-surface-secondary'
                      : 'border-theme-border-light bg-white hover:border-theme-border',
                    'transition-colors duration-200'
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-base md:text-lg font-semibold text-theme-text">
                          {category.title}
                        </h3>
                        {category.required && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-theme-primary text-white rounded-full">
                            Obligatoriu
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-theme-text-light leading-relaxed">
                        {category.description}
                      </p>
                    </div>

                    {/* Toggle Switch */}
                    <button
                      onClick={() => handleToggle(category.id)}
                      disabled={isDisabled}
                      className={cn(
                        'relative shrink-0 w-12 h-7 rounded-full transition-colors duration-200',
                        'focus:outline-none focus:ring-2 focus:ring-theme-primary focus:ring-offset-2',
                        isDisabled
                          ? 'bg-theme-text-muted cursor-not-allowed opacity-50'
                          : isEnabled
                          ? 'bg-theme-primary'
                          : 'bg-theme-border hover:bg-theme-text-muted'
                      )}
                      role="switch"
                      aria-checked={isEnabled}
                      aria-label={`Toggle ${category.title}`}
                      aria-disabled={isDisabled}
                    >
                      <span
                        className={cn(
                          'absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200',
                          isEnabled ? 'translate-x-5' : 'translate-x-0'
                        )}
                      />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-theme-border">
          <button
            onClick={handleSave}
            className={cn(
              'w-full px-6 py-3 text-base font-semibold',
              'bg-theme-primary text-white',
              'rounded-[var(--radius-button)]',
              'hover:bg-theme-secondary',
              'transition-all duration-200',
              'shadow-sm hover:shadow-md',
              'active:scale-[0.98]',
              'min-h-[44px]'
            )}
          >
            {saveButtonText}
          </button>
        </div>
      </div>
    </div>
  )
}
