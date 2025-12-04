'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/utilities/cn'
import {
  Search,
  MousePointerClick,
  Calendar,
  CheckCircle,
  User,
  Store,
  ShoppingCart,
  CreditCard,
  Package,
  Truck,
  Home,
  Phone,
  Mail,
  MessageSquare,
  Settings,
  FileText,
  Scissors,
  Star,
  Heart,
  ClipboardCheck,
  type LucideIcon,
} from 'lucide-react'
import type { Media } from '@/payload-types'

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  Search,
  MousePointerClick,
  Calendar,
  CheckCircle,
  User,
  Store,
  ShoppingCart,
  CreditCard,
  Package,
  Truck,
  Home,
  Phone,
  Mail,
  MessageSquare,
  Settings,
  FileText,
  Scissors,
  Star,
  Heart,
  ClipboardCheck,
}

interface Step {
  title: string
  description?: string | null
  icon?: string | null
  image?: Media | string | null
}

interface CTAButton {
  enabled?: boolean | null
  label?: string | null
  link?: string | null
}

interface HowItWorksBlockProps {
  variant?: 'numbered' | 'icons' | 'timeline' | 'horizontal-cards' | 'connected' | 'alternating'
  heading?: string
  subheading?: string
  steps?: Step[]
  showNumbers?: boolean
  ctaButton?: CTAButton
  backgroundColor?: 'default' | 'light' | 'dark' | 'primary'
}

