import axios from '../axios-instance';

export const getRoles = async () => {
    const url = process.env.REACT_APP_BASE_URL + `/user/role/actions?id=requireBanch`;
    try {
        const res = await axios.get(url);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}