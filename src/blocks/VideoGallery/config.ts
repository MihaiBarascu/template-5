import type { Block } from 'payload'
import { sectionWrapperFields } from '../_shared/sectionWrapperFields'
import { headingFields, displayOptionsGroup, advancedSettingsGroup } from '../_shared/commonFields'

export const VideoGalleryBlock: Block = {
  slug: 'videoGallery',
  interfaceName: 'VideoGalleryBlock',
  labels: {
    singular: 'Video Gallery',
    plural: 'Video Galleries',
  },
  imageURL: '/blocks/video.svg',
  fields: [
    // === ESSENTIAL FIELDS ===
    {
      name: 'variant',
      type: 'select',
      label: 'Varianta',
      defaultValue: 'grid-3',
      options: [
        { label: 'Grid 2 coloane', value: 'grid-2' },
        { label: 'Grid 3 coloane', value: 'grid-3' },
        { label: 'Carousel', value: 'carousel' },
        { label: 'Featured (video mare + lista)', value: 'featured' },
      ],
    },
    ...headingFields(),
    {
      name: 'videos',
      type: 'array',
      label: 'Video-uri',
      minRows: 1,
      fields: [
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
          name: 'title',
          type: 'text',
          label: 'Titlu video',
        },
        {
          name: 'thumbnail',
          type: 'upload',
          relationTo: 'media',
          label: 'Thumbnail custom',
        },
      ],
    },
    // === DISPLAY OPTIONS (collapsible) ===
    displayOptionsGroup({
      label: 'Optiuni afisare',
      collapsed: true,
      fields: [
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
      ],
    }),
    // === ADVANCED SETTINGS (collapsible) ===
    advancedSettingsGroup({
      label: 'Setari avansate',
      fields: [
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
