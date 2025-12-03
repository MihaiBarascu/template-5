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
                        { label: 'Inter', value: 'Inter' },
                        { label: 'Playfair Display (Serif)', value: 'Playfair Display' },
                        { label: 'Montserrat', value: 'Montserrat' },
                        { label: 'Poppins', value: 'Poppins' },
                        { label: 'Oswald (Bold)', value: 'Oswald' },
                        { label: 'Lora (Serif)', value: 'Lora' },
                        { label: 'Roboto', value: 'Roboto' },
                      ],
                      admin: { width: '50%' },
                    },
                    {
                      name: 'bodyFont',
                      type: 'select',
                      label: 'Font text',
                      defaultValue: 'Inter',
                      options: [
                        { label: 'Inter', value: 'Inter' },
                        { label: 'Open Sans', value: 'Open Sans' },
                        { label: 'Roboto', value: 'Roboto' },
                        { label: 'Lato', value: 'Lato' },
                        { label: 'Source Sans Pro', value: 'Source Sans Pro' },
                        { label: 'Poppins', value: 'Poppins' },
                      ],
                      admin: { width: '50%' },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
