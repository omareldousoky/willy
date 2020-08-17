import axios from '../axios-instance';

export const issueLoan = async (id: string, issueDate: number, fieldManagerId: string) => {
    const url = process.env.REACT_APP_BASE_URL + `/application/issue/${id}`;
    try {
        const res = await axios.put(url, { issueDate: issueDate, fieldManagerId: fieldManagerId });
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}