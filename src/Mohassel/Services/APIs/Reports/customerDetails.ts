import axios from '../axios-instance';

export const getCustomerDetails = async (customerKey: string) => {
    const url = process.env.REACT_APP_BASE_URL + `/report/customer-details/${customerKey}`;
    try {
        const res = await axios.get(url);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}