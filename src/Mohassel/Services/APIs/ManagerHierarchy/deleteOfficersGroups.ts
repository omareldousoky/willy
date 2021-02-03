import axios from '../axios-instance';

export const deleteOfficersGroups = async (data: object,id: string) => {
    const url = process.env.REACT_APP_BASE_URL + `/branch/${id}/officers-group`;
    try {
        const res = await axios.delete(url, {data});
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}