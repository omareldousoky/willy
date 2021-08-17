import { API_BASE_URL } from '../../../../Shared/envConfig'
import axios from '../../../../Shared/Services/axiosInstance'

export const getCustomerDetails = async (customerKey: string) => {
  const url = API_BASE_URL + `/report/customer-details`
  try {
    const res = await axios.post(url, { customerKey })
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
