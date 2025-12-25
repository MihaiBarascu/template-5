import type { CollectionAfterLoginHook } from 'payload'

/**
 * After Login Hook: Set tenant cookie based on domain
 *
 * When a user logs in via a tenant's domain (e.g., frizerie.multiwebsite.org),
 * this hook automatically sets the payload-tenant cookie to that tenant's ID.
 *
 * Based on official Payload multi-tenant example:
 * https://github.com/payloadcms/payload/blob/main/examples/multi-tenant/src/collections/Users/hooks/setCookieBasedOnDomain.ts
 */
export const setCookieBasedOnDomain: CollectionAfterLoginHook = async ({ req, user }) => {
  const host = req.headers.get('host')

  if (!host) return user

  // Skip for localhost development (use slug-based routing instead)
  if (host.includes('localhost') || host.includes('127.0.0.1')) {
    return user
  }

  try {
    // Find tenant by domain
    const tenantQuery = await req.payload.find({
      collection: 'tenants',
      depth: 0,
      limit: 1,
      where: {
        domain: { equals: host },
      },
    })

    if (tenantQuery.docs.length > 0) {
      const tenant = tenantQuery.docs[0]

      // Generate tenant cookie
      // The cookie name must match what the plugin expects: 'payload-tenant'
      const cookieValue = String(tenant.id)
      const cookieExpiration = new Date(Date.now() + 7200 * 1000) // 2 hours

      const tenantCookie = `payload-tenant=${cookieValue}; Path=/; Expires=${cookieExpiration.toUTCString()}; SameSite=Lax`

      // Set cookie in response headers
      const newHeaders = new Headers()
      newHeaders.set('Set-Cookie', tenantCookie)

      if (req.responseHeaders) {
        // Merge with existing headers
        req.responseHeaders.forEach((value, key) => {
          newHeaders.append(key, value)
        })
      }

      req.responseHeaders = newHeaders

      console.log(`[Multi-Tenant] Set tenant cookie for domain ${host} -> tenant ${tenant.id}`)
    }
  } catch (error) {
    console.error('[Multi-Tenant] Error in setCookieBasedOnDomain:', error)
  }

  return user
}
