import { AxiosResponse } from "axios";
import { ApiResponse } from "../../interfaces";
import axios from "../axios-instance";

interface CustomerCategorizationRequest {
  customerId: string;
}
export interface CustomerScore {
  loanApplicationKey: number;
  customerScore: number;
}
export interface CustomerCategorizationResponse {
  customerScores: Array<CustomerScore>;
}
const { REACT_APP_BASE_URL } = process.env;
const customerCategorizationURL = `${REACT_APP_BASE_URL}/customer/categorization/`;

export const getCustomerCategorization = async (
  request: CustomerCategorizationRequest
): Promise<ApiResponse<CustomerCategorizationResponse>> => {
  try {
    const res: AxiosResponse<CustomerCategorizationResponse> = await axios.get(
      customerCategorizationURL + request.customerId
    );
    return { status: "success", body: res.data };
  } catch (error) {
    return { status: "error", error: error.response.data };
  }
};