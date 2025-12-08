import type { Block } from 'payload'

export const TeamBlock: Block = {
  slug: 'team',
  interfaceName: 'TeamBlock',
  labels: {
    singular: 'Echipa',
    plural: 'Echipa',
  },
  imageURL: '/blocks/team.svg',
  fields: [
    {
      name: 'variant',
      type: 'select',
      label: 'Varianta',
      defaultValue: 'grid',
      options: [
        { label: 'Grid carduri', value: 'grid' },
        { label: 'Grid centrat', value: 'grid-centered' },
        { label: 'Carousel', value: 'carousel' },
        { label: 'Lista', value: 'list' },
        { label: 'Un membru featured + restul', value: 'featured' },
        { label: 'Cu modal la click', value: 'with-modal' },
      ],
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Titlu sectiune',
      defaultValue: 'Echipa noastra',
    },
    {
      name: 'subheading',
      type: 'textarea',
      label: 'Subtitlu sectiune',
    },
    {
      name: 'source',
      type: 'select',
      label: 'Sursa date',
      defaultValue: 'collection',
      options: [
        { label: 'Din colectia Echipa', value: 'collection' },
        { label: 'Selectie manuala', value: 'manual' },
      ],
    },
    {
      name: 'selectedMembers',
      type: 'relationship',
      relationTo: 'team',
      hasMany: true,
      label: 'Membri selectati',
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'manual',
      },
    },
    {
      name: 'limit',
      type: 'number',
      label: 'Numar maxim',
      defaultValue: 4,
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'collection',
      },
    },
    {
      name: 'onlyFeatured',
      type: 'checkbox',
      label: 'Doar membri featured',
      defaultValue: false,
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'collection',
      },
    },
    {
      name: 'showRole',
      type: 'checkbox',
      label: 'Afiseaza functia',
      defaultValue: true,
    },
    {
      name: 'showBio',
      type: 'checkbox',
      label: 'Afiseaza biografie',
      defaultValue: false,
    },
    {
      name: 'showSocial',
      type: 'checkbox',
      label: 'Afiseaza social media',
      defaultValue: true,
    },
    {
      name: 'showContact',
      type: 'checkbox',
      label: 'Afiseaza contact',
      defaultValue: false,
    },
    {
      name: 'detailBasePath',
      type: 'text',
      label: 'Cale de baza pentru detalii',
      admin: {
        description: 'Ex: /echipa - cardurile vor deveni clickable si vor duce la /echipa/slug-membru',
      },
    },
    {
      name: 'columns',
      type: 'select',
      label: 'Coloane',
      defaultValue: '4',
      options: [
        { label: '2 coloane', value: '2' },
        { label: '3 coloane', value: '3' },
        { label: '4 coloane', value: '4' },
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
  ],
}
