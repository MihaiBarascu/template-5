import type { CollectionConfig } from 'payload'
import { superAdminOrTenantAdminAccess } from '@/access/multiTenant'
import { revalidateTag } from 'next/cache'

/**
 * SiteTheme Collection (converted from Global)
 *
 * In multi-tenant architecture, each tenant has their own theme settings.
 * The plugin adds `isGlobal: true` to ensure exactly ONE document per tenant.
 *
 * Original: src/globals/SiteTheme.ts
 */
export const SiteThemeCollection: CollectionConfig = {
  slug: 'tenant-site-themes',
  labels: {
    singular: 'Tema Site Tenant',
    plural: 'Teme Site Tenant',
  },
  admin: {
    useAsTitle: 'variant',
    group: 'Setari Tenant',
    description: 'Configurare tema și design pentru tenant',
    defaultColumns: ['tenant', 'variant', 'updatedAt'],
  },
  access: {
    read: () => true, // Public read for frontend
    create: superAdminOrTenantAdminAccess,
    update: superAdminOrTenantAdminAccess,
    delete: superAdminOrTenantAdminAccess,
  },
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        // Revalidate tenant-specific cache
        const tenantId = typeof doc.tenant === 'string' ? doc.tenant : doc.tenant?.id
        if (tenantId) {
          try {
            revalidateTag(`tenant-${tenantId}`, "max")
            revalidateTag(`tenant-site-themes-${tenantId}`, "max")
          } catch (e) {
            req.payload.logger.warn('Could not revalidate site-theme cache')
          }
        }
        return doc
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // TAB 1: VARIANTA DESIGN
        {
          label: 'Varianta Design',
          description: 'Selecteaza varianta de design',
          fields: [
            {
              name: 'variant',
              type: 'select',
              label: 'Stil Design',
              required: true,
              defaultValue: 'dark-gold',
              options: [
                { label: '1. Dark & Gold - Elegant, premium', value: 'dark-gold' },
                { label: '2. Modern Red - Bold, energic', value: 'modern-red' },
                { label: '3. Classic Blue - Profesional', value: 'classic-blue' },
                { label: '4. Fresh Green - Natural, eco', value: 'fresh-green' },
                { label: '5. Minimal Black - Clean, modern', value: 'minimal-black' },
                { label: '6. Purple Premium - Luxos', value: 'purple-premium' },
                { label: '7. Warm Orange - Prietenos', value: 'warm-orange' },
                { label: '8. Teal Modern - Fresh, cool', value: 'teal-modern' },
                { label: '9. Brown Vintage - Clasic', value: 'brown-vintage' },
                { label: '10. Pink Soft - Feminin', value: 'pink-soft' },
                { label: '11. Fitness Orange - Energic', value: 'fitness-orange' },
                { label: '12. Fitness Dark - Gym modern', value: 'fitness-dark' },
                { label: '13. Gold Navy Healing - Spiritual', value: 'gold-navy-healing' },
                { label: '14. Revital Harmony - Gold/Navy', value: 'revital-harmony' },
                { label: '15. Purple Wellness - Mov/Cyan', value: 'purple-wellness' },
              ],
            },
          ],
        },

        // TAB 2: LAYOUT & STIL
        {
          label: 'Layout & Stil',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'borderRadius',
                  type: 'select',
                  label: 'Raze colturi',
                  admin: { width: '33%' },
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
                  admin: { width: '33%' },
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
                  admin: { width: '33%' },
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
                  admin: { width: '50%' },
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
                  admin: { width: '50%' },
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
                  admin: { width: '50%' },
                  options: [
                    { label: 'Mic', value: 'small' },
                    { label: 'Compact', value: 'compact' },
                    { label: 'Normal', value: 'normal' },
                    { label: 'Mare', value: 'large' },
                    { label: 'Extra Mare', value: 'xlarge' },
                  ],
                },
                {
                  name: 'bodyTextSize',
                  type: 'select',
                  label: 'Dimensiune text',
                  admin: { width: '50%' },
                  options: [
                    { label: 'Mic (14px)', value: 'small' },
                    { label: 'Normal (16px)', value: 'normal' },
                    { label: 'Mare (18px)', value: 'large' },
                  ],
                },
              ],
            },
          ],
        },

        // TAB 3: CULORI PERSONALIZATE
        {
          label: 'Culori Personalizate',
          fields: [
            {
              name: 'useCustomColors',
              type: 'checkbox',
              label: 'Foloseste culori personalizate',
              defaultValue: false,
            },
            {
              name: 'colors',
              type: 'group',
              admin: { condition: (_, siblingData) => siblingData?.useCustomColors },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'primary', type: 'text', label: 'Primara', admin: { width: '33%' } },
                    { name: 'secondary', type: 'text', label: 'Secundara', admin: { width: '33%' } },
                    { name: 'accent', type: 'text', label: 'Accent', admin: { width: '33%' } },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'dark', type: 'text', label: 'Inchisa', admin: { width: '33%' } },
                    { name: 'light', type: 'text', label: 'Deschisa', admin: { width: '33%' } },
                    { name: 'surface', type: 'text', label: 'Surface', admin: { width: '33%' } },
                  ],
                },
              ],
            },
          ],
        },

        // TAB 4: TIPOGRAFIE
        {
          label: 'Tipografie',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'headingFont',
                  type: 'select',
                  label: 'Font Titluri',
                  defaultValue: 'Playfair_Display',
                  admin: { width: '50%' },
                  options: [
                    { label: 'Playfair Display (Serif Elegant)', value: 'Playfair_Display' },
                    { label: 'Lora (Serif, Elegant)', value: 'Lora' },
                    { label: 'Inter (Modern)', value: 'Inter' },
                    { label: 'Montserrat (Modern)', value: 'Montserrat' },
                    { label: 'Poppins (Geometric)', value: 'Poppins' },
                    { label: 'Work Sans (Clean)', value: 'Work_Sans' },
                    { label: 'DM Sans (Readable)', value: 'DM_Sans' },
                    { label: 'Raleway (Modern)', value: 'Raleway' },
                    { label: 'Space Grotesk (Tech)', value: 'Space_Grotesk' },
                    { label: 'Sora (Clean)', value: 'Sora' },
                    { label: 'Outfit (Versatile)', value: 'Outfit' },
                    { label: 'Plus Jakarta Sans (Friendly)', value: 'Plus_Jakarta_Sans' },
                    { label: 'Manrope (Bold)', value: 'Manrope' },
                    { label: 'Prompt (Clean, Flat)', value: 'Prompt' },
                    { label: 'Open Sans (Friendly)', value: 'Open_Sans' },
                    { label: 'Lato (Professional)', value: 'Lato' },
                    { label: 'Source Sans 3 (Readable)', value: 'Source_Sans_3' },
                  ],
                },
                {
                  name: 'bodyFont',
                  type: 'select',
                  label: 'Font Text',
                  defaultValue: 'Inter',
                  admin: { width: '50%' },
                  options: [
                    { label: 'Inter (Modern, Clar)', value: 'Inter' },
                    { label: 'Open Sans (Friendly, Lizibil)', value: 'Open_Sans' },
                    { label: 'Lato (Professional)', value: 'Lato' },
                    { label: 'Poppins (Geometric)', value: 'Poppins' },
                    { label: 'Source Sans 3 (Readable)', value: 'Source_Sans_3' },
                    { label: 'Montserrat (Modern)', value: 'Montserrat' },
                    { label: 'Work Sans (Clean)', value: 'Work_Sans' },
                    { label: 'Lora (Serif, Elegant)', value: 'Lora' },
                    { label: 'Space Grotesk (Tech)', value: 'Space_Grotesk' },
                    { label: 'Sora (Clean)', value: 'Sora' },
                    { label: 'Outfit (Versatile)', value: 'Outfit' },
                    { label: 'Plus Jakarta Sans (Friendly)', value: 'Plus_Jakarta_Sans' },
                    { label: 'Manrope (Bold)', value: 'Manrope' },
                    { label: 'DM Sans (Readable)', value: 'DM_Sans' },
                    { label: 'Raleway (Modern)', value: 'Raleway' },
                    { label: 'Prompt (Clean, Flat)', value: 'Prompt' },
                  ],
                },
              ],
            },
            {
              name: 'headingWeight',
              type: 'select',
              label: 'Grosime Titluri',
              defaultValue: '600',
              options: [
                { label: 'Light (300)', value: '300' },
                { label: 'Normal (400)', value: '400' },
                { label: 'Medium (500)', value: '500' },
                { label: 'Semibold (600)', value: '600' },
                { label: 'Bold (700)', value: '700' },
              ],
            },
          ],
        },
      ],
    },
  ],
  timestamps: true,
}
