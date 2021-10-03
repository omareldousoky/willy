export interface ApiResponse<T> {
  status: 'success' | 'error'
  body?: T
  error?: unknown
}

export interface LoanApplicationReportRequest {
  startDate: string
  endDate: string
  branch: string
  loanStatus: string[]
  loanType: 'micro' | 'sme'
}

interface LoansBriefRow {
  individualLoansCount?: number
  individualLoansCredit?: number
  groupLoansCount?: number
  groupLoansCredit?: number
  loansTotal?: number
  loansTotalAmount?: number
  individualRequestsCount?: number
  individualRequestsCredit?: number
  groupRequestsCount?: number
  groupRequestsCredit?: number
  requestsTotalCount?: number
  requestsTotalAmount?: number
}

export interface BranchBrief extends LoansBriefRow {
  branchName: string
}

export interface LoansBriefingReportResponse extends LoansBriefRow {
  branchBriefing: BranchBrief[]
}

interface CommonOfficerPercentPayment {
  issuedCount?: number
  issuedAmount?: number
  firstMonth?: number
  secondMonth?: number
  thirdMonth?: number
  expectedPayments?: number
  paid?: number
  paidPercent?: number
  walletCount?: number
  walletAmount?: number
  collections?: number
}

export interface OfficerPercentPaymentRow extends CommonOfficerPercentPayment {
  officerName: string
  hiringDate: string
}

export type OfficerPercentPaymentTotalRow = CommonOfficerPercentPayment
export interface OfficerPercentPaymentBranch {
  branchName: string
  activeOfficers?: Array<OfficerPercentPaymentRow>
  inactiveOfficers?: Array<OfficerPercentPaymentRow>
  inactiveOfficersTotal?: OfficerPercentPaymentTotalRow
  activeOfficersTotal?: OfficerPercentPaymentTotalRow
  total?: OfficerPercentPaymentTotalRow
}

export interface OfficerPercentPaymentResponse {
  response: Array<OfficerPercentPaymentBranch>
  total?: OfficerPercentPaymentTotalRow
}

export enum LinkageStatusEnum {
  Pending = 'pending',
  Linked = 'linked',
  Removed = 'removed',
}

export interface CheckLinkageResponse {
  status: LinkageStatusEnum
  phoneNumber: string
}

export interface ConfirmLinkageRequest {
  customerId: string
  phoneNumber: string
  customerKey: number
}
