import { AxiosResponse } from "axios";
import {
  ApiResponse,
  OperationsReportRequest,
  PaidArrearsResponse,
} from "../../interfaces";
import axios from "../axios-instance";

const { REACT_APP_BASE_URL } = process.env;
const fetchPaidArrears = `${REACT_APP_BASE_URL}/report/paid-arrears`;

export const fetchPaidArrearsReport = async (
  request: OperationsReportRequest
): Promise<ApiResponse<PaidArrearsResponse>> => {
  try {
    const res: AxiosResponse<PaidArrearsResponse> = await axios.post(
      fetchPaidArrears,
      request
    );
    return { status: "success", body: res.data };
  } catch (error) {
    return { status: "error", error: error.response.data };
  }
};
