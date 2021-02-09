import { UnpaidInstallmentsByOfficerRequest } from "../../interfaces";
import axios from "../axios-instance";

export const unpaidInstallmentsByOfficer = async (
  request: UnpaidInstallmentsByOfficerRequest
) => {
  const url =
    process.env.REACT_APP_BASE_URL + `/report/unpaid-installments-by-officer`;
  try {
    const res = await axios.post(url, request);
    return { status: "success", body: res.data };
  } catch (error) {
    return { status: "error", error: error.response.data };
  }
};
