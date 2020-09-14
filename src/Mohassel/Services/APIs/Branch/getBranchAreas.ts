import axios from '../axios-instance';

export const getAreasByBranch = async (branchid: string) => {
    const url = process.env.REACT_APP_BASE_URL + `/config/branch-areas/${branchid}`;
    try {
        const res = await axios.get(url);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}