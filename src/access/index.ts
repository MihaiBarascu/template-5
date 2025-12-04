import type { Access, AccessArgs, FieldAccess } from 'payload'
import type { User } from '@/payload-types'

type IsAuthenticated = (args: AccessArgs<User>) => boolean

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
