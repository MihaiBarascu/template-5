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
                {
                  label: '13. Gold Navy Healing - Calm, premium, spiritual',
                  value: 'gold-navy-healing',
                },
                {
                  label: '14. Revital Harmony - Gold/Navy exact de pe terapiienergetice.ro',
                  value: 'revital-harmony',
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
            {
              name: 'livePreview',
              type: 'ui',
              admin: {
                components: {
                  Field: '@/components/admin/ThemeLivePreview',
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
                    { label: 'Fără rotunjire', value: 'none' },
                    { label: 'Subtil', value: 'small' },
                    { label: 'Mediu', value: 'medium' },
                    { label: 'Pronunțat', value: 'large' },
                    { label: 'Foarte rotunjit', value: 'full' },
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
            {
              type: 'row',
              fields: [
                {
                  name: 'headingScale',
                  type: 'select',
                  label: 'Dimensiune titluri',
                  admin: {
                    width: '50%',
                    description: 'Scala pentru H1-H6',
                  },
                  options: [
                    { label: 'Mic - toate titlurile mai mici', value: 'small' },
                    { label: 'Compact - titluri moderate', value: 'compact' },
                    { label: 'Normal - echilibrat', value: 'normal' },
                    { label: 'Mare - titluri proeminente', value: 'large' },
                    { label: 'Extra Mare - impact maxim', value: 'xlarge' },
                  ],
                },
                {
                  name: 'bodyTextSize',
                  type: 'select',
                  label: 'Dimensiune text',
                  admin: {
                    width: '50%',
                    description: 'Tot textul: paragrafe, liste, tabele, formulare, etc.',
                  },
                  options: [
                    { label: 'Mic (14px)', value: 'small' },
                    { label: 'Normal (16px)', value: 'normal' },
                    { label: 'Mare (18px)', value: 'large' },
                  ],
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'cardGap',
                  type: 'select',
                  label: 'Spatiere carduri',
                  admin: {
                    width: '50%',
                    description: 'Distanta intre carduri in grid-uri',
                  },
                  options: [
                    { label: 'Compact (16px)', value: 'compact' },
                    { label: 'Normal (24px)', value: 'normal' },
                    { label: 'Spatios (32px)', value: 'spacious' },
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
              name: 'autoGeneratePalette',
              type: 'checkbox',
              label: '🎨 Genereaza paleta automat din culoarea primara',
              defaultValue: false,
              admin: {
                condition: (_, siblingData) => siblingData?.useCustomColors,
                description:
                  'Activeaza pentru a genera automat toate culorile din culoarea primara folosind algoritmul OKLCH.',
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
                // Contrast colors - for text on colored backgrounds
                {
                  type: 'collapsible',
                  label: 'Culori Contrast (pentru text pe fundal colorat)',
                  admin: {
                    initCollapsed: true,
                    description:
                      'Culorile pentru text cand este afisat pe fundal colorat (ex: text pe buton primar)',
                  },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'textOnPrimary',
                          type: 'text',
                          label: 'Text pe Primary',
                          defaultValue: '#ffffff',
                          admin: {
                            width: '33%',
                            description: 'Text pe fundal primar (butoane, etc.)',
                          },
                        },
                        {
                          name: 'textOnSecondary',
                          type: 'text',
                          label: 'Text pe Secondary',
                          defaultValue: '#ffffff',
                          admin: { width: '33%' },
                        },
                        {
                          name: 'textOnAccent',
                          type: 'text',
                          label: 'Text pe Accent',
                          defaultValue: '#000000',
                          admin: { width: '33%' },
                        },
                      ],
                    },
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'textOnDark',
                          type: 'text',
                          label: 'Text pe Dark',
                          defaultValue: '#ffffff',
                          admin: { width: '33%' },
                        },
                        {
                          name: 'textOnLight',
                          type: 'text',
                          label: 'Text pe Light',
                          defaultValue: '#1a1a1a',
                          admin: { width: '33%' },
                        },
                        {
                          name: 'textOnSurface',
                          type: 'text',
                          label: 'Text pe Surface',
                          defaultValue: '#1a1a1a',
                          admin: { width: '33%' },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },

        // =========================================================================
        // TAB 4: TIPOGRAFIE (FONTURI + SETARI AVANSATE)
        // =========================================================================
        {
          label: 'Tipografie',
          description: 'Configurari pentru fonturi si tipografie',
          fields: [
            // Font Selection
            {
              type: 'row',
              fields: [
                {
                  name: 'headingFont',
                  type: 'select',
                  label: 'Font Titluri',
                  defaultValue: 'Playfair_Display',
                  admin: {
                    width: '50%',
                    description: 'Fontul folosit pentru titluri (H1-H6)',
                  },
                  options: [
                    { label: 'Playfair Display (Elegant, Serif)', value: 'Playfair_Display' },
                    { label: 'Lora (Clasic, Serif)', value: 'Lora' },
                    { label: 'Inter (Modern, Sans-serif)', value: 'Inter' },
                    { label: 'Montserrat (Bold, Sans-serif)', value: 'Montserrat' },
                    { label: 'Poppins (Geometric, Sans-serif)', value: 'Poppins' },
                    { label: 'Work Sans (Clean, Sans-serif)', value: 'Work_Sans' },
                    { label: 'Open Sans (Friendly, Sans-serif)', value: 'Open_Sans' },
                    { label: 'Lato (Professional, Sans-serif)', value: 'Lato' },
                    { label: 'Source Sans 3 (Readable, Sans-serif)', value: 'Source_Sans_3' },
                    // Modern agency/tech fonts
                    { label: 'Space Grotesk (Tech, Modern)', value: 'Space_Grotesk' },
                    { label: 'Sora (Clean, Geometric)', value: 'Sora' },
                    { label: 'Outfit (Modern, Versatile)', value: 'Outfit' },
                    { label: 'Plus Jakarta Sans (Friendly, Modern)', value: 'Plus_Jakarta_Sans' },
                    { label: 'Manrope (Bold, Modern)', value: 'Manrope' },
                    { label: 'DM Sans (Clean, Readable)', value: 'DM_Sans' },
                    { label: 'DM Serif Display (Elegant Display)', value: 'DM_Serif_Display' },
                    { label: 'Raleway (Elegant, Modern)', value: 'Raleway' },
                  ],
                },
                {
                  name: 'bodyFont',
                  type: 'select',
                  label: 'Font Text',
                  defaultValue: 'Inter',
                  admin: {
                    width: '50%',
                    description: 'Fontul folosit pentru text si paragrafe',
                  },
                  options: [
                    { label: 'Inter (Modern, Clar)', value: 'Inter' },
                    { label: 'Open Sans (Friendly, Lizibil)', value: 'Open_Sans' },
                    { label: 'Lato (Professional)', value: 'Lato' },
                    { label: 'Poppins (Geometric)', value: 'Poppins' },
                    { label: 'Source Sans 3 (Readable)', value: 'Source_Sans_3' },
                    { label: 'Montserrat (Modern)', value: 'Montserrat' },
                    { label: 'Work Sans (Clean)', value: 'Work_Sans' },
                    { label: 'Lora (Serif, Elegant)', value: 'Lora' },
                    // Modern agency/tech fonts
                    { label: 'Space Grotesk (Tech)', value: 'Space_Grotesk' },
                    { label: 'Sora (Clean)', value: 'Sora' },
                    { label: 'Outfit (Versatile)', value: 'Outfit' },
                    { label: 'Plus Jakarta Sans (Friendly)', value: 'Plus_Jakarta_Sans' },
                    { label: 'Manrope (Bold)', value: 'Manrope' },
                    { label: 'DM Sans (Readable)', value: 'DM_Sans' },
                    { label: 'Raleway (Modern)', value: 'Raleway' },
                  ],
                },
              ],
            },
            // Combinatii recomandate info
            {
              type: 'ui',
              name: 'fontCombinationsInfo',
              admin: {
                components: {
                  Field: {
                    path: '@/components/admin/FontCombinationsInfo',
                  },
                },
              },
            },
            // Advanced Typography Settings
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
        // TAB 5: STIL BUTOANE (OPTIONAL)
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

        // =========================================================================
        // TAB 6: EXPORT / IMPORT
        // =========================================================================
        {
          label: 'Export / Import',
          description: 'Salveaza sau incarca configuratii de tema',
          fields: [
            {
              name: 'exportImportUI',
              type: 'ui',
              admin: {
                components: {
                  Field: '@/components/admin/ThemeExportImport',
                },
              },
            },
          ],
        },
      ],
    },
  ],
}
