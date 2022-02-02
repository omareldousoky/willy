export type Bank = {
  id: string
  name: string
  nameAr: string
  generalLedgerAccountNumber: number
}

export interface BanksResponse {
  status: string
  error?: string
  banks: Bank[]
}
