import axios from '../axios-instance';

export const checkUsernameDuplicates = async (username: string) => {
    const url = process.env.REACT_APP_BASE_URL + `/user/checkNID?username=${username}`;
    try {
        const res = await axios.get(url);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}