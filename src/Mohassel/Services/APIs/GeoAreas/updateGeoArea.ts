import axios from '../axios-instance';

export const updateGeoArea = async (id: string, obj: any) => {
    const url = process.env.REACT_APP_BASE_URL + `/config/geo-areas/${id}`;
    try {
        const res = await axios.put(url, obj);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}