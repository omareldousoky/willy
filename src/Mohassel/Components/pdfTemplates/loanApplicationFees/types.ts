export interface LoanApplicationFeesProps {
  result: {
    branches: {
      df: {
        truthDate: string
        branchName: string
        serialNo: number
        customerKey: string
        customerName: string
        loanSerial: number
        principal: number
        status: string
        principalAmount: number
        transactionInterest: number
        transactionAmount: number
        canceled: number
        loanType?: string
      }[]
      total: number[]
      canceled: number[]
      net: number[]
      branchName: string
    }[]
    trx: number
    day: string
    total: number[]
    canceled: number[]
    net: number[]
  }[]
  total: number[]
  canceled: number[]
  net: number[]
  trx: number
  startDate: number
  endDate: number
  financialLeasing?: boolean
}
