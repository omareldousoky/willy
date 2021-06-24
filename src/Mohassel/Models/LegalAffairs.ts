import { PaginatedResponse, SearchRequest, Signature, Trace } from './common'

export interface CourtSession {
  confinementNumber?: string
  date?: number
  decision?: string
}
export interface LegalHistoryResponse {
  history: {
    _id: string
    customerId: string
    loanId: string
    customerName: string
    nationalId: string
    customerKey: number
    customerBranchId: string
    statementOfClaim: string
    status: string
    statusNumber: string
    customerType: string
    created?: Signature
    updated?: Signature
    caseNumber: string
    caseStatus: string
    caseStatusSummary: string
    court: string
    active: true
    loanKey: number
    finalConfinementNumber: string
    finalVerdict: string
    finalVerdictDate: number
    misdemeanorAppealNumber: string
    firstCourtSession?: CourtSession
    misdemeanorAppealSession: CourtSession
    oppositionSession?: CourtSession
    oppositionAppealSession?: CourtSession
  }[]
}

export type LegalWarningType =
  | 'quickRefundWarning'
  | 'legalActionWarning'
  | 'misdemeanorNumberWarning'
  | 'verdictNoticeWarning'

export interface LegalWarningResponse extends Trace {
  _id?: string
  customerId?: string
  loanId?: string
  customerName?: string
  nationalId?: string
  customerKey?: number
  customerBranchId?: string
  warningType?: LegalWarningType
  printed?: boolean
  loanKey?: number
  currentHomeAddress?: string
}

export interface LegalWarningsSearchRequest extends SearchRequest {
  customerKey?: number
  customerBranchId?: string
  printed: boolean
  warningType?: LegalWarningType
}

export interface LegalWarningsSearchResponse extends PaginatedResponse {
  data: LegalWarningResponse[]
}

export interface LegalWarningRequest {
  loanId: string
  warningType: LegalWarningType
  customerId: string
}
