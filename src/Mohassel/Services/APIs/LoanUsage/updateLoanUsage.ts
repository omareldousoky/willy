import axios from '../axios-instance';

export const updateLoanUsage = async (id: string, name: string, activated: boolean) => {
    const url = process.env.REACT_APP_BASE_URL + `/config/usage/${id}`;
    try {
        const res = await axios.put(url, { name: name, activated: activated });
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}