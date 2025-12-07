'use client'

/**
 * CheckoutForm Component - Based on official Payload template
 * For manual payment - no Stripe required
 * Adapted for theme system
 */

import React, { useCallback, useState } from 'react'
import { useCart, usePayments } from '@payloadcms/plugin-ecommerce/client/react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/Toast'

type AddressData = {
  title?: string | null
  firstName?: string | null
  lastName?: string | null
  company?: string | null
  addressLine1?: string | null
  addressLine2?: string | null
  city?: string | null
  state?: string | null
  postalCode?: string | null
  country?: string | null
  phone?: string | null
}

interface CheckoutFormProps {
  customerEmail: string
  billingAddress: AddressData
  shippingAddress?: AddressData
  shippingMethod?: string
  shippingCost?: number
  notes?: string
  onSuccess?: (orderID: string) => void
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  customerEmail,
  billingAddress,
  shippingAddress,
  shippingMethod = 'standard',
  shippingCost = 0,
  notes,
  onSuccess,
}) => {
  const { clearCart } = useCart()
  const { initiatePayment, confirmOrder } = usePayments()
  const { showToast } = useToast()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Step 1: Initiate payment
      const paymentResult = await initiatePayment('manual', {
        additionalData: {
          customerEmail,
          billingAddress,
          shippingAddress: shippingAddress || billingAddress,
          shippingMethod,
          shippingCost,
          notes,
        },
      })

      if (!paymentResult) {
        throw new Error('Nu s-a putut inițializa plata')
      }

      // Step 2: Confirm order
      const confirmResult = await confirmOrder('manual', {
        additionalData: {
          customerEmail,
          billingAddress,
          shippingAddress: shippingAddress || billingAddress,
        },
      })

      if (confirmResult && typeof confirmResult === 'object' && 'orderID' in confirmResult) {
        clearCart()

        if (onSuccess) {
          onSuccess(confirmResult.orderID as string)
        } else {
          showToast('Comanda a fost plasată cu succes!', 'success')
        }
      } else {
        throw new Error('Nu s-a putut confirma comanda')
      }

    } catch (err) {
      console.error('Checkout error:', err)

      let errorMessage = 'A apărut o eroare. Vă rugăm încercați din nou.'

      if (err instanceof Error) {
        try {
          const errorData = JSON.parse(err.message)
          if (errorData?.cause?.code === 'OutOfStock') {
            errorMessage = 'Unul sau mai multe produse din coș nu mai sunt disponibile în stoc.'
          }
        } catch {
          errorMessage = err.message
        }
      }

      setError(errorMessage)
      showToast(errorMessage, 'error')
    } finally {
      setIsLoading(false)
    }
  }, [
    customerEmail,
    billingAddress,
    shippingAddress,
    shippingMethod,
    shippingCost,
    notes,
    initiatePayment,
    confirmOrder,
    clearCart,
    showToast,
    onSuccess,
  ])

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="p-4 bg-theme-surface-secondary rounded-lg border border-theme-border mb-4">
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6 text-theme-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <div>
            <p className="font-medium text-theme-text">Plată la livrare</p>
            <p className="text-sm text-theme-text-muted">Plătești când primești comanda</p>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full"
        size="lg"
      >
        {isLoading ? 'Se procesează...' : 'Plasează comanda'}
      </Button>
    </form>
  )
}
