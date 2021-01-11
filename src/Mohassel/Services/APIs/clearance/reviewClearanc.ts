import axios from '../axios-instance';

export const reviewClearance = async (id: string,data: object) => {
    const url = process.env.REACT_APP_BASE_URL + `/application/review-clearance/${id}`;
    try{
        const res = await axios.post(url,data);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}