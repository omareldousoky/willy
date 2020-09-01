import axios from '../axios-instance';

interface ChangeFundObj {
    startDate: number;
    endDate: number;
}
export const cibPaymentReport = async (data: ChangeFundObj) => {
    const url = process.env.REACT_APP_BASE_URL + `/report/cib-payments`;
    try {
        const res = await axios.post(url, data);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}