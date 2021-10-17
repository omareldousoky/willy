import { AxiosResponse } from 'axios'

import axios from '../../../axiosInstance'
import { API_BASE_URL } from '../../../../envConfig'
import { ApiResponse } from '../../../../Models/common'
import {
  LeakedCustomersReportRequest,
  LeakedCustomersReportResponse,
} from '../../../../Models/operationsReports'

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
