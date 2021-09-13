import { AxiosResponse } from 'axios'
import axios from '../../../../Shared/Services/axiosInstance'
import {
  FalteringPaymentsResponse,
  LaundryReportRequest,
} from '../../../Models/LaundryReports'
import { API_BASE_URL } from '../../../../Shared/envConfig'
import { ApiResponse } from '../../../../Shared/Models/common'

const fetchFalteringPaymentsUrl = `${API_BASE_URL}/report/faltering-payments`

export const fetchFalteringPaymentsReport = async (
  request: LaundryReportRequest
): Promise<ApiResponse<FalteringPaymentsResponse>> => {
  try {
    const res: AxiosResponse<FalteringPaymentsResponse> = await axios.post(
      fetchFalteringPaymentsUrl,
      request
    )
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
