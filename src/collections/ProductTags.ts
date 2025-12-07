import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '@/access'
import { slugField } from '@/fields/slug'

/**
 * ProductTags Collection
 *
 * Tags flexibile pentru produse: Nou, Promoție, Bestseller, Eco, etc.
 * Folosite pentru:
 * - Filtrare rapidă pe frontend
 * - Badge-uri vizuale pe carduri produse
 * - Grupare dinamică de produse
 */
export const ProductTags: CollectionConfig = {
  slug: 'product-tags',
  labels: {
    singular: 'Tag Produs',
    plural: 'Tag-uri Produse',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    group: 'Shop',
    defaultColumns: ['name', 'color', 'order'],
    description: 'Tag-uri pentru categorisire și filtrare produse (ex: Nou, Promoție, Bestseller)',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nume Tag',
      required: true,
      admin: {
        description: 'Ex: Nou, Promoție, Bestseller, Eco-friendly',
      },
    },
    slugField('name'),
    {
      name: 'color',
      type: 'text',
      label: 'Culoare Badge',
      admin: {
        description: 'Culoare HEX pentru badge (ex: #e74c3c pentru roșu)',
      },
    },
    {
      name: 'icon',
      type: 'text',
      label: 'Icon (Lucide)',
      admin: {
        description: 'Nume icon Lucide opțional (ex: star, flame, leaf)',
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Ordine afișare',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
