import * as Yup from "yup";
import * as local from "../../../Shared/Assets/ar.json";

const {
  maxLength100,
  required,
  onlyArabicLetters,
  maxLength50,
  mustBeNotMoreThanHundred,
  mustBeGreaterThanZero,
  mustBeOneOrMore,
  maxGlobalLimitReachedError,
  dateShouldBeBeforeToday,
  maxLength500,
  maxLength20
} = local;

const endOfDay: Date = new Date();
endOfDay.setHours(23, 59, 59, 59);

export const companyCreationValidationStepOne = Yup.object().shape({
    businessName: Yup.string().trim().max(100, maxLength100).required(required).matches(/^(?!.*?\s{2})([\u0621-\u064A\s]+){1,100}$/,onlyArabicLetters),
    businessAddress: Yup.string().trim().max(500, maxLength500).required(required),
    businessCharacteristic: Yup.string().trim().required(required),
    legalStructure: Yup.string().trim().required(required),
    businessLicenseNumber: Yup.string().max(20, maxLength20).required(required),
    businessSector: Yup.string().max(50, maxLength50).required(required),
    businessActivityDetails: Yup.string().max(500, maxLength500).required(required),
    // businessLicenseIssuePlace: Yup.string().trim().max(100, maxLength100),
    businessLicenseIssueDate: Yup.string().test(
        "Max Date", dateShouldBeBeforeToday,
        (value: any) => { return value ? new Date(value).valueOf() <= endOfDay.valueOf() : true }).required(required),
    commercialRegisterNumber: Yup.string().max(20, maxLength20).required(required),
    commercialRegisterExpiryDate: Yup.date().required(required),
    // industryRegisterNumber: Yup.string().max(50, maxLength50).required(required),
    taxCardNumber: Yup.string().max(20, maxLength20).required(required),
})

export const companyCreationValidationStepTwo = Yup.object().shape({
  geographicalDistribution: Yup.string().trim(),
  geoAreaId: Yup.string().trim().required(local.required),
  representative: Yup.string().trim().required(required),
  applicationDate: Yup.string().test(
      "Max Date", dateShouldBeBeforeToday,
      (value: any) => { return value ? new Date(value).valueOf() <= endOfDay.valueOf() : true }).required(required),
  comments: Yup.string().trim().max(500, maxLength100)
})

export const companyCreationValidationStepTwoEdit = Yup.object().shape({
  geographicalDistribution: Yup.string().trim(),
  geoAreaId: Yup.string().trim().required(local.required),
  representative: Yup.string().trim().required(required),
  applicationDate: Yup.string().test(
      "Max Date", dateShouldBeBeforeToday,
      (value: any) => { return value ? new Date(value).valueOf() <= endOfDay.valueOf() : true }).required(required),
  permanentEmployeeCount: Yup.string().trim(),
  partTimeEmployeeCount: Yup.string().trim(),
  comments: Yup.string().trim().max(500, maxLength100),
  guarantorMaxLoans: Yup.number().required().min(1, mustBeOneOrMore).max(100, mustBeNotMoreThanHundred).required(required),
  maxLoansAllowed: Yup.number().required().min(1, mustBeOneOrMore).max(100, mustBeNotMoreThanHundred).required(required),
  maxPrincipal: Yup.number().min(0, mustBeGreaterThanZero).test("maxPrincipal", maxGlobalLimitReachedError,
      function (this: any, value: any) {
          const { principals } = this.parent
          if (value <= principals.maxIndividualPrincipal) {
              return true
          } else return false
      }).required(required),
})