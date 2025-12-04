import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminBoolean, isAdminOrSelf, isAdminFieldLevel } from '@/access'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Utilizator',
    plural: 'Utilizatori',
  },
  access: {
    // Only admins can access admin panel for users
    admin: isAdminBoolean,
    // Only admins can create new users
    create: isAdmin,
    // Only admins can delete users
    delete: isAdmin,
    // Users can read their own data, admins can read all
    read: isAdminOrSelf,
    // Users can update their own data, admins can update all
    update: isAdminOrSelf,
  },
  admin: {
    defaultColumns: ['name', 'email', 'role'],
    useAsTitle: 'name',
    group: 'Administrare',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nume',
    },
    {
      name: 'role',
      type: 'select',
      label: 'Rol',
      required: true,
      defaultValue: 'customer',
      options: [
        { label: 'Administrator', value: 'admin' },
        { label: 'Client', value: 'customer' },
      ],
      access: {
        // Only admins can change roles
        update: isAdminFieldLevel,
      },
      admin: {
        position: 'sidebar',
        description: 'Doar administratorii pot modifica rolurile',
      },
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Telefon',
    },
  ],
  timestamps: true,
}
