import { AxiosResponse } from "axios";
import {
  ApiResponse,
  CheckLinkageResponse,
  ConfirmLinkageRequest,
} from "../../interfaces";
import axios from "../axios-instance";

const { REACT_APP_BASE_URL } = process.env;
const checkLinkageUrl = `${REACT_APP_BASE_URL}/lead/check-linkage/:customerId`;
const confirmLinkageUrl = `${REACT_APP_BASE_URL}/lead/confirm-linkage`;

export const checkLinkage = async (
  customerID: string
): Promise<ApiResponse<CheckLinkageResponse>> => {
  try {
    const res: AxiosResponse<CheckLinkageResponse> = await axios.get(
      checkLinkageUrl.replace(":customerId", customerID)
    );
    return { status: "success", body: res.data };
  } catch (error) {
    return { status: "error", error: error.response.data };
  }
};

export const confirmLinkage = async (
  request: ConfirmLinkageRequest
): Promise<ApiResponse<unknown>> => {
  try {
    const res: AxiosResponse<CheckLinkageResponse> = await axios.post(
      confirmLinkageUrl,
      request
    );
    return { status: "success", body: res.data };
  } catch (error) {
    return { status: "error", error: error.response.data };
  }
};
