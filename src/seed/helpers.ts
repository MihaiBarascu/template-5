import type { Page, TenantSiteTheme as SiteTheme, Service, Product, Post, Form, TenantSystemPage as SystemPage, Team } from '@/payload-types';
import fs from 'fs';
import path from 'path';
import type { Payload, Where } from 'payload';
import { withTenant, getCurrentSeedTenantId, hasSeedTenant } from './tenant-helpers';
import { IMAGE_BASE_URL } from './seed-data';

/**
 * Flexible block type for seeding - allows extra properties that may not exist in strict types.
 * Extra properties are ignored by Payload when saving, so this is safe for seeding.
 */
export type FlexibleBlock = {
  blockType: string;
  [key: string]: unknown;
};

/**
 * Flexible layout type - use this for type assertions in seeders
 * Example: layout: [...blocks] as FlexibleLayout
 */
export type FlexibleLayout = FlexibleBlock[];

/**
 * Creates a page with a flexible layout type for seeding.
 * This bypasses strict type checking for layout blocks.
 * Use this instead of direct payload.create() for pages to avoid type errors.
 */
export async function createSeederPage(
  payload: Payload,
  data: {
    title: string;
    slug: string;
    heroType?: string;
    hero?: Record<string, unknown>;
    layout?: unknown[]; // Accept any block array, will be cast to Page
    _status?: 'draft' | 'published';
    meta?: Record<string, unknown>;
    headerSettings?: Record<string, unknown>;
    [key: string]: unknown;
  },
): Promise<Page> {
  return await payload.create({
    collection: 'pages',
    data: withTenant(data) as unknown as Page,
  });
}

// Flag to reuse existing images (when --with-images is NOT provided)
let reuseExistingImages = false;

// Set reuse images flag
export function setReuseExistingImages(reuse: boolean): void {
  reuseExistingImages = reuse;
}

// Image cache to avoid repeated DB lookups in same session
const imageCache: Map<string, string> = new Map();

// Clear the image cache - call before each seed run
export function clearImageCache(): void {
  imageCache.clear();
  console.log('   Image cache cleared');
}

// Clear Next.js image optimization cache
export function clearNextImageCache(): void {
  const nextCachePath = path.join(process.cwd(), '.next', 'cache', 'images');
  if (fs.existsSync(nextCachePath)) {
    fs.rmSync(nextCachePath, { recursive: true, force: true });
    console.log('   Next.js image cache cleared (.next/cache/images)');
  }
}

// Clear entire Next.js cache folder (use when seeding with new images)
export function clearNextCache(): void {
  const nextCachePath = path.join(process.cwd(), '.next', 'cache');
  if (fs.existsSync(nextCachePath)) {
    fs.rmSync(nextCachePath, { recursive: true, force: true });
    console.log('   Next.js cache cleared (.next/cache)');
  }
}

