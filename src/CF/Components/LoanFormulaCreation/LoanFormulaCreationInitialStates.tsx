import * as Yup from 'yup'
import * as local from 'Shared/Assets/ar.json'
import { maxValue, minValue, moreThanValue } from '../../../Shared/localUtils'

export interface Formula {
  loanCalculationFormulaName: string
  interestType: string
  installmentType: string
  gracePeriodFees: boolean
  rounding: boolean
  roundDirection: string
  roundTo: number
  roundWhat: string
  equalInstallments: boolean
  roundLastInstallment: boolean
}
export interface FormulaTestClass {
  calculationFormulaId: string
  principal: number
  pushPayment: number
  noOfInstallments: number
  gracePeriod: number
  periodLength: number
  periodType: string
  interest: number
  interestPeriod: string
  adminFees: number
  loanStartDate: string | number
  pushHolidays: string
  inAdvanceFees: number
  inAdvanceFrom: string
  inAdvanceType: string
}
export const loanFormula: Formula = {
  loanCalculationFormulaName: '',
  interestType: 'flat',
  installmentType: 'principalAndFees',
  gracePeriodFees: false,
  rounding: true,
  roundDirection: 'up',
  roundTo: 1,
  roundWhat: 'principal',
  equalInstallments: false,
  roundLastInstallment: false,
}
export const loanFormulaCreationValidation = Yup.object().shape({
  loanCalculationFormulaName: Yup.string()
    .trim()
    .max(100, maxValue(100))
    .required(local.required),
  interestType: Yup.string().required(local.required),
  installmentType: Yup.string().required(local.required),
  gracePeriodFees: Yup.boolean(),
  rounding: Yup.boolean(),
  roundDirection: Yup.string(),
  roundTo: Yup.number().moreThan(0, moreThanValue(0)).required(local.required),
  roundWhat: Yup.string().required(local.required),
  equalInstallments: Yup.boolean(),
  roundLastInstallment: Yup.boolean(),
})
export const loanFormulaTestValidation = Yup.object().shape({
  calculationFormulaId: Yup.string().required(local.required),
  principal: Yup.number().min(1, minValue(1)).required(local.required),
  pushPayment: Yup.number()
    .integer(local.mustBeInt)
    .min(0, minValue(0))
    .required(local.required),
  noOfInstallments: Yup.number()
    .integer(local.mustBeInt)
    .min(1, minValue(1))
    .required(local.required),
  gracePeriod: Yup.number()
    .integer(local.mustBeInt)
    .min(0, minValue(0))
    .required(local.required),
  periodLength: Yup.number()
    .integer(local.mustBeInt)
    .min(1, minValue(1))
    .required(local.required),
  periodType: Yup.string().required(local.required),
  interest: Yup.number()
    .min(0, minValue(0))
    .max(100, maxValue(100))
    .required(local.required),
  interestPeriod: Yup.string().required(local.required),
  adminFees: Yup.number().min(0, minValue(0)).required(local.required),
  loanStartDate: Yup.date()
    .test('Min Date', 'Select a future date', (value: any) => {
      return value
        ? new Date(value).valueOf() >= new Date().setHours(0, 0, 0, 0)
        : true
    })
    .required(local.required),
  pushHolidays: Yup.string().required(local.required),
  inAdvanceFees: Yup.number()
    .min(0, minValue(0))
    .max(100, maxValue(100))
    .required(local.required),
  inAdvanceFrom: Yup.string().required(local.required),
  inAdvanceType: Yup.string().required(local.required),
})
