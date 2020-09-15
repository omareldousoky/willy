import axios from '../axios-instance';

export const checkHRCodeDuplicates = async (hrCode: string) => {
    const url = process.env.REACT_APP_BASE_URL + `/user/checkHRCode?hrCode=${hrCode}`;
    try {
        const res = await axios.get(url);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}