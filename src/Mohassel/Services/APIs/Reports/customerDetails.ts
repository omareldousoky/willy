import axios from '../axios-instance';

export const getCustomerDetails = async (id: string) => {
    const url = process.env.REACT_APP_BASE_URL + `/report/customer-details/${id}`;
    try {
        const res = await axios.get(url);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}