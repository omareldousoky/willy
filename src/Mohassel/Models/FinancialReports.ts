export interface LoansIssuedByBranchRow {
  loanType: string
  branchCode?: number
  branchName: string
  approvedCount?: number
  approvedSum?: number
  createdCount?: number
  createdSum?: number
  issuedCount?: number
  issuedSum?: number
  reviewedCount?: number
  reviewedSum?: number
  totalReviewedApprovedCount?: number
  totalReviewedApprovedSum?: number
  totalCreatedIssuedCount?: number
  totalCreatedIssuedSum?: number
  totalAllCount?: number
  totalAllSum?: number
}
export interface LoansIssuedByBranchDF {
  rows: LoansIssuedByBranchRow[]
}
export interface LoansIssuedByBranchResponse {
  result: LoansIssuedByBranchDF[]
}
