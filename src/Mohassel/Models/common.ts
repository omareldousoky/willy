export interface ApiResponse<T> {
  status: 'success' | 'error'
  body?: T
  error?: unknown
}
