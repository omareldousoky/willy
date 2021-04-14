import axios from '../axios-instance';
import { IReviewedDefaultingCustomersReq } from '../../../Components/ManageLegalAffairs/defaultingCustomersList';

export const searchDefaultingCustomers = async (data: object) => {
    const url = process.env.REACT_APP_BASE_URL + '/search/defaulting-customer';
    try {
        const res = await axios.post(url, data);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}

export const addCustomerToDefaultingList =  async (data: {customerId: string; loanId: string}) => {
    const url = process.env.REACT_APP_BASE_URL + '/legal/add-customer';
    try {
        const res = await axios.post(url, data);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}
export const reviewCustomerDefaultedLoan =  async (data: {ids: string[]; notes: string; type: string}) => {
    const url = process.env.REACT_APP_BASE_URL + '/legal/review-customer';
    try {
        const res = await axios.put(url, data);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}
export const deleteCustomerDefaultedLoan =  async (data: {ids: string[]}) => {
    const url = process.env.REACT_APP_BASE_URL + '/legal/delete-customer';
    try {
        const res = await axios.post(url, data);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}

export const fetchReviewedDefaultingCustomers = async (reqBody: IReviewedDefaultingCustomersReq) => {
    const url = process.env.REACT_APP_BASE_URL + '/report/reviewed-defaulting-customers';

    try {
        const res = await axios.post(url, reqBody);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}
