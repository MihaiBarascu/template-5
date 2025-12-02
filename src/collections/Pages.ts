import type { CollectionConfig } from 'payload'
import { authenticated, authenticatedOrPublished } from '@/access'
import { slugField } from '@/fields/slug'
import { revalidatePageAfterChange, revalidatePageAfterDelete } from '@/hooks/revalidatePage'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: 'Pagina',
    plural: 'Pagini',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) => {
        const path = data?.slug === 'home' ? '' : data?.slug
        return `${req.protocol}//${req.host}/${path}`
      },
    },
    preview: (data, { req }) => {
      const path = data?.slug === 'home' ? '' : data?.slug
      return `${req.protocol}//${req.host}/api/preview?url=/${path}&secret=${process.env.PREVIEW_SECRET}`
    },
    useAsTitle: 'title',
    group: 'Continut',
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
      name: 'heroType',
      type: 'select',
      label: 'Tip Hero',
      defaultValue: 'none',
      options: [
        { label: 'Fara hero', value: 'none' },
        { label: 'Minimal', value: 'minimal' },
        { label: 'Centrat', value: 'centered' },
        { label: 'Cu imagine', value: 'withImage' },
        { label: 'Fullscreen', value: 'fullscreen' },
        { label: 'Split', value: 'split' },
        { label: 'Video', value: 'video' },
        { label: 'Slider', value: 'slider' },
      ],
    },
    {
      name: 'hero',
      type: 'group',
      label: 'Hero',
      admin: {
        condition: (_, siblingData) => siblingData?.heroType && siblingData.heroType !== 'none',
      },
      fields: [
        {
          name: 'headline',
          type: 'text',
          label: 'Titlu principal',
        },
        {
          name: 'subheadline',
          type: 'textarea',
          label: 'Subtitlu',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Imagine',
          admin: {
            condition: (_, siblingData) =>
              ['withImage', 'fullscreen', 'split'].includes(siblingData?.heroType),
          },
        },
        {
          name: 'videoUrl',
          type: 'text',
          label: 'URL Video (YouTube/Vimeo)',
          admin: {
            condition: (_, siblingData) => siblingData?.heroType === 'video',
          },
        },
        {
          name: 'ctaButtons',
          type: 'array',
          label: 'Butoane CTA',
          maxRows: 2,
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Text',
              required: true,
            },
            {
              name: 'link',
              type: 'text',
              label: 'Link',
              required: true,
            },
            {
              name: 'variant',
              type: 'select',
              label: 'Stil',
              defaultValue: 'default',
              options: [
                { label: 'Primary', value: 'default' },
                { label: 'Outline', value: 'outline' },
                { label: 'Ghost', value: 'ghost' },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'layout',
      type: 'blocks',
      label: 'Continut pagina',
      blocks: [],  // Populated in payload.config.ts
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    afterChange: [revalidatePageAfterChange],
    afterDelete: [revalidatePageAfterDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
