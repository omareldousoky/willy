import axios from '../axios-instance';

export const createProduct = async (data: object) => {
    const url = process.env.REACT_APP_BASE_URL + `/product/loan-product`;
    try {
        const res = await axios.post(url, data);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}