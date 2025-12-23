import type { Block } from 'payload'
import { sectionWrapperFields } from '../_shared/sectionWrapperFields'
import { advancedSettingsGroup } from '../_shared/commonFields'

/**
 * Hero Block - Main page header section
 * Supports images, video backgrounds, and sliders
 */
export const HeroBlock: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  labels: {
    singular: 'Hero',
    plural: 'Hero',
  },
  imageURL: '/blocks/hero.svg',
  fields: [
    // === ESSENTIAL FIELDS ===
    {
      name: 'variant',
      type: 'select',
      label: 'Varianta',
      defaultValue: 'centered',
      options: [
        { label: 'Centrat', value: 'centered' },
        { label: 'Aliniat stanga', value: 'left-aligned' },
        { label: 'Split (50/50)', value: 'split' },
        { label: 'Video background', value: 'video' },
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
          ['centered', 'left-aligned', 'split'].includes(siblingData?.variant),
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
          ],
        },
      ],
    },
    // === ADVANCED SETTINGS (collapsible) ===
    advancedSettingsGroup({
      label: 'Setari avansate',
      fields: [
        {
          name: 'overlayOpacity',
          type: 'select',
          label: 'Opacitate overlay',
          defaultValue: '50',
          options: [
            { label: 'Fara', value: '0' },
            { label: '25%', value: '25' },
            { label: '50%', value: '50' },
            { label: '75%', value: '75' },
          ],
        },
        {
          name: 'height',
          type: 'select',
          label: 'Inaltime',
          defaultValue: 'large',
          options: [
            { label: 'Medie', value: 'medium' },
            { label: 'Mare', value: 'large' },
            { label: 'Fullscreen', value: 'fullscreen' },
          ],
        },
      ],
    }),
    // Section wrapper fields
    ...sectionWrapperFields,
  ],
}
