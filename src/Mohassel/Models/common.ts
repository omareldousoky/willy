export interface ApiResponse<T> {
  status: 'success' | 'error'
  body?: T
  error?: unknown
}
export interface Signature {
  by?: string
  at?: number
  userName?: string
}

export interface Trace {
  created: Signature
  updated: Signature
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
}

export interface PaginatedResponse {
  totalCount: number
}
