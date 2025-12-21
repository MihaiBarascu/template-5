import type { Block } from 'payload'

export const VideoHeroBlock: Block = {
  slug: 'video-hero',
  interfaceName: 'VideoHeroBlock',
  labels: {
    singular: 'Video Hero (Premium)',
    plural: 'Video Hero',
  },
  imageURL: '/blocks/video-hero.svg',
  fields: [
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
        description: 'YouTube, Vimeo sau link direct la fisier .mp4',
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
      admin: {
        description: 'Se afiseaza pana se incarca videoul sau pe dispozitive care nu suporta autoplay',
      },
    },
    {
      name: 'overlayColor',
      type: 'text',
      label: 'Culoare overlay',
      defaultValue: 'rgba(2, 40, 61, 0.5)',
      admin: {
        description: 'Culoarea suprapusa peste video (rgba format recomandat)',
      },
    },
    {
      name: 'overlayOpacity',
      type: 'number',
      label: 'Opacitate overlay (%)',
      min: 0,
      max: 100,
      defaultValue: 50,
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
      name: 'ctaButtons',
      type: 'array',
      label: 'Butoane CTA',
      maxRows: 3,
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
            { label: 'Primary (plin)', value: 'primary' },
            { label: 'Secondary (outline)', value: 'secondary' },
            { label: 'Accent (glow)', value: 'accent' },
            { label: 'Ghost (transparent)', value: 'ghost' },
          ],
        },
        {
          name: 'pillShape',
          type: 'checkbox',
          label: 'Forma pill (rotunjit)',
          defaultValue: true,
        },
      ],
    },
    {
      name: 'trustBadges',
      type: 'array',
      label: 'Trust Badges (imagini)',
      admin: {
        description: 'Imagini de incredere (certificari, garantii, parteneri, etc.) - ex: Money-back guarantee, Patent',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'alt',
          type: 'text',
          label: 'Text alternativ',
        },
        {
          name: 'link',
          type: 'text',
          label: 'Link (optional)',
        },
      ],
    },
    {
      name: 'trustBadgesPosition',
      type: 'select',
      label: 'Poziție trust badges',
      defaultValue: 'below',
      options: [
        { label: 'Sub text (recomandat)', value: 'below' },
        { label: 'Deasupra titlului', value: 'above' },
      ],
      admin: {
        condition: (_, siblingData) => siblingData?.trustBadges && siblingData.trustBadges.length > 0,
        description: 'Plasturi style: sub textul principal cu badge-uri de garantie',
      },
    },
    {
      name: 'showSocialLinks',
      type: 'checkbox',
      label: 'Afiseaza link-uri social',
      defaultValue: false,
      admin: {
        description: 'Preia din BusinessInfo',
      },
    },
    {
      name: 'textAlignment',
      type: 'select',
      label: 'Aliniere text',
      defaultValue: 'center',
      options: [
        { label: 'Centrat', value: 'center' },
        { label: 'Stanga', value: 'left' },
        { label: 'Dreapta', value: 'right' },
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
        { label: 'Mica (50vh)', value: 'small' },
      ],
    },
    {
      name: 'showScrollIndicator',
      type: 'checkbox',
      label: 'Afiseaza indicator scroll',
      defaultValue: true,
    },
  ],
}
