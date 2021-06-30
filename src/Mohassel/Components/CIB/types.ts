import { CibLoan, CIBReportRequest } from '../../Models/CIB'

export interface CIBProps {
  loans: CibLoan[]
  totalCount: number
  searchFilters: CIBReportRequest
  search: (request) => Promise<void>
  setSearchFilters: (filters) => void
  loading: boolean
  setLoading: (isLoading) => void
}

export interface CIBState {
  size: number
  from: number
  principalSelectedSum: number
  manageLoansTabs: any[]
  selectedLoans?: string[]
  showNoResultMessage?: boolean
}
