import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Logo } from '@/components/Logo'
import type { Footer as FooterType, BusinessInfo, Logo as LogoType, Media } from '@/payload-types'

interface WorkingHoursItem {
  days: string
  hours: string
}

interface FooterProps {
  data: FooterType | null
  businessInfo: BusinessInfo | null
  logo: LogoType | null
}

export function Footer({ data, businessInfo, logo }: FooterProps) {
  const currentYear = new Date().getFullYear()
  const _variant = data?.variant || 'columns-4'
  const colorScheme = data?.colorScheme || 'dark'

  // Color classes based on colorScheme
  const bgClass = colorScheme === 'dark' ? 'bg-theme-dark' : 'bg-theme-light'
  const textClass = colorScheme === 'dark' ? 'text-theme-text-on-dark' : 'text-theme-text-on-light'
  const textMutedClass = colorScheme === 'dark' ? 'text-theme-text-on-dark/80' : 'text-theme-text-on-light/80'
  const borderClass = colorScheme === 'dark' ? 'border-gray-800' : 'border-gray-200'
  const overlayClass = colorScheme === 'dark' ? 'bg-theme-dark/50' : 'bg-theme-light/50'
  const socialBgClass = colorScheme === 'dark' ? 'bg-white/10 hover:bg-white/20' : 'bg-black/10 hover:bg-black/20'
  // Link-urile folosesc culoarea accent (auriu pentru dark-gold theme)
  const linkClass = colorScheme === 'dark' ? 'text-theme-accent hover:text-theme-secondary' : 'text-theme-primary hover:text-theme-secondary'

  // Background texture settings (imagine mare pe tot footer-ul, nu se repeta)
  const bgImage = data?.backgroundImage as Media | null
  const bgImageUrl = bgImage?.url
  const bgOpacity = (data?.backgroundOpacity ?? 20) / 100

  // Decorative element settings (like Elyssium Gym)
  const decorativeImage = data?.decorativeImage as Media | null
  const decorativeImageUrl = decorativeImage?.url
  const decorativePosition = data?.decorativePosition || 'left'
  const decorativeOpacity = (data?.decorativeOpacity ?? 30) / 100
  const decorativeSize = data?.decorativeSize || 'medium'

  // Get decorative size in pixels
  const getDecorativeWidth = () => {
    switch (decorativeSize) {
      case 'small': return 300
      case 'medium': return 400
      case 'large': return 500
      case 'xl': return 600
      default: return 400
    }
  }

  // Get decorative position classes
  const getDecorativePositionStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      zIndex: 2,
      pointerEvents: 'none',
      width: getDecorativeWidth(),
      height: 'auto',
      opacity: decorativeOpacity,
    }

    switch (decorativePosition) {
      case 'left':
        return { ...baseStyle, left: 0, top: '50%', transform: 'translateY(-50%)' }
      case 'right':
        return { ...baseStyle, right: 0, top: '50%', transform: 'translateY(-50%)' }
      case 'bottom-left':
        return { ...baseStyle, left: 0, bottom: 0 }
      case 'bottom-right':
        return { ...baseStyle, right: 0, bottom: 0 }
      default:
        return { ...baseStyle, left: 0, top: '50%', transform: 'translateY(-50%)' }
    }
  }

  const getCopyrightText = () => {
    let text = data?.copyright || '© {year} {businessName}. Toate drepturile rezervate.'
    text = text.replace('{year}', currentYear.toString())
    text = text.replace('{businessName}', businessInfo?.name || 'Business')
    return text
  }

  return (
    <footer className={`${bgClass} ${textClass} relative overflow-hidden`}>
      {/* Background texture image (imagine mare pe tot, nu se repeta) */}
      {bgImageUrl && (
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: `url(${bgImageUrl})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            opacity: bgOpacity,
          }}
        />
      )}

      {/* Theme color overlay - se aplica peste textura pentru a se integra cu tema */}
      {bgImageUrl && (
        <div
          className={`absolute inset-0 z-[1] pointer-events-none ${overlayClass}`}
        />
      )}

      {/* Decorative element (pozitionat intr-o parte, ca la Elyssium) */}
      {decorativeImageUrl && (
        <Image
          src={decorativeImageUrl}
          alt="Decorative element"
          width={getDecorativeWidth()}
          height={400}
          style={getDecorativePositionStyle()}
          className="hidden md:block"
        />
      )}
      <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo & Description */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Logo data={logo} businessName={businessInfo?.name} variant={colorScheme === 'dark' ? 'light' : 'dark'} />
            </Link>
            {businessInfo?.description && (
              <p className={`${textMutedClass} text-sm leading-relaxed`}>
                {businessInfo.description}
              </p>
            )}
          </div>

          {/* Dynamic Columns */}
          {data?.columns?.map((column, index) => (
            <div key={index}>
              {column.title && (
                <span className={`block font-semibold mb-4 ${textClass}`}>{column.title}</span>
              )}

              {column.type === 'links' && column.links && (
                <ul className="space-y-2">
                  {column.links.map((link, linkIndex: number) => {
                    // Handle both populated (object) and unpopulated (string) references
                    const refValue = link.reference?.value
                    const refSlug = refValue && typeof refValue !== 'string' ? refValue.slug : ''
                    const href = link.type === 'reference' ? `/${refSlug || ''}` : link.url || '#'

                    return (
                      <li key={link.id || linkIndex}>
                        <Link
                          href={href}
                          className={`${linkClass} transition-colors text-sm`}
                          target={link.newTab ? '_blank' : undefined}
                        >
                          {link.label}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              )}

              {column.type === 'contact' && businessInfo && (
                <ul className={`space-y-2 text-sm ${textMutedClass}`}>
                  {businessInfo.address?.street && (
                    <li>{businessInfo.address.street}</li>
                  )}
                  {businessInfo.address?.city && (
                    <li>{businessInfo.address.city}, {businessInfo.address.county}</li>
                  )}
                  {businessInfo.phone && (
                    <li>
                      <a href={`tel:${businessInfo.phone}`} className={`${linkClass} transition-colors`}>
                        {businessInfo.phone}
                      </a>
                    </li>
                  )}
                  {businessInfo.email && (
                    <li>
                      <a href={`mailto:${businessInfo.email}`} className={`${linkClass} transition-colors`}>
                        {businessInfo.email}
                      </a>
                    </li>
                  )}
                </ul>
              )}

              {column.type === 'schedule' && businessInfo?.workingHours && (
                <ul className={`space-y-2 text-sm ${textMutedClass}`}>
                  {(businessInfo.workingHours as WorkingHoursItem[]).map((item, i: number) => (
                    <li key={i} className="flex justify-between">
                      <span>{item.days}</span>
                      <span>{item.hours}</span>
                    </li>
                  ))}
                </ul>
              )}

              {column.type === 'social' && businessInfo?.social && (
                <div className="flex gap-3">
                  {businessInfo.social.facebook && (
                    <a
                      href={businessInfo.social.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-10 h-10 ${socialBgClass} rounded-full flex items-center justify-center transition-colors`}
                    >
                      FB
                    </a>
                  )}
                  {businessInfo.social.instagram && (
                    <a
                      href={businessInfo.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-10 h-10 ${socialBgClass} rounded-full flex items-center justify-center transition-colors`}
                    >
                      IG
                    </a>
                  )}
                  {businessInfo.social.tiktok && (
                    <a
                      href={businessInfo.social.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-10 h-10 ${socialBgClass} rounded-full flex items-center justify-center transition-colors`}
                    >
                      TK
                    </a>
                  )}
                </div>
              )}

              {column.type === 'text' && column.text && (
                <p className={`text-sm ${textMutedClass} whitespace-pre-line`}>
                  {column.text}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Badges & Payment Methods */}
        {((data?.badges && data.badges.length > 0) || (data?.showPaymentIcons && data?.paymentMethods && data.paymentMethods.length > 0)) && (
          <div className={`border-t ${borderClass} pt-8 mb-8 flex flex-wrap justify-center items-center gap-6`}>
            {/* ANPC and other badges */}
            {data?.badges?.map((badge, index) => {
              const imageData = badge.image as Media | null
              const imageUrl = imageData?.url

              if (!imageUrl) return null

              const BadgeImage = (
                <Image
                  src={imageUrl}
                  alt={badge.alt || 'Badge'}
                  width={100}
                  height={40}
                  className="h-10 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
                />
              )

              if (badge.link) {
                return (
                  <a
                    key={badge.id || index}
                    href={badge.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    {BadgeImage}
                  </a>
                )
              }

              return <div key={badge.id || index}>{BadgeImage}</div>
            })}

            {/* Payment Methods */}
            {data?.showPaymentIcons && data?.paymentMethods && data.paymentMethods.length > 0 && (
              <div className="flex items-center gap-3">
                {data.paymentMethods.map((method) => (
                  <div
                    key={method}
                    className={`w-12 h-8 ${socialBgClass} rounded flex items-center justify-center text-xs font-medium ${textMutedClass}`}
                    title={method}
                  >
                    {method === 'visa' && (
                      <svg className="w-8 h-5" viewBox="0 0 48 32" fill="currentColor">
                        <path d="M18.5 21.5h-3.1l1.9-12h3.1l-1.9 12zm13.6-11.7c-.6-.2-1.6-.5-2.8-.5-3.1 0-5.3 1.7-5.3 4 0 1.8 1.6 2.8 2.8 3.4 1.2.6 1.6 1 1.6 1.5 0 .8-1 1.2-1.9 1.2-1.3 0-1.9-.2-3-.7l-.4-.2-.4 2.6c.7.3 2.1.6 3.5.6 3.3 0 5.4-1.6 5.5-4.1 0-1.4-.8-2.4-2.6-3.3-1.1-.6-1.7-.9-1.7-1.5 0-.5.6-1 1.7-1 1 0 1.7.2 2.3.4l.3.2.4-2.6zM40.6 9.5h-2.4c-.8 0-1.3.2-1.7 1l-4.7 11h3.3l.7-1.8h4l.4 1.8h2.9l-2.5-12zm-3.8 7.7c.3-.7 1.3-3.5 1.3-3.5s.3-.7.4-1.2l.2 1.1.8 3.6h-2.7z" />
                      </svg>
                    )}
                    {method === 'mastercard' && (
                      <svg className="w-8 h-5" viewBox="0 0 48 32" fill="currentColor">
                        <circle cx="18" cy="16" r="10" fillOpacity="0.8" />
                        <circle cx="30" cy="16" r="10" fillOpacity="0.6" />
                      </svg>
                    )}
                    {method === 'paypal' && 'PayPal'}
                    {method === 'cash' && 'Cash'}
                    {method === 'bank' && 'Bank'}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bottom Bar */}
        <div className={`border-t ${borderClass} pt-8 flex flex-col md:flex-row justify-between items-center gap-4`}>
          <p className={`${textMutedClass} text-sm`}>
            {getCopyrightText()}
          </p>

          {/* Legal Links */}
          {data?.legalLinks && data.legalLinks.length > 0 && (
            <div className="flex gap-4 text-sm">
              {data.legalLinks.map((link, index) => {
                const refValue = link.reference?.value
                const refSlug = refValue && typeof refValue !== 'string' ? refValue.slug : ''
                const href = link.type === 'reference' ? `/${refSlug || ''}` : link.url || '#'

                return (
                  <Link
                    key={index}
                    href={href}
                    className={`${linkClass} transition-colors`}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}

export default Footer
