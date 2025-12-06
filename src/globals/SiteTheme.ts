import type { GlobalConfig } from 'payload'
import { authenticated } from '@/access'
import { revalidateGlobal } from '@/hooks/revalidateGlobal'

/**
 * SiteTheme - Sistem unificat de teme pentru site
 *
 * Variantele sunt UNIVERSALE - functioneaza identic pentru orice tip de afacere!
 * Tipul de afacere determina doar continutul si blocurile, NU stilul.
 *
 * 10 Variante de Design (aplicabile oricarui business):
 * 1. Dark & Gold (Elegant)
 * 2. Modern Red (Bold)
 * 3. Classic Blue (Professional)
 * 4. Fresh Green (Natural)
 * 5. Minimal Black (Clean)
 * 6. Purple Premium (Luxury)
 * 7. Warm Orange (Friendly)
 * 8. Teal Modern (Fresh)
 * 9. Brown Vintage (Classic)
 * 10. Pink Soft (Feminine)
 */
export const SiteTheme: GlobalConfig = {
  slug: 'site-theme',
  label: 'Tema Site',
  admin: {
    description:
      'Schimba instantaneu aspectul complet al site-ului. Variantele functioneaza pentru orice tip de afacere.',
    group: 'Design',
  },
  access: {
    read: () => true,
    update: authenticated,
  },
  hooks: {
    afterChange: [revalidateGlobal],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // =========================================================================
        // TAB 1: VARIANTA DESIGN (UNIVERSAL)
        // =========================================================================
        {
          label: 'Varianta Design',
          description: 'Selecteaza varianta de design - functioneaza pentru orice tip de afacere',
          fields: [
            {
              name: 'variant',
              type: 'select',
              label: 'Stil Design',
              required: true,
              defaultValue: 'dark-gold',
              admin: {
                description:
                  'Varianta selectata schimba culorile, fonturile si stilul intregului site',
              },
              options: [
                {
                  label: '1. Dark & Gold - Elegant, premium, masculin',
                  value: 'dark-gold',
                },
                {
                  label: '2. Modern Red - Bold, energic, puternic',
                  value: 'modern-red',
                },
                {
                  label: '3. Classic Blue - Profesional, de incredere',
                  value: 'classic-blue',
                },
                {
                  label: '4. Fresh Green - Natural, eco, sanatos',
                  value: 'fresh-green',
                },
                {
                  label: '5. Minimal Black - Clean, modern, minimalist',
                  value: 'minimal-black',
                },
                {
                  label: '6. Purple Premium - Luxos, sofisticat, premium',
                  value: 'purple-premium',
                },
                {
                  label: '7. Warm Orange - Prietenos, cald, primitor',
                  value: 'warm-orange',
                },
                {
                  label: '8. Teal Modern - Fresh, cool, inovator',
                  value: 'teal-modern',
                },
                {
                  label: '9. Brown Vintage - Clasic, traditional, autentic',
                  value: 'brown-vintage',
                },
                {
                  label: '10. Pink Soft - Feminin, delicat, romantic',
                  value: 'pink-soft',
                },
                {
                  label: '11. Fitness Orange - Energic, sport, dinamic',
                  value: 'fitness-orange',
                },
                {
                  label: '12. Fitness Dark - Dark cu accent rosu, stil gym modern',
                  value: 'fitness-dark',
                },
              ],
            },
            {
              name: 'variantPreview',
              type: 'ui',
              admin: {
                components: {
                  Field: '@/components/admin/VariantPreviewField',
                },
              },
            },
          ],
        },

        // =========================================================================
        // TAB 2: LAYOUT & STIL
        // =========================================================================
        {
          label: 'Layout & Stil',
          description: 'Ajustari de layout si stil - optional',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'borderRadius',
                  type: 'select',
                  label: 'Raze colturi',
                  admin: {
                    width: '33%',
                    description: 'Lasa gol pentru default din varianta',
                  },
                  options: [
                    { label: 'Patrat (0)', value: 'none' },
                    { label: 'Subtil (4px)', value: 'small' },
                    { label: 'Mediu (8px)', value: 'medium' },
                    { label: 'Mare (16px)', value: 'large' },
                    { label: 'Rotunjit (50px)', value: 'full' },
                  ],
                },
                {
                  name: 'shadows',
                  type: 'select',
                  label: 'Umbre',
                  admin: {
                    width: '33%',
                    description: 'Lasa gol pentru default din varianta',
                  },
                  options: [
                    { label: 'Fara umbre', value: 'none' },
                    { label: 'Subtile', value: 'subtle' },
                    { label: 'Moderate', value: 'moderate' },
                    { label: 'Puternice', value: 'strong' },
                  ],
                },
                {
                  name: 'animations',
                  type: 'select',
                  label: 'Animatii',
                  admin: {
                    width: '33%',
                    description: 'Lasa gol pentru default din varianta',
                  },
                  options: [
                    { label: 'Fara animatii', value: 'none' },
                    { label: 'Subtile', value: 'subtle' },
                    { label: 'Moderate', value: 'moderate' },
                    { label: 'Dinamice', value: 'dynamic' },
                  ],
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'containerWidth',
                  type: 'select',
                  label: 'Latime container',
                  admin: {
                    width: '50%',
                  },
                  options: [
                    { label: '1024px (Compact)', value: '1024' },
                    { label: '1280px (Standard)', value: '1280' },
                    { label: '1400px (Wide)', value: '1400' },
                    { label: '1600px (Extra Wide)', value: '1600' },
                  ],
                },
                {
                  name: 'sectionSpacing',
                  type: 'select',
                  label: 'Spatiere sectiuni',
                  admin: {
                    width: '50%',
                  },
                  options: [
                    { label: 'Compact', value: 'compact' },
                    { label: 'Normal', value: 'normal' },
                    { label: 'Spatios', value: 'spacious' },
                  ],
                },
              ],
            },
          ],
        },

        // =========================================================================
        // TAB 3: OVERRIDE CULORI (OPTIONAL)
        // =========================================================================
        {
          label: 'Culori Personalizate',
          description: 'Suprascrie culorile din varianta selectata (optional)',
          fields: [
            {
              name: 'useCustomColors',
              type: 'checkbox',
              label: 'Foloseste culori personalizate',
              defaultValue: false,
              admin: {
                description:
                  'Bifat = culorile de mai jos suprascriu varianta. Nebifat = culorile din varianta.',
              },
            },
            {
              name: 'colors',
              type: 'group',
              admin: {
                condition: (_, siblingData) => siblingData?.useCustomColors,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'primary',
                      type: 'text',
                      label: 'Culoare primara',
                      defaultValue: '#000000',
                      admin: { width: '33%' },
                    },
                    {
                      name: 'secondary',
                      type: 'text',
                      label: 'Culoare secundara',
                      defaultValue: '#666666',
                      admin: { width: '33%' },
                    },
                    {
                      name: 'accent',
                      type: 'text',
                      label: 'Culoare accent',
                      defaultValue: '#c9a962',
                      admin: { width: '33%' },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'dark',
                      type: 'text',
                      label: 'Culoare inchisa',
                      defaultValue: '#1a1a1a',
                      admin: { width: '33%' },
                    },
                    {
                      name: 'light',
                      type: 'text',
                      label: 'Culoare deschisa',
                      defaultValue: '#f5f5f5',
                      admin: { width: '33%' },
                    },
                    {
                      name: 'surface',
                      type: 'text',
                      label: 'Background suprafata',
                      defaultValue: '#ffffff',
                      admin: { width: '33%' },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'text',
                      type: 'text',
                      label: 'Culoare text',
                      defaultValue: '#1a1a1a',
                      admin: { width: '33%' },
                    },
                    {
                      name: 'textLight',
                      type: 'text',
                      label: 'Text secundar',
                      defaultValue: '#666666',
                      admin: { width: '33%' },
                    },
                    {
                      name: 'border',
                      type: 'text',
                      label: 'Culoare borduri',
                      defaultValue: '#e5e5e5',
                      admin: { width: '33%' },
                    },
                  ],
                },
              ],
            },
          ],
        },

        // =========================================================================
        // TAB 4: FONTURI (OPTIONAL)
        // =========================================================================
        {
          label: 'Fonturi',
          description: 'Suprascrie fonturile din varianta selectata (optional)',
          fields: [
            {
              name: 'useCustomFonts',
              type: 'checkbox',
              label: 'Foloseste fonturi personalizate',
              defaultValue: false,
            },
            {
              name: 'fonts',
              type: 'group',
              admin: {
                condition: (_, siblingData) => siblingData?.useCustomFonts,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'headingFont',
                      type: 'select',
                      label: 'Font titluri',
                      defaultValue: 'Inter',
                      options: [
                        // Sans-serif moderne
                        { label: 'Inter (Modern)', value: 'Inter' },
                        { label: 'Montserrat (Elegant)', value: 'Montserrat' },
                        { label: 'Poppins (Geometric)', value: 'Poppins' },
                        { label: 'Roboto (Clean)', value: 'Roboto' },
                        { label: 'Oswald (Bold)', value: 'Oswald' },
                        { label: 'Raleway (Light)', value: 'Raleway' },
                        { label: 'Nunito (Rounded)', value: 'Nunito' },
                        { label: 'Work Sans (Professional)', value: 'Work Sans' },
                        // Serif elegante
                        { label: 'Playfair Display (Luxury)', value: 'Playfair Display' },
                        { label: 'Lora (Classic)', value: 'Lora' },
                        { label: 'Merriweather (Readable)', value: 'Merriweather' },
                        { label: 'Cormorant Garamond (Elegant)', value: 'Cormorant Garamond' },
                        { label: 'Libre Baskerville (Traditional)', value: 'Libre Baskerville' },
                        // Display
                        { label: 'DM Serif Display (Bold)', value: 'DM Serif Display' },
                        { label: 'Abril Fatface (Statement)', value: 'Abril Fatface' },
                      ],
                      admin: { width: '50%' },
                    },
                    {
                      name: 'bodyFont',
                      type: 'select',
                      label: 'Font text',
                      defaultValue: 'Inter',
                      options: [
                        // Sans-serif pentru citire
                        { label: 'Inter (Modern)', value: 'Inter' },
                        { label: 'Open Sans (Clear)', value: 'Open Sans' },
                        { label: 'Roboto (Versatile)', value: 'Roboto' },
                        { label: 'Lato (Warm)', value: 'Lato' },
                        { label: 'Source Sans 3 (Professional)', value: 'Source Sans 3' },
                        { label: 'Poppins (Geometric)', value: 'Poppins' },
                        { label: 'Nunito Sans (Friendly)', value: 'Nunito Sans' },
                        { label: 'Work Sans (Clean)', value: 'Work Sans' },
                        { label: 'DM Sans (Modern)', value: 'DM Sans' },
                        { label: 'Outfit (Contemporary)', value: 'Outfit' },
                        // Serif pentru citire
                        { label: 'Lora (Elegant)', value: 'Lora' },
                        { label: 'Merriweather (Comfortable)', value: 'Merriweather' },
                        { label: 'Source Serif 4 (Editorial)', value: 'Source Serif 4' },
                        { label: 'Crimson Text (Classic)', value: 'Crimson Text' },
                      ],
                      admin: { width: '50%' },
                    },
                  ],
                },
              ],
            },
          ],
        },

        // =========================================================================
        // TAB 5: TIPOGRAFIE AVANSATA (OPTIONAL)
        // =========================================================================
        {
          label: 'Tipografie Avansata',
          description: 'Configurari detaliate pentru tipografie (optional)',
          fields: [
            {
              name: 'useAdvancedTypography',
              type: 'checkbox',
              label: 'Activeaza setari avansate',
              defaultValue: false,
              admin: {
                description: 'Permite controlul fin asupra letter-spacing si line-height',
              },
            },
            {
              type: 'row',
              admin: { condition: (_, siblingData) => siblingData?.useAdvancedTypography },
              fields: [
                {
                  name: 'letterSpacing',
                  type: 'select',
                  label: 'Letter Spacing',
                  admin: { width: '33%' },
                  options: [
                    { label: 'Tight (-0.5px)', value: 'tight' },
                    { label: 'Normal (0)', value: 'normal' },
                    { label: 'Wide (0.5px)', value: 'wide' },
                    { label: 'Wider (1px)', value: 'wider' },
                  ],
                  defaultValue: 'normal',
                },
                {
                  name: 'headingLineHeight',
                  type: 'select',
                  label: 'Line Height Titluri',
                  admin: { width: '33%' },
                  options: [
                    { label: '1.1 (Compact)', value: '1.1' },
                    { label: '1.2 (Normal)', value: '1.2' },
                    { label: '1.3 (Spatios)', value: '1.3' },
                  ],
                  defaultValue: '1.2',
                },
                {
                  name: 'bodyLineHeight',
                  type: 'select',
                  label: 'Line Height Text',
                  admin: { width: '33%' },
                  options: [
                    { label: '1.5 (Compact)', value: '1.5' },
                    { label: '1.6 (Normal)', value: '1.6' },
                    { label: '1.8 (Spatios)', value: '1.8' },
                  ],
                  defaultValue: '1.6',
                },
              ],
            },
          ],
        },

        // =========================================================================
        // TAB 6: STIL BUTOANE (OPTIONAL)
        // =========================================================================
        {
          label: 'Stil Butoane',
          description: 'Personalizare aspect butoane (optional)',
          fields: [
            {
              name: 'useCustomButtons',
              type: 'checkbox',
              label: 'Activeaza setari butoane',
              defaultValue: false,
              admin: {
                description: 'Permite controlul fin asupra aspectului butoanelor',
              },
            },
            {
              type: 'row',
              admin: { condition: (_, siblingData) => siblingData?.useCustomButtons },
              fields: [
                {
                  name: 'buttonPadding',
                  type: 'select',
                  label: 'Padding Buton',
                  admin: { width: '33%' },
                  options: [
                    { label: 'Compact (8px 16px)', value: 'compact' },
                    { label: 'Normal (12px 24px)', value: 'normal' },
                    { label: 'Large (16px 32px)', value: 'large' },
                    { label: 'XL (24px 40px)', value: 'xl' },
                  ],
                  defaultValue: 'normal',
                },
                {
                  name: 'buttonTextTransform',
                  type: 'select',
                  label: 'Text Transform',
                  admin: { width: '33%' },
                  options: [
                    { label: 'None', value: 'none' },
                    { label: 'Uppercase', value: 'uppercase' },
                    { label: 'Capitalize', value: 'capitalize' },
                  ],
                  defaultValue: 'none',
                },
                {
                  name: 'buttonFontWeight',
                  type: 'select',
                  label: 'Font Weight',
                  admin: { width: '33%' },
                  options: [
                    { label: 'Normal (400)', value: '400' },
                    { label: 'Medium (500)', value: '500' },
                    { label: 'Semibold (600)', value: '600' },
                    { label: 'Bold (700)', value: '700' },
                  ],
                  defaultValue: '600',
                },
              ],
            },
            {
              type: 'row',
              admin: { condition: (_, siblingData) => siblingData?.useCustomButtons },
              fields: [
                {
                  name: 'buttonLetterSpacing',
                  type: 'select',
                  label: 'Letter Spacing Butoane',
                  admin: { width: '50%' },
                  options: [
                    { label: 'Normal (0)', value: 'normal' },
                    { label: 'Wide (0.5px)', value: 'wide' },
                    { label: 'Wider (1px)', value: 'wider' },
                    { label: 'Extra Wide (2px)', value: 'extra-wide' },
                  ],
                  defaultValue: 'normal',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
