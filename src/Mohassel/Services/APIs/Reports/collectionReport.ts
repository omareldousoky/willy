import axios from "../axios-instance";

export const collectionReport = async () => {
  const url = process.env.REACT_APP_BASE_URL + `/report/collection-report`;
  try {
    const res = await axios({
      method: "POST",
      url,
      data: {
        startDate: "2020-4-01",
        endDate: "2020-05-01",
        all: "0",
        branchList: [
          "5f1d9827141332f7932129ab",
          "5f1d9827141332f79321298f",
          "5f1d9827141332f79321298a",
          "5f1d9827141332f7932129a1",
          "5f1d9827141332f79321298c",
          "5f1d9827141332f793212993",
          "5f1d9827141332f79321299a",
          "5f1d9827141332f793212994",
          "5f1d9827141332f793212992",
        ],
        // "branchList": [""],
        // "branchList": ["5effe4a25ca43661b65b62f9","5effe4a25ca43661b65b62bc"]
      },
    });
    return { status: "success", body: res.data };
  } catch (error) {
    return { status: "error", error: error.response.data };
  }
};
