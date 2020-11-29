import axios from '../axios-instance';

export const getCreatedLoanList = async (obj) => {
    const url = process.env.REACT_APP_BASE_URL + `/report/loans-created`;
    try {
        const res = await axios.post(url, obj);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}
export const postCreatedLoansExcel = async (obj) => {
    const url = process.env.REACT_APP_BASE_URL + `/report/excel/loans-created`;
    try {
        const res = await axios.post(url, obj);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
  }
  export const getCreatedLoansExcel = async (id) => {
    const url = process.env.REACT_APP_BASE_URL + `/report/excel/loans-created/${id}`;
    try {
        const res = await axios.get(url);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
  }