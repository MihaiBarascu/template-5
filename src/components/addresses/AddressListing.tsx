'use client'

/**
 * AddressListing Component - Based on official Payload template
 * Uses useAddresses() hook from plugin to display saved addresses
 */

import React from 'react'
import { useAddresses } from '@payloadcms/plugin-ecommerce/client/react'
import { AddressItem } from './AddressItem'

export const AddressListing: React.FC = () => {
  const { addresses, isLoading } = useAddresses()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-theme-primary"></div>
      </div>
    )
  }

  if (!addresses || addresses.length === 0) {
    return (
      <p className="text-theme-text-muted">
        Nu ai adrese salvate încă.
      </p>
    )
  }

  return (
    <div>
      <ul className="grid gap-4 md:grid-cols-2">
        {addresses.map((address) => (
          <li key={address.id}>
            <AddressItem address={address} />
          </li>
        ))}
      </ul>
    </div>
  )
}
