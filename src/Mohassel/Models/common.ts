export interface ApiResponse<T> {
  status: 'success' | 'error'
  body?: T
  error?: unknown
}

export interface SearchRequest {
  from: number
  size: number
  order?: 'asc' | 'desc'
  fromDate?: number
  toDate?: number
  name?: string
  nationalId?: string
  key?: number
  url?: string // for FE ONLY
  type?: 'sme' | 'micro' | 'nano'
  beneficiaryType?: 'individual' | 'group'
}

export interface PaginatedResponse {
  totalCount: number
}
export interface Product {
  id: string
  name: string
  branches?: number
}
