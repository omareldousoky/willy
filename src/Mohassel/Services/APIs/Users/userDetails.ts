import axios from '../axios-instance';

export const getUserDetails = async (id: string) => {
    const url = process.env.REACT_APP_BASE_URL +`/user?id=${id}`;
    try {
         const res = await axios.get(url);
         return {status: "success", body: res.data}
        
    } catch (error) {
        return{status: "error", error: error.response.data}
    }
}