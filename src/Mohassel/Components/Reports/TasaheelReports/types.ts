export interface Report {
  created: {
    at: number
    by: string
    userName: string
  }
  generatedAt: number
  status: 'created' | 'queued' | 'failed'
  _id: string
}
export interface RisksRow {
  customersCount: number
  tier: string
  feesPercentage: number
  arrearsPercentage: number
  provisions: number
  wallet: number
}

export interface ReportDetails {
  customersWithPartialPayments: number
  date: string
  lateCredit: number
  totalCredit: number
  undeservedCredit: number
  tasaheelRisksRow: RisksRow[]
}
