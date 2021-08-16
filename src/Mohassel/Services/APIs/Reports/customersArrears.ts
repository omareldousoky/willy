import { AxiosResponse } from 'axios'
import {
  ApiResponse,
  CustomersArrearsRequest,
  CustomersArrearsResponse,
} from '../../interfaces'
import axios from '../../../../Shared/Services/axiosInstance'
import { API_BASE_URL } from '../../../../Shared/envConfig'

const fetchCustomersArrears = `${API_BASE_URL}/report/customers-arrears`

export const fetchCustomersArrearsReport = async (
  request: CustomersArrearsRequest
): Promise<ApiResponse<CustomersArrearsResponse>> => {
  try {
    const res: AxiosResponse<CustomersArrearsResponse> = await axios.post(
      fetchCustomersArrears,
      request
    )
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
