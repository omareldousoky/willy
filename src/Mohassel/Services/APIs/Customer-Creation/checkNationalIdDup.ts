import axios from '../axios-instance';

export const checkDuplicates = async (key: string , value: string) => {
    const url = process.env.REACT_APP_BASE_URL + `/customer/checkNID?${key}=${value}`;
    try {
        const res = await axios.get(url);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}