import axios from "../axios-instance";

export const collectionReport = async () => {
  const url = process.env.REACT_APP_BASE_URL + `/report/collection-report`;
  try {
    const res = await axios({
      method: "POST",
      url,
      data: {
        "startDate": "20200601",
        "endDate": "20200705",
        "all": "0",
        "branchList": ["5effe4a25ca43661b65b62f9","5effe4a25ca43661b65b62bc"]
      },
    });
    return { status: "success", body: res.data };
  } catch (error) {
    return { status: "error", error: error.response.data };
  }
};
