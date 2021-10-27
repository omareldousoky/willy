import { Customer } from '../Models/Customer'
import { timeToDateyyymmdd } from '../Services/utils'

export const prepareCustomer = (customer: Customer) => {
  const customerInfo = {
    customerName: customer.customerName?.trim() || '',
    nationalId: customer.nationalId || '',
    birthDate: timeToDateyyymmdd(customer.birthDate as number),
    gender: customer.gender || '',
    nationalIdIssueDate: timeToDateyyymmdd(
      customer.nationalIdIssueDate as number
    ),
    // monthlyIncome: customer.monthlyIncome,
    // initialConsumerFinanceLimit: customer.initialConsumerFinanceLimit,
    // customerConsumerFinanceMaxLimit: await this.getCustomerLimitFromIncome(
    //   customer.monthlyIncome
    // ),
    homePostalCode: customer.homePostalCode || '',
    customerHomeAddress: customer.customerHomeAddress || '',
    currentHomeAddress: customer.currentHomeAddress || '',
    customerAddressLatLong: customer.customerAddressLatLong || '',
    customerAddressLatLongNumber: {
      lat: customer.customerAddressLatLong
        ? Number(customer.customerAddressLatLong.split(',')[0])
        : 0,
      lng: customer.customerAddressLatLong
        ? Number(customer.customerAddressLatLong.split(',')[1])
        : 0,
    },
    homePhoneNumber: customer.homePhoneNumber || '',
    faxNumber: customer.faxNumber || '',
    mobilePhoneNumber: customer.mobilePhoneNumber || '',
    customerWebsite: customer.customerWebsite?.trim() || '',
    emailAddress: customer.emailAddress?.trim() || '',
    currHomeAddressGov: customer.currHomeAddressGov || '',
    policeStation: customer.policeStation || '',
  }
  const customerBusiness = {
    businessAddressLatLong: customer.businessAddressLatLong || '',
    businessAddressLatLongNumber: {
      lat: customer.businessAddressLatLong
        ? Number(customer.businessAddressLatLong.split(',')[0])
        : 0,
      lng: customer.businessAddressLatLong
        ? Number(customer.businessAddressLatLong.split(',')[1])
        : 0,
    },
    businessName: customer.businessName || '',
    businessAddress: customer.businessAddress || '',
    governorate: customer.governorate || '',
    district: customer.district || '',
    village: customer.village || '',
    ruralUrban: customer.ruralUrban || '',
    businessPostalCode: customer.businessPostalCode || '',
    businessPhoneNumber: customer.businessPhoneNumber || '',
    businessSector: customer.businessSector || '',
    businessActivity: customer.businessActivity || '',
    businessSpeciality: customer.businessSpeciality || '',
    businessLicenseNumber: customer.businessLicenseNumber || '',
    businessLicenseIssuePlace: customer.businessLicenseIssuePlace || '',
    businessLicenseIssueDate: timeToDateyyymmdd(
      customer.businessLicenseIssueDate as number
    ),
    commercialRegisterNumber: customer.commercialRegisterNumber || '',
    industryRegisterNumber: customer.industryRegisterNumber || '',
    taxCardNumber: customer.taxCardNumber || '',
  }
  const customerExtraDetails = {
    geographicalDistribution: customer.geographicalDistribution || '',
    geoAreaId: customer.geoAreaId || '',
    representative: customer.representative || '',
    representativeName: customer.representativeName || '',
    applicationDate: timeToDateyyymmdd(customer.applicationDate as number),
    permanentEmployeeCount: customer.permanentEmployeeCount || 0,
    partTimeEmployeeCount: customer.partTimeEmployeeCount || 0,
    comments: customer.comments || '',
    maxLoansAllowed: customer.maxLoansAllowed
      ? Number(customer.maxLoansAllowed)
      : 1,
    allowGuarantorLoan: customer.allowGuarantorLoan,
    guarantorMaxLoans: customer.guarantorMaxLoans
      ? Number(customer.guarantorMaxLoans)
      : 1,
    maxPrincipal: customer.maxPrincipal || 0,
  }
  return { customerInfo, customerBusiness, customerExtraDetails }
}
