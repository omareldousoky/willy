import axios from '../axios-instance';
interface ChangeFundObj {
    endDate: number;
}
export const monthlyReport = async () => {
    const url = process.env.REACT_APP_BASE_URL + '/report/monthly-report';
    try {
        const res = await axios.post(url);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}