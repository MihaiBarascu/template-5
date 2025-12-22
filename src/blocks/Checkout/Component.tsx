'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useToast } from '@/components/Toast'
import { getBgClasses, isDarkBackground } from '@/blocks/_shared/themeHelpers'

interface CartItem {
  id: string
  title: string
  price: number
  image?: string | null
  quantity: number
}

interface CheckoutBlockProps {
  variant?: 'full' | 'compact'
  heading?: string
  showOrderSummary?: boolean
  showShippingOptions?: boolean
  showPaymentOptions?: boolean
  submitButtonText?: string
  successMessage?: string
  backgroundColor?: 'default' | 'light' | 'dark'
}

export function CheckoutBlock({
  variant: _variant = 'full',
  heading = 'Finalizare comanda',
  showOrderSummary = true,
  showShippingOptions = true,
  showPaymentOptions = true,
  submitButtonText = 'Plaseaza comanda',
  successMessage = 'Multumim pentru comanda! Vei primi un email de confirmare.',
  backgroundColor = 'default',
}: CheckoutBlockProps) {
  const { showToast } = useToast()
  const [cart, setCart] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    county: '',
    notes: '',
    shippingMethod: 'standard',
    paymentMethod: 'card',
  })

  const bgClass = getBgClasses(backgroundColor)
  const isDark = isDarkBackground(backgroundColor)

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]')
    setCart(savedCart)
    setIsLoading(false)
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'RON',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price)
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = formData.shippingMethod === 'express' ? 35 : subtotal >= 200 ? 0 : 20
  const total = subtotal + shipping

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) newErrors.firstName = 'Prenumele este obligatoriu'
    if (!formData.lastName.trim()) newErrors.lastName = 'Numele este obligatoriu'
    if (!formData.email.trim()) newErrors.email = 'Email-ul este obligatoriu'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email invalid'
    if (!formData.phone.trim()) newErrors.phone = 'Telefonul este obligatoriu'
    if (!formData.address.trim()) newErrors.address = 'Adresa este obligatorie'
    if (!formData.city.trim()) newErrors.city = 'Orasul este obligatoriu'
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Codul postal este obligatoriu'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // Create order in Payload (orders collection from eCommerce plugin)
      // Using the exact field names the plugin expects
      const orderData = {
        // Shipping address fields - matching plugin schema
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          addressLine1: formData.address,
          city: formData.city,
          state: formData.county, // judet = state
          postalCode: formData.postalCode,
          country: 'Romania',
          phone: formData.phone,
        },
        // Customer email - plugin field
        customerEmail: formData.email,
        // Items
        items: cart.map((item) => ({
          product: item.id,
          quantity: item.quantity,
        })),
        // Total amount
        amount: total,
        // Extra info not in plugin schema - for our reference
        paymentMethod: formData.paymentMethod,
        shippingMethod: formData.shippingMethod,
        shippingCost: shipping,
        notes: formData.notes,
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        throw new Error('Failed to create order')
      }

      // Clear cart
      localStorage.removeItem('cart')
      window.dispatchEvent(new CustomEvent('cartUpdated'))

      setOrderPlaced(true)
    } catch (error) {
      console.error('Order error:', error)
      showToast('A aparut o eroare. Va rugam incercati din nou.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <section className={`py-16 ${bgClass}`}>
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-theme-light rounded w-1/4 mb-6"></div>
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-12 bg-theme-light rounded"></div>
                ))}
              </div>
              <div className="h-64 bg-theme-light rounded"></div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (cart.length === 0 && !orderPlaced) {
    return (
      <section className={`py-16 ${bgClass}`}>
        <div className="container mx-auto px-4 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <p className={`text-lg mb-6 ${isDark ? 'text-white/70' : 'text-theme-text-light'}`}>
            Cosul tau este gol.
          </p>
          <Link
            href="/produse"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition-colors"
          >
            Vezi produsele
            <span>→</span>
          </Link>
        </div>
      </section>
    )
  }

  if (orderPlaced) {
    return (
      <section className={`py-16 ${bgClass}`}>
        <div className="container mx-auto px-4 text-center max-w-lg">
          <div className="text-6xl mb-4">✅</div>
          <h2 className={`heading-h2 font-bold mb-4 ${isDark ? 'text-white' : 'text-theme-text'}`}>
            Comanda plasata cu succes!
          </h2>
          <p className={`mb-6 ${isDark ? 'text-white/70' : 'text-theme-text-light'}`}>
            {successMessage}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition-colors"
          >
            Inapoi la pagina principala
          </Link>
        </div>
      </section>
    )
  }

  const inputClasses = `w-full px-4 py-3 rounded-md border ${
    isDark
      ? 'bg-white/5 border-white/10 text-white placeholder-theme-text-muted'
      : 'bg-white border-theme-border text-theme-text placeholder-theme-text-muted'
  } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`

  const labelClasses = `block text-sm font-medium mb-1 ${
    isDark ? 'text-white/70' : 'text-theme-text-light'
  }`

  return (
    <section className={`py-16 ${bgClass}`}>
      <div className="container mx-auto px-4">
        {heading && (
          <h2
            className={`heading-h2 font-bold mb-8 ${isDark ? 'text-white' : 'text-theme-text'}`}
          >
            {heading}
          </h2>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form Fields */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <div className={`p-6 rounded-lg ${isDark ? 'bg-white/5' : 'bg-theme-light'}`}>
                <h3
                  className={`text-lg font-semibold mb-4 ${
                    isDark ? 'text-white' : 'text-theme-text'
                  }`}
                >
                  Informatii contact
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClasses}>Prenume *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={inputClasses}
                      placeholder="Ion"
                    />
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className={labelClasses}>Nume *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={inputClasses}
                      placeholder="Popescu"
                    />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                  </div>
                  <div>
                    <label className={labelClasses}>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={inputClasses}
                      placeholder="email@exemplu.ro"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className={labelClasses}>Telefon *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={inputClasses}
                      placeholder="0722 123 456"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className={`p-6 rounded-lg ${isDark ? 'bg-white/5' : 'bg-theme-light'}`}>
                <h3
                  className={`text-lg font-semibold mb-4 ${
                    isDark ? 'text-white' : 'text-theme-text'
                  }`}
                >
                  Adresa de livrare
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className={labelClasses}>Adresa *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={inputClasses}
                      placeholder="Str. Exemplu nr. 10, bl. A, sc. 1, ap. 5"
                    />
                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className={labelClasses}>Oras *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={inputClasses}
                        placeholder="Bucuresti"
                      />
                      {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                    </div>
                    <div>
                      <label className={labelClasses}>Judet</label>
                      <input
                        type="text"
                        name="county"
                        value={formData.county}
                        onChange={handleInputChange}
                        className={inputClasses}
                        placeholder="Ilfov"
                      />
                    </div>
                    <div>
                      <label className={labelClasses}>Cod postal *</label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className={inputClasses}
                        placeholder="010101"
                      />
                      {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Options */}
              {showShippingOptions && (
                <div className={`p-6 rounded-lg ${isDark ? 'bg-white/5' : 'bg-theme-light'}`}>
                  <h3
                    className={`text-lg font-semibold mb-4 ${
                      isDark ? 'text-white' : 'text-theme-text'
                    }`}
                  >
                    Metoda de livrare
                  </h3>
                  <div className="space-y-3">
                    <label
                      className={`flex items-center gap-3 p-4 rounded-md cursor-pointer border ${
                        formData.shippingMethod === 'standard'
                          ? 'border-primary bg-primary/5'
                          : backgroundColor === 'dark'
                            ? 'border-white/10'
                            : 'border-theme-border'
                      }`}
                    >
                      <input
                        type="radio"
                        name="shippingMethod"
                        value="standard"
                        checked={formData.shippingMethod === 'standard'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-primary"
                      />
                      <div className="flex-grow">
                        <span className={isDark ? 'text-white' : 'text-theme-text'}>
                          Livrare standard (2-4 zile)
                        </span>
                        <p className={`text-sm ${isDark ? 'text-white/60' : 'text-theme-text-muted'}`}>
                          {subtotal >= 200 ? 'Gratuit' : '20 lei'}
                        </p>
                      </div>
                    </label>
                    <label
                      className={`flex items-center gap-3 p-4 rounded-md cursor-pointer border ${
                        formData.shippingMethod === 'express'
                          ? 'border-primary bg-primary/5'
                          : backgroundColor === 'dark'
                            ? 'border-white/10'
                            : 'border-theme-border'
                      }`}
                    >
                      <input
                        type="radio"
                        name="shippingMethod"
                        value="express"
                        checked={formData.shippingMethod === 'express'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-primary"
                      />
                      <div className="flex-grow">
                        <span className={isDark ? 'text-white' : 'text-theme-text'}>
                          Livrare express (1 zi)
                        </span>
                        <p className={`text-sm ${isDark ? 'text-white/60' : 'text-theme-text-muted'}`}>
                          35 lei
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* Payment Options */}
              {showPaymentOptions && (
                <div className={`p-6 rounded-lg ${isDark ? 'bg-white/5' : 'bg-theme-light'}`}>
                  <h3
                    className={`text-lg font-semibold mb-4 ${
                      isDark ? 'text-white' : 'text-theme-text'
                    }`}
                  >
                    Metoda de plata
                  </h3>
                  <div className="space-y-3">
                    <label
                      className={`flex items-center gap-3 p-4 rounded-md cursor-pointer border ${
                        formData.paymentMethod === 'card'
                          ? 'border-primary bg-primary/5'
                          : backgroundColor === 'dark'
                            ? 'border-white/10'
                            : 'border-theme-border'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === 'card'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-primary"
                      />
                      <span className={isDark ? 'text-white' : 'text-theme-text'}>
                        Card bancar (Visa, Mastercard)
                      </span>
                    </label>
                    <label
                      className={`flex items-center gap-3 p-4 rounded-md cursor-pointer border ${
                        formData.paymentMethod === 'cash'
                          ? 'border-primary bg-primary/5'
                          : backgroundColor === 'dark'
                            ? 'border-white/10'
                            : 'border-theme-border'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash"
                        checked={formData.paymentMethod === 'cash'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-primary"
                      />
                      <span className={isDark ? 'text-white' : 'text-theme-text'}>
                        Ramburs la livrare
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Notes */}
              <div className={`p-6 rounded-lg ${isDark ? 'bg-white/5' : 'bg-theme-light'}`}>
                <h3
                  className={`text-lg font-semibold mb-4 ${
                    isDark ? 'text-white' : 'text-theme-text'
                  }`}
                >
                  Note comanda (optional)
                </h3>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className={inputClasses}
                  placeholder="Indicatii suplimentare pentru livrare..."
                />
              </div>
            </div>

            {/* Order Summary */}
            {showOrderSummary && (
              <div className="lg:col-span-1">
                <div
                  className={`p-6 rounded-lg sticky top-24 ${
                    isDark ? 'bg-white/5' : 'bg-theme-light'
                  }`}
                >
                  <h3
                    className={`text-lg font-semibold mb-4 ${
                      isDark ? 'text-white' : 'text-theme-text'
                    }`}
                  >
                    Sumar comanda
                  </h3>

                  {/* Products */}
                  <div className="space-y-3 mb-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-12 h-12 relative rounded overflow-hidden flex-shrink-0">
                          {item.image ? (
                            <Image src={item.image} alt={item.title} fill sizes="48px" className="object-cover" />
                          ) : (
                            <div className="w-full h-full bg-theme-light flex items-center justify-center">
                              <span>📦</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-grow min-w-0">
                          <p
                            className={`text-sm font-medium truncate ${
                              isDark ? 'text-white' : 'text-theme-text'
                            }`}
                          >
                            {item.title}
                          </p>
                          <p className={`text-xs ${isDark ? 'text-white/60' : 'text-theme-text-muted'}`}>
                            {item.quantity} x {formatPrice(item.price)}
                          </p>
                        </div>
                        <span
                          className={`text-sm font-medium ${
                            isDark ? 'text-white' : 'text-theme-text'
                          }`}
                        >
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div
                    className={`border-t pt-4 space-y-2 ${
                      isDark ? 'border-white/10' : 'border-theme-border'
                    }`}
                  >
                    <div
                      className={`flex justify-between ${
                        isDark ? 'text-white/70' : 'text-theme-text-light'
                      }`}
                    >
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div
                      className={`flex justify-between ${
                        isDark ? 'text-white/70' : 'text-theme-text-light'
                      }`}
                    >
                      <span>Transport</span>
                      <span>{shipping === 0 ? 'Gratuit' : formatPrice(shipping)}</span>
                    </div>
                    <div
                      className={`flex justify-between font-bold text-lg pt-2 border-t ${
                        isDark ? 'border-white/10 text-white' : 'border-theme-border text-theme-text'
                      }`}
                    >
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-6 bg-primary text-white py-3 px-6 rounded-md hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Se proceseaza...' : submitButtonText}
                  </button>

                  <Link
                    href="/cos"
                    className={`block text-center mt-4 text-sm ${
                      isDark ? 'text-white/60 hover:text-white/70' : 'text-theme-text-muted hover:text-theme-text-light'
                    }`}
                  >
                    ← Inapoi la cos
                  </Link>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </section>
  )
}

export default CheckoutBlock
