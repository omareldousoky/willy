import axios from '../axios-instance';

export const updateLoanUsage = async (id: string, name: string) => {
    const url = process.env.REACT_APP_BASE_URL + `application/usage/${id}`;
    try {
        const res = await axios.put(url, { name: name });
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}