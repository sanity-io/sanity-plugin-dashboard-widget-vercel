import {Box, TextInput} from '@sanity/ui'
import React, {forwardRef} from 'react'
import {FieldError} from 'react-hook-form'

import FormFieldInputLabel from '../FormFieldInputLabel'

type Props = {
  description?: string
  disabled?: boolean
  error?: FieldError
  label: string
  name: string
  placeholder?: string
  value?: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  onBlur?: React.FocusEventHandler<HTMLInputElement>
}

const FormFieldInputText = forwardRef<HTMLInputElement, Props>((props: Props, ref) => {
  const {description, disabled, error, label, name, placeholder, value, onChange, onBlur} = props

  return (
    <Box>
      {/* Label */}
      <FormFieldInputLabel description={description} error={error} label={label} name={name} />
      {/* Input */}
      <TextInput
        autoComplete="off"
        autoFocus
        defaultValue={value}
        disabled={disabled}
        id={name}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        ref={ref}
      />
    </Box>
  )
})

export default FormFieldInputText
