import * as Yup from 'yup'
import local from '../../../Shared/Assets/ar.json'
import { maxValue, minValue } from '../../../Shared/localUtils'
import { LeadCore } from '../../../Shared/Models/common'
import { LeadStepOne, LeadStepTwo } from './editLead'

export const leadStepOne: LeadStepOne = {
  customerName: '',
  maxAge: 0,
  minAge: 0,
  maxMinAge: '',
  phoneNumber: '',
  customerNationalId: '',
  nationalIdIssueDate: '',
  loanOwner: false,
}

export const leadStepTwo: LeadStepTwo = {
  businessSector: '',
  businessGovernate: '',
  businessCity: '',
  businessArea: '',
  businessStreet: '',
  businessAddressDescription: '',
}
export const LeadCreationInitial: LeadCore = {
  customerName: '',
  customerNationalId: '',
  phoneNumber: '',
  businessArea: '',
  businessCity: '',
  businessGovernate: '',
  businessSector: '',
  businessStreet: '',
  loanAmount: 0,
}

const endOfDay: Date = new Date()
endOfDay.setHours(23, 59, 59, 59)

export const leadValidationStepOne = Yup.object().shape({
  customerName: Yup.string()
    .trim()
    .max(100, local.maxLength100)
    .required(local.required),
  phoneNumber: Yup.string()
    .min(10, local.minLength10)
    .max(11, local.maxLength11)
    .required(local.required),
  customerNationalId: Yup.number().when('nationalIdChecker', {
    is: true,
    then: Yup.number().test(
      'error',
      local.duplicateNationalIdMessage,
      () => false
    ),
    otherwise: Yup.number()
      .min(10000000000000, local.nationalIdLengthShouldBe14)
      .max(99999999999999, local.nationalIdLengthShouldBe14),
  }),
  nationalIdIssueDate: Yup.string().test(
    'Max Date',
    local.dateShouldBeBeforeToday,
    (value: any) => {
      return value ? new Date(value).valueOf() <= endOfDay.valueOf() : true
    }
  ),
})

export const leadValidationStepTwo = Yup.object().shape({
  businessStreet: Yup.string()
    .trim()
    .max(500, "Can't be more than 500 characters"),
  businessGovernate: Yup.string().trim().required(local.required),
  businessCity: Yup.string().trim().required(local.required),
  businessArea: Yup.string().trim().required(local.required),
  businessAddressDescription: Yup.string(),
})

export const createLeadValidation = (maxLimit: number) =>
  Yup.object().shape({
    businessStreet: Yup.string().trim().required(local.required),
    businessGovernate: Yup.string().trim().required(local.required),
    businessArea: Yup.string().trim().required(local.required),
    businessCity: Yup.string().trim().required(local.required),
    businessSector: Yup.string().trim().required(local.required),
    customerName: Yup.string()
      .trim()
      .max(100, local.maxLength100)
      .required(local.required)
      .matches(
        /^(?!.*?\s{2})([\u0621-\u064A\s]+){1,100}$/,
        local.onlyArabicLetters
      ),
    phoneNumber: Yup.string()
      .trim()
      .min(11, local.minLength11)
      .required(local.required),
    customerNationalId: Yup.number()
      .min(10000000000000, local.nationalIdLengthShouldBe14)
      .max(99999999999999, local.nationalIdLengthShouldBe14)
      .when('birthDate', {
        is: '1800-01-01',
        then: Yup.number().test('error', local.wrongNationalId, () => false),
        otherwise: Yup.number()
          .required()
          .min(10000000000000, local.nationalIdLengthShouldBe14)
          .max(99999999999999, local.nationalIdLengthShouldBe14)
          .required(local.required),
      }),
    loanAmount: Yup.number()
      .max(maxLimit, maxValue(maxLimit))
      .min(1, minValue(1))
      .required(local.required),
  })
