import axios from '../axios-instance';

export const createCustomer = async (data: object) => {
    const url = 'http://api.dev.halan.io' + `/customer/create`;
    try {
        const res = await axios.post(url, data);
        return { status: "success", body: res.data.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}