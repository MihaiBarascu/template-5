import type { Block } from 'payload'

export const BookingBlock: Block = {
  slug: 'booking',
  labels: {
    singular: 'Programare',
    plural: 'Programare',
  },
  imageURL: '/blocks/booking.svg',
  fields: [
    {
      name: 'variant',
      type: 'select',
      label: 'Varianta',
      defaultValue: 'standard',
      options: [
        { label: 'Standard', value: 'standard' },
        { label: 'Cu selectie serviciu', value: 'with-service' },
        { label: 'Cu selectie persoana', value: 'with-person' },
        { label: 'Complet (serviciu + persoana)', value: 'full' },
        { label: 'Minimal', value: 'minimal' },
      ],
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Titlu sectiune',
      defaultValue: 'Programeaza-te online',
    },
    {
      name: 'subheading',
      type: 'textarea',
      label: 'Subtitlu sectiune',
    },
    {
      name: 'showServiceSelection',
      type: 'checkbox',
      label: 'Selectie serviciu',
      defaultValue: true,
    },
    {
      name: 'showTeamSelection',
      type: 'checkbox',
      label: 'Selectie persoana',
      defaultValue: false,
    },
    {
      name: 'showDatePicker',
      type: 'checkbox',
      label: 'Selectie data',
      defaultValue: true,
    },
    {
      name: 'showTimePicker',
      type: 'checkbox',
      label: 'Selectie ora',
      defaultValue: true,
    },
    {
      name: 'requiredFields',
      type: 'group',
      label: 'Campuri obligatorii',
      fields: [
        {
          name: 'name',
          type: 'checkbox',
          label: 'Nume',
          defaultValue: true,
        },
        {
          name: 'email',
          type: 'checkbox',
          label: 'Email',
          defaultValue: true,
        },
        {
          name: 'phone',
          type: 'checkbox',
          label: 'Telefon',
          defaultValue: true,
        },
        {
          name: 'notes',
          type: 'checkbox',
          label: 'Observatii',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'submitButtonText',
      type: 'text',
      label: 'Text buton',
      defaultValue: 'Programeaza-te',
    },
    {
      name: 'successMessage',
      type: 'textarea',
      label: 'Mesaj de succes',
      defaultValue: 'Programarea ta a fost trimisa cu succes! Te vom contacta pentru confirmare.',
    },
    {
      name: 'showWhatsappOption',
      type: 'checkbox',
      label: 'Afiseaza optiunea WhatsApp',
      defaultValue: true,
    },
    {
      name: 'showPhoneOption',
      type: 'checkbox',
      label: 'Afiseaza optiunea telefon',
      defaultValue: true,
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
        { label: 'Primary', value: 'primary' },
      ],
    },
  ],
}
