import { AxiosResponse } from 'axios'

import axios from '../../../axiosInstance'
import { API_BASE_URL } from '../../../../envConfig'
import { ApiResponse } from '../../../../Models/common'
import {
  OperationsReportRequest,
  MonthComparisonReportResponse,
} from '../../../../Models/operationsReports'

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
