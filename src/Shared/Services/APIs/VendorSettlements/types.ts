export interface VendorLastSettlementDateRequest {
  merchantId: string
}
export interface VendorOutstandingSettlementsRequest
  extends VendorLastSettlementDateRequest {
  toDate: number
}
export interface VendorSettlementRequest {
  merchantId: string
  settlementDate: number
  settlementAmount: number
  bankAccountNumber: string
}
