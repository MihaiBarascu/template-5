'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { cn } from '@/utilities/cn'
import type { Header as HeaderType, Logo as LogoType, BusinessInfo, Page } from '@/payload-types'

type NavItem = NonNullable<HeaderType['navItems']>[number]
type SubmenuItem = NonNullable<NavItem['submenu']>[number]

interface HeaderProps {
  data: HeaderType | null
  logo: LogoType | null
  businessInfo: BusinessInfo | null
}

export function Header({ data, logo, businessInfo }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileOpenSubmenu, setMobileOpenSubmenu] = useState<number | null>(null)
  const [openDropdown, setOpenDropdown] = useState<number | null>(null)
  const [focusedSubmenuIndex, setFocusedSubmenuIndex] = useState<number>(-1)
  const dropdownRefs = useRef<(HTMLDivElement | null)[]>([])
  const submenuRefs = useRef<(HTMLAnchorElement | null)[]>([])

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
  const showTopBar = variant === 'with-topbar'

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
      'w-full',
      data?.sticky && 'sticky top-0 z-50'
    )}>
      {/* Top Bar */}
      {showTopBar && data?.topBar && (
        <div className="bg-theme-dark text-white py-2 text-sm">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {data.topBar.showPhone && businessInfo?.phone && (
                <a href={`tel:${businessInfo.phone}`} className="hover:opacity-80">
                  {businessInfo.phone}
                </a>
              )}
              {data.topBar.showEmail && businessInfo?.email && (
                <a href={`mailto:${businessInfo.email}`} className="hover:opacity-80 hidden md:block">
                  {businessInfo.email}
                </a>
              )}
            </div>
            <div className="flex items-center gap-4">
              {data.topBar.customText && (
                <span>{data.topBar.customText}</span>
              )}
              {data.topBar.showSocial && businessInfo?.social && (
                <div className="flex items-center gap-2">
                  {businessInfo.social.facebook && (
                    <a href={businessInfo.social.facebook} target="_blank" rel="noopener noreferrer">
                      FB
                    </a>
                  )}
                  {businessInfo.social.instagram && (
                    <a href={businessInfo.social.instagram} target="_blank" rel="noopener noreferrer">
                      IG
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Header */}
      <div className={cn(
        'bg-theme-surface border-b border-theme-border',
        variant === 'transparent' && 'bg-transparent border-transparent absolute w-full'
      )}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Logo data={logo} businessName={businessInfo?.name} />
            </Link>

            {/* Navigation - Desktop */}
            <nav className="hidden md:flex items-center gap-1">
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
                        className="flex items-center gap-1 px-3 py-2 rounded-lg text-theme-text hover:text-theme-primary hover:bg-gray-50 transition-colors font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-theme-primary focus-visible:ring-offset-2"
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
                    className="px-3 py-2 rounded-lg text-theme-text hover:text-theme-primary hover:bg-gray-50 transition-colors font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-theme-primary focus-visible:ring-offset-2"
                    target={item.newTab ? '_blank' : undefined}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            {/* CTA Button & Mobile Menu */}
            <div className="flex items-center gap-4">
              {ctaButton?.enabled && (
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
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-theme-primary focus-visible:ring-offset-2"
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

          {ctaButton?.enabled && (
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
