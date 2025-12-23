/**
 * SEEDER CONFIG - Configurare directa pentru fiecare seeder
 *
 * Fiecare business type are configurarea proprie definita DIRECT aici,
 * fara dependenta de variabile de mediu (DESIGN_VARIANT).
 *
 * Pentru a schimba configuratia, editeaza valorile direct in acest fisier.
 */

// =============================================================================
// TIPURI COMUNE
// =============================================================================

// Available fonts - must match SiteTheme schema from Payload
export type HeadingFontName =
  | 'Playfair_Display'
  | 'Lora'
  | 'Inter'
  | 'Montserrat'
  | 'Poppins'
  | 'Work_Sans'
  | 'Open_Sans'
  | 'Lato'
  | 'Source_Sans_3'

export type BodyFontName =
  | 'Inter'
  | 'Open_Sans'
  | 'Lato'
  | 'Poppins'
  | 'Source_Sans_3'
  | 'Montserrat'
  | 'Work_Sans'
  | 'Lora'

export type HeroType = 'fullscreen' | 'centered' | 'split' | 'minimal' | 'video' | 'slider'
export type HeroOverlay = 'dark' | 'light' | 'gradient' | 'none'
export type HeroAlignment = 'left' | 'center' | 'right'

export type ServicesVariant = 'grid-3' | 'grid-2' | 'list' | 'price-list'
export type TeamVariant = 'grid' | 'carousel'
export type TestimonialsVariant = 'carousel' | 'grid'
export type GalleryVariant = 'grid-3' | 'grid-4' | 'masonry' | 'carousel'
export type PricingVariant = 'cards-3' | 'cards-4' | 'table' | 'list' | 'toggle' | 'featured-center'

export interface SeederConfig {
  // Identitate
  name: string
  description: string

  // Theme
  theme: {
    variant: 'dark-gold' | 'blue-professional' | 'green-nature' | 'red-energy' | 'purple-luxury' | 'brown-vintage' | 'teal-modern' | 'orange-warm' | 'navy-corporate'
    borderRadius: 'none' | 'small' | 'medium' | 'large' | 'full'
    shadows: 'none' | 'subtle' | 'moderate' | 'strong'
    headingFont: HeadingFontName
    bodyFont: BodyFontName
  }

  // Hero (homepage)
  hero: {
    type: HeroType
    overlay: HeroOverlay
    alignment: HeroAlignment
  }

  // Layout variants pentru blocuri
  layout: {
    sections: string[] // Ordinea sectiunilor pe homepage
    servicesVariant: ServicesVariant
    teamVariant: TeamVariant
    testimonialsVariant: TestimonialsVariant
    galleryVariant: GalleryVariant
    pricingVariant: PricingVariant
  }
}

// =============================================================================
// CONFIGURARI PER BUSINESS TYPE
// =============================================================================

