import { AxiosResponse } from 'axios'
import axios from '../../../axiosInstance'
import { API_BASE_URL } from '../../../../envConfig'
import { ApiResponse } from '../../../../Models/common'
import {
  OfficersPercentPaymentRequest,
  OfficersBranchPercentPaymentRequest,
  OfficerBranchPercentPaymentResponse,
  OfficerPercentPaymentResponse,
} from '../../../../Models/operationsReports'

const fetchOfficerPercentPaymentUrl = `${API_BASE_URL}/report/officer-percent-payment`
const fetchOfficerBranchPercentPaymentUrl = `${API_BASE_URL}/report/officer-branch-percent-payment`

export const fetchOfficersPercentPaymentReport = async (
  request: OfficersPercentPaymentRequest
): Promise<ApiResponse<OfficerPercentPaymentResponse>> => {
  try {
    const res: AxiosResponse<OfficerPercentPaymentResponse> = await axios.post(
      fetchOfficerPercentPaymentUrl,
      request
    )
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const fetchOfficersBranchPercentPaymentReport = async (
  request: OfficersBranchPercentPaymentRequest
): Promise<ApiResponse<OfficerBranchPercentPaymentResponse>> => {
  try {
    const res: AxiosResponse<OfficerBranchPercentPaymentResponse> = await axios.post(
      fetchOfficerBranchPercentPaymentUrl,
      request
    )
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
