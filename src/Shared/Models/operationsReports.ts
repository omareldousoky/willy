export interface CustomersArrearsRequest {
  date: string
  branches: string[]
  loanOfficers: string[]
  type?: 'sme' | 'all'
}
export interface CustomersArrearsSingleResponse {
  issueDate?: string
  loanPrincipal?: number
  installmentsCount?: number
  lateCount?: number
  lateAmount?: number
  firstLateDate?: string
  longestLatePeriod?: number
  latestPaymentDate?: string
  lateDays?: number
  installmentAmount?: number
  raseedCount?: number
  raseedAmount?: number
  lastPaidAmount?: number
  tarheelatCount?: number
  latestFullPaymentDate?: string
  representativeName?: string
  customerName?: string
  customerCode?: string
  branchName?: string
  branchCode?: number
  beneficiaryType?: 'group' | 'individual'
}

export interface CommentsReportOBJ {
  applicationFees?: string
  branchMangerName?: string
  businessActivity?: string
  businessSector?: string
  customerKey?: string
  customerName?: string
  customerNid?: string
  gracePeriod?: string
  loanKey?: string
  loanStatus?: string
  noInstallments?: string
  principal?: string
  representative?: string
}
export interface CommentsReportResponse {
  data: {
    applications: CommentsReportOBJ[]
  }
}
export interface BlockedCustomersRequest {
  branches: string[]
}

export interface CustomersArrearsResponse {
  response?: CustomersArrearsSingleResponse[]
  raseedTotalAmount?: number
  raseedTotalCount?: number
  lateTotalAmount?: number
  lateTotalCount?: number
  totalCount?: number
}

export interface InstallmentsDuePerOfficerCustomerCardRequest
  extends OperationsReportRequest {
  representatives?: string[]
}

export interface OperationsReportRequest {
  startDate: string | number
  endDate: string | number
  branches: string[]
  type?: 'sme' | 'all'
}

export interface OfficersPercentPaymentRequest extends OperationsReportRequest {
  gracePeriod?: number
  representatives?: string[]
}

export interface UnpaidInstallmentsByOfficerRequest
  extends OperationsReportRequest {
  representatives?: string[]
  creationDateFrom?: string
  creationDateTo?: string
}

export interface OfficersBranchPercentPaymentRequest
  extends OfficersPercentPaymentRequest {
  creationDateFrom?: string
  creationDateTo?: string
  type?: 'sme' | 'all'
}

export interface UnpaidInstallmentsPerAreaRequest
  extends OperationsReportRequest {
  geoAreas?: string[]
}
export interface LeakedCustomersReportRequest {
  startDate: string
  endDate: string
  branches: string[]
  loanOfficerIds?: string[]
}
export interface PaidArrearsRequest extends OperationsReportRequest {
  loanOfficerIds?: string[]
}

export interface DueInstallmentsResponse {
  response?: DueInstallmentsSingleResponse[]
  totalMostahakCustomers?: number
  totalMostahakCount?: number
  totalMostahakValue?: number
  totalMosadadCount?: number
  totalMosadadValue?: number
  totalMosadadPercent?: number
  totalMotabakyMosadadGoz2yCount?: number
  totalMotabakyMosadadGoz2yValue?: number
  totalGheerMosadadCustomers?: number
  totalGheerMosadadCount?: number
  totalGheerMosadadValue?: number
}

interface DueInstallmentsSingleResponse {
  branchName?: string
  mostahakCustomers?: number
  mostahakCount?: number
  mostahakValue?: number
  mosadadCount?: number
  mosadadValue?: number
  mosadadPercent?: number
  motabakyMosadadGoz2yCount?: number
  motabakyMosadadGoz2yValue?: number
  gheerMosadadCustomers?: number
  gheerMosadadCount?: number
  gheerMosadadValue?: number
}
export interface LeakedCustomersReportResponse {
  response: Array<LeakedCustomersPerBranch>
}

