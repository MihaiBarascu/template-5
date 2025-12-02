import React from 'react'
import Link from 'next/link'
import { Logo } from '@/components/Logo'
import type { Footer as FooterType, BusinessInfo, Logo as LogoType } from '@/payload-types'

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
