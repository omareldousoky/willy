import axios from '../axios-instance';

export const bulkReview = async (data: object) => {
    const url = process.env.REACT_APP_BASE_URL + `/application/bulk-other-review`;
    try {
        const res = await axios.put(url, data);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}