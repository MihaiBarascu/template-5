/**
 * DESIGN VARIANTS - Variante de design pentru fiecare tip de business
 *
 * Fiecare business type are multiple variante:
 * - Culori diferite (primary, secondary, accent)
 * - Layout-uri diferite pentru homepage
 * - Font presets diferite
 * - Style presets diferite
 *
 * Utilizare: pnpm seed:frizerie --variant=2
 * sau: DESIGN_VARIANT=2 pnpm seed:frizerie
 */

// =============================================================================
// TIPURI
// =============================================================================

// Available fonts - must match SiteTheme schema from Payload
// HeadingFont allows serif fonts like Playfair_Display and modern display fonts
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
  // Modern agency/tech fonts
  | 'Space_Grotesk'
  | 'Sora'
  | 'Outfit'
  | 'Plus_Jakarta_Sans'
  | 'Manrope'
  | 'DM_Sans'
  | 'DM_Serif_Display'
  | 'Raleway'

// BodyFont excludes display serif fonts (no Playfair_Display, DM_Serif_Display)
export type BodyFontName =
  | 'Inter'
  | 'Open_Sans'
  | 'Lato'
  | 'Poppins'
  | 'Source_Sans_3'
  | 'Montserrat'
  | 'Work_Sans'
  | 'Lora'
  // Modern agency/tech fonts
  | 'Space_Grotesk'
  | 'Sora'
  | 'Outfit'
  | 'Plus_Jakarta_Sans'
  | 'Manrope'
  | 'DM_Sans'
  | 'Raleway'

// Combined type for backwards compatibility
export type FontName = HeadingFontName | BodyFontName

export interface DesignVariant {
  id: string
  name: string
  description: string
  theme: {
    preset: 'modern' | 'classic' | 'bold' | 'minimal' | 'elegant'
    colors: {
      primary: string
      secondary: string
      accent: string
      dark: string
      light: string
      surface: string
      text: string
      textLight: string
      border: string
      // Contrast colors - for text on colored backgrounds (optional - uses defaults from generateThemeStyles variant)
      textOnPrimary?: string
      textOnSecondary?: string
      textOnAccent?: string
      textOnDark?: string
      textOnLight?: string
      textOnSurface?: string
    }
    // Fonts for admin SiteTheme global
    headingFont: HeadingFontName
    bodyFont: BodyFontName
    fontPreset: 'modern' | 'elegant' | 'bold' | 'minimalist' | 'classic'
    stylePreset: 'modern' | 'classic' | 'bold' | 'minimal'
    borderRadius: 'none' | 'small' | 'medium' | 'large' | 'full'
    shadows: 'none' | 'subtle' | 'moderate' | 'strong'
    // New typography & spacing settings (optional - defaults to 'normal')
    headingScale?: 'small' | 'compact' | 'normal' | 'large' | 'xlarge'
    bodyTextSize?: 'small' | 'normal' | 'large'
    cardGap?: 'compact' | 'normal' | 'spacious'
    sectionSpacing?: 'compact' | 'normal' | 'spacious'
    animations?: 'none' | 'subtle' | 'moderate' | 'dynamic'
  }
  hero: {
    type: 'fullscreen' | 'centered' | 'split' | 'minimal' | 'video' | 'slider'
    overlay: 'dark' | 'light' | 'gradient' | 'none'
    alignment: 'left' | 'center' | 'right'
  }
  layout: {
    sections: string[] // Order of sections on homepage
    servicesVariant: 'grid-3' | 'grid-2' | 'list' | 'price-list'
    teamVariant: 'grid' | 'carousel'
    testimonialsVariant: 'carousel' | 'grid'
    galleryVariant: 'grid-3' | 'grid-4' | 'masonry' | 'carousel'
    pricingVariant: 'cards-3' | 'cards-4' | 'table' | 'list' | 'toggle' | 'featured-center'
  }
}

// =============================================================================
// BARBERSHOP / FRIZERIE - 5 VARIANTE
// =============================================================================

