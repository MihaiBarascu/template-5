// @ts-nocheck
import type { Payload } from 'payload'
import type { Media } from '@/payload-types'
import path from 'path'
import fs from 'fs'

// Image cache to avoid re-uploading the same image
const imageCache: Map<string, string> = new Map()

// Clear the image cache - call before each seed run
export function clearImageCache(): void {
  imageCache.clear()
  console.log('   Image cache cleared')
}

// Helper to upload image from URL
export async function uploadImageFromURL(
  payload: Payload,
  url: string,
  filename: string,
  alt: string
): Promise<string | null> {
  // Check cache first
  const cacheKey = `${url}-${filename}`
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey) || null
  }

  try {
    console.log(`   Downloading: ${filename}...`)
    const response = await fetch(url)
    if (!response.ok) {
      console.error(`   Failed to fetch image: ${url}`)
      return null
    }

    const buffer = await response.arrayBuffer()
    const tempDir = path.join(process.cwd(), 'temp-uploads')

    // Create temp directory if it doesn't exist
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }

    const tempFilePath = path.join(tempDir, filename)
    fs.writeFileSync(tempFilePath, Buffer.from(buffer))

    // Get content type from response
    const contentType = response.headers.get('content-type') || 'image/jpeg'

    // Upload to Payload
    const media = await payload.create({
      collection: 'media',
      data: {
        alt,
      },
      filePath: tempFilePath,
    })

    // Clean up temp file
    fs.unlinkSync(tempFilePath)

    // Cache the result
    imageCache.set(cacheKey, media.id)
    console.log(`   Uploaded: ${filename}`)

    return media.id
  } catch (error) {
    console.error(`   Error uploading image ${filename}:`, error)
    return null
  }
}

// Helper to upload multiple images and return their IDs
export async function uploadImages(
  payload: Payload,
  images: Array<{ url: string; filename: string; alt: string }>
): Promise<Map<string, string>> {
  const imageMap = new Map<string, string>()

  for (const image of images) {
    const mediaId = await uploadImageFromURL(payload, image.url, image.filename, image.alt)
    if (mediaId) {
      imageMap.set(image.filename, mediaId)
    }
  }

  return imageMap
}

// Helper to upload images from seed-data definitions
export async function uploadSeedImages(
  payload: Payload,
  baseUrl: string,
  images: Array<{ filename: string; alt: string }>
): Promise<Map<string, string>> {
  const imageMap = new Map<string, string>()

  console.log(`\n📸 Uploading ${images.length} images...`)

  for (const image of images) {
    const fullUrl = baseUrl + image.filename
    const filenameOnly = image.filename.split('/').pop() || image.filename
    const mediaId = await uploadImageFromURL(payload, fullUrl, filenameOnly, image.alt)
    if (mediaId) {
      imageMap.set(image.filename, mediaId)
    }
  }

  console.log(`   ✅ Uploaded ${imageMap.size}/${images.length} images\n`)
  return imageMap
}

// Helper to upload local image from filesystem
export async function uploadLocalImage(
  payload: Payload,
  filePath: string,
  alt: string
): Promise<string | null> {
  // Check cache first
  const cacheKey = `local-${filePath}`
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey) || null
  }

  try {
    const filename = path.basename(filePath)
    console.log(`   Uploading local: ${filename}...`)

    if (!fs.existsSync(filePath)) {
      console.error(`   File not found: ${filePath}`)
      return null
    }

    // Upload to Payload
    const media = await payload.create({
      collection: 'media',
      data: {
        alt,
      },
      filePath: filePath,
    })

    // Cache the result
    imageCache.set(cacheKey, media.id)
    console.log(`   Uploaded: ${filename}`)

    return media.id
  } catch (error) {
    console.error(`   Error uploading local image ${filePath}:`, error)
    return null
  }
}

