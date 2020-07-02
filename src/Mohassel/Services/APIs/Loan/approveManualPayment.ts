
import axios from '../axios-instance';

export const approveManualPayment = async (id: string) => {
    const url = process.env.REACT_APP_BASE_URL + `/loan/approve-manual-payment/${id}`;
    try {
        const res = await axios.put(url);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}