import {
  LoansIssuedByBranchDF,
  LoansIssuedByBranchResponse,
  LoansIssuedByBranchRow,
} from '../../../Models/FinancialReports'

export interface BranchesLoanListProps {
  data: LoansIssuedByBranchResponse
  fromDate: string
  toDate: string
}

export interface LoanTypeSectionProps {
  loanTypeName: string
  data: LoansIssuedByBranchDF
  withHeader?: boolean
}

export interface LoanTypeRowProps {
  row: LoansIssuedByBranchRow
  isTotal?: boolean
  loanTypeName: string
}
