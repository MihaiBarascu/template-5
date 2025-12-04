'use client'

import React from 'react'
import { cn } from '@/utilities/cn'
import {
  Truck,
  Package,
  Shield,
  ShieldCheck,
  CheckCircle,
  Star,
  Heart,
  Phone,
  Clock,
  Calendar,
  CreditCard,
  Gift,
  Award,
  Users,
  ThumbsUp,
  Leaf,
  Recycle,
  RefreshCw,
  Headphones,
  MessageCircle,
  Zap,
  BadgeCheck,
  CircleDollarSign,
  Banknote,
  type LucideIcon,
} from 'lucide-react'

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  Truck,
  Package,
  Shield,
  ShieldCheck,
  CheckCircle,
  Star,
  Heart,
  Phone,
  Clock,
  Calendar,
  CreditCard,
  Gift,
  Award,
  Users,
  ThumbsUp,
  Leaf,
  Recycle,
  RefreshCw,
  Headphones,
  MessageCircle,
  Zap,
  BadgeCheck,
  CircleDollarSign,
  Banknote,
}

interface Badge {
  icon: string
  title: string
  description?: string | null
}

interface CustomValues {
  shippingThreshold?: number | null
  experienceYears?: number | null
  happyCustomersCount?: string | null
  warrantyPeriod?: string | null
}

interface TrustBadgesBlockProps {
  variant?: 'bar' | 'grid-3' | 'grid-4' | 'inline' | 'cards' | 'minimal'
  heading?: string
  source?: 'preset' | 'custom'
  presets?: string[]
  customValues?: CustomValues
  badges?: Badge[]
  showDescriptions?: boolean
  iconSize?: 'small' | 'medium' | 'large'
  backgroundColor?: 'default' | 'light' | 'dark' | 'primary' | 'transparent'
}

// Preset badge definitions
const presetBadges: Record<string, (values?: CustomValues) => Badge> = {
  'free-shipping': () => ({
    icon: 'Truck',
    title: 'Livrare gratuita',
    description: 'Pentru toate comenzile',
  }),
  'fast-shipping': () => ({
    icon: 'Zap',
    title: 'Livrare in 24h',
    description: 'Rapid si sigur',
  }),
  'return-30': () => ({
    icon: 'RefreshCw',
    title: 'Retur 30 zile',
    description: 'Fara intrebari',
  }),
  'return-14': () => ({
    icon: 'RefreshCw',
    title: 'Retur 14 zile',
    description: 'Conform legii',
  }),
  'secure-payment': () => ({
    icon: 'ShieldCheck',
    title: 'Plata securizata',
    description: 'Date protejate SSL',
  }),
  warranty: (values) => ({
    icon: 'Shield',
    title: 'Garantie',
    description: values?.warrantyPeriod || '2 ani garantie',
  }),
  'support-24-7': () => ({
    icon: 'Headphones',
    title: 'Suport 24/7',
    description: 'Mereu la dispozitie',
  }),
  quality: () => ({
    icon: 'BadgeCheck',
    title: 'Calitate garantata',
    description: 'Produse verificate',
  }),
  'fair-price': () => ({
    icon: 'CircleDollarSign',
    title: 'Pret corect',
    description: 'Cel mai bun raport calitate-pret',
  }),
  'free-shipping-threshold': (values) => ({
    icon: 'Package',
    title: `Transport gratuit`,
    description: `De la ${values?.shippingThreshold || 150} lei`,
  }),
  'experience-years': (values) => ({
    icon: 'Award',
    title: `${values?.experienceYears || 10}+ ani experienta`,
    description: 'Profesionisti verificati',
  }),
  'happy-customers': (values) => ({
    icon: 'Users',
    title: `${values?.happyCustomersCount || '5000+'} clienti`,
    description: 'Multumiti de servicii',
  }),
  'romanian-products': () => ({
    icon: 'Heart',
    title: 'Produse romanesti',
    description: 'Sustinem local',
  }),
  'eco-friendly': () => ({
    icon: 'Leaf',
    title: 'Eco-friendly',
    description: 'Grija pentru mediu',
  }),
  'free-consultation': () => ({
    icon: 'MessageCircle',
    title: 'Consultatie gratuita',
    description: 'Sfaturi de la experti',
  }),
  'online-booking': () => ({
    icon: 'Calendar',
    title: 'Programare online',
    description: 'Simplu si rapid',
  }),
}

