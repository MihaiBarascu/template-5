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
      name: 'variant',
      type: 'select',
      label: 'Varianta layout',
      defaultValue: 'default',
      options: [
        { label: 'Default (un mesaj central)', value: 'default' },
        { label: 'Split (2 coloane egale)', value: 'split' },
        { label: 'Centered (minimal, titlu mare)', value: 'centered' },
        { label: 'Carousel (slideshow content)', value: 'carousel' },
      ],
      admin: {
        description: 'Split: 2 oferte egale | Carousel: slideshow de mesaje pe acelasi video',
      },
    },
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
    // ===== CÂMPURI PENTRU DEFAULT/CENTERED =====
    {
      name: 'headline',
      type: 'text',
      label: 'Titlu principal',
      required: true,
      admin: {
        condition: (_, siblingData) => siblingData?.variant !== 'split' && siblingData?.variant !== 'carousel',
      },
    },
    {
      name: 'subheadline',
      type: 'textarea',
      label: 'Subtitlu',
      admin: {
        condition: (_, siblingData) => siblingData?.variant !== 'split' && siblingData?.variant !== 'carousel',
      },
    },
    {
      name: 'ctaButtons',
      type: 'array',
      label: 'Butoane CTA',
      maxRows: 3,
      admin: {
        condition: (_, siblingData) => siblingData?.variant !== 'split' && siblingData?.variant !== 'carousel',
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

    // ===== CÂMPURI PENTRU SPLIT VARIANT =====
    {
      name: 'splitTagline',
      type: 'text',
      label: 'Tagline central (opțional)',
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'split',
        description: 'Text mic deasupra coloanelor, ex: "Revital Harmony" sau "Vindecă · Învață · Transformă"',
      },
    },
    {
      name: 'splitColumns',
      type: 'array',
      label: 'Coloane Split',
      minRows: 2,
      maxRows: 2,
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'split',
        description: 'Exact 2 coloane pentru varianta split',
      },
      fields: [
        {
          name: 'headline',
          type: 'text',
          label: 'Titlu coloană',
          required: true,
        },
        {
          name: 'subheadline',
          type: 'textarea',
          label: 'Descriere scurtă',
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
              label: 'Forma pill',
              defaultValue: true,
            },
          ],
        },
      ],
    },
    {
      name: 'splitDivider',
      type: 'checkbox',
      label: 'Afișează linie separatoare între coloane',
      defaultValue: true,
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'split',
      },
    },

    // ===== CÂMPURI PENTRU CAROUSEL VARIANT =====
    {
      name: 'carouselSlides',
      type: 'array',
      label: 'Slide-uri Carousel',
      minRows: 2,
      maxRows: 6,
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'carousel',
        description: 'Minim 2 slide-uri, maxim 6. Fiecare slide are titlu, descriere și butoane.',
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
          label: 'Descriere',
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
      ],
    },
    {
      name: 'carouselAutoplay',
      type: 'checkbox',
      label: 'Autoplay',
      defaultValue: true,
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'carousel',
        description: 'Schimbă automat slide-urile',
      },
    },
    {
      name: 'carouselSpeed',
      type: 'number',
      label: 'Viteza autoplay (ms)',
      defaultValue: 6000,
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'carousel',
        description: 'Interval între slide-uri în milisecunde (6000 = 6 secunde)',
      },
    },
    {
      name: 'carouselShowNavigation',
      type: 'checkbox',
      label: 'Afișează săgeți navigare (← →)',
      defaultValue: true,
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'carousel',
        description: 'Butoanele stânga/dreapta pentru schimbarea manuală a slide-urilor',
      },
    },
    {
      name: 'carouselShowDots',
      type: 'checkbox',
      label: 'Afișează indicatori dots (● ○ ○)',
      defaultValue: true,
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'carousel',
        description: 'Cercurile de jos care arată slide-ul activ și permit navigarea directă',
      },
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
