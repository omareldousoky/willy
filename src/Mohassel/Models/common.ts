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
  url?: string // for FE ONLY
  type?: 'sme' | 'micro' | 'nano'
  beneficiaryType?: 'individual' | 'group'
}

export interface PaginatedResponse {
  totalCount: number
}
export interface Action {
  actionTitle: string
  actionPermission: boolean
  actionOnClick(currentId?: string): void
}
export interface ActionWithIcon extends Action {
  actionIcon: string
}
export interface Product {
  id: string
  name: string
  branches?: number
}
