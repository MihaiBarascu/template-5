import type { CheckboxField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { useFormContext } from 'react-hook-form'
import React from 'react'

import { Error } from '../Error'
import { Width } from '../Width'

export const Checkbox: React.FC<
  CheckboxField & {
    errors: Partial<FieldErrorsImpl>
    register: UseFormRegister<FieldValues>
  }
> = ({ name, defaultValue, errors, label, register, required, width }) => {
  const props = register(name, { required: required })
  const { setValue } = useFormContext()

  return (
    <Width width={width}>
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id={name}
          defaultChecked={defaultValue}
          className="w-5 h-5 rounded border-gray-300 text-theme-primary focus:ring-theme-primary cursor-pointer"
          {...props}
          onChange={(e) => {
            setValue(props.name, e.target.checked)
          }}
        />
        <label htmlFor={name} className="text-sm font-medium cursor-pointer">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>
      {errors[name] && <Error name={name} />}
    </Width>
  )
}
