
import axios from '../axios-instance';

export const manualPayment = async (id: string, payAmount: number, receiptNumber: string, truthDate: number, byInsurance: boolean) => {
    const url = process.env.REACT_APP_BASE_URL + `/loan/manual-payment/${id}`;
    try {
        const res = await axios.put(url, {payAmount: payAmount, receiptNumber: receiptNumber, truthDate: truthDate, byInsurance: byInsurance});
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}