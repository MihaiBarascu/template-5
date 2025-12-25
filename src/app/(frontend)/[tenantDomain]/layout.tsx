import type { TenantSiteTheme, TenantBusinessInfo, TenantFooter, TenantLogo, BusinessInfo } from '@/payload-types'
import { notFound } from 'next/navigation'

import { getCachedGlobal } from '@/utilities/getGlobals'
import {
  getCachedTenantGlobalByDomain,
  validateTenant,
  getEffectiveTenantDomain,
} from '@/utilities/getTenantGlobal'
import { generateThemeStyles } from '@/utilities/generateThemeStyles'
import { getServerSideURL } from '@/utilities/getURL'

import { ThemeProvider } from '@/providers/ThemeProvider'
import { EcommerceProviderWrapper } from '@/providers/EcommerceProvider'
import { AuthProvider } from '@/providers/Auth'
import { ShopSettingsProvider } from '@/providers/ShopSettings'
import { ToastProvider } from '@/components/Toast'
import { Footer } from '@/components/Footer'
import { AdminBar } from '@/components/AdminBar'
import { WhatsAppFloat } from '@/components/WhatsAppFloat'
import { FloatingCTA } from '@/components/ui/FloatingCTA'
import { BackToTop } from '@/components/BackToTop'
import { CookieConsent } from '@/components/CookieConsent'
import { ScriptLoader } from '@/components/ScriptLoader'
import { AnnouncementBar } from '@/components/AnnouncementBar'

// BusinessInfo can be either tenant-scoped or legacy global
type BusinessInfoType = TenantBusinessInfo | BusinessInfo

interface TenantLayoutProps {
  children: React.ReactNode
  params: Promise<{ tenantDomain: string }>
}

/**
 * Tenant Layout - OFFICIAL PAYLOAD MULTI-TENANT PATTERN
 *
 * This layout receives tenantDomain from URL params (via Next.js rewrites)
 * instead of reading from Host headers directly.
 *
 * Reference: docs/MULTI-TENANT-OFFICIAL-REFERENCE.md
 *
 * Flow:
 * 1. Request to frizerie.local/servicii
 * 2. Next.js rewrites add tenant to path: /frizerie.local/servicii
 * 3. This layout receives params.tenantDomain = 'frizerie.local'
 * 4. We validate tenant exists and fetch tenant-specific data
 */
