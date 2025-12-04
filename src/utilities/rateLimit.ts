/**
 * Simple in-memory rate limiter for API routes
 * Follows Payload CMS best practices for API security
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

// In-memory store - for production consider Redis
const rateLimitStore = new Map<string, RateLimitEntry>()

// Clean up expired entries periodically
const CLEANUP_INTERVAL = 60000 // 1 minute
let lastCleanup = Date.now()

function cleanup() {
  const now = Date.now()
  if (now - lastCleanup > CLEANUP_INTERVAL) {
    lastCleanup = now
    for (const [key, entry] of rateLimitStore.entries()) {
      if (now > entry.resetTime) {
        rateLimitStore.delete(key)
      }
    }
  }
}

export interface RateLimitResult {
  success: boolean
  remaining: number
  reset: number
}

/**
 * Check rate limit for a given identifier
 * @param identifier - Unique identifier (usually IP address)
 * @param limit - Maximum requests allowed
 * @param windowMs - Time window in milliseconds
 */
export function checkRateLimit(
  identifier: string,
  limit: number = 5,
  windowMs: number = 60000
): RateLimitResult {
  cleanup()

  const now = Date.now()
  const entry = rateLimitStore.get(identifier)

  if (!entry || now > entry.resetTime) {
    // New window
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    })
    return {
      success: true,
      remaining: limit - 1,
      reset: now + windowMs,
    }
  }

  if (entry.count >= limit) {
    // Rate limit exceeded
    return {
      success: false,
      remaining: 0,
      reset: entry.resetTime,
    }
  }

  // Increment count
  entry.count++
  return {
    success: true,
    remaining: limit - entry.count,
    reset: entry.resetTime,
  }
}

/**
 * Get client IP from request headers
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')

  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  if (realIP) {
    return realIP
  }

  return 'unknown'
}
