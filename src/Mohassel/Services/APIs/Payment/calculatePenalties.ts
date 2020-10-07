import axios from "../axios-instance";

export const calculatePenalties = async ({ id, truthDate }) => {
  const url = process.env.REACT_APP_BASE_URL + `/loan/calculate-penalties/${id}`;
  try {
    const res = await axios({ method: "PUT", url, data: { truthDate } });
    return { status: "success", body: res.data };
  } catch (error) {
    return { status: "error", error: error.response.data };
  }
};
