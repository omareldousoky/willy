import axios from '../../axios-instance';

export const checkNationalIdDuplicates = async (startTime, driverId) => {
    const url = localStorage.getItem("baseURL") + `/admin/getDriverShifts?startTime=${startTime}&driverId=${driverId}`;
    try {
        const res = await axios.get(url);
        return { status: "success", body: res.data.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}