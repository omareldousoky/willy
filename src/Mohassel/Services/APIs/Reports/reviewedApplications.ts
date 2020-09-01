import axios from '../axios-instance';

export const getReviewedApplications = async () => {
    const url = process.env.REACT_APP_BASE_URL + `/report/loans-reviewed`;
    try {
        const res = await axios.post(url);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}