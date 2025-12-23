import type { Block } from 'payload'
import { advancedSettingsGroup } from '../_shared/commonFields'

export const VideoHeroBlock: Block = {
  slug: 'video-hero',
  interfaceName: 'VideoHeroBlock',
  labels: {
    singular: 'Video Hero (Premium)',
    plural: 'Video Hero',
  },
  imageURL: '/blocks/video-hero.svg',
  fields: [
    // === ESSENTIAL FIELDS ===
    {
      name: 'variant',
      type: 'select',
      label: 'Varianta layout',
      defaultValue: 'default',
      options: [
        { label: 'Default (un mesaj central)', value: 'default' },
        { label: 'Split (2 coloane egale)', value: 'split' },
        { label: 'Centered (minimal, titlu mare)', value: 'centered' },
        { label: 'Carousel (slider cu mesaje multiple)', value: 'carousel' },
      ],
    },
    // Video source
    {
      name: 'videoSource',
      type: 'select',
      label: 'Sursa video',
      defaultValue: 'url',
      options: [
        { label: 'URL extern (YouTube/Vimeo)', value: 'url' },
        { label: 'Fisier video incarcat', value: 'upload' },
      ],
    },
    {
      name: 'videoUrl',
      type: 'text',
      label: 'URL Video',
      admin: {
        condition: (_, siblingData) => siblingData?.videoSource === 'url',
      },
    },
    {
      name: 'videoFile',
      type: 'upload',
      relationTo: 'media',
      label: 'Fisier video',
      admin: {
        condition: (_, siblingData) => siblingData?.videoSource === 'upload',
      },
    },
    {
      name: 'videoPoster',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagine poster (fallback)',
    },
    // Content for DEFAULT/CENTERED
    {
      name: 'headline',
      type: 'text',
      label: 'Titlu principal',
      required: true,
      admin: {
        condition: (_, siblingData) =>
          siblingData?.variant !== 'split' && siblingData?.variant !== 'carousel',
      },
    },
    {
      name: 'subheadline',
      type: 'textarea',
      label: 'Subtitlu',
      admin: {
        condition: (_, siblingData) =>
          siblingData?.variant !== 'split' && siblingData?.variant !== 'carousel',
      },
    },
    {
      name: 'ctaButtons',
      type: 'array',
      label: 'Butoane CTA',
      maxRows: 2,
      admin: {
        condition: (_, siblingData) =>
          siblingData?.variant !== 'split' && siblingData?.variant !== 'carousel',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Text buton',
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
          label: 'Stil buton',
          defaultValue: 'primary',
          options: [
            { label: 'Primary', value: 'primary' },
            { label: 'Secondary', value: 'secondary' },
          ],
        },
      ],
    },
    // Content for SPLIT variant
    {
      name: 'splitColumns',
      type: 'array',
      label: 'Coloane Split',
      minRows: 2,
      maxRows: 2,
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'split',
      },
      fields: [
        {
          name: 'headline',
          type: 'text',
          label: 'Titlu coloana',
          required: true,
        },
        {
          name: 'subheadline',
          type: 'textarea',
          label: 'Descriere scurta',
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
              required: true,
            },
            {
              name: 'link',
              type: 'text',
              label: 'Link',
              required: true,
            },
          ],
        },
      ],
    },
    // Content for CAROUSEL variant
    {
      name: 'carouselSlides',
      type: 'array',
      label: 'Slide-uri Carousel',
      minRows: 2,
      maxRows: 6,
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'carousel',
      },
      fields: [
        {
          name: 'headline',
          type: 'text',
          label: 'Titlu slide',
          required: true,
        },
        {
          name: 'subheadline',
          type: 'textarea',
          label: 'Subtitlu slide',
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
              label: 'Text buton',
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
              label: 'Stil buton',
              defaultValue: 'primary',
              options: [
                { label: 'Primary', value: 'primary' },
                { label: 'Secondary', value: 'secondary' },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'carouselAutoplay',
      type: 'checkbox',
      label: 'Autoplay carousel',
      defaultValue: true,
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'carousel',
      },
    },
    {
      name: 'carouselSpeed',
      type: 'number',
      label: 'Viteza schimbare (ms)',
      defaultValue: 6000,
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'carousel',
      },
    },
    // === ADVANCED SETTINGS (collapsible) ===
    advancedSettingsGroup({
      label: 'Setari avansate',
      fields: [
        {
          name: 'overlayOpacity',
          type: 'number',
          label: 'Opacitate overlay (%)',
          min: 0,
          max: 100,
          defaultValue: 50,
        },
        {
          name: 'textAlignment',
          type: 'select',
          label: 'Aliniere text',
          defaultValue: 'center',
          options: [
            { label: 'Centrat', value: 'center' },
            { label: 'Stanga', value: 'left' },
          ],
        },
        {
          name: 'height',
          type: 'select',
          label: 'Inaltime',
          defaultValue: 'fullscreen',
          options: [
            { label: 'Fullscreen (100vh)', value: 'fullscreen' },
            { label: 'Mare (90vh)', value: 'large' },
            { label: 'Medie (70vh)', value: 'medium' },
          ],
        },
        {
          name: 'showScrollIndicator',
          type: 'checkbox',
          label: 'Afiseaza indicator scroll',
          defaultValue: true,
        },
      ],
    }),
  ],
}
