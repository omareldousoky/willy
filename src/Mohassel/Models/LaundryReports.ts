export interface LaundryReportRequest {
  startDate: number
  endDate: number
  branches: string[]
}

interface LaundryReportResponse<T> {
  response: T[]
}

export interface FalteringPaymentsSingleResponse {
  branch?: string
  groupCode?: string
  groupName?: string
  customerCode?: string
  customerName?: string
  amount?: number
  duration?: number
  loanDate?: string
  customerActivity?: string
  stoppingDate?: string
  paymentDate?: string
  paidInstallments?: number
  payingCustomerName?: string
  index?: number
}

export type FalteringPaymentsResponse = LaundryReportResponse<FalteringPaymentsSingleResponse>

export interface EarlyPaymentsSingleResponse {
  branch?: string
  groupCode?: string
  groupName?: string
  customerCode?: string
  customerName?: string
  amount?: number
  duration?: number
  loanDate?: string
  customerActivity?: string
  cashoutAmount?: number
  cashoutDate?: string
  cashedoutInstallments?: number
  cashingoutCustomerName?: string
  index?: number
}

export type EarlyPaymentsResponse = LaundryReportResponse<EarlyPaymentsSingleResponse>
