export interface GlobalCFLimits {
  maxTenorInMonths: number
  annualInterestRate: number
  DBRPercentLowStart: number
  DBRPercentMidStart: number
  DBRPercentHighStart: number
  DBRPercentLow: number
  DBRPercentMid: number
  DBRPercentHigh: number
  globalCFMin: number
  globalCFMax: number
  CFHQMinimumApprovalLimit: number
}

export const globalCfLimitsInitialValues = {
  maxTenorInMonths: 0,
  annualInterestRate: 0,
  DBRPercentLowStart: 0,
  DBRPercentMidStart: 0,
  DBRPercentHighStart: 0,
  DBRPercentLow: 0,
  DBRPercentMid: 0,
  DBRPercentHigh: 0,
  globalCFMin: 0,
  globalCFMax: 0,
  CFHQMinimumApprovalLimit: 0,
}
