import { UnpaidInstallmentsByOfficerRequest } from '../../interfaces'
import axios from '../../../../Shared/Services/axiosInstance'
import { API_BASE_URL } from '../../../../Shared/envConfig'

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
