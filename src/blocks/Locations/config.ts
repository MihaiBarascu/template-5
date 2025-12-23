import type { Block } from 'payload'
import { sectionWrapperFields } from '../_shared/sectionWrapperFields'
import { headingFields, displayOptionsGroup, advancedSettingsGroup } from '../_shared/commonFields'

export const LocationsBlock: Block = {
  slug: 'locations',
  labels: {
    singular: 'Locatii',
    plural: 'Locatii',
  },
  interfaceName: 'LocationsBlock',
  imageURL: '/blocks/locations.svg',
  fields: [
    // === ESSENTIAL FIELDS ===
    {
      name: 'variant',
      type: 'select',
      label: 'Varianta',
      defaultValue: 'cards',
      options: [
        { label: 'Carduri', value: 'cards' },
        { label: 'Lista cu harta', value: 'list-map' },
        { label: 'Grid cu imagini', value: 'grid-images' },
      ],
    },
    ...headingFields(),
    {
      name: 'locations',
      type: 'array',
      label: 'Locatii',
      required: true,
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Denumire locatie',
          required: true,
        },
        {
          name: 'address',
          type: 'text',
          label: 'Adresa',
          required: true,
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Telefon',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Imagine',
        },
        {
          name: 'googleMapsLink',
          type: 'text',
          label: 'Link Google Maps',
        },
      ],
    },
    // === DISPLAY OPTIONS (collapsible) ===
    displayOptionsGroup({
      label: 'Optiuni afisare',
      collapsed: true,
      fields: [
        {
          name: 'showSchedule',
          type: 'checkbox',
          label: 'Afiseaza program',
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
