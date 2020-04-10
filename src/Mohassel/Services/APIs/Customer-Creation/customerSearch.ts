import axios from '../axios-instance';

export const searchCustomer = async (obj) => {
    const url = process.env.REACT_APP_BASE_URL + `/search/customer`;
    try {
        const res = await axios.post(url,obj);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}