import axios from '../axios-instance';

export const getGeoAreas = async () => {
    const url = process.env.REACT_APP_BASE_URL + '/config/geo-areas';
    try {
        const res = await axios.get(url);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}
export const getGeoAreasByBranch = async (id: string) => {
    const url = process.env.REACT_APP_BASE_URL + `/config/geo-areas/${id}`;
    try {
        const res = await axios.get(url);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}