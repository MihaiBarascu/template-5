import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Page, Portfolio, Service, Category } from '@/payload-types'
import type { Where } from 'payload'

// Import block components
import { ServicesBlock } from './Services/Component'
import { StatsBlock } from './Stats/Component'
import { TeamBlock } from './Team/Component'
import { TestimonialsBlock } from './Testimonials/Component'
import { FAQBlock } from './FAQ/Component'
import { CTABlock } from './CTA/Component'
import { ContactBlockWithSuspense as ContactBlock } from './Contact/Component'
import { GalleryBlock } from './Gallery/Component'
import { PricingBlock } from './Pricing/Component'
import { BookingBlock } from './Booking/Component'
import { ProductsBlock } from './Products/Component'
import { CartBlock } from './Cart/Component'
import { CheckoutBlock } from './Checkout/Component'
import { VideoEmbedBlock } from './VideoEmbed/Component'
import { PriceListDottedBlock } from './PriceListDotted/Component'
import { BeforeAfterBlock } from './BeforeAfter/Component'
import { NewsletterBlock } from './Newsletter/Component'
import { TrustBadgesBlock } from './TrustBadges/Component'
import { HowItWorksBlock } from './HowItWorks/Component'
import { LogoCloudBlock } from './LogoCloud/Component'
import { LatestPostsBlock } from './LatestPosts/Component'
// New blocks from research
import { OpeningHoursBlock } from './OpeningHours/Component'
import { LocationsBlock } from './Locations/Component'
import { BrandLogosBlock } from './BrandLogos/Component'
import { TimelineBlock } from './Timeline/Component'
import { AnnouncementBarBlock } from './AnnouncementBar/Component'
// Universal blocks
import { SubscriptionCardsBlock } from './SubscriptionCards/Component'
import { ScheduleTableBlock } from './ScheduleTable/Component'
import { TeamMemberDetailBlock } from './TeamMemberDetail/Component'
import { ServiceDetailBlock } from './ServiceDetail/Component'
// Content block
import { ContentBlock } from './Content/Component'

type LayoutBlock = NonNullable<Page['layout']>[number]

interface BlockParams {
  limit?: number | null
  onlyFeatured?: boolean | null
  onlySale?: boolean | null
  filterByCategory?: string | null
}

interface RenderBlocksProps {
  blocks: LayoutBlock[]
}

// Fetch services data
async function getServices(block: BlockParams) {
  const payload = await getPayload({ config: configPromise })

  const where: Where = {}
  if (block.onlyFeatured) {
    where.featured = { equals: true }
  }

  const services = await payload.find({
    collection: 'services',
    where,
    limit: block.limit || 6,
    sort: 'order',
  })

  return services.docs
}

// Fetch team members
async function getTeamMembers(block: BlockParams) {
  const payload = await getPayload({ config: configPromise })

  const where: Where = {}
  if (block.onlyFeatured) {
    where.featured = { equals: true }
  }

  const team = await payload.find({
    collection: 'team',
    where,
    limit: block.limit || 4,
    sort: 'order',
  })

  return team.docs
}

// Fetch testimonials
async function getTestimonials(block: BlockParams) {
  const payload = await getPayload({ config: configPromise })

  const where: Where = {}
  if (block.onlyFeatured) {
    where.featured = { equals: true }
  }

  const testimonials = await payload.find({
    collection: 'testimonials',
    where,
    limit: block.limit || 6,
  })

  return testimonials.docs
}

// Fetch FAQs
async function getFAQs(block: BlockParams) {
  const payload = await getPayload({ config: configPromise })

  const faqs = await payload.find({
    collection: 'faq',
    limit: block.limit || 10,
    sort: 'order',
  })

  return faqs.docs
}

// Fetch posts (blog articles)
async function getPosts(block: BlockParams) {
  const payload = await getPayload({ config: configPromise })

  const where: Where = {
    _status: { equals: 'published' },
  }

  if (block.filterByCategory) {
    where.category = { equals: block.filterByCategory }
  }

  const posts = await payload.find({
    collection: 'posts',
    where,
    limit: block.limit || 3,
    sort: '-publishedAt',
    depth: 2, // Populate relationships like featuredImage, category, author
  })

  return posts.docs
}

// Fetch business info
async function getBusinessInfo() {
  const payload = await getPayload({ config: configPromise })

  const businessInfo = await payload.findGlobal({
    slug: 'business-info',
  })

  return businessInfo
}

// Fetch price packages
async function getPricePackages(block: BlockParams) {
  const payload = await getPayload({ config: configPromise })

  const packages = await payload.find({
    collection: 'price-packages',
    limit: block.limit || 10,
    sort: 'order',
  })

  return packages.docs
}

// Fetch portfolio items
async function getPortfolioItems(block: BlockParams) {
  const payload = await getPayload({ config: configPromise })

  const portfolio = await payload.find({
    collection: 'portfolio',
    limit: block.limit || 12,
    sort: '-createdAt',
    depth: 1, // Populate relationships like featuredImage
  })

  return portfolio.docs
}

