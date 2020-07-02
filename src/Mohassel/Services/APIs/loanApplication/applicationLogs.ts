import axios from '../axios-instance';

export const getApplicationLogs = async (applicationId: string) => {
    const url = process.env.REACT_APP_BASE_URL + `/logs/loan/${applicationId}`;
    try {
        const res = await axios.get(url);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}