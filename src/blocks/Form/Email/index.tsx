import type { EmailField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import React from 'react'

import { Error } from '../Error'
import { Width } from '../Width'

export const Email: React.FC<
  EmailField & {
    errors: Partial<FieldErrorsImpl>
    register: UseFormRegister<FieldValues>
    inputClassName?: string
  }
> = ({ name, defaultValue, errors, label, register, required, width, inputClassName }) => {
  return (
    <Width width={width}>
      <label htmlFor={name} className="block text-sm font-medium mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type="email"
        id={name}
        defaultValue={defaultValue}
        className={inputClassName || 'w-full px-4 py-3 rounded-lg border border-theme-border bg-white text-theme-text placeholder-theme-text-muted transition-colors focus:outline-none focus:ring-2 focus:ring-theme-primary'}
        {...register(name, {
          required,
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Adresa de email invalida',
          },
        })}
      />
      {errors[name] && <Error name={name} />}
    </Width>
  )
}
