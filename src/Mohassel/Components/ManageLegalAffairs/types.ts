import { FormikProps } from 'formik'
import * as Yup from 'yup'

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

export type IFormField = IGroupField | IField

export interface IFormFieldsProps {
  formFields: IFormField[]
  formikProps: FormikProps<any>
}

export type LegalCustomerActionsProps = {}

export interface ICortSession {
  date: string
  decision: string
  confinementNumber: string
}

export interface ILegalActionsForm {
  statusNumber: string
  caseNumber: string
  court: string
  statementOfClaim: string

  firstCourtSession: ICortSession
  oppositionSession: ICortSession
}

export interface SearchFilters {
  governorate?: string
  name?: string
  nationalId?: string
  key?: number
  code?: number
  customerShortenedCode?: string // For FE only
}

export type CustomerListProps = {
  currentSearchFilters: SearchFilters
  data: any
  error: string
  history: any
  loading: boolean
  totalCount: number
}

export interface TableMapperItem {
  title: string | (() => JSX.Element)
  key: string
  sortable?: boolean
  render: (data: any) => void
}

