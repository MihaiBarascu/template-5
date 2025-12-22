import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '@/access'
import { slugField } from '@/fields/slug'
import {
  revalidateTestimonialCategoryAfterChange,
  revalidateTestimonialCategoryAfterDelete,
} from '@/hooks/revalidateTestimonialCategory'

export const TestimonialCategories: CollectionConfig = {
  slug: 'testimonial-categories',
  labels: {
    singular: 'Categorie Testimoniale',
    plural: 'Categorii Testimoniale',
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
    description: 'Categorii pentru organizarea testimonialelor (ex: Access Bars, Terapia Bowen, Reiki)',
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
        description: 'Numele iconului Lucide (ex: Heart, Sparkles, Zap)',
      },
    },
    // Join field for reverse relationship - shows testimonials in this category
    {
      name: 'testimonials',
      type: 'join',
      collection: 'testimonials',
      on: 'category',
      label: 'Testimoniale în această categorie',
      admin: {
        description: 'Lista testimonialelor asociate acestei categorii',
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
    afterChange: [revalidateTestimonialCategoryAfterChange],
    afterDelete: [revalidateTestimonialCategoryAfterDelete],
  },
  defaultSort: 'order',
}
