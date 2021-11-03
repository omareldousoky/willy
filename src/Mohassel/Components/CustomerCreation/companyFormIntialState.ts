import * as Yup from 'yup'
import local from '../../../Shared/Assets/ar.json'
import {
  endOfDayValue,
  timeToDateyyymmdd,
} from '../../../Shared/Services/utils'

export const step1Company = {
  businessName: '',
  businessAddress: '',
  businessCharacteristic: '',
  businessSector: '',
  businessActivityDetails: '',
  businessLicenseNumber: '',
  // businessLicenseIssuePlace: '',
  businessLicenseIssueDate: '',
  commercialRegisterNumber: '',
  // industryRegisterNumber: '',
  taxCardNumber: '',
  legalConstitution: 'other',
  smeCategory: 'other',
  commercialRegisterExpiryDate: '',
  customerType: 'company',
  governorate: '',
}
export const step2Company = {
  geographicalDistribution: '',
  geoAreaId: '',
  representative: '',
  newRepresentative: '',
  representativeName: '',
  applicationDate: timeToDateyyymmdd(-1),
  permanentEmployeeCount: 0,
  partTimeEmployeeCount: '',
  comments: '',
  guarantorMaxLoans: 1,
  maxLoansAllowed: 1,
  principals: {
    maxIndividualPrincipal: 0,
    maxGroupIndividualPrincipal: 0,
    maxGroupPrincipal: 0,
  },
  cbeCode: '',
  paidCapital: 0,
  establishmentDate: '',
  smeSourceId: '',
  smeBankName: '',
  smeBankBranch: '',
  smeBankAccountNumber: '',
  smeIbanNumber: '',
}
const endOfDay: Date = new Date()
endOfDay.setHours(23, 59, 59, 59)

export const companyCreationValidationStepOne = Yup.object().shape({
  businessName: Yup.string()
    .trim()
    .max(100, local.maxLength100)
    .required(local.required)
    .matches(
      /^(?!.*?\s{2})([\u0621-\u064A\s]+){1,100}$/,
      local.onlyArabicLetters
    ),
  businessAddress: Yup.string()
    .trim()
    .max(500, local.maxLength500)
    .required(local.required),
  businessCharacteristic: Yup.string().trim().required(local.required),
  legalConstitution: Yup.string().trim().required(local.required),
  smeCategory: Yup.string().trim().required(local.required),
  businessLicenseNumber: Yup.string()
    .max(20, local.maxLength20)
    .required(local.required),
  businessSector: Yup.string()
    .max(50, local.maxLength50)
    .required(local.required),
  businessActivityDetails: Yup.string()
    .max(500, local.maxLength500)
    .required(local.required),
  // businessLicenseIssuePlace: Yup.string().trim().max(100, maxLength100),
  businessLicenseIssueDate: Yup.string()
    .test('Max Date', local.dateShouldBeBeforeToday, (value: any) => {
      return value ? new Date(value).valueOf() <= endOfDayValue : true
    })
    .required(local.required),
  commercialRegisterNumber: Yup.string()
    .max(20, local.maxLength20)
    .required(local.required),
  commercialRegisterExpiryDate: Yup.date().required(local.required),
  // industryRegisterNumber: Yup.string()
  //   .max(50, local.maxLength50)
  //   .required(local.required),
  taxCardNumber: Yup.string().when('taxCardNumberChecker', {
    is: true,
    then: Yup.string().test(
      'error',
      local.duplicateCompanyNumberMessage,
      () => false
    ),
    otherwise: Yup.string()
      .length(9, local.lengthShouldBe9)
      .required(local.required),
  }),
  governorate: Yup.string().required(local.required),
})

export const companyCreationValidationStepTwo = Yup.object().shape({
  geographicalDistribution: Yup.string().trim(),
  geoAreaId: Yup.string().trim().required(local.required),
  representative: Yup.string().trim().required(local.required),
  applicationDate: Yup.string()
    .test('Max Date', local.dateShouldBeBeforeToday, (value: any) => {
      return value ? new Date(value).valueOf() <= endOfDayValue : true
    })
    .required(local.required),
  comments: Yup.string().trim().max(500, local.maxLength100),
  paidCapital: Yup.string().trim().required(local.required),
  establishmentDate: Yup.string().trim().required(local.required),
  smeBankName: Yup.string().required(local.required),
  smeBankBranch: Yup.string().required(local.required),
  smeBankAccountNumber: Yup.string().required(local.required),
  smeIbanNumber: Yup.string().required(local.required),
  cbeCode: Yup.string().when('cbeCodeChecker', {
    is: true,
    then: Yup.string().test(
      'error',
      local.duplicateCbeCodeMessage,
      () => false
    ),
  }),
  permanentEmployeeCount: Yup.string().trim().required(local.required),
})

export const companyCreationValidationStepTwoEdit = Yup.object().shape({
  geographicalDistribution: Yup.string().trim(),
  geoAreaId: Yup.string().trim().required(local.required),
  representative: Yup.string().trim().required(local.required),
  applicationDate: Yup.string()
    .test('Max Date', local.dateShouldBeBeforeToday, (value: any) => {
      return value ? new Date(value).valueOf() <= endOfDayValue : true
    })
    .required(local.required),
  permanentEmployeeCount: Yup.string().trim().required(local.required),
  partTimeEmployeeCount: Yup.string().trim().required(local.required),
  comments: Yup.string().trim().max(500, local.maxLength100),
  guarantorMaxLoans: Yup.number()
    .required()
    .min(1, local.mustBeOneOrMore)
    .max(100, local.mustBeNotMoreThanHundred)
    .required(local.required),
  maxLoansAllowed: Yup.number()
    .required()
    .min(1, local.mustBeOneOrMore)
    .max(100, local.mustBeNotMoreThanHundred)
    .required(local.required),
  paidCapital: Yup.string().trim().required(local.required),
  establishmentDate: Yup.string().trim().required(local.required),
  smeBankName: Yup.string().required(local.required),
  smeBankBranch: Yup.string().required(local.required),
  smeBankAccountNumber: Yup.string().required(local.required),
  smeIbanNumber: Yup.string().required(local.required),
  cbeCode: Yup.string().when('cbeCodeChecker', {
    is: true,
    then: Yup.string().test(
      'error',
      local.duplicateCbeCodeMessage,
      () => false
    ),
  }),
})
