import axios from '../axios-instance';
import { string } from 'yup';

export const getDocumentsTypes = async (type?: string) => {
    let url = process.env.REACT_APP_BASE_URL + "/config/document-type";
    type? url = `${url}?type=${type}` : null;
    try {
        const res = await axios.get(url);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}