'use client'

/**
 * AddressForm Component - Based on official Payload template
 * Adapted for theme system and Romanian locale
 * Uses useAddresses() hook to save addresses to the addresses collection
 */

import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FormError } from '@/components/forms/FormError'
import { FormItem } from '@/components/forms/FormItem'
import { titles } from './constants'
import { useAddresses } from '@payloadcms/plugin-ecommerce/client/react'
import { useAuth } from '@/providers/Auth'
import type { Address } from '@/payload-types'

// Default country code (ISO 3166-1 alpha-2) - Payload plugin expects ISO codes
const DEFAULT_COUNTRY_CODE = 'RO'

// Romanian counties for address form
const romanianCounties = [
  'Alba', 'Arad', 'Arges', 'Bacau', 'Bihor', 'Bistrita-Nasaud', 'Botosani', 'Braila',
  'Brasov', 'Bucuresti', 'Buzau', 'Calarasi', 'Caras-Severin', 'Cluj', 'Constanta',
  'Covasna', 'Dambovita', 'Dolj', 'Galati', 'Giurgiu', 'Gorj', 'Harghita', 'Hunedoara',
  'Ialomita', 'Iasi', 'Ilfov', 'Maramures', 'Mehedinti', 'Mures', 'Neamt', 'Olt',
  'Prahova', 'Salaj', 'Satu Mare', 'Sibiu', 'Suceava', 'Teleorman', 'Timis', 'Tulcea',
  'Valcea', 'Vaslui', 'Vrancea'
]

