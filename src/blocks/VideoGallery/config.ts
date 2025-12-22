import type { Block } from 'payload'
import { sectionWrapperFields } from '../_shared/sectionWrapperFields'

export const VideoGalleryBlock: Block = {
  slug: 'videoGallery',
  interfaceName: 'VideoGalleryBlock',
  labels: {
    singular: 'Video Gallery',
    plural: 'Video Galleries',
  },
  imageURL: '/blocks/video.svg',
  fields: [
    {
      name: 'variant',
      type: 'select',
      label: 'Varianta',
      defaultValue: 'grid-3',
      options: [
        { label: 'Grid 2 coloane', value: 'grid-2' },
        { label: 'Grid 3 coloane', value: 'grid-3' },
        { label: 'Grid 4 coloane', value: 'grid-4' },
        { label: 'Featured (1 mare + 2 mici)', value: 'featured' },
        { label: 'Carousel', value: 'carousel' },
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
      name: 'videos',
      type: 'array',
      label: 'Video-uri',
      minRows: 1,
      fields: [
        {
          name: 'source',
          type: 'select',
          label: 'Sursa video',
          defaultValue: 'youtube',
          options: [
            { label: 'YouTube', value: 'youtube' },
            { label: 'Vimeo', value: 'vimeo' },
          ],
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
            description: 'Optional - daca nu e setat, se foloseste thumbnail-ul de pe YouTube/Vimeo',
          },
        },
        {
          name: 'title',
          type: 'text',
          label: 'Titlu video',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Descriere',
          admin: {
            rows: 2,
          },
        },
        {
          name: 'duration',
          type: 'text',
          label: 'Durata',
          admin: {
            description: 'Ex: 5:30, 12:45',
          },
        },
        {
          name: 'category',
          type: 'text',
          label: 'Categorie',
          admin: {
            description: 'Pentru filtrare (ex: Terapie Bowen, Access Bars)',
          },
        },
      ],
    },
    {
      name: 'showTitles',
      type: 'checkbox',
      label: 'Afiseaza titlurile',
      defaultValue: true,
    },
    {
      name: 'showDuration',
      type: 'checkbox',
      label: 'Afiseaza durata',
      defaultValue: true,
    },
    {
      name: 'showCategories',
      type: 'checkbox',
      label: 'Afiseaza categoriile (filtru)',
      defaultValue: false,
    },
    {
      name: 'aspectRatio',
      type: 'select',
      label: 'Raport aspect thumbnail',
      defaultValue: '16-9',
      options: [
        { label: '16:9 (Standard)', value: '16-9' },
        { label: '4:3', value: '4-3' },
        { label: '1:1 (Patrat)', value: '1-1' },
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
        { label: 'Primary', value: 'primary' },
      ],
    },
    // Section wrapper fields for advanced layout options
    ...sectionWrapperFields,
  ],
}
