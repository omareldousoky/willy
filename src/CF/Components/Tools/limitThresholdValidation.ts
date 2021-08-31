import * as Yup from 'yup'
import * as local from '../../../Shared/Assets/ar.json'

export const limitThresholdValidationSchema = Yup.object().shape({
  maxTenorInMonths: Yup.number().integer().required(local.required),
  annualInterestRate: Yup.number().integer().required(local.required),
  DBRPercentLowStart: Yup.number().integer().required(local.required),
  DBRPercentMidStart: Yup.number().integer().required(local.required),
  DBRPercentHighStart: Yup.number().integer().required(local.required),
  DBRPercentLow: Yup.number().integer().required(local.required),
  DBRPercentMid: Yup.number().integer().required(local.required),
  DBRPercentHigh: Yup.number().integer().required(local.required),
  globalCFMin: Yup.number().integer().required(local.required),
  globalCFMax: Yup.number().integer().required(local.required),
})
