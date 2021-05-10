import * as Yup from 'yup'
import * as local from '../../../Shared/Assets/ar.json'

const endOfDay: Date = new Date()
endOfDay.setHours(23, 59, 59, 59)
const beforeFeb2021 = new Date('1-31-2021').setHours(23, 59, 59, 59).valueOf()

export const paymentValidation = Yup.object().shape({
  payAmount: Yup.number()
    .moreThan(0, local.minPayment)
    .required(local.required)
    .when('paymentType', {
      is: (paymentType) => paymentType !== 'penalties',
      then: Yup.number().test(
        'Should not exceed required amount',
        local.amountShouldNotExceedReqAmount,
        function (this: any, value: number) {
          return value <= this.parent.max
        }
      ),
      otherwise: Yup.number().moreThan(0, local.minPayment),
    }),
  randomPaymentType: Yup.string().when('paymentType', {
    is: (paymentType) => paymentType === 'random',
    then: Yup.string().trim().required(local.required),
    otherwise: Yup.string(),
  }),
  payerType: Yup.string().when('penaltyAction', {
    is: (penaltyAction) => penaltyAction !== 'cancel',
    then: Yup.string().required(local.required),
    otherwise: Yup.string(),
  }),
  payerId: Yup.string().when(['payerType', 'beneficiaryType'], {
    is: (payerType, beneficiaryType) =>
      (payerType === 'beneficiary' && beneficiaryType === 'group') ||
      payerType === 'employee',
    then: Yup.string().required(local.required),
    otherwise: Yup.string(),
  }),
  payerName: Yup.string().when('payerType', {
    is: (payerType) => payerType === 'family' || payerType === 'nonFamily',
    then: Yup.string().required(local.required),
    otherwise: Yup.string(),
  }),
  payerNationalId: Yup.string(),
  truthDate: Yup.string()
    .test('Max Date', local.dateShouldBeBeforeToday, (value: any) => {
      return value ? new Date(value).valueOf() <= endOfDay.valueOf() : true
    })
    .when('paymentType', {
      is: (paymentType) => paymentType !== 'normal',
      then: Yup.string().test(
        'not before 1-2-2021',
        local.dateCantBeBeforeFeb2021,
        (value: any) => {
          return value ? new Date(value).valueOf() >= beforeFeb2021 : true
        }
      ),
      otherwise: Yup.string(),
    }),
})

export const earlyPaymentValidation = Yup.object().shape({
  payerType: Yup.string().required(local.required),
  payerId: Yup.string().when(['payerType', 'beneficiaryType'], {
    is: (payerType, beneficiaryType) =>
      (payerType === 'beneficiary' && beneficiaryType === 'group') ||
      payerType === 'employee',
    then: Yup.string().required(local.required),
    otherwise: Yup.string(),
  }),
  payerName: Yup.string().when('payerType', {
    is: (payerType) => payerType === 'family' || payerType === 'nonFamily',
    then: Yup.string().required(local.required),
    otherwise: Yup.string(),
  }),
  payerNationalId: Yup.string(),
})

export const manualPaymentValidation = Yup.object().shape({
  payAmount: Yup.number()
    .moreThan(0, local.minPayment)
    .required(local.required)
    .when('paymentType', {
      is: (paymentType) => paymentType !== 'penalties',
      then: Yup.number().test(
        'Should not exceed required amount',
        local.amountShouldNotExceedReqAmount,
        function (this: any, value: number) {
          return value <= this.parent.max
        }
      ),
      otherwise: Yup.number().moreThan(0, local.minPayment),
    }),
  truthDate: Yup.string()
    .test('Max Date', local.dateShouldBeBeforeToday, (value: any) => {
      return value ? new Date(value).valueOf() <= endOfDay.valueOf() : true
    })
    .test(
      'not before 1-2-2021',
      local.dateCantBeBeforeFeb2021,
      (value: any) => {
        return value ? new Date(value).valueOf() >= beforeFeb2021 : true
      }
    ),
  receiptNumber: Yup.string().required(local.required),
  payerType: Yup.string().required(local.required),
  payerId: Yup.string().when(['payerType', 'beneficiaryType'], {
    is: (payerType, beneficiaryType) =>
      (payerType === 'beneficiary' && beneficiaryType === 'group') ||
      payerType === 'employee',
    then: Yup.string().required(local.required),
    otherwise: Yup.string(),
  }),
  payerName: Yup.string().when('payerType', {
    is: (payerType) => payerType === 'family' || payerType === 'nonFamily',
    then: Yup.string().required(local.required),
    otherwise: Yup.string(),
  }),
  payerNationalId: Yup.string(),
})

export const manualBankPaymentValidation = Yup.object().shape({
  payAmount: Yup.number()
    .moreThan(0, local.minPayment)
    .required(local.required)
    .when("paymentType", {
      is: paymentType => paymentType !== "penalties",
      then: Yup.number().test("Should not exceed required amount",
        local.amountShouldNotExceedReqAmount,
        function (this: any, value: number) {
          return value <= this.parent.max;
        }
      ),
      otherwise: Yup.number().moreThan(0, local.minPayment)
    }),
  truthDate: Yup.string()
    .test("Max Date", local.dateShouldBeBeforeToday, (value: any) => {
      return value ? new Date(value).valueOf() <= endOfDay.valueOf() : true;
    })
    .test("not before 1-2-2021", local.dateCantBeBeforeFeb2021, (value: any) => {
      return value ? new Date(value).valueOf() >= beforeFeb2021 : true;
    }),
  receiptNumber: Yup.string().required(local.required),
  bankOfPayment: Yup.string().required(local.required),
  bankOfPaymentBranch: Yup.string().required(local.required),
})

export const rollbackValidation = Yup.object().shape({
  truthDate: Yup.date()
    .required(local.required)
    .test(
      'not before 1-2-2021',
      local.dateCantBeBeforeFeb2021,
      (value: any) => {
        return value ? new Date(value).valueOf() >= beforeFeb2021 : true
      }
    ),
})
