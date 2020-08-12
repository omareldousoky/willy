import axios from "../axios-instance";

export const writeOffs = async () => {
  const url = process.env.REACT_APP_BASE_URL + `/report/write-offs`;
  try {
    const res = await axios({
      method: "POST",
      url,
      data: { 
        "startDate": "2020-03-01",
        "endDate": "2020-07-1",
        all: "a",
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
        ]
       },
    });
    return { status: "success", body: res.data };
  } catch (error) {
    return { status: "error", error: error.response.data };
  }
};
