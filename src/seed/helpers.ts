import type { Page, SiteTheme, Service, Product, Post, Form, SystemPage } from '@/payload-types';
import fs from 'fs';
import path from 'path';
import type { Payload } from 'payload';

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

// Helper to find existing image by filename in media collection
async function findExistingImage(payload: Payload, filename: string): Promise<string | null> {
  try {
    const existing = await payload.find({
      collection: 'media',
      where: {
        filename: { equals: filename },
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
      data: {
        alt,
      },
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
      data: {
        alt,
      },
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

// Helper to upload local seed images from public/images folder
export async function uploadLocalSeedImages(
  payload: Payload,
  images: Array<{ filename: string; alt: string }>,
): Promise<Map<string, string>> {
  const imageMap = new Map<string, string>();
  const publicImagesDir = path.join(process.cwd(), 'public', 'images');

  console.log(`\n📸 Uploading ${images.length} local images...`);

  for (const image of images) {
    const localPath = path.join(publicImagesDir, image.filename);
    const mediaId = await uploadLocalImage(payload, localPath, image.alt);
    if (mediaId) {
      imageMap.set(image.filename, mediaId);
    }
  }

  console.log(`   ✅ Uploaded ${imageMap.size}/${images.length} images\n`);
  return imageMap;
}

// Helper to create admin user
export async function createAdminUser(payload: Payload) {
  const existingUser = await payload.find({
    collection: 'users',
    where: {
      email: {
        equals: 'admin@example.com',
      },
    },
  });

  if (existingUser.docs.length === 0) {
    await payload.create({
      collection: 'users',
      data: {
        email: 'admin@example.com',
        password: 'admin123',
        name: 'Administrator',
        role: 'admin',
      },
    });
    console.log('   Created admin user');
  } else {
    // Ensure existing admin@example.com user has admin role
    const user = existingUser.docs[0];
    if (user.role !== 'admin') {
      await payload.update({
        collection: 'users',
        id: user.id,
        data: {
          role: 'admin',
        },
      });
      console.log(`   Updated user ${user.email} role to admin (was: ${user.role || 'undefined'})`);
    } else {
      console.log(`   Admin user already exists with correct role`);
    }
  }
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
    useCustomColors?: boolean;
    colors?: SiteTheme['colors'];
    useCustomFonts?: boolean;
    fonts?: SiteTheme['fonts'];
  },
) {
  await payload.updateGlobal({
    slug: 'site-theme',
    data: {
      variant: options.variant,
      borderRadius: options.borderRadius,
      shadows: options.shadows,
      animations: options.animations,
      containerWidth: options.containerWidth,
      sectionSpacing: options.sectionSpacing,
      useCustomColors: options.useCustomColors || false,
      colors: options.colors,
      useCustomFonts: options.useCustomFonts || false,
      fonts: options.fonts,
    },
  });
  console.log(`   Site theme configured: ${options.variant}`);
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
  },
) {
  await payload.updateGlobal({
    slug: 'business-info',
    data: {
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
    },
  });
  console.log('   Business info configured');
}

// Helper to seed logo
export async function seedLogo(
  payload: Payload,
  data: {
    type: 'text' | 'image' | 'both';
    text?: string;
  },
) {
  await payload.updateGlobal({
    slug: 'logo',
    data: {
      type: data.type,
      text: data.text,
      size: {
        height: 40,
        heightMobile: 32,
      },
    },
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
      | 'transparent';
    navItems: NavItem[];
    ctaButton?: {
      enabled: boolean;
      label: string;
      link: string;
      variant?: 'default' | 'outline' | 'ghost';
    };
  },
) {
  await payload.updateGlobal({
    slug: 'header',
    data: {
      variant: data.variant || 'standard',
      navItems: data.navItems,
      ctaButton: data.ctaButton || {
        enabled: true,
        label: 'Contact',
        link: '/contact',
        variant: 'default',
      },
      sticky: true,
    },
  });
  console.log('   Header configured');
}

// Helper to seed footer
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
  await payload.updateGlobal({
    slug: 'footer',
    data: {
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
      // Background texture (imagine mare pe tot footer-ul)
      backgroundImage: data.backgroundImageId || null,
      backgroundOpacity: data.backgroundOpacity ?? 20,
      // Decorative element (PNG pozitionat intr-o parte, ca la Elyssium)
      decorativeImage: data.decorativeImageId || null,
      decorativePosition: data.decorativePosition || 'left',
      decorativeOpacity: data.decorativeOpacity ?? 30,
      decorativeSize: data.decorativeSize || 'medium',
    },
  });
  console.log('   Footer configured');
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
      data: {
        title: service.title,
        slug,
        shortDescription: service.shortDescription,
        description: service.description,
        icon: service.icon,
        image: service.imageId || undefined,
        featured: service.featured || false,
        active: service.active !== false,
        order: service.order || 0,
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
      },
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
    experience?: string;
    featured?: boolean;
    order?: number;
    specializations?: string[];
    imageId?: string; // Optional media ID for photo
  }>,
) {
  for (const member of members) {
    await payload.create({
      collection: 'team',
      data: {
        name: member.name,
        slug: member.name
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]/g, ''),
        role: member.role,
        experience: member.experience,
        featured: member.featured || false,
        order: member.order || 0,
        specializations: member.specializations?.map(s => ({
          specialization: s,
        })),
        image: member.imageId || undefined,
      },
    });
  }
  console.log(`   Created ${members.length} team members`);
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
  }>,
) {
  type RatingType = '1' | '2' | '3' | '4' | '5';
  for (const testimonial of testimonials) {
    await payload.create({
      collection: 'testimonials',
      data: {
        name: testimonial.name,
        role: testimonial.role,
        content: testimonial.content,
        rating: (testimonial.rating || '5') as RatingType,
        featured: testimonial.featured || true,
      },
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
      data: {
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
      },
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
      // Overlay settings
      overlayEnabled?: boolean;
      overlayOpacity?: string;
      overlayStyle?: string;
      // Other hero settings
      height?: 'small' | 'medium' | 'large' | 'fullscreen';
      badge?: string;
      showScrollIndicator?: boolean;
    };
    layout?: Array<{
      blockType: string;
      [key: string]: unknown;
    }>;
  },
) {
  await payload.create({
    collection: 'pages',
    data: {
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
        // Overlay settings - default to enabled with gradient style
        overlayEnabled: data.hero?.overlayEnabled ?? true,
        overlayOpacity: (data.hero?.overlayOpacity || '60') as OverlayOpacity,
        overlayStyle: (data.hero?.overlayStyle || 'gradient') as OverlayStyle,
        // Other hero settings
        height: data.hero?.height || 'large',
        badge: data.hero?.badge,
        showScrollIndicator: data.hero?.showScrollIndicator ?? false,
      },
      layout: (data.layout || []) as Page['layout'],
      _status: 'published',
    },
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
  }>,
) {
  for (const item of items) {
    await payload.create({
      collection: 'portfolio',
      data: {
        title: item.title,
        slug: item.title
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]/g, ''),
        shortDescription: item.description,
        featuredImage: item.imageId,
        featured: item.featured || false,
        order: item.order || 0,
      },
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
      data: {
        title: category.title,
        slug: category.title
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]/g, ''),
        description: category.description,
        order: category.order || 0,
      },
    });
    categoryMap.set(category.title, created.id);
  }
  console.log(`   Created ${categories.length} product categories`);
  return categoryMap;
}

