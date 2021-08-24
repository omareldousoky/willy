import { AxiosResponse } from 'axios'
import {
  ApiResponse,
  LeakedCustomersReportRequest,
  LeakedCustomersReportResponse,
} from '../../interfaces'
import axios from '../../../../Shared/Services/axiosInstance'
import { API_BASE_URL } from '../../../../Shared/envConfig'

const fetchLeakedCustomersURL = `${API_BASE_URL}/report/churned-customers`

export const fetchLeakedCustomersReport = async (
  request: LeakedCustomersReportRequest
): Promise<ApiResponse<LeakedCustomersReportResponse>> => {
  try {
    const res: AxiosResponse<LeakedCustomersReportResponse> = await axios.post(
      fetchLeakedCustomersURL,
      request
    )
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
