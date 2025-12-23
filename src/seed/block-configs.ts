/**
 * Block Configurations Helper - SIMPLIFIED
 *
 * Provides pre-configured block templates for seeders.
 * Each function returns a block configuration object ready to be used in homepage layouts.
 *
 * Usage:
 * ```ts
 * import { blockConfigs } from './block-configs'
 *
 * const layout = [
 *   blockConfigs.services({ variant: 'grid-3', limit: 6 }),
 *   blockConfigs.team({ variant: 'carousel' }),
 *   blockConfigs.testimonials({ variant: 'carousel' }),
 * ]
 * ```
 */

// Common block configuration type
export interface BlockConfig {
  blockType: string
  variant?: string
  heading?: string
  subheading?: string
  limit?: number
  onlyFeatured?: boolean
  backgroundColor?: string
  [key: string]: unknown
}

// ============================================================================
// HERO BLOCK
// ============================================================================

export interface HeroBlockOptions {
  variant?: 'centered' | 'left-aligned' | 'split' | 'video' | 'slider'
  headline: string
  subheadline?: string
  image?: string // media ID
  videoUrl?: string
  slides?: Array<{ image: string; headline?: string; subheadline?: string }>
  ctaButtons?: Array<{ label: string; link: string; variant?: 'default' | 'outline' }>
  overlayOpacity?: '0' | '25' | '50' | '75'
  height?: 'medium' | 'large' | 'fullscreen'
}

export function heroBlock(options: HeroBlockOptions): BlockConfig {
  return {
    blockType: 'hero',
    variant: options.variant || 'centered',
    headline: options.headline,
    subheadline: options.subheadline,
    image: options.image,
    videoUrl: options.videoUrl,
    slides: options.slides,
    ctaButtons: options.ctaButtons || [],
    overlayOpacity: options.overlayOpacity || '50',
    height: options.height || 'large',
  }
}

// ============================================================================
// SERVICES BLOCK
// ============================================================================

export interface ServicesBlockOptions {
  variant?: 'grid-3' | 'grid-4' | 'carousel' | 'list'
  heading?: string
  subheading?: string
  limit?: number
  onlyFeatured?: boolean
  backgroundColor?: 'default' | 'light' | 'dark'
}

export function servicesBlock(options: ServicesBlockOptions = {}): BlockConfig {
  return {
    blockType: 'services',
    variant: options.variant || 'grid-3',
    heading: options.heading || 'Serviciile Noastre',
    subheading: options.subheading,
    limit: options.limit || 6,
    onlyFeatured: options.onlyFeatured ?? false,
    backgroundColor: options.backgroundColor || 'default',
  }
}

// ============================================================================
// TEAM BLOCK
// ============================================================================

export interface TeamBlockOptions {
  variant?: 'grid' | 'carousel'
  heading?: string
  subheading?: string
  limit?: number
  onlyFeatured?: boolean
  backgroundColor?: 'default' | 'light' | 'dark'
}

export function teamBlock(options: TeamBlockOptions = {}): BlockConfig {
  return {
    blockType: 'team',
    variant: options.variant || 'grid',
    heading: options.heading || 'Echipa Noastră',
    subheading: options.subheading,
    limit: options.limit || 6,
    onlyFeatured: options.onlyFeatured ?? false,
    backgroundColor: options.backgroundColor || 'default',
  }
}

// ============================================================================
// TESTIMONIALS BLOCK
// ============================================================================

export interface TestimonialsBlockOptions {
  variant?: 'carousel' | 'grid'
  heading?: string
  subheading?: string
  limit?: number
  onlyFeatured?: boolean
  backgroundColor?: 'default' | 'light' | 'dark'
}

export function testimonialsBlock(options: TestimonialsBlockOptions = {}): BlockConfig {
  return {
    blockType: 'testimonials',
    variant: options.variant || 'carousel',
    heading: options.heading || 'Ce Spun Clienții',
    subheading: options.subheading,
    limit: options.limit || 6,
    onlyFeatured: options.onlyFeatured ?? false,
    backgroundColor: options.backgroundColor || 'default',
  }
}

// ============================================================================
// FAQ BLOCK
// ============================================================================

export interface FAQBlockOptions {
  variant?: 'accordion' | 'two-columns'
  heading?: string
  subheading?: string
  limit?: number
  backgroundColor?: 'default' | 'light' | 'dark'
}

export function faqBlock(options: FAQBlockOptions = {}): BlockConfig {
  return {
    blockType: 'faq',
    variant: options.variant || 'accordion',
    heading: options.heading || 'Întrebări Frecvente',
    subheading: options.subheading,
    limit: options.limit || 10,
    backgroundColor: options.backgroundColor || 'default',
  }
}

