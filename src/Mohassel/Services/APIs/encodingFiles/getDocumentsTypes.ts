import axios from '../axios-instance';

export const getDocumentsTypes = async (type?: string, hidden?: boolean) => {
    let url = process.env.REACT_APP_BASE_URL + `/config/document-type`;
    type? url = `${url}?type=${type}` : url;
    hidden? url = `${url}${type? '&' : '?'}hidden=${hidden}`: url;
    try {
        const res = await axios.get(url);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}