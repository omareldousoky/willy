import { CompanyOtpCustomersProps } from 'Shared/Models/Customer'
import { API_BASE_URL } from '../../../envConfig'
import axios from '../../axiosInstance'

export const addOtpCustomers = async (data: CompanyOtpCustomersProps) => {
  const url = API_BASE_URL + `/customer/add-otp-customer`
  try {
    const res = await axios.post(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
