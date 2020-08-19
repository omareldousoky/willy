import axios from '../axios-instance';

export const doubtLoan = async (id: any, obj: any) => {
    const url = process.env.REACT_APP_BASE_URL + `/loan/doubtful/${id}`;
    try {
        const res = await axios.put(url, obj);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}