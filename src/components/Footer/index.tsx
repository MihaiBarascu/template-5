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

  const getCopyrightText = () => {
    let text = data?.copyright || '© {year} {businessName}. Toate drepturile rezervate.'
    text = text.replace('{year}', currentYear.toString())
    text = text.replace('{businessName}', businessInfo?.name || 'Business')
    return text
  }

  return (
    <footer className="bg-theme-dark text-white">
      <div className="container mx-auto py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo & Description */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Logo data={logo} businessName={businessInfo?.name} variant="light" />
            </Link>
            {businessInfo?.description && (
              <p className="text-gray-400 text-sm leading-relaxed">
                {businessInfo.description}
              </p>
            )}
          </div>

          {/* Dynamic Columns */}
          {data?.columns?.map((column, index) => (
            <div key={index}>
              {column.title && (
                <h4 className="font-semibold mb-4">{column.title}</h4>
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
                          className="text-gray-400 hover:text-white transition-colors text-sm"
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
                <ul className="space-y-2 text-sm text-gray-400">
                  {businessInfo.address?.street && (
                    <li>{businessInfo.address.street}</li>
                  )}
                  {businessInfo.address?.city && (
                    <li>{businessInfo.address.city}, {businessInfo.address.county}</li>
                  )}
                  {businessInfo.phone && (
                    <li>
                      <a href={`tel:${businessInfo.phone}`} className="hover:text-white">
                        {businessInfo.phone}
                      </a>
                    </li>
                  )}
                  {businessInfo.email && (
                    <li>
                      <a href={`mailto:${businessInfo.email}`} className="hover:text-white">
                        {businessInfo.email}
                      </a>
                    </li>
                  )}
                </ul>
              )}

              {column.type === 'schedule' && businessInfo?.workingHours && (
                <ul className="space-y-2 text-sm text-gray-400">
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
                      className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                      FB
                    </a>
                  )}
                  {businessInfo.social.instagram && (
                    <a
                      href={businessInfo.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                      IG
                    </a>
                  )}
                  {businessInfo.social.tiktok && (
                    <a
                      href={businessInfo.social.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                      TK
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Badges & Payment Methods */}
        {((data?.badges && data.badges.length > 0) || (data?.showPaymentIcons && data?.paymentMethods && data.paymentMethods.length > 0)) && (
          <div className="border-t border-gray-800 pt-8 mb-8 flex flex-wrap justify-center items-center gap-6">
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
                    className="w-12 h-8 bg-white/10 rounded flex items-center justify-center text-xs font-medium text-gray-400"
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
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
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
                    className="text-gray-400 hover:text-white transition-colors"
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
