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
