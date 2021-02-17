import { AxiosResponse } from "axios";
import { OperationsReportRequest } from "../../interfaces";
import axios from "../axios-instance";

const { REACT_APP_BASE_URL } = process.env;
const fetchUnpaidInstallmentsPerAreaUrl = `${REACT_APP_BASE_URL}/report/unpaid-installments-per-area`;

interface CustomersResponse {
  address: string;
  amountDue: number;
  customerName: string;
  installmentAmount: number;
  installmentSerial: string;
  installmentStatus: string;
  phone: string;
  representativeName: string;
  truthDate: string;
}

interface AreaResponse {
  amount: number;
  count: number;
  name: string;
  customers: Array<CustomersResponse>;
}
interface BranchResponse {
  amount: number;
  count: number;
  name: string;
  areas: Array<AreaResponse>;
}

export interface UnpaidInstallmentsPerAreaResponse {
  branches: Array<BranchResponse>;
  amount: number;
  count: number;
}

// TODO: move out to common file
export interface ApiResponse<T> {
  status: "success" | "error";
  body?: T;
  error?: unknown;
}

export const fetchUnpaidInstallmentsPerAreaReport = async (
  request: OperationsReportRequest
): Promise<ApiResponse<UnpaidInstallmentsPerAreaResponse>> => {
  try {
    const res: AxiosResponse<UnpaidInstallmentsPerAreaResponse> = await axios.post(
      fetchUnpaidInstallmentsPerAreaUrl,
      request
    );
    return { status: "success", body: res.data };
  } catch (error) {
    return { status: "error", error: error.response.data };
  }
};
