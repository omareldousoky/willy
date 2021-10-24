import { Signature } from '../Models/common'
import { Customer } from '../Models/Customer'

export interface Branch {
  longitude?: number
  latitude?: number
  name: string
  governorate: string
  status?: string
  phoneNumber?: string
  faxNumber?: string
  address?: string
  postalCode?: string
  licenseDate: number | string
  bankAccount: string
  costCenter: string
  licenseNumber: string
  _id?: string
}

export interface Company extends Customer {
  legalConstitution: string
  smeCategory: string
  cbeCode: string
  paidCapital: number
  establishmentDate: number
  smeSourceId?: string
  smeBankName: string
  smeBankBranch: string
  smeBankAccountNumber: string
  smeIbanNumber: string
}
export interface Installment {
  id: number
  installmentResponse: number
  principalInstallment: number
  feesInstallment: number
  totalPaid: number
  principalPaid: number
  feesPaid: number
  dateOfPayment: number
  status: string
  earlyPaymentReschedule?: boolean
  paidAt?: number
  pendingFees?: number
  pendingPrincipal?: number
  writtenOff?: boolean
}
export interface TotalInstallments {
  feesSum?: number
  installmentSum?: number
  principal?: number
}
export interface PenaltyPolicy {
  beneficiaryType?: string
  checkAgainst?: string
  exemptedDays?: number
  instantFee?: number
  legacyExpiryDate?: number
  penaltyFormula?: []
  productType?: string
  startDate?: number
  _id?: string
}
export interface Vice {
  name: string
  phoneNumber: string
  nationalId?: string
  nationalIdIssueDate?: string | any
  jobTitle?: string
  address?: string
}
export interface Aging {
  fee?: number
  from?: number
  to?: number
}
export interface CalculationFormula {
  equalInstallments?: boolean
  gracePeriodFees?: boolean
  installmentType?: string
  interestType?: string
  name: string
  roundDirection?: string
  roundLastInstallment?: boolean
  roundTo?: number
  roundWhat?: string
  _id: string
}
export interface Product {
  adminFees: number
  allocatedDebtForGoodLoans: number
  aging?: Aging[]
  allowAdminFeesAdjustment?: boolean
  allowApplicationFeeAdjustment?: boolean
  allowInterestAdjustment?: boolean
  allowRepresentativeFeesAdjustment?: boolean
  allowStampsAdjustment?: boolean
  applicationFee?: number
  applicationFeePercent?: number
  applicationFeePercentPerPerson?: number
  applicationFeePercentPerPersonType?: string
  applicationFeeType: string
  beneficiaryType: 'individual' | 'group'
  branchManagerAndDate?: boolean
  calculationFormula?: CalculationFormula
  code: number
  currency?: string
  deductionFee?: number
  earlyPaymentFees?: number
  enabled?: boolean
  gracePeriod?: number
  guarantorGuaranteesMultiple?: boolean
  inAdvanceFees?: number
  inAdvanceFrom?: string
  inAdvanceType?: string
  individualApplicationFee?: number
  interest?: number
  interestPeriod?: string
  lateDays?: number
  loanImpactPrincipal?: boolean
  loanNature?: string
  maxInstallment?: number
  maxNoOfRestructuring?: number
  maxPrincipal?: number
  mergeDoubtedLoans?: boolean
  mergeDoubtedLoansFees?: number
  mergeUndoubtedLoans?: boolean
  mergeUndoubtedLoansFees?: number
  migratedAt?: number
  minInstallment?: number
  minPrincipal?: number
  mustEnterGuarantor?: boolean
  noOfGuarantors?: number
  noOfInstallments?: number
  periodLength?: number
  periodType?: string
  productName: string
  pushDays?: any[]
  pushHolidays?: string
  pushPayment?: number
  representativeFees?: number
  reviewerChiefAndDate?: boolean
  spreadApplicationFee?: boolean
  stamps?: number
  type?: string
  viceFieldManagerAndDate?: boolean
  _id: string
}
export interface Application {
  applicationCode?: number
  applicationFeesPaid?: number
  applicationFeesRequired?: number
  applicationKey: number
  approvalDate?: number
  branchId?: string
  branchManagerId: string
  branchManagerName?: string
  created?: Signature
  creationDate: number
  customer?: Customer | Company
  earlyPaymentAmount?: number
  enquirerName?: string
  enquirorId?: string
  entitledToSign?: {
    customer: Customer
    position: string
  }[]
  entryDate: number
  fundSource?: string
  group?: {
    individualsInGroup?: any
    _id?: string
  }
  guarantors: Customer[]
  installmentsObject?: {
    installments?: Installment[]
    totalInstallments?: TotalInstallments
  }
  issueDate?: number
  lastDoubtedAt?: number
  loanApplicationCode?: number
  loanApplicationKey?: number
  loanApplicationKeyFormated?: string
  managerVisitDate?: number
  noOfRestructuring?: number
  penaltiesCanceled?: number
  penaltiesPaid?: number
  penaltyPolicy?: PenaltyPolicy
  principal: number
  product?: Product
  rejectionDate?: number
  rejectionReason?: string
  representativeFeesPaid?: number
  representativeId?: string
  rescheduled?: {}
  researcherId?: string
  researcherName?: string
  reviewedDate?: number
  stampsPaid?: number
  status?: string
  thirdReviewDate?: number
  undoReviewDate?: number
  updated?: any
  usage?: string
  viceCustomers?: Vice[]
  visitationDate?: number
  writeOffAt?: number
  _id: string
}
export interface Action {
  loanBranchId: string
  action: string
  actualDate: number
  groupID: string
  installmentSerial: number
  loanId: string
  officer: string
  transactionAmount: number
  truthDate: number
  _id: string
}
export interface PendingActions {
  receiptNumber?: string
  transactions?: Array<Action>
  beneficiaryId?: string
  payerId?: string
  payerNationalId?: string
  payerType?: string
  payerName?: string
  _id?: string
}

