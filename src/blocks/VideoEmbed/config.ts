import type { Block } from 'payload'

export const VideoEmbedBlock: Block = {
  slug: 'videoEmbed',
  labels: {
    singular: 'Video Embed',
    plural: 'Video Embeds',
  },
  interfaceName: 'VideoEmbedBlock',
  imageURL: '/blocks/video.svg',
  fields: [
    {
      name: 'variant',
      type: 'select',
      label: 'Varianta',
      defaultValue: 'centered',
      options: [
        { label: 'Centrat', value: 'centered' },
        { label: 'Full width', value: 'full-width' },
        { label: 'Cu text lateral', value: 'with-text' },
        { label: 'Cu thumbnail custom', value: 'custom-thumbnail' },
        { label: 'Lightbox (click to play)', value: 'lightbox' },
      ],
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Titlu sectiune',
    },
    {
      name: 'subheading',
      type: 'textarea',
      label: 'Subtitlu sectiune',
    },
    {
      name: 'videoUrl',
      type: 'text',
      label: 'URL Video',
      required: true,
      admin: {
        description: 'Link YouTube sau Vimeo (ex: https://www.youtube.com/watch?v=xxxxx)',
      },
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      label: 'Thumbnail custom',
      admin: {
        condition: (_, siblingData) =>
          ['custom-thumbnail', 'lightbox'].includes(siblingData?.variant),
        description: 'Daca nu este selectat, se va folosi thumbnail-ul default de pe YouTube/Vimeo',
      },
    },
    {
      name: 'sideContent',
      type: 'group',
      label: 'Continut lateral',
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'with-text',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Titlu',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Descriere',
        },
        {
          name: 'ctaButton',
          type: 'group',
          label: 'Buton CTA',
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Text buton',
            },
            {
              name: 'link',
              type: 'text',
              label: 'Link',
            },
          ],
        },
        {
          name: 'position',
          type: 'select',
          label: 'Pozitie text',
          defaultValue: 'right',
          options: [
            { label: 'Stanga', value: 'left' },
            { label: 'Dreapta', value: 'right' },
          ],
        },
      ],
    },
    {
      name: 'aspectRatio',
      type: 'select',
      label: 'Raport aspect',
      defaultValue: '16-9',
      options: [
        { label: '16:9 (Standard)', value: '16-9' },
        { label: '4:3', value: '4-3' },
        { label: '1:1 (Patrat)', value: '1-1' },
        { label: '21:9 (Cinematic)', value: '21-9' },
      ],
    },
    {
      name: 'autoplay',
      type: 'checkbox',
      label: 'Autoplay (muted)',
      defaultValue: false,
      admin: {
        description: 'Video-ul va porni automat (fara sunet)',
      },
    },
    {
      name: 'loop',
      type: 'checkbox',
      label: 'Loop',
      defaultValue: false,
    },
    {
      name: 'showControls',
      type: 'checkbox',
      label: 'Afiseaza controale',
      defaultValue: true,
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
      name: 'maxWidth',
      type: 'select',
      label: 'Latime maxima',
      defaultValue: 'lg',
      admin: {
        condition: (_, siblingData) => siblingData?.variant !== 'full-width',
      },
      options: [
        { label: 'Mica (640px)', value: 'sm' },
        { label: 'Medie (768px)', value: 'md' },
        { label: 'Mare (1024px)', value: 'lg' },
        { label: 'Extra mare (1280px)', value: 'xl' },
      ],
    },
  ],
}
