/**
 * Cart Components - Based on official Payload ecommerce template
 * Uses useCart() from plugin (database cart, not localStorage)
 * Styling adapted to use theme system (--theme-* CSS variables)
 */

import React from 'react'
import { CartModal } from './CartModal'
import { Cart as CartType } from '@/payload-types'

export type CartItem = NonNullable<CartType['items']>[number]

export function Cart() {
  return <CartModal />
}

export { CartModal } from './CartModal'
export { CartPage } from './CartPage'
export { AddToCart } from './AddToCart'
export { DeleteItemButton } from './DeleteItemButton'
export { EditItemQuantityButton } from './EditItemQuantityButton'
export { OpenCartButton } from './OpenCart'
export { CloseCart } from './CloseCart'