export interface DocumentType {
  id?: string
  pages: number
  type: string
  customerType: string
  paperType: string
  name: string
  active?: boolean
  updatable?: boolean
  isHidden?: boolean
}
export interface GuaranteedLoan {
  guarantorOrder: string
  customerKey: string
  applicationCode: string
  customerName: string
  appStatus?: string
  approvalDate?: string
  loanStatus?: string
  issueDate?: string
}
export interface GuaranteedLoans {
  data: Array<GuaranteedLoan>
  GuarantorName: string
}

export interface Document {
  key: string
  url: string | ArrayBuffer | null
  valid: boolean
  delete?: boolean
  selected?: boolean
  file?: File
}

export interface LoanOfficer {
  birthDate: number
  branches: Array<string>
  gender: string
  hrCode: string
  mainBranchId: string
  mainRoleId: string
  name: string
  nationalId: string
  roles: Array<string>
  status: string
  username: string
  _id: string
}
export interface Clearance {
  _id: string
  bankName: string
  beneficiaryType: string
  branchId: string
  branchName: string
  clearanceReason: string
  customerId: string
  customerKey: string
  customerName: string
  customerNationalId: number
  documentPhotoURL: string
  issuedDate: number | string
  lastPaidInstDate: number
  loanId: string
  loanKey: number
  notes: string
  principal: number
  receiptDate: number
  receiptPhotoURL: string
  registrationDate: number
  status: string
  transactionKey?: number
  manualReceipt?: string
}

export interface QuarterReport {
  fundingWalletTrends: {
    individualAverageLoan: number
    individualAverageWallet: number
    groupAverageLoan: number
    groupAverageWallet: number
    averageDaysToFinishIndividualLoans: number
    averageDaysToFinishGroupLoans: number
    collectionExpectations1To30: number
    collectionExpectations31To90: number
    collectionExpectations91To180: number
    collectionExpectations181To270: number
    collectionExpectations271To365: number
    collectionExpectationsAfterYear: number
    walletGrowthRate: number
  }
  fundingWalletQuality: {
    writtenOffLoansRate: number
    riskCoverageRate: number
    committedCustomersWalletRate: number
    lateCustomersWalletTo30DaysRate: number
    lateCustomersWalletTo60DaysRate: number
    lateCustomersWalletTo90DaysRate: number
    lateCustomersWalletTo120DaysRate: number
    lateCustomersWalletAfter120DaysRate: number
    carryOverInstallmentsCustomersWalletRate: number
    rescheduledCustomerWalletRate: number
  }
  fromDate: string
  toDate: string
  createdAt: string
}

