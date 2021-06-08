interface EarlyPaymentPdfData {
  totalDaysLate: number
  totalDaysEarly: number
  installmentsDue: number[]
  remainingInstallments: number
  applicationFees: number
  totalLoanAmount: number // egamli l raseed
  totalEarlyPaymentAmount: number // egmali l sdad l mo3agal
  earlyPaymentBaseAmount: number // raseed l asl
  remainingPrincipal?: number
}
