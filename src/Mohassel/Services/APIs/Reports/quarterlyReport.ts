import axios from '../axios-instance'; 
export const quarterlyReport = async (data: object) => {
    const url = process.env.REACT_APP_BASE_URL + '/report/quarterly-report';
    try {
        const res = await axios.post(url, data );
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}

export const postQuarterlyReportExcel = async (obj) => {
    const url = process.env.REACT_APP_BASE_URL + `/report/excel/quarterly-report`;
    try {
        const res = await axios.post(url, obj);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}
export const getQuarterlyReportExcel = async (id) => {
    const url = process.env.REACT_APP_BASE_URL + `/report/excel/quarterly-report/${id}`;
    try {
        const res = await axios.get(url);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}