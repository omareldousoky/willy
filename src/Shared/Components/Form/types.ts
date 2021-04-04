import * as Yup from 'yup'
import { FormikHelpers, FormikProps } from "formik"

export interface IField {
  name: string
  type: 'text' | 'date'
  label: string
  validation: Yup.Schema<any>
}
export interface IGroupField {
  name: string
  type: 'group'
  fields: IField[]
}

export type GroupFieldProps = {
  field: IGroupField
  formikProps: FormikProps<any>
  pairs?: boolean
}

export type IFormField = IGroupField | IField

export type FormFieldsProps = {
  formFields: IFormField[]
  formikProps: FormikProps<any>
}


export type AppFormProps = {
  formFields: IFormField[]
  onSubmit: (values: any, formikHelpers: FormikHelpers<any>) => void
}