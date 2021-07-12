import { Signature } from './common'
import { Customer } from './Customer'

interface CalculationFormulaResponse {
  _id: string
  equalInstallments?: boolean
  gracePeriodFees?: boolean
  installmentType?: string
  interestType?: string
  name: string
  roundDirection?: string
  roundLastInstallment?: boolean
  roundTo?: number
  roundWhat?: string
}

interface AgeObject {
  from: number
  to: number
  fee: number
}

export interface LoanProductResponse {
  _id: string
  adminFees: number
  allocatedDebtForGoodLoans: number
  aging?: AgeObject[]
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
  calculationFormula?: CalculationFormulaResponse
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
}

interface ViceCustomer {
  address?: string
  name?: string
  nationalId?: string
  nationalIdIssueDate?: number
  phoneNumber?: string
  jobTitle?: string
}

export interface SingleInstallmentRow {
  id: number
  installmentResponse?: number
  principalInstallment?: number
  feesInstallment?: number
  dateOfPayment: number
  status?: string
  principalPaid?: number
  feesPaid?: number
  totalPaid?: number
  paidAt: number
  pendingFees?: number
  pendingPrincipal?: number
  writtenOff?: boolean
  rescheduledAt?: number
  rescheduledInstallmentCreationDate?: number
  earlyPaymentReschedule?: boolean
}

interface TotalInstallmentsResponse {
  feesSum?: number
  installmentSum?: number
  principal?: number
}

export interface InstallmentsResponse {
  installments: SingleInstallmentRow[]
  totalInstallments: TotalInstallmentsResponse
}

interface PenaltyFormulaPart {
  min?: number
  cost?: number
}

interface PenaltyPolicy {
  penaltyFormula?: PenaltyFormulaPart[]
  startDate?: number
  exemptedDays?: number
  id?: string
  instantFee?: number
  beneficiaryType?: string
  checkAgainst?: string
  productType?: string
}

interface IndividualInGroup {
  type: string
  amount?: number
  customer: Customer
  penaltiesPaid?: number
  penaltiesCanceled?: number
}

interface Group {
  individualsInGroup: IndividualInGroup[]
  _id?: string
}

export interface ApplicationResponse {
  _id: string
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
  customer?: Customer
  earlyPaymentAmount?: number
  enquirerName?: string
  enquirorId?: string
  entitledToSign?: Customer[]
  entryDate: number
  fundSource?: string
  group?: Group
  guarantors: Customer[]
  installmentsObject?: InstallmentsResponse
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
  product?: LoanProductResponse
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
  viceCustomers?: ViceCustomer[]
  visitationDate?: number
  writeOffAt?: number
}
