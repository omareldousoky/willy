export interface EarlyPaymentPdfData {
  totalDaysLate: number
  totalDaysEarly: number
  installmentsDue: number[]
  remainingInstallments: number
  applicationFees: number
  remainingTotal: number // egamli l raseed
  remainingInterest?: number
  remainingPrincipal?: number
  earlyPaymentPrincipal: number
  earlyPaymentInterest: number
  earlyPaymentTotal: number // egmali l sdad l mo3agal
}
