import type { Access, AccessArgs } from 'payload'
import type { User } from '@/payload-types'

type IsAuthenticated = (args: AccessArgs<User>) => boolean

export const authenticated: IsAuthenticated = ({ req: { user } }) => {
  return Boolean(user)
}

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

export const anyone: Access = () => true
