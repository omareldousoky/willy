import { AxiosResponse } from 'axios'
import {
  ApiResponse,
  DueInstallmentsResponse,
  OperationsReportRequest,
} from '../../interfaces'
import axios from '../../../../Shared/Services/axiosInstance'
import { API_BASE_URL } from '../../../../Shared/envConfig'

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
