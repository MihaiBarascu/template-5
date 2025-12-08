'use client'

import type { FormFieldBlock } from '@payloadcms/plugin-form-builder/types'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import type { Form as PayloadFormType } from '@/payload-types'

import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/cn'
import { getClientSideURL } from '@/utilities/getURL'

import { fields } from './fields'

export type FormBlockType = {
  blockName?: string
  blockType?: 'formBlock'
  form: PayloadFormType
  variant?: 'standard' | 'card' | 'centered' | 'minimal' | null
  enableIntro?: boolean | null
  heading?: string | null
  subheading?: string | null
  introContent?: DefaultTypedEditorState | null
  backgroundColor?: 'default' | 'light' | 'dark' | null
}

export const FormBlockComponent: React.FC<
  {
    id?: string
  } & FormBlockType
> = (props) => {
  const {
    form: formFromProps,
    form: { id: formID, confirmationMessage, confirmationType, redirect, submitButtonLabel } = {},
    variant = 'standard',
    enableIntro = false,
    heading,
    subheading,
    introContent,
    backgroundColor = 'default',
  } = props

  // Build default values from form fields
  const defaultValues = formFromProps?.fields?.reduce<Record<string, string | boolean>>(
    (acc, field) => {
      if ('name' in field && field.name) {
        acc[field.name] = (field as { defaultValue?: string }).defaultValue || ''
      }
      return acc
    },
    {},
  ) || {}

  const formMethods = useForm({
    defaultValues,
  })

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = formMethods

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false)
  const [error, setError] = useState<{ message: string; status?: string } | undefined>()
  const router = useRouter()

  // Background classes
  const bgColorKey = backgroundColor || 'default'
  const bgClass = {
    default: 'bg-white',
    light: 'bg-theme-light',
    dark: 'bg-theme-dark text-white',
  }[bgColorKey] || 'bg-white'

  // Input classes based on background
  const inputClassName = cn(
    'w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-theme-primary',
    backgroundColor === 'dark'
      ? 'bg-white/5 border-white/10 text-white placeholder-theme-text-muted'
      : 'bg-white border-theme-border text-theme-text placeholder-theme-text-muted',
  )

  const onSubmit = useCallback(
    (data: Record<string, unknown>) => {
      // Prevent multiple submissions
      if (isSubmitting) return

      const submitForm = async () => {
        setIsSubmitting(true)
        setError(undefined)

        const dataToSend = Object.entries(data).map(([name, value]) => ({
          field: name,
          value,
        }))

        try {
          const req = await fetch(`${getClientSideURL()}/api/form-submissions`, {
            body: JSON.stringify({
              form: formID,
              submissionData: dataToSend,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          })

          const res = await req.json()

          if (req.status >= 400) {
            setIsSubmitting(false)
            setError({
              message: res.errors?.[0]?.message || 'Eroare interna',
              status: res.status,
            })
            return
          }

          setHasSubmitted(true)

          if (confirmationType === 'redirect' && redirect) {
            const { url } = redirect
            if (url) router.push(url)
          }
        } catch (err) {
          console.warn(err)
          setIsSubmitting(false)
          setError({
            message: 'A aparut o eroare. Te rugam sa incerci din nou.',
          })
        }
      }

      void submitForm()
    },
    [router, formID, redirect, confirmationType, isSubmitting],
  )

  // Success message component
  const SuccessMessage = () => (
    <div className="p-6 bg-green-50 text-green-800 rounded-lg text-center">
      <svg
        className="w-12 h-12 mx-auto mb-4 text-green-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      {confirmationMessage ? (
        <RichText data={confirmationMessage} enableGutter={false} />
      ) : (
        <p className="font-medium">Multumim! Formularul a fost trimis cu succes.</p>
      )}
    </div>
  )

  // Form content
  const FormContent = () => (
    <FormProvider {...formMethods}>
      {hasSubmitted && confirmationType === 'message' && <SuccessMessage />}

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg mb-4">
          {`${error.status || '500'}: ${error.message || ''}`}
        </div>
      )}

      {!hasSubmitted && (
        <form id={formID} onSubmit={handleSubmit(onSubmit as never)}>
          <div className="flex flex-wrap -mx-2 mb-6">
            {formFromProps?.fields?.map((field, index) => {
              const Field: React.FC<
                FormFieldBlock & {
                  control: typeof control
                  errors: typeof errors
                  register: typeof register
                  inputClassName: string
                }
              > = fields?.[field.blockType as keyof typeof fields] as never

              if (Field) {
                return (
                  <Field
                    key={index}
                    {...(field as FormFieldBlock)}
                    control={control}
                    errors={errors}
                    register={register}
                    inputClassName={inputClassName}
                  />
                )
              }
              return null
            })}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              'w-full py-3 px-6 rounded-lg font-medium transition-all',
              'bg-theme-primary text-white hover:bg-theme-primary-dark',
              'disabled:opacity-50 disabled:cursor-not-allowed',
            )}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Se trimite...
              </span>
            ) : (
              submitButtonLabel || 'Trimite'
            )}
          </button>
        </form>
      )}
    </FormProvider>
  )

  // Render based on variant
  if (variant === 'minimal') {
    return (
      <section className={cn('py-8', bgClass)}>
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto">
            {enableIntro && heading && (
              <h3 className="text-xl font-semibold mb-4">{heading}</h3>
            )}
            {enableIntro && subheading && (
              <p className={cn('mb-6', backgroundColor === 'dark' ? 'text-white/70' : 'text-theme-text-light')}>
                {subheading}
              </p>
            )}
            <FormContent />
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'centered') {
    return (
      <section className={cn('py-16', bgClass)}>
        <div className="container mx-auto px-4">
          {enableIntro && (heading || subheading) && (
            <div className="text-center mb-12">
              {heading && <h2 className="text-3xl md:text-4xl font-bold mb-4">{heading}</h2>}
              {subheading && (
                <p
                  className={cn(
                    'text-lg max-w-2xl mx-auto',
                    backgroundColor === 'dark' ? 'text-white/70' : 'text-theme-text-light',
                  )}
                >
                  {subheading}
                </p>
              )}
            </div>
          )}
          {enableIntro && introContent && (
            <div className="max-w-2xl mx-auto mb-8">
              <RichText data={introContent} enableGutter={false} />
            </div>
          )}
          <div className="max-w-xl mx-auto">
            <FormContent />
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'card') {
    return (
      <section className={cn('py-16', bgClass)}>
        <div className="container mx-auto px-4">
          {enableIntro && (heading || subheading) && (
            <div className="text-center mb-12">
              {heading && <h2 className="text-3xl md:text-4xl font-bold mb-4">{heading}</h2>}
              {subheading && (
                <p
                  className={cn(
                    'text-lg max-w-2xl mx-auto',
                    backgroundColor === 'dark' ? 'text-white/70' : 'text-theme-text-light',
                  )}
                >
                  {subheading}
                </p>
              )}
            </div>
          )}
          <div
            className={cn(
              'max-w-xl mx-auto p-6 md:p-8 rounded-lg',
              backgroundColor === 'dark' ? 'bg-white/5' : 'bg-white shadow-lg',
            )}
          >
            {enableIntro && introContent && (
              <div className="mb-6">
                <RichText data={introContent} enableGutter={false} />
              </div>
            )}
            <FormContent />
          </div>
        </div>
      </section>
    )
  }

  // Standard variant
  return (
    <section className={cn('py-16', bgClass)}>
      <div className="container mx-auto px-4">
        {enableIntro && (heading || subheading) && (
          <div className="text-center mb-12">
            {heading && <h2 className="text-3xl md:text-4xl font-bold mb-4">{heading}</h2>}
            {subheading && (
              <p
                className={cn(
                  'text-lg max-w-2xl mx-auto',
                  backgroundColor === 'dark' ? 'text-white/70' : 'text-theme-text-light',
                )}
              >
                {subheading}
              </p>
            )}
          </div>
        )}
        <div className="max-w-2xl mx-auto">
          {enableIntro && introContent && (
            <div className="mb-8">
              <RichText data={introContent} enableGutter={false} />
            </div>
          )}
          <FormContent />
        </div>
      </div>
    </section>
  )
}

export default FormBlockComponent
