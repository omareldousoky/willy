import axios from '../axios-instance';

interface FinancialClosingObj {
    closeDate: number;
}
export const financialClosing = async (data: FinancialClosingObj) => {
    const url = process.env.REACT_APP_BASE_URL + '/application/financial-close';
    try {
        const res = await axios.post(url, data);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}