export interface PaidArrearsSingleResponse {
  branchCode?: string
  branchName?: string
  transactionCode?: string
  customerCode?: string
  customerName?: string
  installmentNumber?: number
  dueDate?: string
  installmentAmount?: number
  paymentDate?: string
  transactionAmount?: number
  lateDays?: number
  penalties?: number
  paidPenalties?: number
  representative?: string
}
export interface PaidArrearsResponse {
  response?: PaidArrearsSingleResponse[]
  totalPaidPenalties?: number
  totalTransactionAmount?: number
}
export interface LeakedCustomersPerBranch {
  branchName: string
  data: Array<LeakedCustomer>
}
export interface LeakedCustomer {
  customerCode: string
  customerName: string
  beneficiaryType: string
  homePhoneNumber: string
  mobilePhoneNumber: string
  businessPhoneNumber: string
  latestIssueDate: string
  latestPaymentDate: string
  latestIssuedPrincipal: number
  installmentsCount: number
  earlyDays: number
  workArea: string
  representative: string
  lateDays: number
  paidPenalties: number
}

interface MonthComparisonReportCommon {
  currentDueLoanCount?: number
  currentDueLoanAmount?: number
  currentPaidLoanCount?: number
  currentPaidLoanAmount?: number
  currentPaymentPercentage?: number
  previousDueLoanCount?: number
  previousDueLoanAmount?: number
  previousPaidLoanCount?: number
  previousPaidLoanAmount?: number
  previousPaymentPercentage?: number
  diffDueLoanCount?: number
  diffDueLoanAmount?: number
  diffPaidLoanCount?: number
  diffPaidLoanAmount?: number
  diffPaymentPercentage?: number
}

interface MonthComparisonReportSingleResponse
  extends MonthComparisonReportCommon {
  branchName?: string
}
export interface MonthComparisonReportResponse
  extends MonthComparisonReportCommon {
  response?: MonthComparisonReportSingleResponse[]
}

interface OfficerBranchPercentPaymentRow
  extends CommonOfficerBranchPercentPayment {
  branch: string
  walletActivePercent?: number
  walletAmountPercent?: number
}

export interface OfficerBranchPercentPaymentResponse
  extends CommonOfficerBranchPercentPayment {
  branches: Array<OfficerBranchPercentPaymentRow>
  branchesCount: number
}

interface CommonOfficerBranchPercentPayment {
  issuedLoans?: number
  principalIssuedLoans?: number
  expectedPayments?: number
  paid?: number
  paidPercentage?: number
  walletActiveLoans?: number
  walletAmount?: number
  periodCollections?: number
}
interface LoansBriefRow {
  individualLoansCount?: number
  individualLoansCredit?: number
  groupLoansCount?: number
  groupLoansCredit?: number
  loansTotal?: number
  loansTotalAmount?: number
  individualRequestsCount?: number
  individualRequestsCredit?: number
  groupRequestsCount?: number
  groupRequestsCredit?: number
  requestsTotalCount?: number
  requestsTotalAmount?: number
}

export interface BranchBrief extends LoansBriefRow {
  branchName: string
}

export interface LoansBriefingReportResponse extends LoansBriefRow {
  branchBriefing: BranchBrief[]
}

interface CommonOfficerPercentPayment {
  issuedCount?: number
  issuedAmount?: number
  firstMonth?: number
  secondMonth?: number
  thirdMonth?: number
  expectedPayments?: number
  paid?: number
  paidPercent?: number
  walletCount?: number
  walletAmount?: number
  collections?: number
}

export interface OfficerPercentPaymentRow extends CommonOfficerPercentPayment {
  officerName: string
  hiringDate: string
}

export type OfficerPercentPaymentTotalRow = CommonOfficerPercentPayment
export interface OfficerPercentPaymentBranch {
  branchName: string
  activeOfficers?: Array<OfficerPercentPaymentRow>
  inactiveOfficers?: Array<OfficerPercentPaymentRow>
  inactiveOfficersTotal?: OfficerPercentPaymentTotalRow
  activeOfficersTotal?: OfficerPercentPaymentTotalRow
  total?: OfficerPercentPaymentTotalRow
}

export interface OfficerPercentPaymentResponse {
  response: Array<OfficerPercentPaymentBranch>
  total?: OfficerPercentPaymentTotalRow
}