// Helper to upload local seed images from public/images folder
export async function uploadLocalSeedImages(
  payload: Payload,
  images: Array<{ filename: string; alt: string }>
): Promise<Map<string, string>> {
  const imageMap = new Map<string, string>()
  const publicImagesDir = path.join(process.cwd(), 'public', 'images')

  console.log(`\n📸 Uploading ${images.length} local images...`)

  for (const image of images) {
    const localPath = path.join(publicImagesDir, image.filename)
    const mediaId = await uploadLocalImage(payload, localPath, image.alt)
    if (mediaId) {
      imageMap.set(image.filename, mediaId)
    }
  }

  console.log(`   ✅ Uploaded ${imageMap.size}/${images.length} images\n`)
  return imageMap
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
  })

  if (existingUser.docs.length === 0) {
    await payload.create({
      collection: 'users',
      data: {
        email: 'admin@example.com',
        password: 'admin123',
        name: 'Administrator',
      },
    })
    console.log('   Created admin user')
  }
}

// Helper to seed theme
export async function seedTheme(
  payload: Payload,
  options: {
    preset?: 'modern' | 'classic' | 'bold' | 'custom'
    colors?: {
      primary: string
      secondary: string
      accent: string
      dark: string
      light: string
      surface: string
      text: string
      textLight: string
      border: string
    }
    fontPreset?: 'modern' | 'elegant' | 'bold' | 'minimalist'
    stylePreset?: 'modern' | 'classic' | 'bold'
    borderRadius?: 'none' | 'small' | 'medium' | 'large' | 'full'
    shadows?: 'none' | 'subtle' | 'moderate' | 'strong'
    sectionSpacing?: 'compact' | 'normal' | 'spacious'
    containerWidth?: string
  }
) {
  await payload.updateGlobal({
    slug: 'theme',
    data: {
      preset: options.preset || 'modern',
      colors: options.colors,
      fontPreset: options.fontPreset || 'modern',
      stylePreset: options.stylePreset || 'modern',
      borderRadius: options.borderRadius || 'medium',
      shadows: options.shadows || 'subtle',
      sectionSpacing: options.sectionSpacing || 'normal',
      containerWidth: options.containerWidth || '1280',
    },
  })
  console.log('   Theme configured')
}

// Helper to seed business info
export async function seedBusinessInfo(
  payload: Payload,
  data: {
    name: string
    tagline?: string
    description?: string
    yearEstablished?: number
    phone?: string
    phoneSecondary?: string
    email?: string
    whatsapp?: string
    address?: {
      street?: string
      city?: string
      county?: string
      postalCode?: string
      country?: string
    }
    workingHours?: Array<{ days: string; hours: string }>
    social?: {
      facebook?: string
      instagram?: string
      tiktok?: string
      youtube?: string
      linkedin?: string
    }
    stats?: Array<{ value: string; label: string }>
    googleMapsEmbed?: string
    googleMapsLink?: string
  }
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
    },
  })
  console.log('   Business info configured')
}

// Helper to seed logo
export async function seedLogo(
  payload: Payload,
  data: {
    type: 'text' | 'image' | 'both'
    text?: string
  }
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
  })
  console.log('   Logo configured')
}

// Helper to seed header
export async function seedHeader(
  payload: Payload,
  data: {
    variant?: string
    navItems: Array<{
      label: string
      type: 'reference' | 'custom'
      url?: string
    }>
    ctaButton?: {
      enabled: boolean
      label: string
      link: string
      variant?: string
    }
  }
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
  })
  console.log('   Header configured')
}

// Helper to seed footer
export async function seedFooter(
  payload: Payload,
  data: {
    variant?: string
    columns?: Array<{
      title: string
      type: 'links' | 'contact' | 'schedule' | 'text' | 'social'
      links?: Array<{ label: string; type: 'custom'; url: string }>
    }>
    legalLinks?: Array<{ label: string; type: 'custom'; url: string }>
  }
) {
  await payload.updateGlobal({
    slug: 'footer',
    data: {
      variant: data.variant || 'columns-4',
      columns: data.columns,
      showSocialLinks: true,
      showContactInfo: true,
      copyright: '© {year} {businessName}. Toate drepturile rezervate.',
      legalLinks: data.legalLinks || [
        { label: 'Politica de confidentialitate', type: 'custom', url: '/politica-confidentialitate' },
        { label: 'Termeni si conditii', type: 'custom', url: '/termeni-conditii' },
      ],
    },
  })
  console.log('   Footer configured')
}

