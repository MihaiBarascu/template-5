import type { SelectField } from '@payloadcms/plugin-form-builder/types'
import type { Control, FieldErrorsImpl } from 'react-hook-form'

import React from 'react'
import { Controller } from 'react-hook-form'

import { Error } from '../Error'
import { Width } from '../Width'

export const Select: React.FC<
  SelectField & {
    control: Control
    errors: Partial<FieldErrorsImpl>
    inputClassName?: string
  }
> = ({ name, control, errors, label, options, required, width, defaultValue, inputClassName }) => {
  return (
    <Width width={width}>
      <label htmlFor={name} className="block text-sm font-medium mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <Controller
        control={control}
        defaultValue={defaultValue}
        name={name}
        render={({ field: { onChange, value } }) => {
          return (
            <select
              id={name}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              className={inputClassName || 'w-full px-4 py-3 rounded-lg border border-theme-border bg-white text-theme-text transition-colors focus:outline-none focus:ring-2 focus:ring-theme-primary'}
            >
              <option value="">Selecteaza o optiune</option>
              {options.map(({ label, value }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          )
        }}
        rules={{ required }}
      />
      {errors[name] && <Error name={name} />}
    </Width>
  )
}
