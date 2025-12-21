import React from 'react'
import { Header } from '@/components/Header'
import { mergeHeaderSettings } from '@/utilities/mergeHeaderSettings'
import type { Header as HeaderType, Logo, BusinessInfo, Page } from '@/payload-types'

interface PageWrapperProps {
  children: React.ReactNode
  headerData: HeaderType | null
  logoData: Logo | null
  businessInfoData: BusinessInfo | null
  pageHeaderSettings?: Page['headerSettings']
  showCart?: boolean
}

/**
 * Page wrapper component that renders Header with page-specific overrides.
 * Used in all page components to provide per-page header customization.
 */
export function PageWrapper({
  children,
  headerData,
  logoData,
  businessInfoData,
  pageHeaderSettings,
  showCart = false,
}: PageWrapperProps) {
  // Merge global header settings with page-specific overrides
  const mergedHeader = mergeHeaderSettings(headerData, pageHeaderSettings)

  return (
    <>
      <Header
        data={mergedHeader}
        logo={logoData}
        businessInfo={businessInfoData}
        showCart={showCart}
      />
      {children}
    </>
  )
}

export default PageWrapper
