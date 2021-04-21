import * as Yup from 'yup'
import { FormikHelpers, FormikProps } from 'formik'

export interface IFieldDefaultProps {
  name: string
  type: string
  readOnly?: boolean
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
  // validation: Yup.Schema<any>
  label: string
}

export type IFormField = ISelectField | IField | ICheckboxField | FileField

export type GroupFieldProps = {
  field: IGroupField
  formikProps: FormikProps<any>
  pairs?: boolean
}

export type FormFieldProps = {
  field: IFormField
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
  defaultValues?: any
  options?: {
    disabled?: boolean
    renderPairs?: boolean
    submitBtnText?: string
    wideBtns?: boolean
  }
}