export interface MonthReport {
  totalIndividualCount: {
    onGoingCutomer: number
    newCustomer: number
    total: number
  }
  maleIndividualCount: {
    onGoingCutomer: number
    newCustomer: number
    total: number
  }
  femaleIndividualCount: {
    onGoingCutomer: number
    newCustomer: number
    total: number
  }
  totalIndividualCredit: {
    onGoingCutomer: number
    newCustomer: number
    total: number
  }
  maleIndividualCredit: {
    onGoingCutomer: number
    newCustomer: number
    total: number
  }
  femaleIndividualCredit: {
    onGoingCutomer: number
    newCustomer: number
    total: number
  }
  totalGroupCount: {
    onGoingCutomer: number
    newCustomer: number
    total: number
  }
  maleGroupCount: {
    onGoingCutomer: number
    newCustomer: number
    total: number
  }
  femaleGroupCount: {
    onGoingCutomer: number
    newCustomer: number
    total: number
  }
  totalGroupCredit: {
    onGoingCutomer: number
    newCustomer: number
    total: number
  }
  maleGroupCredit: {
    onGoingCutomer: number
    newCustomer: number
    total: number
  }
  femaleGroupCredit: {
    onGoingCutomer: number
    newCustomer: number
    total: number
  }
  totalCredit: number
  totalCount: number
  commercialCount: number
  commercialCredit: number
  productionCount: number
  productionCredit: number
  serviceCount: number
  serviceCredit: number
  agriculturalCount: number
  agriculturalCredit: number
  individualWrittenOffLoansCount: {
    month?: number
    year: number
  }
  individualWrittenOffLoansCredit: {
    month?: number
    year: number
  }
  groupWrittenOffLoansCount: {
    month?: number
    year: number
  }
  groupWrittenOffLoansCredit: {
    month?: number
    year: number
  }
  writtenOffLoansCount: {
    month?: number
    year: number
  }
  writtenOffLoansCredit: {
    month?: number
    year: number
  }
  collectedWrittenOffLoansCount: {
    month?: number
    year: number
  }
  collectedWrittenOffLoansCredit: {
    month: number
    year: number
  }
  arrears: {
    tier: string
    customers: number
    arrears: number
    wallet: number
    provision: number
  }[]

  totalCustomers: number
  totalArrears: number
  totalWallet: number
  totalProvision: number
  fromDate: string
  toDate: string
  createdAt: string
  fundingWalletAnalysisCountValidation: string
  fundingWalletAnalysisCreditValidation: string
  arrearsCountValidation: string
  arrearsCreditValidation: string
  fundingWalletAnalysisSheetCount: number
  fundingWalletAnalysisSheetCredit: number
  arrearsSheetCount: number
  arrearsSheetCredit: number
  totalGroupLoansCount: {
    onGoingCutomer: number
    newCustomer: number
    total: number
  }
}

export type ManagerHierarchyUser = { id: string; name: string }

export interface OfficersGroup {
  id?: string
  leader: ManagerHierarchyUser
  officers: ManagerHierarchyUser[]
  status?: string
}
export interface GroupsByBranch {
  id: string
  status: string
  branchId: string
  startDate: string
  leader: {
    id: string
    name: string
  }
  officers: {
    id: string
    name: string
  }[]
}
export interface TerroristResponse {
  id: string
  name: string
  nationality: string
  nationalId: string
  birthDate: string
  created: Signature
  updated: Signature
}
export interface TerroristUnResponse {
  id: string
  name: string
  firstName: string
  secondName: string
  thirdName: string
  fourthName: string
  otherConfirmedNames: string
  otherNonConfirmedNames: string
  nationality: string
  nationalId: string
  passportId: string
  birthDate: string
  placeOfBirth: string
  serial: string
  additionalInfo: string
  insertionDate: string
  created: Signature
  updated: Signature
}

export interface IscoreAuthority {
  id: string
  code: string
  nameEnglish: string
  nameArabic: string
}
export interface CustomerApplicationTransactionsRequest {
  loanApplicationKey: string
}

export interface CustomerApplicationTransactionRow {
  transactionCode: string
  installmentSerial: string
  date: string
  action: string
  loanSerial: string
  transactionAmount: string
  currency: string
  branchName: string
  status: string
  username: string
  createdAt: string
}
export interface CustomerApplicationTransactionsResponse {
  result?: CustomerApplicationTransactionRow[]
  customer?: {
    name: string
    key: string
  }
  branch?: {
    name: string
    code: string
  }
}
