import axios from '../axios-instance';

export const assignProductToBranchAPI = async (data: object) => {
    const url = process.env.REACT_APP_BASE_URL + `/branch/assign-to-product`;
    try {
        const res = await axios.post(url, data);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}