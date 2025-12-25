import type { CollectionBeforeOperationHook, CollectionConfig } from 'payload'
import { anyone, authenticated } from '@/access'
// Official multi-tenant plugin utility for getting tenant from cookie
import { getTenantFromCookie } from '@payloadcms/plugin-multi-tenant/utilities'

/**
 * Hook to set prefix based on tenant for R2/S3 file organization
 *
 * Following official Payload multi-tenant pattern:
 * - https://github.com/payloadcms/payload/discussions/11967
 * - Uses getTenantFromCookie utility from @payloadcms/plugin-multi-tenant
 *
 * File organization:
 * - media/{tenant-slug}/filename.jpg
 * - media/shared/filename.jpg (fallback for files without tenant)
 *
 * Known issue: https://github.com/payloadcms/payload/issues/14561
 * (suffix added even with different prefixes - cosmetic only)
 */

// Type for data with tenant field (added by multi-tenant plugin)
type MediaDataWithTenant = {
  tenant?: string | { id: string; slug?: string }
  prefix?: string
  [key: string]: unknown
}

const setTenantPrefix: CollectionBeforeOperationHook = async ({ args, operation, req }) => {
  // Only set prefix on create/update when there's a file upload
  if ((operation === 'create' || operation === 'update') && req.file) {
    const data = args.data as MediaDataWithTenant | undefined

    // Get tenant ID from: 1) document data, 2) cookie, 3) user's first tenant
    // This follows the official pattern from the multi-tenant plugin
    const tenantFromData = data?.tenant
    const tenantFromCookie = getTenantFromCookie(req.headers, 'text') as string | null
    const tenantFromUser = (req.user as { tenants?: Array<{ tenant: string | { id: string; slug?: string } }> })?.tenants?.[0]?.tenant

    // Determine tenant ID (string or object with id)
    let tenantId: string | null = null
    if (tenantFromData) {
      tenantId = typeof tenantFromData === 'string' ? tenantFromData : tenantFromData.id
    } else if (tenantFromCookie) {
      tenantId = tenantFromCookie
    } else if (tenantFromUser) {
      tenantId = typeof tenantFromUser === 'string' ? tenantFromUser : tenantFromUser.id
    }

    // Resolve tenant slug from ID
    let tenantSlug: string | null = null
    if (tenantId) {
      try {
        const tenant = await req.payload.findByID({
          collection: 'tenants',
          id: tenantId,
          depth: 0,
          req, // Pass req for proper transaction context
        })
        tenantSlug = (tenant as { slug?: string })?.slug || null
      } catch {
        // Tenant not found - will use fallback
      }
    }

    // Set prefix: media/{tenant-slug} or media/shared
    args.data = {
      ...data,
      prefix: tenantSlug ? `media/${tenantSlug}` : 'media/shared',
    } as typeof args.data
  }

  return args
}

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Media',
    plural: 'Media',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['filename', 'alt', 'updatedAt'],
    group: 'Continut',
  },
  hooks: {
    beforeOperation: [setTenantPrefix],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Text alternativ',
      required: true,
    },
    {
      name: 'caption',
      type: 'textarea',
      label: 'Descriere',
    },
    // Hidden prefix field for S3/R2 file path organization
    // Set automatically by beforeOperation hook based on tenant
    {
      name: 'prefix',
      type: 'text',
      admin: {
        hidden: true,
        readOnly: true,
      },
    },
  ],
  upload: {
    adminThumbnail: 'thumbnail',
    focalPoint: true, // Permite selectarea punctului focal pentru crop
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
      },
      {
        name: 'square',
        width: 500,
        height: 500,
      },
      {
        name: 'small',
        width: 600,
      },
      {
        name: 'medium',
        width: 900,
      },
      {
        name: 'large',
        width: 1400,
      },
      {
        name: 'xlarge',
        width: 1920,
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        crop: 'center',
      },
    ],
    mimeTypes: ['image/*', 'video/*', 'application/pdf'],
  },
}
