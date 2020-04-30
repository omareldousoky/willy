import axios from '../axios-instance';

export const payInstallment = async (id: string, payAmount: number) => {
    const url = process.env.REACT_APP_BASE_URL + `/loan/pay-installment/${id}`;
    try {
        const res = await axios.put(url, {payAmount: payAmount});
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}