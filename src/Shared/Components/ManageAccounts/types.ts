export type LogsInput = {
  oldRepresentativeId: string
  newRepresentativeId: string
  customerKey: number | null
  from: number
  size: number
}
export type Logs = {
  id: string
  customerId: string
  customerName: string
  customerCode: number
  customerKey: number
  newRepresentativeId: string
  newRepresentativeName: string
  oldRepresentativeId: string
  oldRepresentativeName: string
  newCustomerBranchId: string
  updated: {
    by: string
    at: number
    userName: string
  }
}
export type LogsResults = {
  totalCount: number
  data: Logs[]
}