// Product data type for seeding - uses Payload generated types with Omit for auto-generated fields
type ProductSeedData = Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>> &
  Pick<Product, 'title' | 'slug'> &
  { _status: 'published' | 'draft'; priceInRON?: number }

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
      _status: 'published',
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
      data: productData,
    });
  }
  console.log(`   Created ${products.length} products`);
}

// Helper to create rich text node
function createTextNode(text: string, format: number = 0) {
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

// Helper to create paragraph node
function createParagraph(text: string) {
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

// Helper to create heading node
function createHeading(text: string, tag: 'h1' | 'h2' | 'h3' | 'h4' = 'h2') {
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
function createBanner(text: string, style: 'info' | 'warning' | 'success' | 'error' = 'info') {
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
function createMediaBlock(mediaId: string) {
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
  // First create a default category if it doesn't exist
  let categoryId: string | undefined;

  try {
    const existingCategories = await payload.find({
      collection: 'categories',
      limit: 1,
    });

    if (existingCategories.docs.length === 0) {
      const category = await payload.create({
        collection: 'categories',
        data: {
          title: 'Blog',
          slug: 'blog',
        },
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
      data: {
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
        _status: 'published',
      },
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
      data: {
        title: category.title,
        slug: category.title
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]/g, ''),
      },
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
      data: {
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
      },
    });
  }
  console.log(`   Created ${subscriptions.length} subscriptions`);
}

// Helper to seed sample newsletter subscribers for demo purposes
export async function seedNewsletterSubscribers(
  payload: Payload,
  subscribers: Array<{
    email: string;
    source?: 'website' | 'footer' | 'popup' | 'page' | 'import' | 'manual';
    status?: 'active' | 'unsubscribed' | 'bounced';
  }>,
) {
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
        data: formData as Omit<Form, 'id' | 'createdAt' | 'updatedAt'>,
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
      contactInfoItems: {
        showAddress: true,
        showPhone: true,
        showEmail: true,
        showWorkingHours: true,
        showSocial: true,
      },
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
      contactInfoItems: {
        showAddress: true,
        showPhone: true,
        showEmail: true,
        showWorkingHours: true,
        showSocial: false,
      },
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
              contactInfoItems: {
                showAddress: true,
                showPhone: true,
                showEmail: true,
                showWorkingHours: true,
                showSocial: true,
              },
              backgroundColor: 'transparent' as const,
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

  await payload.updateGlobal({
    slug: 'system-pages',
    data: mergedData,
  })
  console.log('   System pages configured')
}
