import axios from '../axios-instance';

export const getProduct = async (productId: string) => {
    const url = process.env.REACT_APP_BASE_URL + `/product/loan-product/${productId}`;
    try {
        const res = await axios.get(url);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}
export const getProducts = async () => {
    const url = process.env.REACT_APP_BASE_URL + '/product/loan-product';
    try {
        const res = await axios.get(url);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}