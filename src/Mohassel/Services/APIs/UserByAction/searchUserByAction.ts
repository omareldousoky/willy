///search/user-by-action?size=1000&from=0&serviceKey=halan.com/branch&action=getBranch&branchId=5e79ee0ba92c135c57399330
import axios from '../axios-instance';

export const searchUserByAction = async (obj) => {
    const url = process.env.REACT_APP_BASE_URL + 
    `/search/user-by-action?size=${obj.size}&from=${obj.from}&serviceKey=${obj.serviceKey}&action=${obj.action}`;
    try {
        const res = await axios.get(url);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}