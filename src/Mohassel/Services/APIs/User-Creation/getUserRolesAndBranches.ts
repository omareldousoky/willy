import axios from '../axios-instance';

export const getUserRolesAndBranches = async () => {
    const urls = [process.env.REACT_APP_BASE_URL + `/user/role`,
                  process.env.REACT_APP_BASE_URL + '/branch'];
    try {
       return await Promise.all( urls.map(async url => {
        const res = await axios.get(url);
        return { status: "success", body: res.data }
        }
        )
       )
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}