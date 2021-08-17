import { AxiosResponse } from 'axios'
import {
  ApiResponse,
  MonthComparisonReportResponse,
  OperationsReportRequest,
} from '../../interfaces'
import axios from '../../../../Shared/Services/axiosInstance'
import { API_BASE_URL } from '../../../../Shared/envConfig'

const fetchMonthComparison = `${API_BASE_URL}/report/month-comparison`

export const fetchMonthComparisonReport = async (
  request: OperationsReportRequest
): Promise<ApiResponse<MonthComparisonReportResponse>> => {
  try {
    const res: AxiosResponse<MonthComparisonReportResponse> = await axios.post(
      fetchMonthComparison,
      request
    )
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
