import axios from '../axios-instance';

export const payFutureInstallment = async (id: string, payAmount: number, truthDate: number, installmentNumber: number) => {
    const url = process.env.REACT_APP_BASE_URL + `/loan/pay-future-installment/${id}`;
    try {
        const res = await axios.put(url, {payAmount: payAmount, truthDate: truthDate, installmentNumber: installmentNumber});
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}