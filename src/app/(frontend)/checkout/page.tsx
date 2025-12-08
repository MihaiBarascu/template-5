import type { Metadata } from 'next'
import { CheckoutPage as CheckoutPageComponent } from '@/components/checkout'

export const metadata: Metadata = {
  title: 'Finalizare comandă',
  description: 'Finalizează comanda ta',
}

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-theme-surface">
      <CheckoutPageComponent />
    </main>
  )
}
