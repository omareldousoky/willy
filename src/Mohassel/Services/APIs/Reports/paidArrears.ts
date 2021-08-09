import { AxiosResponse } from 'axios'
import {
  ApiResponse,
  PaidArrearsRequest,
  PaidArrearsResponse,
} from '../../interfaces'
import axios from '../../../../Shared/Services/axiosInstance'

const { REACT_APP_BASE_URL } = process.env
const fetchPaidArrears = `${REACT_APP_BASE_URL}/report/paid-arrears`

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