// ============================================================================
// GALLERY BLOCK
// ============================================================================

export interface GalleryBlockOptions {
  variant?: 'grid-3' | 'grid-4' | 'masonry' | 'carousel'
  heading?: string
  subheading?: string
  images?: Array<{ image: string; caption?: string }>
  backgroundColor?: 'default' | 'light' | 'dark'
}

export function galleryBlock(options: GalleryBlockOptions = {}): BlockConfig {
  return {
    blockType: 'gallery',
    variant: options.variant || 'grid-3',
    heading: options.heading || 'Galerie',
    subheading: options.subheading,
    images: options.images || [],
    backgroundColor: options.backgroundColor || 'default',
  }
}

// ============================================================================
// PORTFOLIO BLOCK
// ============================================================================

export interface PortfolioBlockOptions {
  variant?: 'grid-3' | 'grid-4' | 'masonry' | 'carousel'
  heading?: string
  subheading?: string
  limit?: number
  onlyFeatured?: boolean
  backgroundColor?: 'default' | 'light' | 'dark'
}

export function portfolioBlock(options: PortfolioBlockOptions = {}): BlockConfig {
  return {
    blockType: 'portfolio',
    variant: options.variant || 'grid-3',
    heading: options.heading || 'Portofoliu',
    subheading: options.subheading,
    limit: options.limit || 9,
    onlyFeatured: options.onlyFeatured ?? false,
    backgroundColor: options.backgroundColor || 'default',
  }
}

// ============================================================================
// LATEST POSTS BLOCK
// ============================================================================

export interface LatestPostsBlockOptions {
  variant?: 'grid-3' | 'grid-2' | 'carousel' | 'list'
  heading?: string
  subheading?: string
  limit?: number
  backgroundColor?: 'default' | 'light' | 'dark'
}

export function latestPostsBlock(options: LatestPostsBlockOptions = {}): BlockConfig {
  return {
    blockType: 'latestPosts',
    variant: options.variant || 'grid-3',
    heading: options.heading || 'Ultimele Articole',
    subheading: options.subheading,
    limit: options.limit || 3,
    backgroundColor: options.backgroundColor || 'default',
  }
}

// ============================================================================
// PRODUCTS BLOCK
// ============================================================================

export interface ProductsBlockOptions {
  variant?: 'grid-4' | 'grid-3' | 'carousel'
  heading?: string
  subheading?: string
  limit?: number
  onlyFeatured?: boolean
  backgroundColor?: 'default' | 'light' | 'dark'
}

export function productsBlock(options: ProductsBlockOptions = {}): BlockConfig {
  return {
    blockType: 'products',
    variant: options.variant || 'grid-4',
    heading: options.heading || 'Produsele Noastre',
    subheading: options.subheading,
    limit: options.limit || 8,
    onlyFeatured: options.onlyFeatured ?? false,
    backgroundColor: options.backgroundColor || 'default',
  }
}

// ============================================================================
// SUBSCRIPTION CARDS BLOCK
// ============================================================================

export interface SubscriptionCardsBlockOptions {
  variant?: 'cards-3' | 'cards-4' | 'list-compact'
  heading?: string
  subheading?: string
  limit?: number
  backgroundColor?: 'default' | 'light' | 'dark'
}

export function subscriptionCardsBlock(options: SubscriptionCardsBlockOptions = {}): BlockConfig {
  return {
    blockType: 'subscriptionCards',
    variant: options.variant || 'cards-3',
    heading: options.heading || 'Abonamente',
    subheading: options.subheading,
    limit: options.limit || 6,
    backgroundColor: options.backgroundColor || 'default',
  }
}

// ============================================================================
// CONTACT BLOCK
// ============================================================================

export interface ContactBlockOptions {
  variant?: 'standard' | 'cards' | 'compact'
  heading?: string
  subheading?: string
  backgroundColor?: 'default' | 'light' | 'dark'
}

export function contactBlock(options: ContactBlockOptions = {}): BlockConfig {
  return {
    blockType: 'contact',
    variant: options.variant || 'standard',
    heading: options.heading || 'Contact',
    subheading: options.subheading,
    backgroundColor: options.backgroundColor || 'default',
  }
}

// ============================================================================
// NEWSLETTER BLOCK
// ============================================================================

export interface NewsletterBlockOptions {
  variant?: 'dark' | 'light' | 'gradient' | 'minimal'
  heading?: string
  subheading?: string
  placeholder?: string
  buttonText?: string
  backgroundColor?: 'default' | 'light' | 'dark' | 'primary'
}

