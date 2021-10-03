import { AxiosResponse } from 'axios'
import axios from '../../../axiosInstance'
import { API_BASE_URL } from '../../../../envConfig'
import { ApiResponse } from '../../../../Models/common'
import {
  CustomersArrearsRequest,
  CustomersArrearsResponse,
} from '../../../../Models/operationsReports'

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
