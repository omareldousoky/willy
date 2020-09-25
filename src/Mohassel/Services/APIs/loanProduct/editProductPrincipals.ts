import axios from '../axios-instance';

export const editProductsPrincipals = async (id: string,data: object) => {
    const url = process.env.REACT_APP_BASE_URL + `/product/loan-product-principal/${id}`;
    try {
        const res = await axios.put(url, data);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}