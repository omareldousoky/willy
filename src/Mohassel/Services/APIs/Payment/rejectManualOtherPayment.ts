import axios from '../axios-instance';

export const rejectManualOtherPayment = async (id: string) => {
    const url = process.env.REACT_APP_BASE_URL + `/loan/reject-manual-other-payment`;
    try {
        const res = await axios.put(url, {id: id});
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}