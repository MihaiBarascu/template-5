import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '@/access'
import { slugField } from '@/fields/slug'

export const Team: CollectionConfig = {
  slug: 'team',
  labels: {
    singular: 'Membru echipa',
    plural: 'Echipa',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'role', 'featured', 'order'],
    useAsTitle: 'name',
    group: 'Business',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nume complet',
      required: true,
    },
    slugField('name'),
    {
      name: 'role',
      type: 'text',
      label: 'Functie / Specializare',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Fotografie',
    },
    {
      name: 'bio',
      type: 'richText',
      label: 'Biografie',
    },
    {
      name: 'experience',
      type: 'text',
      label: 'Experienta',
      admin: {
        description: 'Ex: 10+ ani experienta',
      },
    },
    {
      name: 'specializations',
      type: 'array',
      label: 'Specializari',
      fields: [
        {
          name: 'specialization',
          type: 'text',
          label: 'Specializare',
        },
      ],
    },
    {
      name: 'contact',
      type: 'group',
      label: 'Contact',
      fields: [
        {
          name: 'email',
          type: 'email',
          label: 'Email',
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Telefon',
        },
        {
          name: 'whatsapp',
          type: 'text',
          label: 'WhatsApp',
        },
      ],
    },
    {
      name: 'social',
      type: 'group',
      label: 'Social Media',
      fields: [
        {
          name: 'facebook',
          type: 'text',
          label: 'Facebook',
        },
        {
          name: 'instagram',
          type: 'text',
          label: 'Instagram',
        },
        {
          name: 'linkedin',
          type: 'text',
          label: 'LinkedIn',
        },
        {
          name: 'twitter',
          type: 'text',
          label: 'Twitter/X',
        },
      ],
    },
    {
      name: 'schedule',
      type: 'array',
      label: 'Program',
      fields: [
        {
          name: 'day',
          type: 'select',
          label: 'Zi',
          options: [
            { label: 'Luni', value: 'luni' },
            { label: 'Marti', value: 'marti' },
            { label: 'Miercuri', value: 'miercuri' },
            { label: 'Joi', value: 'joi' },
            { label: 'Vineri', value: 'vineri' },
            { label: 'Sambata', value: 'sambata' },
            { label: 'Duminica', value: 'duminica' },
          ],
        },
        {
          name: 'hours',
          type: 'text',
          label: 'Ore',
          admin: {
            description: 'Ex: 09:00 - 17:00 sau Inchis',
          },
        },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Afisat pe homepage',
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
