import { AxiosResponse } from 'axios'
import {
  ApiResponse,
  OperationsReportRequest,
  LoansBriefingReportResponse,
} from '../../interfaces'
import axios from '../../../../Shared/Services/axiosInstance'
import { API_BASE_URL } from '../../../../Shared/envConfig'

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
