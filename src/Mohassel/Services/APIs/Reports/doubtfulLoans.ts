import axios from "../axios-instance";

export const doubtfulLoans = async (data) => {
  const url = process.env.REACT_APP_BASE_URL + `/report/write-offs`;
  try {
    const res = await axios({
      method: "POST",
      url,
      data,
    });
    return { status: "success", body: res.data };
  } catch (error) {
    return { status: "error", error: error.response.data };
  }
};
