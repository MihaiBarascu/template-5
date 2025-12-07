import type { Access, AccessArgs, FieldAccess } from 'payload'
import type { User } from '@/payload-types'

type IsAuthenticated = (args: AccessArgs<User>) => boolean

/**
 * Helper function to check user role
 */
export const checkRole = (role: string, user?: User | null): boolean => {
  return user?.role === role
}

/**
 * Check if user is authenticated
 */
export const authenticated: IsAuthenticated = ({ req: { user } }) => {
  return Boolean(user)
}

/**
 * Check if user is authenticated OR document is published
 * Used for public-facing content that supports drafts
 */
export const authenticatedOrPublished: Access = ({ req: { user } }) => {
  if (user) {
    return true
  }

  return {
    _status: {
      equals: 'published',
    },
  }
}

/**
 * Allow anyone (no authentication required)
 */
export const anyone: Access = () => true

/**
 * Check if user has admin role
 */
export const isAdmin: Access = ({ req: { user } }) => {
  const typedUser = user as User | null
  return typedUser?.role === 'admin'
}

/**
 * Check if user is admin (returns boolean only, for admin access)
 */
export const isAdminBoolean: IsAuthenticated = ({ req: { user } }) => {
  const typedUser = user as User | null
  return typedUser?.role === 'admin'
}

/**
 * Check if user is admin OR is accessing their own data
 * Used for Users collection to allow self-editing
 */
export const isAdminOrSelf: Access = ({ req: { user }, id }) => {
  if (!user) return false
  const typedUser = user as User
  if (typedUser.role === 'admin') return true
  return typedUser.id === id
}

/**
 * Field-level access: only admins can edit
 */
export const isAdminFieldLevel: FieldAccess = ({ req: { user } }) => {
  const typedUser = user as User | null
  return typedUser?.role === 'admin'
}

// =============================================
// Ecommerce Plugin Access Functions (v3.67.0+)
// =============================================

/**
 * Admin-only field access for ecommerce plugin
 */
export const adminOnlyFieldAccess: FieldAccess = ({ req: { user } }) => {
  const typedUser = user as User | null
  return checkRole('admin', typedUser)
}

/**
 * Admin gets full access, otherwise filter by published status
 * Used for products/variants that support drafts
 */
export const adminOrPublishedStatus: Access = ({ req: { user } }) => {
  const typedUser = user as User | null
  if (checkRole('admin', typedUser)) {
    return true
  }

  return {
    _status: {
      equals: 'published',
    },
  }
}

/**
 * Customer-only field access
 */
export const customerOnlyFieldAccess: FieldAccess = ({ req: { user } }) => {
  return Boolean(user)
}

/**
 * Check if user owns the document (via customer field)
 * Admin has full access, authenticated users get filtered by customer field
 * For READ operations - guests have no access
 */
export const isDocumentOwner: Access = ({ req: { user } }) => {
  const typedUser = user as User | null

  // Admin has full access
  if (checkRole('admin', typedUser)) {
    return true
  }

  // Authenticated user - filter by customer field
  if (typedUser?.id) {
    return {
      customer: {
        equals: typedUser.id,
      },
    }
  }

  // Guest - no access to read others' documents
  return false
}

/**
 * Allow guest checkout - anyone can create orders/carts
 * Used for CREATE operations in ecommerce
 */
export const allowGuestCreate: Access = () => true
