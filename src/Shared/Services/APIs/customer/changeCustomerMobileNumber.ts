import { API_BASE_URL } from 'Shared/envConfig'
import axios from '../../axiosInstance'

export const changeCustomerMobilePhoneNumber = async (
  id: string,
  phoneNumber: string
) => {
  const url = API_BASE_URL + `/customer/edit-phonenumber/${id}`
  try {
    const res = await axios.post(url, { phoneNumber })
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
