import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '@/access'
import { slugField } from '@/fields/slug'

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
    defaultColumns: ['title', 'order'],
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
      name: 'order',
      type: 'number',
      label: 'Ordine afisare',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
