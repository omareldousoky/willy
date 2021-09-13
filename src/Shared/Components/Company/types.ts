// TODO get rid of anys pls
interface SearchFilters {
  governorate?: string
  name?: string
  nationalId?: string
  key?: number
  code?: number
  customerShortenedCode?: string // For FE only
}
export interface CompanyListProps {
  branchId: string
  currentSearchFilters: SearchFilters
  data: any
  error: string
  history: any
  loading: boolean
  totalCount: number
  type: 'LTS' | 'DOCUMENTS'
}
