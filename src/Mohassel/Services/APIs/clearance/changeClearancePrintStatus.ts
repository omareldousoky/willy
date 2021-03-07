import axios from '../axios-instance';

export interface ChangeClearancePrintStatusRequest {
  ids: Array<string>;
}

export const changeClearancePrintStatus = async (data: ChangeClearancePrintStatusRequest) => {
  const url = process.env.REACT_APP_BASE_URL + `/application/change-clearance-print`;
  try {
    const res = await axios.post(url, data);
    return { status: "success", body: res.data }
  }
  catch (error) {
    return { status: "error", error: error.response.data }
  }
}