export const barbershopVariants: DesignVariant[] = [
  // VARIANTA 1 - Classic Dark & Gold (Original)
  {
    id: 'barbershop-v1',
    name: 'Classic Dark & Gold',
    description: 'Design clasic pentru barbershop cu negru si auriu - elegant si masculin',
    theme: {
      preset: 'bold',
      colors: {
        primary: '#1a1a1a',
        secondary: '#c9a227',
        accent: '#d4af37',
        dark: '#0d0d0d',
        light: '#f5f5f5',
        surface: '#ffffff',
        text: '#1a1a1a',
        textLight: '#666666',
        border: '#e5e5e5',
        // Contrast colors
        textOnPrimary: '#c9a227',    // Gold on black - elegant
        textOnSecondary: '#0d0d0d',  // Black on gold
        textOnAccent: '#0d0d0d',     // Black on gold
        textOnDark: '#f5f5f5',       // Light on dark
        textOnLight: '#1a1a1a',      // Dark on light
        textOnSurface: '#1a1a1a',    // Dark on white
      },
      headingFont: 'Playfair_Display',  // Elegant serif pentru barbershop premium
      bodyFont: 'Inter',                 // Modern sans pentru lizibilitate
      fontPreset: 'bold',
      stylePreset: 'bold',
      borderRadius: 'small',
      shadows: 'moderate',
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

  // VARIANTA 2 - Modern Red & White
  {
    id: 'barbershop-v2',
    name: 'Modern Red & White',
    description: 'Design modern cu rosu barber pole si alb - energic si fresh',
    theme: {
      preset: 'modern',
      colors: {
        primary: '#dc2626',
        secondary: '#1e3a5f',
        accent: '#ef4444',
        dark: '#1e293b',
        light: '#f8fafc',
        surface: '#ffffff',
        text: '#0f172a',
        textLight: '#64748b',
        border: '#e2e8f0',
        // Contrast colors
        textOnPrimary: '#ffffff',    // White on red
        textOnSecondary: '#ffffff',  // White on navy
        textOnAccent: '#ffffff',     // White on red
        textOnDark: '#f8fafc',       // Light on dark
        textOnLight: '#0f172a',      // Dark on light
        textOnSurface: '#0f172a',    // Dark on white
      },
      headingFont: 'Montserrat',  // Bold modern pentru energie
      bodyFont: 'Open_Sans',      // Friendly si lizibil
      fontPreset: 'modern',
      stylePreset: 'modern',
      borderRadius: 'medium',
      shadows: 'subtle',
    },
    hero: {
      type: 'split',
      overlay: 'none',
      alignment: 'left',
    },
    layout: {
      sections: ['services', 'openingHours', 'locations', 'team', 'stats', 'gallery', 'testimonials', 'cta'],
      servicesVariant: 'price-list',
      teamVariant: 'grid',
      testimonialsVariant: 'grid',
      galleryVariant: 'grid-4',
      pricingVariant: 'cards-4',
    },
  },

  // VARIANTA 3 - Vintage Brown & Cream
  {
    id: 'barbershop-v3',
    name: 'Vintage Brown & Cream',
    description: 'Design vintage cu maro si crem - clasic si traditional',
    theme: {
      preset: 'classic',
      colors: {
        primary: '#8b4513',
        secondary: '#d4a574',
        accent: '#cd853f',
        dark: '#3d2914',
        light: '#faf8f5',
        surface: '#fffef9',
        text: '#3d2914',
        textLight: '#8b7355',
        border: '#e8e0d5',
        // Contrast colors
        textOnPrimary: '#faf8f5',    // Cream on brown
        textOnSecondary: '#3d2914',  // Dark on tan
        textOnAccent: '#3d2914',     // Dark on gold
        textOnDark: '#faf8f5',       // Light on dark
        textOnLight: '#3d2914',      // Dark on light
        textOnSurface: '#3d2914',    // Dark on cream
      },
      headingFont: 'Lora',
      bodyFont: 'Source_Sans_3',
      fontPreset: 'classic',
      stylePreset: 'classic',
      borderRadius: 'none',
      shadows: 'none',
    },
    hero: {
      type: 'centered',
      overlay: 'gradient',
      alignment: 'center',
    },
    layout: {
      sections: ['stats', 'services', 'openingHours', 'timeline', 'team', 'gallery', 'testimonials', 'faq', 'cta'],
      servicesVariant: 'list',
      teamVariant: 'carousel',
      testimonialsVariant: 'carousel',
      galleryVariant: 'masonry',
      pricingVariant: 'table',
    },
  },

  // VARIANTA 4 - Minimal Black & White
  {
    id: 'barbershop-v4',
    name: 'Minimal Black & White',
    description: 'Design minimalist alb-negru - clean si profesional',
    theme: {
      preset: 'minimal',
      colors: {
        primary: '#000000',
        secondary: '#404040',
        accent: '#171717',
        dark: '#000000',
        light: '#fafafa',
        surface: '#ffffff',
        text: '#171717',
        textLight: '#737373',
        border: '#e5e5e5',
        // Contrast colors
        textOnPrimary: '#ffffff',    // White on black
        textOnSecondary: '#ffffff',  // White on gray
        textOnAccent: '#ffffff',     // White on dark
        textOnDark: '#fafafa',       // Light on dark
        textOnLight: '#171717',      // Dark on light
        textOnSurface: '#171717',    // Dark on white
      },
      headingFont: 'Work_Sans',
      bodyFont: 'Inter',
      fontPreset: 'minimalist',
      stylePreset: 'minimal',
      borderRadius: 'none',
      shadows: 'none',
    },
    hero: {
      type: 'minimal',
      overlay: 'none',
      alignment: 'left',
    },
    layout: {
      sections: ['services', 'openingHours', 'team', 'testimonials', 'cta'],
      servicesVariant: 'grid-3',
      teamVariant: 'grid',
      testimonialsVariant: 'carousel',
      galleryVariant: 'grid-3',
      pricingVariant: 'list',
    },
  },

  // VARIANTA 5 - Urban Green & Dark (CAROUSEL HERO)
  {
    id: 'barbershop-v5',
    name: 'Urban Green & Dark',
    description: 'Design urban cu verde si inchis - modern si cool, cu hero carousel',
    theme: {
      preset: 'modern',
      colors: {
        primary: '#059669',
        secondary: '#1f2937',
        accent: '#10b981',
        dark: '#111827',
        light: '#f0fdf4',
        surface: '#ffffff',
        text: '#111827',
        textLight: '#6b7280',
        border: '#d1d5db',
      },
      headingFont: 'Poppins',
      bodyFont: 'Inter',
      fontPreset: 'modern',
      stylePreset: 'modern',
      borderRadius: 'large',
      shadows: 'moderate',
    },
    hero: {
      type: 'slider',
      overlay: 'dark',
      alignment: 'center',
    },
    layout: {
      sections: ['services', 'locations', 'stats', 'gallery', 'team', 'testimonials', 'faq', 'cta'],
      servicesVariant: 'grid-3',
      teamVariant: 'carousel',
      testimonialsVariant: 'carousel',
      galleryVariant: 'carousel',
      pricingVariant: 'cards-3',
    },
  },
]

// =============================================================================
// DENTIST / CABINET STOMATOLOGIC - 5 VARIANTE
// =============================================================================

export const dentistVariants: DesignVariant[] = [
  // VARIANTA 1 - Clean Blue & White (Medical)
  {
    id: 'dentist-v1',
    name: 'Clean Blue & White',
    description: 'Design medical clasic cu albastru si alb - profesional si de incredere',
    theme: {
      preset: 'modern',
      colors: {
        primary: '#0ea5e9',
        secondary: '#0284c7',
        accent: '#38bdf8',
        dark: '#0c4a6e',
        light: '#f0f9ff',
        surface: '#ffffff',
        text: '#0c4a6e',
        textLight: '#64748b',
        border: '#e0f2fe',
      },
      headingFont: 'Poppins',
      bodyFont: 'Inter',
      fontPreset: 'modern',
      stylePreset: 'modern',
      borderRadius: 'medium',
      shadows: 'subtle',
    },
    hero: {
      type: 'split',
      overlay: 'none',
      alignment: 'left',
    },
    layout: {
      sections: ['announcementBar', 'services', 'trustBadges', 'howItWorks', 'openingHours', 'locations', 'stats', 'team', 'testimonials', 'faq', 'latestPosts', 'newsletter', 'cta'],
      servicesVariant: 'grid-3',
      teamVariant: 'grid',
      testimonialsVariant: 'carousel',
      galleryVariant: 'grid-3',
      pricingVariant: 'cards-3',
    },
  },

  // VARIANTA 2 - Teal & Mint Fresh
  {
    id: 'dentist-v2',
    name: 'Teal & Mint Fresh',
    description: 'Design fresh cu teal si mint - modern si relaxant',
    theme: {
      preset: 'modern',
      colors: {
        primary: '#14b8a6',
        secondary: '#0d9488',
        accent: '#2dd4bf',
        dark: '#134e4a',
        light: '#f0fdfa',
        surface: '#ffffff',
        text: '#134e4a',
        textLight: '#5eead4',
        border: '#ccfbf1',
      },
      headingFont: 'Playfair_Display',
      bodyFont: 'Lato',
      fontPreset: 'elegant',
      stylePreset: 'modern',
      borderRadius: 'large',
      shadows: 'moderate',
    },
    hero: {
      type: 'fullscreen',
      overlay: 'light',
      alignment: 'center',
    },
    layout: {
      sections: ['stats', 'services', 'openingHours', 'locations', 'team', 'gallery', 'testimonials', 'cta'],
      servicesVariant: 'price-list',
      teamVariant: 'grid',
      testimonialsVariant: 'grid',
      galleryVariant: 'masonry',
      pricingVariant: 'cards-4',
    },
  },

  // VARIANTA 3 - Purple Premium
  {
    id: 'dentist-v3',
    name: 'Purple Premium',
    description: 'Design premium cu violet - luxos si sofisticat',
    theme: {
      preset: 'elegant',
      colors: {
        primary: '#7c3aed',
        secondary: '#6d28d9',
        accent: '#a78bfa',
        dark: '#4c1d95',
        light: '#f5f3ff',
        surface: '#ffffff',
        text: '#4c1d95',
        textLight: '#7c3aed',
        border: '#ede9fe',
      },
      headingFont: 'Playfair_Display',
      bodyFont: 'Lato',
      fontPreset: 'elegant',
      stylePreset: 'modern',
      borderRadius: 'medium',
      shadows: 'moderate',
    },
    hero: {
      type: 'centered',
      overlay: 'gradient',
      alignment: 'center',
    },
    layout: {
      sections: ['services', 'team', 'stats', 'openingHours', 'testimonials', 'gallery', 'faq', 'cta'],
      servicesVariant: 'grid-3',
      teamVariant: 'carousel',
      testimonialsVariant: 'carousel',
      galleryVariant: 'carousel',
      pricingVariant: 'table',
    },
  },

  // VARIANTA 4 - Green Nature
  {
    id: 'dentist-v4',
    name: 'Green Nature',
    description: 'Design natural cu verde - ecologic si sanatos',
    theme: {
      preset: 'modern',
      colors: {
        primary: '#22c55e',
        secondary: '#16a34a',
        accent: '#4ade80',
        dark: '#14532d',
        light: '#f0fdf4',
        surface: '#ffffff',
        text: '#14532d',
        textLight: '#166534',
        border: '#dcfce7',
      },
      headingFont: 'Poppins',
      bodyFont: 'Inter',
      fontPreset: 'modern',
      stylePreset: 'modern',
      borderRadius: 'full',
      shadows: 'subtle',
    },
    hero: {
      type: 'split',
      overlay: 'none',
      alignment: 'left',
    },
    layout: {
      sections: ['services', 'stats', 'locations', 'team', 'gallery', 'testimonials', 'cta'],
      servicesVariant: 'grid-3',
      teamVariant: 'grid',
      testimonialsVariant: 'carousel',
      galleryVariant: 'grid-4',
      pricingVariant: 'cards-3',
    },
  },

  // VARIANTA 5 - Minimal Gray (CAROUSEL HERO)
  {
    id: 'dentist-v5',
    name: 'Minimal Gray',
    description: 'Design minimalist cu gri - profesional si serios, cu hero carousel',
    theme: {
      preset: 'minimal',
      colors: {
        primary: '#6b7280',
        secondary: '#4b5563',
        accent: '#9ca3af',
        dark: '#1f2937',
        light: '#f9fafb',
        surface: '#ffffff',
        text: '#1f2937',
        textLight: '#6b7280',
        border: '#e5e7eb',
      },
      headingFont: 'Work_Sans',
      bodyFont: 'Inter',
      fontPreset: 'minimalist',
      stylePreset: 'minimal',
      borderRadius: 'small',
      shadows: 'none',
    },
    hero: {
      type: 'slider',
      overlay: 'dark',
      alignment: 'left',
    },
    layout: {
      sections: ['services', 'openingHours', 'team', 'testimonials', 'cta'],
      servicesVariant: 'list',
      teamVariant: 'grid',
      testimonialsVariant: 'carousel',
      galleryVariant: 'grid-3',
      pricingVariant: 'list',
    },
  },
]

// =============================================================================
// RESTAURANT / CAFENEA - 5 VARIANTE
// =============================================================================

export const restaurantVariants: DesignVariant[] = [
  // VARIANTA 1 - Warm Orange & Brown
  {
    id: 'restaurant-v1',
    name: 'Warm Orange & Brown',
    description: 'Design cald cu portocaliu si maro - primitor si apetisant',
    theme: {
      preset: 'classic',
      colors: {
        primary: '#ea580c',
        secondary: '#9a3412',
        accent: '#fb923c',
        dark: '#7c2d12',
        light: '#fff7ed',
        surface: '#ffffff',
        text: '#7c2d12',
        textLight: '#c2410c',
        border: '#fed7aa',
      },
      headingFont: 'Lora',
      bodyFont: 'Source_Sans_3',
      fontPreset: 'classic',
      stylePreset: 'classic',
      borderRadius: 'medium',
      shadows: 'moderate',
    },
    hero: {
      type: 'fullscreen',
      overlay: 'dark',
      alignment: 'center',
    },
    layout: {
      sections: ['announcementBar', 'trustBadges', 'services', 'howItWorks', 'openingHours', 'locations', 'stats', 'gallery', 'team', 'testimonials', 'faq', 'latestPosts', 'cta'],
      servicesVariant: 'grid-3',
      teamVariant: 'grid',
      testimonialsVariant: 'carousel',
      galleryVariant: 'masonry',
      pricingVariant: 'cards-3',
    },
  },

  // VARIANTA 2 - Elegant Dark & Gold (VIDEO HERO)
  {
    id: 'restaurant-v2',
    name: 'Elegant Dark & Gold',
    description: 'Design elegant cu inchis si auriu - fine dining si lux, cu video hero',
    theme: {
      preset: 'elegant',
      colors: {
        primary: '#1c1917',
        secondary: '#d4af37',
        accent: '#fbbf24',
        dark: '#0c0a09',
        light: '#fafaf9',
        surface: '#ffffff',
        text: '#1c1917',
        textLight: '#78716c',
        border: '#e7e5e4',
      },
      headingFont: 'Playfair_Display',
      bodyFont: 'Lato',
      fontPreset: 'elegant',
      stylePreset: 'classic',
      borderRadius: 'none',
      shadows: 'subtle',
    },
    hero: {
      type: 'video',
      overlay: 'dark',
      alignment: 'center',
    },
    layout: {
      sections: ['gallery', 'services', 'openingHours', 'timeline', 'stats', 'team', 'testimonials', 'faq', 'cta'],
      servicesVariant: 'grid-3',
      teamVariant: 'carousel',
      testimonialsVariant: 'carousel',
      galleryVariant: 'carousel',
      pricingVariant: 'table',
    },
  },

  // VARIANTA 3 - Fresh Green & White
  {
    id: 'restaurant-v3',
    name: 'Fresh Green & White',
    description: 'Design fresh cu verde si alb - organic si sanatos',
    theme: {
      preset: 'modern',
      colors: {
        primary: '#65a30d',
        secondary: '#4d7c0f',
        accent: '#84cc16',
        dark: '#365314',
        light: '#f7fee7',
        surface: '#ffffff',
        text: '#365314',
        textLight: '#4d7c0f',
        border: '#d9f99d',
      },
      headingFont: 'Poppins',
      bodyFont: 'Inter',
      fontPreset: 'modern',
      stylePreset: 'modern',
      borderRadius: 'large',
      shadows: 'moderate',
    },
    hero: {
      type: 'split',
      overlay: 'none',
      alignment: 'left',
    },
    layout: {
      sections: ['services', 'openingHours', 'locations', 'team', 'stats', 'gallery', 'testimonials', 'cta'],
      servicesVariant: 'price-list',
      teamVariant: 'grid',
      testimonialsVariant: 'grid',
      galleryVariant: 'grid-4',
      pricingVariant: 'cards-4',
    },
  },

  // VARIANTA 4 - Red Italian
  {
    id: 'restaurant-v4',
    name: 'Red Italian',
    description: 'Design italian cu rosu si crem - traditional si pasional',
    theme: {
      preset: 'classic',
      colors: {
        primary: '#dc2626',
        secondary: '#b91c1c',
        accent: '#f87171',
        dark: '#7f1d1d',
        light: '#fef2f2',
        surface: '#fffbeb',
        text: '#7f1d1d',
        textLight: '#991b1b',
        border: '#fecaca',
      },
      headingFont: 'Lora',
      bodyFont: 'Source_Sans_3',
      fontPreset: 'classic',
      stylePreset: 'classic',
      borderRadius: 'small',
      shadows: 'moderate',
    },
    hero: {
      type: 'fullscreen',
      overlay: 'gradient',
      alignment: 'center',
    },
    layout: {
      sections: ['stats', 'services', 'openingHours', 'gallery', 'team', 'testimonials', 'faq', 'cta'],
      servicesVariant: 'list',
      teamVariant: 'grid',
      testimonialsVariant: 'carousel',
      galleryVariant: 'masonry',
      pricingVariant: 'cards-3',
    },
  },

  // VARIANTA 5 - Modern Blue Cafe (CAROUSEL HERO)
  {
    id: 'restaurant-v5',
    name: 'Modern Blue Cafe',
    description: 'Design modern cu albastru - cafenea trendy si cool, cu hero carousel',
    theme: {
      preset: 'modern',
      colors: {
        primary: '#2563eb',
        secondary: '#1d4ed8',
        accent: '#3b82f6',
        dark: '#1e3a8a',
        light: '#eff6ff',
        surface: '#ffffff',
        text: '#1e3a8a',
        textLight: '#3b82f6',
        border: '#bfdbfe',
      },
      headingFont: 'Poppins',
      bodyFont: 'Inter',
      fontPreset: 'modern',
      stylePreset: 'modern',
      borderRadius: 'full',
      shadows: 'subtle',
    },
    hero: {
      type: 'slider',
      overlay: 'gradient',
      alignment: 'left',
    },
    layout: {
      sections: ['services', 'openingHours', 'gallery', 'team', 'testimonials', 'cta'],
      servicesVariant: 'grid-3',
      teamVariant: 'carousel',
      testimonialsVariant: 'carousel',
      galleryVariant: 'grid-3',
      pricingVariant: 'list',
    },
  },
]

// =============================================================================
// SALON / INFRUMUSETARE - 5 VARIANTE
// =============================================================================

export const salonVariants: DesignVariant[] = [
  // VARIANTA 1 - Pink & Rose Gold
  {
    id: 'salon-v1',
    name: 'Pink & Rose Gold',
    description: 'Design feminin cu roz si rose gold - glamour si elegant',
    theme: {
      preset: 'elegant',
      colors: {
        primary: '#ec4899',
        secondary: '#db2777',
        accent: '#f472b6',
        dark: '#831843',
        light: '#fdf2f8',
        surface: '#ffffff',
        text: '#831843',
        textLight: '#be185d',
        border: '#fbcfe8',
      },
      headingFont: 'Playfair_Display',
      bodyFont: 'Lato',
      fontPreset: 'elegant',
      stylePreset: 'modern',
      borderRadius: 'full',
      shadows: 'subtle',
    },
    hero: {
      type: 'fullscreen',
      overlay: 'light',
      alignment: 'center',
    },
    layout: {
      sections: ['announcementBar', 'services', 'trustBadges', 'howItWorks', 'openingHours', 'locations', 'stats', 'team', 'gallery', 'testimonials', 'faq', 'latestPosts', 'cta'],
      servicesVariant: 'grid-3',
      teamVariant: 'grid',
      testimonialsVariant: 'carousel',
      galleryVariant: 'masonry',
      pricingVariant: 'cards-3',
    },
  },

  // VARIANTA 2 - Purple Luxury
  {
    id: 'salon-v2',
    name: 'Purple Luxury',
    description: 'Design luxos cu violet - sofisticat si premium',
    theme: {
      preset: 'elegant',
      colors: {
        primary: '#9333ea',
        secondary: '#7e22ce',
        accent: '#a855f7',
        dark: '#581c87',
        light: '#faf5ff',
        surface: '#ffffff',
        text: '#581c87',
        textLight: '#7e22ce',
        border: '#e9d5ff',
      },
      headingFont: 'Playfair_Display',
      bodyFont: 'Lato',
      fontPreset: 'elegant',
      stylePreset: 'classic',
      borderRadius: 'medium',
      shadows: 'moderate',
    },
    hero: {
      type: 'centered',
      overlay: 'gradient',
      alignment: 'center',
    },
    layout: {
      sections: ['gallery', 'services', 'openingHours', 'team', 'stats', 'testimonials', 'faq', 'cta'],
      servicesVariant: 'grid-3',
      teamVariant: 'carousel',
      testimonialsVariant: 'carousel',
      galleryVariant: 'carousel',
      pricingVariant: 'table',
    },
  },

  // VARIANTA 3 - Nude & Beige Natural
  {
    id: 'salon-v3',
    name: 'Nude & Beige Natural',
    description: 'Design natural cu nude si bej - calm si relaxant',
    theme: {
      preset: 'minimal',
      colors: {
        primary: '#a8a29e',
        secondary: '#78716c',
        accent: '#d6d3d1',
        dark: '#44403c',
        light: '#fafaf9',
        surface: '#ffffff',
        text: '#44403c',
        textLight: '#78716c',
        border: '#e7e5e4',
      },
      headingFont: 'Work_Sans',
      bodyFont: 'Inter',
      fontPreset: 'minimalist',
      stylePreset: 'minimal',
      borderRadius: 'none',
      shadows: 'none',
    },
    hero: {
      type: 'minimal',
      overlay: 'none',
      alignment: 'left',
    },
    layout: {
      sections: ['services', 'openingHours', 'team', 'gallery', 'testimonials', 'cta'],
      servicesVariant: 'list',
      teamVariant: 'grid',
      testimonialsVariant: 'carousel',
      galleryVariant: 'grid-3',
      pricingVariant: 'list',
    },
  },

  // VARIANTA 4 - Teal & Gold Spa
  {
    id: 'salon-v4',
    name: 'Teal & Gold Spa',
    description: 'Design spa cu teal si auriu - relaxant si luxos',
    theme: {
      preset: 'elegant',
      colors: {
        primary: '#0d9488',
        secondary: '#d4af37',
        accent: '#14b8a6',
        dark: '#134e4a',
        light: '#f0fdfa',
        surface: '#ffffff',
        text: '#134e4a',
        textLight: '#0f766e',
        border: '#ccfbf1',
      },
      headingFont: 'Playfair_Display',
      bodyFont: 'Lato',
      fontPreset: 'elegant',
      stylePreset: 'modern',
      borderRadius: 'large',
      shadows: 'moderate',
    },
    hero: {
      type: 'fullscreen',
      overlay: 'dark',
      alignment: 'center',
    },
    layout: {
      sections: ['services', 'stats', 'locations', 'gallery', 'team', 'testimonials', 'faq', 'cta'],
      servicesVariant: 'price-list',
      teamVariant: 'grid',
      testimonialsVariant: 'grid',
      galleryVariant: 'masonry',
      pricingVariant: 'cards-4',
    },
  },

  // VARIANTA 5 - Black & White Chic (CAROUSEL HERO)
  {
    id: 'salon-v5',
    name: 'Black & White Chic',
    description: 'Design chic cu negru si alb - modern si stylish, cu hero carousel',
    theme: {
      preset: 'bold',
      colors: {
        primary: '#18181b',
        secondary: '#27272a',
        accent: '#3f3f46',
        dark: '#09090b',
        light: '#fafafa',
        surface: '#ffffff',
        text: '#18181b',
        textLight: '#52525b',
        border: '#e4e4e7',
      },
      headingFont: 'Montserrat',
      bodyFont: 'Work_Sans',
      fontPreset: 'bold',
      stylePreset: 'bold',
      borderRadius: 'none',
      shadows: 'strong',
    },
    hero: {
      type: 'slider',
      overlay: 'dark',
      alignment: 'left',
    },
    layout: {
      sections: ['services', 'openingHours', 'team', 'stats', 'gallery', 'testimonials', 'cta'],
      servicesVariant: 'grid-3',
      teamVariant: 'grid',
      testimonialsVariant: 'carousel',
      galleryVariant: 'grid-4',
      pricingVariant: 'cards-3',
    },
  },
]

// =============================================================================
// AUTO SERVICE - 5 VARIANTE
// =============================================================================

export const autoServiceVariants: DesignVariant[] = [
  // VARIANTA 1 - Classic Red & Dark
  {
    id: 'auto-v1',
    name: 'Classic Red & Dark',
    description: 'Design clasic cu rosu si inchis - puternic si de incredere',
    theme: {
      preset: 'bold',
      colors: {
        primary: '#dc2626',
        secondary: '#1f2937',
        accent: '#ef4444',
        dark: '#111827',
        light: '#f9fafb',
        surface: '#ffffff',
        text: '#111827',
        textLight: '#6b7280',
        border: '#e5e7eb',
      },
      headingFont: 'Montserrat',
      bodyFont: 'Work_Sans',
      fontPreset: 'bold',
      stylePreset: 'bold',
      borderRadius: 'small',
      shadows: 'moderate',
    },
    hero: {
      type: 'fullscreen',
      overlay: 'dark',
      alignment: 'center',
    },
    layout: {
      sections: ['announcementBar', 'trustBadges', 'services', 'howItWorks', 'openingHours', 'locations', 'stats', 'team', 'gallery', 'testimonials', 'faq', 'latestPosts', 'cta'],
      servicesVariant: 'grid-3',
      teamVariant: 'grid',
      testimonialsVariant: 'carousel',
      galleryVariant: 'masonry',
      pricingVariant: 'cards-3',
    },
  },

  // VARIANTA 2 - Orange Industrial
  {
    id: 'auto-v2',
    name: 'Orange Industrial',
    description: 'Design industrial cu portocaliu - energic si profesional',
    theme: {
      preset: 'modern',
      colors: {
        primary: '#f97316',
        secondary: '#374151',
        accent: '#fb923c',
        dark: '#1f2937',
        light: '#fff7ed',
        surface: '#ffffff',
        text: '#1f2937',
        textLight: '#6b7280',
        border: '#fed7aa',
      },
      headingFont: 'Poppins',
      bodyFont: 'Inter',
      fontPreset: 'modern',
      stylePreset: 'modern',
      borderRadius: 'medium',
      shadows: 'subtle',
    },
    hero: {
      type: 'split',
      overlay: 'none',
      alignment: 'left',
    },
    layout: {
      sections: ['services', 'openingHours', 'locations', 'team', 'stats', 'gallery', 'testimonials', 'cta'],
      servicesVariant: 'price-list',
      teamVariant: 'grid',
      testimonialsVariant: 'grid',
      galleryVariant: 'grid-4',
      pricingVariant: 'table',
    },
  },

  // VARIANTA 3 - Blue Professional
  {
    id: 'auto-v3',
    name: 'Blue Professional',
    description: 'Design profesional cu albastru - serios si competent',
    theme: {
      preset: 'modern',
      colors: {
        primary: '#2563eb',
        secondary: '#1e40af',
        accent: '#3b82f6',
        dark: '#1e3a8a',
        light: '#eff6ff',
        surface: '#ffffff',
        text: '#1e3a8a',
        textLight: '#3b82f6',
        border: '#bfdbfe',
      },
      headingFont: 'Poppins',
      bodyFont: 'Inter',
      fontPreset: 'modern',
      stylePreset: 'modern',
      borderRadius: 'medium',
      shadows: 'moderate',
    },
    hero: {
      type: 'centered',
      overlay: 'gradient',
      alignment: 'center',
    },
    layout: {
      sections: ['stats', 'services', 'openingHours', 'timeline', 'team', 'testimonials', 'gallery', 'faq', 'cta'],
      servicesVariant: 'grid-3',
      teamVariant: 'carousel',
      testimonialsVariant: 'carousel',
      galleryVariant: 'carousel',
      pricingVariant: 'cards-4',
    },
  },

  // VARIANTA 4 - Yellow & Black Speed (CAROUSEL HERO)
  {
    id: 'auto-v4',
    name: 'Yellow & Black Speed',
    description: 'Design speed cu galben si negru - rapid si eficient, cu hero carousel',
    theme: {
      preset: 'bold',
      colors: {
        primary: '#eab308',
        secondary: '#18181b',
        accent: '#facc15',
        dark: '#09090b',
        light: '#fefce8',
        surface: '#ffffff',
        text: '#18181b',
        textLight: '#52525b',
        border: '#fef08a',
      },
      headingFont: 'Montserrat',
      bodyFont: 'Work_Sans',
      fontPreset: 'bold',
      stylePreset: 'bold',
      borderRadius: 'none',
      shadows: 'strong',
    },
    hero: {
      type: 'slider',
      overlay: 'dark',
      alignment: 'center',
    },
    layout: {
      sections: ['services', 'openingHours', 'stats', 'gallery', 'team', 'testimonials', 'cta'],
      servicesVariant: 'grid-3',
      teamVariant: 'grid',
      testimonialsVariant: 'carousel',
      galleryVariant: 'masonry',
      pricingVariant: 'cards-3',
    },
  },

  // VARIANTA 5 - Green Eco
  {
    id: 'auto-v5',
    name: 'Green Eco',
    description: 'Design eco cu verde - pentru service-uri eco-friendly',
    theme: {
      preset: 'modern',
      colors: {
        primary: '#16a34a',
        secondary: '#15803d',
        accent: '#22c55e',
        dark: '#14532d',
        light: '#f0fdf4',
        surface: '#ffffff',
        text: '#14532d',
        textLight: '#166534',
        border: '#bbf7d0',
      },
      headingFont: 'Poppins',
      bodyFont: 'Inter',
      fontPreset: 'modern',
      stylePreset: 'modern',
      borderRadius: 'large',
      shadows: 'subtle',
    },
    hero: {
      type: 'split',
      overlay: 'none',
      alignment: 'left',
    },
    layout: {
      sections: ['services', 'locations', 'stats', 'team', 'testimonials', 'gallery', 'cta'],
      servicesVariant: 'list',
      teamVariant: 'grid',
      testimonialsVariant: 'carousel',
      galleryVariant: 'grid-3',
      pricingVariant: 'list',
    },
  },
]

// =============================================================================
// AVOCAT / CABINET JURIDIC - 5 VARIANTE
// =============================================================================

export const avocatVariants: DesignVariant[] = [
  // VARIANTA 1 - Classic Navy & Gold
  {
    id: 'avocat-v1',
    name: 'Classic Navy & Gold',
    description: 'Design clasic cu bleumarin si auriu - autoritar si profesional',
    theme: {
      preset: 'elegant',
      colors: {
        primary: '#1e3a5f',
        secondary: '#d4af37',
        accent: '#2563eb',
        dark: '#0f172a',
        light: '#f8fafc',
        surface: '#ffffff',
        text: '#0f172a',
        textLight: '#475569',
        border: '#e2e8f0',
      },
      headingFont: 'Playfair_Display',
      bodyFont: 'Lato',
      fontPreset: 'elegant',
      stylePreset: 'classic',
      borderRadius: 'none',
      shadows: 'subtle',
    },
    hero: {
      type: 'centered',
      overlay: 'dark',
      alignment: 'center',
    },
    layout: {
      sections: ['announcementBar', 'trustBadges', 'services', 'howItWorks', 'openingHours', 'locations', 'timeline', 'stats', 'team', 'testimonials', 'faq', 'latestPosts', 'cta'],
      servicesVariant: 'grid-3',
      teamVariant: 'grid',
      testimonialsVariant: 'carousel',
      galleryVariant: 'grid-3',
      pricingVariant: 'cards-3',
    },
  },

  // VARIANTA 2 - Modern Gray & Blue
  {
    id: 'avocat-v2',
    name: 'Modern Gray & Blue',
    description: 'Design modern cu gri si albastru - corporatist si serios',
    theme: {
      preset: 'modern',
      colors: {
        primary: '#3b82f6',
        secondary: '#64748b',
        accent: '#60a5fa',
        dark: '#1e293b',
        light: '#f1f5f9',
        surface: '#ffffff',
        text: '#1e293b',
        textLight: '#64748b',
        border: '#e2e8f0',
      },
      headingFont: 'Poppins',
      bodyFont: 'Inter',
      fontPreset: 'modern',
      stylePreset: 'modern',
      borderRadius: 'medium',
      shadows: 'moderate',
    },
    hero: {
      type: 'split',
      overlay: 'none',
      alignment: 'left',
    },
    layout: {
      sections: ['services', 'openingHours', 'team', 'stats', 'testimonials', 'faq', 'cta'],
      servicesVariant: 'grid-3',
      teamVariant: 'grid',
      testimonialsVariant: 'grid',
      galleryVariant: 'grid-4',
      pricingVariant: 'cards-4',
    },
  },

  // VARIANTA 3 - Dark Green Professional (CAROUSEL HERO)
  {
    id: 'avocat-v3',
    name: 'Dark Green Professional',
    description: 'Design profesional cu verde inchis - de incredere si stabil, cu hero carousel',
    theme: {
      preset: 'classic',
      colors: {
        primary: '#166534',
        secondary: '#14532d',
        accent: '#22c55e',
        dark: '#052e16',
        light: '#f0fdf4',
        surface: '#ffffff',
        text: '#052e16',
        textLight: '#166534',
        border: '#dcfce7',
      },
      headingFont: 'Lora',
      bodyFont: 'Source_Sans_3',
      fontPreset: 'classic',
      stylePreset: 'classic',
      borderRadius: 'small',
      shadows: 'subtle',
    },
    hero: {
      type: 'slider',
      overlay: 'dark',
      alignment: 'center',
    },
    layout: {
      sections: ['stats', 'services', 'locations', 'timeline', 'team', 'testimonials', 'gallery', 'faq', 'cta'],
      servicesVariant: 'list',
      teamVariant: 'carousel',
      testimonialsVariant: 'carousel',
      galleryVariant: 'carousel',
      pricingVariant: 'table',
    },
  },

  // VARIANTA 4 - Burgundy Premium
  {
    id: 'avocat-v4',
    name: 'Burgundy Premium',
    description: 'Design premium cu burgundy - luxos si sofisticat',
    theme: {
      preset: 'elegant',
      colors: {
        primary: '#7f1d1d',
        secondary: '#991b1b',
        accent: '#b91c1c',
        dark: '#450a0a',
        light: '#fef2f2',
        surface: '#ffffff',
        text: '#450a0a',
        textLight: '#7f1d1d',
        border: '#fecaca',
      },
      headingFont: 'Playfair_Display',
      bodyFont: 'Lato',
      fontPreset: 'elegant',
      stylePreset: 'classic',
      borderRadius: 'none',
      shadows: 'moderate',
    },
    hero: {
      type: 'centered',
      overlay: 'gradient',
      alignment: 'center',
    },
    layout: {
      sections: ['services', 'openingHours', 'stats', 'team', 'gallery', 'testimonials', 'faq', 'cta'],
      servicesVariant: 'price-list',
      teamVariant: 'grid',
      testimonialsVariant: 'carousel',
      galleryVariant: 'masonry',
      pricingVariant: 'cards-3',
    },
  },

  // VARIANTA 5 - Minimal Black & White
  {
    id: 'avocat-v5',
    name: 'Minimal Black & White',
    description: 'Design minimalist alb-negru - direct si profesional',
    theme: {
      preset: 'minimal',
      colors: {
        primary: '#171717',
        secondary: '#404040',
        accent: '#525252',
        dark: '#0a0a0a',
        light: '#fafafa',
        surface: '#ffffff',
        text: '#171717',
        textLight: '#737373',
        border: '#e5e5e5',
      },
      headingFont: 'Work_Sans',
      bodyFont: 'Inter',
      fontPreset: 'minimalist',
      stylePreset: 'minimal',
      borderRadius: 'none',
      shadows: 'none',
    },
    hero: {
      type: 'minimal',
      overlay: 'none',
      alignment: 'left',
    },
    layout: {
      sections: ['services', 'locations', 'team', 'testimonials', 'cta'],
      servicesVariant: 'grid-3',
      teamVariant: 'grid',
      testimonialsVariant: 'carousel',
      galleryVariant: 'grid-3',
      pricingVariant: 'list',
    },
  },
]

// =============================================================================
// CONSTRUCTII / RENOVARI - 5 VARIANTE
// =============================================================================

export const constructiiVariants: DesignVariant[] = [
  // VARIANTA 1 - Orange & Dark Industrial
  {
    id: 'constructii-v1',
    name: 'Orange & Dark Industrial',
    description: 'Design industrial cu portocaliu si inchis - puternic si robust',
    theme: {
      preset: 'bold',
      colors: {
        primary: '#ea580c',
        secondary: '#1f2937',
        accent: '#f97316',
        dark: '#111827',
        light: '#fff7ed',
        surface: '#ffffff',
        text: '#111827',
        textLight: '#6b7280',
        border: '#fed7aa',
      },
      headingFont: 'Montserrat',
      bodyFont: 'Work_Sans',
      fontPreset: 'bold',
      stylePreset: 'bold',
      borderRadius: 'small',
      shadows: 'moderate',
    },
    hero: {
      type: 'fullscreen',
      overlay: 'dark',
      alignment: 'center',
    },
    layout: {
      sections: ['announcementBar', 'trustBadges', 'services', 'howItWorks', 'openingHours', 'locations', 'timeline', 'stats', 'gallery', 'team', 'testimonials', 'faq', 'latestPosts', 'cta'],
      servicesVariant: 'grid-3',
      teamVariant: 'grid',
      testimonialsVariant: 'carousel',
      galleryVariant: 'masonry',
      pricingVariant: 'cards-3',
    },
  },

  // VARIANTA 2 - Yellow Safety
  {
    id: 'constructii-v2',
    name: 'Yellow Safety',
    description: 'Design safety cu galben si negru - vizibil si profesional',
    theme: {
      preset: 'bold',
      colors: {
        primary: '#eab308',
        secondary: '#18181b',
        accent: '#facc15',
        dark: '#09090b',
        light: '#fefce8',
        surface: '#ffffff',
        text: '#18181b',
        textLight: '#52525b',
        border: '#fef08a',
      },
      headingFont: 'Montserrat',
      bodyFont: 'Work_Sans',
      fontPreset: 'bold',
      stylePreset: 'bold',
      borderRadius: 'none',
      shadows: 'strong',
    },
    hero: {
      type: 'split',
      overlay: 'none',
      alignment: 'left',
    },
    layout: {
      sections: ['services', 'openingHours', 'locations', 'stats', 'team', 'gallery', 'testimonials', 'cta'],
      servicesVariant: 'price-list',
      teamVariant: 'grid',
      testimonialsVariant: 'grid',
      galleryVariant: 'grid-4',
      pricingVariant: 'table',
    },
  },

  // VARIANTA 3 - Blue Modern
  {
    id: 'constructii-v3',
    name: 'Blue Modern',
    description: 'Design modern cu albastru - profesional si de incredere',
    theme: {
      preset: 'modern',
      colors: {
        primary: '#2563eb',
        secondary: '#1e40af',
        accent: '#3b82f6',
        dark: '#1e3a8a',
        light: '#eff6ff',
        surface: '#ffffff',
        text: '#1e3a8a',
        textLight: '#3b82f6',
        border: '#bfdbfe',
      },
      headingFont: 'Poppins',
      bodyFont: 'Inter',
      fontPreset: 'modern',
      stylePreset: 'modern',
      borderRadius: 'medium',
      shadows: 'moderate',
    },
    hero: {
      type: 'centered',
      overlay: 'gradient',
      alignment: 'center',
    },
    layout: {
      sections: ['stats', 'services', 'timeline', 'gallery', 'team', 'testimonials', 'faq', 'cta'],
      servicesVariant: 'grid-3',
      teamVariant: 'carousel',
      testimonialsVariant: 'carousel',
      galleryVariant: 'carousel',
      pricingVariant: 'cards-4',
    },
  },

  // VARIANTA 4 - Green Eco Construction (CAROUSEL HERO)
  {
    id: 'constructii-v4',
    name: 'Green Eco Construction',
    description: 'Design eco cu verde - constructii sustenabile, cu hero carousel',
    theme: {
      preset: 'modern',
      colors: {
        primary: '#16a34a',
        secondary: '#15803d',
        accent: '#22c55e',
        dark: '#14532d',
        light: '#f0fdf4',
        surface: '#ffffff',
        text: '#14532d',
        textLight: '#166534',
        border: '#bbf7d0',
      },
      headingFont: 'Poppins',
      bodyFont: 'Inter',
      fontPreset: 'modern',
      stylePreset: 'modern',
      borderRadius: 'large',
      shadows: 'subtle',
    },
    hero: {
      type: 'slider',
      overlay: 'gradient',
      alignment: 'center',
    },
    layout: {
      sections: ['services', 'openingHours', 'gallery', 'stats', 'team', 'testimonials', 'cta'],
      servicesVariant: 'grid-3',
      teamVariant: 'grid',
      testimonialsVariant: 'carousel',
      galleryVariant: 'grid-4',
      pricingVariant: 'cards-3',
    },
  },

  // VARIANTA 5 - Gray Minimal Professional
  {
    id: 'constructii-v5',
    name: 'Gray Minimal Professional',
    description: 'Design minimal cu gri - serios si competent',
    theme: {
      preset: 'minimal',
      colors: {
        primary: '#4b5563',
        secondary: '#374151',
        accent: '#6b7280',
        dark: '#1f2937',
        light: '#f9fafb',
        surface: '#ffffff',
        text: '#1f2937',
        textLight: '#6b7280',
        border: '#e5e7eb',
      },
      headingFont: 'Work_Sans',
      bodyFont: 'Inter',
      fontPreset: 'minimalist',
      stylePreset: 'minimal',
      borderRadius: 'small',
      shadows: 'none',
    },
    hero: {
      type: 'minimal',
      overlay: 'none',
      alignment: 'left',
    },
    layout: {
      sections: ['services', 'locations', 'gallery', 'team', 'testimonials', 'cta'],
      servicesVariant: 'list',
      teamVariant: 'grid',
      testimonialsVariant: 'carousel',
      galleryVariant: 'grid-3',
      pricingVariant: 'list',
    },
  },
]

// =============================================================================
// MAGAZIN / SHOP - 5 VARIANTE
// =============================================================================

export const magazinVariants: DesignVariant[] = [
  // VARIANTA 1 - Green Eco & Natural
  {
    id: 'magazin-v1',
    name: 'Green Eco & Natural',
    description: 'Design natural cu verde si alb - organic si eco-friendly',
    theme: {
      preset: 'modern',
      colors: {
        primary: '#16a34a',
        secondary: '#15803d',
        accent: '#22c55e',
        dark: '#14532d',
        light: '#f0fdf4',
        surface: '#ffffff',
        text: '#14532d',
        textLight: '#166534',
        border: '#bbf7d0',
      },
      headingFont: 'Poppins',
      bodyFont: 'Inter',
      fontPreset: 'modern',
      stylePreset: 'modern',
      borderRadius: 'medium',
      shadows: 'subtle',
    },
    hero: {
      type: 'fullscreen',
      overlay: 'light',
      alignment: 'center',
    },
    layout: {
      sections: ['announcementBar', 'trustBadges', 'products', 'howItWorks', 'openingHours', 'locations', 'newsletter', 'stats', 'testimonials', 'faq', 'latestPosts', 'cta'],
      servicesVariant: 'grid-3',
      teamVariant: 'grid',
      testimonialsVariant: 'carousel',
      galleryVariant: 'grid-4',
      pricingVariant: 'cards-3',
    },
  },

  // VARIANTA 2 - Orange Vibrant
  {
    id: 'magazin-v2',
    name: 'Orange Vibrant',
    description: 'Design vibrant cu portocaliu - energic si prietenos',
    theme: {
      preset: 'modern',
      colors: {
        primary: '#ea580c',
        secondary: '#c2410c',
        accent: '#f97316',
        dark: '#7c2d12',
        light: '#fff7ed',
        surface: '#ffffff',
        text: '#7c2d12',
        textLight: '#9a3412',
        border: '#fed7aa',
      },
      headingFont: 'Poppins',
      bodyFont: 'Inter',
      fontPreset: 'modern',
      stylePreset: 'modern',
      borderRadius: 'large',
      shadows: 'moderate',
    },
    hero: {
      type: 'split',
      overlay: 'none',
      alignment: 'left',
    },
    layout: {
      sections: ['products', 'openingHours', 'locations', 'stats', 'gallery', 'testimonials', 'cta'],
      servicesVariant: 'price-list',
      teamVariant: 'grid',
      testimonialsVariant: 'grid',
      galleryVariant: 'masonry',
      pricingVariant: 'cards-4',
    },
  },

  // VARIANTA 3 - Purple Premium
  {
    id: 'magazin-v3',
    name: 'Purple Premium',
    description: 'Design premium cu violet - luxos si sofisticat',
    theme: {
      preset: 'elegant',
      colors: {
        primary: '#7c3aed',
        secondary: '#6d28d9',
        accent: '#a78bfa',
        dark: '#4c1d95',
        light: '#f5f3ff',
        surface: '#ffffff',
        text: '#4c1d95',
        textLight: '#7c3aed',
        border: '#ede9fe',
      },
      headingFont: 'Playfair_Display',
      bodyFont: 'Lato',
      fontPreset: 'elegant',
      stylePreset: 'modern',
      borderRadius: 'medium',
      shadows: 'moderate',
    },
    hero: {
      type: 'centered',
      overlay: 'gradient',
      alignment: 'center',
    },
    layout: {
      sections: ['products', 'openingHours', 'stats', 'testimonials', 'faq', 'cta'],
      servicesVariant: 'grid-3',
      teamVariant: 'carousel',
      testimonialsVariant: 'carousel',
      galleryVariant: 'carousel',
      pricingVariant: 'table',
    },
  },

  // VARIANTA 4 - Blue Trust
  {
    id: 'magazin-v4',
    name: 'Blue Trust',
    description: 'Design de incredere cu albastru - profesional si sigur',
    theme: {
      preset: 'modern',
      colors: {
        primary: '#2563eb',
        secondary: '#1d4ed8',
        accent: '#3b82f6',
        dark: '#1e3a8a',
        light: '#eff6ff',
        surface: '#ffffff',
        text: '#1e3a8a',
        textLight: '#3b82f6',
        border: '#bfdbfe',
      },
      headingFont: 'Poppins',
      bodyFont: 'Inter',
      fontPreset: 'modern',
      stylePreset: 'modern',
      borderRadius: 'medium',
      shadows: 'subtle',
    },
    hero: {
      type: 'fullscreen',
      overlay: 'dark',
      alignment: 'center',
    },
    layout: {
      sections: ['stats', 'products', 'locations', 'testimonials', 'gallery', 'faq', 'cta'],
      servicesVariant: 'grid-3',
      teamVariant: 'grid',
      testimonialsVariant: 'carousel',
      galleryVariant: 'grid-4',
      pricingVariant: 'cards-3',
    },
  },

  // VARIANTA 5 - Minimal Black & White (CAROUSEL HERO)
  {
    id: 'magazin-v5',
    name: 'Minimal Black & White',
    description: 'Design minimalist alb-negru - clean si elegant, cu hero carousel',
    theme: {
      preset: 'minimal',
      colors: {
        primary: '#18181b',
        secondary: '#27272a',
        accent: '#3f3f46',
        dark: '#09090b',
        light: '#fafafa',
        surface: '#ffffff',
        text: '#18181b',
        textLight: '#52525b',
        border: '#e4e4e7',
      },
      headingFont: 'Work_Sans',
      bodyFont: 'Inter',
      fontPreset: 'minimalist',
      stylePreset: 'minimal',
      borderRadius: 'none',
      shadows: 'none',
    },
    hero: {
      type: 'slider',
      overlay: 'dark',
      alignment: 'left',
    },
    layout: {
      sections: ['products', 'openingHours', 'testimonials', 'cta'],
      servicesVariant: 'list',
      teamVariant: 'grid',
      testimonialsVariant: 'carousel',
      galleryVariant: 'grid-3',
      pricingVariant: 'list',
    },
  },
]

// =============================================================================
// FITNESS / SALA - 5 VARIANTE
// =============================================================================

export const fitnessVariants: DesignVariant[] = [
  // VARIANTA 1 - Orange Energy (Default - based on Template-2)
  {
    id: 'fitness-v1',
    name: 'Orange Energy',
    description: 'Design energic cu portocaliu - puternic si motivant',
    theme: {
      preset: 'bold',
      colors: {
        primary: '#f13a11',
        secondary: '#171819',
        accent: '#f97316',
        dark: '#171819',
        light: '#ffffff',
        surface: '#f9f9f9',
        text: '#171819',
        textLight: '#666262',
        border: '#e5e5e5',
      },
      headingFont: 'Montserrat',
      bodyFont: 'Work_Sans',
      fontPreset: 'bold',
      stylePreset: 'bold',
      borderRadius: 'small',
      shadows: 'subtle',
    },
    hero: {
      type: 'fullscreen',
      overlay: 'dark',
      alignment: 'center',
    },
    layout: {
      sections: ['stats', 'classesGrid', 'scheduleTable', 'subscriptionCards', 'team', 'gallery', 'testimonials', 'faq', 'cta'],
      servicesVariant: 'grid-3',
      teamVariant: 'grid',
      testimonialsVariant: 'carousel',
      galleryVariant: 'masonry',
      pricingVariant: 'cards-3',
    },
  },

  // VARIANTA 2 - Dark Premium
  {
    id: 'fitness-v2',
    name: 'Dark Premium',
    description: 'Design premium cu negru si auriu - luxos si exclusivist',
    theme: {
      preset: 'elegant',
      colors: {
        primary: '#d4af37',
        secondary: '#1a1a1a',
        accent: '#fbbf24',
        dark: '#0d0d0d',
        light: '#fafafa',
        surface: '#ffffff',
        text: '#1a1a1a',
        textLight: '#525252',
        border: '#e5e5e5',
      },
      headingFont: 'Playfair_Display',
      bodyFont: 'Lato',
      fontPreset: 'elegant',
      stylePreset: 'bold',
      borderRadius: 'none',
      shadows: 'moderate',
    },
    hero: {
      type: 'fullscreen',
      overlay: 'dark',
      alignment: 'center',
    },
    layout: {
      sections: ['classesGrid', 'stats', 'scheduleTable', 'subscriptionCards', 'gallery', 'team', 'testimonials', 'cta'],
      servicesVariant: 'grid-3',
      teamVariant: 'grid',
      testimonialsVariant: 'carousel',
      galleryVariant: 'carousel',
      pricingVariant: 'cards-3',
    },
  },

  // VARIANTA 3 - Green Wellness (VIDEO HERO)
  {
    id: 'fitness-v3',
    name: 'Green Wellness',
    description: 'Design wellness cu verde - sanatos si echilibrat, cu video hero',
    theme: {
      preset: 'modern',
      colors: {
        primary: '#22c55e',
        secondary: '#166534',
        accent: '#4ade80',
        dark: '#14532d',
        light: '#f0fdf4',
        surface: '#ffffff',
        text: '#14532d',
        textLight: '#166534',
        border: '#dcfce7',
      },
      headingFont: 'Poppins',
      bodyFont: 'Inter',
      fontPreset: 'modern',
      stylePreset: 'modern',
      borderRadius: 'large',
      shadows: 'subtle',
    },
    hero: {
      type: 'video',
      overlay: 'dark',
      alignment: 'center',
    },
    layout: {
      sections: ['classesGrid', 'scheduleTable', 'subscriptionCards', 'team', 'stats', 'testimonials', 'faq', 'cta'],
      servicesVariant: 'grid-3',
      teamVariant: 'grid',
      testimonialsVariant: 'grid',
      galleryVariant: 'grid-4',
      pricingVariant: 'cards-4',
    },
  },

  // VARIANTA 4 - Blue Athletic
  {
    id: 'fitness-v4',
    name: 'Blue Athletic',
    description: 'Design atletic cu albastru - profesional si performant',
    theme: {
      preset: 'modern',
      colors: {
        primary: '#2563eb',
        secondary: '#1e40af',
        accent: '#3b82f6',
        dark: '#1e3a8a',
        light: '#eff6ff',
        surface: '#ffffff',
        text: '#1e3a8a',
        textLight: '#3b82f6',
        border: '#bfdbfe',
      },
      headingFont: 'Poppins',
      bodyFont: 'Inter',
      fontPreset: 'modern',
      stylePreset: 'modern',
      borderRadius: 'medium',
      shadows: 'moderate',
    },
    hero: {
      type: 'centered',
      overlay: 'gradient',
      alignment: 'center',
    },
    layout: {
      sections: ['stats', 'classesGrid', 'team', 'scheduleTable', 'subscriptionCards', 'gallery', 'testimonials', 'faq', 'cta'],
      servicesVariant: 'price-list',
      teamVariant: 'carousel',
      testimonialsVariant: 'carousel',
      galleryVariant: 'masonry',
      pricingVariant: 'featured-center',
    },
  },

  // VARIANTA 5 - Red Power (CAROUSEL HERO)
  {
    id: 'fitness-v5',
    name: 'Red Power',
    description: 'Design puternic cu rosu - intens si motivant, cu hero carousel',
    theme: {
      preset: 'bold',
      colors: {
        primary: '#dc2626',
        secondary: '#1f2937',
        accent: '#ef4444',
        dark: '#111827',
        light: '#fef2f2',
        surface: '#ffffff',
        text: '#111827',
        textLight: '#6b7280',
        border: '#fecaca',
      },
      headingFont: 'Montserrat',
      bodyFont: 'Work_Sans',
      fontPreset: 'bold',
      stylePreset: 'bold',
      borderRadius: 'small',
      shadows: 'strong',
    },
    hero: {
      type: 'slider',
      overlay: 'dark',
      alignment: 'center',
    },
    layout: {
      sections: ['classesGrid', 'stats', 'subscriptionCards', 'scheduleTable', 'team', 'gallery', 'testimonials', 'cta'],
      servicesVariant: 'grid-3',
      teamVariant: 'carousel',
      testimonialsVariant: 'carousel',
      galleryVariant: 'grid-3',
      pricingVariant: 'cards-3',
    },
  },
]

// =============================================================================
// TERAPII ENERGETICE - 3 VARIANTE (Wellness & Healing)
// =============================================================================

export const terapiiEnergeticeVariants: DesignVariant[] = [
  // VARIANTA 1 - Gold & Navy (EXACT colors from terapiienergetice.ro)
  // Primary: #FFE468 = rgba(255, 228, 104) = hsl(49, 100, 70)
  // Secondary: #272630 = rgba(39, 38, 48) = hsl(246, 12, 17)
  {
    id: 'terapii-v1',
    name: 'Gold & Navy Healing',
    description: 'Design premium pentru terapii energetice - auriu și navy, calm și spiritual',
    theme: {
      preset: 'elegant',
      colors: {
        primary: '#FFE468',      // Gold EXACT - rgb(255, 228, 104)
        secondary: '#272630',    // Dark Navy EXACT - rgb(39, 38, 48)
        accent: '#FFE468',       // Gold accent (same as primary)
        dark: '#272630',         // Dark navy pentru fundal
        light: '#F2F2F2',        // Light gray exact - rgb(242, 242, 242)
        surface: '#ffffff',
        text: '#54595F',         // Text principal exact - rgb(84, 89, 95)
        textLight: '#666666',
        border: '#CCCCCC',       // Border gri - rgb(204, 204, 204)
        // Contrast colors
        textOnPrimary: '#272630',     // Dark navy on gold
        textOnSecondary: '#FFE468',   // Gold on navy
        textOnAccent: '#272630',      // Dark navy on gold
        textOnDark: '#ffffff',        // White on dark
        textOnLight: '#54595F',       // Text gri on light
        textOnSurface: '#54595F',     // Text gri on white
      },
      headingFont: 'Playfair_Display',  // Elegant serif
      bodyFont: 'Open_Sans',            // Friendly sans
      fontPreset: 'elegant',
      stylePreset: 'modern',
      borderRadius: 'medium',           // 8px like plasturi
      shadows: 'subtle',                // Minimal shadows like plasturi
      headingScale: 'large',
      bodyTextSize: 'large',
      cardGap: 'spacious',
      sectionSpacing: 'spacious',
      animations: 'moderate',
    },
    hero: {
      type: 'video',
      overlay: 'gradient',
      alignment: 'center',
    },
    layout: {
      sections: ['services', 'howItWorks', 'team', 'testimonials', 'videoTestimonials', 'stats', 'videoGallery', 'faq', 'contact', 'cta'],
      servicesVariant: 'grid-3',
      teamVariant: 'grid',
      testimonialsVariant: 'carousel',
      galleryVariant: 'grid-3',
      pricingVariant: 'featured-center',
    },
  },

  // VARIANTA 2 - Soft Purple Zen
  {
    id: 'terapii-v2',
    name: 'Soft Purple Zen',
    description: 'Design zen cu violet soft - spiritual și relaxant',
    theme: {
      preset: 'elegant',
      colors: {
        primary: '#9333EA',      // Purple 600
        secondary: '#7C3AED',    // Violet 600
        accent: '#C4B5FD',       // Violet 300
        dark: '#2E1065',         // Purple 950
        light: '#FAF5FF',        // Purple 50
        surface: '#ffffff',
        text: '#1F2937',
        textLight: '#6B7280',
        border: '#EDE9FE',       // Violet 100
        textOnPrimary: '#ffffff',
        textOnSecondary: '#ffffff',
        textOnAccent: '#2E1065',
        textOnDark: '#FAF5FF',
        textOnLight: '#1F2937',
        textOnSurface: '#1F2937',
      },
      headingFont: 'Lora',
      bodyFont: 'Lato',
      fontPreset: 'elegant',
      stylePreset: 'modern',
      borderRadius: 'large',
      shadows: 'subtle',
      headingScale: 'normal',
      bodyTextSize: 'normal',
      cardGap: 'spacious',
      sectionSpacing: 'spacious',
      animations: 'subtle',
    },
    hero: {
      type: 'fullscreen',
      overlay: 'gradient',
      alignment: 'center',
    },
    layout: {
      sections: ['services', 'howItWorks', 'team', 'stats', 'testimonials', 'videoTestimonials', 'videoGallery', 'faq', 'cta'],
      servicesVariant: 'grid-3',
      teamVariant: 'grid',
      testimonialsVariant: 'grid',
      galleryVariant: 'masonry',
      pricingVariant: 'cards-3',
    },
  },

  // VARIANTA 3 - Teal Harmony (VIDEO HERO)
  {
    id: 'terapii-v3',
    name: 'Teal Harmony',
    description: 'Design armonios cu teal - echilibrat și liniștitor, cu video hero',
    theme: {
      preset: 'modern',
      colors: {
        primary: '#0D9488',      // Teal 600
        secondary: '#14B8A6',    // Teal 500
        accent: '#5EEAD4',       // Teal 300
        dark: '#042F2E',         // Teal 950
        light: '#F0FDFA',        // Teal 50
        surface: '#ffffff',
        text: '#042F2E',
        textLight: '#0F766E',    // Teal 700
        border: '#CCFBF1',       // Teal 100
        textOnPrimary: '#ffffff',
        textOnSecondary: '#ffffff',
        textOnAccent: '#042F2E',
        textOnDark: '#F0FDFA',
        textOnLight: '#042F2E',
        textOnSurface: '#042F2E',
      },
      headingFont: 'Poppins',
      bodyFont: 'Inter',
      fontPreset: 'modern',
      stylePreset: 'modern',
      borderRadius: 'medium',
      shadows: 'moderate',
      headingScale: 'normal',
      bodyTextSize: 'normal',
      cardGap: 'normal',
      sectionSpacing: 'normal',
      animations: 'moderate',
    },
    hero: {
      type: 'video',
      overlay: 'dark',
      alignment: 'center',
    },
    layout: {
      sections: ['services', 'stats', 'team', 'howItWorks', 'testimonials', 'videoGallery', 'faq', 'contact', 'cta'],
      servicesVariant: 'list',
      teamVariant: 'grid',
      testimonialsVariant: 'carousel',
      galleryVariant: 'grid-4',
      pricingVariant: 'cards-4',
    },
  },
]

// =============================================================================
// AGENCY / MULTIWEB - 5 VARIANTE (Modern web agency)
// =============================================================================

export const multiwebVariants: DesignVariant[] = [
  // VARIANTA 1 - Indigo Modern (Default)
  {
    id: 'multiweb-v1',
    name: 'Indigo Modern',
    description: 'Design modern cu indigo/violet - profesional și tech-forward',
    theme: {
      preset: 'modern',
      colors: {
        primary: '#6366F1',      // Indigo 500
        secondary: '#818CF8',    // Indigo 400
        accent: '#A5B4FC',       // Indigo 300
        dark: '#0F172A',         // Slate 900
        light: '#F8FAFC',        // Slate 50
        surface: '#FFFFFF',
        text: '#0F172A',
        textLight: '#64748B',    // Slate 500
        border: '#E2E8F0',       // Slate 200
        textOnPrimary: '#FFFFFF',
        textOnSecondary: '#FFFFFF',
        textOnAccent: '#0F172A',
        textOnDark: '#F8FAFC',
        textOnLight: '#0F172A',
        textOnSurface: '#0F172A',
      },
      headingFont: 'Space_Grotesk',
      bodyFont: 'Inter',
      fontPreset: 'modern',
      stylePreset: 'modern',
      borderRadius: 'large',
      shadows: 'moderate',
      headingScale: 'large',
      bodyTextSize: 'normal',
      cardGap: 'spacious',
      sectionSpacing: 'spacious',
      animations: 'dynamic',
    },
    hero: {
      type: 'fullscreen',
      overlay: 'gradient',
      alignment: 'center',
    },
    layout: {
      sections: ['stats', 'portfolio', 'services', 'howItWorks', 'testimonials', 'faq', 'latestPosts', 'cta'],
      servicesVariant: 'grid-3',
      teamVariant: 'grid',
      testimonialsVariant: 'carousel',
      galleryVariant: 'grid-3',
      pricingVariant: 'cards-3',
    },
  },

  // VARIANTA 2 - Emerald Fresh
  {
    id: 'multiweb-v2',
    name: 'Emerald Fresh',
    description: 'Design proaspăt cu verde smarald - eco și modern',
    theme: {
      preset: 'modern',
      colors: {
        primary: '#059669',      // Emerald 600
        secondary: '#10B981',    // Emerald 500
        accent: '#6EE7B7',       // Emerald 300
        dark: '#022C22',         // Emerald 950
        light: '#ECFDF5',        // Emerald 50
        surface: '#FFFFFF',
        text: '#022C22',
        textLight: '#047857',    // Emerald 700
        border: '#D1FAE5',       // Emerald 100
        textOnPrimary: '#FFFFFF',
        textOnSecondary: '#FFFFFF',
        textOnAccent: '#022C22',
        textOnDark: '#ECFDF5',
        textOnLight: '#022C22',
        textOnSurface: '#022C22',
      },
      headingFont: 'Sora',
      bodyFont: 'DM_Sans',
      fontPreset: 'modern',
      stylePreset: 'modern',
      borderRadius: 'medium',
      shadows: 'subtle',
      headingScale: 'normal',
      bodyTextSize: 'normal',
      cardGap: 'normal',
      sectionSpacing: 'normal',
      animations: 'moderate',
    },
    hero: {
      type: 'split',
      overlay: 'light',
      alignment: 'left',
    },
    layout: {
      sections: ['stats', 'portfolio', 'services', 'howItWorks', 'testimonials', 'faq', 'latestPosts', 'cta'],
      servicesVariant: 'grid-3',
      teamVariant: 'grid',
      testimonialsVariant: 'carousel',
      galleryVariant: 'masonry',
      pricingVariant: 'cards-3',
    },
  },

  // VARIANTA 3 - Rose Elegant
  {
    id: 'multiweb-v3',
    name: 'Rose Elegant',
    description: 'Design elegant cu rose/pink - sofisticat și creativ',
    theme: {
      preset: 'elegant',
      colors: {
        primary: '#DB2777',      // Pink 600
        secondary: '#EC4899',    // Pink 500
        accent: '#F9A8D4',       // Pink 300
        dark: '#500724',         // Pink 950
        light: '#FDF2F8',        // Pink 50
        surface: '#FFFFFF',
        text: '#1F2937',         // Gray 800
        textLight: '#6B7280',    // Gray 500
        border: '#FCE7F3',       // Pink 100
        textOnPrimary: '#FFFFFF',
        textOnSecondary: '#FFFFFF',
        textOnAccent: '#500724',
        textOnDark: '#FDF2F8',
        textOnLight: '#1F2937',
        textOnSurface: '#1F2937',
      },
      headingFont: 'Outfit',
      bodyFont: 'Plus_Jakarta_Sans',
      fontPreset: 'elegant',
      stylePreset: 'modern',
      borderRadius: 'large',
      shadows: 'moderate',
      headingScale: 'large',
      bodyTextSize: 'large',
      cardGap: 'spacious',
      sectionSpacing: 'spacious',
      animations: 'dynamic',
    },
    hero: {
      type: 'centered',
      overlay: 'gradient',
      alignment: 'center',
    },
    layout: {
      sections: ['stats', 'portfolio', 'services', 'howItWorks', 'testimonials', 'faq', 'latestPosts', 'cta'],
      servicesVariant: 'grid-3',
      teamVariant: 'carousel',
      testimonialsVariant: 'carousel',
      galleryVariant: 'carousel',
      pricingVariant: 'featured-center',
    },
  },

  // VARIANTA 4 - Dark Premium
  {
    id: 'multiweb-v4',
    name: 'Dark Premium',
    description: 'Design dark premium cu accente luminoase - bold și impactant',
    theme: {
      preset: 'bold',
      colors: {
        primary: '#F59E0B',      // Amber 500
        secondary: '#FBBF24',    // Amber 400
        accent: '#FCD34D',       // Amber 300
        dark: '#0A0A0A',         // Near black
        light: '#1F1F1F',        // Dark gray
        surface: '#171717',      // Neutral 900
        text: '#FAFAFA',         // Light
        textLight: '#A3A3A3',    // Neutral 400
        border: '#262626',       // Neutral 800
        textOnPrimary: '#0A0A0A',
        textOnSecondary: '#0A0A0A',
        textOnAccent: '#0A0A0A',
        textOnDark: '#FAFAFA',
        textOnLight: '#FAFAFA',
        textOnSurface: '#FAFAFA',
      },
      headingFont: 'Manrope',
      bodyFont: 'Inter',
      fontPreset: 'bold',
      stylePreset: 'bold',
      borderRadius: 'medium',
      shadows: 'strong',
      headingScale: 'xlarge',
      bodyTextSize: 'large',
      cardGap: 'spacious',
      sectionSpacing: 'spacious',
      animations: 'dynamic',
    },
    hero: {
      type: 'fullscreen',
      overlay: 'dark',
      alignment: 'center',
    },
    layout: {
      sections: ['stats', 'portfolio', 'services', 'howItWorks', 'testimonials', 'faq', 'latestPosts', 'cta'],
      servicesVariant: 'grid-3',
      teamVariant: 'grid',
      testimonialsVariant: 'carousel',
      galleryVariant: 'grid-4',
      pricingVariant: 'cards-3',
    },
  },

  // VARIANTA 5 - Blue Corporate
  {
    id: 'multiweb-v5',
    name: 'Blue Corporate',
    description: 'Design corporate cu albastru - profesional și de încredere',
    theme: {
      preset: 'classic',
      colors: {
        primary: '#2563EB',      // Blue 600
        secondary: '#3B82F6',    // Blue 500
        accent: '#93C5FD',       // Blue 300
        dark: '#1E293B',         // Slate 800
        light: '#F1F5F9',        // Slate 100
        surface: '#FFFFFF',
        text: '#1E293B',
        textLight: '#64748B',    // Slate 500
        border: '#CBD5E1',       // Slate 300
        textOnPrimary: '#FFFFFF',
        textOnSecondary: '#FFFFFF',
        textOnAccent: '#1E293B',
        textOnDark: '#F1F5F9',
        textOnLight: '#1E293B',
        textOnSurface: '#1E293B',
      },
      headingFont: 'Raleway',
      bodyFont: 'Open_Sans',
      fontPreset: 'classic',
      stylePreset: 'classic',
      borderRadius: 'small',
      shadows: 'subtle',
      headingScale: 'normal',
      bodyTextSize: 'normal',
      cardGap: 'normal',
      sectionSpacing: 'normal',
      animations: 'subtle',
    },
    hero: {
      type: 'split',
      overlay: 'light',
      alignment: 'left',
    },
    layout: {
      sections: ['stats', 'portfolio', 'services', 'howItWorks', 'testimonials', 'faq', 'latestPosts', 'cta'],
      servicesVariant: 'list',
      teamVariant: 'carousel',
      testimonialsVariant: 'grid',
      galleryVariant: 'grid-3',
      pricingVariant: 'table',
    },
  },
]

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export type BusinessType =
  | 'barbershop'
  | 'dentist'
  | 'restaurant'
  | 'salon'
  | 'auto-service'
  | 'avocat'
  | 'constructii'
  | 'magazin'
  | 'fitness'
  | 'multiweb'
  | 'terapii-energetice'

export function getVariant(businessType: BusinessType, variantIndex: number = 0): DesignVariant {
  const variants = {
    barbershop: barbershopVariants,
    dentist: dentistVariants,
    restaurant: restaurantVariants,
    salon: salonVariants,
    'auto-service': autoServiceVariants,
    avocat: avocatVariants,
    constructii: constructiiVariants,
    magazin: magazinVariants,
    fitness: fitnessVariants,
    multiweb: multiwebVariants,
    'terapii-energetice': terapiiEnergeticeVariants,
  }

  const businessVariants = variants[businessType]
  const index = Math.max(0, Math.min(variantIndex, businessVariants.length - 1))
  return businessVariants[index]
}

export function getAllVariants(businessType: BusinessType): DesignVariant[] {
  const variants = {
    barbershop: barbershopVariants,
    dentist: dentistVariants,
    restaurant: restaurantVariants,
    salon: salonVariants,
    'auto-service': autoServiceVariants,
    avocat: avocatVariants,
    constructii: constructiiVariants,
    magazin: magazinVariants,
    fitness: fitnessVariants,
    multiweb: multiwebVariants,
    'terapii-energetice': terapiiEnergeticeVariants,
  }
  return variants[businessType]
}

export function getVariantById(variantId: string): DesignVariant | undefined {
  const allVariants = [
    ...barbershopVariants,
    ...dentistVariants,
    ...restaurantVariants,
    ...salonVariants,
    ...autoServiceVariants,
    ...avocatVariants,
    ...constructiiVariants,
    ...magazinVariants,
    ...fitnessVariants,
    ...multiwebVariants,
    ...terapiiEnergeticeVariants,
  ]
  return allVariants.find((v) => v.id === variantId)
}

/**
 * Convert variant overlay setting to hero overlay configuration
 * Maps design variant overlay values to actual hero overlay settings
 */
export function getHeroOverlaySettings(variant: DesignVariant): {
  overlayEnabled: boolean
  overlayOpacity: string
  overlayStyle: 'gradient' | 'dark' | 'primary' | 'secondary' | 'radial'
} {
  switch (variant.hero.overlay) {
    case 'dark':
      return { overlayEnabled: true, overlayOpacity: '70', overlayStyle: 'dark' }
    case 'gradient':
      return { overlayEnabled: true, overlayOpacity: '60', overlayStyle: 'gradient' }
    case 'light':
      // Light overlay needs enough opacity for text contrast (min 50%)
      return { overlayEnabled: true, overlayOpacity: '50', overlayStyle: 'gradient' }
    case 'none':
    default:
      // Use minimum valid value (30) but with overlay disabled
      return { overlayEnabled: false, overlayOpacity: '30', overlayStyle: 'gradient' }
  }
}