// Fetch products
async function getProducts(block: BlockParams) {
  const payload = await getPayload({ config: configPromise })

  const where: Where = {}
  if (block.onlyFeatured) {
    where.featured = { equals: true }
  }
  if (block.onlySale) {
    where.salePrice = { exists: true }
  }
  if (block.filterByCategory) {
    where.category = { equals: block.filterByCategory }
  }

  const products = await payload.find({
    collection: 'products',
    where,
    limit: block.limit || 8,
    depth: 2, // Populate images and category
  })

  return products.docs
}

// Fetch services with class-like filters (for schedule and grid display)
async function getServicesForSchedule(block: BlockParams & { filterByDifficulty?: string | null; filterByServiceType?: string | null }) {
  const payload = await getPayload({ config: configPromise })

  const where: Where = {
    active: { equals: true },
  }
  if (block.onlyFeatured) {
    where.featured = { equals: true }
  }
  if (block.filterByCategory && block.filterByCategory !== 'all') {
    where.category = { equals: block.filterByCategory }
  }
  if (block.filterByDifficulty && block.filterByDifficulty !== 'all') {
    where.difficulty = { equals: block.filterByDifficulty }
  }
  if (block.filterByServiceType && block.filterByServiceType !== 'all') {
    where.serviceType = { equals: block.filterByServiceType }
  }

  const services = await payload.find({
    collection: 'services',
    where,
    limit: block.limit || 100,
    sort: 'order',
    depth: 2,
  })

  return services.docs
}

// Fetch single team member by ID (with depth for populated data)
async function getTeamMemberById(id: string) {
  const payload = await getPayload({ config: configPromise })

  try {
    const result = await payload.findByID({
      collection: 'team',
      id,
      depth: 2,
    })
    return result
  } catch {
    return null
  }
}

// Fetch related team members
async function getRelatedTeamMembers(currentId: string, limit: number = 3) {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'team',
    where: {
      id: { not_equals: currentId },
    },
    limit,
    depth: 2,
    sort: 'order',
  })

  return result.docs
}

// Fetch subscriptions
async function getSubscriptions(block: BlockParams & { filterByType?: string | null }) {
  const payload = await getPayload({ config: configPromise })

  const where: Where = {
    active: { equals: true },
  }
  if (block.filterByType && block.filterByType !== 'all') {
    where.type = { equals: block.filterByType }
  }

  const subscriptions = await payload.find({
    collection: 'subscriptions',
    where,
    limit: block.limit || 8,
    sort: 'order',
    depth: 1,
  })

  return subscriptions.docs
}

// Fetch single service by ID (with depth for populated data)
async function getServiceById(id: string) {
  const payload = await getPayload({ config: configPromise })

  try {
    const result = await payload.findByID({
      collection: 'services',
      id,
      depth: 2,
    })
    return result
  } catch {
    return null
  }
}

// Fetch related services
async function getRelatedServices(currentId: string, categoryId: string | null, displayStyle: string | null, limit: number = 3) {
  const payload = await getPayload({ config: configPromise })

  const where: Where = {
    and: [
      { id: { not_equals: currentId } },
      { active: { equals: true } },
    ],
  }

  // Prefer same category, then same display style
  if (categoryId) {
    where.and?.push({ category: { equals: categoryId } })
  } else if (displayStyle) {
    where.and?.push({ displayStyle: { equals: displayStyle } })
  }

  const result = await payload.find({
    collection: 'services',
    where,
    limit,
    depth: 2,
    sort: 'order',
  })

  return result.docs
}

