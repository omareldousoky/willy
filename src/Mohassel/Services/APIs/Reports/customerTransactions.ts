import { AxiosResponse } from 'axios'
import {
  ApiResponse,
  CustomerApplicationTransactionsRequest,
  CustomerApplicationTransactionsResponse,
} from '../../interfaces'
import axios from '../../../../Shared/Services/axiosInstance'
import { API_BASE_URL } from '../../../../Shared/envConfig'

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
