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
    // Anyone can register (create account) - required for ecommerce
    create: () => true,
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
      // IMPORTANT: Include role in JWT token for access control without DB queries
      saveToJWT: true,
      access: {
        // Only admins can set or change roles
        create: isAdminFieldLevel,
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
    // Ecommerce plugin has a BUG: requests select[carts]=true (plural)
    // but reads user.cart?.docs (singular). Field must be 'cart' to match reading.
    {
      name: 'cart',
      type: 'join',
      collection: 'carts',
      on: 'customer',
      // Only return active carts (not purchased) - plugin takes first cart from docs
      where: {
        purchasedAt: {
          exists: false,
        },
      },
      admin: {
        allowCreate: false,
        defaultColumns: ['id', 'createdAt', 'items'],
      },
    },
    {
      name: 'orders',
      type: 'join',
      collection: 'orders',
      on: 'customer',
      admin: {
        allowCreate: false,
        defaultColumns: ['id', 'createdAt', 'amount', 'status'],
      },
    },
    {
      name: 'addresses',
      type: 'join',
      collection: 'addresses',
      on: 'customer',
      admin: {
        allowCreate: false,
        defaultColumns: ['id', 'city', 'country'],
      },
    },
  ],
  timestamps: true,
}
