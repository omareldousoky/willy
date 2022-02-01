import { AxiosResponse } from 'axios'
import axios from '../../axiosInstance'
import {
  FalteringPaymentsResponse,
  LaundryReportRequest,
} from '../../../Models/LaundryReports'
import { API_BASE_URL } from '../../../envConfig'
import { ApiResponse } from '../../../Models/common'

const fetchEarlyPaymentsUrl = `${API_BASE_URL}/report/early-payments`
const fetchEarlyPayments4MonthsUrl = `${API_BASE_URL}/report/early-payments-4-months`

export const fetchEarlyPaymentsReport = async (
  request: LaundryReportRequest,
  is4Months?: boolean
): Promise<ApiResponse<FalteringPaymentsResponse>> => {
  try {
    const res: AxiosResponse<FalteringPaymentsResponse> = await axios.post(
      is4Months ? fetchEarlyPayments4MonthsUrl : fetchEarlyPaymentsUrl,
      request
    )
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
