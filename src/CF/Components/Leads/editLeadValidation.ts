import * as Yup from 'yup'
import local from '../../../Shared/Assets/ar.json'
import { endOfDayValue } from '../../../Shared/Services/utils'
import { LeadStepOne, LeadStepTwo } from './editLead'

export const leadStepOne: LeadStepOne = {
  customerName: '',
  maxAge: 0,
  minAge: 0,
  maxMinAge: '',
  phoneNumber: '',
  customerNationalId: '',
  nationalIdIssueDate: '',
}

export const leadStepTwo: LeadStepTwo = {
  businessSector: '',
  businessGovernate: '',
  businessCity: '',
  businessArea: '',
  businessStreet: '',
  businessAddressDescription: '',
}

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
      return value ? new Date(value).valueOf() <= endOfDayValue : true
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
