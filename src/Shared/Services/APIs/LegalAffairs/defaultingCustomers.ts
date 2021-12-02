import { AxiosResponse } from 'axios'
import axios from '../../axiosInstance'
import {
  ReviewedDefaultingCustomersReq,
  DefaultedCustomer,
} from '../../../../Mohassel/Components/ManageLegalAffairs/defaultingCustomersList'

import {
  LegalActionsForm,
  ReviewReqBody,
} from '../../../../Mohassel/Components/ManageLegalAffairs/types'
import { LegalHistoryResponse } from '../../../Models/LegalAffairs'
import { API_BASE_URL } from '../../../envConfig'
import { ApiResponse } from '../../../Models/common'

export const searchDefaultingCustomers = async (data: object) => {
  const url = API_BASE_URL + '/search/defaulting-customer'
  try {
    const res = await axios.post(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const searchLegalAffairsCustomers = async (data: object) => {
  const url = API_BASE_URL + '/search/legal-affairs'
  try {
    const res = await axios.post(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const updateLegalAffairsCustomers = async (
  data: LegalActionsForm & DefaultedCustomer
) => {
  const url = API_BASE_URL + '/legal/update-customer'
  try {
    const res = await axios.put(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const addCustomerToDefaultingList = async (data: {
  customerId: string
  loanId: string
}) => {
  const url = API_BASE_URL + '/legal/add-customer'
  try {
    const res = await axios.post(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const reviewCustomerDefaultedLoan = async (data: {
  ids: string[]
  notes: string
  type: string
}) => {
  const url = API_BASE_URL + '/legal/review-customer'
  try {
    const res = await axios.put(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const deleteCustomerDefaultedLoan = async (data: { ids: string[] }) => {
  const url = API_BASE_URL + '/legal/delete-customer'
  try {
    const res = await axios.post(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const fetchReviewedDefaultingCustomers = async (
  reqBody: ReviewedDefaultingCustomersReq
) => {
  const url = API_BASE_URL + '/report/reviewed-defaulting-customers'

  try {
    const res = await axios.post(url, reqBody)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const settleLegalCustomer = async (reqBody: FormData, id: string) => {
  const url = API_BASE_URL + `/legal/update-settlement/${id}`

  try {
    const res = await axios.put(url, reqBody)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const getSettlementFees = async (customerId: string) => {
  const url = API_BASE_URL + `/legal/settlement-info/${customerId}`

  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const reviewLegalCustomer = async (reqBody: ReviewReqBody) => {
  const url = API_BASE_URL + `/legal/review-settlement`

  try {
    const res = await axios.put(url, reqBody)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const uploadDefaultingCustomer = async (reqBody: FormData) => {
  const url = API_BASE_URL + '/legal/upload-defaulting-customers-document'

  try {
    const res = await axios.post(url, reqBody)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const deleteSettlementDocument = async (
  customerId: string,
  type: string
) => {
  const url = API_BASE_URL + '/legal/delete-settlement-document'

  try {
    const res = await axios.delete(url, {
      data: {
        id: customerId,
        type,
      },
    })
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const getLegalHistory = async (
  legalId: string
): Promise<ApiResponse<LegalHistoryResponse>> => {
  const url = API_BASE_URL + `/legal/history/${legalId}`
  try {
    const res: AxiosResponse<LegalHistoryResponse> = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const getSettlementExtraDetails = async (loanId: string) => {
  const url = API_BASE_URL + `/legal/settlement-calculations/${loanId}`
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
