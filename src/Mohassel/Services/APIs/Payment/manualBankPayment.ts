
import axios from '../axios-instance';

export const manualBankPayment = async (obj, id) => {
    const url = process.env.REACT_APP_BASE_URL + `/loan/pay-bank-installment/${id}`;
    try {
        const res = await axios.put(url, obj);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}