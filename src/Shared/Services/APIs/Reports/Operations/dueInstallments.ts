import { AxiosResponse } from 'axios'

import axios from '../../../axiosInstance'
import { API_BASE_URL } from '../../../../envConfig'
import { ApiResponse } from '../../../../Models/common'
import {
  DueInstallmentsResponse,
  OperationsReportRequest,
} from '../../../../Models/operationsReports'

const fetchDueInstallments = `${API_BASE_URL}/report/due-installments`

export const fetchDueInstallmentsReport = async (
  request: OperationsReportRequest
): Promise<ApiResponse<DueInstallmentsResponse>> => {
  try {
    const res: AxiosResponse<DueInstallmentsResponse> = await axios.post(
      fetchDueInstallments,
      request
    )
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
