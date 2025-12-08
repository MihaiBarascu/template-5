import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '@/access'
import { slugField } from '@/fields/slug'

/**
 * ProductCategories Collection
 *
 * Categorii pentru produse cu suport pentru:
 * - Ierarhie (categorii părinte/copil)
 * - Imagini și icoane
 * - Categorii featured pentru homepage
 */
export const ProductCategories: CollectionConfig = {
  slug: 'product-categories',
  labels: {
    singular: 'Categorie Produse',
    plural: 'Categorii Produse',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    group: 'Shop',
    defaultColumns: ['title', 'parent', 'featured', 'order'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Denumire categorie',
      required: true,
    },
    slugField('title'),
    {
      name: 'description',
      type: 'textarea',
      label: 'Descriere',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagine categorie',
    },
    {
      name: 'icon',
      type: 'text',
      label: 'Icon (Lucide)',
      admin: {
        description: 'Nume icon Lucide opțional (ex: shirt, laptop, home, utensils)',
      },
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'product-categories',
      label: 'Categorie părinte',
      // Previne selectarea propriei categorii ca părinte
      filterOptions: ({ id }) => {
        if (!id) return true
        return { id: { not_equals: id } }
      },
      admin: {
        description: 'Selectează categoria părinte pentru ierarhie',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Categorie recomandată',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Afișează pe homepage',
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
