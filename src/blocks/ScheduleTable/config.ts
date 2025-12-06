import type { Block } from 'payload'

export const ScheduleTableBlock: Block = {
  slug: 'scheduleTable',
  labels: {
    singular: 'Tabel Program Clase',
    plural: 'Tabel Program Clase',
  },
  imageURL: '/blocks/schedule-table.svg',
  fields: [
    {
      name: 'variant',
      type: 'select',
      label: 'Varianta',
      defaultValue: 'table-week',
      options: [
        { label: 'Tabel saptamanal', value: 'table-week' },
        { label: 'Lista pe zile', value: 'list-days' },
        { label: 'Cards pe zile', value: 'cards-days' },
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
      label: 'Sursa date',
      defaultValue: 'collection',
      options: [
        { label: 'Din colectia Clase', value: 'collection' },
        { label: 'Custom entries', value: 'custom' },
      ],
    },
    {
      name: 'filterByCategory',
      type: 'select',
      label: 'Filtreaza dupa categorie',
      options: [
        { label: 'Toate', value: 'all' },
        { label: 'Cardio', value: 'cardio' },
        { label: 'Forta', value: 'strength' },
        { label: 'Flexibilitate', value: 'flexibility' },
        { label: 'Mind & Body', value: 'mind-body' },
        { label: 'Combat', value: 'combat' },
        { label: 'Dans', value: 'dance' },
        { label: 'HIIT', value: 'hiit' },
      ],
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'collection',
      },
    },
    {
      name: 'customSchedule',
      type: 'array',
      label: 'Program personalizat',
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'custom',
      },
      fields: [
        {
          name: 'day',
          type: 'select',
          required: true,
          options: [
            { label: 'Luni', value: 'monday' },
            { label: 'Marti', value: 'tuesday' },
            { label: 'Miercuri', value: 'wednesday' },
            { label: 'Joi', value: 'thursday' },
            { label: 'Vineri', value: 'friday' },
            { label: 'Sambata', value: 'saturday' },
            { label: 'Duminica', value: 'sunday' },
          ],
        },
        {
          name: 'startTime',
          type: 'text',
          required: true,
          admin: { placeholder: '09:00' },
        },
        {
          name: 'endTime',
          type: 'text',
          admin: { placeholder: '10:00' },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'trainer',
          type: 'text',
        },
        {
          name: 'room',
          type: 'text',
          admin: { placeholder: 'Sala 1' },
        },
        {
          name: 'color',
          type: 'select',
          defaultValue: 'primary',
          options: [
            { label: 'Primary', value: 'primary' },
            { label: 'Orange', value: 'orange' },
            { label: 'Blue', value: 'blue' },
            { label: 'Green', value: 'green' },
            { label: 'Purple', value: 'purple' },
          ],
        },
      ],
    },
    {
      name: 'showTrainer',
      type: 'checkbox',
      label: 'Afiseaza antrenor',
      defaultValue: true,
    },
    {
      name: 'showDuration',
      type: 'checkbox',
      label: 'Afiseaza durata',
      defaultValue: true,
    },
    {
      name: 'showRoom',
      type: 'checkbox',
      label: 'Afiseaza sala/locatie',
      defaultValue: false,
    },
    {
      name: 'showCategoryFilter',
      type: 'checkbox',
      label: 'Afiseaza filtre categorie',
      defaultValue: true,
    },
    {
      name: 'highlightToday',
      type: 'checkbox',
      label: 'Evidentiaza ziua curenta',
      defaultValue: true,
    },
    {
      name: 'startHour',
      type: 'number',
      label: 'Ora inceput (pentru tabel)',
      defaultValue: 7,
      min: 0,
      max: 23,
    },
    {
      name: 'endHour',
      type: 'number',
      label: 'Ora sfarsit (pentru tabel)',
      defaultValue: 22,
      min: 1,
      max: 24,
    },
    {
      name: 'ctaButton',
      type: 'group',
      label: 'Buton CTA',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Afiseaza buton',
          defaultValue: false,
        },
        {
          name: 'label',
          type: 'text',
          label: 'Text',
          defaultValue: 'Inscrie-te acum',
        },
        {
          name: 'link',
          type: 'text',
          label: 'Link',
          defaultValue: '/contact',
        },
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
        {
          name: 'todayBadge',
          type: 'text',
          label: 'Today Badge',
          defaultValue: 'Astazi',
        },
        {
          name: 'noClasses',
          type: 'text',
          label: 'No Classes Message',
          defaultValue: 'Fara clase',
        },
        {
          name: 'detailsButton',
          type: 'text',
          label: 'Details Button',
          defaultValue: 'Detalii',
        },
        {
          name: 'timeHeader',
          type: 'text',
          label: 'Time Column Header',
          defaultValue: 'Ora',
        },
        {
          name: 'dayLabels',
          type: 'json',
          label: 'Day Labels (JSON)',
          defaultValue: {
            monday: 'Luni',
            tuesday: 'Marti',
            wednesday: 'Miercuri',
            thursday: 'Joi',
            friday: 'Vineri',
            saturday: 'Sambata',
            sunday: 'Duminica',
          },
          admin: {
            description: 'JSON object with day translations: { "monday": "Luni", ... }',
          },
        },
      ],
    },
  ],
}
