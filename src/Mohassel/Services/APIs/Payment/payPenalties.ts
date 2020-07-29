import axios from "../axios-instance";

export const payPenalties = async ({ id, data }) => {
  const url = process.env.REACT_APP_BASE_URL + `/loan/pay-penalties/${id}`;
  try {
    const res = await axios({ method: "PUT", url, data });
    return { status: "success", body: res.data };
  } catch (error) {
    return { status: "error", error: error.response.data };
  }
};
