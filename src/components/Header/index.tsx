'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { Cart } from '@/components/cart'
import { useAuth } from '@/providers/Auth'
import { cn } from '@/utilities/cn'
import type { Header as HeaderType, Logo as LogoType, BusinessInfo, Page } from '@/payload-types'
import { SocialIcons, PhoneIcon, EmailIcon } from '@/blocks/_shared/iconComponents'

type NavItem = NonNullable<HeaderType['navItems']>[number]
type SubmenuItem = NonNullable<NavItem['submenu']>[number]
type TopBarType = NonNullable<HeaderType['topBar']>

// TopBar Component - uses all admin configuration
function TopBarContent({
  topBar,
  businessInfo,
  isHeaderTransparent,
  hideTopBar,
  useContainer,
}: {
  topBar: TopBarType
  businessInfo: BusinessInfo | null
  isHeaderTransparent: boolean
  hideTopBar: boolean
  useContainer: boolean
}) {
  const layout = topBar.layout || 'social-left'
  const bgColor = topBar.backgroundColor || 'dark'

  // Background color classes based on admin setting
  const getBgClass = () => {
    if (isHeaderTransparent) return 'bg-transparent'
    switch (bgColor) {
      case 'primary': return 'bg-theme-primary'
      case 'transparent': return 'bg-transparent'
      case 'light': return 'bg-theme-light text-theme-text'
      default: return 'bg-theme-dark'
    }
  }

  // Get social links - use custom if provided, otherwise from businessInfo
  const getSocialLinks = () => {
    if (topBar.customSocialLinks && topBar.customSocialLinks.length > 0) {
      return topBar.customSocialLinks.map(link => ({
        platform: link.platform,
        url: link.url,
      }))
    }
    // Fall back to businessInfo social
    if (!businessInfo?.social) return []
    const links: { platform: string; url: string }[] = []
    if (businessInfo.social.facebook) links.push({ platform: 'facebook', url: businessInfo.social.facebook })
    if (businessInfo.social.instagram) links.push({ platform: 'instagram', url: businessInfo.social.instagram })
    if (businessInfo.social.youtube) links.push({ platform: 'youtube', url: businessInfo.social.youtube })
    if (businessInfo.social.tiktok) links.push({ platform: 'tiktok', url: businessInfo.social.tiktok })
    if (businessInfo.social.twitter) links.push({ platform: 'twitter', url: businessInfo.social.twitter })
    if (businessInfo.social.linkedin) links.push({ platform: 'linkedin', url: businessInfo.social.linkedin })
    return links
  }

  // Social Icons renderer
  const SocialIconsBlock = () => {
    if (!topBar.showSocial) return null
    const links = getSocialLinks()
    if (links.length === 0) return null

    return (
      <div className="flex items-center gap-3">
        {links.map((link, idx) => {
          const icon = SocialIcons[link.platform as keyof typeof SocialIcons]
          if (!icon) return null
          return (
            <a
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center hover:opacity-80 [&_svg]:w-4 [&_svg]:h-4"
              aria-label={link.platform}
            >
              {icon}
            </a>
          )
        })}
      </div>
    )
  }

  // Contact Info renderer (phone, email)
  const ContactBlock = () => {
    const hasPhone = topBar.showPhone && businessInfo?.phone
    const hasEmail = topBar.showEmail && businessInfo?.email
    if (!hasPhone && !hasEmail) return null

    return (
      <div className="flex items-center gap-4">
        {hasPhone && (
          <a href={`tel:${businessInfo?.phone}`} className="hover:opacity-80 flex items-center gap-1.5">
            <PhoneIcon className="w-4 h-4" />
            <span>{businessInfo?.phone}</span>
          </a>
        )}
        {hasEmail && (
          <a href={`mailto:${businessInfo?.email}`} className="hover:opacity-80 hidden md:flex items-center gap-1.5">
            <EmailIcon className="w-4 h-4" />
            <span>{businessInfo?.email}</span>
          </a>
        )}
      </div>
    )
  }

  // Custom text/message renderer
  const MessageBlock = () => {
    if (!topBar.customText) return null
    return <span className="hidden sm:block">{topBar.customText}</span>
  }

  // Render based on layout configuration
  const renderContent = () => {
    switch (layout) {
      case 'social-left':
        // Social left, contact + message right
        return (
          <>
            <SocialIconsBlock />
            <div className="flex items-center gap-4">
              <MessageBlock />
              <ContactBlock />
            </div>
          </>
        )
      case 'message-left':
        // Message + contact left, social right
        return (
          <>
            <div className="flex items-center gap-4">
              <MessageBlock />
              <ContactBlock />
            </div>
            <SocialIconsBlock />
          </>
        )
      case 'contact-left':
        // Contact left, social + message right
        return (
          <>
            <ContactBlock />
            <div className="flex items-center gap-4">
              <MessageBlock />
              <SocialIconsBlock />
            </div>
          </>
        )
      case 'centered':
        // Everything centered
        return (
          <div className="flex items-center justify-center gap-6 w-full">
            <SocialIconsBlock />
            <ContactBlock />
            <MessageBlock />
          </div>
        )
      default:
        return (
          <>
            <SocialIconsBlock />
            <ContactBlock />
          </>
        )
    }
  }

  return (
    <div className={cn(
      "text-white py-2 text-sm transition-all duration-300",
      getBgClass(),
      hideTopBar && "h-0 py-0 overflow-hidden opacity-0"
    )}>
      <div className={cn(
        "flex items-center",
        layout === 'centered' ? "justify-center" : "justify-between",
        useContainer ? "container mx-auto px-4" : "px-6 md:px-12"
      )}>
        {renderContent()}
      </div>
    </div>
  )
}

