import axios from "../axios-instance";

export const penalties = async () => {
  const url = process.env.REACT_APP_BASE_URL + `/report/penalties`;
  try {
    const res = await axios({
      method: "POST",
      url,
      data: { 
        "startDate": "2020-05-02",
        "endDate": "2020-07-02"
      },
    });
    console.log('response', res);
    
    return { status: "success", body: res.data };
  } catch (error) {
    return { status: "error", error: error.response.data };
  }
};
