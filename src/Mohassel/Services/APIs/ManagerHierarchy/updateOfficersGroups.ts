import axios from '../axios-instance';

export const updateOfficersGroups = async (data: object,id: string) => {
    const url = process.env.REACT_APP_BASE_URL + `/branch/${id}/officers-groups`;
    try {
        const res = await axios.put(url, data);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}