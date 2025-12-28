import {
  createContentRevalidateHook,
  createContentDeleteHook,
} from '@/hooks/revalidateTenantGlobal'

/**
 * Multi-tenant testimonial category revalidation hooks
 *
 * Uses tenant-specific cache tags instead of revalidatePath
 * because revalidatePath doesn't work with middleware in multi-tenant apps.
 *
 * When testimonial categories change, we also revalidate testimonials since they display category info.
 *
 * @see https://github.com/vercel/next.js/issues/59825
 */

// Revalidate testimonial-categories collection and related testimonials for the specific tenant
export const revalidateTestimonialCategoryAfterChange = createContentRevalidateHook('testimonial-categories', ['testimonials'])
export const revalidateTestimonialCategoryAfterDelete = createContentDeleteHook('testimonial-categories', ['testimonials'])
