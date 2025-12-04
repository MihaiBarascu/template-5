import type { Block } from 'payload'

export const ContactBlock: Block = {
  slug: 'contact',
  labels: {
    singular: 'Contact',
    plural: 'Contact',
  },
  imageURL: '/blocks/contact.svg',
  fields: [
    {
      name: 'variant',
      type: 'select',
      label: 'Varianta',
      defaultValue: 'split',
      options: [
        { label: 'Split (formular + info)', value: 'split' },
        { label: 'Centrat', value: 'centered' },
        { label: 'Cu harta', value: 'with-map' },
        { label: 'Full width', value: 'full-width' },
        { label: 'Minimal (doar info)', value: 'minimal' },
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
    {
      name: 'showForm',
      type: 'checkbox',
      label: 'Afiseaza formular',
      defaultValue: true,
    },
    {
      name: 'formFields',
      type: 'group',
      label: 'Campuri formular',
      admin: {
        condition: (_, siblingData) => siblingData?.showForm,
      },
      fields: [
        {
          name: 'showName',
          type: 'checkbox',
          label: 'Nume',
          defaultValue: true,
        },
        {
          name: 'showEmail',
          type: 'checkbox',
          label: 'Email',
          defaultValue: true,
        },
        {
          name: 'showPhone',
          type: 'checkbox',
          label: 'Telefon',
          defaultValue: true,
        },
        {
          name: 'showSubject',
          type: 'checkbox',
          label: 'Subiect',
          defaultValue: false,
        },
        {
          name: 'showService',
          type: 'checkbox',
          label: 'Selectie serviciu',
          defaultValue: false,
        },
        {
          name: 'showMessage',
          type: 'checkbox',
          label: 'Mesaj',
          defaultValue: true,
        },
      ],
    },
    {
      name: 'submitButtonText',
      type: 'text',
      label: 'Text buton trimitere',
      defaultValue: 'Trimite mesajul',
      admin: {
        condition: (_, siblingData) => siblingData?.showForm,
      },
    },
    {
      name: 'successMessage',
      type: 'textarea',
      label: 'Mesaj de succes',
      defaultValue: 'Multumim! Mesajul tau a fost trimis cu succes. Te vom contacta in cel mai scurt timp.',
      admin: {
        condition: (_, siblingData) => siblingData?.showForm,
      },
    },
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
    {
      name: 'backgroundColor',
      type: 'select',
      label: 'Culoare fundal',
      defaultValue: 'light',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
      ],
    },
  ],
}
