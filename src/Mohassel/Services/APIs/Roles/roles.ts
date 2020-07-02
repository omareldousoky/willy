import axios from '../axios-instance';

export const getPermissions = async (id: string) => {
    const url = process.env.REACT_APP_BASE_URL + `/user/role/actions?id=${id}`;
    try {
        const res = await axios.get(url);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}
export const getRoles = async () => {
    const url = process.env.REACT_APP_BASE_URL + `/user/role`;
    try {
        const res = await axios.get(url);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}

export const createRole = async (data: object) => {
    const url = process.env.REACT_APP_BASE_URL + `/user/role`;
    try {
        const res = await axios.post(url, data);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}

export const editRole = async (data: object) => {
    const url = process.env.REACT_APP_BASE_URL + `/user/role/permissions`;
    try {
        const res = await axios.post(url, data);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}

export const getUserCountPerRole = async (id: string) => {
    const url = process.env.REACT_APP_BASE_URL + `/user/role/count?id=${id}`;
    try {
        const res = await axios.get(url);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}