// Helper to create services
export async function seedServices(
  payload: Payload,
  services: Array<{
    title: string
    shortDescription?: string
    price?: number
    priceFrom?: boolean
    duration?: string
    icon?: string
    featured?: boolean
    order?: number
    features?: string[]
  }>
) {
  for (const service of services) {
    await payload.create({
      collection: 'services',
      data: {
        title: service.title,
        slug: service.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
        shortDescription: service.shortDescription,
        price: service.price,
        priceFrom: service.priceFrom || false,
        duration: service.duration,
        icon: service.icon,
        featured: service.featured || false,
        order: service.order || 0,
        features: service.features?.map((f) => ({ feature: f })),
      },
    })
  }
  console.log(`   Created ${services.length} services`)
}

// Helper to create team members with optional images
export async function seedTeam(
  payload: Payload,
  members: Array<{
    name: string
    role: string
    experience?: string
    featured?: boolean
    order?: number
    specializations?: string[]
    imageId?: string // Optional media ID for photo
  }>
) {
  for (const member of members) {
    await payload.create({
      collection: 'team',
      data: {
        name: member.name,
        slug: member.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
        role: member.role,
        experience: member.experience,
        featured: member.featured || false,
        order: member.order || 0,
        specializations: member.specializations?.map((s) => ({ specialization: s })),
        image: member.imageId || undefined,
      },
    })
  }
  console.log(`   Created ${members.length} team members`)
}

// Helper to create testimonials
export async function seedTestimonials(
  payload: Payload,
  testimonials: Array<{
    name: string
    role?: string
    content: string
    rating?: string
    featured?: boolean
  }>
) {
  for (const testimonial of testimonials) {
    await payload.create({
      collection: 'testimonials',
      data: {
        name: testimonial.name,
        role: testimonial.role,
        content: testimonial.content,
        rating: testimonial.rating || '5',
        featured: testimonial.featured || true,
      },
    })
  }
  console.log(`   Created ${testimonials.length} testimonials`)
}

// Helper to create FAQ
export async function seedFAQ(
  payload: Payload,
  faqs: Array<{
    question: string
    answer: string
    order?: number
  }>
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
                children: [{ text: faq.answer }],
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
    })
  }
  console.log(`   Created ${faqs.length} FAQs`)
}

// Helper to create price packages
export async function seedPricePackages(
  payload: Payload,
  packages: Array<{
    title: string
    subtitle?: string
    description?: string
    price: number
    oldPrice?: number
    period?: 'luna' | 'an' | 'unic' | 'sedinta' | 'ora' | 'zi'
    features?: Array<{ feature: string; included?: boolean }>
    cta?: { label?: string; link?: string }
    highlighted?: boolean
    highlightLabel?: string
    order?: number
  }>
) {
  for (const pkg of packages) {
    await payload.create({
      collection: 'price-packages',
      data: {
        title: pkg.title,
        subtitle: pkg.subtitle,
        description: pkg.description,
        price: pkg.price,
        oldPrice: pkg.oldPrice,
        period: pkg.period || 'unic',
        features: pkg.features,
        cta: pkg.cta || { label: 'Alege pachetul', link: '/programare' },
        highlighted: pkg.highlighted || false,
        highlightLabel: pkg.highlightLabel || 'Cel mai popular',
        order: pkg.order || 0,
      },
    })
  }
  console.log(`   Created ${packages.length} price packages`)
}

// Helper to create homepage with optional hero image
export async function seedHomePage(
  payload: Payload,
  data: {
    heroType?: string
    hero?: {
      headline?: string
      subheadline?: string
      ctaButtons?: Array<{ label: string; link: string; variant?: string }>
      imageId?: string // Optional hero background image
    }
    layout?: Array<{
      blockType: string
      [key: string]: any
    }>
  }
) {
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Acasa',
      slug: 'home',
      heroType: data.heroType || 'centered',
      hero: {
        headline: data.hero?.headline,
        subheadline: data.hero?.subheadline,
        ctaButtons: data.hero?.ctaButtons,
        image: data.hero?.imageId || undefined,
      },
      layout: data.layout || [],
      _status: 'published',
    },
  })
  console.log('   Created homepage')
}