export function HowItWorksBlock({
  variant = 'numbered',
  heading = 'Cum functioneaza',
  subheading,
  steps = [],
  showNumbers = true,
  ctaButton,
  backgroundColor = 'default',
}: HowItWorksBlockProps) {
  if (steps.length === 0) return null

  // Background colors
  const bgColors = {
    default: 'bg-background',
    light: 'bg-muted/50',
    dark: 'bg-gray-900 text-white',
    primary: 'bg-primary/5',
  }

  // Render step number or icon
  const renderStepIndicator = (step: Step, index: number) => {
    if (variant === 'icons' || variant === 'connected') {
      const IconComponent = step.icon ? iconMap[step.icon] : CheckCircle
      return (
        <div
          className={cn(
            'w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shrink-0',
            backgroundColor === 'dark' ? 'bg-primary text-primary-foreground' : 'bg-primary/10',
          )}
        >
          <IconComponent
            className={cn(
              'w-6 h-6',
              backgroundColor === 'dark' ? 'text-primary-foreground' : 'text-primary',
            )}
          />
        </div>
      )
    }

    if (showNumbers) {
      return (
        <div
          className={cn(
            'w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0',
            backgroundColor === 'dark'
              ? 'bg-primary text-primary-foreground'
              : 'bg-primary text-primary-foreground',
          )}
        >
          {index + 1}
        </div>
      )
    }

    return null
  }

  // Numbered variant
  const renderNumbered = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {steps.map((step, index) => (
        <div key={index} className="flex flex-col items-center text-center">
          {renderStepIndicator(step, index)}
          <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
          {step.description && (
            <p
              className={cn(
                'mt-2 text-sm',
                backgroundColor === 'dark' ? 'text-gray-300' : 'text-muted-foreground',
              )}
            >
              {step.description}
            </p>
          )}
        </div>
      ))}
    </div>
  )

  // Icons variant (same as numbered but with icons)
  const renderIcons = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {steps.map((step, index) => (
        <div key={index} className="flex flex-col items-center text-center">
          {renderStepIndicator(step, index)}
          <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
          {step.description && (
            <p
              className={cn(
                'mt-2 text-sm',
                backgroundColor === 'dark' ? 'text-gray-300' : 'text-muted-foreground',
              )}
            >
              {step.description}
            </p>
          )}
        </div>
      ))}
    </div>
  )

  // Timeline vertical variant
  const renderTimeline = () => (
    <div className="relative max-w-2xl mx-auto">
      {/* Vertical line */}
      <div
        className={cn(
          'absolute left-5 md:left-6 top-0 bottom-0 w-0.5',
          backgroundColor === 'dark' ? 'bg-gray-600' : 'bg-primary/20',
        )}
      />

      <div className="space-y-8">
        {steps.map((step, index) => (
          <div key={index} className="relative flex gap-4 md:gap-6">
            <div className="relative z-10">{renderStepIndicator(step, index)}</div>
            <div className="pt-2">
              <h3 className="text-lg font-semibold">{step.title}</h3>
              {step.description && (
                <p
                  className={cn(
                    'mt-1 text-sm',
                    backgroundColor === 'dark' ? 'text-gray-300' : 'text-muted-foreground',
                  )}
                >
                  {step.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  // Horizontal cards variant
  const renderHorizontalCards = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {steps.map((step, index) => (
        <div
          key={index}
          className={cn(
            'p-6 rounded-lg border relative',
            backgroundColor === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-background',
          )}
        >
          {showNumbers && (
            <span
              className={cn(
                'absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                'bg-primary text-primary-foreground',
              )}
            >
              {index + 1}
            </span>
          )}
          <h3 className="font-semibold mb-2">{step.title}</h3>
          {step.description && (
            <p
              className={cn(
                'text-sm',
                backgroundColor === 'dark' ? 'text-gray-300' : 'text-muted-foreground',
              )}
            >
              {step.description}
            </p>
          )}
        </div>
      ))}
    </div>
  )

  // Connected variant (with lines between steps)
  const renderConnected = () => (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative">
      {/* Connector line for desktop */}
      <div
        className={cn(
          'hidden md:block absolute top-7 left-0 right-0 h-0.5 -z-10',
          backgroundColor === 'dark' ? 'bg-gray-600' : 'bg-primary/20',
        )}
        style={{ left: '10%', right: '10%' }}
      />

      {steps.map((step, index) => (
        <div key={index} className="flex-1 flex flex-col items-center text-center relative">
          {renderStepIndicator(step, index)}
          <h3 className="mt-3 text-sm md:text-base font-semibold">{step.title}</h3>
          {step.description && (
            <p
              className={cn(
                'mt-1 text-xs md:text-sm max-w-[200px]',
                backgroundColor === 'dark' ? 'text-gray-300' : 'text-muted-foreground',
              )}
            >
              {step.description}
            </p>
          )}
        </div>
      ))}
    </div>
  )

  // Alternating variant (zig-zag with images)
  const renderAlternating = () => (
    <div className="space-y-12 md:space-y-16">
      {steps.map((step, index) => {
        const isEven = index % 2 === 0
        const imageUrl =
          typeof step.image === 'object' && step.image?.url ? step.image.url : undefined

        return (
          <div
            key={index}
            className={cn(
              'flex flex-col gap-6 items-center',
              'md:flex-row md:gap-12',
              !isEven && 'md:flex-row-reverse',
            )}
          >
            {/* Content */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-3 justify-center md:justify-start mb-3">
                {showNumbers && (
                  <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </span>
                )}
                <h3 className="text-xl font-semibold">{step.title}</h3>
              </div>
              {step.description && (
                <p
                  className={cn(
                    backgroundColor === 'dark' ? 'text-gray-300' : 'text-muted-foreground',
                  )}
                >
                  {step.description}
                </p>
              )}
            </div>

            {/* Image placeholder or actual image */}
            <div className="flex-1 w-full max-w-md">
              {imageUrl ? (
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <Image src={imageUrl} alt={step.title} fill className="object-cover" />
                </div>
              ) : (
                <div
                  className={cn(
                    'aspect-video rounded-lg flex items-center justify-center',
                    backgroundColor === 'dark' ? 'bg-gray-700' : 'bg-muted',
                  )}
                >
                  <span className="text-4xl font-bold text-primary/20">{index + 1}</span>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )

  // Choose render function based on variant
  const renderContent = () => {
    switch (variant) {
      case 'icons':
        return renderIcons()
      case 'timeline':
        return renderTimeline()
      case 'horizontal-cards':
        return renderHorizontalCards()
      case 'connected':
        return renderConnected()
      case 'alternating':
        return renderAlternating()
      default:
        return renderNumbered()
    }
  }

  return (
    <section className={cn('py-12 md:py-16', bgColors[backgroundColor])}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold">{heading}</h2>
          {subheading && (
            <p
              className={cn(
                'mt-3 max-w-2xl mx-auto',
                backgroundColor === 'dark' ? 'text-gray-300' : 'text-muted-foreground',
              )}
            >
              {subheading}
            </p>
          )}
        </div>

        {/* Steps */}
        {renderContent()}

        {/* CTA Button */}
        {ctaButton?.enabled && ctaButton.link && (
          <div className="mt-10 md:mt-12 text-center">
            <Link
              href={ctaButton.link}
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg font-medium transition-all bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {ctaButton.label || 'Incepe acum'}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
