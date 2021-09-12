export interface Action {
  actionTitle: string
  actionPermission: boolean
  actionOnClick(currentId?: string): void
}

export interface ActionWithIcon extends Action {
  actionIcon: string
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

export interface Specialty {
  businessSpecialtyName: { ar: string }
  id: string
  active: boolean
}

export interface Activities {
  i18n: { ar: string }
  id: string
  specialties: Array<Specialty>
  active: boolean
}

export interface BusinessSector {
  i18n: { ar: string }
  id: string
  activities: Array<Activities>
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
  beneficiaryType?: string
}

export interface PaginatedResponse {
  totalCount: number
}
export interface ApiResponse<T> {
  status: 'success' | 'error'
  body?: T
  error?: unknown
}
export interface Product {
  id: string
  name: string
  branchCount: number
  beneficiaryType: string
  code: number
  type: string
  contractType: string
}
