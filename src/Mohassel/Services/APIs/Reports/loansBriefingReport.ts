import { AxiosResponse } from "axios";
import axios from "../axios-instance";

const { REACT_APP_BASE_URL } = process.env;
const fetchLoansBriefingReportUrl = `${REACT_APP_BASE_URL}/report/loans-briefing-report`;

export interface LoansBriefingReportRequest {
    startDate: string;
    endDate: string;
	branches: string[];
}

interface LoansBriefStats {
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

interface BranchBrief extends LoansBriefStats {
    branchName: string;
}

export interface LoansBriefingReportResponse extends LoansBriefStats {
    branchBriefing: BranchBrief[];
}

// TODO: move out to common file
export interface ApiResponse<T> {
    status: "success" | "error";
    body?: T;
    error?: unknown;
}

export const fetchLoansBriefingReport = async (
    request: LoansBriefingReportRequest
): Promise<ApiResponse<LoansBriefingReportResponse>> => {
    try {
        const res: AxiosResponse<LoansBriefingReportResponse> = await axios.post(
            fetchLoansBriefingReportUrl,
            request
        );
        return { status: "success", body: res.data };
    } catch (error) {
        return { status: "error", error: error.response.data };
    }
};
