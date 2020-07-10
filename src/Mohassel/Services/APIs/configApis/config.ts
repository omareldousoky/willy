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