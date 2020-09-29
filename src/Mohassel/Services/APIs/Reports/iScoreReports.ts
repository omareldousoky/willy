import axios from '../axios-instance';

export const getiScoreReportRequests = async () => {
    const url = process.env.REACT_APP_BASE_URL + `/report/iscore-files`;
    try {
        const res = await axios.get(url);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}
export const generateiScoreReport = async () => {
    const url = process.env.REACT_APP_BASE_URL + `/report/create-iscore-file`;
    try {
        const res = await axios.post(url);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}
export const getiScoreReport = async (id: string) => {
    const url = process.env.REACT_APP_BASE_URL + `/report/download-iscore-file/${id}`;
    try {
        const res = await axios.get(url);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}