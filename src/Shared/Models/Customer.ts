import { Signature } from './common'

interface Blocked {
  isBlocked?: boolean
  reason?: string
}

interface Suspect {
  id?: string
  type?: string
}

export interface Customer {
  _id: string
  customerName: string
  nationalId?: string
  birthDate?: number
  nationalIdIssueDate?: number
  customerAddressLatLong?: string
  customerHomeAddress?: string
  homePostalCode?: string
  homePhoneNumber?: string
  mobilePhoneNumber?: string
  faxNumber?: string
  emailAddress?: string
  customerWebsite?: string
  gender?: string
  businessName?: string
  businessAddressLatLong?: string
  businessAddress?: string
  governorate?: string
  district?: string
  village?: string
  ruralUrban?: string
  businessPostalCode?: string
  businessPhoneNumber?: string
  businessSector?: string
  businessActivity?: string
  businessSpeciality?: string
  businessLicenseNumber?: string
  businessLicenseIssuePlace?: string
  businessLicenseIssueDate?: number
  commercialRegisterNumber?: string
  industryRegisterNumber?: string
  taxCardNumber?: string
  branchId?: string
  geographicalDistribution?: string
  representative?: string
  applicationDate?: number
  permanentEmployeeCount?: number
  partTimeEmployeeCount?: number
  accountNumber?: string
  accountBranch?: string
  comments?: string
  created: Signature
  updated: Signature
  isGuarantor?: boolean
  code?: number
  key: number
  allowGuarantorLoan?: boolean
  keyFormated?: string
  currentDoubtsCount?: number
  guarantorMaxLoans?: number
  maxLoansAllowed?: number
  representativeName: string
  geoAreaId?: string
  maxPrincipal?: number
  blocked?: Blocked
  suspects?: Suspect[]
  socialStatus?: string
  qualification?: string
  currentHomeAddress?: string
  customerType?: 'individual' | 'group' | 'company'
  legalStructure?: string
  commercialRegisterExpiryDate?: number
  businessCharacteristic?: string
  businessActivityDetails?: string
  currHomeAddressGov?: string
  policeStation?: string
  nanoLoansLimit?: number
}
export interface Score {
  id?: string // commercialRegisterNumber
  customerName?: string
  activeLoans?: string
  iscore: string
  nationalId?: string
  url?: string
  bankCodes?: string[]
}
