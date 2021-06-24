export interface CIBReportRequest {
  startDate: number
  endDate: number
  offset: number
  size: number
  branchId: string
  customerName: string
}

export interface CibLoan {
  loanId: string
  principal: string
  loanBranch: string
  customerNationalId: string
  customerKey: string
  gender: string
  customerName: string
  customerBirthDate: string
  iscore: string
  activeLoans: string
  numInst: string
}

export interface CibLoanResponse {
  loans: CibLoan[]
  totalCount: number
}
