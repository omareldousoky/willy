import axios from '../axios-instance';

export const getGovernorates = async () => {
    const url = process.env.REACT_APP_BASE_URL + '/config/governorates';
    try {
        const res = await axios.get(url);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}
export const getBusinessSectors = async () => {
    const url = process.env.REACT_APP_BASE_URL + '/config/business-sector';
    try {
        const res = await axios.get(url);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}

export const getGeoDivision = async () => {
    const url = process.env.REACT_APP_BASE_URL + '/config/geo-division';
    try {
        const res = await axios.get(url);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}
export const getRejectionReasons = async () => {
    const url = process.env.REACT_APP_BASE_URL + '/config/rejection-reasons';
    try {
        const res = await axios.get(url);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}
export const getSeperationReasons = async () => {
    const url = process.env.REACT_APP_BASE_URL + '/config/separation-reasons';
    try {
        const res = await axios.get(url);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}
export const getMaxPrinciples = async () => {
    const url = process.env.REACT_APP_BASE_URL + '/config/max-principal';
    try {
        const res = await axios.get(url);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}
export const setMaxPrinciples = async (obj) => {
    const url = process.env.REACT_APP_BASE_URL + '/config/max-principal';
    try {
        const res = await axios.post(url,obj);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}