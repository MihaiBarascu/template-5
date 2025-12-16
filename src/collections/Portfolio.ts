import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '@/access'
import { slugField } from '@/fields/slug'

export const Portfolio: CollectionConfig = {
  slug: 'portfolio',
  labels: {
    singular: 'Proiect',
    plural: 'Portofoliu',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'category', 'featured', 'completedAt'],
    useAsTitle: 'title',
    group: 'Business',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Titlu proiect',
      required: true,
    },
    slugField('title'),
    {
      name: 'shortDescription',
      type: 'textarea',
      label: 'Descriere scurta',
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Descriere detaliata',
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagine principala',
    },
    {
      name: 'gallery',
      type: 'array',
      label: 'Galerie imagini',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
          label: 'Descriere imagine',
        },
      ],
    },
    {
      name: 'client',
      type: 'text',
      label: 'Client',
    },
    {
      name: 'location',
      type: 'text',
      label: 'Locatie',
    },
    {
      name: 'completedAt',
      type: 'date',
      label: 'Data finalizarii',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      label: 'Servicii utilizate',
    },
    {
      name: 'testimonial',
      type: 'group',
      label: 'Testimonial client',
      fields: [
        {
          name: 'content',
          type: 'textarea',
          label: 'Testimonial',
        },
        {
          name: 'author',
          type: 'text',
          label: 'Nume client',
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
      name: 'externalUrl',
      type: 'text',
      label: 'Link extern (URL site demo)',
      admin: {
        description: 'URL catre site-ul demo sau proiect live',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Proiect recomandat',
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
