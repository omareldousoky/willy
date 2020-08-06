import axios from "../axios-instance";

export const guaranteed = async (guarantorId: number) => {
  const url = process.env.REACT_APP_BASE_URL + `/report/guaranteed`;
  try {
    const res = await axios({
      method: "POST",
      url,
      data: { guarantorId: guarantorId.toString() },
    });
    return { status: "success", body: res.data };
  } catch (error) {
    return { status: "error", error: error.response.data };
  }
};
