import { AxiosResponse } from "axios";
import axios from "../axios-instance";

const { REACT_APP_BASE_URL } = process.env;
const fetchActiveWalletIndividualUrl = `${REACT_APP_BASE_URL}/report/individual-active-wallets`;

export interface ActiveWalletRequest {
  date: string;
  branches?: Array<string>;
  loanOfficerIds?: Array<string>;
}

export interface ActiveWalletIndividualResponse {
  count: number;
}

// TODO: move out to common file
export interface ApiResponse<T> {
  status: "success" | "error";
  body?: T;
  error?: unknown;
}

export const fetchActiveWalletIndividual = async (
  request: ActiveWalletRequest
): Promise<ApiResponse<ActiveWalletIndividualResponse>> => {
  try {
    const res: AxiosResponse<ActiveWalletIndividualResponse> = await axios.post(
      fetchActiveWalletIndividualUrl,
      request
    );
    return { status: "success", body: res.data };
  } catch (error) {
    return { status: "error", error: error.response.data };
  }
};
