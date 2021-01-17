import axios from '../axios-instance';

export const getDeathCertificate = async (customerId: string) => {
    const url = process.env.REACT_APP_BASE_URL + `/customer/death-certificate?id=${customerId}`;
    try {
        const res = await axios.get(url);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}