'use client'

/**
 * AddressItem Component - Based on official Payload template
 * Displays a single address with optional actions
 * Adapted for theme system
 */

import React from 'react'
import type { Address } from '@/payload-types'
import { CreateAddressModal } from '@/components/addresses/CreateAddressModal'

type Props = {
  address: Partial<Omit<Address, 'country'>> & { country?: string }
  /**
   * Completely override the default actions
   */
  actions?: React.ReactNode
  /**
   * Insert elements before the actions
   */
  beforeActions?: React.ReactNode
  /**
   * Insert elements after the actions
   */
  afterActions?: React.ReactNode
  /**
   * Hide all actions
   */
  hideActions?: boolean
}

export const AddressItem: React.FC<Props> = ({
  address,
  actions,
  hideActions = false,
  beforeActions,
  afterActions,
}) => {
  if (!address) {
    return null
  }

  return (
    <div className="p-4 rounded-[var(--radius-card)] bg-theme-surface border border-theme-border">
      {address.title && (
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium px-2 py-1 bg-theme-primary/10 text-theme-primary rounded">
            {address.title}
          </span>
        </div>
      )}

      <div className="text-theme-text-muted space-y-1 text-sm">
        <p className="font-medium text-theme-text">
          {address.firstName} {address.lastName}
        </p>
        {address.company && <p>{address.company}</p>}
        <p>{address.addressLine1}</p>
        {address.addressLine2 && <p>{address.addressLine2}</p>}
        <p>
          {address.city}, {address.state} {address.postalCode}
        </p>
        <p>{address.country}</p>
        {address.phone && <p className="mt-2">Tel: {address.phone}</p>}
      </div>

      {/* Custom actions from beforeActions/afterActions are always shown */}
      {(beforeActions || afterActions) && (
        <div className="flex gap-2 mt-4">
          {beforeActions}
          {afterActions}
        </div>
      )}

      {/* Default actions (edit button) can be hidden */}
      {!hideActions && address.id && (
        <div className="flex gap-2 mt-4">
          {actions ? (
            actions
          ) : (
            <CreateAddressModal
              addressID={address.id}
              initialData={address}
              buttonText="Editează"
              modalTitle="Editează adresa"
            />
          )}
        </div>
      )}
    </div>
  )
}
