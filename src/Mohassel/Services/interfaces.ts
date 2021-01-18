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

export interface OfficerPercentPaymentRow {
    officerName: string;
    hiringDate: string;
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

export interface OfficerPercentPaymentBranch {
    branchName: string;
    activeOfficers?: Array<OfficerPercentPaymentRow>;
    inactiveOfficers?: Array<OfficerPercentPaymentRow>;
}

export interface OfficerPercentPaymentResponse {
    response: Array<OfficerPercentPaymentBranch>;
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
