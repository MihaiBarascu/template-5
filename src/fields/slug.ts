import type { Field } from 'payload'
import { formatSlug } from '@/utilities/formatSlug'

export const slugField = (fieldToUse = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  admin: {
    position: 'sidebar',
    description: 'URL-ul paginii (generat automat din titlu)',
  },
  hooks: {
    beforeValidate: [formatSlug(fieldToUse)],
  },
  index: true,
  unique: true,
  label: 'Slug',
  required: true,
})
