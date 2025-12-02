import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Utilizator',
    plural: 'Utilizatori',
  },
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nume',
    },
  ],
  timestamps: true,
}
