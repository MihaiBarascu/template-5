/**
 * Font configuration using next/font/google
 * Fonts are self-hosted at build time (no external requests)
 *
 * Configure fonts via environment variables:
 * NEXT_PUBLIC_HEADING_FONT=Playfair_Display
 * NEXT_PUBLIC_BODY_FONT=Inter
 */
import {
  Inter,
  Playfair_Display,
  Montserrat,
  Open_Sans,
  Poppins,
  Lato,
  Lora,
  Source_Sans_3,
  Work_Sans,
  // Modern fonts for agency/tech sites
  Space_Grotesk,
  Sora,
  Outfit,
  Plus_Jakarta_Sans,
  Manrope,
  DM_Sans,
  DM_Serif_Display,
  Raleway,
  // Clean/flat design fonts
  Prompt,
} from 'next/font/google'

// Initialize all available fonts with display: swap
const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
})

const playfairDisplay = Playfair_Display({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-playfair-display',
  weight: ['400', '500', '600', '700'],
})

const montserrat = Montserrat({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-montserrat',
  weight: ['400', '500', '600', '700'],
})

const openSans = Open_Sans({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-open-sans',
  weight: ['400', '500', '600', '700'],
})

const poppins = Poppins({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700'],
})

const lato = Lato({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-lato',
  weight: ['400', '700'],
})

const lora = Lora({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-lora',
  weight: ['400', '500', '600', '700'],
})

const sourceSans3 = Source_Sans_3({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-source-sans',
  weight: ['400', '500', '600', '700'],
})

const workSans = Work_Sans({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-work-sans',
  weight: ['400', '500', '600', '700'],
})

// Modern agency/tech fonts
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-space-grotesk',
  weight: ['400', '500', '600', '700'],
})

const sora = Sora({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-sora',
  weight: ['400', '500', '600', '700'],
})

const outfit = Outfit({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-outfit',
  weight: ['400', '500', '600', '700'],
})

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-plus-jakarta-sans',
  weight: ['400', '500', '600', '700'],
})

const manrope = Manrope({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-manrope',
  weight: ['400', '500', '600', '700'],
})

const dmSans = DM_Sans({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-dm-sans',
  weight: ['400', '500', '600', '700'],
})

const dmSerifDisplay = DM_Serif_Display({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-dm-serif-display',
  weight: ['400'],
})

const raleway = Raleway({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-raleway',
  weight: ['400', '500', '600', '700'],
})

// Clean/flat design fonts
const prompt = Prompt({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-prompt',
  weight: ['300', '400', '500', '600', '700'],
})

// Map font names to font objects
export const FONTS = {
  'Inter': inter,
  'Playfair Display': playfairDisplay,
  'Playfair_Display': playfairDisplay,
  'Montserrat': montserrat,
  'Open Sans': openSans,
  'Open_Sans': openSans,
  'Poppins': poppins,
  'Lato': lato,
  'Lora': lora,
  'Source Sans Pro': sourceSans3, // Source Sans 3 is the successor
  'Source_Sans_3': sourceSans3,
  'Work Sans': workSans,
  'Work_Sans': workSans,
  // Modern fonts for agency/tech
  'Space Grotesk': spaceGrotesk,
  'Space_Grotesk': spaceGrotesk,
  'Sora': sora,
  'Outfit': outfit,
  'Plus Jakarta Sans': plusJakartaSans,
  'Plus_Jakarta_Sans': plusJakartaSans,
  'Manrope': manrope,
  'DM Sans': dmSans,
  'DM_Sans': dmSans,
  'DM Serif Display': dmSerifDisplay,
  'DM_Serif_Display': dmSerifDisplay,
  'Raleway': raleway,
  // Clean/flat design fonts
  'Prompt': prompt,
} as const

export type FontName = keyof typeof FONTS

// Get font from environment variable or fallback
export function getEnvFont(envVar: string, fallback: FontName): typeof FONTS[FontName] {
  const fontName = process.env[envVar] as FontName | undefined
  if (fontName && FONTS[fontName]) {
    return FONTS[fontName]
  }
  return FONTS[fallback]
}

// Get configured fonts from .env
export function getConfiguredFonts() {
  const headingFont = getEnvFont('NEXT_PUBLIC_HEADING_FONT', 'Playfair Display')
  const bodyFont = getEnvFont('NEXT_PUBLIC_BODY_FONT', 'Inter')

  return {
    heading: headingFont,
    body: bodyFont,
  }
}

// Get all CSS variables for fonts (to add to body className)
export function getFontVariables(): string {
  const fonts = getConfiguredFonts()
  return `${fonts.heading.variable} ${fonts.body.variable}`
}

// Get ALL font variables (needed for admin font switching to work)
// All fonts must be loaded so any combination can be selected from admin
export function getAllFontVariables(): string {
  return [
    inter.variable,
    playfairDisplay.variable,
    montserrat.variable,
    openSans.variable,
    poppins.variable,
    lato.variable,
    lora.variable,
    sourceSans3.variable,
    workSans.variable,
    // Modern agency/tech fonts
    spaceGrotesk.variable,
    sora.variable,
    outfit.variable,
    plusJakartaSans.variable,
    manrope.variable,
    dmSans.variable,
    dmSerifDisplay.variable,
    raleway.variable,
    // Clean/flat design fonts
    prompt.variable,
  ].join(' ')
}

// Export individual fonts for direct use
export {
  inter,
  playfairDisplay,
  montserrat,
  openSans,
  poppins,
  lato,
  lora,
  sourceSans3,
  workSans,
  // Modern agency/tech fonts
  spaceGrotesk,
  sora,
  outfit,
  plusJakartaSans,
  manrope,
  dmSans,
  dmSerifDisplay,
  raleway,
  // Clean/flat design fonts
  prompt,
}
