import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '@/access'
import { slugField } from '@/fields/slug'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: 'Categorie Blog',
    plural: 'Categorii Blog',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'slug'],
    useAsTitle: 'title',
    group: 'Blog',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Titlu',
      required: true,
    },
    slugField('title'),
    {
      name: 'description',
      type: 'textarea',
      label: 'Descriere',
    },
  ],
}
