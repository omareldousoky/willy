import { ReactNode } from 'react'
import { DefaultedCustomer, ManagerReviews } from './defaultingCustomersList'

export interface CourtSession {
  date: number
  decision: string
  confinementNumber: string
}

export interface LegalActionsForm {
  statusNumber: string
  caseNumber: string
  court: string
  statementOfClaim: string

  firstCourtSession?: CourtSession
  oppositionSession?: CourtSession
  oppositionAppealSession?: CourtSession
  misdemeanorAppealSession?: CourtSession

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

export interface IPrintAction {
  name: string
  label: string
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
  render: (data: any) => ReactNode
}

export interface SettlementInfo {
  penaltyFees: number
  courtFees: number
  lawyerCardURL: string
  criminalScheduleURL: string
  caseDataAcknowledgmentURL: string
  decreePhotoCopyURL: string
}

export enum ManagerReveiwEnum {
  BranchManager = 'branchManagerReview',
  AreaManager = 'areaManagerReview',
  AreaSupervisor = 'areaSupervisorReview',
  FinancialManager = 'financialManagerReview',
}

export interface ReviewReqBody {
  type: ManagerReveiwEnum
  notes: string
  ids: string[]
}

export interface SettledCustomer extends DefaultedCustomer {
  settlement: SettlementFormValues & ManagerReviews
}

export enum SettlementTypeEnum {
  PrivateReconciliation = 'privateReconciliation',
  SettleByGeneralLawyer = 'settleByGeneralLawyer',
  SettleByCompanyLawyer = 'settleByCompanyLawyer',
  StopLegalAffairs = 'stopLegalAffairs',
  Waiver = 'waiver',
}

export enum SettlementStatusEnum {
  Reviewed = 'reviewed',
  UnderReview = 'underReview',
}

export interface SettlementFormValues {
  penaltiesPaid: boolean
  penaltyFees: number
  courtFeesPaid: boolean
  courtFees: number
  caseNumber: string
  caseYear: string
  court: string
  courtDetails: string
  lawyerName: string
  lawyerPhoneNumberOne: string
  lawyerPhoneNumberTwo: string
  lawyerPhoneNumberThree: string
  settlementType: SettlementTypeEnum
  settlementStatus: SettlementStatusEnum
  comments: string
}

export interface SettlementReqBody {
  settlement: SettlementFormValues
}
export interface ILegalSettlementFormProps {
  settlementInfo: {
    penaltyFees: number
    courtFees: number
  }
  customer: SettledCustomer
  onSubmit: () => void
  onCancel: () => void
}

export interface UploadLegalCustomerResponse {
  nationalId: string
  reason: string
}
