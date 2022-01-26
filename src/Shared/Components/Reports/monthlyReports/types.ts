export interface Report {
  created: {
    at: number
    by: string
    userName: string
  }
  generatedAt: number
  fileGeneratedAt: number
  status: 'created' | 'queued' | 'failed'
  _id: string
  key: string
  response?: any
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
