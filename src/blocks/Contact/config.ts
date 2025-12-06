import type { Block } from 'payload'

export const ContactBlock: Block = {
  slug: 'contact',
  labels: {
    singular: 'Contact Info',
    plural: 'Contact Info',
  },
  imageURL: '/blocks/contact.svg',
  fields: [
    {
      name: 'variant',
      type: 'select',
      label: 'Varianta',
      defaultValue: 'split',
      options: [
        { label: 'Split (2 coloane)', value: 'split' },
        { label: 'Centrat', value: 'centered' },
        { label: 'Cu harta', value: 'with-map' },
        { label: 'Full width', value: 'full-width' },
        { label: 'Minimal', value: 'minimal' },
        { label: 'Carduri contact', value: 'cards' },
      ],
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Titlu sectiune',
      defaultValue: 'Contacteaza-ne',
    },
    {
      name: 'subheading',
      type: 'textarea',
      label: 'Subtitlu sectiune',
    },
    // Contact info display options
    {
      name: 'showContactInfo',
      type: 'checkbox',
      label: 'Afiseaza informatii contact',
      defaultValue: true,
    },
    {
      name: 'contactInfoItems',
      type: 'group',
      label: 'Informatii afisate',
      admin: {
        condition: (_, siblingData) => siblingData?.showContactInfo,
      },
      fields: [
        {
          name: 'showAddress',
          type: 'checkbox',
          label: 'Adresa',
          defaultValue: true,
        },
        {
          name: 'showPhone',
          type: 'checkbox',
          label: 'Telefon',
          defaultValue: true,
        },
        {
          name: 'showEmail',
          type: 'checkbox',
          label: 'Email',
          defaultValue: true,
        },
        {
          name: 'showWorkingHours',
          type: 'checkbox',
          label: 'Program',
          defaultValue: true,
        },
        {
          name: 'showSocial',
          type: 'checkbox',
          label: 'Social media',
          defaultValue: false,
        },
      ],
    },
    // Map options
    {
      name: 'showMap',
      type: 'checkbox',
      label: 'Afiseaza harta',
      defaultValue: false,
    },
    {
      name: 'mapPosition',
      type: 'select',
      label: 'Pozitie harta',
      defaultValue: 'bottom',
      admin: {
        condition: (_, siblingData) => siblingData?.showMap,
      },
      options: [
        { label: 'Deasupra', value: 'top' },
        { label: 'Dedesubt', value: 'bottom' },
        { label: 'Lateral', value: 'side' },
      ],
    },
    // Background
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
    // Labels for i18n
    {
      name: 'labels',
      type: 'group',
      label: 'Text Labels (i18n)',
      admin: {
        description: 'Personalizare text pentru diferite limbi',
      },
      fields: [
        {
          name: 'contactInfoTitle',
          type: 'text',
          label: 'Titlu informatii contact',
          defaultValue: 'Informatii de contact',
        },
        {
          name: 'addressLabel',
          type: 'text',
          label: 'Label adresa',
          defaultValue: 'Adresa',
        },
        {
          name: 'phoneLabel',
          type: 'text',
          label: 'Label telefon',
          defaultValue: 'Telefon',
        },
        {
          name: 'emailLabel',
          type: 'text',
          label: 'Label email',
          defaultValue: 'Email',
        },
        {
          name: 'scheduleLabel',
          type: 'text',
          label: 'Label program',
          defaultValue: 'Program',
        },
        {
          name: 'socialLabel',
          type: 'text',
          label: 'Label social media',
          defaultValue: 'Social Media',
        },
      ],
    },
  ],
}
