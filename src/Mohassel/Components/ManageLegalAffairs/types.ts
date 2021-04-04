import { FormikProps } from 'formik'
import * as Yup from 'yup'


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
  oppositionAppealSession: ICortSession
  misdemeanorAppealSession: ICortSession

  misdemeanorAppealNumber: string
  caseStatus: string
  caseStatusSummary: string
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
