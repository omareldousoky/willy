import { API_BASE_URL } from '../../../envConfig'
import axios from '../../axiosInstance'

const getCustomerByIdUrl = `${API_BASE_URL}/customer/get`
const getCustomerMaxNanoLoanUrl = `${API_BASE_URL}/application/maximum-nano-limit`

export const getCustomerByID = async (customerID: string) => {
  const params = { id: customerID }
  try {
    const res = await axios.get(getCustomerByIdUrl, { params })
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const getCustomerMaxNanoLoan = async () => {
  try {
    const res = await axios.post(getCustomerMaxNanoLoanUrl)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
