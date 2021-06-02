import * as Yup from 'yup'
import { FormikHelpers, FormikProps } from 'formik'
import { FormEvent } from 'react'

export interface FieldDefaultProps {
  name: string
  type: string
  readOnly?: boolean
  disabled?: boolean
  // Field name to clear if this field changed
  // used for related fields like: Governorate and District (police station)
  clearFieldOnChange?: string 
}

export interface Field extends FieldDefaultProps {
  type: 'text' | 'date' | 'number' | 'textarea' | 'photo'
  label: string
  validation: Yup.Schema<any>
}

export interface CheckboxField extends FieldDefaultProps {
  type: 'checkbox'
  label: string
  checkboxLabel: string
  validation: Yup.Schema<any>
}

export interface GroupField extends FieldDefaultProps {
  type: 'group'
  fields: FormField[]
}

export interface SelectField extends FieldDefaultProps {
  type: 'select'
  label: string
  validation: Yup.Schema<any>
  options: {
    value: string | number
    label: string
  }[]
}

export interface FileField extends FieldDefaultProps {
  type: 'file'
  accepts: string
  validation: Yup.Schema<any>
  label: string
}

type SingleField = Field | SelectField | CheckboxField | FileField

export type FormField = SingleField | GroupField

export type GroupFieldProps = {
  field: GroupField
  formikProps: FormikProps<any>
  pairs?: boolean
}

export type FormFieldProps = {
  field: SingleField
  formikProps: FormikProps<any>
}

export type FormFieldsProps = {
  formFields: FormField[]
  formikProps: FormikProps<any>
}

export type AppFormProps = {
  formFields: FormField[]
  onSubmit: (values: any, formikHelpers: FormikHelpers<any>) => void
  onCancel?: () => void
  onChange?: (event: FormEvent<HTMLFormElement>) => void
  onPhotoChange?: (name: string, value: File | string) => void
  defaultValues?: any
  options?: {
    disabled?: boolean
    renderPairs?: boolean
    submitBtnText?: string
    wideBtns?: boolean
    validationSort?: [string, string][] // use this to sort fields when validation depends on each other
    footer?: JSX.Element | string
  }
}
