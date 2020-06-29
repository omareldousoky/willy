import axios from '../axios-instance';

export const editManualPayment = async (id: string, payAmount: number, receiptNumber: string, truthDate: number) => {
    const url = process.env.REACT_APP_BASE_URL + `/loan/edit-manual-payment/${id}`;
    try {
        const res = await axios.put(url, {payAmount: payAmount, receiptNumber: receiptNumber, truthDate: truthDate});
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}