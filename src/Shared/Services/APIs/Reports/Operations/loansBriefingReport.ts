import { AxiosResponse } from 'axios'
import axios from '../../../axiosInstance'
import { API_BASE_URL } from '../../../../envConfig'
import { ApiResponse } from '../../../../Models/common'
import {
  LoansBriefingReportResponse,
  OperationsReportRequest,
} from '../../../../Models/operationsReports'

const fetchLoansBriefingReportUrl = `${API_BASE_URL}/report/loans-briefing-report`

export const fetchLoansBriefingReport = async (
  request: OperationsReportRequest
): Promise<ApiResponse<LoansBriefingReportResponse>> => {
  try {
    const res: AxiosResponse<LoansBriefingReportResponse> = await axios.post(
      fetchLoansBriefingReportUrl,
      request
    )
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
