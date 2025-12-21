import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '@/access'
import { slugField } from '@/fields/slug'
import {
  revalidateServiceCategoryAfterChange,
  revalidateServiceCategoryAfterDelete,
} from '@/hooks/revalidateServiceCategory'

export const ServiceCategories: CollectionConfig = {
  slug: 'service-categories',
  labels: {
    singular: 'Categorie Servicii',
    plural: 'Categorii Servicii',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'order'],
    group: 'Business',
    description: 'Categorii pentru organizarea serviciilor (ex: Terapii, Cursuri, Clase)',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Denumire categorie',
      required: true,
      index: true,
    },
    slugField('title'),
    {
      name: 'description',
      type: 'textarea',
      label: 'Descriere',
      admin: {
        description: 'Descriere scurtă a categoriei (opțional)',
      },
    },
    {
      name: 'icon',
      type: 'text',
      label: 'Icon (Lucide)',
      admin: {
        description: 'Numele iconului Lucide (ex: Heart, GraduationCap, Dumbbell)',
      },
    },
    // Join field for reverse relationship - shows services in this category
    {
      name: 'services',
      type: 'join',
      collection: 'services',
      on: 'category',
      label: 'Servicii în această categorie',
      admin: {
        description: 'Lista serviciilor asociate acestei categorii',
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
  hooks: {
    afterChange: [revalidateServiceCategoryAfterChange],
    afterDelete: [revalidateServiceCategoryAfterDelete],
  },
  defaultSort: 'order',
}
