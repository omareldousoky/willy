import * as Yup from 'yup'
import { FormikHelpers, FormikProps } from 'formik'

export interface IFieldDefaultProps {
  name: string
  type: string
  readOnly?: boolean
  disabled?: boolean
}

export interface IField extends IFieldDefaultProps {
  type: 'text' | 'date' | 'number' | 'textarea' | 'photo'
  label: string
  validation: Yup.Schema<any>
}

export interface ICheckboxField extends IFieldDefaultProps {
  type: 'checkbox'
  label: string
  checkboxLabel: string
  validation: Yup.Schema<any>
}

export interface IGroupField extends IFieldDefaultProps {
  type: 'group'
  fields: IFormField[]
}

export interface ISelectField extends IFieldDefaultProps {
  type: 'select'
  label: string
  validation: Yup.Schema<any>
  options: {
    value: string
    label: string
  }[]
}

export interface FileField extends IFieldDefaultProps {
  type: 'file'
  accepts: string
  validation: Yup.Schema<any>
  label: string
}

type ISingleField = IField | ISelectField | ICheckboxField | FileField

export type IFormField = ISingleField | IGroupField

export type GroupFieldProps = {
  field: IGroupField
  formikProps: FormikProps<any>
  pairs?: boolean
}

export type FormFieldProps = {
  field: ISingleField
  formikProps: FormikProps<any>
}

export type FormFieldsProps = {
  formFields: IFormField[]
  formikProps: FormikProps<any>
}

export type AppFormProps = {
  formFields: IFormField[]
  onSubmit: (values: any, formikHelpers: FormikHelpers<any>) => void
  onCancel?: () => void
  onChange?: () => void
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
