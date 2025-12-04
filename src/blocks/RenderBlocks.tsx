import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Page, Portfolio } from '@/payload-types'
import type { Where } from 'payload'

// Import block components
import { ServicesBlock } from './Services/Component'
import { StatsBlock } from './Stats/Component'
import { TeamBlock } from './Team/Component'
import { TestimonialsBlock } from './Testimonials/Component'
import { FAQBlock } from './FAQ/Component'
import { CTABlock } from './CTA/Component'
import { ContactBlock } from './Contact/Component'
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
              return (
                <ServicesBlock
                  key={block.id || index}
                  variant={block.variant ?? undefined}
                  heading={block.heading ?? undefined}
                  subheading={block.subheading ?? undefined}
                  showPrices={block.showPrices ?? undefined}
                  showIcons={block.showIcons ?? undefined}
                  backgroundColor={block.backgroundColor ?? undefined}
                  services={services}
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
                  formFields={block.formFields ?? undefined}
                  submitButtonText={block.submitButtonText ?? undefined}
                  successMessage={block.successMessage ?? undefined}
                  showContactInfo={block.showContactInfo ?? undefined}
                  contactInfoItems={block.contactInfoItems ?? undefined}
                  showMap={block.showMap ?? undefined}
                  mapPosition={block.mapPosition ?? undefined}
                  backgroundColor={block.backgroundColor ?? undefined}
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
