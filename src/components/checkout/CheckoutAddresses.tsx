'use client'

/**
 * CheckoutAddresses Component - Based on official Payload template
 * Allows selecting from saved addresses or adding a new one
 */

import { AddressItem } from '@/components/addresses/AddressItem'
import { CreateAddressModal } from '@/components/addresses/CreateAddressModal'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import type { Address } from '@/payload-types'
import { useAddresses } from '@payloadcms/plugin-ecommerce/client/react'
import { useState } from 'react'

type AddressData = Partial<Omit<Address, 'country'>> & { country?: string }

type Props = {
  setAddress: (address: AddressData) => void
  heading?: string
  description?: string
}

export const CheckoutAddresses: React.FC<Props> = ({
  setAddress,
  heading = 'Adresa',
  description = 'Selectează sau adaugă o adresă.',
}) => {
  const { addresses, isLoading } = useAddresses()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-theme-primary"></div>
      </div>
    )
  }

  if (!addresses || addresses.length === 0) {
    return (
      <div className="space-y-4">
        <p className="text-theme-text-muted">Nu ai adrese salvate. Adaugă o adresă nouă.</p>
        <CreateAddressModal callback={(address) => setAddress(address as AddressData)} />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-lg font-medium mb-1 text-theme-text">{heading}</h3>
        <p className="text-sm text-theme-text-muted">{description}</p>
      </div>
      <AddressesModal setAddress={setAddress} />
    </div>
  )
}

type ModalProps = {
  setAddress: (address: AddressData) => void
}

const AddressesModal: React.FC<ModalProps> = ({ setAddress }) => {
  const [open, setOpen] = useState(false)
  const { addresses } = useAddresses()

  const handleOpenChange = (state: boolean) => {
    setOpen(state)
  }

  const closeModal = () => {
    setOpen(false)
  }

  if (!addresses || addresses.length === 0) {
    return <p className="text-theme-text-muted">Nu ai adrese salvate.</p>
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">Selectează o adresă</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Selectează o adresă</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 mt-4">
          <ul className="flex flex-col gap-4">
            {addresses.map((address) => (
              <li key={address.id} className="border-b border-theme-border pb-4 last:border-none">
                <AddressItem
                  address={address}
                  hideActions
                  beforeActions={
                    <Button
                      onClick={(e) => {
                        e.preventDefault()
                        setAddress(address as AddressData)
                        closeModal()
                      }}
                    >
                      Selectează
                    </Button>
                  }
                />
              </li>
            ))}
          </ul>

          <div className="pt-4 border-t border-theme-border">
            <CreateAddressModal
              buttonText="Adaugă adresă nouă"
              callback={(address) => {
                setAddress(address as AddressData)
                closeModal()
              }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
