import axios from '../../../axiosInstance'
import { API_BASE_URL } from '../../../../envConfig'
import { UnpaidInstallmentsByOfficerRequest } from '../../../../Models/operationsReports'

export const unpaidInstallmentsByOfficer = async (
  request: UnpaidInstallmentsByOfficerRequest
) => {
  const url = API_BASE_URL + `/report/unpaid-installments-by-officer`
  try {
    const res = await axios.post(url, request)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
