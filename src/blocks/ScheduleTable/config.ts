import type { Block } from 'payload'
import { sectionWrapperFields } from '../_shared/sectionWrapperFields'
import { headingFields, ctaButtonFields, displayOptionsGroup, advancedSettingsGroup } from '../_shared/commonFields'

export const ScheduleTableBlock: Block = {
  slug: 'scheduleTable',
  interfaceName: 'ScheduleTableBlock',
  labels: {
    singular: 'Tabel Program Clase',
    plural: 'Tabel Program Clase',
  },
  imageURL: '/blocks/schedule-table.svg',
  fields: [
    // === ESSENTIAL FIELDS ===
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
    ...headingFields(),
    {
      name: 'source',
      type: 'select',
      label: 'Sursa date',
      defaultValue: 'collection',
      options: [
        { label: 'Din colectia Clase (automat)', value: 'collection' },
        { label: 'Custom entries', value: 'custom' },
      ],
    },
    {
      name: 'filterByCategory',
      type: 'select',
      label: 'Filtreaza dupa categorie',
      defaultValue: 'all',
      options: [
        { label: 'Toate', value: 'all' },
        { label: 'Cardio', value: 'cardio' },
        { label: 'Forta', value: 'strength' },
        { label: 'Flexibilitate', value: 'flexibility' },
        { label: 'Mind & Body', value: 'mind-body' },
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
          label: 'Zi',
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
          label: 'Ora start',
          required: true,
          admin: { placeholder: '09:00' },
        },
        {
          name: 'title',
          type: 'text',
          label: 'Clasa',
          required: true,
        },
        {
          name: 'trainer',
          type: 'text',
          label: 'Antrenor',
        },
      ],
    },
    // === DISPLAY OPTIONS (collapsible) ===
    displayOptionsGroup({
      label: 'Optiuni afisare',
      collapsed: true,
      fields: [
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
      ],
    }),
    // CTA Button
    ctaButtonFields({ defaultLabel: 'Inscrie-te acum' }),
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
      ],
    }),
    // Section wrapper fields
    ...sectionWrapperFields,
  ],
}
