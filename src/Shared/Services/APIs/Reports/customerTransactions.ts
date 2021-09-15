import { AxiosResponse } from 'axios'
import axios from '../../axiosInstance'
import { API_BASE_URL } from '../../../envConfig'
import {
  CustomerApplicationTransactionsRequest,
  CustomerApplicationTransactionsResponse,
} from '../../interfaces'
import { ApiResponse } from '../../../Models/common'

const getCustomerTransactionsURL = `${API_BASE_URL}/report/loan-transactions`

export const getCustomerTransactions = async (
  request: CustomerApplicationTransactionsRequest
): Promise<ApiResponse<CustomerApplicationTransactionsResponse>> => {
  try {
    const res: AxiosResponse<CustomerApplicationTransactionsResponse> = await axios.post(
      getCustomerTransactionsURL,
      request
    )
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
