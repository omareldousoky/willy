export interface CIBReportRequest {
  startDate: number
  endDate: number
  offset: number
  size: number
  branchId: string
  customerName?: string
}