export function TrustBadgesBlock({
  variant = 'bar',
  heading,
  source = 'preset',
  presets = [],
  customValues,
  badges: customBadges = [],
  showDescriptions = true,
  iconSize = 'medium',
  backgroundColor = 'light',
}: TrustBadgesBlockProps) {
  // Get badges based on source
  const badges: Badge[] =
    source === 'preset'
      ? presets.map((preset) => presetBadges[preset]?.(customValues)).filter(Boolean)
      : customBadges

  if (badges.length === 0) return null

  // Icon sizes
  const iconSizes = {
    small: 'w-5 h-5',
    medium: 'w-6 h-6',
    large: 'w-8 h-8',
  }

  // Background colors
  const bgColors = {
    default: 'bg-background',
    light: 'bg-muted/50',
    dark: 'bg-gray-900 text-white',
    primary: 'bg-primary text-primary-foreground',
    transparent: 'bg-transparent',
  }

  // Render a single badge
  const renderBadge = (badge: Badge, index: number) => {
    const IconComponent = iconMap[badge.icon] || CheckCircle

    if (variant === 'minimal') {
      return (
        <div key={index} className="flex items-center gap-2" title={badge.title}>
          <IconComponent className={cn(iconSizes[iconSize], 'text-primary')} />
          <span className="text-sm font-medium">{badge.title}</span>
        </div>
      )
    }

    if (variant === 'inline') {
      return (
        <div key={index} className="flex items-center gap-2">
          <div className="p-1.5 rounded-full bg-primary/10">
            <IconComponent className={cn(iconSizes[iconSize], 'text-primary')} />
          </div>
          <div>
            <p className="text-sm font-medium">{badge.title}</p>
            {showDescriptions && badge.description && (
              <p className="text-xs text-muted-foreground">{badge.description}</p>
            )}
          </div>
        </div>
      )
    }

    if (variant === 'cards') {
      return (
        <div
          key={index}
          className="flex flex-col items-center text-center p-4 rounded-lg bg-background shadow-sm border"
        >
          <div className="p-3 rounded-full bg-primary/10 mb-3">
            <IconComponent className={cn(iconSizes[iconSize], 'text-primary')} />
          </div>
          <h4 className="font-semibold text-sm mb-1">{badge.title}</h4>
          {showDescriptions && badge.description && (
            <p className="text-xs text-muted-foreground">{badge.description}</p>
          )}
        </div>
      )
    }

    // Default for bar, grid-3, grid-4
    return (
      <div key={index} className="flex items-center gap-3">
        <div
          className={cn(
            'p-2 rounded-full shrink-0',
            backgroundColor === 'dark' || backgroundColor === 'primary'
              ? 'bg-white/20'
              : 'bg-primary/10',
          )}
        >
          <IconComponent
            className={cn(
              iconSizes[iconSize],
              backgroundColor === 'dark' || backgroundColor === 'primary'
                ? 'text-white'
                : 'text-primary',
            )}
          />
        </div>
        <div>
          <p className="font-medium text-sm">{badge.title}</p>
          {showDescriptions && badge.description && (
            <p
              className={cn(
                'text-xs',
                backgroundColor === 'dark' || backgroundColor === 'primary'
                  ? 'text-white/70'
                  : 'text-muted-foreground',
              )}
            >
              {badge.description}
            </p>
          )}
        </div>
      </div>
    )
  }

  // Container classes based on variant
  const containerClasses = {
    bar: 'flex flex-wrap justify-center gap-6 md:gap-10',
    'grid-3': 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6',
    'grid-4': 'grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6',
    inline: 'flex flex-wrap justify-center gap-4 md:gap-8',
    cards: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4',
    minimal: 'flex flex-wrap justify-center gap-4 md:gap-6',
  }

  return (
    <section className={cn('py-8 md:py-12', bgColors[backgroundColor])}>
      <div className="container mx-auto px-4">
        {heading && (
          <h2 className="text-xl md:text-2xl font-bold text-center mb-6 md:mb-8">{heading}</h2>
        )}
        <div className={containerClasses[variant]}>{badges.map(renderBadge)}</div>
      </div>
    </section>
  )
}
