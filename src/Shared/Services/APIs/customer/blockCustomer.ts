import { API_BASE_URL } from '../../../envConfig'
import axios from '../../axiosInstance'

export const blockCustomer = async (id: string, data: object) => {
  const url = API_BASE_URL + `/customer/block/${id}`
  try {
    const res = await axios.post(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
