import axios from '../axios-instance';

export const checkBranchNameDuplicates = async (branchName: object) => {
    const url = process.env.REACT_APP_BASE_URL + '/branch/check-branch-name';
    try {
        const res = await axios.post(url,branchName);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}