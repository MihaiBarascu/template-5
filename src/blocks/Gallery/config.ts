import type { Block } from 'payload'
import { sectionWrapperFields } from '../_shared/sectionWrapperFields'

export const GalleryBlock: Block = {
  slug: 'gallery',
  interfaceName: 'GalleryBlock',
  labels: {
    singular: 'Galerie',
    plural: 'Galerie',
  },
  imageURL: '/blocks/gallery.svg',
  fields: [
    {
      name: 'variant',
      type: 'select',
      label: 'Varianta',
      defaultValue: 'grid-3',
      options: [
        { label: 'Grid 3 coloane', value: 'grid-3' },
        { label: 'Grid 4 coloane', value: 'grid-4' },
        { label: 'Masonry', value: 'masonry' },
        { label: 'Carousel', value: 'carousel' },
        { label: 'Cu lightbox', value: 'lightbox' },
        { label: 'Stil Instagram', value: 'instagram' },
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
      name: 'source',
      type: 'select',
      label: 'Sursa imagini',
      defaultValue: 'custom',
      options: [
        { label: 'Manual (selectate mai jos)', value: 'custom' },
        { label: 'Din Portofoliu', value: 'portfolio' },
      ],
    },
    {
      name: 'limit',
      type: 'number',
      label: 'Numar maxim imagini',
      defaultValue: 12,
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'portfolio',
      },
    },
    {
      name: 'images',
      type: 'array',
      label: 'Imagini',
      admin: {
        condition: (_, siblingData) => siblingData?.source !== 'portfolio',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
          label: 'Descriere',
        },
        {
          name: 'category',
          type: 'text',
          label: 'Categorie',
          admin: {
            description: 'Ex: Tunsori, Barba, Colorare (pentru filtrare)',
          },
        },
      ],
    },
    {
      name: 'showCaptions',
      type: 'checkbox',
      label: 'Afiseaza descrieri',
      defaultValue: false,
    },
    {
      name: 'aspectRatio',
      type: 'select',
      label: 'Raport aspect',
      defaultValue: 'auto',
      options: [
        { label: 'Auto', value: 'auto' },
        { label: '1:1 (Patrat)', value: 'square' },
        { label: '4:3', value: '4-3' },
        { label: '16:9', value: '16-9' },
        { label: '3:2', value: '3-2' },
      ],
    },
    {
      name: 'gap',
      type: 'select',
      label: 'Spatiere',
      defaultValue: 'medium',
      options: [
        { label: 'Fara', value: 'none' },
        { label: 'Mica', value: 'small' },
        { label: 'Medie', value: 'medium' },
        { label: 'Mare', value: 'large' },
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
    // Configurable labels for i18n
    {
      name: 'labels',
      type: 'group',
      label: 'Text Labels (i18n)',
      admin: {
        description: 'Customize text labels for different languages',
      },
      fields: [
        {
          name: 'allFilter',
          type: 'text',
          label: 'All Filter Button',
          defaultValue: 'Toate',
        },
      ],
    },
    // Section wrapper fields for advanced layout options
    ...sectionWrapperFields,
  ],
}