// Helper to create portfolio/gallery items
export async function seedPortfolio(
  payload: Payload,
  items: Array<{
    title: string
    description?: string
    imageId: string
    featured?: boolean
    order?: number
  }>
) {
  for (const item of items) {
    await payload.create({
      collection: 'portfolio',
      data: {
        title: item.title,
        slug: item.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
        shortDescription: item.description,
        featuredImage: item.imageId,
        featured: item.featured || false,
        order: item.order || 0,
      },
    })
  }
  console.log(`   Created ${items.length} portfolio items`)
}

// Helper to create product categories
export async function seedProductCategories(
  payload: Payload,
  categories: Array<{
    title: string
    description?: string
    order?: number
  }>
): Promise<Map<string, string>> {
  const categoryMap = new Map<string, string>()

  for (const category of categories) {
    const created = await payload.create({
      collection: 'product-categories',
      data: {
        title: category.title,
        slug: category.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
        description: category.description,
        order: category.order || 0,
      },
    })
    categoryMap.set(category.title, created.id)
  }
  console.log(`   Created ${categories.length} product categories`)
  return categoryMap
}

// Helper to create products (eCommerce plugin)
export async function seedProducts(
  payload: Payload,
  products: Array<{
    title: string
    slug: string
    description?: string
    price: number
    salePrice?: number
    badge?: string
    featured?: boolean
    categoryId?: string
    imageId?: string
  }>
) {
  for (const product of products) {
    const productData: any = {
      title: product.title,
      slug: product.slug,
      price: product.price,
      badge: product.badge,
      featured: product.featured || false,
      _status: 'published',
    }

    // Add sale price if present
    if (product.salePrice) {
      productData.salePrice = product.salePrice
    }

    // Add category if present
    if (product.categoryId) {
      productData.category = product.categoryId
    }

    // Add image if present
    if (product.imageId) {
      productData.images = [{ image: product.imageId }]
    }

    // Add description as richText if present
    if (product.description) {
      productData.description = {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [{ text: product.description }],
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      }
    }

    await payload.create({
      collection: 'products',
      data: productData,
    })
  }
  console.log(`   Created ${products.length} products`)
}

// Helper to create blog posts
export async function seedPosts(
  payload: Payload,
  posts: Array<{
    title: string
    excerpt?: string
    content: string
    publishedAt?: string
    featured?: boolean
    imageId?: string
  }>
) {
  // First create a default category if it doesn't exist
  let categoryId: string | undefined

  try {
    const existingCategories = await payload.find({
      collection: 'categories',
      limit: 1,
    })

    if (existingCategories.docs.length === 0) {
      const category = await payload.create({
        collection: 'categories',
        data: {
          title: 'Blog',
          slug: 'blog',
        },
      })
      categoryId = category.id
    } else {
      categoryId = existingCategories.docs[0].id
    }
  } catch (e) {
    // Categories collection might not exist
  }

  for (const post of posts) {
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
            children: post.content.split('\n\n').map((paragraph) => ({
              type: 'paragraph',
              children: [{ text: paragraph }],
            })),
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
    })
  }
  console.log(`   Created ${posts.length} blog posts`)
}

// Helper to create blog categories
export async function seedBlogCategories(
  payload: Payload,
  categories: Array<{
    title: string
    description?: string
  }>
): Promise<Map<string, string>> {
  const categoryMap = new Map<string, string>()

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
    })
    categoryMap.set(category.title, created.id)
  }
  console.log(`   Created ${categories.length} blog categories`)
  return categoryMap
}

// Helper to set design variant global
export async function seedDesignVariant(
  payload: Payload,
  data: {
    businessType: string
    variantIndex: number
    variantName: string
    variantDescription: string
  }
) {
  await payload.updateGlobal({
    slug: 'design-variant',
    data: {
      businessType: data.businessType,
      variantIndex: String(data.variantIndex),
      variantDescription: `${data.variantName}\n\n${data.variantDescription}`,
      useOverride: false,
      homepageSections: [
        { section: 'hero', enabled: true },
        { section: 'services', enabled: true },
        { section: 'stats', enabled: true },
        { section: 'team', enabled: true },
        { section: 'testimonials', enabled: true },
        { section: 'gallery', enabled: true },
        { section: 'faq', enabled: true },
        { section: 'cta', enabled: true },
      ],
    },
  })
  console.log(`   Design variant set: ${data.variantName}`)
}
