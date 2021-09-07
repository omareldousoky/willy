import * as Yup from 'yup'
import * as local from '../../../Shared/Assets/ar.json'
import { maxValue, minValue } from '../../../Shared/localUtils'
import { timeToDateyyymmdd } from '../../../Shared/Services/utils'
import { GlobalCFLimits } from '../../Models/globalLimits'

export const step1: any = {
  customerName: '',
  nationalId: '',
  nationalIdChecker: false,
  birthDate: '',
  gender: '',
  nationalIdIssueDate: '',
  monthlyIncome: 0,
  initialConsumerFinanceLimit: 0,
  customerConsumerFinanceMaxLimit: 0,
  customerAddressLatLong: '',
  customerAddressLatLongNumber: {
    lat: 0,
    lng: 0,
  },
  customerHomeAddress: '',
  currentHomeAddress: '',
  homePostalCode: '',
  homePhoneNumber: '',
  mobilePhoneNumber: '',
  faxNumber: '',
  emailAddress: '',
  customerWebsite: '',
  customerType: 'individual',
}

export const step2 = {
  businessName: '',
  businessAddressLatLong: '',
  businessAddressLatLongNumber: {
    lat: 0,
    lng: 0,
  },
  businessAddress: '',
  governorate: '',
  district: '',
  village: '',
  ruralUrban: '',
  businessPostalCode: '',
  businessPhoneNumber: '',
  businessSector: '',
  businessActivity: '',
  businessSpeciality: '',
  businessLicenseNumber: '',
  businessLicenseIssuePlace: '',
  businessLicenseIssueDate: '',
  commercialRegisterNumber: '',
  industryRegisterNumber: '',
  taxCardNumber: '',
}

export const step3 = {
  geographicalDistribution: '',
  geoAreaId: '',
  representative: '',
  newRepresentative: '',
  representativeName: '',
  applicationDate: timeToDateyyymmdd(-1),
  permanentEmployeeCount: '',
  partTimeEmployeeCount: '',
  comments: '',
  guarantorMaxLoans: 1,
  maxLoansAllowed: 1,
  maxPrincipal: 0,
  principals: {
    maxIndividualPrincipal: 0,
    maxGroupIndividualPrincipal: 0,
    maxGroupPrincipal: 0,
  },
}

const endOfDay: Date = new Date()
endOfDay.setHours(23, 59, 59, 59)

export const customerCreationValidationStepOne = (limits: GlobalCFLimits) =>
  Yup.object().shape({
    customerName: Yup.string()
      .trim()
      .max(100, local.maxLength100)
      .required(local.required)
      .matches(
        /^(?!.*?\s{2})([\u0621-\u064A\s]+){1,100}$/,
        local.onlyArabicLetters
      ),
    nationalId: Yup.number()
      .when('nationalIdChecker', {
        is: true,
        then: Yup.number().test(
          'error',
          local.duplicateNationalIdMessage,
          () => false
        ),
        otherwise: Yup.number()
          .required()
          .min(10000000000000, local.nationalIdLengthShouldBe14)
          .max(99999999999999, local.nationalIdLengthShouldBe14)
          .required(local.required),
      })
      .when('birthDate', {
        is: '1800-01-01',
        then: Yup.number().test('error', local.wrongNationalId, () => false),
        otherwise: Yup.number()
          .required()
          .min(10000000000000, local.nationalIdLengthShouldBe14)
          .max(99999999999999, local.nationalIdLengthShouldBe14)
          .required(local.required),
      }),
    nationalIdIssueDate: Yup.string()
      .test('Max Date', local.dateShouldBeBeforeToday, (value: any) => {
        return value ? new Date(value).valueOf() <= endOfDay.valueOf() : true
      })
      .required(local.required),
    monthlyIncome: Yup.number()
      .min(limits.DBRPercentLowStart, minValue(limits.DBRPercentLowStart))
      .required(local.required),
    initialConsumerFinanceLimit: Yup.number()
      .min(limits.globalCFMin, minValue(limits.globalCFMin))
      .max(limits.globalCFMax, maxValue(limits.globalCFMax))
      .test(
        'initialConsumerFinanceLimit',
        local.customerMaxPrincipalError,
        function (this: any, value: any) {
          const { customerConsumerFinanceMaxLimit } = this.parent
          return value <= customerConsumerFinanceMaxLimit
        }
      )
      .required(local.required),
    customerHomeAddress: Yup.string()
      .trim()
      .max(500, "Can't be more than 500 characters")
      .required(local.required),
    homePostalCode: Yup.string().min(5, local.minLength5),
    homePhoneNumber: Yup.string().min(10, local.minLength10),
    mobilePhoneNumber: Yup.string()
      .min(11, local.minLength11)
      .required(local.required),
    faxNumber: Yup.string()
      .max(11, local.maxLength10)
      .min(10, local.minLength10),
    emailAddress: Yup.string().matches(
      // eslint-disable-next-line no-useless-escape
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      local.invalidEmail
    ),
    customerWebsite: Yup.string().url(local.invalidWebsite),
  })

