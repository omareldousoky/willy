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