export function newsletterBlock(options: NewsletterBlockOptions = {}): BlockConfig {
  return {
    blockType: 'newsletter',
    variant: options.variant || 'dark',
    heading: options.heading || 'Rămâi la Curent',
    subheading: options.subheading || 'Abonează-te pentru oferte și noutăți',
    placeholder: options.placeholder || 'Adresa ta de email',
    buttonText: options.buttonText || 'Abonează-te',
    backgroundColor: options.backgroundColor || 'dark',
  }
}

// ============================================================================
// CTA BLOCK
// ============================================================================

export interface CTABlockOptions {
  variant?: 'centered' | 'split' | 'banner'
  heading?: string
  subheading?: string
  primaryButton?: { label: string; link: string; variant?: string }
  secondaryButton?: { label: string; link: string; variant?: string }
  backgroundColor?: 'default' | 'light' | 'dark' | 'primary'
}

export function ctaBlock(options: CTABlockOptions = {}): BlockConfig {
  return {
    blockType: 'cta',
    variant: options.variant || 'centered',
    heading: options.heading || 'Pregătit să Începem?',
    subheading: options.subheading,
    primaryButton: options.primaryButton || { label: 'Contactează-ne', link: '/contact' },
    secondaryButton: options.secondaryButton,
    backgroundColor: options.backgroundColor || 'primary',
  }
}

// ============================================================================
// PRICE LIST DOTTED BLOCK
// ============================================================================

export interface PriceListDottedBlockOptions {
  variant?: 'single-column' | 'two-columns' | 'compact'
  heading?: string
  subheading?: string
  limit?: number
  backgroundColor?: 'default' | 'light' | 'dark'
}

export function priceListDottedBlock(options: PriceListDottedBlockOptions = {}): BlockConfig {
  return {
    blockType: 'priceListDotted',
    variant: options.variant || 'two-columns',
    heading: options.heading || 'Lista de Prețuri',
    subheading: options.subheading,
    limit: options.limit || 12,
    backgroundColor: options.backgroundColor || 'light',
  }
}

// ============================================================================
// OPENING HOURS BLOCK
// ============================================================================

export interface OpeningHoursBlockOptions {
  variant?: 'simple' | 'detailed' | 'compact' | 'card'
  heading?: string
  subheading?: string
  backgroundColor?: 'default' | 'light' | 'dark'
}

export function openingHoursBlock(options: OpeningHoursBlockOptions = {}): BlockConfig {
  return {
    blockType: 'openingHours',
    variant: options.variant || 'simple',
    heading: options.heading || 'Program',
    subheading: options.subheading,
    backgroundColor: options.backgroundColor || 'default',
  }
}

// ============================================================================
// TRUST BADGES BLOCK
// ============================================================================

export interface TrustBadgesBlockOptions {
  variant?: 'bar' | 'grid' | 'minimal'
  backgroundColor?: 'default' | 'light' | 'dark'
}

export function trustBadgesBlock(options: TrustBadgesBlockOptions = {}): BlockConfig {
  return {
    blockType: 'trust-badges',
    variant: options.variant || 'bar',
    backgroundColor: options.backgroundColor || 'light',
  }
}

// ============================================================================
// STATS BLOCK
// ============================================================================

export interface StatsBlockOptions {
  variant?: 'grid' | 'inline' | 'cards'
  heading?: string
  subheading?: string
  backgroundColor?: 'default' | 'light' | 'dark' | 'primary'
}

export function statsBlock(options: StatsBlockOptions = {}): BlockConfig {
  return {
    blockType: 'stats',
    variant: options.variant || 'grid',
    heading: options.heading,
    subheading: options.subheading,
    backgroundColor: options.backgroundColor || 'default',
  }
}

// ============================================================================
// EXPORT ALL BLOCK CONFIGS
// ============================================================================

export const blockConfigs = {
  hero: heroBlock,
  services: servicesBlock,
  team: teamBlock,
  testimonials: testimonialsBlock,
  faq: faqBlock,
  gallery: galleryBlock,
  portfolio: portfolioBlock,
  latestPosts: latestPostsBlock,
  products: productsBlock,
  subscriptionCards: subscriptionCardsBlock,
  contact: contactBlock,
  newsletter: newsletterBlock,
  cta: ctaBlock,
  priceListDotted: priceListDottedBlock,
  openingHours: openingHoursBlock,
  trustBadges: trustBadgesBlock,
  stats: statsBlock,
}

export default blockConfigs
