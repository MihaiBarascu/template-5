import type { Block } from 'payload'

export const HeroBlock: Block = {
  slug: 'hero',
  labels: {
    singular: 'Hero',
    plural: 'Hero',
  },
  imageURL: '/blocks/hero.png',
  fields: [
    {
      name: 'variant',
      type: 'select',
      label: 'Varianta',
      defaultValue: 'centered',
      options: [
        { label: 'Centrat', value: 'centered' },
        { label: 'Aliniat stanga', value: 'left-aligned' },
        { label: 'Split (50/50)', value: 'split' },
        { label: 'Fullscreen', value: 'fullscreen' },
        { label: 'Video background', value: 'video' },
        { label: 'Minimal', value: 'minimal' },
        { label: 'Cu slider', value: 'slider' },
      ],
    },
    {
      name: 'headline',
      type: 'text',
      label: 'Titlu principal',
      required: true,
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
          ['centered', 'left-aligned', 'split', 'fullscreen'].includes(siblingData?.variant),
      },
    },
    {
      name: 'videoUrl',
      type: 'text',
      label: 'URL Video (YouTube/Vimeo)',
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'video',
      },
    },
    {
      name: 'slides',
      type: 'array',
      label: 'Slide-uri',
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'slider',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'headline',
          type: 'text',
          label: 'Titlu',
        },
        {
          name: 'subheadline',
          type: 'text',
          label: 'Subtitlu',
        },
      ],
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
    {
      name: 'overlayOpacity',
      type: 'select',
      label: 'Opacitate overlay',
      defaultValue: '50',
      admin: {
        condition: (_, siblingData) =>
          ['fullscreen', 'video'].includes(siblingData?.variant),
      },
      options: [
        { label: 'Fara', value: '0' },
        { label: '25%', value: '25' },
        { label: '50%', value: '50' },
        { label: '75%', value: '75' },
      ],
    },
    {
      name: 'textColor',
      type: 'select',
      label: 'Culoare text',
      defaultValue: 'auto',
      options: [
        { label: 'Auto', value: 'auto' },
        { label: 'Inchis', value: 'dark' },
        { label: 'Deschis', value: 'light' },
      ],
    },
    {
      name: 'height',
      type: 'select',
      label: 'Inaltime',
      defaultValue: 'large',
      options: [
        { label: 'Mica', value: 'small' },
        { label: 'Medie', value: 'medium' },
        { label: 'Mare', value: 'large' },
        { label: 'Fullscreen', value: 'fullscreen' },
      ],
    },
  ],
}
