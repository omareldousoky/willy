export interface ManualPaymentsProps {
  result: {
    days: {
      branches: {
        rows: [
          {
            branchName: string
            truthDate: string
            customerKey: string
            customerName: string
            loanSerial: string
            dateOfPayment: string
            installmentStatus: string
            loanApplicationKey: string
            installmentValue: string
            issueDate: string
            loanStatus: string
            transactionPrincipal: string
            transactionInterest: string
            transactionAmount: string
            loanType?: string
          }
        ]
        branchName: string
        truthDate: string
        numTrx: string
        transactionPrincipal: string
        transactionInterest: string
        transactionAmount: string
      }[]
      truthDate: string
      numTrx: number
      transactionPrincipal: string
      transactionInterest: string
      transactionAmount: string
    }[]
    numTrx: number
    transactionAmount: string
    transactionPrincipal: string
    transactionInterest: string
  }
  fromDate: number
  toDate: number
  isCF?: boolean
}
