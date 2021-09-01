import * as Yup from 'yup'
import * as local from '../../../Shared/Assets/ar.json'

export const limitThresholdValidationSchema = () =>
  Yup.object().shape({
    maxTenorInMonths: Yup.number().integer().required(local.required),
    annualInterestRate: Yup.number().integer().required(local.required),
    DBRPercentLowStart: Yup.number().integer().required(local.required),
    DBRPercentMidStart: Yup.number()
      .integer()
      .test(
        'midStartLimitError',
        'midStartLimitError',
        function (this: any, value: string) {
          const { DBRPercentLowStart } = this.parent
          return value >= DBRPercentLowStart
        }
      )
      .required(local.required),
    DBRPercentHighStart: Yup.number()
      .integer()
      .test(
        'highStartLimitError',
        'highStartLimitError',
        function (this: any, value: string) {
          const { DBRPercentMidStart } = this.parent
          return value >= DBRPercentMidStart
        }
      )
      .required(local.required),
    DBRPercentLow: Yup.number().integer().required(local.required),
    DBRPercentMid: Yup.number().integer().required(local.required),
    DBRPercentHigh: Yup.number().integer().required(local.required),
    globalCFMin: Yup.number().integer().required(local.required),
    globalCFMax: Yup.number()
      .integer()
      .test(
        'globalCFMaxError',
        'globalCFMaxError',
        function (this: any, value: string) {
          const { globalCFMin } = this.parent
          return value >= globalCFMin
        }
      )
      .required(local.required),
  })
