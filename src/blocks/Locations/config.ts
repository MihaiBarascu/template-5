import type { Block } from 'payload'

export const LocationsBlock: Block = {
  slug: 'locations',
  labels: {
    singular: 'Locatii',
    plural: 'Locatii',
  },
  interfaceName: 'LocationsBlock',
  imageURL: '/blocks/locations.svg',
  fields: [
    {
      name: 'variant',
      type: 'select',
      label: 'Varianta',
      defaultValue: 'cards',
      options: [
        { label: 'Carduri', value: 'cards' },
        { label: 'Lista cu harta', value: 'list-map' },
        { label: 'Grid cu imagini', value: 'grid-images' },
        { label: 'Minimal', value: 'minimal' },
      ],
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Titlu sectiune',
      defaultValue: 'Locatiile noastre',
    },
    {
      name: 'subheading',
      type: 'textarea',
      label: 'Subtitlu',
    },
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
          name: 'city',
          type: 'text',
          label: 'Oras',
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Telefon',
        },
        {
          name: 'email',
          type: 'email',
          label: 'Email',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Imagine',
        },
        {
          name: 'schedule',
          type: 'array',
          label: 'Program',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'days',
                  type: 'text',
                  label: 'Zile',
                  admin: { width: '50%' },
                },
                {
                  name: 'hours',
                  type: 'text',
                  label: 'Ore',
                  admin: { width: '50%' },
                },
              ],
            },
          ],
        },
        {
          name: 'googleMapsEmbed',
          type: 'textarea',
          label: 'Google Maps Embed URL',
          admin: {
            description: 'URL iframe din Google Maps',
          },
        },
        {
          name: 'googleMapsLink',
          type: 'text',
          label: 'Link Google Maps',
          admin: {
            description: 'Link direct pentru directii',
          },
        },
        {
          name: 'rating',
          type: 'number',
          label: 'Rating (1-5)',
          min: 1,
          max: 5,
        },
        {
          name: 'ctaButton',
          type: 'group',
          label: 'Buton actiune',
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Text buton',
              defaultValue: 'Programeaza-te',
            },
            {
              name: 'link',
              type: 'text',
              label: 'Link',
            },
          ],
        },
      ],
    },
    {
      name: 'showMap',
      type: 'checkbox',
      label: 'Afiseaza harta generala',
      defaultValue: false,
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'list-map',
      },
    },
    {
      name: 'generalMapEmbed',
      type: 'textarea',
      label: 'Google Maps Embed (toate locatiile)',
      admin: {
        condition: (_, siblingData) =>
          siblingData?.variant === 'list-map' && siblingData?.showMap,
      },
    },
    {
      name: 'showRating',
      type: 'checkbox',
      label: 'Afiseaza rating',
      defaultValue: true,
    },
    {
      name: 'showSchedule',
      type: 'checkbox',
      label: 'Afiseaza program',
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
  ],
}
