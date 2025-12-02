import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

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

interface RenderBlocksProps {
  blocks: any[]
}

// Fetch services data
async function getServices(block: any) {
  const payload = await getPayload({ config: configPromise })

  const where: any = {}
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
async function getTeamMembers(block: any) {
  const payload = await getPayload({ config: configPromise })

  const where: any = {}
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
async function getTestimonials(block: any) {
  const payload = await getPayload({ config: configPromise })

  const where: any = {}
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
async function getFAQs(block: any) {
  const payload = await getPayload({ config: configPromise })

  const faqs = await payload.find({
    collection: 'faq',
    limit: block.limit || 10,
    sort: 'order',
  })

  return faqs.docs
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
async function getPricePackages(block: any) {
  const payload = await getPayload({ config: configPromise })

  const packages = await payload.find({
    collection: 'price-packages',
    limit: block.limit || 10,
    sort: 'order',
  })

  return packages.docs
}

// Fetch portfolio items
async function getPortfolioItems(block: any) {
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
async function getProducts(block: any) {
  const payload = await getPayload({ config: configPromise })

  const where: any = {}
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
              const services = await getServices(block)
              return (
                <ServicesBlock
                  key={block.id || index}
                  variant={block.variant}
                  heading={block.heading}
                  subheading={block.subheading}
                  showPrices={block.showPrices}
                  showIcons={block.showIcons}
                  backgroundColor={block.backgroundColor}
                  services={services as any}
                />
              )
            }

            case 'stats': {
              const stats =
                block.source === 'custom'
                  ? block.stats
                  : businessInfo?.stats || []

              return (
                <StatsBlock
                  key={block.id || index}
                  variant={block.variant}
                  heading={block.heading}
                  stats={stats}
                  animated={block.animated !== false}
                  backgroundColor={block.backgroundColor}
                />
              )
            }

            case 'team': {
              const members = await getTeamMembers(block)
              return (
                <TeamBlock
                  key={block.id || index}
                  variant={block.variant}
                  heading={block.heading}
                  subheading={block.subheading}
                  showRole={block.showRole}
                  showBio={block.showBio}
                  columns={block.columns}
                  backgroundColor={block.backgroundColor}
                  members={members as any}
                />
              )
            }

            case 'testimonials': {
              const testimonials = await getTestimonials(block)
              return (
                <TestimonialsBlock
                  key={block.id || index}
                  variant={block.variant}
                  heading={block.heading}
                  subheading={block.subheading}
                  showRating={block.showRating}
                  showAvatar={block.showAvatar}
                  autoplay={block.autoplay}
                  backgroundColor={block.backgroundColor}
                  testimonials={testimonials as any}
                />
              )
            }

            case 'faq': {
              const faqs = await getFAQs(block)
              return (
                <FAQBlock
                  key={block.id || index}
                  variant={block.variant}
                  heading={block.heading}
                  subheading={block.subheading}
                  defaultOpen={block.defaultOpen}
                  backgroundColor={block.backgroundColor}
                  faqs={faqs}
                />
              )
            }

            case 'cta': {
              return (
                <CTABlock
                  key={block.id || index}
                  variant={block.variant}
                  headline={block.headline}
                  subheadline={block.subheadline}
                  image={block.image}
                  buttons={block.buttons}
                  showPhoneNumber={block.showPhoneNumber}
                  backgroundColor={block.backgroundColor}
                  textAlignment={block.textAlignment}
                  size={block.size}
                  businessPhone={businessInfo?.phone || undefined}
                />
              )
            }

            case 'contact': {
              const services = await getServices({ limit: 50 })
              return (
                <ContactBlock
                  key={block.id || index}
                  variant={block.variant}
                  heading={block.heading}
                  subheading={block.subheading}
                  showForm={block.showForm}
                  formFields={block.formFields}
                  submitButtonText={block.submitButtonText}
                  successMessage={block.successMessage}
                  showContactInfo={block.showContactInfo}
                  contactInfoItems={block.contactInfoItems}
                  showMap={block.showMap}
                  mapPosition={block.mapPosition}
                  backgroundColor={block.backgroundColor}
                  businessInfo={businessInfo as any}
                  services={services as any}
                />
              )
            }

            case 'gallery': {
              // Get images from portfolio or block's own images
              let images = block.images || []
              if (block.source === 'portfolio') {
                const portfolio = await getPortfolioItems(block)
                images = portfolio
                  .filter((item: any) => item.featuredImage?.url)
                  .map((item: any) => ({
                    id: item.id,
                    url: item.featuredImage.url,
                    alt: item.featuredImage.alt || item.title,
                  }))
              }

              return (
                <GalleryBlock
                  key={block.id || index}
                  variant={block.variant}
                  heading={block.heading}
                  subheading={block.subheading}
                  columns={block.columns}
                  gap={block.gap}
                  aspectRatio={block.aspectRatio}
                  lightbox={block.lightbox !== false}
                  backgroundColor={block.backgroundColor}
                  images={images}
                />
              )
            }

            case 'pricing': {
              const packages = await getPricePackages(block)
              return (
                <PricingBlock
                  key={block.id || index}
                  variant={block.variant}
                  heading={block.heading}
                  subheading={block.subheading}
                  columns={block.columns}
                  showBadge={block.showBadge !== false}
                  backgroundColor={block.backgroundColor}
                  packages={packages as any}
                />
              )
            }

            case 'booking': {
              const services = await getServices({ limit: 50 })
              const staff = await getTeamMembers({ limit: 20 })
              return (
                <BookingBlock
                  key={block.id || index}
                  variant={block.variant}
                  heading={block.heading}
                  subheading={block.subheading}
                  showServiceSelection={block.showServiceSelection}
                  showStaffSelection={block.showTeamSelection}
                  showDateSelection={block.showDatePicker}
                  showTimeSlots={block.showTimePicker}
                  submitButtonText={block.submitButtonText}
                  successMessage={block.successMessage}
                  backgroundColor={block.backgroundColor}
                  services={services as any}
                  staff={staff as any}
                  businessPhone={businessInfo?.phone || undefined}
                  whatsapp={businessInfo?.whatsapp || undefined}
                />
              )
            }

            case 'products': {
              const products = await getProducts(block)
              return (
                <ProductsBlock
                  key={block.id || index}
                  variant={block.variant}
                  heading={block.heading}
                  subheading={block.subheading}
                  showPrice={block.showPrice}
                  showSalePrice={block.showSalePrice}
                  showAddToCart={block.showAddToCart}
                  ctaButton={block.ctaButton}
                  backgroundColor={block.backgroundColor}
                  products={products as any}
                />
              )
            }

            case 'cart': {
              return (
                <CartBlock
                  key={block.id || index}
                  variant={block.variant}
                  heading={block.heading}
                  showQuantitySelector={block.showQuantitySelector}
                  showRemoveButton={block.showRemoveButton}
                  showSubtotal={block.showSubtotal}
                  checkoutButtonText={block.checkoutButtonText}
                  checkoutLink={block.checkoutLink}
                  emptyCartMessage={block.emptyCartMessage}
                  continueShoppingLink={block.continueShoppingLink}
                  backgroundColor={block.backgroundColor}
                />
              )
            }

            case 'checkout': {
              return (
                <CheckoutBlock
                  key={block.id || index}
                  variant={block.variant}
                  heading={block.heading}
                  showOrderSummary={block.showOrderSummary}
                  showShippingOptions={block.showShippingOptions}
                  showPaymentOptions={block.showPaymentOptions}
                  submitButtonText={block.submitButtonText}
                  successMessage={block.successMessage}
                  backgroundColor={block.backgroundColor}
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
