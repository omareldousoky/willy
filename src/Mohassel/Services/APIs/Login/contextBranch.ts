import axios from '../axios-instance';

export const contextBranch = async (branchId: string) => {
    const url = process.env.REACT_APP_BASE_URL + `/auth/context-branch/${branchId}`;
    try {
        const res = await axios.put(url);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}