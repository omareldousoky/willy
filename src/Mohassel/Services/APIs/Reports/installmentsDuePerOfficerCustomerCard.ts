import { InstallmentsDuePerOfficerCustomerCardRequest } from '../../interfaces'
import axios from '../../../../Shared/Services/axiosInstance'

export const installmentsDuePerOfficerCustomerCard = async (
  request: InstallmentsDuePerOfficerCustomerCardRequest
) => {
  const url =
    process.env.REACT_APP_BASE_URL +
    `/report/installments-due-per-officer-customer-card`
  try {
    const res = await axios.post(url, request)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
