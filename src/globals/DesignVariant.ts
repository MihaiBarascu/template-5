import type { GlobalConfig } from 'payload'
import { authenticated } from '@/access'
import { revalidateGlobal } from '@/hooks/revalidateGlobal'

/**
 * Design Variant Global - permite schimbarea variantei de design din admin
 *
 * Fiecare tip de business are variante predefinite:
 * - barbershop: 5 variante (dark gold, modern red, vintage, urban, minimal)
 * - dentist: 5 variante (medical blue, warm, modern, premium, fresh)
 * - restaurant: 5 variante (warm rustic, modern minimal, elegant, cozy, vibrant)
 * - magazin: 5 variante (green eco, purple luxury, orange energy, blue trust, pink feminine)
 * - etc.
 *
 * Admin poate schimba varianta instant fara re-seed!
 */
export const DesignVariant: GlobalConfig = {
  slug: 'design-variant',
  label: 'Varianta Design',
  admin: {
    description: 'Schimba rapid aspectul site-ului selectand o varianta predefinita',
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
      name: 'businessType',
      type: 'select',
      label: 'Tip Afacere',
      required: true,
      defaultValue: 'magazin',
      admin: {
        description: 'Selecteaza tipul de afacere pentru a vedea variantele disponibile',
      },
      options: [
        { label: 'Frizerie / Barbershop', value: 'barbershop' },
        { label: 'Cabinet Stomatologic', value: 'dentist' },
        { label: 'Restaurant / Cafenea', value: 'restaurant' },
        { label: 'Magazin Online', value: 'magazin' },
        { label: 'Service Auto', value: 'auto-service' },
        { label: 'Salon Infrumusetare', value: 'salon' },
        { label: 'Cabinet Avocat', value: 'avocat' },
        { label: 'Firma Constructii', value: 'constructii' },
      ],
    },
    {
      name: 'variantIndex',
      type: 'select',
      label: 'Varianta Design',
      required: true,
      defaultValue: '0',
      admin: {
        description: 'Fiecare varianta are culori, fonturi si layout diferit',
      },
      options: [
        { label: 'Varianta 1 (Default)', value: '0' },
        { label: 'Varianta 2', value: '1' },
        { label: 'Varianta 3', value: '2' },
        { label: 'Varianta 4', value: '3' },
        { label: 'Varianta 5', value: '4' },
      ],
    },
    {
      name: 'variantDescription',
      type: 'textarea',
      label: 'Descriere varianta',
      admin: {
        readOnly: true,
        description: 'Informatii despre varianta selectata',
      },
    },
    {
      type: 'collapsible',
      label: 'Override Manual (optional)',
      admin: {
        initCollapsed: true,
        description: 'Suprascrie setarile variantei selectate',
      },
      fields: [
        {
          name: 'useOverride',
          type: 'checkbox',
          label: 'Foloseste override manual',
          defaultValue: false,
        },
        {
          name: 'override',
          type: 'group',
          admin: {
            condition: (_, siblingData) => siblingData?.useOverride,
          },
          fields: [
            {
              name: 'heroType',
              type: 'select',
              label: 'Tip Hero',
              options: [
                { label: 'Fullscreen', value: 'fullscreen' },
                { label: 'Centered', value: 'centered' },
                { label: 'Split (Imagine stanga)', value: 'split' },
                { label: 'Minimal', value: 'minimal' },
              ],
            },
            {
              name: 'heroOverlay',
              type: 'select',
              label: 'Overlay Hero',
              options: [
                { label: 'Dark', value: 'dark' },
                { label: 'Light', value: 'light' },
                { label: 'Gradient', value: 'gradient' },
                { label: 'Fara overlay', value: 'none' },
              ],
            },
            {
              name: 'servicesVariant',
              type: 'select',
              label: 'Stil Servicii',
              options: [
                { label: 'Grid 3 coloane', value: 'grid-3' },
                { label: 'Grid 4 coloane', value: 'grid-4' },
                { label: 'Lista', value: 'list' },
                { label: 'Cards', value: 'cards' },
                { label: 'Cu preturi', value: 'with-prices' },
              ],
            },
            {
              name: 'teamVariant',
              type: 'select',
              label: 'Stil Echipa',
              options: [
                { label: 'Grid', value: 'grid' },
                { label: 'Grid Centrat', value: 'grid-centered' },
                { label: 'Lista', value: 'list' },
                { label: 'Carousel', value: 'carousel' },
              ],
            },
            {
              name: 'testimonialsVariant',
              type: 'select',
              label: 'Stil Testimoniale',
              options: [
                { label: 'Carousel', value: 'carousel' },
                { label: 'Grid', value: 'grid' },
                { label: 'Masonry', value: 'masonry' },
                { label: 'Single (mare)', value: 'single' },
              ],
            },
            {
              name: 'galleryVariant',
              type: 'select',
              label: 'Stil Galerie',
              options: [
                { label: 'Grid 3 coloane', value: 'grid-3' },
                { label: 'Grid 4 coloane', value: 'grid-4' },
                { label: 'Masonry', value: 'masonry' },
                { label: 'Carousel', value: 'carousel' },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Setari Homepage Layout',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'homepageSections',
          type: 'array',
          label: 'Ordine sectiuni homepage',
          admin: {
            description: 'Trage pentru a reordona sectiunile pe homepage',
          },
          fields: [
            {
              name: 'section',
              type: 'select',
              required: true,
              options: [
                { label: 'Hero', value: 'hero' },
                { label: 'Servicii', value: 'services' },
                { label: 'Produse', value: 'products' },
                { label: 'Statistici', value: 'stats' },
                { label: 'Echipa', value: 'team' },
                { label: 'Testimoniale', value: 'testimonials' },
                { label: 'Galerie', value: 'gallery' },
                { label: 'FAQ', value: 'faq' },
                { label: 'Preturi', value: 'pricing' },
                { label: 'Call to Action', value: 'cta' },
                { label: 'Contact', value: 'contact' },
              ],
            },
            {
              name: 'enabled',
              type: 'checkbox',
              label: 'Activ',
              defaultValue: true,
            },
          ],
          defaultValue: [
            { section: 'hero', enabled: true },
            { section: 'services', enabled: true },
            { section: 'stats', enabled: true },
            { section: 'team', enabled: true },
            { section: 'testimonials', enabled: true },
            { section: 'gallery', enabled: true },
            { section: 'faq', enabled: true },
            { section: 'cta', enabled: true },
          ],
        },
      ],
    },
  ],
}
