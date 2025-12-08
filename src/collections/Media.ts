import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '@/access'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Media',
    plural: 'Media',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['filename', 'alt', 'updatedAt'],
    group: 'Continut',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Text alternativ',
      required: true,
    },
    {
      name: 'caption',
      type: 'textarea',
      label: 'Descriere',
    },
  ],
  upload: {
    adminThumbnail: 'thumbnail',
    focalPoint: true, // Permite selectarea punctului focal pentru crop
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
      },
      {
        name: 'square',
        width: 500,
        height: 500,
      },
      {
        name: 'small',
        width: 600,
      },
      {
        name: 'medium',
        width: 900,
      },
      {
        name: 'large',
        width: 1400,
      },
      {
        name: 'xlarge',
        width: 1920,
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        crop: 'center',
      },
    ],
    mimeTypes: ['image/*', 'application/pdf'],
  },
}