interface HeaderProps {
  data: HeaderType | null
  logo: LogoType | null
  businessInfo: BusinessInfo | null
  showCart?: boolean
}

export function Header({ data, logo, businessInfo, showCart = false }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileOpenSubmenu, setMobileOpenSubmenu] = useState<number | null>(null)
  const [openDropdown, setOpenDropdown] = useState<number | null>(null)
  const [focusedSubmenuIndex, setFocusedSubmenuIndex] = useState<number>(-1)
  const [scrolled, setScrolled] = useState(false)
  const dropdownRefs = useRef<(HTMLDivElement | null)[]>([])
  const submenuRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const { user, status } = useAuth()

  // Scroll detection for header state changes
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50
      setScrolled(isScrolled)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Check initial state

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown !== null) {
        const dropdownEl = dropdownRefs.current[openDropdown]
        if (dropdownEl && !dropdownEl.contains(event.target as Node)) {
          setOpenDropdown(null)
          setFocusedSubmenuIndex(-1)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [openDropdown])

  // Handle keyboard navigation for dropdowns
  const handleDropdownKeyDown = useCallback((
    event: React.KeyboardEvent,
    index: number,
    submenuLength: number
  ) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
      case 'ArrowDown':
        event.preventDefault()
        if (openDropdown !== index) {
          setOpenDropdown(index)
          setFocusedSubmenuIndex(0)
          // Focus first submenu item after state update
          setTimeout(() => {
            submenuRefs.current[0]?.focus()
          }, 0)
        } else if (event.key === 'ArrowDown') {
          const nextIndex = Math.min(focusedSubmenuIndex + 1, submenuLength - 1)
          setFocusedSubmenuIndex(nextIndex)
          submenuRefs.current[nextIndex]?.focus()
        }
        break
      case 'ArrowUp':
        event.preventDefault()
        if (openDropdown === index && focusedSubmenuIndex > 0) {
          const prevIndex = focusedSubmenuIndex - 1
          setFocusedSubmenuIndex(prevIndex)
          submenuRefs.current[prevIndex]?.focus()
        }
        break
      case 'Escape':
        event.preventDefault()
        setOpenDropdown(null)
        setFocusedSubmenuIndex(-1)
        // Return focus to the dropdown trigger
        const trigger = dropdownRefs.current[index]?.querySelector('button')
        trigger?.focus()
        break
      case 'Tab':
        // Allow natural tab behavior but close dropdown
        setOpenDropdown(null)
        setFocusedSubmenuIndex(-1)
        break
    }
  }, [openDropdown, focusedSubmenuIndex])

  // Handle submenu item keyboard navigation
  const handleSubmenuKeyDown = useCallback((
    event: React.KeyboardEvent,
    dropdownIndex: number,
    submenuIndex: number,
    submenuLength: number
  ) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        if (submenuIndex < submenuLength - 1) {
          const nextIndex = submenuIndex + 1
          setFocusedSubmenuIndex(nextIndex)
          submenuRefs.current[nextIndex]?.focus()
        }
        break
      case 'ArrowUp':
        event.preventDefault()
        if (submenuIndex > 0) {
          const prevIndex = submenuIndex - 1
          setFocusedSubmenuIndex(prevIndex)
          submenuRefs.current[prevIndex]?.focus()
        } else {
          // Go back to trigger
          const trigger = dropdownRefs.current[dropdownIndex]?.querySelector('button')
          trigger?.focus()
          setFocusedSubmenuIndex(-1)
        }
        break
      case 'Escape':
        event.preventDefault()
        setOpenDropdown(null)
        setFocusedSubmenuIndex(-1)
        const trigger = dropdownRefs.current[dropdownIndex]?.querySelector('button')
        trigger?.focus()
        break
      case 'Tab':
        setOpenDropdown(null)
        setFocusedSubmenuIndex(-1)
        break
    }
  }, [])

  const variant = data?.variant || 'standard'
  const navItems = data?.navItems || []
  const ctaButton = data?.ctaButton
  // TopBar shows when enabled via checkbox in admin
  const showTopBar = data?.showTopBar === true && !!data?.topBar
  const useContainer = variant !== 'full-width'
  const isTransparentSetting = data?.isTransparent || false

  // Header state based on transparency and scroll
  // TopBar always hides on scroll
  // Header becomes solid on scroll when transparent setting is enabled
  const isHeaderTransparent = isTransparentSetting && !scrolled
  const hideTopBar = scrolled // TopBar hides on scroll in all cases

  const getItemHref = (item: NavItem | SubmenuItem): string => {
    if (item.type === 'reference' && item.reference) {
      const page = item.reference.value
      const slug = typeof page === 'string' ? page : (page as Page)?.slug
      return `/${slug || ''}`
    }
    return item.url || '#'
  }

  return (
    <header className={cn(
      'w-full transition-all duration-300',
      data?.sticky && 'sticky top-0 z-50',
      // When transparent and not scrolled, position absolute to overlay content
      isHeaderTransparent && 'absolute left-0 right-0'
    )}>
      {/* Top Bar - fully configurable from admin */}
      {showTopBar && data?.topBar && (
        <TopBarContent
          topBar={data.topBar}
          businessInfo={businessInfo}
          isHeaderTransparent={isHeaderTransparent}
          hideTopBar={hideTopBar}
          useContainer={useContainer}
        />
      )}

      {/* Main Header */}
      <div className={cn(
        'transition-all duration-300',
        // Background based on transparent state
        isHeaderTransparent
          ? 'bg-transparent border-transparent'
          : 'bg-theme-surface border-b border-theme-border shadow-sm'
      )}>
        <div className={cn(
          useContainer ? 'container mx-auto px-4' : 'px-6 md:px-12'
        )}>
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Logo data={logo} businessName={businessInfo?.name} />
            </Link>

            {/* Navigation - Desktop */}
            <nav className="hidden md:flex flex-1 items-center justify-end gap-1">
              {navItems.map((item: NavItem, index: number) => {
                const hasSubmenu = item.hasSubmenu && (item.submenu?.length ?? 0) > 0

                if (hasSubmenu) {
                  const isOpen = openDropdown === index
                  const submenuItems = item.submenu || []

                  return (
                    <div
                      key={index}
                      className="relative group"
                      ref={(el) => { dropdownRefs.current[index] = el }}
                      onMouseEnter={() => setOpenDropdown(index)}
                      onMouseLeave={() => {
                        setOpenDropdown(null)
                        setFocusedSubmenuIndex(-1)
                      }}
                    >
                      {/* Dropdown Trigger - accessible button */}
                      <button
                        type="button"
                        className={cn(
                          "flex items-center gap-1 px-3 py-2 rounded-lg transition-colors font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-theme-primary focus-visible:ring-offset-2",
                          isHeaderTransparent
                            ? "text-white hover:text-white/80 hover:bg-white/10"
                            : "text-theme-text hover:text-theme-primary hover:bg-gray-50"
                        )}
                        aria-expanded={isOpen}
                        aria-haspopup="true"
                        onKeyDown={(e) => handleDropdownKeyDown(e, index, submenuItems.length)}
                        onClick={() => setOpenDropdown(isOpen ? null : index)}
                      >
                        {item.label}
                        <svg
                          className={cn(
                            "w-4 h-4 transition-transform",
                            isOpen && "rotate-180"
                          )}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* Dropdown Menu - appears on hover or keyboard */}
                      <div
                        className={cn(
                          "absolute left-0 top-full pt-2 transition-all duration-200 z-50",
                          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
                        )}
                        role="menu"
                        aria-orientation="vertical"
                      >
                        <div className="min-w-[200px] bg-white rounded-lg shadow-lg border border-gray-100 py-2">
                          {submenuItems.map((subItem: SubmenuItem, subIndex: number) => (
                            <Link
                              key={subIndex}
                              ref={(el) => { submenuRefs.current[subIndex] = el }}
                              href={getItemHref(subItem)}
                              className={cn(
                                "block px-4 py-2 text-gray-700 hover:text-theme-primary hover:bg-gray-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-theme-primary",
                                focusedSubmenuIndex === subIndex && "bg-gray-50 text-theme-primary"
                              )}
                              target={subItem.newTab ? '_blank' : undefined}
                              role="menuitem"
                              tabIndex={isOpen ? 0 : -1}
                              onKeyDown={(e) => handleSubmenuKeyDown(e, index, subIndex, submenuItems.length)}
                              onClick={() => {
                                setOpenDropdown(null)
                                setFocusedSubmenuIndex(-1)
                              }}
                            >
                              <span className="font-medium">{subItem.label}</span>
                              {subItem.description && (
                                <span className="block text-sm text-gray-500 mt-0.5">{subItem.description}</span>
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                }

                return (
                  <Link
                    key={index}
                    href={getItemHref(item)}
                    className={cn(
                      "px-3 py-2 rounded-lg transition-colors font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-theme-primary focus-visible:ring-offset-2",
                      isHeaderTransparent
                        ? "text-white hover:text-white/80 hover:bg-white/10"
                        : "text-theme-text hover:text-theme-primary hover:bg-gray-50"
                    )}
                    target={item.newTab ? '_blank' : undefined}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            {/* Account, Cart & CTA Button & Mobile Menu */}
            <div className="flex items-center gap-3">
              {/* Account Button - shows when ecommerce is active (showCart) */}
              {(showCart || ctaButton?.link === '/cos') && (
                <Link
                  href={status === 'loggedIn' ? '/cont' : '/cont/login'}
                  className={cn(
                    "hidden sm:flex items-center gap-2 p-2 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-theme-primary focus-visible:ring-offset-2",
                    isHeaderTransparent
                      ? "text-white hover:bg-white/10"
                      : "text-theme-text hover:bg-gray-100"
                  )}
                  aria-label={status === 'loggedIn' ? 'Contul meu' : 'Autentificare'}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {status === 'loggedIn' && user?.name && (
                    <span className="text-sm font-medium max-w-[100px] truncate">{user.name}</span>
                  )}
                </Link>
              )}

              {/* Cart Button - shows if showCart is true OR if CTA is a cart link */}
              {(showCart || ctaButton?.link === '/cos') && (
                <Cart />
              )}

              {/* CTA Button - hide if it's a cart link (replaced by Cart above) */}
              {ctaButton?.enabled && ctaButton.link !== '/cos' && (
                <Link
                  href={ctaButton.link || '/contact'}
                  className={cn(
                    'hidden sm:inline-flex items-center px-4 py-2 rounded-theme-button font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                    ctaButton.variant === 'outline'
                      ? 'border-2 border-theme-primary text-theme-primary hover:bg-theme-primary hover:text-white focus-visible:ring-theme-primary'
                      : ctaButton.variant === 'ghost'
                        ? 'text-theme-primary hover:bg-theme-primary/10 focus-visible:ring-theme-primary'
                        : 'bg-theme-primary text-white hover:opacity-90 focus-visible:ring-theme-primary'
                  )}
                >
                  {ctaButton.label || 'Contact'}
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                className={cn(
                  "md:hidden p-2 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-theme-primary focus-visible:ring-offset-2",
                  isHeaderTransparent
                    ? "text-white hover:bg-white/10"
                    : "hover:bg-gray-100"
                )}
                aria-label="Meniu"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        'md:hidden bg-theme-surface border-b border-theme-border overflow-hidden transition-all duration-300',
        mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
      )}>
        <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
          {navItems.map((item: NavItem, index: number) => {
            const hasSubmenu = item.hasSubmenu && (item.submenu?.length ?? 0) > 0

            if (hasSubmenu) {
              const isOpen = mobileOpenSubmenu === index
              const itemHref = getItemHref(item)
              const hasParentLink = itemHref && itemHref !== '#'

              return (
                <div key={index}>
                  <div className="flex items-center justify-between">
                    {/* Parent link - navigates to page */}
                    {hasParentLink ? (
                      <Link
                        href={itemHref}
                        className="flex-1 py-2 px-3 rounded-lg text-theme-text hover:text-theme-primary hover:bg-gray-50 transition-colors font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-theme-primary focus-visible:ring-inset"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span className="flex-1 py-2 px-3 text-theme-text font-medium">
                        {item.label}
                      </span>
                    )}

                    {/* Chevron button - toggles submenu */}
                    <button
                      onClick={() => setMobileOpenSubmenu(isOpen ? null : index)}
                      className={cn(
                        'p-2 rounded-lg text-theme-text hover:text-theme-primary hover:bg-gray-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-theme-primary focus-visible:ring-offset-2',
                        isOpen && 'text-theme-primary bg-gray-50'
                      )}
                      aria-label={isOpen ? 'Inchide submeniu' : 'Deschide submeniu'}
                      aria-expanded={isOpen}
                    >
                      <svg
                        className={cn(
                          'w-5 h-5 transition-transform',
                          isOpen && 'rotate-180'
                        )}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  {/* Mobile Submenu */}
                  <div className={cn(
                    'overflow-hidden transition-all duration-300',
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  )}>
                    <div className="pl-4 py-2 space-y-1">
                      {item.submenu?.map((subItem: SubmenuItem, subIndex: number) => (
                        <Link
                          key={subIndex}
                          href={getItemHref(subItem)}
                          className="block py-2 px-3 rounded-lg text-gray-600 hover:text-theme-primary hover:bg-gray-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-theme-primary focus-visible:ring-inset"
                          onClick={() => {
                            setMobileMenuOpen(false)
                            setMobileOpenSubmenu(null)
                          }}
                          target={subItem.newTab ? '_blank' : undefined}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )
            }

            return (
              <Link
                key={index}
                href={getItemHref(item)}
                className="py-2 px-3 rounded-lg text-theme-text hover:text-theme-primary hover:bg-gray-50 transition-colors font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-theme-primary focus-visible:ring-inset"
                target={item.newTab ? '_blank' : undefined}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            )
          })}

          {/* Mobile Account Button - shows if showCart OR CTA is cart link */}
          {(showCart || ctaButton?.link === '/cos') && (
            <Link
              href={status === 'loggedIn' ? '/cont' : '/cont/login'}
              className="mt-2 flex items-center justify-center gap-2 px-4 py-3 rounded-theme-button font-medium border-2 border-theme-primary text-theme-primary hover:bg-theme-primary hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-theme-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {status === 'loggedIn' ? (user?.name || 'Contul meu') : 'Autentificare'}
            </Link>
          )}

          {/* Mobile Cart Button - shows if showCart OR CTA is cart link */}
          {(showCart || ctaButton?.link === '/cos') && (
            <Link
              href="/cos"
              className="mt-2 flex items-center justify-center gap-2 px-4 py-3 rounded-theme-button font-medium bg-theme-primary text-white hover:bg-theme-primary/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-theme-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Cos de cumparaturi
            </Link>
          )}

          {/* CTA Button - hide if it's cart link */}
          {ctaButton?.enabled && ctaButton.link !== '/cos' && (
            <Link
              href={ctaButton.link || '/contact'}
              className={cn(
                'mt-2 text-center px-4 py-3 rounded-theme-button font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                ctaButton.variant === 'outline'
                  ? 'border-2 border-theme-primary text-theme-primary hover:bg-theme-primary hover:text-white focus-visible:ring-theme-primary'
                  : ctaButton.variant === 'ghost'
                    ? 'text-theme-primary hover:bg-theme-primary/10 focus-visible:ring-theme-primary'
                    : 'bg-theme-primary text-white hover:opacity-90 focus-visible:ring-theme-primary'
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              {ctaButton.label || 'Contact'}
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header
