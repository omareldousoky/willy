import * as Yup from "yup";
import * as local from "../../../Shared/Assets/ar.json";

const {
  maxLength100,
  required,
  onlyArabicLetters,
  minLength5,
  minLength10,
  minLength11,
  maxLength10,
  invalidEmail,
  invalidWebsite,
  dateShouldBeBeforeToday
} = local;

const endOfDay: Date = new Date();
endOfDay.setHours(23, 59, 59, 59);

export const companyCreationValidationStepOne = Yup.object().shape({
    businessName: Yup.string().trim().max(100, maxLength100).required(required),
    businessAddress: Yup.string().trim().max(500, "Can't be more than 500 characters").required(required),
    governorate: Yup.string().trim(),
    district: Yup.string().trim(),
    village: Yup.string().trim(),
    ruralUrban: Yup.string().trim(),
    businessPostalCode: Yup.string().min(5, minLength5),
    businessPhoneNumber: Yup.string().min(10, minLength10),
    businessSector: Yup.string().trim().required(required),
    businessActivity: Yup.string().trim().required(required),
    businessSpeciality: Yup.string().trim(),
    legalStructure: Yup.string().trim().required(required),
    businessLicenseNumber: Yup.string().trim().required(required),
    businessLicenseIssuePlace: Yup.string().trim().max(100, maxLength100),
    businessLicenseIssueDate: Yup.string().test(
        "Max Date", dateShouldBeBeforeToday,
        (value: any) => { return value ? new Date(value).valueOf() <= endOfDay.valueOf() : true }).required(required),
    commercialRegisterNumber: Yup.string().trim().max(100, maxLength100).required(required),
    commercialRegisterExpiryDate: Yup.date().required(required),
    industryRegisterNumber: Yup.string().trim().max(100, maxLength100).required(required),
    taxCardNumber: Yup.string().trim().max(100, maxLength100).required(required),
})

export const companyCreationValidationStepTwo = Yup.object().shape({
  geographicalDistribution: Yup.string().trim(),
  geoAreaId: Yup.string().trim().required(local.required),
  representative: Yup.string().trim().required(local.required),
  applicationDate: Yup.string().test(
      "Max Date", local.dateShouldBeBeforeToday,
      (value: any) => { return value ? new Date(value).valueOf() <= endOfDay.valueOf() : true }).required(local.required),
  permanentEmployeeCount: Yup.string().trim(),
  partTimeEmployeeCount: Yup.string().trim(),
  comments: Yup.string().trim().max(500, local.maxLength100)
})

export const companyCreationValidationStepTwoEdit = Yup.object().shape({
  geographicalDistribution: Yup.string().trim(),
  geoAreaId: Yup.string().trim().required(local.required),
  representative: Yup.string().trim().required(local.required),
  applicationDate: Yup.string().test(
      "Max Date", local.dateShouldBeBeforeToday,
      (value: any) => { return value ? new Date(value).valueOf() <= endOfDay.valueOf() : true }).required(local.required),
  permanentEmployeeCount: Yup.string().trim(),
  partTimeEmployeeCount: Yup.string().trim(),
  comments: Yup.string().trim().max(500, local.maxLength100),
  guarantorMaxLoans: Yup.number().required().min(1, local.mustBeOneOrMore).max(100, local.mustBeNotMoreThanHundred).required(local.required),
  maxLoansAllowed: Yup.number().required().min(1, local.mustBeOneOrMore).max(100, local.mustBeNotMoreThanHundred).required(local.required),
  maxPrincipal: Yup.number().min(0, local.mustBeGreaterThanZero).test("maxPrincipal", local.maxGlobalLimitReachedError,
      function (this: any, value: any) {
          const { principals } = this.parent
          if (value <= principals.maxIndividualPrincipal) {
              return true
          } else return false
      }).required(local.required),
})