export const customerCreationValidationStepTwo = Yup.object().shape({
  businessName: Yup.string()
    .trim()
    .max(100, local.maxLength100)
    .required(local.required),
  businessAddress: Yup.string()
    .trim()
    .max(500, "Can't be more than 500 characters")
    .required(local.required),
  governorate: Yup.string().trim(),
  district: Yup.string().trim(),
  village: Yup.string().trim(),
  ruralUrban: Yup.string().trim(),
  businessPostalCode: Yup.string().min(5, local.minLength5),
  businessPhoneNumber: Yup.string().min(10, local.minLength10),
  businessSector: Yup.string().trim().required(local.required),
  businessActivity: Yup.string().trim().required(local.required),
  businessSpeciality: Yup.string().trim(),
  businessLicenseNumber: Yup.string().trim(),
  businessLicenseIssuePlace: Yup.string().trim().max(100, local.maxLength100),
  businessLicenseIssueDate: Yup.string().test(
    'Max Date',
    local.dateShouldBeBeforeToday,
    (value: any) => {
      return value ? new Date(value).valueOf() <= endOfDay.valueOf() : true
    }
  ),
  commercialRegisterNumber: Yup.string().trim().max(100, local.maxLength100),
  industryRegisterNumber: Yup.string().trim().max(100, local.maxLength100),
  taxCardNumber: Yup.string().trim().max(100, local.maxLength100),
})

export const customerCreationValidationStepThree = Yup.object().shape({
  geographicalDistribution: Yup.string().trim(),
  geoAreaId: Yup.string().trim().required(local.required),
  representative: Yup.string().trim().required(local.required),
  applicationDate: Yup.string()
    .test('Max Date', local.dateShouldBeBeforeToday, (value: any) => {
      return value ? new Date(value).valueOf() <= endOfDay.valueOf() : true
    })
    .required(local.required),
  permanentEmployeeCount: Yup.string().trim(),
  partTimeEmployeeCount: Yup.string().trim(),
  comments: Yup.string().trim().max(500, local.maxLength100),
})

export const customerCreationValidationStepThreeEdit = Yup.object().shape({
  geographicalDistribution: Yup.string().trim(),
  geoAreaId: Yup.string().trim().required(local.required),
  representative: Yup.string().trim().required(local.required),
  applicationDate: Yup.string()
    .test('Max Date', local.dateShouldBeBeforeToday, (value: any) => {
      return value ? new Date(value).valueOf() <= endOfDay.valueOf() : true
    })
    .required(local.required),
  permanentEmployeeCount: Yup.string().trim(),
  partTimeEmployeeCount: Yup.string().trim(),
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
  maxPrincipal: Yup.number()
    .min(0, local.mustBeGreaterThanZero)
    .test(
      'maxPrincipal',
      local.maxGlobalLimitReachedError,
      function (this: any, value: any) {
        const { principals } = this.parent
        if (value <= principals.maxIndividualPrincipal) {
          return true
        }
        return false
      }
    )
    .required(local.required),
})
