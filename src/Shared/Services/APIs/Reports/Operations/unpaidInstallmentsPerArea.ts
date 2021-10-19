import { AxiosResponse } from 'axios'
import axios from '../../../axiosInstance'
import { API_BASE_URL } from '../../../../envConfig'
import { ApiResponse } from '../../../../Models/common'
import { UnpaidInstallmentsPerAreaRequest } from '../../../../Models/operationsReports'

const fetchUnpaidInstallmentsPerAreaUrl = `${API_BASE_URL}/report/unpaid-installments-per-area`

interface CustomersResponse {
  address: string
  amountDue: number
  customerName: string
  installmentAmount: number
  installmentSerial: string
  installmentStatus: string
  phone: string
  representativeName: string
  truthDate: string
}

interface AreaResponse {
  amount: number
  count: number
  name: string
  customers: Array<CustomersResponse>
}
interface BranchResponse {
  amount: number
  count: number
  name: string
  areas: Array<AreaResponse>
}

export interface UnpaidInstallmentsPerAreaResponse {
  branches: Array<BranchResponse>
  amount: number
  count: number
}

export const fetchUnpaidInstallmentsPerAreaReport = async (
  request: UnpaidInstallmentsPerAreaRequest
): Promise<ApiResponse<UnpaidInstallmentsPerAreaResponse>> => {
  try {
    const res: AxiosResponse<UnpaidInstallmentsPerAreaResponse> = await axios.post(
      fetchUnpaidInstallmentsPerAreaUrl,
      request
    )
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
