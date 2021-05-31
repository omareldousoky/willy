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
}
export interface TableMapperItem {
  title: string
  key: string
  sortable?: boolean
  render: (data: any) => void
}
