import axios from '../axios-instance';

export const getiScoreReportRequests = async () => {
    const url = process.env.REACT_APP_BASE_URL + `/report/get-iscore-generation-jobs`;
    try {
        const res = await axios.post(url);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}
export const generateiScoreReport = async () => {
    const url = process.env.REACT_APP_BASE_URL + `/report/generate-iscore-file`;
    try {
        const res = await axios.post(url);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}