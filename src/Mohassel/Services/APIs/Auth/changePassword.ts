import axios from '../axios-instance';

export const changePassword = async (data) => {
    const url = process.env.REACT_APP_BASE_URL + '/user/change-pasword';
    try{
        const res = await axios.post(url, data);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}