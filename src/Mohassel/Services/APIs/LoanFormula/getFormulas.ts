import axios from '../axios-instance';

export const getFormulas = async () => {
    const url = process.env.REACT_APP_BASE_URL + '/product/calculation-formula';
    try {
        const res = await axios.get(url);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}