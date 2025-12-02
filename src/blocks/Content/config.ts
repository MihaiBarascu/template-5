import type { Block } from 'payload'

export const ContentBlock: Block = {
  slug: 'content',
  labels: {
    singular: 'Continut',
    plural: 'Continut',
  },
  imageURL: '/blocks/content.png',
  fields: [
    {
      name: 'columns',
      type: 'array',
      label: 'Coloane',
      minRows: 1,
      maxRows: 4,
      fields: [
        {
          name: 'width',
          type: 'select',
          label: 'Latime',
          defaultValue: 'full',
          options: [
            { label: '100%', value: 'full' },
            { label: '75%', value: 'three-quarters' },
            { label: '66%', value: 'two-thirds' },
            { label: '50%', value: 'half' },
            { label: '33%', value: 'one-third' },
            { label: '25%', value: 'one-quarter' },
          ],
        },
        {
          name: 'alignment',
          type: 'select',
          label: 'Aliniere verticala',
          defaultValue: 'top',
          options: [
            { label: 'Sus', value: 'top' },
            { label: 'Centru', value: 'center' },
            { label: 'Jos', value: 'bottom' },
          ],
        },
        {
          name: 'contentType',
          type: 'select',
          label: 'Tip continut',
          defaultValue: 'richText',
          options: [
            { label: 'Text formatat', value: 'richText' },
            { label: 'Imagine', value: 'image' },
            { label: 'Video', value: 'video' },
          ],
        },
        {
          name: 'richText',
          type: 'richText',
          label: 'Continut',
          admin: {
            condition: (_, siblingData) => siblingData?.contentType === 'richText',
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Imagine',
          admin: {
            condition: (_, siblingData) => siblingData?.contentType === 'image',
          },
        },
        {
          name: 'videoUrl',
          type: 'text',
          label: 'URL Video',
          admin: {
            condition: (_, siblingData) => siblingData?.contentType === 'video',
          },
        },
      ],
    },
    {
      name: 'backgroundColor',
      type: 'select',
      label: 'Culoare fundal',
      defaultValue: 'default',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
      ],
    },
    {
      name: 'paddingTop',
      type: 'select',
      label: 'Padding sus',
      defaultValue: 'medium',
      options: [
        { label: 'Fara', value: 'none' },
        { label: 'Mic', value: 'small' },
        { label: 'Mediu', value: 'medium' },
        { label: 'Mare', value: 'large' },
      ],
    },
    {
      name: 'paddingBottom',
      type: 'select',
      label: 'Padding jos',
      defaultValue: 'medium',
      options: [
        { label: 'Fara', value: 'none' },
        { label: 'Mic', value: 'small' },
        { label: 'Mediu', value: 'medium' },
        { label: 'Mare', value: 'large' },
      ],
    },
  ],
}
