import type { Metadata } from 'next'
import { CheckoutBlock } from '@/blocks/Checkout/Component'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Finalizeaza comanda ta',
}

export default function CheckoutPage() {
  return (
    <main className="min-h-screen">
      <CheckoutBlock
        variant="full"
        heading="Finalizare Comanda"
        showOrderSummary={true}
        showShippingOptions={true}
        showPaymentOptions={true}
        submitButtonText="Plaseaza Comanda"
        successMessage="Multumim pentru comanda! Vei primi un email de confirmare in curand."
        backgroundColor="default"
      />
    </main>
  )
}
