import { AxiosResponse } from "axios";
import {
  ApiResponse,
  DueInstallmentsResponse,
  OperationsReportRequest,
} from "../../interfaces";
import axios from "../axios-instance";

const { REACT_APP_BASE_URL } = process.env;
const fetchDueInstallments = `${REACT_APP_BASE_URL}/report/due-installments`;

export const fetchDueInstallmentsReport = async (
  request: OperationsReportRequest
): Promise<ApiResponse<DueInstallmentsResponse>> => {
  try {
    const res: AxiosResponse<DueInstallmentsResponse> = await axios.post(
      fetchDueInstallments,
      request
    );
    return { status: "success", body: res.data };
  } catch (error) {
    return { status: "error", error: error.response.data };
  }
};