export const seederConfigs: Record<string, SeederConfig> = {
  // FRIZERIE / BARBERSHOP
  barbershop: {
    name: 'Barbershop Classic',
    description: 'Design clasic pentru barbershop cu negru si auriu - elegant si masculin',
    theme: {
      variant: 'dark-gold',
      borderRadius: 'small',
      shadows: 'moderate',
      headingFont: 'Playfair_Display',
      bodyFont: 'Inter',
    },
    hero: {
      type: 'fullscreen',
      overlay: 'dark',
      alignment: 'center',
    },
    layout: {
      sections: ['announcementBar', 'trustBadges', 'priceList', 'howItWorks', 'openingHours', 'locations', 'timeline', 'beforeAfter', 'stats', 'video', 'team', 'gallery', 'testimonials', 'faq', 'latestPosts', 'newsletter', 'cta'],
      servicesVariant: 'grid-3',
      teamVariant: 'grid',
      testimonialsVariant: 'carousel',
      galleryVariant: 'masonry',
      pricingVariant: 'cards-3',
    },
  },

  // RESTAURANT
  restaurant: {
    name: 'Restaurant Elegant',
    description: 'Design elegant pentru restaurant cu tonuri calde si rafinate',
    theme: {
      variant: 'brown-vintage',
      borderRadius: 'medium',
      shadows: 'subtle',
      headingFont: 'Playfair_Display',
      bodyFont: 'Lora',
    },
    hero: {
      type: 'fullscreen',
      overlay: 'dark',
      alignment: 'center',
    },
    layout: {
      sections: ['announcementBar', 'services', 'openingHours', 'gallery', 'stats', 'team', 'testimonials', 'faq', 'latestPosts', 'newsletter', 'cta'],
      servicesVariant: 'grid-3',
      teamVariant: 'grid',
      testimonialsVariant: 'carousel',
      galleryVariant: 'masonry',
      pricingVariant: 'cards-3',
    },
  },

  // DENTIST
  dentist: {
    name: 'Cabinet Dentar Modern',
    description: 'Design profesional si calm pentru cabinet stomatologic',
    theme: {
      variant: 'blue-professional',
      borderRadius: 'medium',
      shadows: 'subtle',
      headingFont: 'Montserrat',
      bodyFont: 'Open_Sans',
    },
    hero: {
      type: 'split',
      overlay: 'none',
      alignment: 'left',
    },
    layout: {
      sections: ['trustBadges', 'services', 'howItWorks', 'team', 'stats', 'testimonials', 'faq', 'latestPosts', 'cta'],
      servicesVariant: 'grid-3',
      teamVariant: 'grid',
      testimonialsVariant: 'grid',
      galleryVariant: 'grid-3',
      pricingVariant: 'cards-3',
    },
  },

  // SALON (Beauty/Hair)
  salon: {
    name: 'Salon Beauty',
    description: 'Design elegant si feminin pentru salon de infrumusetare',
    theme: {
      variant: 'purple-luxury',
      borderRadius: 'large',
      shadows: 'subtle',
      headingFont: 'Playfair_Display',
      bodyFont: 'Lato',
    },
    hero: {
      type: 'slider',
      overlay: 'gradient',
      alignment: 'center',
    },
    layout: {
      sections: ['services', 'gallery', 'team', 'stats', 'testimonials', 'faq', 'newsletter', 'cta'],
      servicesVariant: 'grid-3',
      teamVariant: 'carousel',
      testimonialsVariant: 'carousel',
      galleryVariant: 'masonry',
      pricingVariant: 'cards-4',
    },
  },

  // AUTO SERVICE
  'auto-service': {
    name: 'Service Auto',
    description: 'Design robust si profesional pentru service auto',
    theme: {
      variant: 'red-energy',
      borderRadius: 'small',
      shadows: 'moderate',
      headingFont: 'Montserrat',
      bodyFont: 'Inter',
    },
    hero: {
      type: 'fullscreen',
      overlay: 'dark',
      alignment: 'left',
    },
    layout: {
      sections: ['trustBadges', 'services', 'howItWorks', 'stats', 'team', 'gallery', 'testimonials', 'faq', 'cta'],
      servicesVariant: 'list',
      teamVariant: 'grid',
      testimonialsVariant: 'carousel',
      galleryVariant: 'grid-4',
      pricingVariant: 'table',
    },
  },

  // AVOCAT
  avocat: {
    name: 'Cabinet Avocat',
    description: 'Design profesional si sobru pentru cabinet de avocatura',
    theme: {
      variant: 'navy-corporate',
      borderRadius: 'small',
      shadows: 'subtle',
      headingFont: 'Playfair_Display',
      bodyFont: 'Source_Sans_3',
    },
    hero: {
      type: 'split',
      overlay: 'none',
      alignment: 'left',
    },
    layout: {
      sections: ['trustBadges', 'services', 'howItWorks', 'team', 'stats', 'testimonials', 'faq', 'latestPosts', 'cta'],
      servicesVariant: 'list',
      teamVariant: 'grid',
      testimonialsVariant: 'carousel',
      galleryVariant: 'grid-3',
      pricingVariant: 'list',
    },
  },

  // CONSTRUCTII
  constructii: {
    name: 'Firma Constructii',
    description: 'Design solid si de incredere pentru firma de constructii',
    theme: {
      variant: 'orange-warm',
      borderRadius: 'small',
      shadows: 'moderate',
      headingFont: 'Work_Sans',
      bodyFont: 'Inter',
    },
    hero: {
      type: 'fullscreen',
      overlay: 'dark',
      alignment: 'left',
    },
    layout: {
      sections: ['trustBadges', 'services', 'howItWorks', 'gallery', 'stats', 'team', 'testimonials', 'faq', 'cta'],
      servicesVariant: 'grid-3',
      teamVariant: 'grid',
      testimonialsVariant: 'carousel',
      galleryVariant: 'masonry',
      pricingVariant: 'cards-3',
    },
  },

  // MAGAZIN (E-commerce)
  magazin: {
    name: 'Magazin Online',
    description: 'Design modern si curat pentru magazin online',
    theme: {
      variant: 'teal-modern',
      borderRadius: 'medium',
      shadows: 'subtle',
      headingFont: 'Poppins',
      bodyFont: 'Inter',
    },
    hero: {
      type: 'slider',
      overlay: 'gradient',
      alignment: 'center',
    },
    layout: {
      sections: ['announcementBar', 'services', 'gallery', 'stats', 'testimonials', 'faq', 'newsletter', 'cta'],
      servicesVariant: 'grid-3',
      teamVariant: 'grid',
      testimonialsVariant: 'grid',
      galleryVariant: 'grid-4',
      pricingVariant: 'cards-4',
    },
  },

  // FITNESS
  fitness: {
    name: 'Sala Fitness',
    description: 'Design energic si motivational pentru sala de fitness',
    theme: {
      variant: 'red-energy',
      borderRadius: 'medium',
      shadows: 'moderate',
      headingFont: 'Montserrat',
      bodyFont: 'Open_Sans',
    },
    hero: {
      type: 'video',
      overlay: 'dark',
      alignment: 'center',
    },
    layout: {
      sections: ['services', 'howItWorks', 'stats', 'team', 'gallery', 'testimonials', 'faq', 'newsletter', 'cta'],
      servicesVariant: 'grid-3',
      teamVariant: 'carousel',
      testimonialsVariant: 'carousel',
      galleryVariant: 'masonry',
      pricingVariant: 'featured-center',
    },
  },
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Obtine configurarea pentru un business type
 */
export function getSeederConfig(businessType: string): SeederConfig {
  const config = seederConfigs[businessType]
  if (!config) {
    throw new Error(`Unknown business type: ${businessType}. Available types: ${Object.keys(seederConfigs).join(', ')}`)
  }
  return config
}

/**
 * Converteste setarea de overlay din config in configurare hero
 */
export function getHeroOverlaySettings(overlay: HeroOverlay): {
  overlayEnabled: boolean
  overlayOpacity: string
  overlayStyle: 'gradient' | 'dark' | 'primary' | 'secondary' | 'radial'
} {
  switch (overlay) {
    case 'dark':
      return { overlayEnabled: true, overlayOpacity: '70', overlayStyle: 'dark' }
    case 'gradient':
      return { overlayEnabled: true, overlayOpacity: '60', overlayStyle: 'gradient' }
    case 'light':
      return { overlayEnabled: true, overlayOpacity: '50', overlayStyle: 'gradient' }
    case 'none':
    default:
      return { overlayEnabled: false, overlayOpacity: '30', overlayStyle: 'gradient' }
  }
}

/**
 * Lista tuturor business types disponibile
 */
export function getAvailableBusinessTypes(): string[] {
  return Object.keys(seederConfigs)
}
