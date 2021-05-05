import axios from '../axios-instance';

import { DefaultedCustomer } from '../../../Components/ManageLegalAffairs/defaultingCustomersList';
import { LegalActionsForm, ReviewReqBody } from '../../../Components/ManageLegalAffairs/types';

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

export const searchLegalAffairsCustomers = async (data: object) => {
    const url = process.env.REACT_APP_BASE_URL + '/search/legal-affairs';
    try {
        const res = await axios.post(url, data);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}

export const updateLegalAffairsCustomers = async (
  data: LegalActionsForm & DefaultedCustomer
) => {
  const url = process.env.REACT_APP_BASE_URL + '/legal/update-customer'
  try {
    const res = await axios.put(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
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

export const settleLegalCustomer = async (reqBody: FormData, id: string) => {
    const url = process.env.REACT_APP_BASE_URL + `/legal/update-settlement/${id}`;
    
    try {
        const res = await axios.put(url, reqBody);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}

export const getSettlementFees = async (customerId: string) => {
    const url = process.env.REACT_APP_BASE_URL + `/legal/settlement-info/${customerId}`;
    
    try {
        const res = await axios.get(url);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}

export const reviewLegalCustomer = async (reqBody: ReviewReqBody) => {
    const url = process.env.REACT_APP_BASE_URL + `/legal/review-settlement`;
    
    try {
        const res = await axios.put(url, reqBody);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}

export const uploadDefaultingCustomer = async (reqBody: FormData) => {
    const url =
      process.env.REACT_APP_BASE_URL +
      '/legal/upload-defaulting-customers-document'
  
    try {
      const res = await axios.post(url, reqBody)
      return { status: 'success', body: res.data }
    } catch (error) {
      return { status: 'error', error: error.response.data }
    }
  }
  