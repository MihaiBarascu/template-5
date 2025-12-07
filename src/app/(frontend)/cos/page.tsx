import type { Metadata } from 'next'
import { CartPage } from '@/components/cart'

export const metadata: Metadata = {
  title: 'Coșul meu',
  description: 'Verifică produsele din coș și finalizează comanda',
}

export default function CosPage() {
  return <CartPage />
}
