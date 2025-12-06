import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import React from 'react'

import { Error } from '../Error'
import { Width } from '../Width'

interface NumberFieldProps {
  name: string
  label?: string | null
  width?: number | string | null
  required?: boolean | null
  defaultValue?: number | null
  blockType?: string
  id?: string | null
}

export const Number: React.FC<
  NumberFieldProps & {
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
        type="number"
        id={name}
        defaultValue={defaultValue ?? undefined}
        className={inputClassName || 'w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-theme-primary'}
        {...register(name, { required: required ?? false })}
      />
      {errors[name] && <Error name={name} />}
    </Width>
  )
}
