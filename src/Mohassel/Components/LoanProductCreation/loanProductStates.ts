import * as Yup from 'yup'
import * as local from '../../../Shared/Assets/ar.json'
import { maxValue, minValue } from '../../../Shared/localUtils'

export const LoanProductValidation = Yup.object().shape({
  productName: Yup.string().required(local.required),
  beneficiaryType: Yup.string().required(local.required),
  calculationFormulaId: Yup.string().required(local.required),
  periodLength: Yup.number()
    .integer(local.mustBeInt)
    .min(1, minValue(1))
    .required(local.required),
  noOfInstallments: Yup.number()
    .integer(local.mustBeInt)
    .min(0, minValue(0))
    .test('noOfInstallments', `outOfRange`, function (this: any, value: any) {
      const { minInstallment, maxInstallment } = this.parent
      if (minInstallment === 0 && maxInstallment === 0) {
        return true
      }
      return value >= minInstallment && value <= maxInstallment
    })
    .required(local.required),
  lateDays: Yup.number()
    .integer(local.mustBeInt)
    .min(0, minValue(0))
    .required(local.required),
  gracePeriod: Yup.number()
    .integer(local.mustBeInt)
    .min(0, minValue(0))
    .required(local.required),
  interest: Yup.number()
    .min(0, minValue(0))
    .max(100, maxValue(100))
    .required(local.required),
  inAdvanceFees: Yup.number()
    .min(0, minValue(0))
    .max(100, maxValue(100))
    .required(local.required),
  stamps: Yup.number().min(0, minValue(0)).required(local.required),
  representativeFees: Yup.number().min(0, minValue(0)).required(local.required),
  adminFees: Yup.number().min(0, minValue(0)).required(local.required),
  earlyPaymentFees: Yup.number()
    .min(0, minValue(0))
    .max(100, maxValue(100))
    .required(local.required),
  maxNoOfRestructuring: Yup.number()
    .integer(local.mustBeInt)
    .min(0, minValue(0))
    .required(local.required),
  minPrincipal: Yup.number().min(0, minValue(0)).required(local.required),
  maxPrincipal: Yup.number()
    .min(Yup.ref('minPrincipal'), local.maxGreaterThanMin)
    .test(
      'maxPrincipal',
      local.maxGlobalLimitReachedError,
      function (this: any, value: any) {
        const { beneficiaryType, principals, type } = this.parent
        return ((beneficiaryType === 'individual' &&
          value <= principals?.maxIndividualPrincipal) ||
          (beneficiaryType === 'group' &&
            value <= principals?.maxGroupPrincipal) ||
          type === 'sme') as boolean
      }
    )
    .required(local.required),
  minInstallment: Yup.number().min(0, minValue(0)).required(local.required),
  maxInstallment: Yup.number()
    .min(Yup.ref('minInstallment'), local.maxGreaterThanMin)
    .required(local.required),
  applicationFee: Yup.number().min(0, minValue(0)).required(local.required),
  individualApplicationFee: Yup.number()
    .min(0, minValue(0))
    .required(local.required),
  applicationFeePercent: Yup.number()
    .min(0, minValue(0))
    .max(100, maxValue(100))
    .required(local.required),
  applicationFeePercentPerPerson: Yup.number()
    .min(0, minValue(0))
    .max(100, maxValue(100))
    .required(local.required),
  loanNature: Yup.string().required(local.required),
  currency: Yup.string().required(local.required),
  periodType: Yup.string().required(local.required),
  interestPeriod: Yup.string().required(local.required),
  inAdvanceFrom: Yup.string().required(local.required),
  inAdvanceType: Yup.string().required(local.required),
  applicationFeeType: Yup.string().required(local.required),
  applicationFeePercentPerPersonType: Yup.string().required(local.required),
  pushHolidays: Yup.string().required(local.required),
  allowInterestAdjustment: Yup.boolean().required(local.required),
  allowStampsAdjustment: Yup.boolean().required(local.required),
  allowRepresentativeFeesAdjustment: Yup.boolean().required(local.required),
  allowAdminFeesAdjustment: Yup.boolean().required(local.required),
  allowApplicationFeeAdjustment: Yup.boolean().required(local.required),
  spreadApplicationFee: Yup.boolean().required(local.required),
  loanImpactPrincipal: Yup.boolean().required(local.required),
  mustEnterGuarantor: Yup.boolean().required(local.required),
  noOfGuarantors: Yup.number()
    .integer(local.mustBeInt)
    .min(0, minValue(0))
    .required(local.required),
  allocatedDebtForGoodLoans: Yup.number()
    .integer(local.mustBeInt)
    .min(0, minValue(0))
    .max(100, maxValue(100))
    .required(local.required),
  aging: Yup.array().of(
    Yup.object().shape({
      to: Yup.number()
        .integer(local.mustBeInt)
        .min(0, minValue(0))
        .test(
          'mustbegreater',
          'cant be less than or equal to',
          function (this: any) {
            const { from, to } = this.parent
            if (from <= to) {
              return true
            }
            return false
          }
        )
        .required(local.required),
      fee: Yup.number()
        .integer(local.mustBeInt)
        .min(0, minValue(0))
        .max(100, maxValue(100))
        .required(local.required),
    })
  ),
  mergeUndoubtedLoansFees: Yup.number()
    .min(0, minValue(0))
    .max(100, maxValue(100))
    .required(local.required),
  mergeDoubtedLoansFees: Yup.number()
    .min(0, minValue(0))
    .max(100, maxValue(100))
    .required(local.required),
  pushPayment: Yup.number()
    .integer(local.mustBeInt)
    .min(0, minValue(0))
    .required(local.required),
  pushDays: Yup.array().of(
    Yup.number()
      .integer(local.mustBeInt)
      .min(0, minValue(0))
      .required(local.required)
  ),
  type: Yup.string().required(local.required),
})
