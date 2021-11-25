import { Signature } from './common'

interface Blocked {
  isBlocked?: boolean
  reason?: string
}

interface Suspect {
  id?: string
  type?: string
}

type Guarantor = Customer & { position?: string }
type EntitledToSign = Guarantor

export interface Customer {
  _id?: string
  customerName?: string
  nationalId?: string
  birthDate?: number
  branchName?: string
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
  created?: Signature
  updated?: Signature
  isGuarantor?: boolean
  code?: number
  key?: number
  allowGuarantorLoan?: boolean
  keyFormated?: string
  currentDoubtsCount?: number
  guarantorMaxLoans?: number
  maxLoansAllowed?: number
  representativeName?: string
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
  monthlyIncome?: number
  initialConsumerFinanceLimit?: number
  consumerFinanceLimitStatus?: string
  hasLoan?: boolean
  guarantorMaxCustomers?: number
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
export interface CustomerCreationStep1 {
  customerName: string
  nationalId: string
  nationalIdChecker?: boolean
  birthDate: string | number
  gender: string
  nationalIdIssueDate: string | number
  monthlyIncome?: number // for CF only
  initialConsumerFinanceLimit: number
  customerConsumerFinanceMaxLimit?: number // for CF only
  customerAddressLatLong: string
  customerAddressLatLongNumber: {
    lat: number
    lng: number
  }
  customerHomeAddress: string
  currentHomeAddress: string
  currHomeAddressGov?: string
  policeStation?: string
  homePostalCode: string
  homePhoneNumber: string
  mobilePhoneNumber: string
  faxNumber: string
  emailAddress: string
  customerWebsite: string
  customerType: string
}

export interface CustomerCreationStep2 {
  businessName: string
  businessAddressLatLong: string
  businessAddressLatLongNumber: {
    lat: number
    lng: number
  }
  businessAddress: string
  governorate: string
  district: string
  village: string
  ruralUrban: string
  businessPostalCode: string
  businessPhoneNumber: string
  businessSector: string
  businessActivity: string
  businessSpeciality: string
  businessLicenseNumber: string
  businessLicenseIssuePlace: string
  businessLicenseIssueDate: string | number
  commercialRegisterNumber: string
  industryRegisterNumber: string
  taxCardNumber: string
}
export interface CustomerCreationStep3 {
  geographicalDistribution: string
  geoAreaId: string
  representative: string
  newRepresentative?: string
  representativeName: string
  applicationDate: number
  permanentEmployeeCount: number
  partTimeEmployeeCount: number
  comments: string
  guarantorMaxLoans: number
  maxLoansAllowed: number
  maxPrincipal: number
  allowGuarantorLoan: boolean
  principals?: {
    maxIndividualPrincipal: number
    maxGroupIndividualPrincipal: number
    maxGroupPrincipal: number
  }
}
export enum LinkageStatusEnum {
  Pending = 'pending',
  Linked = 'linked',
  Removed = 'removed',
}

export interface CheckLinkageResponse {
  status: LinkageStatusEnum
  phoneNumber: string
}

export interface ConfirmLinkageRequest {
  customerId: string
  phoneNumber: string
  customerKey: number
}
export interface CFGuarantorDetailsProps {
  customerId: string
  customerBranch: string
  guarantors: Array<Customer>
  hasLoan?: boolean
  isBlocked: boolean
  getIscore?: (data) => Promise<void>
  iscores?: Score[]
  limitStatus: string
}
export interface CFEntitledToSignDetailsProps {
  customerId: string
  customerBranch: string
  entitledToSignCustomers: Array<EntitledToSign>
  isBlocked: boolean
  getIscore?: (data) => Promise<void>
  iscores?: Score[]
  limitStatus: string
}
