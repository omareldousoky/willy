import axios from '../../../axiosInstance'
import { API_BASE_URL } from '../../../../envConfig'
import { InstallmentsDuePerOfficerCustomerCardRequest } from '../../../../Models/operationsReports'

export const installmentsDuePerOfficerCustomerCard = async (
  request: InstallmentsDuePerOfficerCustomerCardRequest
) => {
  const url =
    API_BASE_URL + `/report/installments-due-per-officer-customer-card`
  try {
    const res = await axios.post(url, request)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
