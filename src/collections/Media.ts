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
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 512,
        position: 'centre',
      },
      {
        name: 'hero',
        width: 1920,
        height: 1080,
        position: 'centre',
      },
    ],
    mimeTypes: ['image/*', 'application/pdf'],
  },
}
