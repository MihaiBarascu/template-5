import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '@/access'
import { slugField } from '@/fields/slug'

export const Services: CollectionConfig = {
  slug: 'services',
  labels: {
    singular: 'Serviciu',
    plural: 'Servicii',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'price', 'displayStyle', 'featured', 'order'],
    group: 'Business',
    listSearchableFields: ['title', 'slug', 'shortDescription'],
    description: 'Servicii flexibile cu atribute dinamice și opțiuni avansate',
  },
  fields: [
    // === CÂMPURI DE BAZĂ ===
    {
      name: 'title',
      type: 'text',
      label: 'Denumire serviciu',
      required: true,
      index: true,
    },
    slugField('title'),
    {
      name: 'shortDescription',
      type: 'textarea',
      label: 'Descriere scurtă',
      maxLength: 300,
      admin: {
        description: 'Maxim 2-3 propoziții pentru carduri',
      },
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Descriere detaliată',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Imagine',
          admin: { width: '50%' },
        },
        {
          name: 'icon',
          type: 'text',
          label: 'Icon (Lucide)',
          admin: {
            width: '50%',
            description: 'Ex: Scissors, Heart, Car, Dumbbell, Scale',
          },
        },
      ],
    },

    // === PREȚ ȘI DURATĂ ===
    {
      type: 'row',
      fields: [
        {
          name: 'price',
          type: 'text',
          label: 'Preț',
          admin: {
            width: '50%',
            placeholder: 'Ex: 150 RON, de la 100 RON, gratuit',
            description: 'Prețul serviciului (text flexibil)',
          },
        },
        {
          name: 'duration',
          type: 'text',
          label: 'Durată (opțional)',
          admin: {
            width: '50%',
            placeholder: 'Ex: 60 min, 2-3 ore, la cerere',
            description: 'Completează doar dacă are sens pentru serviciu',
          },
        },
      ],
    },

    // === ATRIBUTE DINAMICE ===
    {
      name: 'attributes',
      type: 'array',
      label: 'Atribute',
      labels: {
        singular: 'Atribut',
        plural: 'Atribute',
      },
      admin: {
        description: 'Atribute suplimentare (Capacitate, Nivel, Calorii, etc.)',
        initCollapsed: true,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Etichetă',
              required: true,
              admin: {
                width: '30%',
                placeholder: 'Ex: Preț, Durată, Locuri',
              },
            },
            {
              name: 'value',
              type: 'text',
              label: 'Valoare',
              required: true,
              admin: {
                width: '40%',
                placeholder: 'Ex: 150 RON, 60 min, 15 persoane',
              },
            },
            {
              name: 'icon',
              type: 'text',
              label: 'Icon',
              admin: {
                width: '30%',
                placeholder: 'Ex: Banknote, Clock, Users',
              },
            },
          ],
        },
      ],
    },

    // === CARACTERISTICI ===
    {
      name: 'features',
      type: 'array',
      label: 'Ce include',
      labels: {
        singular: 'Caracteristică',
        plural: 'Caracteristici',
      },
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'feature',
          type: 'text',
          label: 'Caracteristică',
        },
      ],
    },

    // === OPȚIUNI AVANSATE (clase, tratamente, consultații) ===
    {
      type: 'collapsible',
      label: 'Opțiuni Avansate (Clase, Program, etc.)',
      admin: {
        initCollapsed: true,
        description: 'Câmpuri opționale pentru clase fitness, program săptămânal, etc.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'difficulty',
              type: 'select',
              label: 'Dificultate',
              admin: { width: '33%' },
              options: [
                { label: 'Începător', value: 'beginner' },
                { label: 'Intermediar', value: 'intermediate' },
                { label: 'Avansat', value: 'advanced' },
                { label: 'Toate nivelurile', value: 'all-levels' },
              ],
            },
            {
              name: 'capacity',
              type: 'number',
              label: 'Capacitate persoane',
              admin: { width: '33%' },
            },
            {
              name: 'durationMinutes',
              type: 'number',
              label: 'Durată (minute)',
              min: 5,
              max: 480,
              admin: { width: '33%' },
            },
          ],
        },
        {
          name: 'schedule',
          type: 'array',
          label: 'Program săptămânal',
          labels: {
            singular: 'Ședință',
            plural: 'Ședințe',
          },
          admin: {
            description: 'Program pentru clase, consultații programate',
            initCollapsed: true,
          },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'day',
                  type: 'select',
                  label: 'Zi',
                  required: true,
                  admin: { width: '25%' },
                  options: [
                    { label: 'Luni', value: 'monday' },
                    { label: 'Marți', value: 'tuesday' },
                    { label: 'Miercuri', value: 'wednesday' },
                    { label: 'Joi', value: 'thursday' },
                    { label: 'Vineri', value: 'friday' },
                    { label: 'Sâmbătă', value: 'saturday' },
                    { label: 'Duminică', value: 'sunday' },
                  ],
                },
                {
                  name: 'startTime',
                  type: 'text',
                  label: 'Ora început',
                  required: true,
                  admin: { width: '25%', placeholder: '18:00' },
                },
                {
                  name: 'endTime',
                  type: 'text',
                  label: 'Ora sfârșit',
                  admin: { width: '25%', placeholder: '19:00' },
                },
                {
                  name: 'room',
                  type: 'text',
                  label: 'Sală / Cabinet',
                  admin: { width: '25%' },
                },
              ],
            },
          ],
        },
      ],
    },

    // === SIDEBAR ===
    {
      name: 'displayStyle',
      type: 'select',
      label: 'Stil afișare',
      defaultValue: 'card',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Cum se afișează pe site',
      },
      options: [
        { label: 'Card standard', value: 'card' },
        { label: 'Card cu imagine', value: 'card-image' },
        { label: 'Listă simplă', value: 'list' },
        { label: 'Card pricing', value: 'pricing' },
        { label: 'Card detaliat', value: 'detailed' },
        { label: 'Item meniu', value: 'menu-item' },
      ],
    },
    {
      name: 'assignedTeamMember',
      type: 'relationship',
      relationTo: 'team',
      label: 'Responsabil',
      admin: {
        position: 'sidebar',
        description: 'Instructor, medic, avocat responsabil',
      },
    },
    {
      name: 'ctaLabel',
      type: 'text',
      label: 'Text buton CTA',
      admin: {
        position: 'sidebar',
        description: 'Ex: "Rezervă", "Programează-te"',
      },
    },
    {
      name: 'ctaLink',
      type: 'text',
      label: 'Link buton CTA',
      defaultValue: '/contact',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'backLabel',
      type: 'text',
      label: 'Text link înapoi',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'backLink',
      type: 'text',
      label: 'Link înapoi',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Serviciu popular',
      defaultValue: false,
      index: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      label: 'Activ',
      defaultValue: true,
      index: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Ordine afișare',
      defaultValue: 0,
      index: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
  defaultSort: 'order',
}
