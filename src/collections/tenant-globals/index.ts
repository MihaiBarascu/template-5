/**
 * Tenant Globals - Collections that behave like globals per tenant
 *
 * In multi-tenant architecture, what were previously globals become
 * collections with exactly ONE document per tenant (isGlobal: true in plugin config).
 *
 * These collections store tenant-specific settings:
 * - SiteTheme: Design and styling
 * - BusinessInfo: Contact, hours, social media
 * - Header: Navigation, top bar, CTA button
 * - Footer: Columns, links, copyright
 * - Logo: Text, images, favicon
 * - ShopSettings: Currency, VAT, shipping, payments
 * - SystemPages: Products, cart, checkout, account page settings
 */

export { SiteThemeCollection } from './SiteThemeCollection'
export { BusinessInfoCollection } from './BusinessInfoCollection'
export { HeaderCollection } from './HeaderCollection'
export { FooterCollection } from './FooterCollection'
export { LogoCollection } from './LogoCollection'
export { ShopSettingsCollection } from './ShopSettingsCollection'
export { SystemPagesCollection } from './SystemPagesCollection'