export async function RenderBlocks({ blocks }: RenderBlocksProps) {
  if (!blocks || blocks.length === 0) {
    return null
  }

  // Pre-fetch business info
  const businessInfo = await getBusinessInfo()

  return (
    <>
      {await Promise.all(
        blocks.map(async (block, index) => {
          const { blockType } = block

          switch (blockType) {
            case 'services': {
              const services = await getServices({
                limit: block.limit,
                onlyFeatured: block.onlyFeatured,
              })

              const detailBasePath = (block as { detailBasePath?: string | null }).detailBasePath ?? '/clase'

              return (
                <ServicesBlock
                  key={block.id || index}
                  variant={block.variant ?? undefined}
                  heading={block.heading ?? undefined}
                  subheading={block.subheading ?? undefined}
                  showIcons={block.showIcons ?? undefined}
                  backgroundColor={block.backgroundColor ?? undefined}
                  services={services}
                  detailBasePath={detailBasePath}
                />
              )
            }

            case 'stats': {
              const rawStats =
                block.source === 'custom'
                  ? (block.stats ?? [])
                  : businessInfo?.stats || []
              // Filter and transform stats to ensure valid values
              const stats = rawStats
                .filter((s) => s.value && s.label)
                .map((s) => ({
                  value: s.value!,
                  label: s.label!,
                }))

              return (
                <StatsBlock
                  key={block.id || index}
                  variant={block.variant ?? undefined}
                  heading={block.heading ?? undefined}
                  stats={stats}
                  animated={block.animated !== false}
                  backgroundColor={block.backgroundColor ?? undefined}
                />
              )
            }

            case 'team': {
              const members = await getTeamMembers({
                limit: block.limit,
                onlyFeatured: block.onlyFeatured,
              })

              // Get detailBasePath from block config
              const teamDetailBasePath = (block as { detailBasePath?: string | null }).detailBasePath ?? null

              return (
                <TeamBlock
                  key={block.id || index}
                  variant={block.variant ?? undefined}
                  heading={block.heading ?? undefined}
                  subheading={block.subheading ?? undefined}
                  showRole={block.showRole ?? undefined}
                  showBio={block.showBio ?? undefined}
                  columns={block.columns ?? undefined}
                  backgroundColor={block.backgroundColor ?? undefined}
                  members={members}
                  detailBasePath={teamDetailBasePath}
                />
              )
            }

            case 'testimonials': {
              const testimonials = await getTestimonials({
                limit: block.limit,
                onlyFeatured: block.onlyFeatured,
              })
              return (
                <TestimonialsBlock
                  key={block.id || index}
                  variant={block.variant ?? undefined}
                  heading={block.heading ?? undefined}
                  subheading={block.subheading ?? undefined}
                  showRating={block.showRating ?? undefined}
                  showAvatar={block.showAvatar ?? undefined}
                  autoplay={block.autoplay ?? undefined}
                  backgroundColor={block.backgroundColor ?? undefined}
                  testimonials={testimonials}
                />
              )
            }

            case 'faq': {
              const faqs = await getFAQs({
                limit: block.limit,
              })
              return (
                <FAQBlock
                  key={block.id || index}
                  variant={block.variant ?? undefined}
                  heading={block.heading ?? undefined}
                  subheading={block.subheading ?? undefined}
                  defaultOpen={block.defaultOpen ?? undefined}
                  backgroundColor={block.backgroundColor ?? undefined}
                  faqs={faqs}
                />
              )
            }

            case 'cta': {
              return (
                <CTABlock
                  key={block.id || index}
                  variant={block.variant ?? undefined}
                  headline={block.headline ?? undefined}
                  subheadline={block.subheadline ?? undefined}
                  image={block.image ?? undefined}
                  buttons={block.buttons ?? undefined}
                  showPhoneNumber={block.showPhoneNumber ?? undefined}
                  backgroundColor={block.backgroundColor ?? undefined}
                  textAlignment={block.textAlignment ?? undefined}
                  size={block.size ?? undefined}
                  businessPhone={businessInfo?.phone || undefined}
                />
              )
            }

            case 'contact': {
              const services = await getServices({ limit: 50 })
              return (
                <ContactBlock
                  key={block.id || index}
                  variant={block.variant ?? undefined}
                  heading={block.heading ?? undefined}
                  subheading={block.subheading ?? undefined}
                  showForm={block.showForm ?? undefined}
                  formType={block.formType ?? undefined}
                  formFields={block.formFields ?? undefined}
                  customFields={block.customFields ?? undefined}
                  submitButtonText={block.submitButtonText ?? undefined}
                  successMessage={block.successMessage ?? undefined}
                  showContactInfo={block.showContactInfo ?? undefined}
                  contactInfoItems={block.contactInfoItems ?? undefined}
                  showMap={block.showMap ?? undefined}
                  mapPosition={block.mapPosition ?? undefined}
                  backgroundColor={block.backgroundColor ?? undefined}
                  labels={block.labels ?? undefined}
                  businessInfo={businessInfo}
                  services={services}
                />
              )
            }

            case 'gallery': {
              // Transform images into a consistent format
              type GalleryImage = { id: string; url: string; alt?: string }
              let images: GalleryImage[] = []

              if (block.source === 'portfolio') {
                const portfolio = await getPortfolioItems(block)
                images = (portfolio as Portfolio[])
                  .filter((item) => (item.featuredImage as { url?: string } | null)?.url)
                  .map((item) => {
                    const featuredImage = item.featuredImage as { url?: string; alt?: string } | null
                    return {
                      id: item.id,
                      url: featuredImage?.url ?? '',
                      alt: featuredImage?.alt || item.title,
                    }
                  })
              } else if (block.images) {
                images = block.images
                  .filter((img) => {
                    const imgData = img.image as { url?: string } | string | null
                    return imgData && typeof imgData !== 'string' && imgData.url
                  })
                  .map((img) => {
                    const imgData = img.image as { url?: string; alt?: string; id?: string } | null
                    return {
                      id: img.id || imgData?.id || '',
                      url: imgData?.url ?? '',
                      alt: imgData?.alt || img.caption || '',
                    }
                  })
              }

              // Derive columns from variant (grid-3, grid-4, etc.)
              const columns = block.variant?.includes('3') ? '3' : block.variant?.includes('4') ? '4' : '3'

              // Transform labels from block
              const galleryLabels = block.labels as {
                allFilter?: string | null
              } | undefined

              return (
                <GalleryBlock
                  key={block.id || index}
                  variant={block.variant ?? undefined}
                  heading={block.heading ?? undefined}
                  subheading={block.subheading ?? undefined}
                  columns={columns}
                  gap={block.gap ?? undefined}
                  aspectRatio={block.aspectRatio ?? undefined}
                  lightbox={true}
                  backgroundColor={block.backgroundColor ?? undefined}
                  images={images}
                  labels={galleryLabels ? {
                    allFilter: galleryLabels.allFilter ?? undefined,
                  } : undefined}
                />
              )
            }

            case 'pricing': {
              const packages = await getPricePackages({
                limit: block.limit,
              })
              // Derive columns from variant (cards-3, cards-4, etc.)
              const pricingColumns = block.variant?.includes('3') ? '3' : block.variant?.includes('4') ? '4' : '3'

              return (
                <PricingBlock
                  key={block.id || index}
                  variant={block.variant ?? undefined}
                  heading={block.heading ?? undefined}
                  subheading={block.subheading ?? undefined}
                  columns={pricingColumns}
                  showBadge={block.showFeatures !== false}
                  backgroundColor={block.backgroundColor ?? undefined}
                  packages={packages}
                />
              )
            }

            case 'booking': {
              const services = await getServices({ limit: 50 })
              const staff = await getTeamMembers({ limit: 20 })
              return (
                <BookingBlock
                  key={block.id || index}
                  variant={block.variant ?? undefined}
                  heading={block.heading ?? undefined}
                  subheading={block.subheading ?? undefined}
                  showServiceSelection={block.showServiceSelection ?? undefined}
                  showStaffSelection={block.showTeamSelection ?? undefined}
                  showDateSelection={block.showDatePicker ?? undefined}
                  showTimeSlots={block.showTimePicker ?? undefined}
                  submitButtonText={block.submitButtonText ?? undefined}
                  successMessage={block.successMessage ?? undefined}
                  backgroundColor={block.backgroundColor ?? undefined}
                  services={services}
                  staff={staff}
                  businessPhone={businessInfo?.phone || undefined}
                  whatsapp={businessInfo?.whatsapp || undefined}
                />
              )
            }

            case 'products': {
              const products = await getProducts({
                limit: block.limit,
                onlyFeatured: block.onlyFeatured,
                onlySale: block.onlySale,
                filterByCategory: typeof block.filterByCategory === 'string' ? block.filterByCategory : undefined,
              })
              return (
                <ProductsBlock
                  key={block.id || index}
                  variant={block.variant ?? undefined}
                  heading={block.heading ?? undefined}
                  subheading={block.subheading ?? undefined}
                  showPrice={block.showPrice ?? undefined}
                  showSalePrice={block.showSalePrice ?? undefined}
                  showAddToCart={block.showAddToCart ?? undefined}
                  ctaButton={block.ctaButton ?? undefined}
                  backgroundColor={block.backgroundColor ?? undefined}
                  products={products}
                />
              )
            }

            case 'cart': {
              return (
                <CartBlock
                  key={block.id || index}
                  variant={block.variant ?? undefined}
                  heading={block.heading ?? undefined}
                  showQuantitySelector={block.showQuantitySelector ?? undefined}
                  showRemoveButton={block.showRemoveButton ?? undefined}
                  showSubtotal={block.showSubtotal ?? undefined}
                  checkoutButtonText={block.checkoutButtonText ?? undefined}
                  checkoutLink={block.checkoutLink ?? undefined}
                  emptyCartMessage={block.emptyCartMessage ?? undefined}
                  continueShoppingLink={block.continueShoppingLink ?? undefined}
                  backgroundColor={block.backgroundColor ?? undefined}
                />
              )
            }

            case 'checkout': {
              return (
                <CheckoutBlock
                  key={block.id || index}
                  variant={block.variant ?? undefined}
                  heading={block.heading ?? undefined}
                  showOrderSummary={block.showOrderSummary ?? undefined}
                  showShippingOptions={block.showShippingOptions ?? undefined}
                  showPaymentOptions={block.showPaymentOptions ?? undefined}
                  submitButtonText={block.submitButtonText ?? undefined}
                  successMessage={block.successMessage ?? undefined}
                  backgroundColor={block.backgroundColor ?? undefined}
                />
              )
            }

            case 'videoEmbed': {
              return (
                <VideoEmbedBlock
                  key={block.id || index}
                  variant={block.variant ?? undefined}
                  heading={block.heading ?? undefined}
                  subheading={block.subheading ?? undefined}
                  videoUrl={block.videoUrl}
                  thumbnail={block.thumbnail ?? undefined}
                  sideContent={block.sideContent ?? undefined}
                  aspectRatio={block.aspectRatio ?? undefined}
                  autoplay={block.autoplay ?? undefined}
                  loop={block.loop ?? undefined}
                  showControls={block.showControls ?? undefined}
                  backgroundColor={block.backgroundColor ?? undefined}
                  maxWidth={block.maxWidth ?? undefined}
                />
              )
            }

            case 'priceListDotted': {
              const priceListServices = block.source === 'services'
                ? await getServices({
                    limit: block.limit,
                    filterByCategory: block.filterByCategory,
                  })
                : []

              return (
                <PriceListDottedBlock
                  key={block.id || index}
                  variant={block.variant ?? undefined}
                  heading={block.heading ?? undefined}
                  subheading={block.subheading ?? undefined}
                  items={block.items ?? undefined}
                  categories={block.categories ?? undefined}
                  services={priceListServices}
                  currency={block.currency ?? undefined}
                  showDuration={block.showDuration ?? undefined}
                  dotStyle={block.dotStyle ?? undefined}
                  backgroundColor={block.backgroundColor ?? undefined}
                  ctaButton={block.ctaButton ?? undefined}
                />
              )
            }

            case 'beforeAfter': {
              return (
                <BeforeAfterBlock
                  key={block.id || index}
                  variant={block.variant ?? undefined}
                  heading={block.heading ?? undefined}
                  subheading={block.subheading ?? undefined}
                  items={block.items ?? undefined}
                  sliderPosition={block.sliderPosition ?? undefined}
                  backgroundColor={block.backgroundColor ?? undefined}
                />
              )
            }

            case 'newsletter': {
              return (
                <NewsletterBlock
                  key={block.id || index}
                  variant={block.variant ?? undefined}
                  heading={block.heading ?? undefined}
                  subheading={block.subheading ?? undefined}
                  placeholder={block.placeholder ?? undefined}
                  buttonText={block.buttonText ?? undefined}
                  successMessage={block.successMessage ?? undefined}
                  backgroundImage={block.backgroundImage ?? undefined}
                  privacyText={block.privacyText ?? undefined}
                  showPrivacyLink={block.showPrivacyLink ?? undefined}
                  benefits={block.benefits ?? undefined}
                />
              )
            }

            case 'trust-badges': {
              return (
                <TrustBadgesBlock
                  key={block.id || index}
                  variant={block.variant ?? undefined}
                  heading={block.heading ?? undefined}
                  source={block.source ?? undefined}
                  presets={block.presets ?? undefined}
                  customValues={block.customValues ?? undefined}
                  badges={block.badges ?? undefined}
                  showDescriptions={block.showDescriptions ?? undefined}
                  iconSize={block.iconSize ?? undefined}
                  backgroundColor={block.backgroundColor ?? undefined}
                />
              )
            }

            case 'how-it-works': {
              return (
                <HowItWorksBlock
                  key={block.id || index}
                  variant={block.variant ?? undefined}
                  heading={block.heading ?? undefined}
                  subheading={block.subheading ?? undefined}
                  steps={block.steps ?? undefined}
                  showNumbers={block.showNumbers ?? undefined}
                  ctaButton={block.ctaButton ?? undefined}
                  backgroundColor={block.backgroundColor ?? undefined}
                />
              )
            }

            case 'logo-cloud': {
              return (
                <LogoCloudBlock
                  key={block.id || index}
                  variant={block.variant ?? undefined}
                  heading={block.heading ?? undefined}
                  subheading={block.subheading ?? undefined}
                  logos={block.logos ?? undefined}
                  logoSize={block.logoSize ?? undefined}
                  columns={block.columns ?? undefined}
                  grayscale={block.grayscale ?? undefined}
                  backgroundColor={block.backgroundColor ?? undefined}
                />
              )
            }

            case 'latestPosts': {
              const posts = await getPosts({
                limit: block.limit,
                filterByCategory: typeof block.filterByCategory === 'string' ? block.filterByCategory : undefined,
              })
              return (
                <LatestPostsBlock
                  key={block.id || index}
                  variant={block.variant ?? undefined}
                  heading={block.heading ?? undefined}
                  subheading={block.subheading ?? undefined}
                  showImage={block.showImage ?? undefined}
                  showExcerpt={block.showExcerpt ?? undefined}
                  showDate={block.showDate ?? undefined}
                  showCategory={block.showCategory ?? undefined}
                  showAuthor={block.showAuthor ?? undefined}
                  showReadMore={block.showReadMore ?? undefined}
                  readMoreText={block.readMoreText ?? undefined}
                  ctaButton={block.ctaButton ?? undefined}
                  backgroundColor={block.backgroundColor ?? undefined}
                  posts={posts}
                />
              )
            }

            case 'openingHours': {
              // Transform schedule from businessInfo if available
              const scheduleData = block.source === 'custom'
                ? block.schedule
                : businessInfo?.workingHours || []

              return (
                <OpeningHoursBlock
                  key={block.id || index}
                  variant={block.variant ?? undefined}
                  heading={block.heading ?? undefined}
                  subheading={block.subheading ?? undefined}
                  schedule={scheduleData}
                  showCurrentStatus={block.showCurrentStatus ?? undefined}
                  image={block.image}
                  ctaButton={block.ctaButton ?? undefined}
                  backgroundColor={block.backgroundColor ?? undefined}
                />
              )
            }

            case 'locations': {
              return (
                <LocationsBlock
                  key={block.id || index}
                  variant={block.variant ?? undefined}
                  heading={block.heading ?? undefined}
                  subheading={block.subheading ?? undefined}
                  locations={block.locations}
                  showMap={block.showMap ?? undefined}
                  showSchedule={block.showSchedule ?? undefined}
                  showRating={block.showRating ?? undefined}
                  backgroundColor={block.backgroundColor ?? undefined}
                />
              )
            }

            case 'brandLogos': {
              return (
                <BrandLogosBlock
                  key={block.id || index}
                  variant={block.variant ?? undefined}
                  heading={block.heading ?? undefined}
                  subheading={block.subheading ?? undefined}
                  logos={block.logos}
                  sections={block.sections}
                  grayscale={block.grayscale ?? undefined}
                  logoSize={block.logoSize ?? undefined}
                  backgroundColor={block.backgroundColor ?? undefined}
                />
              )
            }

            case 'timeline': {
              return (
                <TimelineBlock
                  key={block.id || index}
                  variant={block.variant ?? undefined}
                  heading={block.heading ?? undefined}
                  subheading={block.subheading ?? undefined}
                  events={block.events}
                  showConnector={block.showConnector ?? undefined}
                  backgroundColor={block.backgroundColor ?? undefined}
                />
              )
            }

            case 'announcementBar': {
              return (
                <AnnouncementBarBlock
                  key={block.id || index}
                  variant={block.variant ?? undefined}
                  messages={block.messages}
                  ctaButton={block.ctaButton ?? undefined}
                  countdown={block.countdown ?? undefined}
                  backgroundColor={block.backgroundColor ?? undefined}
                  position={block.position ?? undefined}
                  sticky={block.sticky ?? undefined}
                />
              )
            }


            case 'subscriptionCards': {
              const subscriptions = await getSubscriptions({
                limit: block.limit,
                filterByType: block.filterByType,
              })
              return (
                <SubscriptionCardsBlock
                  key={block.id || index}
                  variant={block.variant ?? undefined}
                  heading={block.heading ?? undefined}
                  subheading={block.subheading ?? undefined}
                  showImage={block.showImage ?? undefined}
                  showFeatures={block.showFeatures ?? undefined}
                  showOldPrice={block.showOldPrice ?? undefined}
                  highlightStyle={block.highlightStyle ?? undefined}
                  ctaButton={block.ctaButton ?? undefined}
                  backgroundColor={block.backgroundColor ?? undefined}
                  subscriptions={subscriptions}
                />
              )
            }

            case 'scheduleTable': {
              // Get services that have schedule defined
              const services = await getServicesForSchedule({
                limit: 100,
                filterByCategory: block.filterByCategory,
              })

              // Service schedule slot type from generated types
              type ServiceScheduleSlot = NonNullable<Service['schedule']>[number]

              // Transform services into schedule entries
              const scheduleEntries = services.flatMap((service: Service) => {
                if (!service.schedule || service.schedule.length === 0) return []
                const teamMember = service.assignedTeamMember as { name?: string } | null
                return service.schedule.map((slot: ServiceScheduleSlot) => {
                  const categoryRef = service.category as string | Category | null
                  const categoryTitle = categoryRef && typeof categoryRef === 'object' && 'title' in categoryRef
                    ? categoryRef.title
                    : undefined

                  return {
                    id: `${service.id}-${slot.day}-${slot.startTime}`,
                    day: slot.day,
                    startTime: slot.startTime,
                    endTime: slot.endTime ?? undefined,
                    title: service.title,
                    trainer: teamMember?.name ?? undefined,
                    duration: service.durationMinutes ?? undefined,
                    category: categoryTitle,
                    classSlug: service.slug ?? undefined,
                    color: undefined,
                  }
                })
              })

              // Transform labels from block
              const scheduleLabels = block.labels as {
                allFilter?: string | null
                todayBadge?: string | null
                noClasses?: string | null
                detailsButton?: string | null
                timeHeader?: string | null
                dayLabels?: Record<string, string> | null
              } | undefined

              return (
                <ScheduleTableBlock
                  key={block.id || index}
                  variant={block.variant ?? undefined}
                  heading={block.heading ?? undefined}
                  subheading={block.subheading ?? undefined}
                  showTrainer={block.showTrainer ?? undefined}
                  showDuration={block.showDuration ?? undefined}
                  showRoom={block.showRoom ?? undefined}
                  showCategoryFilter={block.showCategoryFilter ?? undefined}
                  highlightToday={block.highlightToday ?? undefined}
                  startHour={block.startHour ?? undefined}
                  endHour={block.endHour ?? undefined}
                  ctaButton={block.ctaButton ?? undefined}
                  backgroundColor={block.backgroundColor ?? undefined}
                  scheduleEntries={block.source === 'custom' ? (block.customSchedule || []) : scheduleEntries}
                  labels={scheduleLabels ? {
                    allFilter: scheduleLabels.allFilter ?? undefined,
                    todayBadge: scheduleLabels.todayBadge ?? undefined,
                    noClasses: scheduleLabels.noClasses ?? undefined,
                    detailsButton: scheduleLabels.detailsButton ?? undefined,
                    timeHeader: scheduleLabels.timeHeader ?? undefined,
                    dayLabels: scheduleLabels.dayLabels ?? undefined,
                  } : undefined}
                />
              )
            }

            case 'content': {
              return (
                <ContentBlock
                  key={block.id || index}
                  columns={block.columns ?? undefined}
                  backgroundColor={block.backgroundColor ?? undefined}
                  paddingTop={block.paddingTop ?? undefined}
                  paddingBottom={block.paddingBottom ?? undefined}
                />
              )
            }


            case 'teamMemberDetail': {
              // Get member ID from relationship field (can be string ID or populated object)
              const memberRef = block.member as string | { id: string } | null
              const memberId = typeof memberRef === 'string' ? memberRef : memberRef?.id
              const memberData = memberId ? await getTeamMemberById(memberId) : null
              const relatedMembers = memberData && block.showRelatedMembers
                ? await getRelatedTeamMembers(memberData.id, block.relatedMembersCount || 3)
                : []

              // Transform labels group to expected format
              const labelsFromBlock = block.labels as {
                breadcrumbHome?: string | null
                breadcrumbTeam?: string | null
                experienceTitle?: string | null
                specializationsTitle?: string | null
                scheduleTitle?: string | null
                contactTitle?: string | null
                ctaTitle?: string | null
                ctaDescription?: string | null
                ctaButtonText?: string | null
                ctaSecondaryButtonText?: string | null
                viewAllTeamText?: string | null
                notFoundMessage?: string | null
              } | undefined

              const linksFromBlock = block.links as {
                teamBasePath?: string | null
                contactPath?: string | null
                classesPath?: string | null
                bookingPath?: string | null
              } | undefined

              return (
                <TeamMemberDetailBlock
                  key={block.id || index}
                  variant={block.variant ?? undefined}
                  showBreadcrumb={block.showBreadcrumb ?? undefined}
                  showExperience={block.showExperience ?? undefined}
                  showSpecializations={block.showSpecializations ?? undefined}
                  showContact={block.showContact ?? undefined}
                  showSocialMedia={block.showSocialMedia ?? undefined}
                  showSchedule={block.showSchedule ?? undefined}
                  showCTA={block.showCTA ?? undefined}
                  showRelatedMembers={block.showRelatedMembers ?? undefined}
                  relatedMembersCount={block.relatedMembersCount ?? undefined}
                  relatedMembersTitle={block.relatedMembersTitle ?? undefined}
                  backgroundColor={block.backgroundColor ?? undefined}
                  memberData={memberData}
                  relatedMembers={relatedMembers}
                  labels={labelsFromBlock ? {
                    breadcrumbHome: labelsFromBlock.breadcrumbHome ?? undefined,
                    breadcrumbTeam: labelsFromBlock.breadcrumbTeam ?? undefined,
                    experienceTitle: labelsFromBlock.experienceTitle ?? undefined,
                    specializationsTitle: labelsFromBlock.specializationsTitle ?? undefined,
                    scheduleTitle: labelsFromBlock.scheduleTitle ?? undefined,
                    contactTitle: labelsFromBlock.contactTitle ?? undefined,
                    ctaTitle: labelsFromBlock.ctaTitle ?? undefined,
                    ctaDescription: labelsFromBlock.ctaDescription ?? undefined,
                    ctaButtonText: labelsFromBlock.ctaButtonText ?? undefined,
                    ctaSecondaryButtonText: labelsFromBlock.ctaSecondaryButtonText ?? undefined,
                    viewAllTeamText: labelsFromBlock.viewAllTeamText ?? undefined,
                    notFoundMessage: labelsFromBlock.notFoundMessage ?? undefined,
                  } : undefined}
                  links={linksFromBlock ? {
                    teamBasePath: linksFromBlock.teamBasePath ?? undefined,
                    contactPath: linksFromBlock.contactPath ?? undefined,
                    classesPath: linksFromBlock.classesPath ?? undefined,
                    bookingPath: linksFromBlock.bookingPath ?? undefined,
                  } : undefined}
                />
              )
            }

            case 'serviceDetail': {
              // Get service ID from relationship field (can be string ID or populated object)
              const serviceRef = block.service as string | { id: string } | null
              const serviceId = typeof serviceRef === 'string' ? serviceRef : serviceRef?.id
              const serviceData = serviceId ? await getServiceById(serviceId) : null

              // Get category ID from populated service data
              const categoryRef = serviceData?.category as string | { id: string } | null
              const categoryId = typeof categoryRef === 'string' ? categoryRef : categoryRef?.id

              const relatedServices = serviceData && block.showRelatedServices
                ? await getRelatedServices(
                    serviceData.id,
                    categoryId || null,
                    serviceData.displayStyle || null,
                    block.relatedServicesCount || 3
                  )
                : []

              // Transform labels group to expected format
              const labelsFromBlock = block.labels as {
                breadcrumbHome?: string | null
                breadcrumbServices?: string | null
                benefitsTitle?: string | null
                featuresTitle?: string | null
                scheduleTitle?: string | null
                pricingTitle?: string | null
                teamMemberTitle?: string | null
                requirementsTitle?: string | null
                viewAllServicesText?: string | null
                minutesLabel?: string | null
                spotsLabel?: string | null
                priceFromLabel?: string | null
                dropInLabel?: string | null
                monthlyLabel?: string | null
                packageLabel?: string | null
                currencySymbol?: string | null
                dayLabels?: Record<string, string> | null
                difficultyLabels?: Record<string, string> | null
                serviceTypeLabels?: Record<string, string> | null
                notFoundMessage?: string | null
              } | undefined

              const linksFromBlock = block.links as {
                servicesBasePath?: string | null
                teamBasePath?: string | null
                bookingPath?: string | null
              } | undefined

              return (
                <ServiceDetailBlock
                  key={block.id || index}
                  variant={block.variant ?? undefined}
                  showBreadcrumb={block.showBreadcrumb ?? undefined}
                  showSchedule={block.showSchedule ?? undefined}
                  showPricing={block.showPricing ?? undefined}
                  showTeamMember={block.showTeamMember ?? undefined}
                  showBenefits={block.showBenefits ?? undefined}
                  showFeatures={block.showFeatures ?? undefined}
                  showRequirements={block.showRequirements ?? undefined}
                  showRelatedServices={block.showRelatedServices ?? undefined}
                  relatedServicesCount={block.relatedServicesCount ?? undefined}
                  relatedServicesTitle={block.relatedServicesTitle ?? undefined}
                  ctaButtonText={block.ctaButtonText ?? undefined}
                  ctaButtonLink={block.ctaButtonLink ?? undefined}
                  backgroundColor={block.backgroundColor ?? undefined}
                  serviceData={serviceData}
                  relatedServices={relatedServices}
                  labels={labelsFromBlock ? {
                    breadcrumbHome: labelsFromBlock.breadcrumbHome ?? undefined,
                    breadcrumbServices: labelsFromBlock.breadcrumbServices ?? undefined,
                    benefitsTitle: labelsFromBlock.benefitsTitle ?? undefined,
                    featuresTitle: labelsFromBlock.featuresTitle ?? undefined,
                    scheduleTitle: labelsFromBlock.scheduleTitle ?? undefined,
                    pricingTitle: labelsFromBlock.pricingTitle ?? undefined,
                    teamMemberTitle: labelsFromBlock.teamMemberTitle ?? undefined,
                    requirementsTitle: labelsFromBlock.requirementsTitle ?? undefined,
                    viewAllServicesText: labelsFromBlock.viewAllServicesText ?? undefined,
                    minutesLabel: labelsFromBlock.minutesLabel ?? undefined,
                    spotsLabel: labelsFromBlock.spotsLabel ?? undefined,
                    priceFromLabel: labelsFromBlock.priceFromLabel ?? undefined,
                    dropInLabel: labelsFromBlock.dropInLabel ?? undefined,
                    monthlyLabel: labelsFromBlock.monthlyLabel ?? undefined,
                    packageLabel: labelsFromBlock.packageLabel ?? undefined,
                    currencySymbol: labelsFromBlock.currencySymbol ?? undefined,
                    dayLabels: labelsFromBlock.dayLabels ?? undefined,
                    difficultyLabels: labelsFromBlock.difficultyLabels ?? undefined,
                    serviceTypeLabels: labelsFromBlock.serviceTypeLabels ?? undefined,
                    notFoundMessage: labelsFromBlock.notFoundMessage ?? undefined,
                  } : undefined}
                  links={linksFromBlock ? {
                    servicesBasePath: linksFromBlock.servicesBasePath ?? undefined,
                    teamBasePath: linksFromBlock.teamBasePath ?? undefined,
                    bookingPath: linksFromBlock.bookingPath ?? undefined,
                  } : undefined}
                />
              )
            }

            default:
              // Placeholder for unimplemented blocks
              return (
                <section key={block.id || index} className="py-16">
                  <div className="container mx-auto px-4">
                    <div className="text-center py-8 bg-gray-100 rounded-lg">
                      <p className="text-gray-500">
                        Block: <strong>{blockType}</strong>
                      </p>
                      <p className="text-sm text-gray-400 mt-2">Componenta va fi implementata</p>
                    </div>
                  </div>
                </section>
              )
          }
        })
      )}
    </>
  )
}

export default RenderBlocks
