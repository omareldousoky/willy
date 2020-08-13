import axios from "../axios-instance";

export const writeOffs = async () => {
  const url = process.env.REACT_APP_BASE_URL + `/report/write-offs`;
  try {
    const res = await axios({
      method: "POST",
      url,
      data: {
        "startDate": "2020-02-01",
        "endDate": "2020-02-15",
        all: "1",
        branchList: [],
      },
    });
    return { status: "success", body: res.data };
  } catch (error) {
    return { status: "error", error: error.response.data };
  }
};
