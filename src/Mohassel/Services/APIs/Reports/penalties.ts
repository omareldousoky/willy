import axios from "../axios-instance";

export const penalties = async (data) => {
  const url = process.env.REACT_APP_BASE_URL + `/report/penalties`;
  try {
    const res = await axios({
      method: "POST",
      url,
      data
    });
    return { status: "success", body: res.data };
  } catch (error) {
    return { status: "error", error: error.response.data };
  }
};
