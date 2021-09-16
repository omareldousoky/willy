export interface RemainingLoanResponse {
  remainingInterest?: number
  remainingPrincipal: number
  remainingTotal: number
}

export interface CalculateEarlyPaymentResponse {
  remainingPrincipal: number
  requiredAmount: number
  earlyPaymentFees?: number
}
