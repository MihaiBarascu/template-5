import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '@/access'
import { slugField } from '@/fields/slug'

export const Services: CollectionConfig = {
  slug: 'services',
  labels: {
    singular: 'Serviciu',
    plural: 'Servicii',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'price', 'duration', 'featured', 'order'],
    useAsTitle: 'title',
    group: 'Business',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Denumire serviciu',
      required: true,
    },
    slugField('title'),
    {
      name: 'shortDescription',
      type: 'textarea',
      label: 'Descriere scurta',
      admin: {
        description: 'Maxim 2-3 propozitii pentru carduri',
      },
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Descriere detaliata',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagine',
    },
    {
      name: 'icon',
      type: 'text',
      label: 'Icon (Lucide icon name)',
      admin: {
        description: 'Ex: Scissors, Heart, Car, Wrench, etc.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'price',
          type: 'number',
          label: 'Pret (RON)',
          admin: {
            width: '33%',
          },
        },
        {
          name: 'priceFrom',
          type: 'checkbox',
          label: 'De la (pret orientativ)',
          admin: {
            width: '33%',
            style: { alignSelf: 'flex-end' },
          },
        },
        {
          name: 'duration',
          type: 'text',
          label: 'Durata',
          admin: {
            width: '33%',
            description: 'Ex: 30 min, 1 ora, 2-3 ore',
          },
        },
      ],
    },
    {
      name: 'features',
      type: 'array',
      label: 'Ce include',
      fields: [
        {
          name: 'feature',
          type: 'text',
          label: 'Caracteristica',
        },
      ],
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
      name: 'featured',
      type: 'checkbox',
      label: 'Serviciu popular',
      defaultValue: false,
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
