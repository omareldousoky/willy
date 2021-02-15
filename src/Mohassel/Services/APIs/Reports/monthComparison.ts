import { AxiosResponse } from "axios";
import {
  ApiResponse,
  MonthComparisonReportResponse,
  OperationsReportRequest,
} from "../../interfaces";
import axios from "../axios-instance";

const { REACT_APP_BASE_URL } = process.env;
const fetchMonthComparison = `${REACT_APP_BASE_URL}/report/month-comparison`;

export const fetchMonthComparisonReport = async (
  request: Omit<OperationsReportRequest, "branches">
): Promise<ApiResponse<MonthComparisonReportResponse>> => {
  try {
    const res: AxiosResponse<MonthComparisonReportResponse> = await axios.post(
      fetchMonthComparison,
      request
    );
    return { status: "success", body: res.data };
  } catch (error) {
    return { status: "error", error: error.response.data };
  }
};