type AddressFormValues = {
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

type Props = {
  addressID?: string | number
  initialData?: Partial<AddressFormValues>
  callback?: (data: Partial<Address>) => void
  /**
   * If true, the form will not submit to the API.
   * Use this when you only need the form data without saving to database.
   */
  skipSubmission?: boolean
  submitLabel?: string
}

export const AddressForm: React.FC<Props> = ({
  addressID,
  initialData,
  callback,
  skipSubmission,
  submitLabel = 'Salvează adresa',
}) => {
  // State for API errors
  const [apiError, setApiError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<AddressFormValues>({
    defaultValues: {
      ...initialData,
      country: initialData?.country || DEFAULT_COUNTRY_CODE,
    },
  })

  // Use the official plugin hook for address management
  const { createAddress, updateAddress } = useAddresses()
  const { refreshUser } = useAuth()

  const onSubmit = useCallback(
    async (data: AddressFormValues) => {
      // Clear previous API errors
      setApiError(null)

      // Merge with initial data, ensure country is ISO code
      const newData = {
        ...initialData,
        ...data,
        country: data.country || DEFAULT_COUNTRY_CODE,
      }

      // Save to database unless skipSubmission is true
      if (!skipSubmission) {
        // Helper function to save address
        const saveAddress = async () => {
          if (addressID) {
            await updateAddress(String(addressID), newData)
          } else {
            await createAddress(newData)
          }
        }

        try {
          await saveAddress()
        } catch (error) {
          console.error('Error saving address:', error)

          // Check if it's a session/authentication error
          const errorText = error instanceof Error ? error.message : ''
          const isSessionError = errorText.includes('logged in') ||
                                 errorText.includes('Unauthorized') ||
                                 errorText.includes('401')

          // If session error, try to refresh and retry once
          if (isSessionError) {
            console.log('Session error detected, attempting to refresh...')
            const refreshedUser = await refreshUser()

            if (refreshedUser) {
              // User is still logged in, retry the save
              try {
                await saveAddress()
                // Success after retry - continue to callback
                if (callback) {
                  callback(newData as Partial<Address>)
                }
                return
              } catch (retryError) {
                console.error('Retry failed:', retryError)
                setApiError('Sesiunea a expirat. Vă rugăm reîncărcați pagina și încercați din nou.')
                return
              }
            } else {
              // User is not logged in anymore
              setApiError('Trebuie să fiți autentificat pentru a salva adresa. Vă rugăm să vă reconectați.')
              return
            }
          }

          // Parse and display API error to user
          let errorMessage = 'A apărut o eroare la salvarea adresei. Vă rugăm încercați din nou.'

          if (error instanceof Error) {
            // Try to extract validation error message
            if (errorText.includes('ValidationError') || errorText.includes('invalid')) {
              try {
                const parsed = JSON.parse(errorText.replace('Failed to update or create address: ', ''))
                if (parsed.errors?.[0]?.data?.errors?.[0]?.message) {
                  errorMessage = parsed.errors[0].data.errors[0].message
                } else if (parsed.errors?.[0]?.message) {
                  errorMessage = parsed.errors[0].message
                }
              } catch {
                // Use generic message if parsing fails
              }
            }
          }

          setApiError(errorMessage)
          return // Don't call callback if save failed
        }
      }

      if (callback) {
        callback(newData as Partial<Address>)
      }
    },
    [initialData, skipSubmission, callback, addressID, updateAddress, createAddress, refreshUser],
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Title + Name Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormItem className="md:col-span-1">
          <Label htmlFor="title">Titlu</Label>
          <Select
            onValueChange={(value) => {
              setValue('title', value, { shouldValidate: true })
            }}
            defaultValue={initialData?.title || ''}
          >
            <SelectTrigger id="title">
              <SelectValue placeholder="Selectează" />
            </SelectTrigger>
            <SelectContent>
              {titles.map((title) => (
                <SelectItem key={title} value={title}>
                  {title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>

        <FormItem>
          <Label htmlFor="firstName">Prenume *</Label>
          <Input
            id="firstName"
            autoComplete="given-name"
            placeholder="Ion"
            {...register('firstName', { required: 'Prenumele este obligatoriu' })}
          />
          {errors.firstName && <FormError message={errors.firstName.message} />}
        </FormItem>

        <FormItem>
          <Label htmlFor="lastName">Nume *</Label>
          <Input
            autoComplete="family-name"
            id="lastName"
            placeholder="Popescu"
            {...register('lastName', { required: 'Numele este obligatoriu' })}
          />
          {errors.lastName && <FormError message={errors.lastName.message} />}
        </FormItem>
      </div>

      {/* Phone */}
      <FormItem>
        <Label htmlFor="phone">Telefon *</Label>
        <Input
          type="tel"
          id="phone"
          autoComplete="tel"
          placeholder="0722 123 456"
          {...register('phone', { required: 'Telefonul este obligatoriu' })}
        />
        {errors.phone && <FormError message={errors.phone.message} />}
      </FormItem>

      {/* Company */}
      <FormItem>
        <Label htmlFor="company">Companie (opțional)</Label>
        <Input
          id="company"
          autoComplete="organization"
          placeholder="SC Exemplu SRL"
          {...register('company')}
        />
      </FormItem>

      {/* Address Line 1 */}
      <FormItem>
        <Label htmlFor="addressLine1">Adresa *</Label>
        <Input
          id="addressLine1"
          autoComplete="address-line1"
          placeholder="Str. Exemplu nr. 10, bl. A, sc. 1, ap. 5"
          {...register('addressLine1', { required: 'Adresa este obligatorie' })}
        />
        {errors.addressLine1 && <FormError message={errors.addressLine1.message} />}
      </FormItem>

      {/* Address Line 2 */}
      <FormItem>
        <Label htmlFor="addressLine2">Adresa (continuare)</Label>
        <Input
          id="addressLine2"
          autoComplete="address-line2"
          placeholder="Etaj, apartament, etc."
          {...register('addressLine2')}
        />
      </FormItem>

      {/* City + State + Postal Code Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormItem>
          <Label htmlFor="city">Oraș *</Label>
          <Input
            id="city"
            autoComplete="address-level2"
            placeholder="București"
            {...register('city', { required: 'Orașul este obligatoriu' })}
          />
          {errors.city && <FormError message={errors.city.message} />}
        </FormItem>

        <FormItem>
          <Label htmlFor="state">Județ *</Label>
          <Select
            onValueChange={(value) => {
              setValue('state', value, { shouldValidate: true })
            }}
            defaultValue={initialData?.state || ''}
          >
            <SelectTrigger id="state">
              <SelectValue placeholder="Selectează județul" />
            </SelectTrigger>
            <SelectContent>
              {romanianCounties.map((county) => (
                <SelectItem key={county} value={county}>
                  {county}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.state && <FormError message={errors.state.message} />}
        </FormItem>

        <FormItem>
          <Label htmlFor="postalCode">Cod poștal *</Label>
          <Input
            id="postalCode"
            autoComplete="postal-code"
            placeholder="010101"
            {...register('postalCode', { required: 'Codul poștal este obligatoriu' })}
          />
          {errors.postalCode && <FormError message={errors.postalCode.message} />}
        </FormItem>
      </div>

      {/* Country (hidden, default RO - ISO code required by Payload plugin) */}
      <input type="hidden" {...register('country')} value={DEFAULT_COUNTRY_CODE} />

      {/* API Error Display */}
      {apiError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{apiError}</p>
        </div>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
        {isSubmitting ? 'Se salvează...' : submitLabel}
      </Button>
    </form>
  )
}
