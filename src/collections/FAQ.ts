import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '@/access'

export const FAQ: CollectionConfig = {
  slug: 'faq',
  labels: {
    singular: 'Intrebare frecventa',
    plural: 'Intrebari frecvente',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['question', 'category', 'order'],
    useAsTitle: 'question',
    group: 'Continut',
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      label: 'Intrebare',
      required: true,
    },
    {
      name: 'answer',
      type: 'richText',
      label: 'Raspuns',
      required: true,
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      label: 'Categorie',
      admin: {
        position: 'sidebar',
      },
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
