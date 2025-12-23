import type { Block } from 'payload'
import { sectionWrapperFields } from '../_shared/sectionWrapperFields'
import { headingFields, advancedSettingsGroup } from '../_shared/commonFields'

export const VideoEmbedBlock: Block = {
  slug: 'videoEmbed',
  labels: {
    singular: 'Video Embed',
    plural: 'Video Embeds',
  },
  interfaceName: 'VideoEmbedBlock',
  imageURL: '/blocks/video.svg',
  fields: [
    // === ESSENTIAL FIELDS ===
    {
      name: 'variant',
      type: 'select',
      label: 'Varianta',
      defaultValue: 'centered',
      options: [
        { label: 'Centrat', value: 'centered' },
        { label: 'Full width', value: 'full-width' },
        { label: 'Cu text lateral', value: 'with-text' },
        { label: 'Lightbox (click to play)', value: 'lightbox' },
      ],
    },
    ...headingFields(),
    {
      name: 'videoUrl',
      type: 'text',
      label: 'URL Video',
      required: true,
      admin: {
        description: 'Link YouTube sau Vimeo',
      },
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      label: 'Thumbnail custom',
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'lightbox',
      },
    },
    // Side content for 'with-text' variant
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
      ],
    },
    // === ADVANCED SETTINGS (collapsible) ===
    advancedSettingsGroup({
      label: 'Setari avansate',
      fields: [
        {
          name: 'aspectRatio',
          type: 'select',
          label: 'Raport aspect',
          defaultValue: '16-9',
          options: [
            { label: '16:9 (Standard)', value: '16-9' },
            { label: '4:3', value: '4-3' },
            { label: '1:1 (Patrat)', value: '1-1' },
          ],
        },
        {
          name: 'autoplay',
          type: 'checkbox',
          label: 'Autoplay (muted)',
          defaultValue: false,
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
      ],
    }),
    // Section wrapper fields
    ...sectionWrapperFields,
  ],
}
