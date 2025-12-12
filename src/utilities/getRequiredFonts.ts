/**
 * Get the required fonts for the current theme
 * Now fonts are configured via .env (NEXT_PUBLIC_HEADING_FONT, NEXT_PUBLIC_BODY_FONT)
 * and loaded via next/font at build time (self-hosted, no external requests)
 *
 * This file is kept for backwards compatibility but fonts are no longer
 * loaded dynamically from Google Fonts.
 */
export function getRequiredFonts(): {
  heading: string
  body: string
} {
  return {
    heading: process.env.NEXT_PUBLIC_HEADING_FONT || 'Playfair Display',
    body: process.env.NEXT_PUBLIC_BODY_FONT || 'Inter',
  }
}

/**
 * Build Google Fonts URL with only the required fonts
 * This dramatically reduces the blocking time from 840ms to ~200ms
 */
export function buildGoogleFontsUrl(fonts: { heading: string; body: string }): string {
  const weights = '400;500;600;700'

  // Normalize font names for URL (replace spaces with +)
  const headingParam = `${fonts.heading.replace(/ /g, '+')}:wght@${weights}`
  const bodyParam =
    fonts.body === fonts.heading ? null : `${fonts.body.replace(/ /g, '+')}:wght@${weights}`

  const families = [headingParam, bodyParam].filter(Boolean).join('&family=')

  return `https://fonts.googleapis.com/css2?family=${families}&display=swap`
}

/**
 * All available fonts that can be selected in admin
 * This is used for the noscript fallback which loads all fonts
 */
export const ALL_GOOGLE_FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Cormorant+Garamond:wght@400;500;600;700&family=Crimson+Text:wght@400;600;700&family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&family=Inter:wght@400;500;600;700&family=Lato:wght@400;700&family=Libre+Baskerville:wght@400;700&family=Lora:wght@400;500;600;700&family=Merriweather:wght@400;700&family=Montserrat:wght@400;500;600;700&family=Nunito:wght@400;500;600;700&family=Nunito+Sans:wght@400;500;600;700&family=Open+Sans:wght@400;500;600;700&family=Oswald:wght@400;500;600;700&family=Outfit:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&family=Raleway:wght@400;500;600;700&family=Roboto:wght@400;500;700&family=Source+Sans+3:wght@400;500;600;700&family=Source+Serif+4:wght@400;500;600;700&family=Work+Sans:wght@400;500;600;700&display=swap'
