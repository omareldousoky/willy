export interface PostponesReportRequest {
  startDate: string | number
  endDate: string | number
  branches: string[]
}
export interface CustomerGuaranteedReportRequest {
  guarantorId: string
}

export interface ReviewedLoansRequest {
  startDate: string | number
  endDate: string | number
  branches: string[]
  loanType: string
}
