'use client'

/**
 * CheckoutPage Component - Based on official Payload template
 * Adapted for theme system and manual payment adapter
 * Uses useCart() and usePayments() hooks from plugin
 * Auto-fills data from authenticated user
 */

import React, { useCallback, useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCart, usePayments } from '@payloadcms/plugin-ecommerce/client/react'
import { useAuth } from '@/providers/Auth'
import { useShopSettings, getDisplayPrice, type TaxCategory } from '@/providers/ShopSettings'
import { useToast } from '@/components/Toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { FormItem } from '@/components/forms/FormItem'
import { AddressForm } from '@/components/forms/AddressForm'
import { CheckoutAddresses } from '@/components/checkout/CheckoutAddresses'
import type { Product } from '@/payload-types'
import type { CartItem } from '@/components/cart'

// Price formatter - uses shopSettings.currency
function formatPriceWithCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat('ro-RO', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

// Address type for form
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

export const CheckoutPage: React.FC = () => {
  const { cart } = useCart()
  const { initiatePayment, confirmOrder } = usePayments()
  const { user, status, logout } = useAuth()
  const shopSettings = useShopSettings()

  // Get shipping methods from admin settings
  const shippingMethods = shopSettings.shippingMethods

  // Price formatter using currency from settings
  const formatPrice = (amount: number) => formatPriceWithCurrency(amount, shopSettings.currency)
  const { showToast } = useToast()
  const router = useRouter()

  // Form state
  const [email, setEmail] = useState('')
  const [billingAddress, setBillingAddress] = useState<AddressData | null>(null)
  const [shippingAddress, setShippingAddress] = useState<AddressData | null>(null)
  const [billingAddressSameAsShipping, setBillingAddressSameAsShipping] = useState(true)
  const [shippingMethod, setShippingMethod] = useState('standard')
  const [notes, setNotes] = useState('')

  // UI state
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [_showAddressForm, setShowAddressForm] = useState(false)

  // Initial data for address form (pre-filled from authenticated user)
  const [initialAddressData, setInitialAddressData] = useState<Partial<AddressData> | null>(null)

  // Pre-fill data from authenticated user
  useEffect(() => {
    if (status === 'loggedIn' && user) {
      // Pre-fill email
      if (user.email && !email) {
        setEmail(user.email)
      }
      // Pre-fill name and phone for address form (as initial values)
      if (!initialAddressData && (user.name || user.phone)) {
        // Parse name into firstName and lastName
        const nameParts = user.name?.split(' ') || []
        const firstName = nameParts[0] || ''
        const lastName = nameParts.slice(1).join(' ') || ''

        setInitialAddressData({
          firstName: firstName || undefined,
          lastName: lastName || undefined,
          phone: user.phone || undefined,
          country: 'Romania',
        })
      }
    }
  }, [status, user, email, initialAddressData])

  // Cart calculations
  const cartIsEmpty = !cart || !cart.items || cart.items.length === 0
  // Calculate subtotal with TVA respecting each item's taxCategory
  const subtotal = React.useMemo(() => {
    if (!cart?.items?.length) return 0
    return cart.items.reduce((sum, item: CartItem) => {
      const product = item.product as Product
      if (!product || typeof product !== 'object') return sum
      const rawPrice = product.priceInRON || 0
      const taxCategory = product.taxCategory
      const displayPrice = getDisplayPrice(rawPrice, shopSettings, taxCategory ?? undefined)
      return sum + displayPrice * (item.quantity || 1)
    }, 0)
  }, [cart?.items, shopSettings])
  // Safe access to shipping methods with fallback
  const availableShippingMethods = shippingMethods && shippingMethods.length > 0
    ? shippingMethods
    : [{ id: 'standard', label: 'Livrare standard', price: 20, freeAbove: null, enabled: true }]
  const selectedShipping = availableShippingMethods.find(s => s.id === shippingMethod) || availableShippingMethods[0]
  const shippingCost = selectedShipping?.freeAbove && subtotal >= selectedShipping.freeAbove
    ? 0
    : (selectedShipping?.price || 0)
  const total = subtotal + shippingCost

  // Can proceed to payment - logged-in users use their user.email
  const customerEmail = status === 'loggedIn' && user ? user.email : email
  const canProceed = customerEmail && billingAddress && (billingAddressSameAsShipping || shippingAddress)

  // Handle order submission - uses plugin's payment hooks
  const handleSubmitOrder = useCallback(async () => {
    if (!canProceed) return

    setIsProcessing(true)
    setError(null)

    try {
      // Step 1: Initiate payment (creates transaction)
      const paymentResult = await initiatePayment('manual', {
        additionalData: {
          customerEmail,
          billingAddress,
          shippingAddress: billingAddressSameAsShipping ? billingAddress : shippingAddress,
          shippingCost, // Pass shipping cost to store in order
        },
      }) as { transactionID?: string; skipPaymentUI?: boolean } | null

      if (!paymentResult) {
        throw new Error('Nu s-a putut inițializa plata')
      }

      // Step 2: Confirm order (creates order from transaction)
      const confirmResult = await confirmOrder('manual', {
        additionalData: {
          customerEmail,
          transactionID: paymentResult.transactionID,
          shippingAddress: billingAddressSameAsShipping ? billingAddress : shippingAddress,
          shippingCost, // Pass shipping cost to store in order
        },
      }) as { orderID?: string } | null

      if (confirmResult && confirmResult.orderID) {
        // Clear cart from localStorage so UI shows empty cart immediately
        localStorage.removeItem('cart')
        localStorage.removeItem('cart_secret')
        setOrderPlaced(true)
        showToast('Comanda a fost plasată cu succes!', 'success')
        // Full reload to reset cart state (EcommerceProvider key doesn't change since user is same)
        setTimeout(() => window.location.reload(), 1500)
      } else {
        throw new Error('Nu s-a putut confirma comanda')
      }

    } catch (err) {
      console.error('Checkout error:', err)

      let errorMessage = 'A apărut o eroare. Vă rugăm încercați din nou.'

      if (err instanceof Error) {
        errorMessage = err.message
      }

      setError(errorMessage)
      showToast(errorMessage, 'error')
    } finally {
      setIsProcessing(false)
    }
  }, [
    canProceed,
    customerEmail,
    billingAddress,
    shippingAddress,
    billingAddressSameAsShipping,
    shippingCost,
    initiatePayment,
    confirmOrder,
    showToast,
  ])

  // Handle billing address save
  const handleBillingAddressSave = (data: AddressData) => {
    setBillingAddress(data)
    setShowAddressForm(false)
  }

  // Handle shipping address save
  const handleShippingAddressSave = (data: AddressData) => {
    setShippingAddress(data)
  }

  // Order success screen
  if (orderPlaced) {
    return (
      <section className="py-16 bg-theme-surface">
        <div className="container mx-auto px-4 text-center max-w-lg">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-theme-text">
            Comandă plasată cu succes!
          </h2>
          <p className="mb-6 text-theme-text-muted">
            Mulțumim pentru comandă! Vei primi un email de confirmare în curând.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-theme-primary text-theme-text-on-primary px-6 py-3 rounded-[var(--radius-button)] hover:bg-theme-primary-dark transition-colors"
          >
            Înapoi la pagina principală
          </Link>
        </div>
      </section>
    )
  }

  // Empty cart screen
  if (cartIsEmpty) {
    return (
      <section className="py-16 bg-theme-surface">
        <div className="container mx-auto px-4 text-center">
          <svg className="h-16 w-16 mx-auto mb-4 text-theme-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="text-lg mb-6 text-theme-text-muted">
            Coșul tău este gol.
          </p>
          <Link
            href="/produse"
            className="inline-flex items-center gap-2 bg-theme-primary text-theme-text-on-primary px-6 py-3 rounded-[var(--radius-button)] hover:bg-theme-primary-dark transition-colors"
          >
            Vezi produsele
            <span>→</span>
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="py-8 md:py-16 bg-theme-surface min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-theme-text">Finalizare comandă</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Contact Information */}
            <div className="p-6 rounded-[var(--radius-card)] bg-theme-surface-secondary border border-theme-border">
              <h2 className="text-lg font-semibold mb-4 text-theme-text">
                Informații contact
              </h2>
              {status === 'loggedIn' && user ? (
                <div className="p-4 bg-theme-surface rounded-lg border border-theme-border">
                  <p className="font-medium text-theme-text">{user.email}</p>
                  {user.name && <p className="text-theme-text-muted">{user.name}</p>}
                  <p className="text-sm text-theme-text-muted mt-2">
                    Nu ești tu?{' '}
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await logout()
                          router.refresh()
                          router.push('/')
                        } catch (err) {
                          console.error('Logout error:', err)
                        }
                      }}
                      className="text-theme-primary hover:underline"
                    >
                      Deconectează-te
                    </button>
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-theme-primary/5 rounded-lg border border-theme-border">
                    <p className="text-sm text-theme-text-muted mb-3">
                      Ai deja cont?{' '}
                      <Link href="/cont/login" className="text-theme-primary hover:underline font-medium">
                        Autentifică-te
                      </Link>
                      {' '}sau{' '}
                      <Link href="/cont/register" className="text-theme-primary hover:underline font-medium">
                        creează un cont
                      </Link>
                    </p>
                  </div>
                  <FormItem>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@exemplu.ro"
                      required
                    />
                  </FormItem>
                </div>
              )}
            </div>

            {/* Billing Address */}
            <div className="p-6 rounded-[var(--radius-card)] bg-theme-surface-secondary border border-theme-border">
              <h2 className="text-lg font-semibold mb-4 text-theme-text">
                Adresa de facturare
              </h2>

              {billingAddress ? (
                <div className="space-y-4">
                  <div className="p-4 bg-theme-surface rounded-lg border border-theme-border">
                    <p className="font-medium text-theme-text">
                      {billingAddress.title} {billingAddress.firstName} {billingAddress.lastName}
                    </p>
                    {billingAddress.company && <p className="text-theme-text-muted">{billingAddress.company}</p>}
                    <p className="text-theme-text-muted">{billingAddress.phone}</p>
                    <p className="text-theme-text-muted">{billingAddress.addressLine1}</p>
                    {billingAddress.addressLine2 && <p className="text-theme-text-muted">{billingAddress.addressLine2}</p>}
                    <p className="text-theme-text-muted">
                      {billingAddress.city}, {billingAddress.state} {billingAddress.postalCode}
                    </p>
                  </div>
                  <Button variant="outline" onClick={() => setBillingAddress(null)}>
                    Modifică adresa
                  </Button>
                </div>
              ) : status === 'loggedIn' ? (
                /* Authenticated users: select from saved addresses or add new */
                <CheckoutAddresses
                  heading="Adresa de facturare"
                  description="Selectează o adresă existentă sau adaugă una nouă."
                  setAddress={handleBillingAddressSave}
                />
              ) : (
                /* Guest users: show address form without saving to DB */
                <AddressForm
                  initialData={initialAddressData || undefined}
                  callback={handleBillingAddressSave}
                  submitLabel="Salvează adresa"
                  skipSubmission={true}
                />
              )}
            </div>

            {/* Shipping Address */}
            <div className="p-6 rounded-[var(--radius-card)] bg-theme-surface-secondary border border-theme-border">
              <h2 className="text-lg font-semibold mb-4 text-theme-text">
                Adresa de livrare
              </h2>

              <div className="flex items-center gap-3 mb-4">
                <Checkbox
                  id="sameAddress"
                  checked={billingAddressSameAsShipping}
                  onCheckedChange={(checked) => setBillingAddressSameAsShipping(checked as boolean)}
                />
                <Label htmlFor="sameAddress" className="cursor-pointer">
                  Aceeași cu adresa de facturare
                </Label>
              </div>

              {!billingAddressSameAsShipping && (
                shippingAddress ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-theme-surface rounded-lg border border-theme-border">
                      <p className="font-medium text-theme-text">
                        {shippingAddress.title} {shippingAddress.firstName} {shippingAddress.lastName}
                      </p>
                      {shippingAddress.company && <p className="text-theme-text-muted">{shippingAddress.company}</p>}
                      <p className="text-theme-text-muted">{shippingAddress.phone}</p>
                      <p className="text-theme-text-muted">{shippingAddress.addressLine1}</p>
                      {shippingAddress.addressLine2 && <p className="text-theme-text-muted">{shippingAddress.addressLine2}</p>}
                      <p className="text-theme-text-muted">
                        {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}
                      </p>
                    </div>
                    <Button variant="outline" onClick={() => setShippingAddress(null)}>
                      Modifică adresa
                    </Button>
                  </div>
                ) : status === 'loggedIn' ? (
                  /* Authenticated users: select from saved addresses or add new */
                  <CheckoutAddresses
                    heading="Adresa de livrare"
                    description="Selectează o adresă existentă sau adaugă una nouă."
                    setAddress={handleShippingAddressSave}
                  />
                ) : (
                  /* Guest users: show address form without saving to DB */
                  <AddressForm
                    initialData={initialAddressData || undefined}
                    callback={handleShippingAddressSave}
                    submitLabel="Salvează adresa de livrare"
                    skipSubmission={true}
                  />
                )
              )}
            </div>

            {/* Shipping Options */}
            <div className="p-6 rounded-[var(--radius-card)] bg-theme-surface-secondary border border-theme-border">
              <h2 className="text-lg font-semibold mb-4 text-theme-text">
                Metoda de livrare
              </h2>
              <div className="space-y-3">
                {availableShippingMethods.map((method) => {
                  const isFree = method.freeAbove && subtotal >= method.freeAbove
                  return (
                    <label
                      key={method.id}
                      className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer border transition-colors ${
                        shippingMethod === method.id
                          ? 'border-theme-primary bg-theme-primary/5'
                          : 'border-theme-border hover:border-theme-primary/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="shippingMethod"
                        value={method.id}
                        checked={shippingMethod === method.id}
                        onChange={(e) => setShippingMethod(e.target.value)}
                        className="w-4 h-4 text-theme-primary"
                      />
                      <div className="flex-grow">
                        <span className="text-theme-text">
                          {method.label}
                          {method.deliveryTime && (
                            <span className="text-theme-text-muted ml-1">({method.deliveryTime})</span>
                          )}
                        </span>
                        <p className="text-sm text-theme-text-muted">
                          {isFree ? (
                            <span className="text-green-600 font-medium">Gratuit</span>
                          ) : method.price === 0 ? (
                            <span className="text-green-600 font-medium">Gratuit</span>
                          ) : (
                            formatPrice(method.price)
                          )}
                          {method.freeAbove && !isFree && method.price > 0 && (
                            <span className="ml-2">(gratuit peste {formatPrice(method.freeAbove)})</span>
                          )}
                        </p>
                      </div>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Payment Method (manual only for now) */}
            <div className="p-6 rounded-[var(--radius-card)] bg-theme-surface-secondary border border-theme-border">
              <h2 className="text-lg font-semibold mb-4 text-theme-text">
                Metoda de plată
              </h2>
              <label className="flex items-center gap-3 p-4 rounded-lg cursor-pointer border border-theme-primary bg-theme-primary/5">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="manual"
                  checked={true}
                  readOnly
                  className="w-4 h-4 text-theme-primary"
                />
                <div className="flex-grow">
                  <span className="text-theme-text">Plată la livrare (ramburs)</span>
                  <p className="text-sm text-theme-text-muted">
                    Plătești când primești comanda
                  </p>
                </div>
              </label>
            </div>

            {/* Notes */}
            <div className="p-6 rounded-[var(--radius-card)] bg-theme-surface-secondary border border-theme-border">
              <h2 className="text-lg font-semibold mb-4 text-theme-text">
                Note comandă (opțional)
              </h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-[var(--radius-input)] border border-theme-border bg-theme-surface text-theme-text placeholder:text-theme-text-muted focus:outline-none focus:ring-2 focus:ring-theme-primary/50 focus:border-theme-primary"
                placeholder="Indicații suplimentare pentru livrare..."
              />
            </div>
          </div>

          {/* Order Summary Column */}
          <div className="lg:col-span-1">
            <div className="p-6 rounded-[var(--radius-card)] bg-theme-surface-secondary border border-theme-border sticky top-24">
              <h2 className="text-lg font-semibold mb-4 text-theme-text">
                Sumar comandă
              </h2>

              {/* Products */}
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cart?.items?.map((item, index) => {
                  const product = item.product as Product
                  if (!product || typeof product !== 'object') return null

                  const firstImage = product.images?.[0]?.image
                  const image = typeof firstImage === 'object' ? firstImage : undefined
                  // Apply TVA to product price respecting taxCategory
                  const rawPrice = product.priceInRON || 0
                  const price = getDisplayPrice(rawPrice, shopSettings, product.taxCategory ?? undefined)

                  return (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-12 h-12 relative rounded overflow-hidden flex-shrink-0 border border-theme-border">
                        {image?.url ? (
                          <Image
                            src={image.url}
                            alt={image.alt || product.title || ''}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-theme-surface flex items-center justify-center text-theme-text-muted">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="text-sm font-medium truncate text-theme-text">
                          {product.title}
                        </p>
                        <p className="text-xs text-theme-text-muted">
                          {item.quantity} x {formatPrice(price)}
                        </p>
                      </div>
                      <span className="text-sm font-medium text-theme-text">
                        {formatPrice(price * (item.quantity || 1))}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Totals */}
              <div className="border-t border-theme-border pt-4 space-y-2">
                <div className="flex justify-between text-theme-text-muted">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-theme-text-muted">
                  <span>Transport</span>
                  <span>{shippingCost === 0 ? 'Gratuit' : formatPrice(shippingCost)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-theme-border text-theme-text">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Submit button */}
              <Button
                onClick={handleSubmitOrder}
                disabled={!canProceed || isProcessing}
                className="w-full mt-6"
                size="lg"
              >
                {isProcessing ? 'Se procesează...' : 'Plasează comanda'}
              </Button>

              {!canProceed && (
                <p className="text-xs text-theme-text-muted mt-2 text-center">
                  Completează toate câmpurile obligatorii pentru a continua
                </p>
              )}

              <Link
                href="/cos"
                className="block text-center mt-4 text-sm text-theme-text-muted hover:text-theme-primary transition-colors"
              >
                ← Înapoi la coș
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
