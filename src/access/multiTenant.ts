import type { Access, FieldAccess } from 'payload'
import type { User, Tenant } from '@/payload-types'

/**
 * Multi-Tenant Access Control Functions
 *
 * Based on official Payload multi-tenant example:
 * https://github.com/payloadcms/payload/tree/main/examples/multi-tenant
 */

// Type for user with multi-tenant fields (added by plugin)
type MultiTenantUser = User & {
  roles?: ('super-admin' | 'user')[]
  tenants?: Array<{
    tenant: string | Tenant
    roles: ('tenant-admin' | 'tenant-viewer')[]
  }>
}

/**
 * Check if user is a super-admin (global access to all tenants)
 */
export const isSuperAdmin = (user: User | null): boolean => {
  const mtUser = user as MultiTenantUser | null
  return Boolean(mtUser?.roles?.includes('super-admin'))
}

/**
 * Super-admin access function for collection-level access
 */
export const isSuperAdminAccess: Access = ({ req }) => {
  return isSuperAdmin(req.user as User | null)
}

/**
 * Super-admin field access
 */
export const isSuperAdminFieldAccess: FieldAccess = ({ req }) => {
  return isSuperAdmin(req.user as User | null)
}

/**
 * Extract tenant ID from tenant field (handles populated or ID-only)
 */
const extractTenantID = (tenant: string | Tenant | null | undefined): string | null => {
  if (!tenant) return null
  if (typeof tenant === 'string') return tenant
  return tenant.id
}

/**
 * Get all tenant IDs assigned to a user
 * Optionally filter by role within tenants
 */
export const getUserTenantIDs = (
  user: User | null,
  role?: 'tenant-admin' | 'tenant-viewer',
): string[] => {
  const mtUser = user as MultiTenantUser | null
  if (!mtUser?.tenants) return []

  return mtUser.tenants
    .filter(t => {
      if (!t.tenant) return false
      if (role && !t.roles?.includes(role)) return false
      return true
    })
    .map(t => extractTenantID(t.tenant))
    .filter((id): id is string => id !== null)
}

/**
 * Check if user has tenant-admin role for any tenant
 */
export const hasTenantAdminAccess = (user: User | null): boolean => {
  return getUserTenantIDs(user, 'tenant-admin').length > 0
}

/**
 * Super-admin OR Tenant-admin access
 * Used for most content management operations
 */
export const superAdminOrTenantAdminAccess: Access = ({ req }) => {
  const user = req.user as User | null
  if (!user) return false
  if (isSuperAdmin(user)) return true
  return hasTenantAdminAccess(user)
}

/**
 * Super-admin OR Tenant-admin field access
 */
export const superAdminOrTenantAdminFieldAccess: FieldAccess = ({ req }) => {
  const user = req.user as User | null
  if (!user) return false
  if (isSuperAdmin(user)) return true
  return hasTenantAdminAccess(user)
}

/**
 * Read access for public content (respects tenant.allowPublicRead)
 * Used for Pages, Posts, Services, etc.
 */
export const publicReadAccess: Access = async ({ req }) => {
  // Authenticated users get filtered by plugin automatically
  if (req.user) return true

  // For unauthenticated users, only show content from tenants with allowPublicRead
  // The tenant field filtering is handled by the plugin
  return {
    'tenant.allowPublicRead': {
      equals: true,
    },
  }
}

/**
 * Tenant-scoped read access
 * Returns a query constraint for filtering by user's tenants
 */
export const tenantScopedReadAccess: Access = ({ req }) => {
  const user = req.user as User | null

  if (!user) return false
  if (isSuperAdmin(user)) return true

  const userTenantIDs = getUserTenantIDs(user)
  if (userTenantIDs.length === 0) return false

  return {
    tenant: {
      in: userTenantIDs,
    },
  }
}

/**
 * Users collection read access for multi-tenant
 * Based on official example: src/collections/Users/access/read.ts
 */
export const multiTenantUserReadAccess: Access = ({ req, id }) => {
  const user = req.user as User | null

  if (!user) return false

  // Users can always read themselves
  if (id === user.id) return true

  // Super-admin can read all
  if (isSuperAdmin(user)) return true

  // Tenant admins can see users in their tenants
  const adminTenantIDs = getUserTenantIDs(user, 'tenant-admin')
  if (adminTenantIDs.length === 0) {
    // Non-admins can only see themselves - return false to use ID check above
    return false
  }

  // Return query constraint for tenant filtering
  return {
    'tenants.tenant': { in: adminTenantIDs },
  }
}

/**
 * Users collection update/delete access for multi-tenant
 */
export const multiTenantUserUpdateAccess: Access = ({ req, id }) => {
  const user = req.user as User | null

  if (!user) return false

  // Users can always update themselves
  if (id === user.id) return true

  // Super-admin can update all
  if (isSuperAdmin(user)) return true

  // Tenant admins can update users in their tenants
  const adminTenantIDs = getUserTenantIDs(user, 'tenant-admin')
  if (adminTenantIDs.length === 0) return false

  return {
    'tenants.tenant': { in: adminTenantIDs },
  }
}
