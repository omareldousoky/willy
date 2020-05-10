import axios from '../axios-instance';

export const searchLoanOfficer = async (data: object) => {
    const url = process.env.REACT_APP_BASE_URL + `/search/loan-officer`;
    try {
        const res = await axios.post(url, data);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}