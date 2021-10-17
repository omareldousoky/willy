import { AxiosResponse } from 'axios'
import axios from '../../../axiosInstance'
import { API_BASE_URL } from '../../../../envConfig'
import { ApiResponse } from '../../../../Models/common'
import {
  PaidArrearsRequest,
  PaidArrearsResponse,
} from '../../../../Models/operationsReports'

const fetchPaidArrears = `${API_BASE_URL}/report/paid-arrears`

export const fetchPaidArrearsReport = async (
  request: PaidArrearsRequest
): Promise<ApiResponse<PaidArrearsResponse>> => {
  try {
    const res: AxiosResponse<PaidArrearsResponse> = await axios.post(
      fetchPaidArrears,
      request
    )
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
