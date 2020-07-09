import axios from '../axios-instance';

export const testCalculateApplication = async (id: string, creationDate: number) => {
    const url = process.env.REACT_APP_BASE_URL + `/application/test-calculate-application/${id}`;
    try {
        const res = await axios.put(url, {creationDate: creationDate});
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}