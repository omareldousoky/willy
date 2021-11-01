import {
  CustomerCreationStep1,
  CustomerCreationStep2,
  CustomerCreationStep3,
} from '../Models/Customer'
import { timeToDateyyymmdd } from '../Services/utils'

export const step1: CustomerCreationStep1 = {
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

export const step2: CustomerCreationStep2 = {
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

export const step3: CustomerCreationStep3 = {
  geographicalDistribution: '',
  geoAreaId: '',
  representative: '',
  newRepresentative: '',
  representativeName: '',
  applicationDate: timeToDateyyymmdd(-1),
  permanentEmployeeCount: 0,
  partTimeEmployeeCount: 0,
  comments: '',
  guarantorMaxLoans: 1,
  maxLoansAllowed: 1,
  maxPrincipal: 0,
  principals: {
    maxIndividualPrincipal: 0,
    maxGroupIndividualPrincipal: 0,
    maxGroupPrincipal: 0,
  },
  allowGuarantorLoan: false,
}
