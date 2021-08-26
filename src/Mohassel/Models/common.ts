export interface ApiResponse<T> {
  status: 'success' | 'error'
  body?: T
  error?: unknown
}
export interface Product {
  id: string
  name: string
  branches?: number
}
