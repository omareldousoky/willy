import { AxiosResponse } from 'axios'
import {
  ApiResponse,
  PaidArrearsRequest,
  PaidArrearsResponse,
} from '../../interfaces'
import axios from '../../../../Shared/Services/axiosInstance'
import { API_BASE_URL } from '../../../../Shared/envConfig'

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
