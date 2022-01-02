export interface PostponesReportRequest {
  startDate: string | number
  endDate: string | number
  branches: string[]
}
export interface CustomerGuaranteedReportRequest {
  guarantorId: string
}
