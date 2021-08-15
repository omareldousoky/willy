import { API_BASE_URL } from '../../../envConfig'
import axios from '../../axiosInstance'

const searchCustomerUrl = `${API_BASE_URL}/search/customer`
const searchCompanyUrl = `${API_BASE_URL}/search/company`

export const searchCustomer = async (data: object) => {
  try {
    const res = await axios.post(searchCustomerUrl, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const searchCompany = async (data: object) => {
  try {
    const res = await axios.post(searchCompanyUrl, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