// Trigger Next.js cache revalidation via API (call after seed to refresh running server)
// Tries multiple ports: primary URL, then fallback ports for dev (3010) and prod (3100)
export async function triggerRevalidation(baseUrl: string = 'http://localhost:3010'): Promise<void> {
  const urlsToTry = [
    baseUrl,
    'http://localhost:3010', // dev port
    'http://localhost:3100', // production port
  ];

  // Remove duplicates
  const uniqueUrls = [...new Set(urlsToTry)];

  console.log('   Triggering Next.js cache revalidation...');

  for (const url of uniqueUrls) {
    try {
      const response = await fetch(`${url}/api/revalidate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}), // Empty body = revalidate all globals + collections
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`   ✅ Cache revalidated on ${url}: ${data.revalidated?.tags?.length || 0} tags`);
        return; // Success, exit early
      }
    } catch {
      // Server not running on this port, try next
    }
  }

  // No server responded
  console.log('   ⚠️  No running server found for revalidation (dev or production)');
  console.log('   💡 Start the server and run revalidation manually: curl -X POST http://localhost:PORT/api/revalidate');
}

// Helper to find existing image by filename in media collection
async function findExistingImage(payload: Payload, filename: string): Promise<string | null> {
  // Extract just the filename without path (e.g., 'barbershop/gallery/gallery-1.jpg' -> 'gallery-1.jpg')
  const baseFilename = filename.split('/').pop() || filename;

  try {
    const existing = await payload.find({
      collection: 'media',
      where: {
        filename: { contains: baseFilename },
      },
      limit: 1,
    });

    if (existing.docs.length > 0) {
      return existing.docs[0].id;
    }
  } catch (_e) {
    // Ignore errors
  }
  return null;
}

// Helper to upload image from URL
export async function uploadImageFromURL(
  payload: Payload,
  url: string,
  filename: string,
  alt: string,
): Promise<string | null> {
  // Check in-memory cache first
  const cacheKey = filename;
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey) || null;
  }

  // If reusing existing images, search in DB by filename
  if (reuseExistingImages) {
    const existingId = await findExistingImage(payload, filename);
    if (existingId) {
      console.log(`   ♻️  Reusing: ${filename}`);
      imageCache.set(cacheKey, existingId);
      return existingId;
    }
    // Not found - skip upload when reusing
    console.log(`   ⚠️  Not found: ${filename} (run with --with-images to upload)`);
    return null;
  }

  // Fresh upload mode (--with-images)
  try {
    console.log(`   ⬇️  Downloading: ${filename}...`);
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`   Failed to fetch image: ${url}`);
      return null;
    }

    const buffer = await response.arrayBuffer();
    const tempDir = path.join(process.cwd(), 'temp-uploads');

    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const tempFilePath = path.join(tempDir, filename);
    fs.writeFileSync(tempFilePath, new Uint8Array(buffer));

    const media = await payload.create({
      collection: 'media',
      data: withTenant({
        alt,
      }),
      filePath: tempFilePath,
    });

    fs.unlinkSync(tempFilePath);

    imageCache.set(cacheKey, media.id);
    console.log(`   ✅ Uploaded: ${filename}`);

    return media.id;
  } catch (error) {
    console.error(`   Error uploading image ${filename}:`, error);
    return null;
  }
}

// Helper to upload multiple images and return their IDs
export async function uploadImages(
  payload: Payload,
  images: Array<{ url: string; filename: string; alt: string }>,
): Promise<Map<string, string>> {
  const imageMap = new Map<string, string>();

  for (const image of images) {
    const mediaId = await uploadImageFromURL(
      payload,
      image.url,
      image.filename,
      image.alt,
    );
    if (mediaId) {
      imageMap.set(image.filename, mediaId);
    }
  }

  return imageMap;
}

// Helper to upload images from seed-data definitions
export async function uploadSeedImages(
  payload: Payload,
  baseUrl: string,
  images: Array<{ filename: string; alt: string }>,
): Promise<Map<string, string>> {
  const imageMap = new Map<string, string>();

  console.log(`\n📸 Uploading ${images.length} images...`);

  for (const image of images) {
    const fullUrl = baseUrl + image.filename;
    const filenameOnly = image.filename.split('/').pop() || image.filename;
    const mediaId = await uploadImageFromURL(
      payload,
      fullUrl,
      filenameOnly,
      image.alt,
    );
    if (mediaId) {
      imageMap.set(image.filename, mediaId);
    }
  }

  console.log(`   ✅ Uploaded ${imageMap.size}/${images.length} images\n`);
  return imageMap;
}

// Helper to upload local image from filesystem
export async function uploadLocalImage(
  payload: Payload,
  filePath: string,
  alt: string,
): Promise<string | null> {
  const filename = path.basename(filePath);
  const cacheKey = filename;

  // Check in-memory cache first
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey) || null;
  }

  // If reusing existing images, search in DB by filename
  if (reuseExistingImages) {
    const existingId = await findExistingImage(payload, filename);
    if (existingId) {
      console.log(`   ♻️  Reusing: ${filename}`);
      imageCache.set(cacheKey, existingId);
      return existingId;
    }
    console.log(`   ⚠️  Not found: ${filename} (run with --with-images to upload)`);
    return null;
  }

  // Fresh upload mode (--with-images)
  try {
    console.log(`   ⬆️  Uploading local: ${filename}...`);

    if (!fs.existsSync(filePath)) {
      console.error(`   File not found: ${filePath}`);
      return null;
    }

    const media = await payload.create({
      collection: 'media',
      data: withTenant({
        alt,
      }),
      filePath: filePath,
    });

    imageCache.set(cacheKey, media.id);
    console.log(`   ✅ Uploaded: ${filename}`);

    return media.id;
  } catch (error) {
    console.error(`   Error uploading local image ${filePath}:`, error);
    return null;
  }
}

// Helper to upload local video from filesystem
export async function uploadLocalVideo(
  payload: Payload,
  filePath: string,
  alt: string,
): Promise<string | null> {
  const filename = path.basename(filePath);
  const cacheKey = `video_${filename}`;

  // Check in-memory cache first
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey) || null;
  }

  // If reusing existing media, search in DB by filename
  if (reuseExistingImages) {
    const existingId = await findExistingImage(payload, filename);
    if (existingId) {
      console.log(`   ♻️  Reusing video: ${filename}`);
      imageCache.set(cacheKey, existingId);
      return existingId;
    }
    console.log(`   ⚠️  Video not found: ${filename} (run with --with-images to upload)`);
    return null;
  }

  // Fresh upload mode (--with-images)
  try {
    console.log(`   🎬 Uploading video: ${filename}...`);

    if (!fs.existsSync(filePath)) {
      console.error(`   Video file not found: ${filePath}`);
      return null;
    }

    const media = await payload.create({
      collection: 'media',
      data: withTenant({
        alt,
      }),
      filePath: filePath,
    });

    imageCache.set(cacheKey, media.id);
    console.log(`   ✅ Video uploaded: ${filename}`);

    return media.id;
  } catch (error) {
    console.error(`   Error uploading video ${filePath}:`, error);
    return null;
  }
}

// Helper to download image from GitHub and save locally
async function downloadAndSaveImage(
  remoteUrl: string,
  localPath: string,
): Promise<boolean> {
  try {
    const response = await fetch(remoteUrl);
    if (!response.ok) {
      return false;
    }

    const buffer = await response.arrayBuffer();

    // Create directory if it doesn't exist
    const dir = path.dirname(localPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(localPath, new Uint8Array(buffer));
    return true;
  } catch {
    return false;
  }
}

// Helper to upload seed images - tries local first, downloads from GitHub if missing
export async function uploadLocalSeedImages(
  payload: Payload,
  images: Array<{ filename: string; alt: string }>,
): Promise<Map<string, string>> {
  const imageMap = new Map<string, string>();
  const publicImagesDir = path.join(process.cwd(), 'public', 'images');

  console.log(`\n📸 Uploading ${images.length} images...`);

  for (const image of images) {
    const localPath = path.join(publicImagesDir, image.filename);

    // Try local file first
    if (fs.existsSync(localPath)) {
      const mediaId = await uploadLocalImage(payload, localPath, image.alt);
      if (mediaId) {
        imageMap.set(image.filename, mediaId);
        continue;
      }
    }

    // Download from GitHub and save locally for future use
    const fullUrl = IMAGE_BASE_URL + image.filename;
    const filenameOnly = image.filename.split('/').pop() || image.filename;
    console.log(`   ⬇️  Downloading: ${filenameOnly}...`);

    const downloaded = await downloadAndSaveImage(fullUrl, localPath);
    if (downloaded) {
      console.log(`   💾 Saved locally: ${image.filename}`);
      const mediaId = await uploadLocalImage(payload, localPath, image.alt);
      if (mediaId) {
        imageMap.set(image.filename, mediaId);
        continue;
      }
    }

    console.log(`   ⚠️  Failed to download: ${filenameOnly}`);
  }

  console.log(`   ✅ Uploaded ${imageMap.size}/${images.length} images\n`);
  return imageMap;
}

/**
 * Create a Tenant Admin user for a specific business.
 *
 * This user can ONLY access their assigned tenant's content in the admin panel.
 * For the platform Super Admin, use `pnpm seed:super-admin` instead.
 *
 * @param payload - Payload instance
 * @param options - Tenant admin configuration
 */
export async function createTenantAdmin(
  payload: Payload,
  options: {
    email: string
    password: string
    name: string
    tenantId: string
    tenantName?: string // For display purposes
  }
) {
  const { email, password, name, tenantId, tenantName } = options

  const existingUser = await payload.find({
    collection: 'users',
    where: {
      email: { equals: email },
    },
    limit: 1,
  })

  if (existingUser.docs.length === 0) {
    // The 'tenants' field is added by multiTenantPlugin at runtime,
    // so we need to cast the data to bypass TypeScript's static checking
    const userData = {
      email,
      password,
      name,
      roles: ['user'], // NOT super-admin - just regular user
      tenants: [
        {
          tenant: tenantId,
          roles: ['tenant-admin'], // Admin only for this tenant
        },
      ],
    }
    await payload.create({
      collection: 'users',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: userData as any,
    })
    console.log(`   ✅ Created tenant admin: ${email} (${tenantName || tenantId})`)
  } else {
    // User exists - ensure they have tenant-admin role for this tenant
    const user = existingUser.docs[0]
    const mtUser = user as typeof user & {
      tenants?: Array<{ tenant: string | { id: string }; roles: string[] }>
    }

    // Check if user already has access to this tenant
    const hasTenantAccess = mtUser.tenants?.some((t) => {
      const tId = typeof t.tenant === 'string' ? t.tenant : t.tenant?.id
      return tId === tenantId && t.roles?.includes('tenant-admin')
    })

    if (!hasTenantAccess) {
      // Add this tenant to user's access
      const updatedTenants = [
        ...(mtUser.tenants || []),
        { tenant: tenantId, roles: ['tenant-admin'] as ('tenant-admin' | 'tenant-viewer')[] },
      ]

      await payload.update({
        collection: 'users',
        id: user.id,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: { tenants: updatedTenants } as any,
      })
      console.log(`   ⬆️  Added tenant-admin access for: ${email} → ${tenantName || tenantId}`)
    } else {
      console.log(`   ✓ Tenant admin already exists: ${email}`)
    }
  }
}

/**
 * @deprecated Use createTenantAdmin() for business admins or pnpm seed:super-admin for platform admin.
 * This function is kept for backwards compatibility during migration.
 */
export async function createAdminUser(payload: Payload) {
  console.log('   ⚠️  createAdminUser() is deprecated. Use pnpm seed:super-admin instead.')
  // No-op - super admin should be created via seed:super-admin script
}

// Helper to seed site theme (unified theme system)
export async function seedSiteTheme(
  payload: Payload,
  options: {
    variant: SiteTheme['variant'];
    borderRadius?: SiteTheme['borderRadius'];
    shadows?: SiteTheme['shadows'];
    animations?: SiteTheme['animations'];
    containerWidth?: SiteTheme['containerWidth'];
    sectionSpacing?: SiteTheme['sectionSpacing'];
    headingScale?: SiteTheme['headingScale'];
    bodyTextSize?: SiteTheme['bodyTextSize'];
    cardGap?: SiteTheme['cardGap'];
    useCustomColors?: boolean;
    colors?: SiteTheme['colors'];
    // Typography
    headingFont?: SiteTheme['headingFont'];
    bodyFont?: SiteTheme['bodyFont'];
    headingWeight?: SiteTheme['headingWeight'];
    // Button styling
    useCustomButtons?: boolean;
    buttonRounding?: SiteTheme['buttonRounding'];
    buttonTextTransform?: SiteTheme['buttonTextTransform'];
    buttonFontWeight?: SiteTheme['buttonFontWeight'];
    buttonPadding?: SiteTheme['buttonPadding'];
    buttonLetterSpacing?: SiteTheme['buttonLetterSpacing'];
  },
) {
  const themeData = {
    variant: options.variant,
    borderRadius: options.borderRadius,
    shadows: options.shadows,
    animations: options.animations || 'moderate',
    containerWidth: options.containerWidth || '1280',
    sectionSpacing: options.sectionSpacing || 'normal',
    headingScale: options.headingScale || 'normal',
    bodyTextSize: options.bodyTextSize || 'normal',
    cardGap: options.cardGap || 'normal',
    useCustomColors: options.useCustomColors || false,
    colors: options.colors,
    // Typography - if not provided, uses variant defaults from generateThemeStyles
    headingFont: options.headingFont,
    bodyFont: options.bodyFont,
    headingWeight: options.headingWeight,
    // Button styling
    useCustomButtons: options.useCustomButtons || false,
    buttonRounding: options.buttonRounding,
    buttonTextTransform: options.buttonTextTransform,
    buttonFontWeight: options.buttonFontWeight,
    buttonPadding: options.buttonPadding,
    buttonLetterSpacing: options.buttonLetterSpacing,
  };

  // Multi-tenant: create in tenant-site-themes collection if tenant is set
  if (!hasSeedTenant()) {
    throw new Error('Multi-tenant mode required: Set SEED_TYPE environment variable');
  }
  await payload.create({
    collection: 'tenant-site-themes',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: withTenant(themeData) as any,
  });
  console.log(`   Site theme configured: ${options.variant}${options.headingFont ? ` (fonts: ${options.headingFont}/${options.bodyFont})` : ''}${options.headingWeight ? ` (weight: ${options.headingWeight})` : ''}${options.buttonRounding ? ` (btn: ${options.buttonRounding})` : ''}`);
}

// Alias for backwards compatibility
export const seedTheme = seedSiteTheme;

// Helper to seed business info
export async function seedBusinessInfo(
  payload: Payload,
  data: {
    name: string;
    tagline?: string;
    description?: string;
    yearEstablished?: number;
    phone?: string;
    phoneSecondary?: string;
    email?: string;
    whatsapp?: string;
    address?: {
      street?: string;
      city?: string;
      county?: string;
      postalCode?: string;
      country?: string;
    };
    workingHours?: Array<{ days: string; hours: string }>;
    social?: {
      facebook?: string;
      instagram?: string;
      tiktok?: string;
      youtube?: string;
      linkedin?: string;
    };
    stats?: Array<{ value: string; label: string }>;
    googleMapsEmbed?: string;
    googleMapsLink?: string;
    whatsappFloat?: {
      enabled?: boolean;
      position?: 'bottom-right' | 'bottom-left';
      showOnMobile?: boolean;
      defaultMessage?: string;
      tooltipText?: string;
      pulseAnimation?: boolean;
    };
    announcementBar?: {
      enabled?: boolean;
      message?: string;
      linkText?: string;
      linkUrl?: string;
      backgroundColor?: 'primary' | 'secondary' | 'accent' | 'dark' | 'gradient' | 'urgent' | 'success';
      icon?: 'megaphone' | 'gift' | 'star' | 'fire' | 'sparkles' | 'none';
      dismissible?: boolean;
    };
    floatingCta?: {
      enabled?: boolean;
      text?: string;
      href?: string;
      variant?: 'primary' | 'accent' | 'secondary' | 'dark' | 'gradient';
      icon?: 'arrow' | 'phone' | 'message' | 'calendar' | 'none';
      position?: 'bottom-right' | 'bottom-left' | 'bottom-center' | 'right-center' | 'left-center';
      shape?: 'pill' | 'rectangle';
      showOnMobile?: boolean;
      pulseAnimation?: boolean;
      dismissible?: boolean;
      showAfterScroll?: number;
    };
  },
) {
  const businessData = {
    name: data.name,
    tagline: data.tagline,
    description: data.description,
    yearEstablished: data.yearEstablished,
    phone: data.phone,
    phoneSecondary: data.phoneSecondary,
    email: data.email,
    whatsapp: data.whatsapp,
    address: data.address,
    workingHours: data.workingHours,
    social: data.social,
    stats: data.stats,
    googleMapsEmbed: data.googleMapsEmbed,
    googleMapsLink: data.googleMapsLink,
    whatsappFloat: data.whatsappFloat,
    announcementBar: data.announcementBar,
    floatingCta: data.floatingCta,
  };

  // Multi-tenant: create in tenant-business-info collection
  if (!hasSeedTenant()) {
    throw new Error('Multi-tenant mode required: Set SEED_TYPE environment variable');
  }
  await payload.create({
    collection: 'tenant-business-info',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: withTenant(businessData) as any,
  });
  console.log('   Business info configured');
}

// Helper to seed logo
export async function seedLogo(
  payload: Payload,
  data: {
    type: 'text' | 'image' | 'both';
    text?: string;
    imageId?: string;
    imageDarkId?: string;
    imageLightId?: string;
    faviconId?: string;
    height?: number;
    heightMobile?: number;
  },
) {
  const logoData = {
    type: data.type,
    text: data.text,
    image: data.imageId,
    imageDark: data.imageDarkId,
    imageLight: data.imageLightId,
    favicon: data.faviconId,
    size: {
      height: data.height || 40,
      heightMobile: data.heightMobile || 32,
    },
  };

  // Multi-tenant: create in tenant-logos collection
  if (!hasSeedTenant()) {
    throw new Error('Multi-tenant mode required: Set SEED_TYPE environment variable');
  }
  await payload.create({
    collection: 'tenant-logos',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: withTenant(logoData) as any,
  });
  console.log('   Logo configured');
}

// Type for submenu items
export type NavSubmenuItem = {
  label: string;
  type: 'reference' | 'custom';
  url?: string;
  description?: string;
  icon?: string;
};

// Type for nav items with optional submenu
export type NavItem = {
  label: string;
  type: 'reference' | 'custom';
  url?: string;
  hasSubmenu?: boolean;
  submenu?: NavSubmenuItem[];
};

// Helper to seed header
export async function seedHeader(
  payload: Payload,
  data: {
    variant?:
      | 'minimal'
      | 'centered'
      | 'standard'
      | 'with-topbar'
      | 'full-width';
    isTransparent?: boolean;
    transparentTextColor?: 'white' | 'dark' | 'auto';
    navItems: NavItem[];
    ctaButton?: {
      enabled: boolean;
      label?: string;
      link?: string;
      variant?: 'default' | 'outline' | 'ghost';
    };
    showTopBar?: boolean;
    topBar?: {
      backgroundColor?: 'dark' | 'primary' | 'transparent' | 'light';
      layout?: 'social-left' | 'message-left' | 'contact-left' | 'centered';
      showPhone?: boolean;
      showEmail?: boolean;
      showSocial?: boolean;
      showWorkingHours?: boolean;
      customText?: string;
      customSocialLinks?: Array<{
        platform: 'youtube' | 'facebook' | 'instagram' | 'tiktok' | 'twitter' | 'linkedin' | 'whatsapp';
        url: string;
      }>;
    };
  },
) {
  const headerData = {
    variant: data.variant || 'standard',
    navItems: data.navItems,
    ctaButton: {
      enabled: data.ctaButton?.enabled ?? true,
      label: data.ctaButton?.label || 'Contact',
      link: data.ctaButton?.link || '/contact',
      variant: data.ctaButton?.variant || 'default',
    },
    showTopBar: data.showTopBar ?? !!data.topBar,
    topBar: data.topBar ? {
      backgroundColor: data.topBar.backgroundColor || 'dark',
      layout: data.topBar.layout || 'social-left',
      showPhone: data.topBar.showPhone ?? true,
      showEmail: data.topBar.showEmail ?? true,
      showSocial: data.topBar.showSocial ?? true,
      showWorkingHours: data.topBar.showWorkingHours ?? false,
      customText: data.topBar.customText,
      customSocialLinks: data.topBar.customSocialLinks,
    } : undefined,
    sticky: true,
    isTransparent: data.isTransparent ?? false,
    transparentTextColor: data.transparentTextColor || 'white',
  };

  // Multi-tenant: create in tenant-headers collection
  if (!hasSeedTenant()) {
    throw new Error('Multi-tenant mode required: Set SEED_TYPE environment variable');
  }
  await payload.create({
    collection: 'tenant-headers',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: withTenant(headerData) as any,
  });
  console.log('   Header configured');
}

// Footer badge types
type FooterBadge = { image: string; link: string; alt: string }
type BadgeDefinition = { filename: string; link: string; alt: string }

// Default ANPC badges - required for Romanian e-commerce
const DEFAULT_BADGES: BadgeDefinition[] = [
  {
    filename: 'badges/anpc-sol.png',
    link: 'https://ec.europa.eu/consumers/odr/main/index.cfm?event=main.home2.show&lng=RO',
    alt: 'ANPC - Solutionarea Online a Litigiilor',
  },
  {
    filename: 'badges/anpc-sal.png',
    link: 'https://anpc.ro/ce-este-sal/',
    alt: 'ANPC - Solutionarea Alternativa a Litigiilor',
  },
]

// Internal helper to upload footer badges
async function uploadBadges(
  payload: Payload,
  badgeDefinitions: BadgeDefinition[],
): Promise<FooterBadge[]> {
  const badges: FooterBadge[] = []
  const imagesDir = path.join(process.cwd(), 'public', 'images')

  for (const badge of badgeDefinitions) {
    const imageId = await uploadLocalImage(
      payload,
      path.join(imagesDir, badge.filename),
      badge.alt,
    )
    if (imageId) {
      badges.push({
        image: imageId,
        link: badge.link,
        alt: badge.alt,
      })
    }
  }

  return badges
}

// Helper to seed footer
// badges: true (default) = ANPC badges, false = no badges, BadgeDefinition[] = custom
export async function seedFooter(
  payload: Payload,
  data: {
    variant?:
      | 'minimal'
      | 'centered'
      | 'with-map'
      | 'columns-4'
      | 'columns-3'
      | 'with-newsletter';
    colorScheme?: 'dark' | 'light';
    columns?: Array<{
      title: string;
      type: 'links' | 'contact' | 'schedule' | 'text' | 'social';
      links?: Array<{ label: string; type: 'custom'; url: string }>;
      text?: string;
    }>;
    legalLinks?: Array<{ label: string; type: 'custom'; url: string }>;
    // Badges: true (default) = ANPC, false = none, array = custom badges
    badges?: boolean | BadgeDefinition[];
    // Background image (imagine mare pe tot footer-ul)
    backgroundImageId?: string;
    backgroundOpacity?: number;
    // Decorative element (PNG pozitionat intr-o parte)
    decorativeImageId?: string;
    decorativePosition?: 'left' | 'right' | 'bottom-left' | 'bottom-right';
    decorativeOpacity?: number;
    decorativeSize?: 'small' | 'medium' | 'large' | 'xl';
  },
) {
  // Handle badges: true/undefined = default ANPC, false = none, array = custom
  let badgeData: FooterBadge[] | undefined
  if (data.badges !== false) {
    const badgeDefs = Array.isArray(data.badges) ? data.badges : DEFAULT_BADGES
    badgeData = await uploadBadges(payload, badgeDefs)
  }

  const footerData = {
    variant: data.variant || 'columns-4',
    colorScheme: data.colorScheme || 'dark',
    columns: data.columns,
    showSocialLinks: true,
    showContactInfo: true,
    copyright: '© {year} {businessName}. Toate drepturile rezervate.',
    legalLinks: data.legalLinks || [
      {
        label: 'Politica de confidentialitate',
        type: 'custom',
        url: '/politica-confidentialitate',
      },
      {
        label: 'Termeni si conditii',
        type: 'custom',
        url: '/termeni-conditii',
      },
    ],
    badges: badgeData && badgeData.length > 0 ? badgeData : undefined,
    // Background texture (imagine mare pe tot footer-ul)
    backgroundImage: data.backgroundImageId || null,
    backgroundOpacity: data.backgroundOpacity ?? 20,
    // Decorative element (PNG pozitionat intr-o parte, ca la Elyssium)
    decorativeImage: data.decorativeImageId || null,
    decorativePosition: data.decorativePosition || 'left',
    decorativeOpacity: data.decorativeOpacity ?? 30,
    decorativeSize: data.decorativeSize || 'medium',
  };

  // Multi-tenant: create in tenant-footers collection
  if (!hasSeedTenant()) {
    throw new Error('Multi-tenant mode required: Set SEED_TYPE environment variable');
  }
  await payload.create({
    collection: 'tenant-footers',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: withTenant(footerData) as any,
  });
  console.log('   Footer configured');
}

// Helper to create service categories
export async function seedServiceCategories(
  payload: Payload,
  categories: Array<{
    title: string;
    description?: string;
    icon?: string;
    order?: number;
  }>,
): Promise<Map<string, string>> {
  const createdCategories: Map<string, string> = new Map();

  for (const category of categories) {
    // Check if category already exists by title (and tenant in multi-tenant mode)
    const whereClause: Where = { title: { equals: category.title } };
    if (hasSeedTenant()) {
      (whereClause as Record<string, unknown>).tenant = { equals: getCurrentSeedTenantId() };
    }
    const existing = await payload.find({
      collection: 'service-categories',
      where: whereClause,
      limit: 1,
    });

    if (existing.docs.length > 0) {
      // Use existing category (from same tenant)
      createdCategories.set(category.title, existing.docs[0].id);
      console.log(`   ⏭️ Category "${category.title}" already exists`);
    } else {
      // Create new category (slug will be formatted by hook from title)
      const slug = category.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
      const created = await payload.create({
        collection: 'service-categories',
        draft: false,
        data: withTenant({
          title: category.title,
          slug,
          description: category.description,
          icon: category.icon,
          order: category.order || 0,
        }),
      });
      createdCategories.set(category.title, created.id);
      console.log(`   ✅ Created category "${category.title}"`);
    }
  }
  return createdCategories;
}

// Helper to create services (universal - works for any business type)
// Supports both dynamic attributes AND advanced fields (schedule, difficulty, etc.)
export async function seedServices(
  payload: Payload,
  services: Array<{
    // Basic fields
    title: string;
    shortDescription?: string;
    description?: Service['description'];
    icon?: string;
    imageId?: string;
    featured?: boolean;
    active?: boolean;
    order?: number;
    features?: string[];
    // Category
    categoryId?: string;
    // Price and duration (dedicated fields)
    price?: string | number;
    duration?: string;
    // Display style
    displayStyle?: 'card' | 'card-image' | 'list' | 'pricing' | 'detailed' | 'menu-item';
    // Dynamic attributes (for additional info)
    attributes?: Array<{
      label: string;
      value: string;
      icon?: string;
    }>;
    // Advanced fields (for classes, treatments, etc.)
    difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'all-levels';
    capacity?: number;
    durationMinutes?: number;
    schedule?: Array<{
      day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
      startTime: string;
      endTime?: string;
      room?: string;
    }>;
    // Relationships
    assignedTeamMemberId?: string;
    // CTA and navigation
    ctaLabel?: string;
    ctaLink?: string;
    backLabel?: string;
    backLink?: string;
  }>,
): Promise<Map<string, string>> {
  const createdServices: Map<string, string> = new Map();

  for (const service of services) {
    const slug = service.title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');

    const created = await payload.create({
      collection: 'services',
      data: withTenant({
        title: service.title,
        slug,
        shortDescription: service.shortDescription,
        description: service.description,
        icon: service.icon,
        image: service.imageId || undefined,
        featured: service.featured || false,
        active: service.active !== false,
        order: service.order || 0,
        // Category
        category: service.categoryId || undefined,
        // Price and duration
        price: service.price != null ? `${service.price}${typeof service.price === 'number' ? ' RON' : ''}` : undefined,
        duration: service.duration,
        displayStyle: service.displayStyle || 'card',
        attributes: service.attributes || [],
        features: service.features?.map(f => ({ feature: f })),
        // Advanced fields
        difficulty: service.difficulty,
        capacity: service.capacity,
        durationMinutes: service.durationMinutes,
        schedule: service.schedule?.map(s => ({
          day: s.day,
          startTime: s.startTime,
          endTime: s.endTime,
          room: s.room,
        })),
        // Relationships
        assignedTeamMember: service.assignedTeamMemberId || undefined,
        // CTA
        ctaLabel: service.ctaLabel,
        ctaLink: service.ctaLink || '/contact',
        backLabel: service.backLabel,
        backLink: service.backLink,
      }),
    });
    createdServices.set(service.title, created.id);
  }
  console.log(`   Created ${services.length} services`);
  return createdServices;
}

// Helper to create team members with optional images
export async function seedTeam(
  payload: Payload,
  members: Array<{
    name: string;
    role: string;
    bio?: string; // Short bio for cards (plain text)
    description?: Team['description']; // Detailed description for individual page (Lexical rich text)
    experience?: string;
    featured?: boolean;
    order?: number;
    specializations?: Array<{ specialization: string }> | string[];
    contact?: {
      email?: string;
      phone?: string;
      whatsapp?: string;
    };
    social?: {
      facebook?: string | null;
      instagram?: string | null;
      linkedin?: string | null;
      twitter?: string | null;
    };
    schedule?: Array<{
      day: 'luni' | 'marti' | 'miercuri' | 'joi' | 'vineri' | 'sambata' | 'duminica';
      hours: string;
    }>;
    imageId?: string; // Optional media ID for photo
  }>,
) {
  // Delete existing team members for this tenant only (multi-tenant aware)
  const whereClause: Where = { id: { exists: true } };
  if (hasSeedTenant()) {
    (whereClause as Record<string, unknown>).tenant = { equals: getCurrentSeedTenantId() };
  }
  await payload.delete({
    collection: 'team',
    where: whereClause,
  });

  for (const member of members) {
    // Handle specializations - can be array of strings or array of objects
    const specializations = member.specializations?.map(s => {
      if (typeof s === 'string') {
        return { specialization: s };
      }
      return s;
    });

    await payload.create({
      collection: 'team',
      data: withTenant({
        name: member.name,
        slug: member.name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
          .replace(/\s+/g, '-')
          .replace(/[^\w-]/g, ''),
        role: member.role,
        bio: member.bio,
        description: member.description,
        experience: member.experience,
        featured: member.featured || false,
        order: member.order || 0,
        specializations,
        contact: member.contact || undefined,
        social: member.social ? {
          facebook: member.social.facebook || undefined,
          instagram: member.social.instagram || undefined,
          linkedin: member.social.linkedin || undefined,
          twitter: member.social.twitter || undefined,
        } : undefined,
        schedule: member.schedule,
        image: member.imageId || undefined,
      }),
    });
  }
  console.log(`   Created ${members.length} team members`);
}

// Helper to create testimonial categories
export async function seedTestimonialCategories(
  payload: Payload,
  categories: Array<{
    title: string;
    description?: string;
    icon?: string;
    order?: number;
  }>,
): Promise<Map<string, string>> {
  const categoryMap = new Map<string, string>();

  // Delete existing testimonial categories for this tenant only
  const whereClause: Where = { id: { exists: true } };
  if (hasSeedTenant()) {
    (whereClause as Record<string, unknown>).tenant = { equals: getCurrentSeedTenantId() };
  }
  await payload.delete({
    collection: 'testimonial-categories',
    where: whereClause,
  });

  for (const category of categories) {
    // Generate slug with proper Romanian diacritics handling
    const slug = category.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/ț/g, 't')
      .replace(/ș/g, 's')
      .replace(/ă/g, 'a')
      .replace(/â/g, 'a')
      .replace(/î/g, 'i')
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');

    const created = await payload.create({
      collection: 'testimonial-categories',
      data: withTenant({
        title: category.title,
        slug,
        description: category.description,
        icon: category.icon,
        order: category.order || 0,
      }),
    });
    categoryMap.set(category.title, created.id);
  }
  console.log(`   Created ${categories.length} testimonial categories`);
  return categoryMap;
}

// Helper to create testimonials
export async function seedTestimonials(
  payload: Payload,
  testimonials: Array<{
    name: string;
    role?: string;
    content: string;
    rating?: string;
    featured?: boolean;
    categoryId?: string; // Optional testimonial category ID
    serviceIds?: string[]; // Link to multiple services (many-to-many)
    videoUrl?: string; // YouTube/Vimeo URL for video testimonials
  }>,
) {
  type RatingType = '1' | '2' | '3' | '4' | '5';
  for (const testimonial of testimonials) {
    await payload.create({
      collection: 'testimonials',
      data: withTenant({
        name: testimonial.name,
        role: testimonial.role,
        content: testimonial.content,
        rating: (testimonial.rating || '5') as RatingType,
        featured: testimonial.featured ?? true,
        category: testimonial.categoryId || undefined,
        services: testimonial.serviceIds?.length ? testimonial.serviceIds : undefined,
        videoUrl: testimonial.videoUrl || undefined,
      }),
    });
  }
  console.log(`   Created ${testimonials.length} testimonials`);
}

// Helper to create FAQ
export async function seedFAQ(
  payload: Payload,
  faqs: Array<{
    question: string;
    answer: string;
    order?: number;
  }>,
) {
  for (const faq of faqs) {
    await payload.create({
      collection: 'faq',
      data: withTenant({
        question: faq.question,
        answer: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [{
                  type: 'text',
                  text: faq.answer,
                  format: 0,
                  detail: 0,
                  mode: 'normal',
                  style: '',
                  version: 1,
                }],
                direction: 'ltr',
                format: '',
                indent: 0,
                textFormat: 0,
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        },
        order: faq.order || 0,
      }),
    });
  }
  console.log(`   Created ${faqs.length} FAQs`);
}

// DEPRECATED: seedPricePackages - use seedSubscriptions instead
// This is a wrapper that converts old format to new Subscriptions format
export async function seedPricePackages(
  payload: Payload,
  packages: Array<{
    title: string;
    subtitle?: string;
    description?: string;
    price: number;
    oldPrice?: number;
    period?: 'luna' | 'an' | 'unic' | 'sedinta' | 'ora' | 'zi';
    features?: Array<{ feature: string; included?: boolean }>;
    cta?: { label?: string; link?: string };
    highlighted?: boolean;
    highlightLabel?: string;
    order?: number;
  }>,
) {
  // Convert to seedSubscriptions format
  const subscriptions = packages.map(pkg => ({
    title: pkg.title,
    subtitle: pkg.subtitle,
    price: pkg.price,
    oldPrice: pkg.oldPrice,
    period: pkg.period === 'unic' ? undefined : `/${pkg.period || 'luna'}`,
    features: pkg.features?.map(f => ({ text: f.feature, included: f.included })),
    cta: pkg.cta ? { label: pkg.cta.label, url: pkg.cta.link } : undefined,
    highlighted: pkg.highlighted,
    highlightLabel: pkg.highlightLabel,
    order: pkg.order,
  }));

  await seedSubscriptions(payload, subscriptions);
}

// Hero data type for buildHeroData helper
export interface HeroDataInput {
  headline?: string
  subheadline?: string
  ctaButtons?: Array<{ label: string; link: string; variant?: string }>
  overlayEnabled?: boolean
  overlayOpacity?: string
  overlayStyle?: string
  imageId?: string
  videoUrl?: string // YouTube/Vimeo URL for video hero
  videoFileId?: string // Local MP4 upload ID for video hero
  slides?: Array<{ imageId: string; headline?: string; subheadline?: string }>
  statsBadge?: { enabled?: boolean; value?: string; label?: string }
}

// Helper to build hero data based on hero type from design variant
export function buildHeroData(
  heroType: string,
  baseData: {
    headline?: string
    subheadline?: string
    ctaButtons?: Array<{ label: string; link: string; variant?: string }>
  },
  overlaySettings: {
    overlayEnabled?: boolean
    overlayOpacity?: string
    overlayStyle?: string
  },
  images: {
    heroImages: Array<{ filename: string; alt: string }>
    galleryImages: Array<{ filename: string; alt: string }>
    getImageId: (filename: string) => string | undefined
  },
  stats?: {
    yearsExperience?: number
  },
  videoFileId?: string // Local MP4 video ID from Payload Media
): HeroDataInput {
  const heroData: HeroDataInput = {
    headline: baseData.headline,
    subheadline: baseData.subheadline,
    ctaButtons: baseData.ctaButtons,
    ...overlaySettings,
  }

  // For video hero, add video file ID
  if (heroType === 'video') {
    if (videoFileId) {
      heroData.videoFileId = videoFileId
      console.log(`   🎬 Set video hero with uploaded video`)
    }
    // Also set a fallback image for when video doesn't load
    heroData.imageId = images.getImageId(images.heroImages[0]?.filename)
  }
  // For carousel/slider hero, generate slides from hero and gallery images
  else if (heroType === 'carousel' || heroType === 'slider') {
    const slideImages = [
      ...images.heroImages,
      ...images.galleryImages.slice(0, 4), // Add first 4 gallery images
    ]
    const slides: Array<{ imageId: string; headline?: string; subheadline?: string }> = []
    slideImages.forEach((img, index) => {
      const imgId = images.getImageId(img.filename)
      if (imgId) {
        slides.push({
          imageId: imgId,
          headline: index === 0 ? baseData.headline : undefined,
          subheadline: index === 0 ? baseData.subheadline : undefined,
        })
      }
    })
    heroData.slides = slides
    console.log(`   📽️ Created ${slides.length} slides for carousel hero`)
  } else {
    // Standard hero with single image
    heroData.imageId = images.getImageId(images.heroImages[0]?.filename)
  }

  // For split hero, add stats badge
  if (heroType === 'split' && stats?.yearsExperience) {
    heroData.statsBadge = {
      enabled: true,
      value: `${stats.yearsExperience}+`,
      label: 'ani experienta',
    }
  }

  return heroData
}

// Helper to create homepage with optional hero image
type HeroType =
  | 'none'
  | 'minimal'
  | 'centered'
  | 'fullscreen'
  | 'split'
  | 'withImage'
  | 'video'
  | 'slider';
type ButtonVariant = 'default' | 'outline' | 'ghost';

type OverlayStyle = 'gradient' | 'dark' | 'primary' | 'secondary' | 'radial';
type OverlayOpacity = '30' | '40' | '50' | '60' | '70' | '80' | '90';

export async function seedHomePage(
  payload: Payload,
  data: {
    heroType?: string;
    hero?: {
      headline?: string;
      subheadline?: string;
      ctaButtons?: Array<{ label: string; link: string; variant?: string }>;
      imageId?: string; // Optional hero background image
      // Video for video hero
      videoUrl?: string; // YouTube/Vimeo URL
      videoFileId?: string; // Local MP4 upload ID
      // Slides for carousel/slider hero
      slides?: Array<{
        imageId: string;
        headline?: string;
        subheadline?: string;
      }>;
      // Overlay settings
      overlayEnabled?: boolean;
      overlayOpacity?: string;
      overlayStyle?: string;
      // Other hero settings
      height?: 'small' | 'medium' | 'large' | 'fullscreen';
      badge?: string;
      showScrollIndicator?: boolean;
      // Stats badge for split hero
      statsBadge?: {
        enabled?: boolean;
        value?: string;
        label?: string;
      };
    };
    layout?: Array<{
      blockType: string;
      [key: string]: unknown;
    }>;
  },
) {
  await payload.create({
    collection: 'pages',
    data: withTenant({
      title: 'Acasa',
      slug: 'home',
      heroType: (data.heroType || 'centered') as HeroType,
      hero: {
        headline: data.hero?.headline,
        subheadline: data.hero?.subheadline,
        ctaButtons: data.hero?.ctaButtons?.map(btn => ({
          ...btn,
          variant: (btn.variant || 'default') as ButtonVariant,
        })),
        image: data.hero?.imageId || undefined,
        // Video for video hero
        videoUrl: data.hero?.videoUrl,
        videoFile: data.hero?.videoFileId || undefined,
        // Slides for carousel/slider hero
        slides: data.hero?.slides?.map(slide => ({
          image: slide.imageId,
          headline: slide.headline,
          subheadline: slide.subheadline,
        })),
        // Overlay settings - default to enabled with gradient style
        overlayEnabled: data.hero?.overlayEnabled ?? true,
        overlayOpacity: (data.hero?.overlayOpacity || '60') as OverlayOpacity,
        overlayStyle: (data.hero?.overlayStyle || 'gradient') as OverlayStyle,
        // Other hero settings
        height: data.hero?.height || 'large',
        badge: data.hero?.badge,
        showScrollIndicator: data.hero?.showScrollIndicator ?? false,
        // Stats badge for split hero
        statsBadge: data.hero?.statsBadge,
      },
      layout: (data.layout || []) as Page['layout'],
      // _status removed for multi-tenant
    }),
  });
  console.log('   Created homepage');
}

// Helper to create portfolio/gallery items
export async function seedPortfolio(
  payload: Payload,
  items: Array<{
    title: string;
    description?: string;
    imageId: string;
    featured?: boolean;
    order?: number;
    externalUrl?: string;
  }>,
) {
  for (const item of items) {
    await payload.create({
      collection: 'portfolio',
      data: withTenant({
        title: item.title,
        slug: item.title
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]/g, ''),
        shortDescription: item.description,
        featuredImage: item.imageId,
        featured: item.featured || false,
        order: item.order || 0,
        externalUrl: item.externalUrl,
      }),
    });
  }
  console.log(`   Created ${items.length} portfolio items`);
}

// Helper to create product categories
export async function seedProductCategories(
  payload: Payload,
  categories: Array<{
    title: string;
    description?: string;
    order?: number;
  }>,
): Promise<Map<string, string>> {
  const categoryMap = new Map<string, string>();

  for (const category of categories) {
    const created = await payload.create({
      collection: 'product-categories',
      data: withTenant({
        title: category.title,
        slug: category.title
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]/g, ''),
        description: category.description,
        order: category.order || 0,
      }),
    });
    categoryMap.set(category.title, created.id);
  }
  console.log(`   Created ${categories.length} product categories`);
  return categoryMap;
}

// Product data type for seeding - uses Payload generated types with Omit for auto-generated fields
// Note: _status removed - versions disabled for multi-tenant compatibility
type ProductSeedData = Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>> &
  Pick<Product, 'title' | 'slug'> &
  { priceInRON?: number }

// Helper to create products (eCommerce plugin)
export async function seedProducts(
  payload: Payload,
  products: Array<{
    title: string;
    slug: string;
    description?: string;
    price: number;
    badge?: string;
    featured?: boolean;
    categoryId?: string;
    imageId?: string;
    inventory?: number;
  }>,
) {
  for (const product of products) {
    const productData: ProductSeedData = {
      title: product.title,
      slug: product.slug,
      priceInRON: product.price,
      badge: product.badge,
      featured: product.featured || false,
      // Set inventory - default to random 5-50 if not specified
      inventory: product.inventory ?? Math.floor(Math.random() * 46) + 5,
      // _status removed for multi-tenant
    };

    // Add category if present
    if (product.categoryId) {
      productData.category = product.categoryId;
    }

    // Add image if present
    if (product.imageId) {
      productData.images = [{ image: product.imageId }];
    }

    // Add description as richText if present
    if (product.description) {
      productData.description = {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [{
                type: 'text',
                text: product.description,
                format: 0,
                detail: 0,
                mode: 'normal',
                style: '',
                version: 1,
              }],
              direction: 'ltr',
              format: '',
              indent: 0,
              textFormat: 0,
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      };
    }

    await payload.create({
      collection: 'products',
      data: withTenant(productData) as unknown as Product,
    });
  }
  console.log(`   Created ${products.length} products`);
}

// Helper to create rich text node
export function createTextNode(text: string, format: number = 0) {
  return {
    type: 'text',
    text,
    format,
    detail: 0,
    mode: 'normal',
    style: '',
    version: 1,
  };
}

// Helper to create link node
export function createLink(text: string, url: string, newTab: boolean = false) {
  return {
    type: 'link',
    children: [createTextNode(text)],
    direction: 'ltr',
    fields: {
      linkType: 'custom',
      newTab,
      url,
    },
    format: '',
    indent: 0,
    version: 2,
  };
}

// Helper to create paragraph node
export function createParagraph(text: string) {
  return {
    type: 'paragraph',
    children: [createTextNode(text)],
    direction: 'ltr',
    format: '',
    indent: 0,
    textFormat: 0,
    version: 1,
  };
}

// Helper to create paragraph with link
export function createParagraphWithLink(
  textBefore: string,
  linkText: string,
  linkUrl: string,
  textAfter: string = '',
  newTab: boolean = false
) {
  const children: unknown[] = [];
  if (textBefore) children.push(createTextNode(textBefore));
  children.push(createLink(linkText, linkUrl, newTab));
  if (textAfter) children.push(createTextNode(textAfter));

  return {
    type: 'paragraph',
    children,
    direction: 'ltr',
    format: '',
    indent: 0,
    textFormat: 0,
    version: 1,
  };
}

// Helper to create heading node
export function createHeading(text: string, tag: 'h1' | 'h2' | 'h3' | 'h4' = 'h2') {
  return {
    type: 'heading',
    children: [createTextNode(text)],
    direction: 'ltr',
    format: '',
    indent: 0,
    tag,
    version: 1,
  };
}

// Helper to create banner block
export function createBanner(text: string, style: 'info' | 'warning' | 'success' | 'error' = 'info') {
  return {
    type: 'block',
    fields: {
      blockName: '',
      blockType: 'banner',
      content: {
        root: {
          type: 'root',
          children: [createParagraph(text)],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
      style,
    },
    format: '',
    version: 2,
  };
}

// Helper to create media block
export function createMediaBlock(mediaId: string) {
  return {
    type: 'block',
    fields: {
      blockName: '',
      blockType: 'mediaBlock',
      media: mediaId,
    },
    format: '',
    version: 2,
  };
}

// Helper to create list item node
export function createListItem(text: string) {
  return {
    type: 'listitem',
    children: [createTextNode(text)],
    direction: 'ltr',
    format: '',
    indent: 0,
    value: 1,
    version: 1,
  };
}

// Helper to create unordered list node
export function createList(items: string[], ordered: boolean = false) {
  return {
    type: 'list',
    children: items.map(item => createListItem(item)),
    direction: 'ltr',
    format: '',
    indent: 0,
    listType: ordered ? 'number' : 'bullet',
    start: 1,
    tag: ordered ? 'ol' : 'ul',
    version: 1,
  };
}

// Helper to create rich text root structure
export function createRichTextRoot(children: unknown[]) {
  return {
    root: {
      type: 'root',
      children,
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  };
}

// Helper to create blog posts with rich content
export async function seedPosts(
  payload: Payload,
  posts: Array<{
    title: string;
    excerpt?: string;
    content: string;
    publishedAt?: string;
    featured?: boolean;
    imageId?: string;
  }>,
) {
  // First create a default category if it doesn't exist for THIS tenant
  let categoryId: string | undefined;

  try {
    // Query categories for current tenant only
    const whereClause: Where = { slug: { equals: 'blog' } };
    if (hasSeedTenant()) {
      (whereClause as Record<string, unknown>).tenant = { equals: getCurrentSeedTenantId() };
    }

    const existingCategories = await payload.find({
      collection: 'categories',
      where: whereClause,
      limit: 1,
    });

    if (existingCategories.docs.length === 0) {
      // Create category for this tenant
      const category = await payload.create({
        collection: 'categories',
        data: withTenant({
          title: 'Blog',
          slug: 'blog',
        }),
      });
      categoryId = category.id;
    } else {
      categoryId = existingCategories.docs[0].id;
    }
  } catch (_e) {
    // Categories collection might not exist
  }

  for (const post of posts) {
    // Split content into paragraphs
    const paragraphs = post.content.split('\n\n').filter(p => p.trim());

    // Build rich content structure using Post content type
    type RichTextChild = NonNullable<Post['content']>['root']['children'][number]
    const contentChildren: RichTextChild[] = [];

    // Add intro heading with first paragraph
    if (paragraphs.length > 0) {
      contentChildren.push(createHeading(paragraphs[0], 'h2'));
    }

    // Add info banner
    contentChildren.push(createBanner(
      'Acest articol este doar pentru scop demonstrativ. Continutul poate fi editat din panoul de administrare.',
      'info'
    ));

    // Add remaining paragraphs
    for (let i = 1; i < paragraphs.length; i++) {
      const paragraph = paragraphs[i];

      // Add media block in the middle of the content
      if (i === Math.floor(paragraphs.length / 2) && post.imageId) {
        contentChildren.push(createMediaBlock(post.imageId));
      }

      contentChildren.push(createParagraph(paragraph));
    }

    // Add closing info banner
    contentChildren.push(createBanner(
      'Multumim pentru lectura! Pentru intrebari, nu ezitati sa ne contactati.',
      'success'
    ));

    await payload.create({
      collection: 'posts',
      data: withTenant({
        title: post.title,
        slug: post.title
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]/g, ''),
        excerpt: post.excerpt,
        content: {
          root: {
            type: 'root',
            children: contentChildren,
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        },
        publishedAt: post.publishedAt || new Date().toISOString(),
        category: categoryId,
        featuredImage: post.imageId || undefined,
        // _status removed for multi-tenant
      }),
    });
  }
  console.log(`   Created ${posts.length} blog posts`);
}

// Helper to create blog categories
export async function seedBlogCategories(
  payload: Payload,
  categories: Array<{
    title: string;
    description?: string;
  }>,
): Promise<Map<string, string>> {
  const categoryMap = new Map<string, string>();

  for (const category of categories) {
    const created = await payload.create({
      collection: 'categories',
      data: withTenant({
        title: category.title,
        slug: category.title
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]/g, ''),
      }),
    });
    categoryMap.set(category.title, created.id);
  }
  console.log(`   Created ${categories.length} blog categories`);
  return categoryMap;
}

// DEPRECATED: seedDesignVariant - use seedSiteTheme instead
// The old per-business variant system has been replaced with 10 universal design variants
// that work for any business type. Use seedSiteTheme with a variant option.
export async function seedDesignVariant(
  _payload: Payload,
  data: {
    businessType?: string;
    variantIndex?: number;
    variantName: string;
    variantDescription?: string;
  },
) {
  console.log(`   [DEPRECATED] seedDesignVariant called for: ${data.variantName}`);
  console.log(`   Use seedSiteTheme with variant option instead.`);
}

// DEPRECATED: seedClasses - use seedServices with serviceType: 'class' instead
// This function is kept for reference but should not be used
async function _seedClasses_deprecated() {
  console.log('[DEPRECATED] seedClasses is deprecated. Use seedServices with serviceType: "class" instead.');
}

// Helper to create subscriptions
export async function seedSubscriptions(
  payload: Payload,
  subscriptions: Array<{
    title: string;
    subtitle?: string;
    type?: 'gym' | 'spa' | 'solar' | 'fitness-spa' | 'classes' | 'personal' | 'premium' | 'pool';
    price: number;
    oldPrice?: number;
    period?: string;
    currency?: string;
    features?: Array<{ text: string; included?: boolean }>;
    cta?: { label?: string; url?: string };
    highlighted?: boolean;
    highlightLabel?: string;
    order?: number;
  }>,
) {
  for (const subscription of subscriptions) {
    await payload.create({
      collection: 'subscriptions',
      data: withTenant({
        title: subscription.title,
        slug: subscription.title
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]/g, ''),
        subtitle: subscription.subtitle,
        type: subscription.type || 'gym',
        pricing: {
          amount: subscription.price,
          oldPrice: subscription.oldPrice,
          period: subscription.period || '/luna',
          currency: subscription.currency || 'RON',
        },
        features: subscription.features,
        cta: {
          label: subscription.cta?.label || 'Alege abonamentul',
          linkType: 'custom',
          url: subscription.cta?.url || '/contact',
        },
        highlighted: subscription.highlighted || false,
        highlightLabel: subscription.highlightLabel || 'Cel mai popular',
        order: subscription.order || 0,
        active: true,
      }),
    });
  }
  console.log(`   Created ${subscriptions.length} subscriptions`);
}

// Helper to seed sample newsletter subscribers for demo purposes
// DISABLED: To avoid sending welcome emails during seeding
// Uncomment the code below if you want to seed newsletter subscribers
export async function seedNewsletterSubscribers(
  _payload: Payload,
  subscribers: Array<{
    email: string;
    source?: 'website' | 'footer' | 'popup' | 'page' | 'import' | 'manual';
    status?: 'active' | 'unsubscribed' | 'bounced';
  }>,
) {
  console.log(`   ⏭️  Skipping ${subscribers.length} newsletter subscribers (disabled to avoid sending emails)`);
  return;

  // ORIGINAL CODE - uncomment to enable:
  /*
  for (const subscriber of subscribers) {
    try {
      await payload.create({
        collection: 'newsletter-subscribers',
        data: {
          email: subscriber.email.toLowerCase(),
          source: subscriber.source || 'import',
          status: subscriber.status || 'active',
          subscribedAt: new Date().toISOString(),
        },
      });
    } catch (error) {
      // Skip duplicates silently (unique constraint on email)
      // Payload returns "The following field is invalid: email" for unique constraint violations
      const err = error as Error;
      const isDuplicateError =
        err.message?.includes('duplicate') ||
        err.message?.includes('field is invalid: email') ||
        err.message?.includes('unique');
      if (!isDuplicateError) {
        console.error(`   Error creating subscriber ${subscriber.email}:`, err.message);
      }
    }
  }
  console.log(`   Created ${subscribers.length} newsletter subscribers`);
  */
}

// ================================
// FORMS SEEDING (using Form Builder plugin)
// ================================

/**
 * Form field type definition for seeding
 */
interface FormFieldInput {
  blockType: 'text' | 'email' | 'textarea' | 'select' | 'checkbox' | 'number' | 'message' | 'date'
  name: string
  label?: string
  width?: number
  required?: boolean
  defaultValue?: string | boolean | number
  // For select fields
  options?: Array<{ label: string; value: string }>
  // For message fields (lexical rich text)
  message?: {
    root: {
      type: string
      children: Array<{ type: string; text?: string; children?: Array<{ type: string; text: string }> }>
      direction: 'ltr' | 'rtl' | null
      format: '' | 'left' | 'right' | 'start' | 'center' | 'end' | 'justify'
      indent: number
      version: number
    }
  }
}

/**
 * Lexical rich text format for confirmation messages
 */
interface LexicalRichText {
  root: {
    type: string
    children: Array<{ type: string; children: Array<{ type: string; text: string }> }>
    direction: 'ltr' | 'rtl' | null
    format: '' | 'left' | 'right' | 'start' | 'center' | 'end' | 'justify'
    indent: number
    version: number
  }
}

/**
 * Form type determines how submissions are processed
 */
type FormType = 'contact' | 'newsletter' | 'booking' | 'order' | 'feedback' | 'other'

/**
 * Form input definition for seeding
 */
interface FormInput {
  title: string
  formType: FormType
  fields: FormFieldInput[]
  submitButtonLabel?: string
  confirmationType?: 'message' | 'redirect'
  confirmationMessage?: LexicalRichText
  redirect?: { url: string }
  // emails removed - all notifications go to business-info email
}

/**
 * Seed forms using Form Builder plugin
 * Forms are stored in the 'forms' collection created by the plugin
 */
export async function seedForms(
  payload: Payload,
  forms: FormInput[],
): Promise<Map<string, string>> {
  console.log('📝 Creating forms...');
  const formMap = new Map<string, string>();

  for (const form of forms) {
    try {
      // Use type assertion because Payload's form builder types are complex
      // and our simplified interface is compatible at runtime
      const formData = {
        title: form.title,
        formType: form.formType,
        fields: form.fields.map((field) => ({
          blockType: field.blockType,
          name: field.name,
          label: field.label,
          width: field.width,
          required: field.required,
          defaultValue: field.defaultValue?.toString(),
          options: field.options,
          message: field.message,
        })),
        submitButtonLabel: form.submitButtonLabel || 'Trimite',
        confirmationType: form.confirmationType || 'message',
        confirmationMessage: form.confirmationMessage,
        redirect: form.redirect,
        // emails removed - notifications go to business-info email
      }

      const created = await payload.create({
        collection: 'forms',
        // Cast to Omit<Form, 'id' | ...> - types are complex due to Lexical rich text
        // Multi-tenant: add tenant to form data
        data: withTenant(formData) as Omit<Form, 'id' | 'createdAt' | 'updatedAt'>,
      });

      formMap.set(form.title, created.id);
      console.log(`   Created form: ${form.title}`);
    } catch (error) {
      console.error(`   Error creating form ${form.title}:`, error);
    }
  }

  console.log(`   Created ${formMap.size} forms`);
  return formMap;
}

/**
 * Predefined form templates for common use cases
 */
export const formTemplates = {
  /**
   * Newsletter subscription form
   */
  newsletter: (): FormInput => ({
    title: 'Newsletter',
    formType: 'newsletter',
    submitButtonLabel: 'Aboneaza-te',
    confirmationType: 'message',
    confirmationMessage: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [{ type: 'text', text: 'Te-ai abonat cu succes la newsletter!' }],
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
    fields: [
      {
        blockType: 'email',
        name: 'email',
        label: 'Adresa de email',
        width: 100,
        required: true,
      },
      {
        blockType: 'checkbox',
        name: 'gdpr',
        label: 'Sunt de acord cu politica de confidentialitate',
        required: true,
      },
    ],
  }),

  /**
   * Contact form
   */
  contact: (): FormInput => ({
    title: 'Formular de contact',
    formType: 'contact',
    submitButtonLabel: 'Trimite mesajul',
    confirmationType: 'message',
    confirmationMessage: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [{ type: 'text', text: 'Multumim! Mesajul tau a fost trimis cu succes. Te vom contacta in cel mai scurt timp.' }],
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
    fields: [
      {
        blockType: 'text',
        name: 'lastName',
        label: 'Nume',
        width: 50,
        required: true,
      },
      {
        blockType: 'text',
        name: 'firstName',
        label: 'Prenume',
        width: 50,
        required: true,
      },
      {
        blockType: 'text',
        name: 'phone',
        label: 'Telefon',
        width: 50,
      },
      {
        blockType: 'email',
        name: 'email',
        label: 'Email',
        width: 50,
        required: true,
      },
      {
        blockType: 'text',
        name: 'subject',
        label: 'Subiect',
        width: 100,
      },
      {
        blockType: 'textarea',
        name: 'message',
        label: 'Mesaj',
        width: 100,
        required: true,
      },
    ],
  }),

  /**
   * Booking request form - professional version with date/time
   */
  booking: (
    services: Array<{ label: string; value: string }>,
    teamMembers?: Array<{ label: string; value: string }>,
  ): FormInput => {
    // Generate time slots from 9:00 to 20:00
    const timeSlots = []
    for (let hour = 9; hour <= 20; hour++) {
      timeSlots.push({ label: `${hour}:00`, value: `${hour}:00` })
      if (hour < 20) {
        timeSlots.push({ label: `${hour}:30`, value: `${hour}:30` })
      }
    }

    return {
      title: 'Cerere programare',
      formType: 'booking',
      submitButtonLabel: 'Trimite Cererea',
      confirmationType: 'message',
      confirmationMessage: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [{ type: 'text', text: 'Cererea ta de programare a fost inregistrata cu succes! Te vom contacta in cel mai scurt timp pentru confirmare.' }],
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
      fields: [
        {
          blockType: 'text',
          name: 'lastName',
          label: 'Nume',
          width: 50,
          required: true,
        },
        {
          blockType: 'text',
          name: 'firstName',
          label: 'Prenume',
          width: 50,
          required: true,
        },
        {
          blockType: 'text',
          name: 'phone',
          label: 'Telefon',
          width: 50,
          required: true,
        },
        {
          blockType: 'email',
          name: 'email',
          label: 'Email',
          width: 50,
          required: true,
        },
        {
          blockType: 'select',
          name: 'service',
          label: 'Serviciu dorit',
          width: 100,
          required: true,
          options: services,
        },
        // Optional team member selector
        ...(teamMembers && teamMembers.length > 0
          ? [
              {
                blockType: 'select' as const,
                name: 'teamMember',
                label: 'Specialist preferat',
                width: 100,
                required: false,
                options: [{ label: 'Fara preferinta', value: 'none' }, ...teamMembers],
              },
            ]
          : []),
        {
          blockType: 'date',
          name: 'date',
          label: 'Data preferata',
          width: 50,
          required: true,
        },
        {
          blockType: 'select',
          name: 'time',
          label: 'Ora preferata',
          width: 50,
          required: true,
          options: timeSlots,
        },
        {
          blockType: 'textarea',
          name: 'notes',
          label: 'Mentiuni suplimentare',
          width: 100,
        },
      ],
    }
  },

  /**
   * Subscription order form
   */
  subscriptionOrder: (subscriptions: Array<{ label: string; value: string }>): FormInput => ({
    title: 'Comanda abonament',
    formType: 'order',
    submitButtonLabel: 'Comanda abonamentul',
    confirmationType: 'message',
    confirmationMessage: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [{ type: 'text', text: 'Comanda ta a fost inregistrata. Te vom contacta cu detaliile de plata.' }],
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
    fields: [
      {
        blockType: 'text',
        name: 'lastName',
        label: 'Nume',
        width: 50,
        required: true,
      },
      {
        blockType: 'text',
        name: 'firstName',
        label: 'Prenume',
        width: 50,
        required: true,
      },
      {
        blockType: 'text',
        name: 'phone',
        label: 'Telefon',
        width: 50,
        required: true,
      },
      {
        blockType: 'email',
        name: 'email',
        label: 'Email',
        width: 50,
        required: true,
      },
      {
        blockType: 'select',
        name: 'subscription',
        label: 'Abonament ales',
        width: 100,
        required: true,
        options: subscriptions,
      },
      {
        blockType: 'textarea',
        name: 'notes',
        label: 'Observatii',
        width: 100,
      },
    ],
  }),
}

/**
 * Helper to create contact page layout with composable blocks
 *
 * Architecture:
 * - ContactInfo block: displays business contact details (address, phone, email, hours, social)
 * - Form block: displays the contact form
 * - Map block: displays the Google Maps embed
 *
 * These can be composed using the Content block with columns for flexible layouts.
 *
 * Layout options:
 * - 'side-by-side': Contact info on left, form on right (default)
 * - 'stacked': Contact info on top, form below
 * - 'form-only': Just the form
 * - 'info-only': Just contact info
 */
export function createContactPageLayout(contactFormId: string | undefined, options?: {
  heading?: string
  subheading?: string
  showMap?: boolean
  layout?: 'side-by-side' | 'stacked' | 'form-only' | 'info-only'
  mapHeading?: string
}): Page['layout'] {
  const {
    heading = 'Informatii de Contact',
    subheading = 'Gaseste-ne sau contacteaza-ne direct',
    showMap = true,
    layout = 'side-by-side',
    mapHeading = 'Unde ne gasesti',
  } = options || {}

  const blocks: Page['layout'] = []

  // Form-only layout
  if (layout === 'form-only' && contactFormId) {
    blocks.push({
      blockType: 'formBlock' as const,
      form: contactFormId,
      variant: 'card' as const,
      enableIntro: true,
      heading: 'Contacteaza-ne',
      subheading: 'Completeaza formularul si te vom contacta in cel mai scurt timp',
      backgroundColor: 'light' as const,
    })
  }
  // Info-only layout
  else if (layout === 'info-only') {
    blocks.push({
      blockType: 'contact' as const,
      variant: 'standard' as const,
      heading,
      subheading,
      backgroundColor: 'light' as const,
    })
  }
  // Stacked layout
  else if (layout === 'stacked') {
    // Contact info section
    blocks.push({
      blockType: 'contact' as const,
      variant: 'cards' as const,
      heading,
      subheading,
      backgroundColor: 'light' as const,
    })
    // Form section
    if (contactFormId) {
      blocks.push({
        blockType: 'formBlock' as const,
        form: contactFormId,
        variant: 'card' as const,
        enableIntro: true,
        heading: 'Trimite-ne un Mesaj',
        subheading: 'Completeaza formularul si te vom contacta in cel mai scurt timp',
        backgroundColor: 'default' as const,
      })
    }
  }
  // Side-by-side layout (default) - using Content block with columns
  // Layout inspired by old design: info 40% left, form 60% right
  else {
    blocks.push({
      blockType: 'content' as const,
      backgroundColor: 'light' as const,
      paddingTop: 'large' as const,
      paddingBottom: 'large' as const,
      columns: [
        // Left column - Contact info (40%)
        {
          width: '40' as const,
          alignment: 'top' as const,
          contentType: 'blocks' as const,
          blocks: [
            {
              blockType: 'contact' as const,
              variant: 'standard' as const,
              heading,
              subheading,
              backgroundColor: 'default' as const,
            },
          ],
        },
        // Right column - Contact form (60%)
        ...(contactFormId
          ? [
              {
                width: '60' as const,
                alignment: 'top' as const,
                contentType: 'blocks' as const,
                blocks: [
                  {
                    blockType: 'formBlock' as const,
                    form: contactFormId,
                    variant: 'card' as const,
                    enableIntro: true,
                    heading: 'Trimite-ne un Mesaj',
                    subheading: 'Completeaza formularul si te vom contacta in cel mai scurt timp',
                    backgroundColor: 'default' as const,
                  },
                ],
              },
            ]
          : []),
      ],
    })
  }

  // Map section below (optional) - using dedicated Map block
  if (showMap) {
    blocks.push({
      blockType: 'map' as const,
      variant: 'contained' as const,
      heading: mapHeading,
      source: 'businessInfo' as const,
      height: 'medium' as const,
      showDirectionsButton: true,
    })
  }

  return blocks
}

// Helper to seed system pages (shop, cart, checkout configuration)
export async function seedSystemPages(
  payload: Payload,
  data?: Partial<SystemPage>,
) {
  const defaultData: Partial<SystemPage> = {
    productsPage: {
      title: 'Produsele Noastre',
      description: 'Descopera intreaga gama de produse naturale si eco-friendly',
      productsPerPage: 24,
      gridColumns: '4',
      defaultSort: 'newest',
      showFilters: true,
      showSearch: true,
      showSort: true,
      filterOptions: {
        showCategoryFilter: true,
        showPriceFilter: true,
        showStockFilter: true,
      },
      seo: {
        metaTitle: 'Produse | {siteName}',
        metaDescription: 'Descopera toate produsele naturale si eco-friendly. Livrare rapida in toata tara.',
      },
    },
    labels: {
      filtersTitle: 'Filtre',
      categoriesTitle: 'Categorii',
      priceTitle: 'Pret',
      stockTitle: 'Disponibilitate',
      inStockLabel: 'Doar produse in stoc',
      sortLabel: 'Sorteaza:',
      resultsText: 'Afisam {count} din {total} produse',
      noResultsText: 'Nu am gasit produse care sa corespunda cautarii.',
      clearFiltersText: 'Sterge filtrele',
      searchPlaceholder: 'Cauta produse...',
      mobileFiltersButton: 'Filtre',
      mobileApplyFilters: 'Aplica filtre',
    },
    cartPage: {
      title: 'Cosul tau',
      emptyCartMessage: 'Cosul tau este gol.',
      continueShoppingText: 'Continua cumparaturile',
      continueShoppingLink: '/produse',
    },
    checkoutPage: {
      title: 'Finalizare comanda',
      successMessage: 'Multumim pentru comanda! Vei primi un email de confirmare.',
    },
    accountPages: {
      dashboardTitle: 'Contul meu',
      dashboardDescription: 'Bine ai revenit! Gestioneaza contul tau de aici.',
      addressesTitle: 'Adresele mele',
      addressesDescription: 'Gestioneaza adresele tale de livrare si facturare salvate.',
      ordersTitle: 'Comenzile mele',
      ordersDescription: 'Vezi istoricul comenzilor tale.',
      noOrdersMessage: 'Nu ai nicio comanda inca.',
      loginTitle: 'Autentificare',
      loginDescription: 'Intra in contul tau pentru a vedea comenzile si adresele salvate.',
      loginButton: 'Autentificare',
      registerTitle: 'Creeaza cont',
      registerDescription: 'Creeaza un cont pentru a beneficia de avantaje exclusive.',
      registerButton: 'Creeaza cont',
      menuDashboard: 'Dashboard',
      menuOrders: 'Comenzile mele',
      menuAddresses: 'Adrese',
      menuLogout: 'Deconectare',
    },
  }

  // Merge default data with provided data
  const mergedData = {
    ...defaultData,
    ...data,
  }

  // Multi-tenant: create in tenant-system-pages collection
  if (!hasSeedTenant()) {
    throw new Error('Multi-tenant mode required: Set SEED_TYPE environment variable');
  }
  await payload.create({
    collection: 'tenant-system-pages',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: withTenant(mergedData) as any,
  });
  console.log('   System pages configured')
}

// Helper to configure shop settings (ecommerce master switch)
export async function seedShopSettings(
  payload: Payload,
  data: {
    enabled: boolean
    shopName?: string
    currency?: 'RON' | 'EUR' | 'USD'
    currencySymbol?: string
    vatEnabled?: boolean
    pricesIncludeVat?: boolean
    shippingCost?: number
    freeShippingThreshold?: number
  },
) {
  const shopData = {
    enabled: data.enabled,
    shopName: data.shopName || 'Magazin',
    currency: data.currency || 'RON',
    currencySymbol: data.currencySymbol || 'lei',
    pricePosition: 'after',
    vatEnabled: data.vatEnabled ?? true,
    pricesIncludeVat: data.pricesIncludeVat ?? true,
    displayPricesWithVat: true,
    vatRates: {
      standard: 19,
      reduced: 9,
      zero: 0,
    },
    defaultVatRate: 'standard',
    shippingCost: data.shippingCost,
    freeShippingThreshold: data.freeShippingThreshold,
  };

  // Multi-tenant: create in tenant-shop-settings collection
  if (!hasSeedTenant()) {
    throw new Error('Multi-tenant mode required: Set SEED_TYPE environment variable');
  }
  await payload.create({
    collection: 'tenant-shop-settings',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: withTenant(shopData) as any,
  });
  console.log(`   Shop settings configured (enabled: ${data.enabled})`)
}
