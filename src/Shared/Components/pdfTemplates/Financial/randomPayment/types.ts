export interface RandomPaymentProps {
  branches: {
    rows: {
      customerKey: string
      customerName: string
      trxCode: string
      trxDate: string
      trxAmount: string
      trxAction: string
      canceled: string
      loanType?: string
    }[]
    trxCount: string
    trxSum: string
    branchName: string
    trxRb: string
    trxNet: string
  }[]
  startDate: number
  endDate: number
  isCF?: boolean
  financialLeasing?: boolean
}
