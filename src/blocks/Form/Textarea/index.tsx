import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import React from 'react'

import { Error } from '../Error'
import { Width } from '../Width'

interface TextareaFieldProps {
  name: string
  label?: string | null
  width?: number | string | null
  required?: boolean | null
  defaultValue?: string | null
  blockType?: string
  id?: string | null
}

export const Textarea: React.FC<
  TextareaFieldProps & {
    errors: Partial<FieldErrorsImpl>
    register: UseFormRegister<FieldValues>
    inputClassName?: string
    rows?: number
  }
> = ({ name, defaultValue, errors, label, register, required, width, inputClassName, rows = 4 }) => {
  return (
    <Width width={width}>
      <label htmlFor={name} className="block text-sm font-medium mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        id={name}
        defaultValue={defaultValue ?? undefined}
        rows={rows}
        className={inputClassName || 'w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-theme-primary resize-y'}
        {...register(name, { required: required ?? false })}
      />
      {errors[name] && <Error name={name} />}
    </Width>
  )
}
