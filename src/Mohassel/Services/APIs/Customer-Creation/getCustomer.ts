import axios from '../axios-instance';

export const searchCustomerByName = async (searchKey: string) => {
    const url = process.env.REACT_APP_BASE_URL + `/customer/getByName?name=${searchKey}`;
    try {
        const res = await axios.get(url);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}
export const getCustomerByID = async (customerID: string) => {
    const url = process.env.REACT_APP_BASE_URL + `/customer/get?id=${customerID}`;
    try {
        const res = await axios.get(url);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}