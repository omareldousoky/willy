export interface ApiResponse<T> {
  status: "success" | "error";
  body?: T;
  error?: unknown;
}

export interface OperationsReportRequest {
  startDate: string;
  endDate: string;
  branches: string[];
}

export interface LoanApplicationReportRequest {
  startDate: string;
  endDate: string;
  branch: string;
  loanStatus: string[];
}

interface LoansBriefRow {
  individualLoansCount?: number;
  individualLoansCredit?: number;
  groupLoansCount?: number;
  groupLoansCredit?: number;
  loansTotal?: number;
  loansTotalAmount?: number;
  individualRequestsCount?: number;
  individualRequestsCredit?: number;
  groupRequestsCount?: number;
  groupRequestsCredit?: number;
  requestsTotalCount?: number;
  requestsTotalAmount?: number;
}

export interface BranchBrief extends LoansBriefRow {
  branchName: string;
}

export interface LoansBriefingReportResponse extends LoansBriefRow {
  branchBriefing: BranchBrief[];
}

interface CommonOfficerPercentPayment {
  issuedCount?: number;
  issuedAmount?: number;
  firstMonth?: number;
  secondMonth?: number;
  thirdMonth?: number;
  expectedPayments?: number;
  paid?: number;
  paidPercent?: number;
  walletCount?: number;
  walletAmount?: number;
  collections?: number;
}

export interface OfficerPercentPaymentRow extends CommonOfficerPercentPayment {
  officerName: string;
  hiringDate: string;
}

export type OfficerPercentPaymentTotalRow = CommonOfficerPercentPayment;
export interface OfficerPercentPaymentBranch {
  branchName: string;
  activeOfficers?: Array<OfficerPercentPaymentRow>;
  inactiveOfficers?: Array<OfficerPercentPaymentRow>;
  inactiveOfficersTotal?: OfficerPercentPaymentTotalRow;
  activeOfficersTotal?: OfficerPercentPaymentTotalRow;
  total?: OfficerPercentPaymentTotalRow;
}

export interface OfficerPercentPaymentResponse {
  response: Array<OfficerPercentPaymentBranch>;
  total?: OfficerPercentPaymentTotalRow;
}

interface CommonOfficerBranchPercentPayment {
  issuedLoans?: number;
  principalIssuedLoans?: number;
  expectedPayments?: number;
  paid?: number;
  paidPercentage?: number;
  walletActiveLoans?: number;
  walletAmount?: number;
  periodCollections?: number;
}

interface OfficerBranchPercentPaymentRow
  extends CommonOfficerBranchPercentPayment {
  branch: string;
  walletActivePercent?: number;
  walletAmountPercent?: number;
}

export interface OfficerBranchPercentPaymentResponse
  extends CommonOfficerBranchPercentPayment {
  branches: Array<OfficerBranchPercentPaymentRow>;
  branchesCount: number;
}

interface DueInstallmentsSingleResponse {
  branchName?: string;
  mostahakCustomers?: number;
  mostahakCount?: number;
  mostahakValue?: number;
  mosadadCount?: number;
  mosadadValue?: number;
  mosadadPercent?: number;
  motabakyMosadadGoz2yCount?: number;
  motabakyMosadadGoz2yValue?: number;
  gheerMosadadCustomers?: number;
  gheerMosadadCount?: number;
  gheerMosadadValue?: number;
}

export interface DueInstallmentsResponse {
  response?: DueInstallmentsSingleResponse[];
  totalMostahakCustomers?: number;
  totalMostahakCount?: number;
  totalMostahakValue?: number;
  totalMosadadCount?: number;
  totalMosadadValue?: number;
  totalMosadadPercent?: number;
  totalMotabakyMosadadGoz2yCount?: number;
  totalMotabakyMosadadGoz2yValue?: number;
  totalGheerMosadadCustomers?: number;
  totalGheerMosadadCount?: number;
  totalGheerMosadadValue?: number;
}

export interface LeakedCustomersReportRequest {
    startDate: string;
    endDate: string;
    branches: string[];
}
export interface LeakedCustomersPerBranch {
    branchName: string;
    data: Array<LeakedCustomer>;
}
export interface LeakedCustomer {
    customerCode: string;
    customerName: string;
    beneficiaryType: string;
    homePhoneNumber: string;
    mobilePhoneNumber: string;
    businessPhoneNumber: string;
    latestIssueDate: string;
    latestPaymentDate: string;
    latestIssuedPrincipal: number;
    installmentsCount: number;
    earlyDays: number;
    workArea: string;
    representative: string;
    lateDays: number;
    paidPenalties: number;
}
export interface LeakedCustomersReportResponse {
    response: Array<LeakedCustomersPerBranch>;
}