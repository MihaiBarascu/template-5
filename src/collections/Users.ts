import type { CollectionConfig } from 'payload'
import {
  isSuperAdmin,
  isSuperAdminAccess,
  isSuperAdminFieldAccess,
  multiTenantUserReadAccess,
  multiTenantUserUpdateAccess,
} from '@/access/multiTenant'
import { setCookieBasedOnDomain } from '@/hooks/setCookieBasedOnDomain'

/**
 * Users Collection with Multi-Tenant Support
 *
 * Global roles (roles field):
 * - super-admin: Full access to all tenants (platform owner)
 * - user: Regular user, access controlled by tenant assignments
 *
 * Per-tenant roles (tenants array, added by plugin):
 * - tenant-admin: Can manage content within assigned tenant
 * - tenant-viewer: Read-only access to assigned tenant
 *
 * Based on official Payload multi-tenant example:
 * https://github.com/payloadcms/payload/tree/main/examples/multi-tenant
 */
export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Utilizator',
    plural: 'Utilizatori',
  },
  access: {
    // Admin panel access: super-admins or tenant-admins
    admin: ({ req }) => {
      const user = req.user
      if (!user) return false
      if (isSuperAdmin(user)) return true
      // Check if user has any tenant-admin role (field added by plugin)
      const mtUser = user as { tenants?: Array<{ roles?: string[] }> }
      return mtUser.tenants?.some(t => t.roles?.includes('tenant-admin')) ?? false
    },
    // Anyone can register (required for ecommerce customer accounts)
    create: () => true,
    // Super-admins can delete, tenant-admins can delete within their tenant
    delete: multiTenantUserUpdateAccess,
    // Users can read self, super-admins read all, tenant-admins read their tenants
    read: multiTenantUserReadAccess,
    // Users can update self, super-admins update all, tenant-admins update their tenants
    update: multiTenantUserUpdateAccess,
  },
  admin: {
    defaultColumns: ['name', 'email', 'roles'],
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
      name: 'phone',
      type: 'text',
      label: 'Telefon',
    },
    // Global roles - determines platform-level access
    {
      name: 'roles',
      type: 'select',
      label: 'Rol Global',
      hasMany: true,
      defaultValue: ['user'],
      options: [
        { label: 'Super Admin', value: 'super-admin' },
        { label: 'Utilizator', value: 'user' },
      ],
      // IMPORTANT: Include roles in JWT for access control without DB queries
      saveToJWT: true,
      access: {
        // Only super-admins can assign global roles
        create: isSuperAdminFieldAccess,
        update: isSuperAdminFieldAccess,
      },
      admin: {
        position: 'sidebar',
        description: 'Super Admin are acces la toți tenants. Utilizator are acces doar la tenants asignați.',
      },
    },
    // NOTE: The 'tenants' array field is automatically added by the multiTenantPlugin
    // It includes per-tenant roles: 'tenant-admin' and 'tenant-viewer'
    // Configuration is in payload.config.ts

    // Legacy role field - kept for backwards compatibility during migration
    // TODO: Remove after migration is complete and data is migrated
    {
      name: 'role',
      type: 'select',
      label: 'Rol (Legacy)',
      defaultValue: 'customer',
      options: [
        { label: 'Administrator', value: 'admin' },
        { label: 'Client', value: 'customer' },
      ],
      admin: {
        position: 'sidebar',
        description: 'DEPRECAT: Folosit pentru migrare. Va fi eliminat.',
        condition: (data) => {
          // Only show if user has legacy role set
          return Boolean(data?.role)
        },
      },
    },

    // Ecommerce fields - join with customer's data
    {
      name: 'cart',
      type: 'join',
      collection: 'carts',
      on: 'customer',
      // Only return active carts (not purchased)
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
  hooks: {
    // Set tenant cookie based on login domain
    afterLogin: [setCookieBasedOnDomain],
  },
  timestamps: true,
}
