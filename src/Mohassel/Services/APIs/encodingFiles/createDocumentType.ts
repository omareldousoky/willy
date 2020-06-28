import axios from '../axios-instance';

export const createDocumentsType = async (data: any) => {
    const url = process.env.REACT_APP_BASE_URL + "/config/document-type";
    try {
        const res = await axios.post(url,data);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}