export default async function TenantLayout({ children, params }: TenantLayoutProps) {
  const { tenantDomain: urlEncodedDomain } = await params
  // Decode URL-encoded domain (e.g., "localhost%3A3100" -> "localhost:3100")
  const rawTenantDomain = decodeURIComponent(urlEncodedDomain)

  // Validate tenant exists in database
  const tenantExists = await validateTenant(rawTenantDomain)
  if (!tenantExists) {
    // Unknown domain - return 404
    notFound()
  }

  // Get effective tenant domain (handles localhost fallback in development)
  const tenantDomain = await getEffectiveTenantDomain(rawTenantDomain)

  // Fetch tenant-scoped data with cache tags for proper revalidation
  // Uses getCachedTenantGlobalByDomain for multi-tenant support (params-based)
  // Uses getCachedGlobal for TRUE globals (shop-settings - not tenant-scoped yet)
  const [siteThemeData, footerData, businessInfoData, logoData, shopSettingsData] = await Promise.all([
    getCachedTenantGlobalByDomain<TenantSiteTheme>('site-theme', tenantDomain),
    getCachedTenantGlobalByDomain<TenantFooter>('footer', tenantDomain),
    getCachedTenantGlobalByDomain<BusinessInfoType>('business-info', tenantDomain),
    getCachedTenantGlobalByDomain<TenantLogo>('logo', tenantDomain),
    getCachedGlobal('shop-settings'),
  ])

  // Extract widget settings from businessInfo (may be tenant or legacy global)
  const businessInfoWithWidgets = businessInfoData as BusinessInfo | null
  const announcementBar = businessInfoWithWidgets?.announcementBar as {
    enabled?: boolean
    message?: string
    linkText?: string
    linkUrl?: string
    backgroundColor?: 'primary' | 'secondary' | 'accent' | 'dark' | 'gradient' | 'urgent' | 'success'
    icon?: 'megaphone' | 'gift' | 'star' | 'fire' | 'sparkles' | 'none'
    dismissible?: boolean
  } | undefined

  const floatingCta = businessInfoWithWidgets?.floatingCta as {
    enabled?: boolean
    text?: string
    href?: string
    variant?: 'primary' | 'accent' | 'secondary' | 'dark' | 'gradient'
    icon?: 'arrow' | 'phone' | 'message' | 'calendar' | 'none'
    position?: 'bottom-right' | 'bottom-left' | 'bottom-center' | 'right-center' | 'left-center'
    shape?: 'pill' | 'rectangle'
    showOnMobile?: boolean
    pulseAnimation?: boolean
    dismissible?: boolean
    showAfterScroll?: number
    hideOnPaths?: string[]
  } | undefined

  const cookieConsent = businessInfoWithWidgets?.cookieConsent as {
    enabled?: boolean
    title?: string
    description?: string
    privacyPolicyUrl?: string
    acceptButtonText?: string
    rejectButtonText?: string
    customizeButtonText?: string
    saveButtonText?: string
    necessaryTitle?: string
    necessaryDescription?: string
    analyticsTitle?: string
    analyticsDescription?: string
    marketingTitle?: string
    marketingDescription?: string
    preferencesTitle?: string
    preferencesDescription?: string
    googleAnalyticsId?: string
    googleTagManagerId?: string
    facebookPixelId?: string
    tiktokPixelId?: string
    hotjarId?: string
    consentExpiry?: number
    showFloatingButton?: boolean
    position?: 'bottom' | 'bottom-left' | 'bottom-right'
  } | undefined

  // Generate inline CSS for theme to prevent FOUC
  const themeStyles = generateThemeStyles(siteThemeData)

  return (
    <>
      {/* Inline theme styles to prevent FOUC - React hoists to <head> */}
      <style dangerouslySetInnerHTML={{ __html: themeStyles }} />

      {/* Shop settings for hydration - ensures client has correct settings immediately */}
      {shopSettingsData && (
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__SHOP_SETTINGS__=${JSON.stringify(shopSettingsData)};`,
          }}
        />
      )}

      {/* JSON-LD Structured Data for LocalBusiness (Schema.org) */}
      {businessInfoData?.name && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: businessInfoData.name,
              description: businessInfoData.description || undefined,
              url: getServerSideURL(),
              telephone: businessInfoData.phone || undefined,
              email: businessInfoData.email || undefined,
              address: businessInfoData.address?.street ? {
                '@type': 'PostalAddress',
                streetAddress: businessInfoData.address.street,
                addressLocality: businessInfoData.address.city || undefined,
                addressRegion: businessInfoData.address.county || undefined,
                postalCode: businessInfoData.address.postalCode || undefined,
                addressCountry: businessInfoData.address.country || 'RO',
              } : undefined,
              geo: businessInfoData.coordinates?.lat && businessInfoData.coordinates?.lng ? {
                '@type': 'GeoCoordinates',
                latitude: businessInfoData.coordinates.lat,
                longitude: businessInfoData.coordinates.lng,
              } : undefined,
              openingHours: businessInfoData.workingHours?.map((item) =>
                `${item.days || ''}: ${item.hours || ''}`
              ) || undefined,
              sameAs: [
                businessInfoData.social?.facebook,
                businessInfoData.social?.instagram,
                businessInfoData.social?.linkedin,
                businessInfoData.social?.youtube,
                businessInfoData.social?.tiktok,
              ].filter(Boolean),
            }),
          }}
        />
      )}

      {/* JSON-LD WebSite Schema for Google Sitelinks Search Box */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: businessInfoData?.name || 'Business Website',
            url: getServerSideURL(),
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: `${getServerSideURL()}/cautare?q={search_term_string}`,
              },
              'query-input': 'required name=search_term_string',
            },
          }),
        }}
      />

    <ThemeProvider siteTheme={siteThemeData}>
      <AuthProvider>
        <ShopSettingsProvider settings={shopSettingsData}>
          <EcommerceProviderWrapper>
            <ToastProvider>
              {/* Announcement Bar - appears at very top */}
              {announcementBar?.enabled && announcementBar.message && (
                <AnnouncementBar
                  enabled={announcementBar.enabled}
                  message={announcementBar.message}
                  linkText={announcementBar.linkText}
                  linkUrl={announcementBar.linkUrl}
                  backgroundColor={announcementBar.backgroundColor}
                  icon={announcementBar.icon}
                  dismissible={announcementBar.dismissible}
                />
              )}

              <AdminBar />
              {/* Header is rendered in individual pages via PageWrapper */}
              <main id="main-content" className="relative min-h-screen">{children}</main>
              <Footer data={footerData} businessInfo={businessInfoData} logo={logoData} />

              {/* Floating widgets */}
              <WhatsAppFloat
                phoneNumber={businessInfoData?.whatsapp}
                defaultMessage={businessInfoWithWidgets?.whatsappFloat?.defaultMessage}
                position={businessInfoWithWidgets?.whatsappFloat?.position as 'bottom-right' | 'bottom-left' | null}
                showOnMobile={businessInfoWithWidgets?.whatsappFloat?.showOnMobile}
                tooltipText={businessInfoWithWidgets?.whatsappFloat?.tooltipText}
                pulseAnimation={businessInfoWithWidgets?.whatsappFloat?.pulseAnimation}
                enabled={businessInfoWithWidgets?.whatsappFloat?.enabled}
              />

              {/* Floating CTA Button (Plasturi style) */}
              {floatingCta?.enabled && floatingCta.text && floatingCta.href && (
                <FloatingCTA
                  text={floatingCta.text}
                  href={floatingCta.href}
                  variant={floatingCta.variant}
                  icon={floatingCta.icon}
                  position={floatingCta.position}
                  shape={floatingCta.shape}
                  showOnMobile={floatingCta.showOnMobile}
                  pulseAnimation={floatingCta.pulseAnimation}
                  dismissible={floatingCta.dismissible}
                  showAfterScroll={floatingCta.showAfterScroll}
                  hideOnPaths={floatingCta.hideOnPaths}
                />
              )}

              <BackToTop position="bottom-left" />

              {/* Cookie Consent Banner - GDPR Romania compliant */}
              {cookieConsent?.enabled !== false && (
                <CookieConsent
                  enabled={cookieConsent?.enabled ?? true}
                  title={cookieConsent?.title}
                  description={cookieConsent?.description}
                  privacyPolicyUrl={cookieConsent?.privacyPolicyUrl}
                  acceptButtonText={cookieConsent?.acceptButtonText}
                  rejectButtonText={cookieConsent?.rejectButtonText}
                  customizeButtonText={cookieConsent?.customizeButtonText}
                  saveButtonText={cookieConsent?.saveButtonText}
                  necessaryTitle={cookieConsent?.necessaryTitle}
                  necessaryDescription={cookieConsent?.necessaryDescription}
                  analyticsTitle={cookieConsent?.analyticsTitle}
                  analyticsDescription={cookieConsent?.analyticsDescription}
                  marketingTitle={cookieConsent?.marketingTitle}
                  marketingDescription={cookieConsent?.marketingDescription}
                  preferencesTitle={cookieConsent?.preferencesTitle}
                  preferencesDescription={cookieConsent?.preferencesDescription}
                />
              )}

              {/* Script Loader - Loads tracking scripts based on cookie consent */}
              {(cookieConsent?.googleAnalyticsId ||
                cookieConsent?.googleTagManagerId ||
                cookieConsent?.facebookPixelId ||
                cookieConsent?.tiktokPixelId ||
                cookieConsent?.hotjarId) && (
                <ScriptLoader
                  googleAnalyticsId={cookieConsent?.googleAnalyticsId}
                  googleTagManagerId={cookieConsent?.googleTagManagerId}
                  facebookPixelId={cookieConsent?.facebookPixelId}
                  tiktokPixelId={cookieConsent?.tiktokPixelId}
                  hotjarId={cookieConsent?.hotjarId}
                />
              )}
            </ToastProvider>
          </EcommerceProviderWrapper>
        </ShopSettingsProvider>
      </AuthProvider>
    </ThemeProvider>
    </>
  )
}
